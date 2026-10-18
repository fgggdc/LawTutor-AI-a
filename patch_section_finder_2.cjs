const fs = require('fs');
let content = fs.readFileSync('src/components/SectionFinder.tsx', 'utf-8');

content = content.replace(/onAskTutor\(/g, 'fetchAIResponse(');

fs.writeFileSync('src/components/SectionFinder.tsx', content);
