const fs = require('fs');
let content = fs.readFileSync('src/components/HomeDashboard.tsx', 'utf-8');

content = content.replace(
  "className={\\\`group flex items-start gap-4 p-4 md:p-5 rounded-2xl border transition-all text-left shadow-sm hover:shadow-md \\${tool.color}\\\`}",
  "className={`group flex items-start gap-4 p-4 md:p-5 rounded-2xl border transition-all text-left shadow-sm hover:shadow-md ${tool.color}`}"
);

fs.writeFileSync('src/components/HomeDashboard.tsx', content);
