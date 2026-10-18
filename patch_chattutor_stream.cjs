const fs = require('fs');
let content = fs.readFileSync('src/components/ChatTutor.tsx', 'utf-8');

const oldFetchLogic = `      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          subjectId: selectedSubject,
          imageBase64: curImgBase64,
          imageMimeType: curImgMime,
          mode: studyMode,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessageId = \`assistant-\${Date.now()}\`;
      const newAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        text: data.reply,
        timestamp: Date.now(),
        subjectId: selectedSubject,
      };

      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (err: any) {`;

const newFetchLogic = `      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          subjectId: selectedSubject,
          imageBase64: curImgBase64,
          imageMimeType: curImgMime,
          mode: studyMode,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Network error');
      }

      if (!response.body) throw new Error("ReadableStream not yet supported in this browser.");
      
      const assistantMessageId = \`assistant-\${Date.now()}\`;
      // Insert empty message placeholder to append to
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        text: '',
        timestamp: Date.now(),
        subjectId: selectedSubject,
      }]);

      const reader = response.body.getReader();
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
      }
    } catch (err: any) {`;

content = content.replace(oldFetchLogic, newFetchLogic);
fs.writeFileSync('src/components/ChatTutor.tsx', content);
