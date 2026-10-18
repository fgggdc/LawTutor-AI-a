import React, { useState } from 'react';
import { Search, BookOpen, Scale, Sparkles, HelpCircle, ArrowRight, CheckCircle2, X, Download, FileText } from 'lucide-react';
import { downloadPDF } from '../lib/pdfUtils';
import Markdown from 'react-markdown';
import { LawSubjectId, LawSectionItem, PDFDocumentItem } from '../types';
import { POPULAR_SECTIONS, LAW_SUBJECTS } from '../data/lawData';

interface SectionFinderProps {
  onAskTutor: (query: string, subjectId: LawSubjectId) => void;
  onOpenPDFViewer?: (doc: PDFDocumentItem) => void;
}

export const SectionFinder: React.FC<SectionFinderProps> = ({ onAskTutor, onOpenPDFViewer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [customSectionInput, setCustomSectionInput] = useState('');

  const [inlineResponse, setInlineResponse] = useState<string | null>(null);
  const [isInlineLoading, setIsInlineLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string>('');

  const fetchAIResponse = async (query: string, subjectId: LawSubjectId) => {
    setActiveQuery(query);
    setInlineResponse(null);
    setIsInlineLoading(true);
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          history: [],
          subject: subjectId,
          mode: 'lecture'
        })
      });
      if (!response.ok) throw new Error('API Error');
      
      if (!response.body) throw new Error('No body');
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";
      let fullText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const dataObj = JSON.parse(dataStr);
                if (dataObj.delta) {
                  fullText += dataObj.delta;
                  setInlineResponse(fullText);
                }
              } catch (err) {}
            }
          }
        }
      }
    } catch (e) {
      setInlineResponse('দুঃখিত, এআই শিক্ষকের সাথে সংযোগ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsInlineLoading(false);
    }
  };


  const filteredSections = POPULAR_SECTIONS.filter((sec) => {
    const matchesSubject = selectedSubjectFilter === 'all' || sec.subjectId === selectedSubjectFilter;
    const matchesQuery =
      sec.sectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.titleBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.summaryBn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesQuery;
  });

  const handleCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSectionInput.trim()) return;
    fetchAIResponse(
      `দয়া করে ${customSectionInput} সম্পর্কে বিস্তারিত বিশ্লেষণ, প্রয়োজনীয় শর্তাবলি, ল্যান্ডমার্ক কেস রেফারেন্স এবং পরীক্ষার মডেল উত্তর সহজ ভাষায় বুঝিয়ে দাও।`,
      (selectedSubjectFilter !== 'all' ? selectedSubjectFilter : 'penal_code') as LawSubjectId
    );
  };

  return (
    <div className="flex-1 overflow-y-auto w-full h-full relative">
      <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <BookOpen className="w-4 h-4" />
          <span>ধারা ও কেস নজির সংগ্রহশালা</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-legal text-stone-50">
          আইনের গুরুত্বপূর্ণ ধারা ও ল্যান্ডমার্ক নজির
        </h2>
        <p className="text-sm text-stone-300 max-w-2xl mt-1.5">
          পরীক্ষায় বারবার আসা গুরুত্বপূর্ণ ধারাগুলোর মূল উপাদান, ব্যতিক্রম এবং ল্যান্ডমার্ক কেস রেফারেন্স এক নজরে পড়ুন।
          যেকোনো অজানা ধারার নাম লিখে সার্চ করলে এআই শিক্ষক সঙ্গে সঙ্গে তা সহজ করে বুঝিয়ে দেবে।
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ধারার নম্বর বা নাম দিয়ে খুঁজুন (যেমন: ধারা ৩০০, রেস জুডিকাটা, জামিন, মৃত্যুকালীন ঘোষণা)..."
              className="w-full bg-stone-50 text-stone-900 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600"
            />
          </div>

          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="bg-stone-50 text-stone-800 text-sm rounded-xl px-3 py-2.5 border border-stone-300 focus:outline-none focus:border-amber-600 font-medium"
          >
            <option value="all">সকল বিষয় (All Subjects)</option>
            {LAW_SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameBn}
              </option>
            ))}
          </select>
        </div>

        {/* Ask AI about any other Section */}
        <form onSubmit={handleCustomQuery} className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-2">
          <span className="text-xs font-semibold text-stone-600 shrink-0">
            তালিকার বাইরে অন্য কোনো ধারা বুঝতে চান?
          </span>
          <div className="flex-1 w-full sm:w-auto flex gap-2">
            <input
              type="text"
              value={customSectionInput}
              onChange={(e) => setCustomSectionInput(e.target.value)}
              placeholder="যেমন: দণ্ডবিধির ৪২০ ধারা বা সাক্ষ্য আইনের ১১৪ ধারা..."
              className="flex-1 bg-stone-50 text-xs sm:text-sm rounded-xl px-3 py-2 border border-stone-300 focus:outline-none focus:border-amber-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>এআই শিক্ষককে জিজ্ঞাসা করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* Sections Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">
                    {sec.sectionNumber}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900">
                    {sec.titleBn} <span className="text-xs text-stone-500 font-normal">({sec.titleEn})</span>
                  </h3>
                </div>
                <Scale className="w-5 h-5 text-amber-700 shrink-0" />
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                {sec.summaryBn}
              </p>

              {/* Key Ingredients */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>অত্যাবশ্যকীয় উপাদানসমূহ (Essential Ingredients):</span>
                </h4>
                <ul className="space-y-1 text-xs text-stone-600 pl-2">
                  {sec.keyIngredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Landmark Case Law */}
              {sec.landmarkCase && (
                <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 text-xs">
                  <span className="font-bold text-amber-950">🏛️ ল্যান্ডমার্ক কেস: </span>
                  <span className="text-amber-900 font-medium">{sec.landmarkCase}</span>
                </div>
              )}

              {/* Exam Tip */}
              {sec.examTip && (
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-700">
                  <span className="font-bold text-stone-900">📝 পরীক্ষার টিপ: </span>
                  <span>{sec.examTip}</span>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <button
              onClick={() => fetchAIResponse(`দয়া করে ${sec.sectionNumber} (${sec.titleBn}) সম্পর্কে আমাকে একটি পূর্ণাঙ্গ লেকচার দাও। এর উপাদান, নজির এবং পরীক্ষার প্রশ্নোত্তরের কৌশল বুঝিয়ে দাও।`, sec.subjectId)}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>এই ধারার উপর এআই শিক্ষকের পূর্ণ ক্লাস নিন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* AI Response Modal */}
      {(activeQuery || isInlineLoading || inlineResponse) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">এআই শিক্ষকের বিশ্লেষণ</h3>
              </div>
              <div className="flex items-center gap-2">
                {inlineResponse && !isInlineLoading && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => downloadPDF('section-ai-response', 'AI_Lecture_Notes.pdf')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF ডাউনলোড</span>
                    </button>
                    {onOpenPDFViewer && (
                      <button 
                        onClick={() => onOpenPDFViewer({
                          id: `section-${Date.now()}`,
                          title: `ধারা বা আইনি বিশ্লেষণ: ${activeQuery}`,
                          subject: 'ধারা ও কেস নজির',
                          type: 'section_notes',
                          content: inlineResponse,
                          createdAt: new Date().toLocaleDateString('bn-BD'),
                          pageCount: 2
                        })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="ইন-অ্যাপ পিডিএফ রিডারে পড়ুন"
                      >
                        <FileText className="w-4 h-4 text-amber-700" />
                        <span>পিডিএফ রিডার</span>
                      </button>
                    )}
                  </div>
                )}
                <button 
                  onClick={() => {
                    setActiveQuery('');
                    setInlineResponse(null);
                    setIsInlineLoading(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white">
              {isInlineLoading ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-4">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-stone-500 text-sm font-medium animate-pulse">এআই শিক্ষক উত্তর তৈরি করছেন...</p>
                </div>
              ) : (
                <div id="section-ai-response" className="markdown-body text-sm sm:text-base text-stone-800 p-4 bg-white rounded-lg">
                  <Markdown>{inlineResponse || ''}</Markdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
