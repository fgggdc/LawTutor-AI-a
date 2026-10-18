const fs = require('fs');
let content = fs.readFileSync('src/components/CaseBriefer.tsx', 'utf-8');

content = content.replace(
  "import { Scale, Sparkles, BookOpen, AlertTriangle, FileText, Check, Copy, Download } from 'lucide-react';",
  "import { Scale, Sparkles, BookOpen, AlertTriangle, FileText, Check, Copy, Download } from 'lucide-react';\nimport { downloadPDF } from '../lib/pdfUtils';"
);

// We replace the handleDownload implementation
const oldDownload = `  const handleDownload = () => {
    if (!briefResult) return;
    const blob = new Blob([briefResult], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`Case_Brief_\${Date.now()}.md\`;
    a.click();
    URL.revokeObjectURL(url);
  };`;
  
const newDownload = `  const handleDownload = () => {
    if (!briefResult) return;
    downloadPDF('case-brief-result', \`Case_Brief_\${Date.now()}.pdf\`);
  };`;
  
content = content.replace(oldDownload, newDownload);

// Add ID to the markdown body
content = content.replace(
  '<div className="markdown-body text-sm text-stone-900 leading-relaxed">',
  '<div id="case-brief-result" className="markdown-body text-sm text-stone-900 leading-relaxed p-4 bg-white rounded-lg">'
);

fs.writeFileSync('src/components/CaseBriefer.tsx', content);
