const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  '"আইন শিক্ষক ও অ্যাকাডেমিক মেন্টর"',
  '"সহকারী এআই আইন শিক্ষক ও অ্যাকাডেমিক মেন্টর"'
);

fs.writeFileSync('server.ts', content);
