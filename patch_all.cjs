const fs = require('fs');

const files = [
  'src/components/ImageDocAnalyzer.tsx',
  'src/components/SectionFinder.tsx',
  'src/components/CaseBriefer.tsx',
  'src/components/DraftingEthics.tsx',
  'src/components/MockVivaQuiz.tsx',
  'src/components/LegalMaximsGlossary.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Find return ( and the next line
  // Example: 
  //   return (
  //     <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6">
  
  const returnRegex = /  return \([\s\n]*<div className="([^"]+)">/;
  const match = content.match(returnRegex);
  
  if (match) {
    const innerClass = match[1];
    
    // Replace the opening
    content = content.replace(
      match[0],
      `  return (\n    <div className="flex-1 overflow-y-auto w-full h-full relative">\n      <div className="${innerClass}">`
    );
    
    // Replace the closing
    // We look for the last </div> before );
    const endRegex = /    <\/div>\s*<\/div>\s*<\/div>\s*\);\s*\};\s*$/m;
    if (endRegex.test(content)) {
      content = content.replace(endRegex, '    </div>\n    </div>\n  );\n};\n');
    } else {
      const altEndRegex = /    <\/div>\s*\);\s*\};/m;
      content = content.replace(altEndRegex, '      </div>\n    </div>\n  );\n};');
    }
    
    fs.writeFileSync(file, content);
    console.log(`Patched ${file}`);
  } else {
    console.log(`Could not find match in ${file}`);
  }
}
