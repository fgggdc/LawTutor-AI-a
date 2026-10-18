import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Scale, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { LegalMaxim, LawSubjectId } from '../types';
import { LEGAL_MAXIMS } from '../data/lawData';
import { playPcmAudio, stopCurrentAudio, speakTextWithBrowser } from '../lib/audioUtils';

interface LegalMaximsGlossaryProps {
  onAskTutor: (query: string, subjectId: LawSubjectId) => void;
}

export const LegalMaximsGlossary: React.FC<LegalMaximsGlossaryProps> = ({ onAskTutor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(LEGAL_MAXIMS.map((m) => m.category)))];

  const filteredMaxims = LEGAL_MAXIMS.filter((m) => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch =
      m.latin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.bengali.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePronounce = async (m: LegalMaxim) => {
    if (playingId === m.id) {
      stopCurrentAudio();
      setPlayingId(null);
      return;
    }

    stopCurrentAudio();
    setPlayingId(m.id);

    const speechText = `${m.latin}. Meaning: ${m.english}. বাংলায় অর্থ: ${m.bengali}`;
    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speechText, voice: 'Zephyr' }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        await playPcmAudio(data.audioBase64, data.sampleRate || 24000);
        setPlayingId(null);
      } else {
        speakTextWithBrowser(speechText, () => setPlayingId(null));
      }
    } catch (e) {
      speakTextWithBrowser(speechText, () => setPlayingId(null));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full h-full relative">
      <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>আইনি পরিভাষা ও ল্যাটিন ম্যাক্সিম কোষ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-legal text-stone-50">
          লিগ্যাল ম্যাক্সিম ও আইনি পরিভাষা ডিকশনারি
        </h2>
        <p className="text-sm text-stone-300 max-w-2xl mt-1.5">
          আইন শিক্ষার্থীদের জন্য পরীক্ষায় এবং কোর্টরুমে ব্যবহৃত অত্যাবশ্যকীয় ল্যাটিন ম্যাক্সিম ও পরিভাষাসমূহের বাংলা অর্থ, বিস্তারিত ব্যাখ্যা এবং সম্পর্কিত ল্যান্ডমার্ক কেস রেফারেন্স।
        </p>
      </div>

      {/* Search & Categories */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ল্যাটিন বা বাংলা অর্থ দিয়ে খুঁজুন (যেমন: Mens Rea, Res Judicata, Audi Alteram Partem, Injuria Sine Damno)..."
            className="w-full bg-stone-50 text-stone-900 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto  pt-1">
          <span className="text-xs font-bold text-stone-600 shrink-0">ক্যাটাগরি:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat === 'All' ? 'সকল ম্যাক্সিম' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Maxims Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMaxims.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md mb-1">
                    {m.category}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 font-serif italic text-amber-950">
                    "{m.latin}"
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">{m.english}</p>
                </div>

                <button
                  onClick={() => handlePronounce(m)}
                  className={`p-2.5 rounded-xl transition-colors shrink-0 cursor-pointer ${
                    playingId === m.id
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                  title="উচ্চারণ ও অর্থ শুনুন"
                >
                  {playingId === m.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Bengali Meaning Highlight */}
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                <span className="text-xs font-bold text-amber-950 block mb-0.5">বাংলা অর্থ:</span>
                <p className="text-sm font-semibold text-amber-900">{m.bengali}</p>
              </div>

              {/* Detailed Explanation */}
              <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-1">
                <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider">
                  আইনি তাৎপর্য ও প্রয়োগ:
                </span>
                <p>{m.explanation}</p>
              </div>

              {/* Landmark Case */}
              {m.landmarkCase && (
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
                  <span className="font-bold text-stone-900">🏛️ নজির মামলা: </span>
                  <span className="text-stone-700">{m.landmarkCase}</span>
                </div>
              )}
            </div>

            {/* Ask AI button */}
            <button
              onClick={() =>
                onAskTutor(
                  `দয়া করে "${m.latin}" (${m.bengali}) লিগ্যাল ম্যাক্সিমটি বিস্তারিত আলোচনা করো। এর উৎপত্তি, শর্তাবলি, ব্যতিক্রম এবং ${m.landmarkCase || 'প্রাসঙ্গিক মামলার'} বিস্তারিত রায় বুঝিয়ে দাও।`,
                  'jurisprudence'
                )
              }
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>এই ম্যাক্সিমের পূর্ণ আইনি লেকচার নিন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};
