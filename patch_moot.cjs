const fs = require('fs');
let content = fs.readFileSync('src/components/MootCourtViva.tsx', 'utf-8');

// Imports
content = content.replace(
  "import { Award, Gavel, UserCheck, MessageSquare, Volume2, Sparkles, CheckCircle2, ChevronRight, BookOpen, AlertTriangle } from 'lucide-react';",
  "import { Award, Gavel, UserCheck, MessageSquare, Volume2, Sparkles, CheckCircle2, ChevronRight, BookOpen, AlertTriangle, Download } from 'lucide-react';\nimport { downloadPDF } from '../lib/pdfUtils';"
);

// Bench feedback PDF
const benchFeedbackTarget = `            {/* Bench Feedback */}
            {evaluation && (
              <div className="bg-white rounded-xl border border-stone-300 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h4 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2 font-serif-legal">
                    <Gavel className="w-4 h-4 text-amber-900" />
                    <span>বিজ্ঞ জাজদের ইন্টারভেনশন ও রায় (Judicial Interventions)</span>
                  </h4>
                  <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                    রাউন্ড {roundCount - 1}
                  </span>
                </div>
                <div className="bg-stone-50 rounded-lg p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed border border-stone-200">`;
                
const benchFeedbackNew = `            {/* Bench Feedback */}
            {evaluation && (
              <div className="bg-white rounded-xl border border-stone-300 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2 font-serif-legal">
                      <Gavel className="w-4 h-4 text-amber-900" />
                      <span>বিজ্ঞ জাজদের ইন্টারভেনশন ও রায় (Judicial Interventions)</span>
                    </h4>
                    <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                      রাউন্ড {roundCount - 1}
                    </span>
                  </div>
                  <button 
                    onClick={() => downloadPDF('bench-feedback-result', 'Judicial_Intervention.pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors w-fit"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF ডাউনলোড</span>
                  </button>
                </div>
                <div id="bench-feedback-result" className="bg-stone-50 rounded-lg p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed border border-stone-200">`;
content = content.replace(benchFeedbackTarget, benchFeedbackNew);


// Viva feedback PDF
const vivaTarget = `            {/* Board Feedback Display */}
            {evaluation && (
              <div className="bg-white rounded-xl border border-amber-300 shadow-sm p-4 sm:p-5 space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2 font-serif-legal">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>ভাইভা বোর্ডের নম্বর ও পুঙ্খানুপুঙ্খ ফলাফল</span>
                </h4>
                <div className="bg-stone-50 rounded-lg p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed border border-stone-200">`;
                
const vivaNew = `            {/* Board Feedback Display */}
            {evaluation && (
              <div className="bg-white rounded-xl border border-amber-300 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-2">
                  <h4 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2 font-serif-legal">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span>ভাইভা বোর্ডের নম্বর ও পুঙ্খানুপুঙ্খ ফলাফল</span>
                  </h4>
                  <button 
                    onClick={() => downloadPDF('viva-feedback-result', 'Viva_Evaluation.pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors w-fit"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF ডাউনলোড</span>
                  </button>
                </div>
                <div id="viva-feedback-result" className="bg-stone-50 rounded-lg p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed border border-stone-200">`;
content = content.replace(vivaTarget, vivaNew);


fs.writeFileSync('src/components/MootCourtViva.tsx', content);
