const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf-8');

const oldScrollbarRegex = /\/\* Global Custom Scrollbar \(Premium Law Tutor Theme\) \*\/[\s\S]*?::-webkit-scrollbar-thumb:hover \{\s*background-color: rgba\(217, 119, 6, 0\.8\);\s*\}/;

const newScrollbar = `/* Global Custom Scrollbar (Clean Gray Theme with Arrows) */
* {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

::-webkit-scrollbar-track {
  background: #f9fafb;
  border-left: 1px solid #f3f4f6;
  border-top: 1px solid #f3f4f6;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
  border: 5px solid #f9fafb;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
  border: 5px solid #f9fafb;
  background-clip: content-box;
}

::-webkit-scrollbar-button:single-button {
  display: block;
  background-size: 10px;
  background-repeat: no-repeat;
  background-position: center center;
}

/* Up Arrow */
::-webkit-scrollbar-button:single-button:vertical:decrement {
  height: 16px;
  width: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23d1d5db" d="M12 8l6 8H6z"/></svg>');
}
::-webkit-scrollbar-button:single-button:vertical:decrement:hover {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%239ca3af" d="M12 8l6 8H6z"/></svg>');
}

/* Down Arrow */
::-webkit-scrollbar-button:single-button:vertical:increment {
  height: 16px;
  width: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23d1d5db" d="M12 16l-6-8h12z"/></svg>');
}
::-webkit-scrollbar-button:single-button:vertical:increment:hover {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%239ca3af" d="M12 16l-6-8h12z"/></svg>');
}

/* Left Arrow */
::-webkit-scrollbar-button:single-button:horizontal:decrement {
  height: 16px;
  width: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23d1d5db" d="M8 12l8-6v12z"/></svg>');
}
::-webkit-scrollbar-button:single-button:horizontal:decrement:hover {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%239ca3af" d="M8 12l8-6v12z"/></svg>');
}

/* Right Arrow */
::-webkit-scrollbar-button:single-button:horizontal:increment {
  height: 16px;
  width: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23d1d5db" d="M16 12l-8-6v12z"/></svg>');
}
::-webkit-scrollbar-button:single-button:horizontal:increment:hover {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%239ca3af" d="M16 12l-8-6v12z"/></svg>');
}`;

if (oldScrollbarRegex.test(content)) {
  content = content.replace(oldScrollbarRegex, newScrollbar);
} else {
  content += "\n" + newScrollbar;
}

fs.writeFileSync('src/index.css', content);
