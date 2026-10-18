const fs = require('fs');
let content = fs.readFileSync('src/components/ChatTutor.tsx', 'utf-8');

const regex = /const downloadNotes = \(\) => \{[\s\S]*?URL\.revokeObjectURL\(url\);\n  \};/;

const newDownloadNotes = `const downloadNotes = () => {
    const content = "# LawTutor Study Notes\\n\\n" + messages
      .map(m => \`### \${m.role === 'user' ? '🧑‍🎓 শিক্ষার্থী' : '👨‍🏫 সহকারী এআই শিক্ষক'} (\${new Date(m.timestamp).toLocaleTimeString()})\\n\\n\${m.text}\\n\\n---\\n\`)
      .join('\\n');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`LawTutor_Study_Notes_\${new Date().toISOString().slice(0, 10)}.md\`;
    a.click();
    URL.revokeObjectURL(url);
  };`;

content = content.replace(regex, newDownloadNotes);

// Optional: also update the button text to be more explicit about format if needed.
content = content.replace(
  '<span className="hidden sm:inline">নোট সেভ</span>',
  '<span className="hidden sm:inline">নোট সেভ (.md)</span>'
);

fs.writeFileSync('src/components/ChatTutor.tsx', content);
