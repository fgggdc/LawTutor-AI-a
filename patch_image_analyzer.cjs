const fs = require('fs');
let content = fs.readFileSync('src/components/ImageDocAnalyzer.tsx', 'utf-8');

// Imports
content = content.replace(
  "import { ImageIcon, FileText, UploadCloud, AlertCircle, Loader2, RefreshCcw, Sparkles, Image as ImgIcon, Download } from 'lucide-react';",
  "import { ImageIcon, FileText, UploadCloud, AlertCircle, Loader2, RefreshCcw, Sparkles, Image as ImgIcon, Download } from 'lucide-react';\nimport { downloadPDF } from '../lib/pdfUtils';"
);

// We see there's already a Download icon imported. We should find where the Header for the content display is.
// Look for "Content Display"
const target = `            {/* Content Display */}
            <div className="flex-1">`;
const newTarget = `            {/* Content Display */}
            <div className="flex-1">
              {analysisResult && !analyzing && (
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => downloadPDF('image-ai-response', 'AI_Document_Analysis.pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF ডাউনলোড</span>
                  </button>
                </div>
              )}`;
content = content.replace(target, newTarget);

content = content.replace(
  '<div className="markdown-body text-stone-900 leading-relaxed text-sm">',
  '<div id="image-ai-response" className="markdown-body text-stone-900 leading-relaxed text-sm p-4 bg-white rounded-lg">'
);

fs.writeFileSync('src/components/ImageDocAnalyzer.tsx', content);
