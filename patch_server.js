const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf-8');
const newContent = content.replace(
  'responseModalities: [Modality.AUDIO],',
  'responseModalities: [Modality.AUDIO],\n          generationConfig: { responseModalities: ["AUDIO"] },'
);
fs.writeFileSync('server.ts', newContent);
