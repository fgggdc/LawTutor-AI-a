const fs = require('fs');

const target = `
  // Start Mic
  const handleStartListening = () => {
    prewarmSpeechEngine();
    stopCurrentAudio();
    if (speechQueueRef.current) {
      speechQueueRef.current.stop();
      speechQueueRef.current = null;
    }
    setIsSpeaking(false);
    setCurrentSpokenText('');
    spokenTextRef.current = '';

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language === 'bn' ? 'bn-BD' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start retry:', err);
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setIsListening(true);
          }, 80);
        } catch {}
      }
    }
  };

  // Stop Mic manually
  const handleStopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);

    const textToProcess = spokenTextRef.current || currentSpokenText;
    if (textToProcess && textToProcess.trim().length >= 2) {
      processStudentQuestion(textToProcess);
    }
  };
`;

const replacement = `
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
      const wsUrl = \`\${wsProtocol}//\${location.host}/live?language=\${language}&mode=\${voiceMode}&subjectId=\${selectedSubject}\`;
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
        const base64 = window.pcmToBase64 ? window.pcmToBase64(pcmData) : null;
        if (base64 && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ audio: base64 }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio && window.playLiveAudioChunk) {
            window.playLiveAudioChunk(msg.audio);
            setIsSpeaking(true);
          }
          if (msg.interrupted) {
            if (window.stopLiveAudio) window.stopLiveAudio();
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
    if (window.stopLiveAudio) window.stopLiveAudio();
    setIsListening(false);
    setIsSpeaking(false);
  };
`;

let content = fs.readFileSync('src/components/VoiceAgent.tsx', 'utf-8');
content = content.replace(target, replacement);
fs.writeFileSync('src/components/VoiceAgent.tsx', content);

