const fs = require('fs');
let content = fs.readFileSync('src/components/ChatTutor.tsx', 'utf-8');

content = content.replace(
  'আমি তোমার **আইন সহযোগী শিক্ষক (AI Law Tutor)**',
  'আমি তোমার **সহকারী এআই শিক্ষক (Assistant AI Law Tutor)**'
);

fs.writeFileSync('src/components/ChatTutor.tsx', content);
