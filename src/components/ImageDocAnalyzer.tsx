import React, { useState, useRef } from 'react';
import Markdown from 'react-markdown';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Download, 
  X, 
  Loader2, 
  BookOpen, 
  HelpCircle,
  Camera
} from 'lucide-react';
import { playPcmAudio, stopCurrentAudio, speakTextWithBrowser } from '../lib/audioUtils';
import { downloadPDF } from '../lib/pdfUtils';

import { PDFDocumentItem } from '../types';

interface ImageDocAnalyzerProps {
  onOpenPDFViewer?: (doc: PDFDocumentItem) => void;
}

export const ImageDocAnalyzer: React.FC<ImageDocAnalyzerProps> = ({ onOpenPDFViewer }) => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedImageMime, setSelectedImageMime] = useState<string>('image/jpeg');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<'explain' | 'exam_solve' | 'summary' | 'case_extract'>('explain');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setSelectedImageBase64(base64Data);
      setSelectedImageMime(file.type || 'image/jpeg');
      setImagePreviewUrl(result);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImageBase64) return;
    setAnalyzing(true);
    setAnalysisResult(null);
    stopCurrentAudio();
    setIsPlayingAudio(false);

    try {
      const response = await fetch('/api/gemini/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImageBase64,
          imageMimeType: selectedImageMime,
          taskType
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setAnalysisResult(`⚠️ **বিশ্লেষণে সমস্যা হয়েছে:** ${err.message || 'অনুগ্রহ করে পরিষ্কার ছবি আপলোড করে আবার চেষ্টা করুন।'}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePlayTTS = async () => {
    if (!analysisResult) return;
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
        body: JSON.stringify({ text: analysisResult.slice(0, 1200), voice: 'Zephyr' }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        await playPcmAudio(data.audioBase64, data.sampleRate || 24000);
        setIsPlayingAudio(false);
      } else {
        speakTextWithBrowser(analysisResult, () => setIsPlayingAudio(false));
      }
    } catch (e) {
      speakTextWithBrowser(analysisResult, () => setIsPlayingAudio(false));
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!analysisResult) return;
    const blob = new Blob([analysisResult], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LawTutor_Doc_Analysis_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearUpload = () => {
    setSelectedImageBase64(null);
    setImagePreviewUrl(null);
    setAnalysisResult(null);
    stopCurrentAudio();
    setIsPlayingAudio(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex-1 overflow-y-auto w-full h-full relative">
      <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <ImageIcon className="w-4 h-4" />
          <span>মাল্টিমোডাল লিগ্যাল ভিশন স্ক্যানার</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-legal text-stone-50">
          বইয়ের পাতা, নোট ও পরীক্ষার প্রশ্ন বিশ্লেষণ
        </h2>
        <p className="text-sm text-stone-300 max-w-2xl mt-1.5">
          আইনের মূল বইয়ের কঠিন পাতা, জটিল ধারা, হ্যান্ডরিটেন নোট বা বিগত বছরের পরীক্ষার প্রশ্নের ছবি আপলোড করুন।
          এআই শিক্ষক ছবি থেকে টেক্সট পড়ে আপনাকে পয়েন্টভিত্তিক সহজ ব্যাখ্যা ও মডেল উত্তর বানিয়ে দেবে।
        </p>
      </div>

      {/* Task Goal Selector */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
          বিশ্লেষণের উদ্দেশ্য নির্বাচন করুন:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => setTaskType('explain')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              taskType === 'explain'
                ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-500/20'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span className="text-sm">১. বইয়ের সহজ ব্যাখ্যা</span>
            </div>
            <p className="text-xs text-stone-500">ধারা ও ধারণার সহজ বাংলা বিশ্লেষণ</p>
          </button>

          <button
            onClick={() => setTaskType('exam_solve')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              taskType === 'exam_solve'
                ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-500/20'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-amber-700" />
              <span className="text-sm">২. পরীক্ষার প্রশ্নের সমাধান</span>
            </div>
            <p className="text-xs text-stone-500">ইস্যু, রুলস ও মডেল উত্তর ড্রাফট</p>
          </button>

          <button
            onClick={() => setTaskType('summary')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              taskType === 'summary'
                ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-500/20'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span className="text-sm">৩. সারসংক্ষেপ ও রিভিশন</span>
            </div>
            <p className="text-xs text-stone-500">মুখস্থ করার ৫টি মূল বুলেট পয়েন্ট</p>
          </button>

          <button
            onClick={() => setTaskType('case_extract')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              taskType === 'case_extract'
                ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-500/20'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span className="text-sm">৪. কেস রায় বিশ্লেষণ (FIRAC)</span>
            </div>
            <p className="text-xs text-stone-500">Facts, Issues, Ratio Decidendi</p>
          </button>
        </div>
      </div>

      {/* Main Upload & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Upload Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center justify-between">
              <span>ডকুমেন্ট বা ছবি নির্বাচন</span>
              {imagePreviewUrl && (
                <button
                  onClick={clearUpload}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন</span>
                </button>
              )}
            </h3>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="doc-image-upload-input"
            />

            {!imagePreviewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/40 rounded-2xl p-8 text-center cursor-pointer transition-colors space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    ছবি আপলোড করতে ক্লিক করুন বা টেনে আনুন
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    বইয়ের পাতা, নোট, প্রশ্নপত্র, বা আইনের ডকুমেন্টের স্পষ্ট ছবি (JPG, PNG)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 max-h-80 flex items-center justify-center">
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded Document"
                    className="w-full h-auto object-contain max-h-80"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>ছবি সফলভাবে লোড হয়েছে</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-amber-700 hover:underline font-medium"
                  >
                    অন্য ছবি বাছাই করুন
                  </button>
                </div>
              </div>
            )}

            {/* Analyze Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedImageBase64 || analyzing}
              id="analyze-doc-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>আইন শিক্ষক ডকুমেন্ট বিশ্লেষণ করছেন...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>ছবি থেকে আইনি বিশ্লেষণ তৈরি করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Analysis Output */}
        <div className="lg:col-span-7">
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-stone-200 shadow-xs min-h-[420px] flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-700" />
                <span>আইনি বিশ্লেষণ ও স্টাডি নোট</span>
              </h3>

              {analysisResult && (
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
                        <span>ভয়েস শুনুন</span>
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
                    title="ডাউনলোড নোট"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Content Display */}
            <div className="flex-1">
              {analysisResult && !analyzing && (
                <div className="flex justify-end mb-4 gap-2">
                  <button 
                    onClick={() => downloadPDF('image-ai-response', 'AI_Document_Analysis.pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF ডাউনলোড</span>
                  </button>
                  {onOpenPDFViewer && analysisResult && (
                    <button
                      onClick={() => onOpenPDFViewer({
                        id: `doc-analysis-${Date.now()}`,
                        title: 'আইনি বিশ্লেষণ ও স্টাডি নোট (AI Document Analysis)',
                        subject: 'বই ও প্রশ্ন স্ক্যান',
                        type: 'analysis',
                        content: analysisResult,
                        createdAt: new Date().toLocaleDateString('bn-BD'),
                        pageCount: 2
                      })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition-colors"
                      title="ইন-অ্যাপ পিডিএফ রিডারে পড়ুন"
                    >
                      <FileText className="w-4 h-4 text-amber-700" />
                      <span>পিডিএফ রিডার</span>
                    </button>
                  )}
                </div>
              )}
              {analyzing ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 text-stone-500">
                  <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
                  <p className="text-sm font-semibold text-stone-800">
                    এআই শিক্ষক ডকুমেন্টের আইনি বিষয়বস্তু নিবিড়ভাবে বিশ্লেষণ করছেন...
                  </p>
                  <p className="text-xs text-stone-500 max-w-sm">
                    ধারা ও উপধারা চিহ্নিতকরণ, সংশ্লিষ্ট নজির অনুসন্ধান ও সহজ বাংলায় ব্যাখ্যা গোছানো হচ্ছে।
                  </p>
                </div>
              ) : analysisResult ? (
                <div id="image-ai-response" className="markdown-body text-stone-900 leading-relaxed text-sm p-4 bg-white rounded-lg">
                  <Markdown>{analysisResult}</Markdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 text-stone-400">
                  <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-700">কোনো বিশ্লেষণ তৈরি হয়নি</h4>
                    <p className="text-xs text-stone-500 max-w-xs mt-1">
                      বামে বইয়ের পাতা বা প্রশ্নের ছবি আপলোড করে "বিশ্লেষণ তৈরি করুন" বাটনে ক্লিক করুন।
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
