const fs = require('fs');
let content = fs.readFileSync('src/components/ChatTutor.tsx', 'utf-8');

// Also update welcome message text to "সহকারী এআই শিক্ষক"
content = content.replace(/এআই শিক্ষক/g, 'সহকারী এআই শিক্ষক');
content = content.replace(/এআই আইন শিক্ষক/g, 'সহকারী এআই শিক্ষক');

fs.writeFileSync('src/components/ChatTutor.tsx', content);
