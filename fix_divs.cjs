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
  
  // A simple heuristic: find the index of "return (" at the root level.
  const returnIndex = content.lastIndexOf('return (');
  if (returnIndex === -1) continue;
  
  const jsxContent = content.substring(returnIndex);
  const openDivs = (jsxContent.match(/<div(?=[\s>])/g) || []).length;
  const closeDivs = (jsxContent.match(/<\/div>/g) || []).length;
  
  const diff = openDivs - closeDivs;
  
  if (diff > 0) {
    console.log(`${file}: missing ${diff} </div> tags`);
    // Insert diff number of </div> before ');\n};'
    let endStr = '';
    for(let i = 0; i < diff; i++) {
      endStr += '      </div>\n';
    }
    
    // We'll just replace '  );\n};' with endStr + '  );\n};'
    // But wait, my previous script might have messed up the end if it removed something.
    // Let's just fix it by replacing the current ending divs and ); }; with the correct amount.
    
    // Actually, it's safer to remove ALL trailing </div> before ); and re-insert the exact amount needed!
    // Let's find the closing block.
  } else if (diff < 0) {
    console.log(`${file}: too many </div> tags (${-diff})`);
  } else {
    console.log(`${file}: perfectly matched`);
  }
}
