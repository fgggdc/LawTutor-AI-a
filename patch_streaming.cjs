const fs = require('fs');
let content = fs.readFileSync('src/components/ChatTutor.tsx', 'utf-8');

const oldCode = `      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkValue = decoder.decode(value, { stream: true });
          const lines = chunkValue.split('\\n\\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.delta) {
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, text: msg.text + parsed.delta } : msg
                  ));
                }
              } catch(e) {}
            }
          }
        }
      }`;

const newCode = `      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\\n\\n');
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.delta) {
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, text: msg.text + parsed.delta } : msg
                  ));
                }
              } catch(e) {
                console.error("Stream parse error:", e);
              }
            }
          }
        }
      }`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/components/ChatTutor.tsx', content);
