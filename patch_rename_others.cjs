const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf-8');
header = header.replace(/আইন শিক্ষক \(১৫ বিষয়\)/g, 'সহকারী আইন শিক্ষক (১৫ বিষয়)');
header = header.replace(/ডিজিটাল আইন শিক্ষক ও এআই/g, 'ডিজিটাল সহকারী আইন শিক্ষক ও এআই');
header = header.replace(/চ্যাটবট এআই শিক্ষক/g, 'চ্যাটবট সহকারী এআই শিক্ষক');
fs.writeFileSync('src/components/Header.tsx', header);

let nav = fs.readFileSync('src/components/MobileBottomNav.tsx', 'utf-8');
nav = nav.replace(/চ্যাট শিক্ষক/g, 'সহকারী শিক্ষক');
fs.writeFileSync('src/components/MobileBottomNav.tsx', nav);

