import React, { useState, useRef } from 'react';
import Markdown from 'react-markdown';
import {
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  Download,
  Printer,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Upload,
  BookOpen,
  Scale,
  Sparkles,
  Maximize2,
  Minimize2,
  Bookmark,
  Share2,
  Check,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { PDFDocumentItem } from '../types';
import { playPcmAudio, stopCurrentAudio, speakTextWithBrowser } from '../lib/audioUtils';
import { downloadPDF } from '../lib/pdfUtils';

interface InAppPDFViewerProps {
  initialDocument?: PDFDocumentItem | null;
  savedDocuments?: PDFDocumentItem[];
  onClose?: () => void;
}

const SAMPLE_LEGAL_PDFS: PDFDocumentItem[] = [
  {
    id: 'sample-1',
    title: 'সংবিধান ও মৌলিক অধিকার: অনুচ্ছেদ ২৭ থেকে ৪৪ (Constitutional Rights)',
    subject: 'সংবিধান আইন',
    type: 'sample',
    createdAt: '2026-09-11',
    pageCount: 4,
    content: `
# বাংলাদেশের সংবিধান: মৌলিক অধিকার ও বিচারিক পর্যালোচনা
**লেখক/সংকলক:** আইনটিউট এআই (LawTutor AI Legal Research Desk)
**তারিখ:** ১১ সেপ্টেম্বর, ২০২৬

---

### ১. ভূমিকা (Introduction)
বাংলাদেশের সংবিধানের তৃতীয় ভাগে (অনুচ্ছেদ ২৭ থেকে ৪৪) নাগরিকদের মৌলিক অধিকারগুলোর গ্যারান্টি দেওয়া হয়েছে। এই অধিকারগুলো রাষ্ট্র কর্তৃক সংরক্ষিত এবং সুপ্রিম কোর্টের হাইকোর্ট বিভাগের রিট এখতিয়ারের (অনুচ্ছেদ ১০২) মাধ্যমে বলবৎযোগ্য।

### ২. অনুচ্ছেদ ২৭: আইনের চোখে সমতা (Equality Before Law)
> "সকল নাগরিক আইনের চোখে সমান এবং আইনের সমান আশ্রয় লাভের অধিকারী।"
* **ব্যাখ্যা:** এটি ফরমাল ইকুয়ালিটি এবং রিজনেবল ক্লাসিফিকেশন (যুক্তিসঙ্গত শ্রেণীবিভাগ) এর নীতি স্বীকার করে। সমান পরিস্থিতিতে অসমান আচরণ করা নিষিদ্ধ।

### ৩. অনুচ্ছেদ ৩১: আইনের আশ্রয় লাভের অধিকার (Protection of Law)
* যেকোনো স্থানে অবস্থানরত প্রত্যেক নাগরিকের আইন অনুযায়ী এবং কেবল আইন অনুযায়ী জীবন, স্বাধীনতা, শরীর, সুনাম বা সম্পত্তির সুরক্ষা পাওয়ার অধিকার রয়েছে।
* **ল্যান্ডমার্ক কেস:** *Kudrat-E-Elahi Panir v. Bangladesh (1992)* - প্রাকৃতিক ন্যায়বিচার ও আইনের সুরক্ষা।

### ৪. অনুচ্ছেদ ৩২: জীবন ও ব্যক্তি স্বাধীনতার অধিকার (Protection of Right to Life and Personal Liberty)
> "আইনানুযায়ী ব্যতিরেকে জীবন ও ব্যক্তি স্বাধীনতা হইতে কাউকে বঞ্চিত করা যাইবে না।"
* সুপ্রিম কোর্টের ঐতিহাসিক রায় অনুযায়ী, 'আইনানুযায়ী' বলতে শুধুমাত্র যেকোনো সংসদীয় আইন নয়, বরং ন্যায়সঙ্গত, ন্যায্য ও সৎ আইন (Just, Fair and Reasonable procedure) বোঝায়।

### ৫. অনুচ্ছেদ ১০২: হাইকোর্ট বিভাগের রিট এখতিয়ার (Writ Jurisdiction)
সংবিধানের ১০২ অনুচ্ছেদের অধীনে হাইকোর্ট বিভাগ নিম্নলিখিত রিট মঞ্জুর করতে পারে:
1. **Habeas Corpus (হেবিয়াস কর্পাস):** বেআইনি আটক থেকে মুক্তি।
2. **Mandamus (ম্যান্ডামাস):** জন কতর্ব্য পালনে বাধ্য করা।
3. **Certiorari (সার্টিওলারি):** বিচারিক ত্রুটি সংশোধনের জন্য নিম্ন আদালতের আদেশ বাতিল।
4. **Prohibition (প্রহিবিশন):** নিম্ন আদালতকে এখতিয়ার বহির্ভূত কাজ থেকে বিরত রাখা।
5. **Quo-Warranto (কো-ওয়ারেন্টো):** অবৈধ পদ দখল চ্যালেঞ্জ করা।

---
*উৎস: বাংলাদেশ সুপ্রিম কোর্ট গেজেট ও আইন টিউটার এআই ডেটাবিজ।*
    `
  },
  {
    id: 'sample-2',
    title: 'সম্পত্তি হস্তান্তর আইন, ১৮৮২: ধারা ৫৪ - বিক্রয় ও চুক্তি (Transfer of Property)',
    subject: 'সম্পত্তি হস্তান্তর আইন',
    type: 'sample',
    createdAt: '2026-09-11',
    pageCount: 3,
    content: `
# সম্পত্তি হস্তান্তর আইন, ১৮৮২ (Transfer of Property Act)
## ধারা ৫৪: বিক্রয় (Sale) ও বিক্রয়ের চুক্তি (Contract for Sale)

### ১. সংজ্ঞা ও আইনি বিধান
* **বিক্রয় (Sale):** বিক্রয় হলো মূল্যের বিনিময়ে মালিকানা হস্তান্তর। ১০০ টাকা বা তদূর্ধ্ব মূল্যের স্থাবর সম্পত্তি বিক্রয়ের ক্ষেত্রে অবশ্যই রেজিস্ট্রিকৃত দলিল দ্বারা সম্পন্ন হতে হবে (রেজিস্ট্রেশন আইনের ১৭ ধারা অনুযায়ী)।
* **বিক্রয়ের চুক্তি (Contract for Sale):** এটি সম্পত্তির মালিকানা হস্তান্তর করে না, বরং ভবিষ্যতে বিক্রয় সম্পন্ন করার একটি চুক্তি মাত্র।

### ২. মূল উপাদানসমূহ (Essential Ingredients)
1. ক্রেতা ও বিক্রেতার আইনগত সক্ষমতা।
2. নির্দিষ্ট স্থাবর বা অস্থাবর সম্পত্তি।
3. অর্থের মূল্য (Price / Consideration)।
4. হস্তান্তর প্রক্রিয়া (Mode of Transfer)।

### ৩. ল্যান্ডমার্ক বিচারিক সিদ্ধান্ত
* রেজিস্ট্রেশন ছাড়া কেবল বায়নাপত্র বা চুক্তির মাধ্যমে স্থাবর সম্পত্তির স্বত্ব (Title) হস্তান্তরিত হয় না, তবে দখল সুরক্ষার অধিকার জন্মায়।
* *সুনির্দিষ্ট প্রতিকার আইনের ২৭এ ধারা* অনুযায়ী বিক্রয়ের চুক্তির Specific Performance (সুনির্দিষ্ট পারফর্ম্যান্স) চাওয়া যায়।
    `
  },
  {
    id: 'sample-3',
    title: 'বিখ্যাত কেস ব্রিফ: Mohori Bibee v. Dharmodas Ghose (1903)',
    subject: 'চুক্তি আইন / জুনিয়র ভাইভা',
    type: 'sample',
    createdAt: '2026-09-11',
    pageCount: 3,
    content: `
# FIRAC Case Brief: Mohori Bibee v. Dharmodas Ghose (1903) ILR 30 Cal 539 (PC)

### ১. মামলার শিরোনাম ও বিবরণ (Case Title & Citation)
* **মামলা:** মোহরি বিবি বনাম ধর্মদাস ঘোষ (১৯০৩)
* **আদালত:** প্রিভি কাউন্সিল (Privy Council)
* **মূল বিষয়:** নাবালকের সাথে চুক্তি (Agreement with a Minor)

### ২. ঘটনার বিবরণ (Facts of the Case)
বাদী ধর্মদাস ঘোষ (একজন নাবালক) তার স্থাবর সম্পত্তি বন্ধক রেখে ব্রাহ্মোহ দত্তর (একজন অর্থলগ্নিকারী) কাছ থেকে ২০,০০০ টাকা ঋণ নেন। তৎকালীন সময়ে ব্রাক্ষোহ দত্তের পক্ষে তার এজেন্ট কুন্দা লাল বিষয়টি পরিচালনা করছিলেন। ঋণগ্রহীতা যে নাবালক, তা ঋণদাতা ও তার এজেন্টের জানা ছিল। পরবর্তীতে ধর্মদাস ঘোষের মা (মোহরি বিবি) অভিভাবক হিসেবে মামলা করেন যে চুক্তিটি বাতিল ঘোষণা করা হোক কারণ চুক্তি করার সময় ধর্মদাস নাবালক ছিলেন।

### ৩. আইনি সমস্যা (Legal Issues)
* নাবালকের সাথে সম্পাদিত চুক্তি কি কেবল বাতিলযোগ্য (Voidable) নাকি প্রথম থেকেই সম্পূর্ণ অবৈধ ও অকার্যকর (Void ab initio)?
* ভারতীয় চুক্তি আইনের ১১ ধারা অনুযায়ী নাবালকের চুক্তির বৈধতা কী?

### ৪. সিদ্ধান্ত ও অনুপাত ডিসিডেন্ডি (Ratio Decidendi / Judgment)
প্রিভি কাউন্সিল রায় দেয় যে:
1. চুক্তি আইনের ১১ ধারা অনুযায়ী চুক্তি করার জন্য সাবালক হওয়া আবশ্যক।
2. নাবালকের সাথে সম্পাদিত চুক্তি **Void ab initio** (প্রথম থেকেই সম্পূর্ণ শূন্য বা বাতিল)।
3. সুতরাং, নাবালকের বন্ধকি চুক্তি আইনগতভাবে বলবৎযোগ্য নয়।
    `
  }
];

export const InAppPDFViewer: React.FC<InAppPDFViewerProps> = ({
  initialDocument,
  savedDocuments = [],
  onClose
}) => {
  const [documents, setDocuments] = useState<PDFDocumentItem[]>([
    ...SAMPLE_LEGAL_PDFS,
    ...savedDocuments
  ]);
  const [activeDocId, setActiveDocId] = useState<string>(
    initialDocument ? initialDocument.id : documents[0]?.id || ''
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'paper' | 'sepia' | 'dark'>('paper');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If initialDocument passed and not in list, add it
  React.useEffect(() => {
    if (initialDocument) {
      setDocuments(prev => {
        if (!prev.some(d => d.id === initialDocument.id)) {
          return [initialDocument, ...prev];
        }
        return prev;
      });
      setActiveDocId(initialDocument.id);
    }
  }, [initialDocument]);

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 180));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoomLevel(100);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const textContent = event.target?.result as string || `[Uploaded file: ${file.name}]`;
      const newDoc: PDFDocumentItem = {
        id: `upload-${Date.now()}`,
        title: file.name,
        subject: 'আপলোডকৃত ডকুমেন্ট',
        type: 'upload',
        createdAt: new Date().toLocaleDateString('bn-BD'),
        pageCount: 1,
        content: textContent.startsWith('data:') ? `### আপলোডকৃত ফাইল: ${file.name}\n\n[বাইনারি পিডিএফ ফাইল সফলভাবে লোড হয়েছে]` : textContent
      };
      setDocuments(prev => [newDoc, ...prev]);
      setActiveDocId(newDoc.id);
    };
    if (file.type.includes('pdf')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handlePlayTTS = async () => {
    if (!activeDoc) return;
    if (isPlayingAudio) {
      stopCurrentAudio();
      setIsPlayingAudio(false);
      return;
    }

    stopCurrentAudio();
    setIsPlayingAudio(true);

    try {
      const plainText = activeDoc.content.replace(/[#_*>`-]/g, '').slice(0, 1500);
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: plainText, voice: 'Zephyr' }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        await playPcmAudio(data.audioBase64, data.sampleRate || 24000);
        setIsPlayingAudio(false);
      } else {
        speakTextWithBrowser(plainText, () => setIsPlayingAudio(false));
      }
    } catch (e) {
      speakTextWithBrowser(activeDoc.content.slice(0, 1000), () => setIsPlayingAudio(false));
    }
  };

  const handleDownloadCurrentPDF = () => {
    if (!activeDoc) return;
    downloadPDF('pdf-reader-content-box', `${activeDoc.title.replace(/\s+/g, '_')}.pdf`);
  };

  const handleCopyText = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeClasses = {
    paper: 'bg-stone-50 text-stone-900 border-stone-300',
    sepia: 'bg-[#fbf0d9] text-[#4a3b2c] border-[#d8c29d]',
    dark: 'bg-stone-900 text-stone-100 border-stone-700'
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-stone-900 text-stone-100 overflow-hidden">
      {/* Top PDF Reader Header Bar */}
      <div className="bg-stone-950 px-4 py-3 border-b border-amber-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="ডকুমেন্ট তালিকা ও লাইব্রেরি"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">লাইব্রেরি</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-300 truncate max-w-xs sm:max-w-md font-serif-legal">
                {activeDoc?.title || 'আইনি ডকুমেন্ট রিডার'}
              </h2>
              <p className="text-[10px] text-stone-400">
                {activeDoc?.subject || 'আইনি গবেষণা ও নথি'} • ইন-অ্যাপ পিডিএফ ভিউয়ার
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setTheme('paper')}
              className={`px-2 py-1 rounded-lg transition-colors ${theme === 'paper' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'}`}
            >
              সাদা কাগজ
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2 py-1 rounded-lg transition-colors ${theme === 'sepia' ? 'bg-[#d8c29d] text-stone-950 font-bold' : 'text-stone-300 hover:text-white'}`}
            >
              সেপিয়া
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2 py-1 rounded-lg transition-colors ${theme === 'dark' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-300 hover:text-white'}`}
            >
              ডার্ক
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-stone-900 px-2 py-1 rounded-xl border border-stone-800 text-xs text-stone-300">
            <button onClick={handleZoomOut} className="p-1 hover:text-amber-400" title="জুম আউট">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono">{zoomLevel}%</span>
            <button onClick={handleZoomIn} className="p-1 hover:text-amber-400" title="জুম ইন">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handlePlayTTS}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${isPlayingAudio ? 'bg-red-600 text-white animate-pulse' : 'bg-stone-800 hover:bg-stone-700 text-amber-300'}`}
            title="অডিও শুনুন (Text-to-Speech)"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden lg:inline">{isPlayingAudio ? 'বন্ধ করুন' : 'শুনুন'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
            title="টেক্সট কপি করুন"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownloadCurrentPDF}
            className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title="ডাউনলোড পিডিএফ"
          >
            <Download className="w-4 h-4" />
            <span>ডাউনলোড</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-red-900/50 text-stone-300 hover:text-red-300 text-xs transition-colors"
            >
              বন্ধ করুন
            </button>
          )}
        </div>
      </div>

      {/* Main Container: Sidebar + PDF Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        {sidebarOpen && (
          <aside className="w-72 bg-stone-950 border-r border-stone-800 flex flex-col shrink-0 z-10 transition-all">
            <div className="p-3 border-b border-stone-800 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>আইনি নথিপত্র ও লাইব্রেরি</span>
              </span>
              <label className="cursor-pointer px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-[11px] font-bold flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>আপলোড</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.doc,.docx"
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-2 border-b border-stone-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="নথি খুঁজুন..."
                  className="w-full bg-stone-900 text-xs text-stone-200 pl-8 pr-3 py-1.5 rounded-lg border border-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {documents
                .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || (d.subject && d.subject.toLowerCase().includes(searchQuery.toLowerCase())))
                .map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-1 ${
                      activeDocId === doc.id
                        ? 'bg-amber-600/20 border border-amber-500/50 text-amber-300 font-bold'
                        : 'text-stone-300 hover:bg-stone-900 hover:text-stone-100 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{doc.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-amber-400 shrink-0 font-mono">
                        {doc.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 flex items-center justify-between">
                      <span>{doc.subject || 'আইন নথি'}</span>
                      <span>{doc.createdAt}</span>
                    </div>
                  </button>
                ))}
            </div>

            <div className="p-3 border-t border-stone-800 text-center text-[10px] text-stone-400">
              LawTutor AI Secure PDF Engine (2026)
            </div>
          </aside>
        )}

        <div className="flex-1 bg-stone-800/80 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div
            id="pdf-reader-content-box"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className={`w-full max-w-4xl min-h-[850px] p-8 sm:p-12 rounded-2xl shadow-2xl border transition-transform duration-200 ${themeClasses[theme]}`}
          >
            <div className="border-b-2 border-stone-400/40 pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-stone-950 flex items-center justify-center font-bold font-serif-legal">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif-legal">LAW-TUTOR AI OFFICIAL LEGAL GAZETTE</h3>
                  <p className="text-xs opacity-75">বার কাউন্সিল ও জুডিসিয়ারি প্রস্তুতি সংকলন • ডিজিটাল নথি আইডি: #{activeDoc?.id || '2026'}</p>
                </div>
              </div>
              <div className="text-right text-xs font-mono opacity-80">
                <p>তারিখ: {activeDoc?.createdAt || '১১ সেপ্টেম্বর, ২০২৬'}</p>
                <p>পৃষ্ঠা: ১ / {activeDoc?.pageCount || 3}</p>
              </div>
            </div>

            <div className="prose prose-stone max-w-none font-serif-legal text-sm sm:text-base leading-relaxed">
              <Markdown>{activeDoc?.content || 'কোনো বিষয়বস্তু পাওয়া যায়নি।'}</Markdown>
            </div>

            <div className="mt-16 pt-6 border-t border-stone-400/30 flex flex-col sm:flex-row items-center justify-between text-xs opacity-70 gap-2">
              <div>
                <p className="font-bold">LawTutor AI - সহকারী আইন শিক্ষক (১৫ বিষয়)</p>
                <p>Developer: Sohel Ahmed, LAW Student, Satkhira LAW College</p>
              </div>
              <div className="font-mono text-[10px] bg-stone-500/10 px-3 py-1 rounded-full border border-stone-400/20">
                VERIFIED JUDICIAL RESEARCH DOCUMENT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
