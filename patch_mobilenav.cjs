const fs = require('fs');
let content = fs.readFileSync('src/components/MobileBottomNav.tsx', 'utf-8');

// 1. Add Home icon import
content = content.replace(
  "import { \n  MessageSquare",
  "import { \n  Home,\n  MessageSquare"
);
content = content.replace(
  "import {    MessageSquare",
  "import {    Home,   MessageSquare"
);

// 2. Add 'home' to isMoreActive
// Wait, isMoreActive doesn't need home. It's an active tab on the main bar.

// 3. Move 'sections' to moreMenuItems
const sectionsMenuItem = `    {
      id: 'sections',
      titleBn: '৪. ধারা ও নজির',
      subtitleBn: 'আইনের ধারা ও কেস নজির বিশ্লেষণ',
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
    },
    {
      id: 'case_briefer',`;
      
content = content.replace(/\{\s*id: 'case_briefer',/g, sectionsMenuItem);

// 4. Replace Tab 4: Sections with Tab 1: Home and reorder
const oldGrid = `<div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          {/* Tab 1: Chat */}
          <button
            onClick={() => handleSelectTab('chat')}
            className={\`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all \${
              activeTab === 'chat'
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">সহকারী শিক্ষক</span>
          </button>
          {/* Tab 2: Voice Agent (Live 2026) */}
          <button
            onClick={() => handleSelectTab('voice')}
            className={\`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl relative transition-all \${
              activeTab === 'voice'
                ? 'text-amber-300 font-bold bg-amber-500/20 scale-105 shadow-inner'
                : 'text-stone-400 hover:text-amber-300'
            }\`}
          >
            <div className="relative">
              <Mic className={\`w-5 h-5 mb-0.5 \${activeTab === 'voice' ? 'text-red-400 animate-pulse' : 'text-stone-400'}\`} />
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <span className="text-[10px] leading-tight font-semibold">ভয়েস কল</span>
          </button>
          {/* Tab 3: Scan / Image Analyzer */}
          <button
            onClick={() => handleSelectTab('image_analyzer')}
            className={\`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all \${
              activeTab === 'image_analyzer'
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <ImageIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">বই স্ক্যান</span>
          </button>
          {/* Tab 4: Sections */}
          <button
            onClick={() => handleSelectTab('sections')}
            className={\`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all \${
              activeTab === 'sections'
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">ধারা ও নজির</span>
          </button>
          {/* Tab 5: More Menu Button */}`;

const newGrid = `<div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
          {/* Tab 1: Home */}
          <button
            onClick={() => handleSelectTab('home')}
            className={\`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all \${
              activeTab === 'home'
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">হোম</span>
          </button>
          {/* Tab 2: Chat */}
          <button
            onClick={() => handleSelectTab('chat')}
            className={\`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all \${
              activeTab === 'chat'
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">চ্যাট</span>
          </button>
          {/* Tab 3: Voice Agent (Live 2026) */}
          <button
            onClick={() => handleSelectTab('voice')}
            className={\`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl relative transition-all \${
              activeTab === 'voice'
                ? 'text-amber-300 font-bold bg-amber-500/20 scale-105 shadow-inner'
                : 'text-stone-400 hover:text-amber-300'
            }\`}
          >
            <div className="relative">
              <Mic className={\`w-5 h-5 mb-0.5 \${activeTab === 'voice' ? 'text-red-400 animate-pulse' : 'text-stone-400'}\`} />
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <span className="text-[10px] leading-tight font-semibold">ভয়েস কল</span>
          </button>
          {/* Tab 4: Scan / Image Analyzer */}
          <button
            onClick={() => handleSelectTab('image_analyzer')}
            className={\`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all \${
              activeTab === 'image_analyzer'
                ? 'text-amber-400 font-bold bg-amber-500/10 scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }\`}
          >
            <ImageIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">স্ক্যান</span>
          </button>
          {/* Tab 5: More Menu Button */}`;

// Let's replace line by line for safety or replace the whole block if possible.
// Actually, it's easier to use String replace using regex or exact string.
// Because it was printed exactly like oldGrid, I will try replacing the whole thing.

content = content.replace(oldGrid, newGrid);

// Also add 'sections' to isMoreActive
content = content.replace(
  "const isMoreActive = [",
  "const isMoreActive = [\n    'sections',"
);

fs.writeFileSync('src/components/MobileBottomNav.tsx', content);
