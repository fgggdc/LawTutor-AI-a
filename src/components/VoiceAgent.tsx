import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RefreshCw, 
  Scale, 
  BookOpen, 
  Gavel, 
  Zap, 
  Award, 
  Globe, 
  Download, 
  Copy, 
  Check, 
  Radio, 
  Sliders, 
  Play, 
  Square,
  Bot,
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { LawSubjectId, PDFDocumentItem } from '../types';
import { LAW_SUBJECTS } from '../data/lawData';
import { playPcmAudio, stopCurrentAudio, speakTextWithBrowser, pcmBase64ToWavBlob, StreamingSpeechQueue, prewarmSpeechEngine, pcmToBase64, playLiveAudioChunk, stopLiveAudio } from '../lib/audioUtils';
import { AudioVisualizer, VisualizerMode } from './AudioVisualizer';
import { FileText } from 'lucide-react';

interface VoiceAgentProps {
  selectedSubject: LawSubjectId;
  setSelectedSubject: (s: LawSubjectId) => void;
  onOpenPDFViewer?: (doc: PDFDocumentItem) => void;
}

export type TeacherPersona = 'lecture' | 'viva' | 'moot' | 'flash';

interface SpokenExchange {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  timestamp: number;
  mode: TeacherPersona;
  language: 'bn' | 'en';
  audioBase64?: string;
  subjectId?: LawSubjectId;
}

const QUICK_VOICE_PROMPTS_BN = [
  { label: 'হত্যা বনাম নরহত্যা (ধারা ২৯৯ ও ৩০০)', query: 'দণ্ডবিধির ধারা ২৯৯ ও ৩০০ এর মধ্যে পার্থক্য ও আবশ্যকীয় উপাদানসমূহ বুঝিয়ে দিন।' },
  { label: 'জামিনের মূল নীতিমালা (CrPC ৪৯৬, ৪৯৭)', query: 'ফৌজদারি কার্যবিধির ৪৯৬ ও ৪৯৭ ধারা অনুযায়ী জামিনযোগ্য ও জামিন-অযোগ্য অপরাধে জামিনের শর্তাবলী কী?' },
  { label: 'রেস জুডিকেটা ও রেস সাবজুডিস (CPC ১০, ১১)', query: 'দেওয়ানি কার্যবিধির ১০ ধারা ও ১১ ধারার নীতি কীভাবে প্রয়োগ হয়?' },
  { label: 'মৃত্যুকালীন ঘোষণা (Evidence Act ৩২(১))', query: 'সাক্ষ্য আইনের ৩২(১) ধারা অনুসারে মৃত্যুকালীন ঘোষণার সাক্ষ্যমূল্য কতটুকু?' },
  { label: 'তামাদি মওকুফ (Limitation Act ৫)', query: 'তামাদি আইনের ৫ ধারা কি সকল ক্ষেত্রে প্রযোজ্য? এর শর্তসমূহ কী কী?' },
  { label: 'স্থাবর সম্পত্তি বায়না চুক্তি (SR Act ১২)', query: 'সুনির্দিষ্ট প্রতিকার আইনের ১২ ধারা অনুযায়ী চুক্তি বলবতের ডিক্রি পাওয়ার নিয়ম কী?' },
];

const QUICK_VOICE_PROMPTS_EN = [
  { label: 'Culpable Homicide vs Murder', query: 'Explain the distinction between Section 299 and 300 of the Penal Code with landmark case laws.' },
  { label: 'Bail Jurisprudence (CrPC 496 & 497)', query: 'What are the statutory guidelines for grant of bail under Section 496 and 497 of CrPC?' },
  { label: 'Doctrine of Res Judicata (CPC Sec 11)', query: 'What are the essential conditions for the application of Res Judicata under Section 11 of CPC?' },
  { label: 'Dying Declaration (Evidence Sec 32(1))', query: 'What is the evidentiary value of a Dying Declaration under Section 32(1) of the Evidence Act?' },
  { label: 'Condonation of Delay (Limitation Sec 5)', query: 'Explain sufficient cause for condonation of delay under Section 5 of the Limitation Act.' },
];

export const VoiceAgent: React.FC<VoiceAgentProps> = ({
  selectedSubject,
  setSelectedSubject,
  onOpenPDFViewer
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [voiceMode, setVoiceMode] = useState<TeacherPersona>('lecture');
  const [visualizerType, setVisualizerType] = useState<VisualizerMode>('orb');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [currentSpokenText, setCurrentSpokenText] = useState<string>('');
  const [exchanges, setExchanges] = useState<SpokenExchange[]>([
    {
      id: 'init-1',
      sender: 'teacher',
      text: 'আসসালামু আলাইকুম! আমি আপনার আইন ডিজিটাল শিক্ষক (AI Voice Teacher - ২০২৬ সংস্করণ)। যেকোনো আইন, ধারা, নজির বা ভাইভার প্রশ্ন সরাসরি মুখে বলুন—আমি সাথে সাথে উত্তর বুঝিয়ে দিচ্ছি।',
      timestamp: Date.now(),
      mode: 'lecture',
      language: 'bn',
      subjectId: 'all'
    }
  ]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [autoSilenceAnswer, setAutoSilenceAnswer] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Refs for audio and recognition
  const recognitionRef = useRef<any>(null);
  const spokenTextRef = useRef<string>('');
  const silenceTimerRef = useRef<any>(null);
  const speechQueueRef = useRef<StreamingSpeechQueue | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const languageRef = useRef<'bn' | 'en'>('bn');
  const autoSilenceAnswerRef = useRef<boolean>(true);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    autoSilenceAnswerRef.current = autoSilenceAnswer;
  }, [autoSilenceAnswer]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  // Pre-warm speech engines
  useEffect(() => {
    prewarmSpeechEngine();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = (finalTranscript || interimTranscript).trim();
        spokenTextRef.current = text;
        if (text) {
          // Interrupt / Barge-in: If user speaks while AI was speaking, immediately stop AI speech
          if (isSpeaking) {
            stopCurrentAudio();
            if (speechQueueRef.current) {
              speechQueueRef.current.stop();
              speechQueueRef.current = null;
            }
            setIsSpeaking(false);
          }

          setCurrentSpokenText(text);

          // Fast Auto-silence trigger: 280ms of silence automatically submits the voice query
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          if (autoSilenceAnswerRef.current && text.length >= 2) {
            silenceTimerRef.current = setTimeout(() => {
              triggerAutoSubmit(spokenTextRef.current);
            }, 280);
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition warning:', e.error);
        if (e.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      stopCurrentAudio();
      if (speechQueueRef.current) {
        speechQueueRef.current.stop();
      }
    };
  }, [language, isSpeaking]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [exchanges, currentSpokenText]);

  const toggleLanguage = (newLang: 'bn' | 'en') => {
    if (language === newLang) return;
    setLanguage(newLang);
    languageRef.current = newLang;
    stopCurrentAudio();
    if (speechQueueRef.current) {
      speechQueueRef.current.stop();
      speechQueueRef.current = null;
    }
    setIsSpeaking(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    const greetingText = newLang === 'en'
      ? "Welcome! I am your AI Digital Law Teacher (2026 Edition). Speak or ask any legal question, statutory section, or case law—I will explain instantly."
      : "স্বাগতম! আমি আপনার আইন ডিজিটাল শিক্ষক (২০২৬ মডেল)। যেকোনো আইন বা ধারা সম্পর্কে প্রশ্ন করুন—আমি তাৎক্ষণিক মুখে বুঝিয়ে দিচ্ছি।";

    setExchanges(prev => [
      ...prev,
      {
        id: `lang-change-${Date.now()}`,
        sender: 'teacher',
        text: greetingText,
        timestamp: Date.now(),
        mode: voiceMode,
        language: newLang,
        subjectId: selectedSubject
      }
    ]);
  };

  const triggerAutoSubmit = (textToSend: string) => {
    if (!textToSend || textToSend.trim().length < 2 || isProcessingRef.current) return;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    processStudentQuestion(textToSend);
  };

  const liveWsRef = useRef<WebSocket | null>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);
  const liveProcessorRef = useRef<any>(null);
  const liveInputCtxRef = useRef<any>(null);

  // Start Mic & Live API session
  const handleStartListening = async () => {
    prewarmSpeechEngine();
    stopCurrentAudio();
    try { stopLiveAudio(); } catch(e) {}
    if (speechQueueRef.current) {
      speechQueueRef.current.stop();
      speechQueueRef.current = null;
    }
    setIsSpeaking(false);
    setCurrentSpokenText('');
    spokenTextRef.current = '';

    try {
      const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${location.host}/live?language=${language}&mode=${voiceMode}&subjectId=${selectedSubject}`;
      const ws = new WebSocket(wsUrl);
      liveWsRef.current = ws;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputAudioCtx = new AudioCtx({ sampleRate: 16000 });
      liveInputCtxRef.current = inputAudioCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      } });
      liveStreamRef.current = stream;

      const source = inputAudioCtx.createMediaStreamSource(stream);
      const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
      liveProcessorRef.current = processor;
      
      source.connect(processor);
      processor.connect(inputAudioCtx.destination);
      
      processor.onaudioprocess = (e) => {
        const pcmData = e.inputBuffer.getChannelData(0);
        // We need pcmToBase64 from audioUtils
        const base64 = pcmToBase64(pcmData);
        if (base64 && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ audio: base64 }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio && playLiveAudioChunk) {
            playLiveAudioChunk(msg.audio);
            setIsSpeaking(true);
          }
          if (msg.interrupted) {
            if (stopLiveAudio) stopLiveAudio();
            setIsSpeaking(false);
          }
        } catch(e){}
      };

      ws.onclose = () => {
        setIsListening(false);
        handleStopListening();
      };

      setIsListening(true);
    } catch (err) {
      console.error('Live session start failed:', err);
      setIsListening(false);
    }
  };

  // Stop Mic manually
  const handleStopListening = () => {
    if (liveProcessorRef.current) {
      liveProcessorRef.current.disconnect();
      liveProcessorRef.current = null;
    }
    if (liveInputCtxRef.current) {
      liveInputCtxRef.current.close();
      liveInputCtxRef.current = null;
    }
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach((track: any) => track.stop());
      liveStreamRef.current = null;
    }
    if (liveWsRef.current) {
      liveWsRef.current.close();
      liveWsRef.current = null;
    }
    if (stopLiveAudio) stopLiveAudio();
    setIsListening(false);
    setIsSpeaking(false);
  };

  // Process Student Question through Zero-Latency 2026 Streaming Pipeline
  const processStudentQuestion = async (queryText: string) => {
    if (!queryText.trim()) return;

    stopCurrentAudio();
    if (speechQueueRef.current) {
      speechQueueRef.current.stop();
      speechQueueRef.current = null;
    }
    setIsSpeaking(false);
    setCurrentSpokenText('');
    spokenTextRef.current = '';

    const currentLang = languageRef.current;
    const studentEx: SpokenExchange = {
      id: `std-${Date.now()}`,
      sender: 'student',
      text: queryText,
      timestamp: Date.now(),
      mode: voiceMode,
      language: currentLang,
      subjectId: selectedSubject
    };

    const teacherExId = `tch-${Date.now()}`;
    const initialTeacherEx: SpokenExchange = {
      id: teacherExId,
      sender: 'teacher',
      text: '',
      timestamp: Date.now(),
      mode: voiceMode,
      language: currentLang,
      subjectId: selectedSubject
    };

    setExchanges(prev => [...prev, studentEx, initialTeacherEx]);
    setIsProcessing(true);

    const onAudioFinished = () => {
      setIsSpeaking(false);
      // If Hands-free mode is active, auto listen again!
      if (autoSilenceAnswerRef.current) {
        setTimeout(() => {
          handleStartListening();
        }, 400);
      }
    };

    try {
      const response = await fetch('/api/gemini/stream-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          subjectId: selectedSubject,
          mode: voiceMode,
          language: currentLang,
          history: exchanges.slice(-4).map(e => ({
            role: e.sender === 'student' ? 'user' : 'model',
            text: e.text
          }))
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream request failed');
      }

      setIsProcessing(false);
      setIsSpeaking(true);

      const queue = new StreamingSpeechQueue(currentLang, playbackSpeed, onAudioFinished);
      speechQueueRef.current = queue;

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataContent = line.slice(6).trim();
            if (dataContent === '[DONE]') {
              continue;
            }
            try {
              const parsed = JSON.parse(dataContent);
              if (parsed.delta) {
                accumulatedText += parsed.delta;
                queue.feed(parsed.delta);

                setExchanges(prev =>
                  prev.map(item =>
                    item.id === teacherExId
                      ? { ...item, text: accumulatedText }
                      : item
                  )
                );
              }
            } catch {}
          }
        }
      }

      queue.end();
    } catch (err) {
      console.warn('Streaming voice failed, using fast fallback:', err);
      try {
        const fbRes = await fetch('/api/gemini/fast-voice-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: queryText,
            subjectId: selectedSubject,
            mode: voiceMode,
            language: currentLang,
            history: exchanges.slice(-4).map(e => ({
              role: e.sender === 'student' ? 'user' : 'model',
              text: e.text
            }))
          }),
        });
        const fbData = await fbRes.json();
        const fallbackText =
          fbData.reply ||
          (currentLang === 'en'
            ? 'I have noted your question. Let us examine the statutory provisions and legal principles.'
            : 'আমি তোমার প্রশ্নটি পেয়েছি। আইন অনুযায়ী বিষয়টি পর্যালোচনা করছি।');

        setExchanges(prev =>
          prev.map(item =>
            item.id === teacherExId
              ? { ...item, text: fallbackText, audioBase64: fbData.audioBase64 || undefined }
              : item
          )
        );
        setIsProcessing(false);
        setIsSpeaking(true);

        if (fbData.audioBase64) {
          try {
            await playPcmAudio(fbData.audioBase64, fbData.sampleRate || 24000, playbackSpeed);
            onAudioFinished();
          } catch {
            speakTextWithBrowser(fallbackText, onAudioFinished, playbackSpeed, currentLang);
          }
        } else {
          speakTextWithBrowser(fallbackText, onAudioFinished, playbackSpeed, currentLang);
        }
      } catch (finalErr) {
        console.error('Final voice fallback error:', finalErr);
        setIsProcessing(false);
        setIsSpeaking(false);
      }
    }
  };

  const handleReplay = (text: string, audioBase64?: string, lang: 'bn' | 'en' = 'bn') => {
    stopCurrentAudio();
    if (speechQueueRef.current) {
      speechQueueRef.current.stop();
      speechQueueRef.current = null;
    }
    setIsSpeaking(true);

    const onEnd = () => setIsSpeaking(false);

    if (audioBase64) {
      playPcmAudio(audioBase64, 24000, playbackSpeed)
        .then(onEnd)
        .catch(() => speakTextWithBrowser(text, onEnd, playbackSpeed, lang));
    } else {
      speakTextWithBrowser(text, onEnd, playbackSpeed, lang);
    }
  };

  const handleDownloadAudio = (base64Data: string, filename: string) => {
    const blob = pcmBase64ToWavBlob(base64Data, 24000);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি কথপোকথন মুছে নতুন সেশন শুরু করতে চান?' : 'Are you sure you want to clear the conversation and start a new session?')) {
      stopCurrentAudio();
      if (speechQueueRef.current) {
        speechQueueRef.current.stop();
        speechQueueRef.current = null;
      }
      setIsSpeaking(false);
      setExchanges([
        {
          id: `init-reset-${Date.now()}`,
          sender: 'teacher',
          text: language === 'en'
            ? "New session started. Ready for your next legal question!"
            : "নতুন সেশন শুরু হয়েছে। আপনার পরবর্তী আইনি প্রশ্নটি বলুন!",
          timestamp: Date.now(),
          mode: voiceMode,
          language,
          subjectId: selectedSubject
        }
      ]);
    }
  };

  const currentSubjectObj = LAW_SUBJECTS.find(s => s.id === selectedSubject);
  const activePrompts = language === 'bn' ? QUICK_VOICE_PROMPTS_BN : QUICK_VOICE_PROMPTS_EN;

  return (
    <div className="flex-1 overflow-y-auto w-full h-full relative">
      <div className="flex flex-col max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      {/* 2026 Top Hero Bar */}
      <div className="bg-stone-900/95 border border-stone-800 rounded-2xl p-3 sm:p-4 mb-3 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Title & Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-600/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-1.5">
                  আইন ডিজিটাল শিক্ষক
                  <span className="text-xs font-normal text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full font-mono">
                    ২০২৬ মডেল (Gemini 2026)
                  </span>
                </h1>
              </div>
              <p className="text-xs text-stone-400">
                রিয়েল-টাইম বাংলা ও ইংরেজি লাইভ ভয়েস কথোপকথন • ধারা, নজির ও ভাইভা বিশ্লেষণ
              </p>
            </div>
          </div>

          {/* Controls: Persona, Subject & Language */}
          <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto justify-between sm:justify-start">
            {/* Persona Selector */}
            <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-1 text-xs overflow-x-auto ">
              <button
                onClick={() => setVoiceMode('lecture')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  voiceMode === 'lecture'
                    ? 'bg-amber-600 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="বিজ্ঞ আইন অধ্যাপক লেকচার মোড"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="inline">অধ্যাপক</span>
              </button>

              <button
                onClick={() => setVoiceMode('viva')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  voiceMode === 'viva'
                    ? 'bg-amber-600 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="বার কাউন্সিল ও জুডিশিয়াল ভাইভা বোর্ড"
              >
                <Award className="w-3.5 h-3.5" />
                <span className="inline">ভাইভা</span>
              </button>

              <button
                onClick={() => setVoiceMode('moot')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  voiceMode === 'moot'
                    ? 'bg-amber-600 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="মুট কোর্ট বিচারপতি"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span className="inline">বিচারক</span>
              </button>

              <button
                onClick={() => setVoiceMode('flash')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  voiceMode === 'flash'
                    ? 'bg-amber-600 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="১৫-সেকেন্ড হাই-ইল্ড ফ্ল্যাশ সামারি"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                <span className="inline">ফ্ল্যাশ</span>
              </button>
            </div>

            {/* Language Switch */}
            <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-1 text-xs shrink-0">
              <button
                onClick={() => toggleLanguage('bn')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  language === 'bn'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                🇧🇩 বাংলা
              </button>
              <button
                onClick={() => toggleLanguage('en')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                🇬🇧 Eng
              </button>
            </div>

            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as LawSubjectId)}
              className="bg-stone-950 text-stone-200 border border-stone-800 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-amber-500 font-medium max-w-full sm:max-w-[200px] truncate"
            >
              <option value="all">📚 সকল আইন (All Subjects)</option>
              {LAW_SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.serialNo}. {s.nameBn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Visualizer Stage & Live Transcript */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-3 min-h-0">
        {/* Left Side: 2026 AI Visualizer & Interactive Microphone Stage */}
        <div className="lg:col-span-5 flex flex-col bg-stone-900/90 border border-stone-800 rounded-2xl p-3 md:p-4 shadow-xl overflow-hidden relative shrink-0 lg:shrink h-[340px] lg:h-auto">
          {/* Visualizer Header */}
          <div className="flex items-center justify-between z-10 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Radio className={`w-3.5 h-3.5 ${isListening ? 'text-red-500 animate-pulse' : isSpeaking ? 'text-emerald-400 animate-pulse' : 'text-stone-500'}`} />
              <span className="font-mono font-medium">
                {isListening ? (
                  <span className="text-red-400">কথা শুনছি (থামলেই সাথে সাথে উত্তর)...</span>
                ) : isSpeaking ? (
                  <span className="text-emerald-400">সরাসরি মুখে উত্তর দিচ্ছি (Live Spoken)...</span>
                ) : isProcessing ? (
                  <span className="text-amber-400">সংযোগ হচ্ছে (Zero Delay)...</span>
                ) : (
                  'সরাসরি লাইভ ভয়েস কল (প্রস্তুত)'
                )}
              </span>
            </div>

            {/* Visualizer Mode Toggle */}
            <div className="flex items-center gap-1 bg-stone-950/80 p-0.5 rounded-lg border border-stone-800 text-[11px]">
              <button
                onClick={() => setVisualizerType('orb')}
                className={`px-2 py-0.5 rounded ${visualizerType === 'orb' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400'}`}
                title="অরবিট মোড"
              >
                Orb
              </button>
              <button
                onClick={() => setVisualizerType('bars')}
                className={`px-2 py-0.5 rounded ${visualizerType === 'bars' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400'}`}
                title="বার ইকুয়ালাইজার"
              >
                Bars
              </button>
              <button
                onClick={() => setVisualizerType('wave')}
                className={`px-2 py-0.5 rounded ${visualizerType === 'wave' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400'}`}
                title="সাউন্ড ওয়েভ"
              >
                Wave
              </button>
            </div>
          </div>

          {/* Central 2026 Canvas Visualizer */}
          <div className="flex-1 w-full relative flex items-center justify-center my-1 md:my-2 min-h-[120px] md:min-h-[160px]">
            <AudioVisualizer
              isListening={isListening}
              isSpeaking={isSpeaking}
              isProcessing={isProcessing}
              mode={visualizerType}
              size="lg"
            />

            {/* Floating Live Transcript Bubble when student is speaking */}
            {isListening && currentSpokenText && (
              <div className="absolute bottom-2 left-2 right-2 bg-stone-950/90 border border-red-500/50 rounded-xl p-2.5 text-xs text-stone-200 text-center shadow-2xl backdrop-blur-md animate-fade-in">
                <span className="text-red-400 font-bold mr-1">● লাইভ ভয়েস:</span> {currentSpokenText}
              </div>
            )}
          </div>

          {/* Big Action Mic Button */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1 z-10">
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`relative group w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white ring-8 ring-red-500/30 scale-105 animate-pulse'
                  : isSpeaking
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-500/20'
                  : isProcessing
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 animate-spin'
                  : 'bg-gradient-to-tr from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 hover:scale-105 ring-4 ring-amber-500/20'
              }`}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : isProcessing ? (
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : (
                <Mic className="w-6 h-6 sm:w-8 sm:h-8" />
              )}
            </button>

            <span className="text-xs font-medium text-stone-300 mt-2">
              {isListening ? 'কথা বলা শেষ হলে চাপুন (বা থামুন)' : 'মাইক্রোফোনে চাপ দিয়ে কথা বলুন'}
            </span>

            {/* Speed & Silence Controls */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 w-full mt-3 pt-3 border-t border-stone-800/80 text-[10px] sm:text-xs text-stone-400">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-stone-200">
                <input
                  type="checkbox"
                  checked={autoSilenceAnswer}
                  onChange={(e) => setAutoSilenceAnswer(e.target.checked)}
                  className="rounded bg-stone-950 border-stone-700 text-amber-600 focus:ring-0 w-3 h-3 sm:w-4 sm:h-4"
                />
                <span>স্বয়ংক্রিয় উত্তর (Auto-reply)</span>
              </label>

              <div className="flex items-center gap-1">
                <span>গতি:</span>
                {[0.9, 1.0, 1.25].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${playbackSpeed === spd ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'}`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Dialogue Stream & 1-Tap Quick Legal Topics */}
        <div className="lg:col-span-7 flex flex-col bg-stone-900/90 border border-stone-800 rounded-2xl shadow-xl overflow-hidden min-h-[400px]">
          {/* Stream Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950/60 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-stone-200">লাইভ কথপোকথন ও আইনি ট্রান্সক্রিপ্ট</span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenPDFViewer && (
                <button
                  onClick={() => {
                    const content = "# লাইভ কথপোকথন ও আইনি ট্রান্সক্রিপ্ট\n\n" + exchanges
                      .map(m => `### ${m.sender === 'student' ? '🧑‍🎓 শিক্ষার্থী' : '👨‍🏫 ডিজিটাল শিক্ষক'} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.text}\n\n---\n`)
                      .join('\n');
                    onOpenPDFViewer({
                      id: `voice-transcript-${Date.now()}`,
                      title: 'আইনি ট্রান্সক্রিপ্ট',
                      subject: 'ডিজিটাল শিক্ষক (Live Voice)',
                      type: 'viva',
                      content: content,
                      createdAt: new Date().toLocaleDateString('bn-BD')
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs text-amber-500 font-medium hover:text-amber-400 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                  title="পিডিএফ রিডারে ট্রান্সক্রিপ্ট পড়ুন"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">পিডিএফ রিডার</span>
                </button>
              )}
              {isSpeaking && (
                <button
                  onClick={() => {
                    stopCurrentAudio();
                    if (speechQueueRef.current) speechQueueRef.current.stop();
                    setIsSpeaking(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-red-950/80 border border-red-800 text-red-300 text-xs hover:bg-red-900"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>ভয়েস থামান</span>
                </button>
              )}

              <button
                onClick={handleClearHistory}
                className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1 rounded hover:bg-stone-800"
                title="কথোপকথন পরিষ্কার করুন"
              >
                ক্লিয়ার
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-stone-950/40 border-b border-stone-800 overflow-x-auto  flex items-center gap-2">
            <span className="text-[11px] font-semibold text-amber-500 whitespace-nowrap flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3" />
              ১-ট্যাপে শুনুন:
            </span>
            {activePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => processStudentQuestion(p.query)}
                className="text-xs bg-stone-800/90 hover:bg-amber-600/20 hover:border-amber-500/50 text-stone-300 hover:text-amber-300 border border-stone-700/70 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Dialogue Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {exchanges.map((ex) => (
              <div
                key={ex.id}
                className={`flex gap-2.5 ${ex.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                {ex.sender === 'teacher' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-stone-950 flex items-center justify-center shrink-0 mt-0.5">
                    <Scale className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                    ex.sender === 'student'
                      ? 'bg-amber-600 text-stone-950 font-medium rounded-tr-none'
                      : 'bg-stone-950 border border-stone-800 text-stone-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-semibold opacity-75">
                      {ex.sender === 'student' ? 'শিক্ষার্থী' : 'ডিজিটাল শিক্ষক'}
                    </span>
                    <span className="text-[10px] opacity-60">
                      {new Date(ex.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap leading-relaxed">
                    {ex.text || (
                      <span className="flex items-center gap-1.5 text-stone-400 italic">
                        <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
                        উত্তর তৈরি হচ্ছে...
                      </span>
                    )}
                  </p>

                  {/* Actions for teacher reply */}
                  {ex.sender === 'teacher' && ex.text && (
                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-stone-800/80 text-xs text-stone-400">
                      <button
                        onClick={() => handleReplay(ex.text, ex.audioBase64, ex.language)}
                        className="flex items-center gap-1 hover:text-amber-400 px-1.5 py-0.5 rounded hover:bg-stone-900"
                        title="পুনরায় শুনুন"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>পুনরায় শুনুন</span>
                      </button>

                      {ex.audioBase64 && (
                        <button
                          onClick={() => handleDownloadAudio(ex.audioBase64!, `Law_Tutor_${ex.id}`)}
                          className="flex items-center gap-1 hover:text-amber-400 px-1.5 py-0.5 rounded hover:bg-stone-900"
                          title="অডিও ডাউনলোড করুন"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ডাউনলোড</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCopy(ex.id, ex.text)}
                        className="flex items-center gap-1 hover:text-amber-400 px-1.5 py-0.5 rounded hover:bg-stone-900"
                        title="কপি করুন"
                      >
                        {copiedId === ex.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === ex.id ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {ex.sender === 'student' && (
                  <div className="w-7 h-7 rounded-lg bg-stone-700 text-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* Quick manual typing input fallback */}
          <div className="p-3 bg-stone-950/80 border-t border-stone-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.target as any).elements.manualQuery;
                if (input.value.trim()) {
                  processStudentQuestion(input.value.trim());
                  input.value = '';
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                name="manualQuery"
                type="text"
                placeholder={language === 'en' ? 'Or type your legal question here to hear speech...' : 'অথবা মুখে না বলে এখানে লিখেও ভয়েসে শুনতে পারেন...'}
                className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                ভয়েসে শুনুন
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
