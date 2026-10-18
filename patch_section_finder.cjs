const fs = require('fs');
let content = fs.readFileSync('src/components/SectionFinder.tsx', 'utf-8');

// 1. Add imports
content = content.replace(
  "import { Search, BookOpen, Scale, Sparkles, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';",
  "import { Search, BookOpen, Scale, Sparkles, HelpCircle, ArrowRight, CheckCircle2, X } from 'lucide-react';\nimport Markdown from 'react-markdown';"
);

// 2. Add states and fetcher
const newStates = `
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
      const data = await response.json();
      setInlineResponse(data.reply);
    } catch (e) {
      setInlineResponse('দুঃখিত, এআই শিক্ষকের সাথে সংযোগ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsInlineLoading(false);
    }
  };
`;

content = content.replace(
  "const [customSectionInput, setCustomSectionInput] = useState('');",
  "const [customSectionInput, setCustomSectionInput] = useState('');\n" + newStates
);

// 3. Update handleCustomQuery
const oldHandle = `  const handleCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSectionInput.trim()) return;
    onAskTutor(
      \`দয়া করে \${customSectionInput} সম্পর্কে আমাকে বিস্তারিত বুঝিয়ে দাও। এর উপাদান এবং নজির উল্লেখ করো। এটি খুব সহজ ভাষায় বুঝিয়ে দাও।\`,
      (selectedSubjectFilter !== 'all' ? selectedSubjectFilter : 'penal_code') as LawSubjectId
    );
  };`;

const newHandle = `  const handleCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSectionInput.trim()) return;
    fetchAIResponse(
      \`দয়া করে \${customSectionInput} সম্পর্কে আমাকে বিস্তারিত বুঝিয়ে দাও। এর উপাদান এবং নজির উল্লেখ করো। এটি খুব সহজ ভাষায় বুঝিয়ে দাও।\`,
      (selectedSubjectFilter !== 'all' ? selectedSubjectFilter : 'penal_code') as LawSubjectId
    );
    setCustomSectionInput('');
  };`;
  
content = content.replace(oldHandle, newHandle);

// 4. Update the button onClick for cards
content = content.replace(
  /onClick=\{\(\) =>[\s\S]*?onAskTutor\([\s\S]*?\`দয়া করে \$\{sec\.sectionNumber\}([\s\S]*?)\`,\s*sec\.subjectId\s*\)[\s\S]*?\}/,
  'onClick={() => fetchAIResponse(`দয়া করে ${sec.sectionNumber} (${sec.titleBn}) সম্পর্কে আমাকে একটি পূর্ণাঙ্গ লেকচার দাও। এর উপাদান, নজির এবং পরীক্ষার প্রশ্নোত্তরের কৌশল বুঝিয়ে দাও।`, sec.subjectId)}'
);


// 5. Append Modal at the very end of the inner div
const modalUI = `
      {/* AI Response Modal */}
      {(activeQuery || isInlineLoading || inlineResponse) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">এআই শিক্ষকের বিশ্লেষণ</h3>
              </div>
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
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white">
              {isInlineLoading ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-4">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-stone-500 text-sm font-medium animate-pulse">এআই শিক্ষক উত্তর তৈরি করছেন...</p>
                </div>
              ) : (
                <div className="markdown-body text-sm sm:text-base text-stone-800">
                  <Markdown>{inlineResponse || ''}</Markdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  '      </div>\n    </div>\n  );\n};',
  modalUI + '\n      </div>\n    </div>\n  );\n};'
);

fs.writeFileSync('src/components/SectionFinder.tsx', content);
