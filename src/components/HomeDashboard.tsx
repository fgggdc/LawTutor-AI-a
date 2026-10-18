import React from 'react';
import { 
  MessageSquare, Mic, Image as ImageIcon, BookOpen, 
  FileCheck, ScrollText, Gavel, Award, HelpCircle, 
  ChevronRight, Sparkles 
} from 'lucide-react';
import { TabType } from './Header';

interface HomeDashboardProps {
  onNavigate: (tab: TabType) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const tools = [
    {
      id: 'chat',
      title: 'এআই চ্যাট শিক্ষক',
      desc: 'যেকোনো আইনি বিষয় সহজে বুঝতে চ্যাট করুন',
      icon: <MessageSquare className="w-6 h-6 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 hover:border-amber-400'
    },
    {
      id: 'voice',
      title: 'ভয়েস কল (Live 2026)',
      desc: 'সরাসরি বাংলায় কথা বলে আইন শিখুন',
      icon: <Mic className="w-6 h-6 text-red-500" />,
      color: 'bg-red-50 border-red-200 hover:border-red-400',
      badge: 'LIVE'
    },
    {
      id: 'image_analyzer',
      title: 'বই ও প্রশ্ন স্ক্যান',
      desc: 'ছবি থেকে টেক্সট ও আইনি সমস্যার সমাধান',
      icon: <ImageIcon className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 hover:border-blue-400'
    },
    {
      id: 'sections',
      title: 'ধারা ও নজির',
      desc: 'গুরুত্বপূর্ণ সেকশন ও ল্যান্ডমার্ক জাজমেন্ট খুঁজুন',
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
    },
    {
      id: 'case_briefer',
      title: 'কেস ব্রিফার (FIRAC)',
      desc: 'বড় কেস স্টাডি থেকে 핵심 পয়েন্ট বের করুন',
      icon: <FileCheck className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400'
    },
    {
      id: 'drafting',
      title: 'ড্রাফটিং ও এথিকস',
      desc: 'পেশাদার ড্রাফটিং ফরম্যাট ও প্র্যাকটিস রুলস',
      icon: <ScrollText className="w-6 h-6 text-teal-600" />,
      color: 'bg-teal-50 border-teal-200 hover:border-teal-400'
    },
    {
      id: 'moot_viva',
      title: 'ভাইভা ও মুট কোর্ট',
      desc: 'আদালতের পরিবেশ ও প্রশ্নের সিমুলেশন',
      icon: <Gavel className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400'
    },
    {
      id: 'quiz',
      title: 'মক কুইজ',
      desc: 'বার কাউন্সিল ও জুডিশিয়ারি পরীক্ষার মডেল টেস্ট',
      icon: <Award className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200 hover:border-purple-400'
    },
    {
      id: 'maxims',
      title: 'ল্যাটিন ম্যাক্সিম',
      desc: 'ল্যাটিন আইনি প্রবাদ, অর্থ ও প্রয়োগ',
      icon: <HelpCircle className="w-6 h-6 text-stone-600" />,
      color: 'bg-stone-50 border-stone-200 hover:border-stone-400'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 max-w-7xl mx-auto w-full h-full">
      {/* Welcome Section */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 tracking-tight flex items-center justify-center sm:justify-start gap-2 mb-2 font-serif-legal">
          সুস্বাগতম, ল-টিউটর এআই-তে 
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
        </h1>
        <p className="text-sm sm:text-base text-stone-500 max-w-2xl">
          আপনার পকেটে থাকা সম্পূর্ণ একটি ডিজিটাল আইনি সহায়িকা। বাংলাদেশ বার কাউন্সিল ও জুডিশিয়ারি প্রস্তুতি, ড্রাফটিং, মুট কোর্ট বা যেকোনো আইনি বিষয় সহজ বাংলায় শিখতে নিচের টুলসগুলো ব্যবহার করুন।
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onNavigate(tool.id as TabType)}
            className={`group flex items-start gap-4 p-4 md:p-5 rounded-2xl border transition-all text-left shadow-sm hover:shadow-md ${tool.color}`}
          >
            <div className="bg-white p-3 rounded-xl shadow-xs border border-stone-100 group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-stone-800">{tool.title}</h3>
                {tool.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-600 border border-red-200 animate-pulse">
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-snug">
                {tool.desc}
              </p>
            </div>
            <div className="flex flex-col justify-center h-full">
              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
            </div>
          </button>
        ))}
      </div>
      
      {/* Footer spacing for mobile */}
      <div className="h-8"></div>
    </div>
  );
};
