const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldCode = `      {/* Developer Footer */}
      <div className="shrink-0 w-full z-[60] bg-stone-950 text-stone-400 text-center py-1 h-6 text-[10px] md:text-[11px] border-t border-stone-800 shadow-2xl font-semibold tracking-wide flex items-center justify-center">
        Developer By : Sohel Ahmed, LAW Student, Satkhira LAW college
      </div>

      {/* Dedicated Touch-friendly Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />`;

const newCode = `      {/* Dedicated Touch-friendly Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Developer Footer */}
      <div className="shrink-0 w-full z-[60] bg-stone-950 text-stone-400 text-center py-1 h-6 text-[10px] md:text-[11px] border-t border-stone-800 shadow-2xl font-semibold tracking-wide flex items-center justify-center">
        Developer By : Sohel Ahmed, LAW Student, Satkhira LAW college
      </div>`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/App.tsx', content);
