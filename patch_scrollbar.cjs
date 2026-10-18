const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf-8');

const oldScrollbarRegex = /\/\* Custom scrollbar for law study documents & chat \*\/[\s\S]*?::-webkit-scrollbar-thumb:hover \{\s*background: rgba\(120, 113, 108, 0\.5\);\s*\}/;

const newScrollbar = `/* Global Custom Scrollbar (Premium Law Tutor Theme) */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(217, 119, 6, 0.5) transparent;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(245, 245, 244, 0.4);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(217, 119, 6, 0.4);
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(217, 119, 6, 0.8);
}`;

if (oldScrollbarRegex.test(content)) {
  content = content.replace(oldScrollbarRegex, newScrollbar);
} else {
  content += "\n" + newScrollbar;
}

fs.writeFileSync('src/index.css', content);
