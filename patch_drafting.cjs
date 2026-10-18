const fs = require('fs');
let content = fs.readFileSync('src/components/DraftingEthics.tsx', 'utf-8');

// Add import
content = content.replace(
  "import { FileText, Copy, CheckCircle2, AlertCircle, RefreshCcw, Sparkles, Download, MessageSquare } from 'lucide-react';",
  "import { FileText, Copy, CheckCircle2, AlertCircle, RefreshCcw, Sparkles, Download, MessageSquare } from 'lucide-react';\nimport { downloadPDF } from '../lib/pdfUtils';"
);

// Replace download logic
const oldDownload = `  const handleDownload = (text: string, title: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = \`\${title.replace(/\\s+/g, '_')}_Draft.txt\`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };`;
  
const newDownload = `  const handleDownload = (text: string, title: string) => {
    downloadPDF('drafting-result-box', \`\${title.replace(/\\s+/g, '_')}_Draft.pdf\`);
  };`;

content = content.replace(oldDownload, newDownload);

// Add ID to the template box
content = content.replace(
  '<div className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200 font-mono text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">',
  '<div id="drafting-result-box" className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200 font-mono text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">'
);

fs.writeFileSync('src/components/DraftingEthics.tsx', content);
