const fs = require('fs');
let content = fs.readFileSync('src/components/VoiceAgent.tsx', 'utf-8');
content = content.replace(/window\.pcmToBase64 \? window\.pcmToBase64\(pcmData\) : null/g, 'pcmToBase64(pcmData)');
content = content.replace(/window\.playLiveAudioChunk/g, 'playLiveAudioChunk');
content = content.replace(/window\.stopLiveAudio/g, 'stopLiveAudio');
fs.writeFileSync('src/components/VoiceAgent.tsx', content);
