import React, { useState } from 'react';
import { ScrollText, FileEdit, CheckCircle, Copy, Sparkles, ShieldCheck, Scale, AlertCircle, Download, FileText } from 'lucide-react';
import { DRAFTING_TEMPLATES } from '../data/lawData';
import { downloadPDF } from '../lib/pdfUtils';
import { DraftingTemplate, PDFDocumentItem } from '../types';

interface DraftingEthicsProps {
  onOpenPDFViewer?: (doc: PDFDocumentItem) => void;
}

export const DraftingEthics: React.FC<DraftingEthicsProps> = ({ onOpenPDFViewer }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DraftingTemplate>(DRAFTING_TEMPLATES[0]);
  const [activeCategory, setActiveCategory] = useState<'civil' | 'criminal' | 'ethics'>('civil');
  const [customFacts, setCustomFacts] = useState('');
  const [courtName, setCourtName] = useState('');
  const [parties, setParties] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredTemplates = DRAFTING_TEMPLATES.filter(
    (t) => activeCategory === 'ethics' ? t.type === 'ethics' : t.type === activeCategory
  );

  const handleGenerateCustomDraft = async () => {
    if (!customFacts.trim()) return;
    setIsLoading(true);
    setGeneratedDraft('');

    try {
      const res = await fetch('/api/gemini/drafting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftType: selectedTemplate.titleBn,
          facts: customFacts,
          parties: parties || undefined,
          courtName: courtName || undefined,
          statutorySections: selectedTemplate.statuteReference
        })
      });

      const data = await res.json();
      if (data.draft) {
        setGeneratedDraft(data.draft);
      } else {
        setGeneratedDraft(data.error || 'ড্রাফট তৈরি করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      setGeneratedDraft('সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (text: string, title: string) => {
    downloadPDF('drafting-result-box', `${title.replace(/\s+/g, '_')}_Draft.pdf`);
  };

  return (
    <div className="flex-1 overflow-y-auto w-full h-full relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Hero Intro */}
      <div className="bg-gradient-to-r from-teal-900/90 to-stone-900 text-stone-100 p-5 sm:p-6 rounded-2xl border border-teal-700/30 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-teal-500/20 text-teal-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-teal-500/30 flex items-center gap-1">
                <ScrollText className="w-3.5 h-3.5" /> ১৪. সিভিল ও ক্রিমিনাল ড্রাফটিং এবং প্রফেশনাল এথিকস
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-legal text-stone-100">
              আদালতের দরখাস্ত ও আরজি ড্রাফটিং ল্যাব ও পেশাগত আচরণবিধি
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl">
              দেওয়ানি আরজি, লিখিত জবাব, অস্থায়ী নিষেধাজ্ঞা, সি.আর মামলা, মহানগর দায়রা জামিন ও চেক ডিজঅনারের জন্য তৈরি ড্রাফট এবং বার কাউন্সিল বিধিমালা।
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        <button
          id="btn-cat-civil"
          onClick={() => {
            setActiveCategory('civil');
            setSelectedTemplate(DRAFTING_TEMPLATES.find((t) => t.type === 'civil') || DRAFTING_TEMPLATES[0]);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeCategory === 'civil'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>সিভিল ড্রাফটিং (Civil Drafting)</span>
        </button>

        <button
          id="btn-cat-criminal"
          onClick={() => {
            setActiveCategory('criminal');
            setSelectedTemplate(DRAFTING_TEMPLATES.find((t) => t.type === 'criminal') || DRAFTING_TEMPLATES[2]);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeCategory === 'criminal'
              ? 'bg-rose-700 text-white shadow-sm'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>ক্রিমিনাল ড্রাফটিং (Criminal Drafting)</span>
        </button>

        <button
          id="btn-cat-ethics"
          onClick={() => {
            setActiveCategory('ethics');
            setSelectedTemplate(DRAFTING_TEMPLATES.find((t) => t.type === 'ethics') || DRAFTING_TEMPLATES[4]);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeCategory === 'ethics'
              ? 'bg-amber-700 text-white shadow-sm'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>প্রফেশনাল এথিকস (Bar Council Rules)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Selector & AI Custom Generator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-teal-700" />
              <span>স্ট্যান্ডার্ড ড্রাফট টেমপ্লেট নির্বাচন করুন</span>
            </h3>
            <div className="space-y-2">
              {filteredTemplates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedTemplate.id === t.id
                      ? 'border-teal-600 bg-teal-50/70 shadow-sm'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  <p className="font-semibold text-xs sm:text-sm text-stone-900">{t.titleBn}</p>
                  <p className="text-[11px] text-teal-800 font-medium">{t.statuteReference}</p>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Custom Drafter */}
          {activeCategory !== 'ethics' && (
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 text-stone-100 rounded-xl p-4 border border-stone-800 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-sm font-bold">এআই দিয়ে কাস্টম ড্রাফট প্রস্তুত করুন</h3>
              </div>
              <p className="text-xs text-stone-400">
                আপনার ঘটনা ও মোকদ্দমার বিবরণ লিখুন, এআই স্বয়ংক্রিয়ভাবে আদালতের জন্য আরজি/দরখাস্ত তৈরি করবে।
              </p>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] text-stone-300 font-medium">আদালতের নাম (ঐচ্ছিক):</label>
                  <input
                    type="text"
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    placeholder="যেমন: বিজ্ঞ ১ম আদালত সিনিয়র সহকারী জজ, ঢাকা"
                    className="w-full bg-stone-800 border border-stone-700 text-stone-100 text-xs rounded-lg p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-300 font-medium">পক্ষসমূহের নাম (ঐচ্ছিক):</label>
                  <input
                    type="text"
                    value={parties}
                    onChange={(e) => setParties(e.target.value)}
                    placeholder="যেমন: মোঃ করিম (বাদী) বনাম আব্দুর রহমান (বিবাদী)"
                    className="w-full bg-stone-800 border border-stone-700 text-stone-100 text-xs rounded-lg p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-300 font-medium">মোকদ্দমার মূল ঘটনা ও কারণ:</label>
                  <textarea
                    rows={4}
                    value={customFacts}
                    onChange={(e) => setCustomFacts(e.target.value)}
                    placeholder="আপনার মক্কেলের ঘটনা বিস্তারিত লিখুন (যেমন: জমি কেনার তারিখ, দলিল নং, বেদখলের তারিখ, বা চেক ডিজঅনারের তথ্য)..."
                    className="w-full bg-stone-800 border border-stone-700 text-stone-100 text-xs rounded-lg p-2 focus:border-teal-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  id="btn-generate-draft"
                  onClick={handleGenerateCustomDraft}
                  disabled={isLoading || !customFacts.trim()}
                  className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ড্রাফট তৈরি হচ্ছে...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>পূর্ণাঙ্গ ড্রাফট তৈরি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Draft Preview & Formatter */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900 font-serif-legal">
                  {generatedDraft ? 'এআই জেনারেটেড কাস্টম ড্রাফট' : selectedTemplate.titleBn}
                </h3>
                <p className="text-xs text-teal-700 font-medium">{selectedTemplate.statuteReference}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-copy-draft"
                  onClick={() => handleCopy(generatedDraft || selectedTemplate.templateFormat)}
                  className="flex items-center gap-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-medium border border-stone-300 transition-colors"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>

                <button
                  id="btn-download-draft"
                  onClick={() => handleDownload(generatedDraft || selectedTemplate.templateFormat, selectedTemplate.titleBn)}
                  className="flex items-center gap-1 text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 px-3 py-1.5 rounded-lg font-medium border border-teal-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডাউনলোড</span>
                </button>

                {onOpenPDFViewer && (
                  <button
                    onClick={() => onOpenPDFViewer({
                      id: `draft-${Date.now()}`,
                      title: selectedTemplate.titleBn,
                      subject: selectedTemplate.statuteReference,
                      type: 'draft',
                      content: generatedDraft || selectedTemplate.templateFormat,
                      createdAt: new Date().toLocaleDateString('bn-BD'),
                      pageCount: 2
                    })}
                    className="flex items-center gap-1 text-xs bg-amber-600 hover:bg-amber-700 text-stone-950 px-3 py-1.5 rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>পিডিএফ রিডার</span>
                  </button>
                )}
              </div>
            </div>

            {/* Template Box */}
            <div id="drafting-result-box" className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200 font-mono text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
              {generatedDraft || selectedTemplate.templateFormat}
            </div>

            {/* Practical Advice Banner */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">আইনি ড্রাফটিং সতর্কতা:</span> আরজি বা দরখাস্তে মোকদ্দমার কারণ (Cause of Action) উৎপন্ন হওয়ার সুনির্দিষ্ট তারিখ, কোর্ট ফি এবং হলফনামার সত্যপাঠ অবশ্যই পুঙ্খানুপুঙ্খভাবে যাচাই করে আদালতে দাখিল করবেন।
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
