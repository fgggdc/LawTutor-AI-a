const fs = require('fs');
let content = fs.readFileSync('src/components/SectionFinder.tsx', 'utf-8');

const target = `              <div className="flex items-center gap-2">
                {inlineResponse && !isInlineLoading && (
                  <button 
                    onClick={() => downloadPDF('section-ai-response', 'AI_Lecture_Notes.pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF ডাউনলোড</span>
                  </button>
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
            </div>`;
            
const replacement = `              <div className="flex items-center gap-2">
                {inlineResponse && !isInlineLoading && (
                  <button 
                    onClick={() => downloadPDF('section-ai-response', 'AI_Lecture_Notes.pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF ডাউনলোড</span>
                  </button>
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
            </div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/SectionFinder.tsx', content);
