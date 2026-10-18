const fs = require('fs');
let content = fs.readFileSync('src/components/DraftingEthics.tsx', 'utf-8');
content = content.replace(/    <\/div>\s*\);\s*\};/m, '        </div>\n      </div>\n    </div>\n  );\n};');
fs.writeFileSync('src/components/DraftingEthics.tsx', content);
