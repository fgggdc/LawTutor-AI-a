import React from 'react';
import { Home, Scale, MessageSquare, Mic, Image as ImageIcon, BookOpen, Award, Sparkles, HelpCircle, FileCheck, ScrollText, Gavel, FileText } from 'lucide-react';
import { LawSubjectId } from '../types';
import { LAW_SUBJECTS } from '../data/lawData';

export type TabType = 
  | 'home'
  | 'chat' 
  | 'voice'
  | 'image_analyzer' 
  | 'sections' 
  | 'case_briefer' 
  | 'drafting' 
  | 'moot_viva' 
  | 'quiz' 
  | 'maxims'
  | 'pdf_viewer';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedSubject: LawSubjectId;
  setSelectedSubject: (subject: LawSubjectId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedSubject,
  setSelectedSubject
}) => {
  return (
    <header className="bg-stone-900 text-stone-100 border-b border-amber-900/40 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Top Branding & Subject selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between py-2.5 sm:py-3 gap-2 sm:gap-3 border-b border-stone-800">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveTab('chat')}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/30 text-stone-950 font-bold shrink-0">
                <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-xl font-bold tracking-tight text-amber-400 flex items-center gap-1.5 font-serif-legal">
                    LawTutor AI
                  </h1>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium border border-amber-500/30 whitespace-nowrap">
                    সহকারী আইন শিক্ষক (১৫ বিষয়)
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-stone-400 hidden xs:block">ডিজিটাল সহকারী আইন শিক্ষক ও এআই ভয়েস এজেন্ট</p>
              </div>
            </div>

            <div className="sm:hidden flex items-center gap-1 text-[11px] text-amber-400 bg-stone-800/80 px-2 py-1 rounded-full border border-stone-700 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Gemini AI</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            {/* Subject Selector on Mobile/Desktop */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <label htmlFor="subject-select" className="text-xs text-stone-400 shrink-0 hidden md:inline">
                বিষয়:
              </label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as LawSubjectId)}
                className="w-full sm:w-auto bg-stone-800 text-amber-300 text-xs sm:text-sm rounded-xl px-2.5 py-1.5 border border-stone-700 focus:outline-none focus:border-amber-500 font-medium truncate"
              >
                <option value="all">📚 সকল ১৫টি আইন (All 15 Subjects)</option>
                {LAW_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.serialNo}. {s.nameBn} ({s.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-full border border-stone-700 text-xs text-stone-300 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gemini 2026 Engine</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
                <nav className="flex items-center space-x-1 sm:space-x-1.5 py-2 overflow-x-auto  text-xs sm:text-sm font-medium">
          <button
            id="tab-home"
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'home'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>হোম</span>
          </button>
          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'chat'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>১. সহকারী এআই শিক্ষক</span>
          </button>

          <button
            id="tab-voice"
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'voice'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-amber-300 hover:bg-stone-800 hover:text-amber-100'
            }`}
          >
            <Mic className="w-4 h-4 text-red-400 animate-pulse" />
            <span>২. এআই ভয়েস এজেন্ট (২০২৬)</span>
            <span className="bg-red-500 text-white text-[10px] px-1 rounded animate-pulse font-mono">LIVE</span>
          </button>

          <button
            id="tab-image"
            onClick={() => setActiveTab('image_analyzer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'image_analyzer'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>৩. বই ও প্রশ্ন স্ক্যান</span>
          </button>

          <button
            id="tab-sections"
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'sections'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>৪. ধারা ও কেস নজির</span>
          </button>

          <button
            id="tab-case-briefer"
            onClick={() => setActiveTab('case_briefer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'case_briefer'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>৫. কেস ব্রিফার (FIRAC)</span>
          </button>

          <button
            id="tab-drafting"
            onClick={() => setActiveTab('drafting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'drafting'
                ? 'bg-teal-600 text-white font-bold shadow-sm'
                : 'text-teal-300 hover:bg-stone-800 hover:text-teal-100'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            <span>৬. ড্রাফটিং ও এথিকস</span>
          </button>

          <button
            id="tab-moot-viva"
            onClick={() => setActiveTab('moot_viva')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'moot_viva'
                ? 'bg-yellow-600 text-stone-950 font-bold shadow-sm'
                : 'text-yellow-300 hover:bg-stone-800 hover:text-yellow-100'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>৭. ভাইভা ও মুট কোর্ট</span>
          </button>

          <button
            id="tab-quiz"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'quiz'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>৮. মক কুইজ</span>
          </button>

          <button
            id="tab-maxims"
            onClick={() => setActiveTab('maxims')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'maxims'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>৯. ল্যাটিন ম্যাক্সিম</span>
          </button>

          <button
            id="tab-pdf-viewer"
            onClick={() => setActiveTab('pdf_viewer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'pdf_viewer'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-amber-300 hover:bg-stone-800 hover:text-amber-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>১০. ইন-অ্যাপ পিডিএফ রিডার</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
