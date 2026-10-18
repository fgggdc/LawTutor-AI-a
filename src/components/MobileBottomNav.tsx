import React, { useState } from 'react';
import { 
  Home,
  MessageSquare, 
  Mic, 
  Image as ImageIcon, 
  BookOpen, 
  Menu, 
  X, 
  FileCheck, 
  ScrollText, 
  Gavel, 
  Award, 
  HelpCircle,
  ChevronRight,
  Scale
} from 'lucide-react';
import { TabType } from './Header';

interface MobileBottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setIsMoreOpen(false);
  };

  const moreMenuItems: { id: TabType; titleBn: string; subtitleBn: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
        {
      id: 'sections',
      titleBn: '৪. ধারা ও নজির',
      subtitleBn: 'আইনের ধারা ও কেস নজির বিশ্লেষণ',
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'case_briefer',
      titleBn: '৫. কেস ব্রিফার (FIRAC)',
      subtitleBn: 'Facts, Issues, Rules, Analysis ও রায়ের মূল বক্তব্য',
      icon: <FileCheck className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'drafting',
      titleBn: '৬. আইনি ড্রাফটিং ও এথিকস',
      subtitleBn: 'বেইল পিটিশন, আরজি, ওকালতনামা ও বার কাউন্সিল আচরণবিধি',
      icon: <ScrollText className="w-5 h-5 text-teal-600" />,
    },
    {
      id: 'moot_viva',
      titleBn: '৭. ভাইভা বোর্ড ও মুট কোর্ট',
      subtitleBn: 'হাইকোর্ট বিচারপতি ও ভাইভা বোর্ডের সাথে সিমুলেশন',
      icon: <Gavel className="w-5 h-5 text-yellow-600" />,
      badge: 'জনপ্রিয়',
      badgeColor: 'bg-yellow-500/20 text-yellow-800 border-yellow-300',
    },
    {
      id: 'quiz',
      titleBn: '৮. মক ভাইভা ও MCQ কুইজ',
      subtitleBn: 'বার কাউন্সিল ও জুডিশিয়ারি বিগত বছরের মডেল টেস্ট',
      icon: <Award className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'maxims',
      titleBn: '৯. ল্যাটিন লিগ্যাল ম্যাক্সিম',
      subtitleBn: 'গুরুত্বপূর্ণ ল্যাটিন ম্যাক্সিম ও বাংলা অর্থ ও প্রয়োগ',
      icon: <HelpCircle className="w-5 h-5 text-stone-600" />,
    },
  ];

  const isMoreActive = [
    'sections',
    'case_briefer',
    'drafting',
    'moot_viva',
    'quiz',
    'maxims'
  ].includes(activeTab);

  return (
    <>
      {/* Fixed Bottom Navigation Bar on Mobile / Small Screens */}
      <div className="md:hidden shrink-0 w-full z-50 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800 shadow-2xl px-2 py-1 pb-[calc(0.25rem+env(safe-area-inset-bottom,0px))]">
        <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          {/* Tab 1: Chat */}
          <button
            onClick={() => handleSelectTab('chat')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'chat'
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">সহকারী শিক্ষক</span>
          </button>

          {/* Tab 2: Voice Agent (Live 2026) */}
          <button
            onClick={() => handleSelectTab('voice')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl relative transition-all ${
              activeTab === 'voice'
                ? 'text-amber-300 font-bold bg-amber-500/20 scale-105 shadow-inner'
                : 'text-stone-400 hover:text-amber-300'
            }`}
          >
            <div className="relative">
              <Mic className={`w-5 h-5 mb-0.5 ${activeTab === 'voice' ? 'text-red-400 animate-pulse' : 'text-stone-400'}`} />
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <span className="text-[10px] leading-tight font-semibold">ভয়েস কল</span>
          </button>

          {/* Tab 3: Scan / Image Analyzer */}
          <button
            onClick={() => handleSelectTab('image_analyzer')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'image_analyzer'
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">বই স্ক্যান</span>
          </button>

          {/* Tab 4: Sections */}
          <button
            onClick={() => handleSelectTab('sections')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'sections'
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">ধারা ও নজির</span>
          </button>

          {/* Tab 5: More Menu Button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              isMoreOpen || isMoreActive
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">আরও মেনু</span>
          </button>
        </div>
      </div>

      {/* Slide-up Mobile Drawer Modal for Additional Tools */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="flex-1 w-full"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="bg-stone-900 border-t border-stone-700 rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-stone-950 font-bold">
                  <Scale className="w-4 h-4 text-stone-950" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-100">সকল আইনি শিক্ষামূলক টুলস</h3>
                  <p className="text-[11px] text-stone-400">নিচের যেকোনো ফিচার বাছাই করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {moreMenuItems.map((item) => {
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 shadow-md'
                        : 'bg-stone-800/80 border-stone-700 text-stone-200 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-700">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{item.titleBn}</span>
                          {item.badge && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${item.badgeColor || 'bg-amber-500/20 text-amber-300'}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{item.subtitleBn}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsMoreOpen(false)}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
