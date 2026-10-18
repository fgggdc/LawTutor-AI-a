const fs = require('fs');
let content = fs.readFileSync('src/components/MootCourtViva.tsx', 'utf-8');

content = content.replace(/    <\/div>\s*<\/div>\s*<\/div>\s*\);\s*\};\s*$/m, '    </div>\n    </div>\n  );\n};\n');

fs.writeFileSync('src/components/MootCourtViva.tsx', content);
