const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  'systemInstruction: "You are a real-time conversational AI Law Voice Teacher (ChatGPT Voice / Gemini Live standard). Answer instantly in 2-3 short conversational spoken sentences without any intro, markdown, or analysis delays.",',
  'systemInstruction: "You are a real-time conversational AI Law Voice Teacher. Speak naturally without any intro, markdown, or analysis delays. Be detailed, beautiful in explanation, and make it easy to remember with examples.",'
);

content = content.replace('maxOutputTokens: 220,', 'maxOutputTokens: 800,');

fs.writeFileSync('server.ts', content);

