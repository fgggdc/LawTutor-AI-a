const fs = require('fs');
let content = fs.readFileSync('src/components/SectionFinder.tsx', 'utf-8');

// 1. Add Download Icon and utility import
content = content.replace(
  "import { Search, BookOpen, Scale, Sparkles, HelpCircle, ArrowRight, CheckCircle2, X } from 'lucide-react';",
  "import { Search, BookOpen, Scale, Sparkles, HelpCircle, ArrowRight, CheckCircle2, X, Download } from 'lucide-react';\nimport { downloadPDF } from '../lib/pdfUtils';"
);

// 2. Add id to the content container and a download button in the header
const headerTarget = `              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">এআই শিক্ষকের বিশ্লেষণ</h3>
              </div>`;
              
const newHeader = `              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">এআই শিক্ষকের বিশ্লেষণ</h3>
              </div>
              <div className="flex items-center gap-2">
                {inlineResponse && !isInlineLoading && (
                  <button 
                    onClick={() => downloadPDF('section-ai-response', 'AI_Lecture_Notes.pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF ডাউনলোড</span>
                  </button>
                )}`;

content = content.replace(headerTarget, newHeader);

// 3. Add id to markdown body
content = content.replace(
  '<div className="markdown-body text-sm sm:text-base text-stone-800">',
  '<div id="section-ai-response" className="markdown-body text-sm sm:text-base text-stone-800 p-4 bg-white rounded-lg">'
);

fs.writeFileSync('src/components/SectionFinder.tsx', content);
