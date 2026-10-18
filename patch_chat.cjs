const fs = require('fs');
let content = fs.readFileSync('src/components/ChatTutor.tsx', 'utf-8');

// I already added the import in the previous run.
// Let's replace the markdown body part.

const target = `                  {/* Render Message Text via Markdown */}
                  <div className="markdown-body">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>

                {/* Footer Toolbar for Assistant Message */}
                {isAssistant && (
                  <div className="flex items-center gap-1.5 mt-1.5 px-1">`;
                  
const replacement = `                  {/* Render Message Text via Markdown */}
                  <div id={\`chat-msg-\${msg.id}\`} className="markdown-body bg-white p-2 rounded-lg">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>

                {/* Footer Toolbar for Assistant Message */}
                {isAssistant && (
                  <div className="flex items-center gap-1.5 mt-1.5 px-1">
                    <button
                      onClick={() => downloadPDF(\`chat-msg-\${msg.id}\`, \`AI_Response_\${Date.now()}.pdf\`)}
                      className="text-stone-400 hover:text-amber-600 transition-colors p-1"
                      title="PDF ডাউনলোড"
                    >
                      <Download className="w-4 h-4" />
                    </button>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/ChatTutor.tsx', content);
