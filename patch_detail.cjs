const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const oldText = "অত্যন্ত চমৎকার, সহজ ও বিস্তারিতভাবে সেটি আলোচনা করবে।";
const newText = "অত্যন্ত চমৎকার, সহজ এবং বেশ সময় নিয়ে খুব বিস্তারিত ও গভীরভাবে (in-depth) সেটি আলোচনা করবে। প্রতিটি পয়েন্ট, উপাদান ও প্রেক্ষাপট একদম ভেঙে ভেঙে বুঝিয়ে বলবে।";

content = content.replace(new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);

// Make sure output tokens are sufficient
content = content.replace(/maxOutputTokens:\s*\d+,/g, 'maxOutputTokens: 1500,');

fs.writeFileSync('server.ts', content);
