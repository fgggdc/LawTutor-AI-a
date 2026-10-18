const fs = require('fs');
let content = fs.readFileSync('src/components/VoiceAgent.tsx', 'utf-8');

// Replace the root wrapper
content = content.replace(
  '    <div className="flex flex-col h-full md:h-full max-w-6xl mx-auto px-2 sm:px-4 py-2">',
  '    <div className="flex-1 overflow-y-auto w-full h-full relative">\n      <div className="flex flex-col max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-4">'
);

// We also need to change the grid flex settings because if it's no longer h-full, flex-1 inside it will behave differently.
// Let's remove flex-1 min-h-0 from the grid if we want it to expand naturally.
// Actually, it's a grid. 
content = content.replace(
  '      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 min-h-0">',
  '      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">'
);

// And the chat container height
content = content.replace(
  '        <div className="lg:col-span-7 flex flex-col bg-stone-900/90 border border-stone-800 rounded-2xl shadow-xl overflow-hidden flex-1 min-h-[250px]">',
  '        <div className="lg:col-span-7 flex flex-col bg-stone-900/90 border border-stone-800 rounded-2xl shadow-xl overflow-hidden min-h-[400px]">'
);


content = content.replace(/    <\/div>\s*\);\s*\};/m, '      </div>\n    </div>\n  );\n};');

fs.writeFileSync('src/components/VoiceAgent.tsx', content);
