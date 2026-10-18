import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Send, 
  Image as ImageIcon, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  Trash2, 
  Download, 
  BookOpen, 
  GraduationCap, 
  HelpCircle,
  Loader2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { ChatMessage, LawSubjectId, PDFDocumentItem } from '../types';
import { LAW_SUBJECTS, INITIAL_PRESET_PROMPTS } from '../data/lawData';
import { playPcmAudio, stopCurrentAudio, speakTextWithBrowser } from '../lib/audioUtils';

interface ChatTutorProps {
  selectedSubject: LawSubjectId;
  setSelectedSubject: (s: LawSubjectId) => void;
  onOpenVoiceTab?: () => void;
  initialPrompt?: string;
  onPromptConsumed?: () => void;
  onOpenPDFViewer?: (doc: PDFDocumentItem) => void;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({
  selectedSubject,
  setSelectedSubject,
  onOpenVoiceTab,
  initialPrompt,
  onPromptConsumed,
  onOpenPDFViewer
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('lawtutor_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        text: `### আসসালামু আলাইকুম ও স্বাগতম! ⚖️
আমি তোমার **সহকারী এআই শিক্ষক (Assistant AI Law Tutor)**। ল স্টুডেন্ট হিসেবে তোমার প্রতিটি সাবজেক্টের কঠিন ধারা, রুলস ও ল্যান্ডমার্ক কেস সহজ বাংলায় বুঝতে আমি তোমাকে সাহায্য করব।

#### 💡 আমি যেভাবে তোমাকে সাহায্য করতে পারি:
- 📌 **যেকোনো ধারা বা বিষয় সহজ বাংলায় ব্যাখ্যা** (যেমন: দণ্ডবিধি ৩০০ ধারার খুন বনাম নির্দোষ নরহত্যা)।
- 🏛️ **ল্যান্ডমার্ক কেস ল (Case Precedents) ও রায়ের মূল বক্তব্য (Ratio Decidendi) বিশ্লেষণ**।
- 📝 **পরীক্ষায় ভালো নম্বর পাওয়ার মতো পয়েন্টভিত্তিক মডেল উত্তর তৈরি**।
- 📷 **আইনের বইয়ের পাতা, নোট বা পরীক্ষার প্রশ্নের ছবি আপলোড** করে সমাধান নেওয়া।
- 🎙️ **ভয়েস কমান্ড ও অডিওর মাধ্যমে সরাসরি কথা বলে শেখা**।

নিচে বিষয় বেছে নাও অথবা তোমার প্রশ্নটি সরাসরি লিখে/ভয়েসে আমাকে জানাও!`,
        timestamp: Date.now(),
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedImageMime, setSelectedImageMime] = useState<string>('image/jpeg');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<'normal' | 'simple_story' | 'exam_notes' | 'viva'>('normal');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Save chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lawtutor_chat_history', JSON.stringify(messages));
    } catch (e) {
      // storage quota or ignore
    }
  }, [messages]);

  // Handle initial prompt passed from another tab
  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      if (onPromptConsumed) {
        onPromptConsumed();
      }
    }
  }, [initialPrompt]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initialize Web Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'bn-BD';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সুবিধা নেই। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন বা টাইপ করুন।');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setSelectedImageBase64(base64Data);
      setSelectedImageMime(file.type || 'image/jpeg');
      setImagePreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImageBase64(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend !== undefined ? textToSend : input).trim();
    if (!promptText && !selectedImageBase64) return;
    if (loading) return;

    const userMessageId = `user-${Date.now()}`;
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: promptText || 'দয়া করে সংযুক্ত ছবিটি বিশ্লেষণ করে আইনের বিষয়টি বুঝিয়ে দিন।',
      timestamp: Date.now(),
      subjectId: selectedSubject,
      imageUrl: imagePreviewUrl || undefined,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    const curImgBase64 = selectedImageBase64;
    const curImgMime = selectedImageMime;
    removeImage();
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          subjectId: selectedSubject,
          imageBase64: curImgBase64,
          imageMimeType: curImgMime,
          mode: studyMode,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Network error');
      }

      if (!response.body) throw new Error("ReadableStream not yet supported in this browser.");

      const assistantMessageId = `assistant-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        text: '',
        timestamp: Date.now(),
        subjectId: selectedSubject,
      }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.delta) {
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, text: msg.text + parsed.delta } : msg
                  ));
                }
              } catch(e) {
                console.error("Stream parse error:", e);
              }
            }
          }
        }
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **একটি ত্রুটি ঘটেছে:** ${err.message || 'সার্ভার থেকে উত্তর পাওয়া যায়নি।'}\nদয়া করে আবার চেষ্টা করুন।`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTTS = async (msg: ChatMessage) => {
    if (playingAudioId === msg.id) {
      stopCurrentAudio();
      setPlayingAudioId(null);
      return;
    }

    stopCurrentAudio();
    setPlayingAudioId(msg.id);

    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: msg.text.slice(0, 1200), 
          voice: 'Zephyr',
          language: 'bn'
        }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        await playPcmAudio(data.audioBase64, data.sampleRate || 24000);
        setPlayingAudioId(null);
      } else {
        // Fallback to browser speech in Bengali
        speakTextWithBrowser(msg.text, () => setPlayingAudioId(null), 1.0, 'bn');
      }
    } catch (e) {
      speakTextWithBrowser(msg.text, () => setPlayingAudioId(null), 1.0, 'bn');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    if (window.confirm('আপনি কি চ্যাট হিস্ট্রি মুছে নতুন সেশন শুরু করতে চান?')) {
      stopCurrentAudio();
      localStorage.removeItem('lawtutor_chat_history');
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          text: `### আসসালামু আলাইকুম ও স্বাগতম! ⚖️
আমি তোমার **সহকারী এআই শিক্ষক (Assistant AI Law Tutor)**। ল স্টুডেন্ট হিসেবে তোমার প্রতিটি সাবজেক্টের কঠিন ধারা, রুলস ও ল্যান্ডমার্ক কেস সহজ বাংলায় বুঝতে আমি তোমাকে সাহায্য করব।

#### 💡 আমি যেভাবে তোমাকে সাহায্য করতে পারি:
- **সহজ বাংলায় ব্যাখ্যা:** যেকোনো আইনি টার্ম বা ধারার সহজ ও সাবলীল ব্যাখ্যা।
- **ল্যান্ডমার্ক কেস রেফারেন্স:** যেকোনো টপিকের প্রাসঙ্গিক ল্যান্ডমার্ক ও গুরুত্বপূর্ণ কেস ল।
- **পরীক্ষার প্রস্তুতি:** আইনের প্রশ্ন, মক টেস্ট এবং ভাইভার প্রস্তুতিতে দিকনির্দেশনা।

উপর থেকে সাবজেক্ট এবং পাঠদান মোড নির্বাচন করে নিচে তোমার প্রশ্নটি লিখতে পারো!`,
          timestamp: Date.now(),
        }
      ]);
    }
  };

  const downloadNotes = () => {
    const content = "# LawTutor Study Notes\n\n" + messages
      .map(m => `### ${m.role === 'user' ? '🧑‍🎓 শিক্ষার্থী' : '👨‍🏫 সহকারী এআই শিক্ষক'} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.text}\n\n---\n`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LawTutor_Study_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-stone-100/70 relative min-h-0">
      {/* Subject banner & Mode switcher */}
      <div className="bg-white border-b border-stone-200 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-stone-600">পাঠদান মোড:</span>
          <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => setStudyMode('normal')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                studyMode === 'normal' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📚 আদর্শ শিক্ষক
            </button>
            <button
              onClick={() => setStudyMode('simple_story')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                studyMode === 'simple_story' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📖 গল্পে সহজ ব্যাখ্যা
            </button>
            <button
              onClick={() => setStudyMode('exam_notes')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                studyMode === 'exam_notes' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📝 পরীক্ষার মডেল উত্তর
            </button>
            <button
              onClick={() => setStudyMode('viva')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                studyMode === 'viva' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🎓 ভাইভা প্র্যাকটিস
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPDFViewer && (
            <button
              onClick={() => {
                const content = "# আইন ডিজিটাল শিক্ষক - স্টাডি নোট\n\n" + messages
                  .map(m => `### ${m.role === 'user' ? '🧑‍🎓 শিক্ষার্থী' : '👨‍🏫 সহকারী এআই শিক্ষক'} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.text}\n\n---\n`)
                  .join('\n');
                onOpenPDFViewer({
                  id: `chat-notes-${Date.now()}`,
                  title: 'স্টাডি নোট (Chat History)',
                  subject: 'ডিজিটাল শিক্ষক',
                  type: 'section_notes',
                  content: content,
                  createdAt: new Date().toLocaleDateString('bn-BD')
                });
              }}
              title="ইন-অ্যাপ পিডিএফ রিডারে পড়ুন"
              className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-200 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">পিডিএফ রিডার</span>
            </button>
          )}
          <button
            onClick={downloadNotes}
            title="নোট ডাউনলোড করুন"
            className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">নোট সেভ (.md)</span>
          </button>
          <button
            onClick={clearChat}
            title="চ্যাট হিস্ট্রি ক্লিয়ার করুন"
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 bg-stone-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">নতুন সেশন</span>
          </button>
        </div>
      </div>

      {/* Preset prompt pills for quick study questions */}
      <div className="bg-amber-50/60 border-b border-amber-100 px-3 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto ">
        <span className="text-xs font-bold text-amber-900 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          দ্রুত প্রশ্ন:
        </span>
        {INITIAL_PRESET_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.prompt)}
            className="text-xs bg-white text-amber-950 hover:bg-amber-600 hover:text-white border border-amber-200/80 px-2.5 py-1 rounded-full whitespace-nowrap transition-all shadow-2xs font-medium cursor-pointer"
          >
            {p.titleBn}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3.5 max-w-4xl ${
                isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  isAssistant
                    ? 'bg-amber-700 text-amber-100 font-bold'
                    : 'bg-stone-800 text-stone-100'
                }`}
              >
                {isAssistant ? <GraduationCap className="w-5 h-5" /> : <span className="text-xs font-bold">ME</span>}
              </div>

              {/* Message Bubble Container */}
              <div className={`flex flex-col max-w-[88%] sm:max-w-[80%]`}>
                <div
                  className={`rounded-2xl px-4 py-3.5 text-sm shadow-xs ${
                    isAssistant
                      ? 'bg-white text-stone-900 border border-stone-200/90 rounded-tl-sm'
                      : 'bg-stone-900 text-stone-50 rounded-tr-sm'
                  }`}
                >
                  {/* If user sent an image */}
                  {msg.imageUrl && (
                    <div className="mb-2.5 rounded-lg overflow-hidden border border-stone-300 max-w-xs">
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded Legal Material"
                        className="w-full h-auto object-cover max-h-56"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Render Message Text via Markdown */}
                  <div className="markdown-body">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>

                {/* Footer Toolbar for Assistant Message */}
                {isAssistant && (
                  <div className="flex items-center gap-2 mt-1.5 px-1 text-xs text-stone-500">
                    <button
                      onClick={() => handlePlayTTS(msg)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
                        playingAudioId === msg.id
                          ? 'bg-amber-100 text-amber-800 font-semibold'
                          : 'hover:bg-stone-200 text-stone-600'
                      }`}
                      title="অডিও শুনে শুনুন (Voice Agent)"
                    >
                      {playingAudioId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                          <span>থামান</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>ভয়েস শুনুন</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="flex items-center gap-1 hover:bg-stone-200 text-stone-600 px-2 py-0.5 rounded-md transition-colors"
                      title="টেক্সট কপি করুন"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-600 font-medium">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>

                    {onOpenPDFViewer && (
                      <button
                        onClick={() => onOpenPDFViewer({
                          id: `chat-${msg.id}`,
                          title: 'আইনি আলোচনা ও উত্তর (AI Legal Lecture)',
                          subject: 'সহকারী এআই শিক্ষক',
                          type: 'analysis',
                          content: msg.text,
                          createdAt: new Date().toLocaleDateString('bn-BD'),
                          pageCount: 2
                        })}
                        className="flex items-center gap-1 hover:bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md font-bold transition-colors cursor-pointer bg-amber-50 border border-amber-200"
                        title="ইন-অ্যাপ পিডিএফ রিডারে পড়ুন"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>পিডিএফ রিডার</span>
                      </button>
                    )}

                    <span className="text-[11px] text-stone-400 ml-auto">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3 max-w-4xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-amber-700 text-amber-100 flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-white border border-amber-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-stone-700 shadow-xs flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
              <span className="font-medium text-stone-600">
                সহকারী এআই শিক্ষক আইনের ধারা ও কেস নজির বিশ্লেষণ করছেন...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview floating pill before sending */}
      {imagePreviewUrl && (
        <div className="mx-3 sm:mx-6 mb-2 p-2 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between max-w-md shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="w-12 h-12 rounded-lg object-cover border border-amber-400 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs text-amber-950 truncate">
              <p className="font-semibold">আইনের বই/নোট বা প্রশ্নের ছবি যুক্ত হয়েছে</p>
              <p className="text-stone-500">প্রশ্ন লিখে পাঠান অথবা সরাসরি সেন্ড চাপুন</p>
            </div>
          </div>
          <button
            onClick={removeImage}
            className="p-1 text-stone-500 hover:text-red-600 hover:bg-amber-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Bar Area */}
      <div className="bg-white border-t border-stone-200 p-2.5 sm:p-4 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-4xl mx-auto flex items-end gap-2"
        >
          {/* File Upload Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
            id="chat-image-input"
          />

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="বইয়ের পাতা, নোট বা প্রশ্নের ছবি আপলোড করুন"
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              imagePreviewUrl
                ? 'bg-amber-100 border-amber-400 text-amber-800'
                : 'bg-stone-100 border-stone-300 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            title={isListening ? 'ভয়েস ইনপুট বন্ধ করুন' : 'কথা বলে প্রশ্ন করুন'}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-red-500 border-red-600 text-white animate-pulse ring-2 ring-red-300'
                : 'bg-stone-100 border-stone-300 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Live Voice Agent Shortcut */}
          {onOpenVoiceTab && (
            <button
              type="button"
              onClick={onOpenVoiceTab}
              title="আইন ডিজিটাল শিক্ষক (Live AI Voice Agent - ২০২৬)"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 hover:bg-amber-500/20 text-xs font-semibold shrink-0 cursor-pointer transition-all"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>ভয়েস শিক্ষক ২০২৬</span>
              <span className="bg-red-500 text-white text-[9px] px-1 rounded font-mono animate-pulse">LIVE</span>
            </button>
          )}

          {/* Textarea Input */}
          <div className="flex-1 relative">
            <textarea
              id="law-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isListening
                  ? 'কথা শুনছি... বলুন...'
                  : selectedSubject !== 'all'
                  ? `${LAW_SUBJECTS.find(s => s.id === selectedSubject)?.nameBn || 'আইন'} সম্পর্কে আপনার প্রশ্নটি লিখুন...`
                  : 'আইনের যেকোনো ধারা, কেস ল বা বিষয় সহজ বাংলায় বুঝতে এখানে লিখুন...'
              }
              rows={1}
              className="w-full bg-stone-50 text-stone-900 text-sm rounded-xl px-3.5 py-2.5 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600 resize-none max-h-32 min-h-[44px]"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImageBase64) || loading}
            id="chat-send-btn"
            className="p-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white rounded-xl transition-all shadow-xs shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
