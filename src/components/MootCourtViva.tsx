import React, { useState } from 'react';
import { Award, Gavel, UserCheck, MessageSquare, Volume2, Sparkles, CheckCircle2, ChevronRight, BookOpen, AlertTriangle, Download, FileText } from 'lucide-react';
import { downloadPDF } from '../lib/pdfUtils';
import { MOOT_CASE_SCENARIOS } from '../data/lawData';
import { MootCaseScenario, PDFDocumentItem } from '../types';

interface MootCourtVivaProps {
  onOpenPDFViewer?: (doc: PDFDocumentItem) => void;
}

export const MootCourtViva: React.FC<MootCourtVivaProps> = ({ onOpenPDFViewer }) => {
  const [activeMode, setActiveMode] = useState<'viva' | 'moot'>('viva');
  const [selectedMootCase, setSelectedMootCase] = useState<MootCaseScenario>(MOOT_CASE_SCENARIOS[0]);
  const [selectedSide, setSelectedSide] = useState<'petitioner' | 'respondent'>('petitioner');
  const [userArgument, setUserArgument] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roundCount, setRoundCount] = useState(1);

  // Viva Pre-loaded Board Questions
  const vivaQuestions = [
    {
      id: 'v1',
      question: 'দণ্ডবিধির ধারা ৩০০ এর ৫টি ব্যতিক্রম কী কী এবং এর প্রভাব কী?',
      subject: 'দণ্ডবিধি ১৮৬০',
      hint: 'গ্রেভ অ্যান্ড সাডেন প্রোভোকেশন, আত্মরক্ষা অতিক্রম, সরকারি কর্মচারীর আইনানুগ ক্ষমতা, আকস্মিক ঝগড়া ও সম্মতি।'
    },
    {
      id: 'v2',
      question: 'সিআরপিসির ৪৯৭ ধারায় অজামিনযোগ্য অপরাধে কোন কোন ক্ষেত্রে আদালত জামিন মঞ্জুর করতে পারে?',
      subject: 'ফৌজদারি কার্যবিধি ১৮৯৮',
      hint: 'নারী, ১৬ বছরের কম বয়সি শিশু, রুগ্ন বা শারীরিকভাবে অক্ষম ব্যক্তি।'
    },
    {
      id: 'v3',
      question: 'রেস জুডিকাটা (ধারা ১১) এবং রেজ সাবজুডিস (ধারা ১০) এর মূল পার্থক্য কী?',
      subject: 'দেওয়ানি কার্যবিধি ১৯০৮',
      hint: '১০ ধারায় মামলা স্থগিত (Stay of Suit) এবং ১১ ধারায় চূড়ান্ত নিষ্পত্তি হওয়া বিষয়ে পুনঃমামলা খারিজ।'
    },
    {
      id: 'v4',
      question: 'সাক্ষ্য আইনের ৩২(১) ধারা অনুযায়ী মৃত্যুকালীন ঘোষণার ক্ষেত্রে ডাক্তারের সার্টিফিকেট কি বাধ্যতামূলক?',
      subject: 'সাক্ষ্য আইন ১৮৭২',
      hint: 'বাধ্যতামূলক নয়, তবে মানসিকভাবে সচেতন বা ফিট থাকা প্রমাণিত হতে হবে (Pakala Narayana Swami Case)।'
    },
    {
      id: 'v5',
      question: 'এন.আই অ্যাক্টের ১৩৮ ধারায় চেক ডিজঅনার মামলায় লিগ্যাল নোটিশ কত দিনের মধ্যে দিতে হয় এবং মামলা কখন দায়ের করতে হয়?',
      subject: 'ব্যবসায়িক আইন',
      hint: 'ডিজঅনার হওয়ার ৩০ দিনের মধ্যে নোটিশ, নোটিশের ৩০ দিন পর থেকে পরবর্তী ৩০ দিনের মধ্যে মামলা।'
    },
    {
      id: 'v6',
      question: 'তামাদি আইনের ৫ ধারা কি মূল মোকদ্দমা বা আরজি দাখিলের ক্ষেত্রে প্রয়োগ করা যায়?',
      subject: 'তামাদি আইন ১৯০৮',
      hint: 'না, ৫ ধারা কেবল আপিল, রিভিউ, রিভিশন ও দরখাস্তে চলে; মূল মোকদ্দমায় ৩ ধারা কঠোরভাবে প্রয়োগ হয়।'
    }
  ];

  const [selectedVivaQ, setSelectedVivaQ] = useState(vivaQuestions[0]);

  const handleEvaluate = async () => {
    if (!userArgument.trim()) return;
    setIsLoading(true);
    setEvaluation('');

    const scenarioText = activeMode === 'viva' ? selectedVivaQ.question : selectedMootCase.factsSummary;

    try {
      const res = await fetch('/api/gemini/moot-court', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          scenario: scenarioText,
          userArgument,
          side: selectedSide,
          currentRound: roundCount
        })
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
        setRoundCount((prev) => prev + 1);
      } else {
        setEvaluation(data.error || 'মূল্যায়ন করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      setEvaluation('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full h-full relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-stone-100 p-5 sm:p-6 rounded-2xl border border-amber-800/40 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-500/30 flex items-center gap-1.5 w-fit">
              <Award className="w-3.5 h-3.5" /> ১৫. ভাইভা-ভোসি ও মুট কোর্ট ট্রায়াল সিমুলেটর
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-legal text-amber-100">
              বার কাউন্সিল / জুডিশিয়ারি ভাইভা বোর্ড ও কাল্পনিক আদালত ট্রায়াল
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl">
              বাস্তবধর্মী ভাইভা বোর্ডের কঠিন প্রশ্নোত্তরের অনুশীলন করুন অথবা সুপ্রিম কোর্টের মুট বেঞ্চের সামনে আইনজীবী হিসেবে ওরাল আর্গুমেন্ট উপস্থাপন করে তাৎক্ষণিক নম্বর ও ফিডব্যাক নিন।
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
        <button
          id="btn-mode-viva"
          onClick={() => {
            setActiveMode('viva');
            setEvaluation('');
            setUserArgument('');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeMode === 'viva'
              ? 'bg-amber-700 text-white shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>বার কাউন্সিল ও জুডিশিয়ারি ভাইভা বোর্ড (Viva-Voce)</span>
        </button>

        <button
          id="btn-mode-moot"
          onClick={() => {
            setActiveMode('moot');
            setEvaluation('');
            setUserArgument('');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeMode === 'moot'
              ? 'bg-amber-900 text-amber-100 shadow-md'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>মুট কোর্ট বেঞ্চ ট্রায়াল (Moot Court Trial)</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeMode === 'viva' ? (
        /* VIVA VOCE SIMULATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Board Questions Selection */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>ভাইভা বোর্ডের সম্ভাব্য প্রশ্নাবলী</span>
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {vivaQuestions.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedVivaQ(q);
                      setEvaluation('');
                      setUserArgument('');
                    }}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedVivaQ.id === q.id
                        ? 'border-amber-600 bg-amber-50/80 shadow-sm'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-amber-800 mb-1">
                      <span>{q.subject}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </div>
                    <p className="font-medium text-xs sm:text-sm text-stone-900 leading-snug">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" /> আইনি দিকনির্দেশনা ও হিন্ট:
              </span>
              <p className="text-amber-800 leading-relaxed">{selectedVivaQ.hint}</p>
            </div>
          </div>

          {/* Right Column: Oral Response & Board Evaluation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-stone-900 text-stone-100 rounded-xl p-4 sm:p-5 border border-stone-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-bold text-amber-400">বিজ্ঞ ভাইভা বোর্ড চেয়ারম্যানের প্রশ্ন:</span>
                </div>
                <span className="text-[11px] bg-stone-800 px-2 py-0.5 rounded text-stone-400">
                  বিষয়: {selectedVivaQ.subject}
                </span>
              </div>

              <div className="p-3 bg-stone-800/80 rounded-lg text-sm sm:text-base font-serif-legal text-stone-100 border border-stone-700">
                "{selectedVivaQ.question}"
              </div>

              <div className="space-y-2">
                <label className="text-xs text-stone-300 font-medium flex items-center justify-between">
                  <span>আপনার উত্তর মুখে বলুন বা লিখুন (Candidate Answer):</span>
                  <span className="text-[11px] text-amber-400">ধারা ও কেস রেফারেন্স সহ বলুন</span>
                </label>
                <textarea
                  rows={4}
                  value={userArgument}
                  onChange={(e) => setUserArgument(e.target.value)}
                  placeholder="বিজ্ঞ বোর্ডের উদ্দেশ্যে আপনার উত্তরটি সাজিয়ে লিখুন (যেমন: স্যার, দেওয়ানি কার্যবিধির ধারা ১১ অনুযায়ী...)..."
                  className="w-full bg-stone-800 border border-stone-700 text-stone-100 text-xs sm:text-sm rounded-lg p-3 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                id="btn-submit-viva"
                onClick={handleEvaluate}
                disabled={isLoading || !userArgument.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    বোর্ড আপনার উত্তর মূল্যায়ন করছে...
                  </span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>ভাইভা বোর্ডে উত্তর দাখিল ও মূল্যায়ন নিন</span>
                  </>
                )}
              </button>
            </div>

            {/* Board Feedback Display */}
            {evaluation && (
              <div className="bg-white rounded-xl border border-amber-300 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-2">
                  <h4 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2 font-serif-legal">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span>ভাইভা বোর্ডের নম্বর ও পুঙ্খানুপুঙ্খ ফলাফল</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => downloadPDF('viva-feedback-result', 'Viva_Evaluation.pdf')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors w-fit"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF ডাউনলোড</span>
                    </button>
                    {onOpenPDFViewer && (
                      <button 
                        onClick={() => onOpenPDFViewer({
                          id: `viva-${Date.now()}`,
                          title: 'ভাইভা বোর্ড মূল্যায়ন প্রতিবেদন',
                          subject: 'ভাইভা ও মুট কোর্ট',
                          type: 'viva',
                          content: evaluation,
                          createdAt: new Date().toLocaleDateString('bn-BD'),
                          pageCount: 2
                        })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-stone-950 rounded-lg text-xs font-bold transition-colors w-fit cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>পিডিএফ রিডার</span>
                      </button>
                    )}
                  </div>
                </div>
                <div id="viva-feedback-result" className="bg-stone-50 rounded-lg p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed border border-stone-200">
                  {evaluation}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MOOT COURT SIMULATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Moot Scenario & Memorial Outline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Gavel className="w-4 h-4 text-amber-900" />
                <span>মুট প্রপোজিশন (Case Facts)</span>
              </h3>

              <div className="space-y-2">
                {MOOT_CASE_SCENARIOS.map((scenario) => (
                  <div
                    key={scenario.id}
                    onClick={() => {
                      setSelectedMootCase(scenario);
                      setEvaluation('');
                      setUserArgument('');
                    }}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedMootCase.id === scenario.id
                        ? 'border-amber-800 bg-amber-50/70 shadow-sm'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <p className="font-bold text-xs sm:text-sm text-stone-900">{scenario.titleBn}</p>
                    <p className="text-[11px] text-stone-500 mt-1">{scenario.forum}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fact details & Issues */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3 text-xs">
              <h4 className="font-bold text-stone-900">মামলার ঘটনা সংক্ষেপ:</h4>
              <p className="text-stone-700 leading-relaxed">{selectedMootCase.factsSummary}</p>

              <h4 className="font-bold text-stone-900 pt-2 border-t border-stone-200">আইনি প্রশ্নাবলী (Legal Issues):</h4>
              <ul className="space-y-1.5 text-stone-700 list-disc pl-4">
                {selectedMootCase.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Oral Argument & Bench Interventions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-stone-900 text-stone-100 rounded-xl p-4 sm:p-5 border border-stone-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-amber-300 font-serif-legal">বিজ্ঞ আদালত বেঞ্চের শুনানি</h3>
                  <p className="text-[11px] text-stone-400">{selectedMootCase.forum}</p>
                </div>

                {/* Side Selector */}
                <div className="flex items-center gap-1.5 bg-stone-800 p-1 rounded-lg">
                  <button
                    onClick={() => setSelectedSide('petitioner')}
                    className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                      selectedSide === 'petitioner' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    পিটিশনার আইনজীবী
                  </button>
                  <button
                    onClick={() => setSelectedSide('respondent')}
                    className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
                      selectedSide === 'respondent' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    রেসপন্ডেন্ট আইনজীবী
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-stone-300 font-medium">
                  আপনার মৌখিক যুক্তি উপস্থাপন করুন (Counsel's Oral Submissions):
                </label>
                <textarea
                  rows={5}
                  value={userArgument}
                  onChange={(e) => setUserArgument(e.target.value)}
                  placeholder={`May it please the Court, my Lord... (বিজ্ঞ আদালতের অনুমতি সাপেক্ষে, ${selectedSide === 'petitioner' ? 'পিটিশনারের' : 'রেসপন্ডেন্টের'} পক্ষ থেকে ৩টি মূল আইনি যুক্তি উপস্থাপন করছি)...`}
                  className="w-full bg-stone-800 border border-stone-700 text-stone-100 text-xs sm:text-sm rounded-lg p-3 focus:border-amber-500 focus:outline-none resize-none font-sans leading-relaxed"
                />
              </div>

              <button
                id="btn-submit-moot"
                onClick={handleEvaluate}
                disabled={isLoading || !userArgument.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    বেঞ্চের বিজ্ঞ বিচারকগণ আপনার যুক্তি পর্যালোচনা করছেন...
                  </span>
                ) : (
                  <>
                    <Gavel className="w-4 h-4" />
                    <span>বেঞ্চের সামনে বক্তব্য উপস্থাপন করুন (Submit to Bench)</span>
                  </>
                )}
              </button>
            </div>

            {/* Bench Feedback */}
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
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => downloadPDF('bench-feedback-result', 'Judicial_Intervention.pdf')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors w-fit"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF ডাউনলোড</span>
                    </button>
                    {onOpenPDFViewer && (
                      <button 
                        onClick={() => onOpenPDFViewer({
                          id: `bench-${Date.now()}`,
                          title: 'মুট কোর্ট বেঞ্চ ইন্টারভেনশন ও রায়',
                          subject: selectedMootCase.titleBn,
                          type: 'viva',
                          content: evaluation,
                          createdAt: new Date().toLocaleDateString('bn-BD'),
                          pageCount: 2
                        })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-stone-950 rounded-lg text-xs font-bold transition-colors w-fit cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>পিডিএফ রিডার</span>
                      </button>
                    )}
                  </div>
                </div>
                <div id="bench-feedback-result" className="bg-stone-50 rounded-lg p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed border border-stone-200">
                  {evaluation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
