import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  FileCheck, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Download, 
  Loader2, 
  HelpCircle,
  Scale,
  FileText
} from 'lucide-react';
import { playPcmAudio, stopCurrentAudio, speakTextWithBrowser } from '../lib/audioUtils';
import { downloadPDF } from '../lib/pdfUtils';
import { PDFDocumentItem } from '../types';

interface CaseBrieferProps {
  onOpenPDFViewer?: (doc: PDFDocumentItem) => void;
}

const FAMOUS_CASES = [
  { name: 'Reg v. Govinda (1876)', desc: 'খুন বনাম নির্দোষ নরহত্যার মেলভিল বিচারপতির পার্থক্যসূত্র' },
  { name: 'Ashby v. White (1703)', desc: 'Injuria Sine Damno ও ভোটাধিকারের ঐতিহাসিক কেস' },
  { name: 'Donoghue v. Stevenson (1932)', desc: 'টর্ট আইনে অবহেলা (Negligence) ও নেইবার প্রিন্সিপাল' },
  { name: 'Mohori Bibee v. Dharmodas Ghose (1903)', desc: 'নাবালকের সাথে চুক্তির সম্পূর্ণ অকার্যকারিতা (Void ab initio)' },
  { name: 'Pakala Narayana Swami v. Emperor (1939)', desc: 'সাক্ষ্য আইনের মৃত্যুকালীন ঘোষণা ও জবানবন্দি' },
  { name: 'Kudrat-E-Elahi Panir v. Bangladesh (1992)', desc: 'সংবিধানের মৌলিক কাঠামো ও স্থানীয় সরকার ব্যবস্থা' },
  { name: 'Maneka Gandhi v. Union of India (1978)', desc: 'অনুচ্ছেদ ২১ - জীবনের অধিকার ও প্রাকৃতিক ন্যায়বিচার' },
  { name: 'Rylands v. Fletcher (1868)', desc: 'টর্ট আইনে কঠোর দায় (Strict Liability) নীতি' }
];

export const CaseBriefer: React.FC<CaseBrieferProps> = ({ onOpenPDFViewer }) => {
  const [caseInput, setCaseInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [briefResult, setBriefResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleGenerateBrief = async (caseName?: string) => {
    const targetCase = caseName || caseInput;
    if (!targetCase.trim()) return;

    setLoading(true);
    setBriefResult(null);
    stopCurrentAudio();
    setIsPlayingAudio(false);

    try {
      const res = await fetch('/api/gemini/case-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseNameOrFacts: targetCase }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setBriefResult(data.caseBrief);
    } catch (err: any) {
      setBriefResult(`⚠️ কেস ব্রিফ তৈরিতে সমস্যা হয়েছে: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTTS = async () => {
    if (!briefResult) return;
    if (isPlayingAudio) {
      stopCurrentAudio();
      setIsPlayingAudio(false);
      return;
    }

    stopCurrentAudio();
    setIsPlayingAudio(true);

    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: briefResult.slice(0, 1200), voice: 'Zephyr' }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        await playPcmAudio(data.audioBase64, data.sampleRate || 24000);
        setIsPlayingAudio(false);
      } else {
        speakTextWithBrowser(briefResult, () => setIsPlayingAudio(false));
      }
    } catch (e) {
      speakTextWithBrowser(briefResult, () => setIsPlayingAudio(false));
    }
  };

  const handleCopy = () => {
    if (!briefResult) return;
    navigator.clipboard.writeText(briefResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!briefResult) return;
    downloadPDF('case-brief-result', `Case_Brief_${Date.now()}.pdf`);
  };

  return (
    <div className="flex-1 overflow-y-auto w-full h-full relative">
      <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Scale className="w-4 h-4" />
          <span>স্মার্ট লিগ্যাল কেস ব্রিফার (FIRAC Case Briefer)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-legal text-stone-50">
          মামলার রায় ও নজিরের কাঠামোবদ্ধ বিশ্লেষণ
        </h2>
        <p className="text-sm text-stone-300 max-w-2xl mt-1.5">
          যেকোনো বিখ্যাত মামলার নাম লিখুন অথবা পরীক্ষার কোনো কাল্পনিক আইনি ঘটনার সারসংক্ষেপ দিন।
          এআই শিক্ষক মুহূর্তেই আন্তর্জাতিক মানসম্পন্ন <strong>FIRAC</strong> (Facts, Issues, Rules, Analysis, Conclusion, Ratio Decidendi) ব্রিফ তৈরি করে দেবে।
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
          মামলার নাম বা আইনি সমস্যার বিবরণ লিখুন:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={caseInput}
            onChange={(e) => setCaseInput(e.target.value)}
            placeholder="যেমন: Reg v. Govinda, Donoghue v. Stevenson অথবা 'রহিম করিমকে না জানিয়ে তার জমি বিক্রি করে দেয়...'"
            className="flex-1 bg-stone-50 text-stone-900 text-sm rounded-xl px-4 py-3 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600"
          />
          <button
            onClick={() => handleGenerateBrief()}
            disabled={!caseInput.trim() || loading}
            id="generate-case-brief-btn"
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>কেস বিশ্লেষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>কেস ব্রিফ তৈরি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Famous Precedent Suggestions */}
        <div className="pt-3 border-t border-stone-100">
          <p className="text-xs font-semibold text-stone-500 mb-2">
            অথবা বহুল আলোচিত ল্যান্ডমার্ক মামলা নির্বাচন করুন:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {FAMOUS_CASES.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setCaseInput(c.name);
                  handleGenerateBrief(c.name);
                }}
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 text-left border border-stone-200 hover:border-amber-300 transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-stone-900 truncate">{c.name}</div>
                <div className="text-[11px] text-stone-500 truncate mt-0.5">{c.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Brief Result Display */}
      {briefResult && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 flex-wrap gap-2">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-700" />
              <span>কাঠামোবদ্ধ কেস ব্রিফ (Structured FIRAC Brief)</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayTTS}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isPlayingAudio
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                    <span>থামান</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ভয়েসে শুনুন</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs transition-colors"
                title="কপি করুন"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleDownload}
                className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs transition-colors"
                title="ডাউনলোড ব্রিফ"
              >
                <Download className="w-4 h-4" />
              </button>

              {onOpenPDFViewer && (
                <button
                  onClick={() => onOpenPDFViewer({
                    id: `case-${Date.now()}`,
                    title: `কেস ব্রিফ: ${caseInput || 'লিগ্যাল কেস'}`,
                    subject: 'কেস ব্রিফার (FIRAC)',
                    type: 'case_brief',
                    content: briefResult,
                    createdAt: new Date().toLocaleDateString('bn-BD'),
                    pageCount: 3
                  })}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="ইন-অ্যাপ পিডিএফ রিডারে পড়ুন"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>পিডিএফ রিডার</span>
                </button>
              )}
            </div>
          </div>

          <div id="case-brief-result" className="markdown-body text-sm text-stone-900 leading-relaxed p-4 bg-white rounded-lg">
            <Markdown>{briefResult}</Markdown>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
