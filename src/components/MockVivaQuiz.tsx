import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Loader2, 
  Clock, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { LawSubjectId, QuizQuestion } from '../types';
import { QuizDashboard } from './QuizDashboard';
import { BarChart3, Edit3 } from 'lucide-react';
import { LAW_SUBJECTS } from '../data/lawData';

export interface QuizResult {
  id: string;
  timestamp: number;
  score: number;
  total: number;
  subjectId: string;
}

const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'দণ্ডবিধি ১৮৬০ এর কত ধারা অনুযায়ী "আত্মরক্ষার ব্যক্তিগত অধিকার" (Right of Private Defence) প্রয়োগকালে মৃত্যু পর্যন্ত ঘটানো যায়?',
    options: [
      'ধারা ৯৬ ও ৯৭',
      'ধারা ১০০ ও ১০৩',
      'ধারা ১০৫ ও ১০৬',
      'ধারা ৩০০ এর ব্যতিক্রম ২'
    ],
    correctIndex: 1,
    explanation: 'দণ্ডবিধির ধারা ১০০ অনুযায়ী মানবদেহ রক্ষার্থে ৬টি বিশেষ পরিস্থিতিতে এবং ধারা ১০৩ অনুযায়ী সম্পত্তি রক্ষার্থে ৪টি বিশেষ পরিস্থিতিতে আক্রমণকারীর মৃত্যু ঘটানো আইনত বৈধ।',
    sectionRef: 'The Penal Code, 1860 - Sections 100 & 103',
    subjectId: 'penal_code'
  },
  {
    id: 'q2',
    question: 'সাক্ষ্য আইন ১৮৭২ এর কোন ধারায় "মৃত্যুকালীন ঘোষণা" (Dying Declaration) এর বিধান উল্লেখ রয়েছে?',
    options: [
      'ধারা ২৭',
      'ধারা ৩২(১)',
      'ধারা ৪৫',
      'ধারা ১১৫'
    ],
    correctIndex: 1,
    explanation: 'সাক্ষ্য আইনের ৩২(১) ধারা অনুযায়ী কোনো ব্যক্তির মৃত্যুর কারণ বা যে পরিস্থিতিতে তার মৃত্যু হয়েছিল সে সম্পর্কিত বক্তব্য প্রাসঙ্গিক ও আদালতে গ্রহণযোগ্য সাক্ষ্য।',
    sectionRef: 'The Evidence Act, 1872 - Section 32(1)',
    subjectId: 'evidence'
  },
  {
    id: 'q3',
    question: 'দেওয়ানি কার্যবিধি ১৯০৮ এর ধারা ১১ তে বর্ণিত "রেস জুডিকাটা" (Res Judicata) নীতির মূল উদ্দেশ্য কী?',
    options: [
      'মামলার বিচার স্থগিত রাখা',
      'একই বিবাদীয় বিষয়ে পক্ষগণের মধ্যে মামলার চূড়ান্ত নিষ্পত্তি নিশ্চিত করা ও পুনঃমোকদ্দমা রোধ করা',
      'আদালতের এখতিয়ার পরিবর্তন করা',
      'নতুন সাক্ষ্য উপস্থাপন করা'
    ],
    correctIndex: 1,
    explanation: 'রেস জুডিকাটা নীতির অর্থ হলো "পূর্বে মীমাংসিত বিষয়"। উপযুক্ত আদালত কর্তৃক চূড়ান্তভাবে নিষ্পত্তি হওয়া বিষয়ের ওপর পুনরায় মামলা দায়ের নিষিদ্ধ করে বিচারিক স্থায়ীত্ব নিশ্চিত করা হয়।',
    sectionRef: 'The Code of Civil Procedure, 1908 - Section 11',
    subjectId: 'cpc'
  },
  {
    id: 'q4',
    question: 'ফৌজদারি কার্যবিধি ১৮৯৮ এর কোন ধারার অধীনে ম্যাজিস্ট্রেট তদন্তকালে কোনো আসামির স্বীকারোক্তিমূলক জবানবন্দি (Confession) রেকর্ড করেন?',
    options: [
      'ধারা ১৬১',
      'ধারা ১৬৪',
      'ধারা ১৬৭',
      'ধারা ৩৪২'
    ],
    correctIndex: 1,
    explanation: 'সিআরপিসির ১৬৪ ধারা অনুযায়ী মেট্রোপলিটন ম্যাজিস্ট্রেট বা ১ম শ্রেণির ম্যাজিস্ট্রেট কোনো অপরাধের তদন্ত চলাকালে বা বিচার শুরুর পূর্বে আসামির স্বীকারোক্তি বা সাক্ষীর জবানবন্দি রেকর্ড করতে পারেন।',
    sectionRef: 'The Code of Criminal Procedure, 1898 - Section 164',
    subjectId: 'crpc'
  },
  {
    id: 'q5',
    question: 'বাংলাদেশ সংবিধানের কোন অনুচ্ছেদ অনুযায়ী মৌলিক অধিকার বলবৎকরণের জন্য হাইকোর্ট বিভাগে রিট পিটিশন দায়ের করা যায়?',
    options: [
      'অনুচ্ছেদ ২৭',
      'অনুচ্ছেদ ৪৪ ও ১০২',
      'অনুচ্ছেদ ১১১',
      'অনুচ্ছেদ ১৪১'
    ],
    correctIndex: 1,
    explanation: 'সংবিধানের ৪৪ অনুচ্ছেদে মৌলিক অধিকার বলবৎকরণের নিশ্চয়তা দেওয়া হয়েছে এবং ১০২ অনুচ্ছেদ অনুসারে সংক্ষুব্ধ ব্যক্তি হাইকোর্ট বিভাগে ৫ প্রকারের রিট আবেদন করতে পারেন।',
    sectionRef: 'The Constitution of Bangladesh - Article 102',
    subjectId: 'constitution'
  }
];

export const MockVivaQuiz: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<LawSubjectId>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEFAULT_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loadingNewQuiz, setLoadingNewQuiz] = useState(false);
  const [viewMode, setViewMode] = useState<'quiz' | 'dashboard'>('quiz');
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('mockQuizResults');
    if (stored) {
      try {
        setQuizResults(JSON.parse(stored));
      } catch(e) {}
    }
  }, []);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      const newResult: QuizResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        score: score,
        total: questions.length,
        subjectId: selectedSubject
      };
      const updatedResults = [...quizResults, newResult];
      setQuizResults(updatedResults);
      localStorage.setItem('mockQuizResults', JSON.stringify(updatedResults));
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleGenerateNewAIQuiz = async () => {
    setLoadingNewQuiz(true);
    try {
      const res = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubject !== 'all' ? selectedSubject : 'penal_code_crpc_evidence',
          count: 5
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        handleRestartQuiz();
      }
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    } finally {
      setLoadingNewQuiz(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full h-full relative">
      <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Award className="w-4 h-4" />
          <span>মক ভাইভা ও বার কাউন্সিল এক্সাম সিমুলেটর</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-legal text-stone-50">
          পরীক্ষার মডেল টেস্ট ও স্ব-মূল্যায়ন
        </h2>
        <p className="text-sm text-stone-300 max-w-2xl mt-1.5">
          আইন স্কুল ও বার কাউন্সিল পরীক্ষার আদলে তৈরি বহুনির্বাচনী ও ভাইভা প্রশ্ন প্র্যাকটিস করুন।
          প্রতিটি প্রশ্নের সঙ্গে পাবেন আইনের সুনির্দিষ্ট ধারা ও বিস্তারিত বাংলা ব্যাখ্যা।
        </p>
      </div>

      
      {/* View Toggle */}
      <div className="flex bg-stone-200/50 p-1 rounded-xl w-full sm:w-fit mx-auto mb-6">
        <button
          onClick={() => setViewMode('quiz')}
          className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'quiz' ? 'bg-white shadow-sm text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
        >
          <Edit3 className="w-4 h-4" />
          <span>মক টেস্ট দিন</span>
        </button>
        <button
          onClick={() => setViewMode('dashboard')}
          className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${viewMode === 'dashboard' ? 'bg-white shadow-sm text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>পারফরম্যান্স ড্যাশবোর্ড</span>
        </button>
      </div>

      {viewMode === 'dashboard' ? (
        <QuizDashboard results={quizResults} />
      ) : (
        <div className="space-y-6">

      {/* Subject Filter & Generator Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-stone-600">বিষয়:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as LawSubjectId)}
            className="bg-stone-50 text-stone-800 text-xs sm:text-sm rounded-xl px-3 py-2 border border-stone-300 focus:outline-none focus:border-amber-600 font-medium"
          >
            <option value="all">📚 সকল বিষয় মিলিয়ে টেস্ট</option>
            {LAW_SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameBn}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerateNewAIQuiz}
          disabled={loadingNewQuiz}
          id="generate-new-quiz-btn"
          className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {loadingNewQuiz ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>এআই নতুন প্রশ্ন তৈরি করছে...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>নতুন এআই প্রশ্ন সেট তৈরি করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Main Quiz Area */}
      {!quizFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                প্রশ্ন {currentIndex + 1} / {questions.length}
              </span>
              {currentQ.sectionRef && (
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                  {currentQ.sectionRef}
                </span>
              )}
            </div>
            <div className="text-xs font-bold text-stone-600">
              বর্তমান স্কোর: <span className="text-amber-700">{score}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let optionStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

              if (selectedOption === idx) {
                optionStyle = 'bg-amber-50 border-amber-600 text-amber-950 ring-2 ring-amber-500/20 font-semibold';
              }

              if (isAnswerSubmitted) {
                if (idx === currentQ.correctIndex) {
                  optionStyle = 'bg-green-50 border-green-600 text-green-950 font-bold ring-2 ring-green-500/20';
                } else if (selectedOption === idx && idx !== currentQ.correctIndex) {
                  optionStyle = 'bg-red-50 border-red-600 text-red-950 font-semibold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </div>

                  {isAnswerSubmitted && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (when submitted) */}
          {isAnswerSubmitted && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>আইনি ব্যাখ্যা ও রেফারেন্স:</span>
              </div>
              <p className="text-amber-900 leading-relaxed">{currentQ.explanation}</p>
              {currentQ.sectionRef && (
                <p className="text-[11px] text-amber-800 font-mono font-semibold pt-1">
                  আইন ও ধারা: {currentQ.sectionRef}
                </p>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                উত্তর জমা দিন
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>{currentIndex < questions.length - 1 ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completed Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <GraduationCap className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-stone-900">মক টেস্ট সম্পন্ন হয়েছে!</h3>
            <p className="text-sm text-stone-500">
              আপনার সঠিক উত্তর: <span className="font-bold text-amber-700 text-lg">{score}</span> / {questions.length}
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-sm mx-auto text-xs text-stone-700 space-y-1">
            <p className="font-bold text-stone-900">
              {score >= 4
                ? '🌟 চমৎকার পারফরম্যান্স! আপনার ধারা ও কেস ল ধারণা খুব ভালো।'
                : score >= 3
                ? '👍 ভালো হয়েছে। কিছু ধারা আরও রিভিশন দিলে সম্পূর্ণ নিখুঁত হবে।'
                : '📚 ধারা ও উপাদানগুলো আরও একবার এআই শিক্ষকের সাথে রিভিশন দিন।'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>এই সেটটি পুনরায় দিন</span>
            </button>

            <button
              onClick={handleGenerateNewAIQuiz}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>নতুন এআই প্রশ্ন দিয়ে পরীক্ষা দিন</span>
            </button>
          </div>
        </div>
      )}
    </div>
      )}
      </div>
    </div>
  );
};
