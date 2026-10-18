const fs = require('fs');
let content = fs.readFileSync('src/components/SectionFinder.tsx', 'utf-8');

const oldFetch = `    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          history: [],
          subject: subjectId,
          mode: 'lecture'
        })
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      setInlineResponse(data.reply);
    } catch (e) {
      setInlineResponse('দুঃখিত, এআই শিক্ষকের সাথে সংযোগ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    }`;

const newFetch = `    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          history: [],
          subject: subjectId,
          mode: 'lecture'
        })
      });
      if (!response.ok) throw new Error('API Error');
      
      if (!response.body) throw new Error('No body');
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";
      let fullText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\\n\\n');
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const dataObj = JSON.parse(dataStr);
                if (dataObj.delta) {
                  fullText += dataObj.delta;
                  setInlineResponse(fullText);
                }
              } catch (err) {}
            }
          }
        }
      }
    } catch (e) {
      setInlineResponse('দুঃখিত, এআই শিক্ষকের সাথে সংযোগ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    }`;

content = content.replace(oldFetch, newFetch);

fs.writeFileSync('src/components/SectionFinder.tsx', content);
