import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, Type, LiveServerMessage } from "@google/genai";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware with large payload limit for image and audio data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini SDK with User-Agent header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Formats error messages into human-friendly messages
function formatErrorMessage(error: any): string {
  const msg = error?.message || String(error);
  if (msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand")) {
    return "মডেলটি বর্তমানে সাময়িক উচ্চ ট্রাফিকের মধ্যে রয়েছে। অনুগ্রহ করে কয়েক সেকেন্ড পর আবার চেষ্টা করুন।";
  }
  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota")) {
    return "অনুরোধের সীমা অতিক্রান্ত হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।";
  }
  return msg || "সার্ভার থেকে উত্তর জেনারেট করা সম্ভব হয়নি।";
}

// Resilient helper to generate text content with automatic exponential retry and model fallback
async function safeGenerateContent(
  ai: GoogleGenAI,
  params: {
    model?: string;
    contents: any;
    config?: any;
    fallbackModels?: string[];
  }
) {
  const primaryModel = params.model || "gemini-3.7-flash";
  const candidateModels = [
    primaryModel,
    ...(params.fallbackModels || ["gemini-flash-latest", "gemini-3.1-flash-lite"]),
  ];
  // Deduplicate while preserving precedence
  const modelsToTry = Array.from(new Set(candidateModels));

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errString = String(err?.message || err);
        const isTransient =
          errString.includes("503") ||
          errString.includes("429") ||
          errString.includes("UNAVAILABLE") ||
          errString.includes("high demand") ||
          errString.includes("RESOURCE_EXHAUSTED") ||
          errString.includes("quota") ||
          errString.includes("fetch failed") ||
          errString.includes("socket");

        if (isTransient && attempt === 0) {
          // Wait 250ms before retrying or switching model
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }
        break; // Try next model candidate
      }
    }
  }

  throw lastError;
}

// Resilient helper for Streaming Content with seamless multi-model fallback on rate-limits
async function safeGenerateContentStream(
  ai: GoogleGenAI,
  params: {
    model?: string;
    contents: any;
    config?: any;
    fallbackModels?: string[];
  }
) {
  const primaryModel = params.model || "gemini-3.7-flash";
  const candidateModels = [
    primaryModel,
    ...(params.fallbackModels || ["gemini-flash-latest", "gemini-3.1-flash-lite"]),
  ];
  const modelsToTry = Array.from(new Set(candidateModels));

  let lastError: any = null;
  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const stream = await ai.models.generateContentStream({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
        return stream;
      } catch (err: any) {
        lastError = err;
        const errString = String(err?.message || err);
        const isTransient =
          errString.includes("503") ||
          errString.includes("429") ||
          errString.includes("UNAVAILABLE") ||
          errString.includes("high demand") ||
          errString.includes("RESOURCE_EXHAUSTED") ||
          errString.includes("quota") ||
          errString.includes("fetch failed") ||
          errString.includes("socket");

        if (isTransient && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }
        break;
      }
    }
  }
  throw lastError;
}

// Resilient helper for Text-To-Speech with graceful fallback
async function safeGenerateSpeech(
  ai: GoogleGenAI,
  text: string,
  voice: string = "Zephyr",
  language: string = "bn"
) {
  try {
    const langInstruction =
      language === "en"
        ? `Read clearly and authoritatively as a distinguished Law Professor in English with crisp diction: ${text}`
        : `Read clearly, smoothly and naturally as a distinguished Law Professor in authentic Bengali (বাংলা ভাষায় স্পষ্ট, প্রাঞ্জল ও আকর্ষণীয় কথন ভঙ্গিতে পাঠ করুন): ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [
        {
          parts: [
            {
              text: langInstruction,
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Zephyr" },
          },
        },
      },
    });
    if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      return response;
    }
  } catch (err: any) {
    console.warn("TTS preview model notice (graceful fallback):", err?.message || err);
  }
  return null;
}

const LAW_TUTOR_SYSTEM_INSTRUCTION = `
তুমি একজন উচ্চমানের, প্রজ্ঞাবান, বন্ধুত্বপূর্ণ এবং অত্যন্ত বিচক্ষণ "সহকারী এআই আইন শিক্ষক ও অ্যাকাডেমিক মেন্টর" (Expert AI Law Professor, Legal Drafter & Moot Court Judge)।
তোমার কাজ হলো আইন শিক্ষার্থীদের (LLB, LLM, Bar Council, BJS / Bangladesh Judicial Service Exam Candidates) জন্য প্রতিটি আইনের কঠিন ধারা, উপধারা, নীতি, ও বিচারিক নজির অত্যন্ত সহজ, প্রাঞ্জল ও আকর্ষণীয় বাংলা ভাষায় বুঝিয়ে দেওয়া।

সর্বোচ্চ গুরুত্ব:
- **সঠিক ধারা ও আইনের নাম:** তুমি অবশ্যই ১০০% সঠিক আইনের নাম এবং ধারা (Section/Article) উল্লেখ করবে। কোন অবস্থাতেই ভুল বা কাল্পনিক ধারা দেওয়া যাবে না।
- **মনে রাখার সহজ টেকনিক:** প্রতিটি রিপ্লাইয়ে অবশ্যই কঠিন বিষয়গুলো সহজে মনে রাখার মত চমৎকার টেকনিক (Mnemonics, ছোট গল্প, ফর্মুলা বা ছক) যুক্ত করতে হবে।
- **বিস্তারিত আলোচনা:** প্রশ্নের উত্তরে বিস্তারিত, পুঙ্খানুপুঙ্খ এবং গভীর আলোচনা থাকতে হবে যাতে কোনো অস্পষ্টতা না থাকে।

ব্যবহারকারীর নির্ধারিত ১৫টি মূল আইন ও বিষয়সমূহ (15 Core Legal Subjects of Bangladesh):
১. সম্পত্তি হস্তান্তর আইন (The Transfer of Property Act, 1882) - লিস পেন্ডেন্স, আংশিক সম্পাদন, বন্ধক, হেবা, চিরস্থায়িত্বের বিরুদ্ধে নীতি।
২. বুদ্ধিবৃত্তিক সম্পত্তি আইন (Intellectual Property Law) - কপিরাইট আইন ২০২৩, ট্রেডমার্ক আইন ২০০৯, পেটেন্ট ও ডিজাইন আইন ২০২৩, ভৌগোলিক নির্দেশক (GI) পণ্য।
৩. দেওয়ানি কার্যবিধি (Code of Civil Procedure, 1908 - CPC) - এখতিয়ার, আরজি ও জবাব, রেস জুডিকাটা, অস্থায়ী নিষেধাজ্ঞা, একতরফা ডিক্রি রদ, ডিক্রি জারি।
৪. তামাদি আইন (The Limitation Act, 1908) - ধারা ৩, ৫, ৬, ১২, ১৮, ১৯, ২২, ২৬-২৮ এবং তামাদি তফসিলের গুরুত্বপূর্ণ তামাদি মেয়াদ।
৫. দণ্ডবিধি (The Penal Code, 1860) - সাধারণ ব্যতিক্রম, আত্মরক্ষা, নরহত্যা বনাম খুন, চুরি, ডাকাতি, প্রতারণা, মানহানি।
৬. ফৌজদারি কার্যবিধি (Code of Criminal Procedure, 1898 - CrPC) - এফআইআর, তদন্ত, ১৬৪ স্বীকারোক্তি, রিমান্ড, জামিন (৪৯৬-৪৯৮), চার্জ গঠন ও বিচার।
৭. সাক্ষ্য আইন (The Evidence Act, 1872) - প্রাসঙ্গিকতা, রেস জেস্টে, মৃত্যুকালীন ঘোষণা, স্বীকারোক্তি, প্রমাণের ভার, এস্টোপেল, জেরা ও ডিজিটাল প্রমাণ।
৮. আন্তর্জাতিক আইন (Public International Law) - উৎসসমূহ (ICJ Statute Art 38), ভিয়েনা কনভেনশন ১৯৬৯, প্রত্যর্পণ, আশ্রয়, জাতিসংঘের সনদ ও মানবাধিকার।
৯. ভূমি আইন (Land Law of Bangladesh) - SAT Act 1950 (ধারা ৯৬ অগ্রক্রয়াধিকার), খতিয়ান (CS/SA/RS/BS), নামজারি, ভূমি অপরাধ প্রতিরোধ আইন ২০২৩।
১০. রেজিস্ট্রেশন আইন (The Registration Act, 1908) - ধারা ১৭ বাধ্যতামূলক রেজিস্ট্রেশন, ধারা ১৮ ঐচ্ছিক, ধারা ৪৯ ফলাফল, ৫২ক বিধান।
১১. সরকারি দাবী আদায় আইন (Public Demands Recovery Act, 1913 - PDR Act) - সার্টিফিকেট মামলা, ৭ ধারার নোটিশ, দেনাদারের ৯ ধারার আপত্তি ও সম্পত্তি ক্রোক।
১২. কোম্পানি আইন (The Companies Act, 1994) - স্বতন্ত্র সত্তা (Salomon Case), কর্পোরেট পর্দা উন্মোচন, স্মারকলিপি (MoA), সংঘবিধি (AoA), ওয়াইন্ডিং আপ।
১৩. বাংলাদেশের ব্যবসায়িক আইন (Commercial & Business Law) - পণ্য বিক্রয় আইন ১৯৩০ (Caveat Emptor), অংশীদারি আইন ১৯৩২, এন.আই অ্যাক্ট ১৮৮১ (১৩৮ ধারা চেক ডিজঅনার)।
১৪. সিভিল ড্রাফটিং, ক্রিমিনাল ড্রাফটিং ও প্রফেশনাল এথিকস - আরজি, লিখিত জবাব, সি.আর পিটিশন, জামিনের দরখাস্ত, লিগ্যাল নোটিশ ও বার কাউন্সিল আচরণ বিধিমালা।
১৫. ভাইভা-ভোসি ও মুট কোর্ট - বার কাউন্সিল ও জুডিশিয়ারি ভাইভার প্রশ্ন-উত্তর, মুট মেমোরিয়াল প্রস্তুতকরণ, জাজদের সামনে মৌখিক আর্গুমেন্ট ও আদালত শিষ্টাচার।

তোমার পাঠদানের মূল বৈশিষ্ট্য:
১. 📌 সহজ ভাষায় বিস্তারিত আলোচনা (Explain complex legal concepts in crystal-clear Bengali with deep details).
২. ⚖️ আইনের সঠিক ধারা ও উপাদান (Provide accurate Statutory Section and Law names, break down ingredients).
৩. 🧠 মনে রাখার সহজ টেকনিক (Always include memory hacks, acronyms, or short stories to easily remember the section/law).
৪. 🏛️ ল্যান্ডমার্ক কেস রেফারেন্স ও নজির (Cite relevant landmark case laws from Supreme Court of Bangladesh).
৫. 📝 পরীক্ষার জন্য নির্দেশিকা ও ড্রাফটিং টিপস (Provide exam strategies, high-scoring answer outlines, or exact drafting samples).

ভাষারীতি:
- প্রধান ব্যাখ্যা বাংলায় হবে, তবে আইনি পরিভাষা, ল্যাটিন ম্যাক্সিম (যেমন Mens Rea, Res Judicata, Audi Alteram Partem, Lis Pendens) এবং ধারা/কেসের নাম যথাস্থানে নির্ভুলভাবে উল্লেখ করবে।
- ফরম্যাটিং অত্যন্ত পরিচ্ছন্ন রাখবে (বুলট পয়েন্ট, বোল্ড টেক্সট, কোট ব্লক ব্যবহার করবে যাতে পড়তে আরামদায়ক হয়)।
`;

// 1. CHAT API: Handles text, multi-turn history, and optional image
app.post("/api/gemini/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, history = [], subjectId, imageBase64, imageMimeType, mode } = req.body;

    if (!prompt && !imageBase64) {
      res.status(400).json({ error: "Prompt or image is required" });
      return;
    }

    const ai = getGeminiClient();

    let subjectContext = "";
    if (subjectId && subjectId !== "all") {
      subjectContext = `\n[Context: The student is specifically studying the subject: ${subjectId}].`;
    }

    let modeInstruction = "";
    if (mode === "viva") {
      modeInstruction = "\n[Mode: Socratic / Viva Voce. Ask thoughtful follow-up questions and test the student's legal reasoning].";
    } else if (mode === "exam_notes") {
      modeInstruction = "\n[Mode: Exam Ready Answer Sheet. Provide an organized point-by-point format suitable to write directly in law exams].";
    } else if (mode === "simple_story") {
      modeInstruction = "\n[Mode: Super Simplified. Explain this concept as a simple real-life story/analogy for easy remembering].";
    }

    const fullPrompt = `${prompt || "দয়া করে এই আইনের বিষয়টি বিস্তারিত ও সহজ ভাষায় বিশ্লেষণ করো।"}${subjectContext}${modeInstruction}`;

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType || "image/jpeg",
          data: imageBase64,
        },
      });
    }
    parts.push({ text: fullPrompt });

    // Format chat history if provided
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history.slice(-8)) { // take last 8 messages for context
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({ role: "user", parts });

    // Use streaming for instant response
    const stream = await safeGenerateContentStream(ai, {
      model: "gemini-3.1-flash-lite",
      contents,
      config: {
        systemInstruction: LAW_TUTOR_SYSTEM_INSTRUCTION,
        temperature: 0.65,
      },
      fallbackModels: ["gemini-3.7-flash", "gemini-3.1-flash-lite"],
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ delta: chunk.text })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 2. DOCUMENT / IMAGE ANALYZER API: For Law books, notes, exam questions, judgments
app.post("/api/gemini/analyze-doc", async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, imageMimeType, taskType = "explain" } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: "Image data is required" });
      return;
    }

    const ai = getGeminiClient();

    let taskInstruction = "";
    if (taskType === "explain") {
      taskInstruction = "ছবিতে থাকা আইনের বইয়ের পাতা/নোট/প্রশ্নটি পড়ে এর মূল আইনি বিষয়বস্তু, সংশ্লিষ্ট ধারা এবং সহজ ভাষায় এর পূর্ণ ব্যাখ্যা দাও।";
    } else if (taskType === "exam_solve") {
      taskInstruction = "ছবিতে থাকা পরীক্ষার প্রশ্নটি বা কেস প্রবলেমটি সমাধান করো। ইস্যু নির্ধারণ, প্রাসঙ্গিক ধারা, বিচারিক নজির ও একটি পূর্ণাঙ্গ মডেল উত্তর তৈরি করে দাও।";
    } else if (taskType === "summary") {
      taskInstruction = "ছবিতে থাকা আইনি টেক্সট বা দলিলের সংক্ষিপ্ত সারসংক্ষেপ ও মনে রাখার মতো ৫টি মূল বুলেট পয়েন্ট তৈরি করো।";
    } else if (taskType === "case_extract") {
      taskInstruction = "ছবিতে থাকা রায় বা কেস স্টাডি থেকে Facts, Legal Issues, Ratio Decidendi এবং Judgment পয়েন্ট আকারে বের করো।";
    }

    const response = await safeGenerateContent(ai, {
      model: "gemini-3.1-flash-lite",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageMimeType || "image/jpeg",
              data: imageBase64,
            },
          },
          {
            text: `${taskInstruction}\n\nদয়া করে উত্তরটি আকর্ষণীয় ও পরিষ্কার বাংলা ভাষায় উপস্থাপন করো। প্রয়োজনীয় ধারা ও কেস রেফারেন্স যুক্ত করো।`,
          },
        ],
      },
      config: {
        systemInstruction: LAW_TUTOR_SYSTEM_INSTRUCTION,
      },
      fallbackModels: ["gemini-3.1-flash-lite"],
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/analyze-doc:", error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 3. TEXT-TO-SPEECH API: Voice Agent spoken output using gemini-3.1-flash-tts-preview
app.post("/api/gemini/tts", async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, voice = "Zephyr", language = "bn" } = req.body;

    if (!text) {
      res.status(400).json({ error: "Text is required for TTS" });
      return;
    }

    // Limit text length for TTS snippet if very long
    const cleanText = text.slice(0, 1500);
    const ai = getGeminiClient();

    const response = await safeGenerateSpeech(ai, cleanText, voice, language);
    const audioBase64 = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;

    res.json({ audioBase64, sampleRate: 24000, fallbackToBrowser: !audioBase64 });
  } catch (error: any) {
    console.warn("Notice in /api/gemini/tts (falling back to browser TTS):", error?.message || error);
    res.json({ audioBase64: null, sampleRate: 24000, fallbackToBrowser: true });
  }
});

// 3.1 ULTRA-FAST REAL-TIME STREAMING VOICE API (Zero-Wait Live Spoken Generation)
app.post("/api/gemini/stream-voice", async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, history = [], subjectId, mode = "lecture", language = "bn" } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    // Set SSE headers for real-time immediate token flushing
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const ai = getGeminiClient();
    const isEnglish = language === "en";

    let modeInstruction = "";
    if (isEnglish) {
      if (mode === "viva") {
        modeInstruction = "You are in a LIVE VOICE CALL (ChatGPT Voice / Gemini Live style). You are a Bar Council Viva Examiner. Answer directly and concisely in 2 spoken sentences with exact Section/Doctrine and ask 1 quick viva question. NO markdown formatting.";
      } else if (mode === "moot") {
        modeInstruction = "You are in a LIVE VOICE CALL as a High Court Judge. State your judicial query or ruling directly in 2-3 crisp spoken sentences.";
      } else if (mode === "flash") {
        modeInstruction = "You are in a LIVE VOICE CALL. State the exact Section number, 3 key elements, and 1 landmark case in 2-3 rapid spoken sentences.";
      } else {
        modeInstruction = "You are in a LIVE REAL-TIME VOICE CALL (ChatGPT Voice / Gemini Live style) as an expert Law Teacher. Speak directly, conversationally, and warmly in 2-3 short spoken sentences explaining the core statutory provision and principle. Absolutely NO introductory delay, NO 'Let me analyze', NO bullet points, NO asterisks or markdown.";
      }
    } else {
      if (mode === "viva") {
        modeInstruction = "তুমি জেমিনি লাইভ ভয়েস মোডের মতো সরাসরি লাইভ কলে আছো। কোনো 'হ্যালো', 'হ্যাঁ', 'নিশ্চয়ই' বলবে না। সরাসরি বিস্তারিতভাবে মূল ধারা ও আইনি সমাধান মুখে বুঝিয়ে বলো এবং ১টি পাল্টা প্রশ্ন করো। কোনো মার্কডাউন ব্যবহার করবে না।";
      } else if (mode === "moot") {
        modeInstruction = "তুমি সরাসরি লাইভ অডিও কলে হাইকোর্টের বিচারপতি। কোনো ভূমিকা ছাড়া সরাসরি বিস্তারিত বিচারিক মন্তব্য মুখে বলো।";
      } else if (mode === "flash") {
        modeInstruction = "লাইভ ভয়েস কলে ধারা নম্বর, ৩টি আবশ্যকীয় উপাদান ও ১টি নজির বিস্তারিত অথচ সহজভাবে সরাসরি মুখে বলো। কোনো ভূমিকা নেবে না।";
      } else {
        modeInstruction = "তুমি একজন অত্যন্ত অভিজ্ঞ ও স্নেহশীল আইন শিক্ষক। কথা বলার শুরুতে শিক্ষার্থীর সাথে সুন্দরভাবে মত বিনিময় (কুশল বিনিময় বা শুভেচ্ছা) করবে। এরপর শিক্ষার্থী কোনো আইনের ধারা বা বিষয় জানতে চাইলে অত্যন্ত চমৎকার, সহজ এবং বেশ সময় নিয়ে খুব বিস্তারিত ও গভীরভাবে (in-depth) সেটি আলোচনা করবে। প্রতিটি পয়েন্ট, উপাদান ও প্রেক্ষাপট একদম ভেঙে ভেঙে বুঝিয়ে বলবে। আলোচনার শেষে অবশ্যই ধারাটি সহজে মুখস্থ রাখার জন্য অভিনব ও কার্যকরী শর্টকাট টেকনিক (Mnemonic) বা বাস্তব জীবনের মজার উদাহরণ দিয়ে বুঝিয়ে দেবে। তোমার উত্তর হবে তথ্যবহুল, গোছানো এবং শ্রুতিমধুর, ঠিক যেন ক্লাসরুমে কথা বলছ।";
      }
    }

    let subjectContext = "";
    if (subjectId && subjectId !== "all") {
      subjectContext = ` [Subject: ${subjectId}]`;
    }

    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-2)) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        });
      }
    }

    const languageInstruction = isEnglish
      ? "Respond immediately in natural conversational spoken English."
      : "কোনো কালক্ষেপণ ছাড়া সাথে সাথে খাঁটি ও মিষ্টি ভাষায় মুখে শোনার মতো সরাসরি বাংলায় উত্তর দাও।";

    contents.push({
      role: "user",
      parts: [
        {
          text: `[Live Voice Direct Spoken Directive: ${modeInstruction}${subjectContext} Instruction: ${languageInstruction}]\n\nStudent Voice Query: ${prompt}`,
        },
      ],
    });

    const stream = await safeGenerateContentStream(ai, {
      model: "gemini-3.1-flash-lite",
      contents,
      config: {
        systemInstruction: "You are a real-time conversational AI Law Voice Teacher (ChatGPT Voice / Gemini Live standard). Answer instantly, conversationally, without any introductory filler or markdown.",
        temperature: 0.5,
        maxOutputTokens: 1500,
      },
      fallbackModels: ["gemini-3.1-flash-lite", "gemini-3.7-flash"],
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Error in /api/gemini/stream-voice:", error);
    try {
      res.write(`data: ${JSON.stringify({ delta: "আইন অনুযায়ী ধারা ও মূল আইনি উপাদানসমূহ অত্যন্ত গুরুত্বপূর্ণ।" })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch {}
  }
});

// 3.2 ULTRA-FAST COMBINED VOICE AGENT API (Gemini Live Style One-Shot Text + Audio Generation)
app.post("/api/gemini/fast-voice-response", async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, history = [], subjectId, voice = "Zephyr", mode = "lecture", language = "bn" } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const ai = getGeminiClient();
    const isEnglish = language === "en";

    let modeInstruction = "";
    if (isEnglish) {
      if (mode === "viva") {
        modeInstruction = "You are a strict Bar Council & Judicial Service Viva Board Examiner. Give a concise, direct, authoritative answer in English and ask one sharp follow-up legal question. Ensure absolute precision with statutory sections, legal maxims (e.g. Res Judicata, Mens Rea, Estoppel), and landmark cases. Keep response under 3-4 sentences so it sounds natural in a live voice conversation.";
      } else if (mode === "moot") {
        modeInstruction = "You are a High Court Division Judge presiding over a Moot Court. Question or rule upon the advocate's legal argument concisely and directly in authoritative judicial English with statutory citations.";
      } else if (mode === "flash") {
        modeInstruction = "Provide a rapid 15-second high-yield spoken summary in English highlighting the exact Statutory Section, 3 Key Ingredients, and Landmark Case Law in crisp spoken English.";
      } else {
        modeInstruction = "You are an expert, friendly Law Professor in a real-time conversational voice session. Explain the statutory doctrine clearly, concisely, and naturally in spoken English with relevant statutory sections, legal maxims, and landmark cases. Keep response focused and conversational (under 4-5 sentences) so it sounds pleasant and instant when spoken.";
      }
    } else {
      if (mode === "viva") {
        modeInstruction = "তুমি একজন বার কাউন্সিল ও জুডিশিয়াল সার্ভিস ভাইভা বোর্ডের বিজ্ঞ পরীক্ষক। শিক্ষার্থীর প্রশ্নের উত্তর সম্পূর্ণ খাঁটি ও সাবলীল বাংলা ভাষায় সংক্ষেপে (৩-৪ বাক্যে) বুঝিয়ে বলো এবং সাথে সাথে একটি ধারাকেন্দ্রিক পাল্টা ভাইভা প্রশ্ন করো যাতে লাইভ কথোপকথন জীবন্ত থাকে।";
      } else if (mode === "moot") {
        modeInstruction = "তুমি সুপ্রিম কোর্টের হাইকোর্ট বিভাগের বিজ্ঞ বিচারপতি। অ্যাডভোকেটের আইনি যুক্তি ও নজিরের ওপর বিচারিক মন্তব্য ও প্রশ্ন সম্পূর্ণ খাঁটি ও প্রাঞ্জল বাংলা ভাষায় প্রদান করো।";
      } else if (mode === "flash") {
        modeInstruction = "১৫ সেকেন্ডের দ্রুত হাই-ইল্ড অডিও সামারি দাও: মূল ধারা নম্বর, ৩টি আবশ্যকীয় উপাদান এবং ল্যান্ডমার্ক কেস সম্পূর্ণ প্রাঞ্জল বাংলায় মুখে বলার মতো করে সংক্ষেপে বলো।";
      } else {
        modeInstruction = "তুমি একজন অত্যন্ত অভিজ্ঞ ও স্নেহশীল আইন শিক্ষক। কথা বলার শুরুতে শিক্ষার্থীর সাথে সুন্দরভাবে মত বিনিময় (কুশল বিনিময় বা শুভেচ্ছা) করবে। এরপর শিক্ষার্থী কোনো আইনের ধারা বা বিষয় জানতে চাইলে অত্যন্ত চমৎকার, সহজ এবং বেশ সময় নিয়ে খুব বিস্তারিত ও গভীরভাবে (in-depth) সেটি আলোচনা করবে। প্রতিটি পয়েন্ট, উপাদান ও প্রেক্ষাপট একদম ভেঙে ভেঙে বুঝিয়ে বলবে। আলোচনার শেষে অবশ্যই ধারাটি সহজে মুখস্থ রাখার জন্য অভিনব ও কার্যকরী শর্টকাট টেকনিক (Mnemonic) বা বাস্তব জীবনের মজার উদাহরণ দিয়ে বুঝিয়ে দেবে। তোমার উত্তর হবে তথ্যবহুল, গোছানো এবং শ্রুতিমধুর, ঠিক যেন ক্লাসরুমে কথা বলছ।";
      }
    }

    let subjectContext = "";
    if (subjectId && subjectId !== "all") {
      subjectContext = ` [Subject Focus: ${subjectId}]`;
    }

    // Format conversational history
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-4)) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        });
      }
    }

    const languageInstruction = isEnglish
      ? "Respond entirely in English for spoken voice clarity."
      : "সর্বাবস্থায় উত্তরটি সুস্পষ্ট ও শুদ্ধ বাংলা ভাষায় প্রদান করবে যাতে ভয়েসে সুন্দরভাবে শোনা যায়।";

    contents.push({
      role: "user",
      parts: [
        {
          text: `[System directive for voice response: ${modeInstruction}${subjectContext} Instruction: ${languageInstruction}]\n\nStudent question: ${prompt}`,
        },
      ],
    });

    // Step 1: Generate fast intelligent response with flash-latest for instant speed
    const textResponse = await safeGenerateContent(ai, {
      model: "gemini-3.1-flash-lite",
      contents,
      config: {
        systemInstruction: "You are a real-time conversational AI Law Voice Teacher. Speak naturally without any intro, markdown, or analysis delays. Be detailed, beautiful in explanation, and make it easy to remember with examples.",
        temperature: 0.5,
        maxOutputTokens: 1500,
      },
      fallbackModels: ["gemini-3.1-flash-lite", "gemini-3.7-flash"],
    });

    const reply = textResponse.text || (isEnglish ? "Under the relevant statute, this legal issue is of significant importance." : "আইন অনুযায়ী বিষয়টি অত্যন্ত গুরুত্বপূর্ণ।");

    // Step 2: Concurrently generate speech with TTS
    let audioBase64: string | null = null;
    try {
      const speechRes = await safeGenerateSpeech(ai, reply.slice(0, 1000), voice, language);
      audioBase64 = speechRes?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (ttsErr) {
      console.warn("TTS generation warning (will fallback on client):", ttsErr);
    }

    res.json({
      reply,
      audioBase64,
      sampleRate: 24000,
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/fast-voice-response:", error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 4. AUDIO TRANSCRIBE API: For Voice Agent audio mic recordings using gemini-3.5-transcribe
app.post("/api/gemini/transcribe", async (req: Request, res: Response): Promise<void> => {
  try {
    const { audioBase64, mimeType = "audio/webm", language = "bn" } = req.body;

    if (!audioBase64) {
      res.status(400).json({ error: "Audio data is required" });
      return;
    }

    const ai = getGeminiClient();

    const transcribePrompt =
      language === "en"
        ? "Transcribe the spoken legal audio verbatim in English. Accurately capture statutory citations (e.g. Section 99 Penal Code, Section 11 CPC, Section 32 Evidence Act), Latin legal maxims, and case names. Output only the transcript without extra commentary."
        : "Transcribe the spoken legal audio verbatim in Bengali or English. Accurately preserve statutory section numbers and legal terminology. Output only the transcript without extra commentary.";

    const response = await safeGenerateContent(ai, {
      model: "gemini-3.5-transcribe",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: audioBase64,
            },
          },
          {
            text: transcribePrompt,
          },
        ],
      },
      fallbackModels: ["gemini-3.7-flash", "gemini-flash-latest"],
    });

    res.json({ transcript: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/transcribe:", error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 5. CASE BRIEFER API: Generates structured FIRAM Case Brief
app.post("/api/gemini/case-brief", async (req: Request, res: Response): Promise<void> => {
  try {
    const { caseNameOrFacts } = req.body;

    if (!caseNameOrFacts) {
      res.status(400).json({ error: "Case name or facts are required" });
      return;
    }

    const ai = getGeminiClient();

    const response = await safeGenerateContent(ai, {
      model: "gemini-3.1-flash-lite",
      contents: `দয়া করে নিচের মামলা বা আইনি ঘটনার একটি পূর্ণাঙ্গ FIRAM কাঠামো অনুযায়ী কাঠামোগত কেস ব্রিফ তৈরি করো:
মামলা / ঘটনা: "${caseNameOrFacts}"

ফরমেট:
1. 🏛️ মামলার নাম ও উদ্ধৃতি (Case Title & Citation)
2. 📋 মূল ঘটনা সংক্ষেপ (Facts of the Case)
3. ⚖️ আইনি প্রশ্ন বা বিবাদীয় বিষয় (Legal Issues)
4. 📜 প্রযোজ্য ধারা ও আইনি বিধান (Applicable Rules & Sections)
5. 🔍 উভয় পক্ষের যুক্তি (Arguments of Parties)
6. 🎯 রায়ের মূল আইনি ভিত্তি (Ratio Decidendi)
7. 🏆 চূড়ান্ত সিদ্ধান্ত ও তাৎপর্য (Judgment & Legal Significance)`,
      config: {
        systemInstruction: LAW_TUTOR_SYSTEM_INSTRUCTION,
      },
      fallbackModels: ["gemini-3.1-flash-lite", "gemini-3.7-flash"],
    });

    res.json({ caseBrief: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/case-brief:", error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 6. MOCK VIVA & QUIZ GENERATOR API
app.post("/api/gemini/generate-quiz", async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId, count = 5 } = req.body;

    const ai = getGeminiClient();

    const prompt = `আইন শিক্ষার্থীদের জন্য ${subjectId || "আইন"} বিষয়ের উপর ${count} টি উচ্চমানের বহুনির্বাচনী প্রশ্ন (MCQ/Viva Questions) তৈরি করো। প্রতিটি প্রশ্নের ৪টি অপশন, সঠিক উত্তর নম্বর (0, 1, 2, বা 3), সহজ বাংলা ব্যাখ্যা এবং প্রাসঙ্গিক ধারার রেফারেন্স দাও।`;

    const response = await safeGenerateContent(ai, {
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING, description: "The question in Bengali" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4 answer choices",
              },
              correctIndex: { type: Type.INTEGER, description: "Index 0 to 3 of correct answer" },
              explanation: { type: Type.STRING, description: "Detailed explanation in Bengali with section and logic" },
              sectionRef: { type: Type.STRING, description: "Relevant Act and Section number" },
            },
            required: ["id", "question", "options", "correctIndex", "explanation"],
          },
        },
      },
      fallbackModels: ["gemini-3.1-flash-lite", "gemini-3.7-flash"],
    });

    const jsonText = response.text || "[]";
    const questions = JSON.parse(jsonText);
    res.json({ questions });
  } catch (error: any) {
    console.error("Error in /api/gemini/generate-quiz:", error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 7. LEGAL DRAFTING ASSISTANT API: Generates professional court pleadings & notices
app.post("/api/gemini/drafting", async (req: Request, res: Response): Promise<void> => {
  try {
    const { draftType, facts, parties, courtName, specificRelief, statutorySections } = req.body;

    if (!draftType || !facts) {
      res.status(400).json({ error: "Draft type and facts are required" });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `তুমি একজন অভিজ্ঞ অ্যাডভোকেট ও সিনিয়র ড্রাফটসম্যান। নিচের তথ্যের ভিত্তিতে বিজ্ঞ আদালতের জন্য একটি সম্পূর্ণ, মানসম্মত এবং যথাযথ আইনানুগ ড্রাফট (আইনি দলিল/দরখাস্ত/আরজি) প্রস্তুত করো:

ড্রাফটের ধরণ: ${draftType}
আদালতের নাম: ${courtName || "বিজ্ঞ উপযুক্ত আদালত"}
পক্ষসমূহের বিবরণ: ${parties || "বাদী বনাম বিবাদী / দরখাস্তকারী বনাম প্রতিপক্ষ"}
মূল ঘটনা ও প্রেক্ষাপট: ${facts}
প্রার্থিত প্রতিকার: ${specificRelief || "আইনানুগ প্রতিকার ও সুবিচার"}
প্রাসঙ্গিক ধারা (যদি থাকে): ${statutorySections || "প্রযোজ্য সংশ্লিষ্ট আইন ও ধারা"}

ড্রাফটের মধ্যে অবশ্যই অন্তর্ভুক্ত করবে:
১. মোকামের নাম ও শিরোনাম (Cause Title & Suit No. header)
২. পক্ষসমূহের পরিচিতি
৩. বিষয়ের শিরোনাম ও ধারা রেফারেন্স
৪. মোকদ্দমার ঘটনা ও কারণ (Cause of Action date)
৫. প্রার্থিত প্রতিকার (Prayer / Relief Clause)
৬. হলফনামা ও সত্যপাঠ (Verification & Affidavit format)
৭. ড্রাফট সংক্রান্ত জরুরি প্র্যাকটিস টিপস ও সতর্কতা`;

    const response = await safeGenerateContent(ai, {
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: LAW_TUTOR_SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
      fallbackModels: ["gemini-3.1-flash-lite", "gemini-3.7-flash"],
    });

    res.json({ draft: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/drafting:", error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// 8. MOOT COURT & VIVA BENCH EVALUATION API
app.post("/api/gemini/moot-court", async (req: Request, res: Response): Promise<void> => {
  try {
    const { mode, scenario, userArgument, side, currentRound = 1 } = req.body;

    if (!userArgument) {
      res.status(400).json({ error: "User argument is required" });
      return;
    }

    const ai = getGeminiClient();

    const prompt = mode === 'viva'
      ? `তুমি বার কাউন্সিল বা জুডিশিয়ারি মৌখিক পরীক্ষার (Viva-Voce Board) অভিজ্ঞ ও প্রজ্ঞাবান পরীক্ষক প্যানেল।
শিক্ষার্থী নিচের প্রশ্নের উত্তর দিয়েছে:
প্রশ্ন/প্রসঙ্গ: "${scenario}"
 শিক্ষার্থীর উত্তর: "${userArgument}"

দয়া করে নিম্নলিখিত ফরমেটে মূল্যায়ন দাও:
১. 🎯 উত্তরের যথার্থতা ও স্কোর (১০ এর মধ্যে নম্বর)
২. ⚖️ আইনি ধারার সঠিকতা ও বাদ পড়া গুরুত্বপূর্ণ পয়েন্ট
৩. 🏛️ যেসব কেস ল রেফারেন্স দিলে উত্তরটি আরো সমৃদ্ধ হতো
৪. 💡 ভাইভা বোর্ডে বডি ল্যাঙ্গুয়েজ ও উপস্থাপনা শৈলীর টিপস
৫. ❓ শিক্ষার্থীকে পরখ করার পরবর্তী ১টি ফলো-আপ প্রশ্ন`
      : `তুমি সুপ্রিম কোর্ট বা আন্তর্জাতিক মুট কোর্টের বিজ্ঞ বিচারক বেঞ্চ (Hon'ble Bench of Judges)।
মুট কেস ফ্যাক্টস: "${scenario}"
আইনজীবীর প্রতিনিধিত্ব: ${side === 'petitioner' ? 'পিটিশনার / আপিলকারী' : 'রেসপন্ডেন্ট / বিবাদী পক্ষ'}
আইনজীবীর মৌখিক বক্তব্য (Oral Submission): "${userArgument}"
রাউন্ড নং: ${currentRound}

বিজ্ঞ জাজ হিসেবে নিচের ফরমেটে তাৎক্ষণিক ইন্টারভেনশন ও মূল্যায়ন দাও:
১. ⚖️ বেঞ্চের তীক্ষ্ণ আইনি প্রশ্ন (Judicial Questioning / Interventions challenge testing legal reasoning)
২. 🔍 আইনজীবীর যুক্তির শক্তি ও দুর্বলতা (Legal analysis of argument)
৩. 📚 প্রাসঙ্গিক বিধিবদ্ধ আইন ও প্রেসিডেন্টস যা ব্যবহার করা উচিত ছিল
৪. 🏆 স্কোরিং (বক্তব্য, আইনি জ্ঞান, আদালত শিষ্টাচার - মোট ১০০ এর মধ্যে নম্বর)
৫. 🏛️ পরবর্তী সাবমিশনের জন্য বিচারকের পরামর্শ`;

    const response = await safeGenerateContent(ai, {
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: LAW_TUTOR_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
      fallbackModels: ["gemini-3.1-flash-lite", "gemini-3.7-flash"],
    });

    res.json({ evaluation: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/moot-court:", error);
    res.status(500).json({ error: formatErrorMessage(error) });
  }
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", app: "LawTutor AI", timestamp: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const server = http.createServer(app);

  // Set up WebSocket server for Gemini Live API
  const wss = new WebSocketServer({ server, path: "/live" });

  wss.on("connection", async (clientWs, req) => {
    try {
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const language = url.searchParams.get("language") || "bn";
      const mode = url.searchParams.get("mode") || "lecture";
      const subjectId = url.searchParams.get("subjectId") || "all";

      const isEnglish = language === "en";
      let modeInstruction = "";
      if (isEnglish) {
        if (mode === "viva") modeInstruction = "You are a strict Bar Council & Judicial Service Viva Board Examiner. Give a concise, direct, authoritative answer in English and ask one sharp follow-up legal question. Ensure absolute precision. No markdown.";
        else if (mode === "moot") modeInstruction = "You are a High Court Division Judge presiding over a Moot Court. Question or rule upon the advocate's legal argument concisely and directly in authoritative judicial English with statutory citations.";
        else if (mode === "flash") modeInstruction = "Provide a rapid 15-second high-yield spoken summary in English highlighting the exact Statutory Section, 3 Key Ingredients, and Landmark Case Law in crisp spoken English.";
        else modeInstruction = "You are an expert, friendly Law Professor in a real-time conversational voice session. Explain the statutory doctrine clearly, concisely, and naturally in spoken English. Answer instantly without intro.";
      } else {
        if (mode === "viva") modeInstruction = "তুমি একজন বার কাউন্সিল ভাইভা বোর্ডের বিজ্ঞ পরীক্ষক। সরাসরি বিস্তারিত ও খাঁটি বাংলায় আইনি সমাধান দাও এবং একটি পাল্টা প্রশ্ন করো।";
        else if (mode === "moot") modeInstruction = "তুমি সুপ্রিম কোর্টের হাইকোর্ট বিভাগের বিজ্ঞ বিচারপতি। সরাসরি বিস্তারিত বিচারিক মন্তব্য মুখে বলো।";
        else if (mode === "flash") modeInstruction = "দ্রুত অডিও সামারি দাও: মূল ধারা নম্বর, আবশ্যকীয় উপাদান এবং ল্যান্ডমার্ক কেস মুখে বলার মতো করে সহজ ভাষায় বুঝিয়ে বলো।";
        else modeInstruction = "তুমি একজন অত্যন্ত অভিজ্ঞ ও স্নেহশীল আইন শিক্ষক। কথা বলার শুরুতে শিক্ষার্থীর সাথে সুন্দরভাবে মত বিনিময় (কুশল বিনিময় বা শুভেচ্ছা) করবে। এরপর শিক্ষার্থী কোনো আইনের ধারা বা বিষয় জানতে চাইলে অত্যন্ত চমৎকার, সহজ এবং বেশ সময় নিয়ে খুব বিস্তারিত ও গভীরভাবে (in-depth) সেটি আলোচনা করবে। প্রতিটি পয়েন্ট, উপাদান ও প্রেক্ষাপট একদম ভেঙে ভেঙে বুঝিয়ে বলবে। আলোচনার শেষে অবশ্যই ধারাটি সহজে মুখস্থ রাখার জন্য অভিনব ও কার্যকরী শর্টকাট টেকনিক (Mnemonic) বা বাস্তব জীবনের মজার উদাহরণ দিয়ে বুঝিয়ে দেবে। তোমার উত্তর হবে তথ্যবহুল, গোছানো এবং শ্রুতিমধুর, ঠিক যেন ক্লাসরুমে কথা বলছ।";
      }

      let subjectContext = subjectId !== "all" ? ` [Subject Focus: ${subjectId}]` : "";
      const systemInstruction = `[Live Voice Direct Spoken Directive: ${modeInstruction}${subjectContext}]`;

      const ai = getGeminiClient();
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction,
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Zephyr" },
            },
          },
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
      });

      clientWs.on("message", (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.audio) {
            session.sendRealtimeInput({
              audio: { data: msg.audio, mimeType: "audio/pcm;rate=16000" },
            });
          }
        } catch (e) {
          console.error("Live API WS message parse error", e);
        }
      });

      clientWs.on("close", () => {
        console.log("Client disconnected from Live API");
      });
    } catch (err) {
      console.error("Live API Setup Error:", err);
      clientWs.close();
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`LawTutor AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
