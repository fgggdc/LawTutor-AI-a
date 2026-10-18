const fs = require('fs');
let content = fs.readFileSync('src/components/VoiceAgent.tsx', 'utf-8');

const oldStr = `<div className="flex items-center justify-between w-full mt-3 pt-3 border-t border-stone-800/80 text-xs text-stone-400">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-stone-200">
                <input
                  type="checkbox"
                  checked={autoSilenceAnswer}
                  onChange={(e) => setAutoSilenceAnswer(e.target.checked)}
                  className="rounded bg-stone-950 border-stone-700 text-amber-600 focus:ring-0"
                />
                <span>হ্যান্ডস-ফ্রি স্বয়ংক্রিয় উত্তর (Live Mode)</span>
              </label>`;

const newStr = `<div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 w-full mt-3 pt-3 border-t border-stone-800/80 text-[10px] sm:text-xs text-stone-400">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-stone-200">
                <input
                  type="checkbox"
                  checked={autoSilenceAnswer}
                  onChange={(e) => setAutoSilenceAnswer(e.target.checked)}
                  className="rounded bg-stone-950 border-stone-700 text-amber-600 focus:ring-0 w-3 h-3 sm:w-4 sm:h-4"
                />
                <span>স্বয়ংক্রিয় উত্তর (Auto-reply)</span>
              </label>`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/components/VoiceAgent.tsx', content);

