const fs = require('fs');
let content = fs.readFileSync('src/components/VoiceAgent.tsx', 'utf-8');

// Update the outermost wrapper height
content = content.replace(
  'className="flex flex-col h-[calc(100vh-8.5rem)] max-w-6xl mx-auto px-2 sm:px-4 py-2"',
  'className="flex flex-col h-[calc(100dvh-130px)] lg:h-[calc(100vh-140px)] max-w-6xl mx-auto px-2 sm:px-4 py-2"'
);

// Update the grid to allow scrolling on mobile if things get cramped, or just let them flex
content = content.replace(
  'className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0"',
  'className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-3 min-h-0"'
);

// Update the left column (Visualizer) to take fixed space on mobile, or less space
content = content.replace(
  'className="lg:col-span-5 flex flex-col bg-stone-900/90 border border-stone-800 rounded-2xl p-4 shadow-xl overflow-hidden relative"',
  'className="lg:col-span-5 flex flex-col bg-stone-900/90 border border-stone-800 rounded-2xl p-3 sm:p-4 shadow-xl overflow-hidden relative shrink-0 lg:shrink h-[320px] lg:h-auto"'
);

// Make visualizer min height smaller on mobile
content = content.replace(
  'className="flex-1 w-full relative flex items-center justify-center my-2 min-h-[160px]"',
  'className="flex-1 w-full relative flex items-center justify-center my-1 sm:my-2 min-h-[120px] sm:min-h-[160px]"'
);

// Make the action mic button slightly smaller on mobile to save vertical space
content = content.replace(
  'className={`relative group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${',
  'className={`relative group w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${'
);
content = content.replace(
  '<MicOff className="w-8 h-8" />',
  '<MicOff className="w-6 h-6 sm:w-8 sm:h-8" />'
);
content = content.replace(
  '<RefreshCw className="w-8 h-8" />',
  '<RefreshCw className="w-6 h-6 sm:w-8 sm:h-8" />'
);
content = content.replace(
  '<Mic className="w-8 h-8" />',
  '<Mic className="w-6 h-6 sm:w-8 sm:h-8" />'
);


// Update the right column (Transcript) to take remaining space
content = content.replace(
  'className="lg:col-span-7 flex flex-col bg-stone-900/90 border border-stone-800 rounded-2xl shadow-xl overflow-hidden"',
  'className="lg:col-span-7 flex flex-col bg-stone-900/90 border border-stone-800 rounded-2xl shadow-xl overflow-hidden flex-1 min-h-[300px]"'
);

fs.writeFileSync('src/components/VoiceAgent.tsx', content);

