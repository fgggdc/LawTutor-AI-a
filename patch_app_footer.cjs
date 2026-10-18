const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldFooter = `      {/* Developer Footer */}
      <div className="fixed bottom-[64px] md:bottom-0 left-0 right-0 z-40 bg-stone-900 text-stone-300 text-center py-1 text-[10px] md:text-xs border-t border-stone-800 shadow-2xl font-medium tracking-wide">
        Developer By : Sohel Ahmed, LAW Student, Satkhira LAW college
      </div>`;

const newFooter = `      {/* Developer Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-stone-950 text-stone-400 text-center py-1 h-6 text-[10px] md:text-[11px] border-t border-stone-800 shadow-2xl font-semibold tracking-wide flex items-center justify-center">
        Developer By : Sohel Ahmed, LAW Student, Satkhira LAW college
      </div>`;

content = content.replace(oldFooter, newFooter);
fs.writeFileSync('src/App.tsx', content);
