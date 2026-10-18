// Audio Utilities for Gemini TTS (PCM 24000Hz) and Real-time Streaming Speech Synthesis
// Optimized for zero-latency live voice interaction (ChatGPT / Gemini Live style)

// ----- Live API PCM Helpers -----
export function pcmToBase64(pcmData: Float32Array): string {
  const buffer = new ArrayBuffer(pcmData.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < pcmData.length; i++) {
    let s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToPcm(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const pcm = new Float32Array(bytes.length / 2);
  for (let i = 0; i < pcm.length; i++) {
    pcm[i] = view.getInt16(i * 2, true) / 0x8000;
  }
  return pcm;
}

let livePlaybackTime = 0;
let liveAudioContext: AudioContext | null = null;
let activeSourceNodes: AudioBufferSourceNode[] = [];

export async function getLiveAudioContext(): Promise<AudioContext> {
  if (!liveAudioContext || liveAudioContext.state === 'closed') {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    liveAudioContext = new AudioCtx({ sampleRate: 24000 });
  }
  if (liveAudioContext.state === 'suspended') {
    await liveAudioContext.resume();
  }
  return liveAudioContext;
}

export async function playLiveAudioChunk(base64Audio: string) {
  const ctx = await getLiveAudioContext();
  const pcm = base64ToPcm(base64Audio);
  
  const buffer = ctx.createBuffer(1, pcm.length, 24000);
  buffer.copyToChannel(pcm, 0);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  
  if (livePlaybackTime < ctx.currentTime) {
    livePlaybackTime = ctx.currentTime;
  }
  
  source.start(livePlaybackTime);
  livePlaybackTime += buffer.duration;
  
  activeSourceNodes.push(source);
  source.onended = () => {
    activeSourceNodes = activeSourceNodes.filter(s => s !== source);
  };
}

export function stopLiveAudio() {
  activeSourceNodes.forEach(source => {
    try { source.stop(); } catch {}
  });
  activeSourceNodes = [];
  livePlaybackTime = 0;
}

let audioContext: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;

export async function getAudioContext(): Promise<AudioContext> {
  if (!audioContext || audioContext.state === 'closed') {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioCtx({ sampleRate: 24000 });
  }
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch (e) {
      console.warn('Could not resume audioContext:', e);
    }
  }
  return audioContext;
}

export function stopCurrentAudio(): void {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
    } catch {
      // ignore if already stopped
    }
    currentSourceNode = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Pre-warms the browser's speech synthesis engine to eliminate initial delay
 */
export function prewarmSpeechEngine(): void {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.getVoices();
      const dummy = new SpeechSynthesisUtterance('');
      dummy.volume = 0;
      window.speechSynthesis.speak(dummy);
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Plays base64 PCM 16-bit little-endian audio returned by Gemini TTS with optional playback rate
 */
export async function playPcmAudio(base64Data: string, sampleRate = 24000, playbackRate = 1.0): Promise<void> {
  stopCurrentAudio();
  const ctx = await getAudioContext();

  // Decode base64 to binary
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert raw 16-bit PCM (little-endian) to Float32Array
  const int16Array = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }

  const audioBuffer = ctx.createBuffer(1, float32Array.length, sampleRate);
  audioBuffer.copyToChannel(float32Array, 0);

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = playbackRate;
  source.connect(ctx.destination);
  currentSourceNode = source;

  return new Promise((resolve) => {
    source.onended = () => {
      currentSourceNode = null;
      resolve();
    };
    try {
      source.start(0);
    } catch (err) {
      console.error('Error starting audio source:', err);
      resolve();
    }
  });
}

/**
 * Convert PCM Base64 to playable WAV Blob for download
 */
export function pcmBase64ToWavBlob(base64Data: string, sampleRate = 24000): Blob {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const pcmBytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    pcmBytes[i] = binaryString.charCodeAt(i);
  }

  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBytes.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // 16 for PCM
  view.setUint16(20, 1, true); // PCM = 1
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // write PCM bytes
  new Uint8Array(buffer, 44).set(pcmBytes);

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Clean text for human-like natural speech synthesis
 */
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // convert markdown links to text
    .replace(/[*_~`#>\-–—]/g, ' ') // strip markdown formatting symbols
    .replace(/[()[\]{}]/g, ', ') // convert brackets to natural pauses
    .replace(/§/g, 'ধারা ') // pronounce section symbol
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Browser Speech Synthesis fallback (optimized for Bengali & English legal reading)
 */
export function speakTextWithBrowser(
  text: string,
  onEnd?: () => void,
  rate = 1.0,
  lang: 'bn' | 'en' = 'bn'
): boolean {
  if (!('speechSynthesis' in window)) return false;
  stopCurrentAudio();

  const clean = cleanTextForSpeech(text).slice(0, 1500);

  if (!clean) {
    if (onEnd) onEnd();
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = lang === 'bn' ? rate * 0.95 : rate * 0.98;
  utterance.pitch = 1.0;

  const configureVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'en') {
      const enVoice = voices.find(
        v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('English') || v.name.includes('Samantha') || v.name.includes('Daniel'))
      ) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) {
        utterance.voice = enVoice;
        utterance.lang = enVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }
    } else {
      const bnVoice = voices.find(
        v =>
          v.lang.toLowerCase().includes('bn-bd') ||
          v.lang.toLowerCase().includes('bn_bd') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali') ||
          v.name.toLowerCase().includes('বাংলা') ||
          v.lang.toLowerCase().includes('bn-in') ||
          v.lang.toLowerCase().includes('bn_in') ||
          v.lang.toLowerCase().startsWith('bn')
      );
      if (bnVoice) {
        utterance.voice = bnVoice;
        utterance.lang = bnVoice.lang;
      } else {
        utterance.lang = 'bn-BD';
      }
    }
  };

  configureVoice();

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * StreamingSpeechQueue: Real-time clause-by-clause progressive speech player (Gemini Live / ChatGPT Voice style)
 * Begins vocalizing within milliseconds of the first token arrival without waiting for full paragraphs.
 */
export class StreamingSpeechQueue {
  private buffer = '';
  private isEnded = false;
  private onAllSpokenCallback?: () => void;
  private queue: string[] = [];
  private isSpeakingChunk = false;
  private hasEnqueuedFirstChunk = false;
  private lang: 'bn' | 'en';
  private rate: number;
  private isStopped = false;

  constructor(lang: 'bn' | 'en' = 'bn', rate = 1.0, onAllSpoken?: () => void) {
    this.lang = lang;
    this.rate = rate;
    this.onAllSpokenCallback = onAllSpoken;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public feed(chunk: string) {
    if (this.isStopped) return;
    this.buffer += chunk;

    // Detect fast natural phrase delimiters:
    const phraseRegex = /([^।?,;:!\n]+[।?,;:!\n]+)/g;
    let match;
    let lastIndex = 0;

    while ((match = phraseRegex.exec(this.buffer)) !== null) {
      const phrase = match[1].trim();
      if (phrase.length >= 2) {
        this.enqueue(phrase);
      }
      lastIndex = phraseRegex.lastIndex;
    }

    if (lastIndex > 0) {
      this.buffer = this.buffer.slice(lastIndex);
    }

    // Ultra-low latency for the very first words spoken
    const words = this.buffer.trim().split(/\s+/);
    const wordThreshold = this.hasEnqueuedFirstChunk ? 6 : 2;

    if (words.length > wordThreshold) {
      const toSpeak = words.slice(0, wordThreshold).join(' ');
      this.enqueue(toSpeak);
      this.buffer = words.slice(wordThreshold).join(' ');
    }
  }

  public end() {
    if (this.isStopped) return;
    this.isEnded = true;
    const remaining = this.buffer.trim();
    if (remaining.length > 0) {
      this.enqueue(remaining);
      this.buffer = '';
    } else if (!this.isSpeakingChunk && this.queue.length === 0) {
      this.triggerComplete();
    }
  }

  public stop() {
    this.isStopped = true;
    this.buffer = '';
    this.queue = [];
    this.isSpeakingChunk = false;
    this.hasEnqueuedFirstChunk = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private enqueue(phrase: string) {
    const clean = cleanTextForSpeech(phrase);
    if (!clean) return;

    this.hasEnqueuedFirstChunk = true;
    this.queue.push(clean);
    this.processQueue();
  }

  private processQueue() {
    if (this.isStopped || this.isSpeakingChunk || this.queue.length === 0) {
      if (!this.isSpeakingChunk && this.queue.length === 0 && this.isEnded) {
        this.triggerComplete();
      }
      return;
    }

    const textToSpeak = this.queue.shift();
    if (!textToSpeak) {
      if (this.isEnded && this.queue.length === 0) {
        this.triggerComplete();
      }
      return;
    }

    this.isSpeakingChunk = true;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = this.lang === 'bn' ? this.rate * 0.96 : this.rate * 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (this.lang === 'en') {
      const enVoice = voices.find(
        v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('English') || v.name.includes('Samantha'))
      ) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) {
        utterance.voice = enVoice;
        utterance.lang = enVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }
    } else {
      const bnVoice = voices.find(
        v =>
          v.lang.toLowerCase().includes('bn-bd') ||
          v.lang.toLowerCase().includes('bn_bd') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali') ||
          v.name.toLowerCase().includes('বাংলা') ||
          v.lang.toLowerCase().includes('bn-in') ||
          v.lang.toLowerCase().includes('bn_in') ||
          v.lang.toLowerCase().startsWith('bn')
      );
      if (bnVoice) {
        utterance.voice = bnVoice;
        utterance.lang = bnVoice.lang;
      } else {
        utterance.lang = 'bn-BD';
      }
    }

    const handleChunkFinished = () => {
      this.isSpeakingChunk = false;
      this.processQueue();
    };

    utterance.onend = handleChunkFinished;
    utterance.onerror = handleChunkFinished;

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      handleChunkFinished();
    }
  }

  private triggerComplete() {
    if (this.onAllSpokenCallback && !this.isStopped) {
      this.onAllSpokenCallback();
    }
  }
}

