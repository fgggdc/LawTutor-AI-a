const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf-8');

content = content.replace(
  '<span>১. চ্যাটবট সহকারী এআই শিক্ষক</span>',
  '<span>১. সহকারী এআই শিক্ষক</span>'
);

fs.writeFileSync('src/components/Header.tsx', content);
