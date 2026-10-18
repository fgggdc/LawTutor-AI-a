const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf-8');

// 1. Add Home icon import
content = content.replace(
  "import { Scale, MessageSquare",
  "import { Home, Scale, MessageSquare"
);

// 2. Add 'home' to TabType
content = content.replace(
  "export type TabType = \n  | 'chat'",
  "export type TabType = \n  | 'home'\n  | 'chat'"
);
content = content.replace(
  "export type TabType = \r\n  | 'chat'",
  "export type TabType = \r\n  | 'home'\r\n  | 'chat'"
);
// In case it's in a single line
content = content.replace(
  "export type TabType =   | 'chat'",
  "export type TabType =   | 'home'   | 'chat'"
);

// 3. Add home tab button to nav
const homeTabStr = `        <nav className="flex items-center space-x-1 sm:space-x-1.5 py-2 overflow-x-auto no-scrollbar text-xs sm:text-sm font-medium">
          <button
            id="tab-home"
            onClick={() => setActiveTab('home')}
            className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors \${
              activeTab === 'home'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
            }\`}
          >
            <Home className="w-4 h-4" />
            <span>হোম</span>
          </button>`;

content = content.replace(
  /<nav className="flex items-center space-x-1 sm:space-x-1.5 py-2 overflow-x-auto no-scrollbar text-xs sm:text-sm font-medium">/,
  homeTabStr
);

fs.writeFileSync('src/components/Header.tsx', content);
