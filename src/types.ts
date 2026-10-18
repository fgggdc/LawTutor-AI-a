export type LawSubjectId = 
  | 'all'
  | 'property'              // ১. সম্পত্তি হস্তান্তর আইন (Transfer of Property Act)
  | 'intellectual_property' // ২. বুদ্ধিবৃত্তিক সম্পত্তি আইন (IP Law - Copyright, Patent, Trademark)
  | 'cpc'                   // ৩. দেওয়ানি কার্যবিধি (CPC)
  | 'limitation'            // ৪. তামাদি আইন (Limitation Act)
  | 'penal_code'            // ৫. দণ্ডবিধি (Penal Code)
  | 'crpc'                  // ৬. ফৌজদারি কার্যবিধি (CrPC)
  | 'evidence'              // ৭. সাক্ষ্য আইন (Evidence Act)
  | 'international_law'     // ৮. আন্তর্জাতিক আইন (International Law)
  | 'land_law'              // ৯. ভূমি আইন (Land Law - SAT Act, NAT Act)
  | 'registration'          // ১০. রেজিস্ট্রেশন আইন (Registration Act)
  | 'pdr_act'               // ১১. সরকারি দাবী আদায় আইন (PDR Act / Public Demands Recovery)
  | 'company_law'           // ১২. কোম্পানি আইন (Company Law)
  | 'business_law'          // ১৩. বাংলাদেশের ব্যবসায়িক আইন (Business/Commercial Law)
  | 'drafting_ethics'       // ১৪. সিভিল ড্রাফটিং, ক্রিমিনাল ড্রাফটিং ও প্রফেশনাল এথিকস
  | 'viva_moot'             // ১৫. ভাইভা-ভোসি ও মুট কোর্ট
  | 'constitution'          // সাংবিধানিক আইন
  | 'specific_relief'       // সুনির্দিষ্ট প্রতিকার আইন
  | 'tort'                  // টর্ট আইন
  | 'family'                // পারিবারিক ও মুসলিম আইন
  | 'jurisprudence';        // আইনশাস্ত্র

export interface LawSubject {
  id: LawSubjectId;
  nameBn: string;
  nameEn: string;
  actName: string;
  year?: string;
  serialNo: number;
  iconName: string;
  color: string;
  description: string;
  popularTopics: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  subjectId?: LawSubjectId;
  imageUrl?: string;
  audioBase64?: string;
  isStreaming?: boolean;
}

export interface LegalMaxim {
  id: string;
  latin: string;
  english: string;
  bengali: string;
  explanation: string;
  landmarkCase?: string;
  category: string;
}

export interface LawSectionItem {
  id: string;
  subjectId: LawSubjectId;
  sectionNumber: string;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  keyIngredients: string[];
  landmarkCase?: string;
  examTip?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sectionRef?: string;
  subjectId: LawSubjectId;
}

export interface CaseBriefResult {
  caseTitle: string;
  citation?: string;
  courtAndYear?: string;
  facts: string;
  issues: string[];
  relevantSections: string[];
  arguments: {
    petitionerOrProsecution: string;
    respondentOrDefense: string;
  };
  ratioDecidendi: string;
  judgment: string;
  keyTakeaway: string;
}

export interface DraftingTemplate {
  id: string;
  type: 'civil' | 'criminal' | 'ethics' | 'commercial';
  titleBn: string;
  titleEn: string;
  statuteReference: string;
  description: string;
  sampleFacts: string;
  templateFormat: string;
}

export interface MootCaseScenario {
  id: string;
  titleBn: string;
  titleEn: string;
  forum: string;
  factsSummary: string;
  issues: string[];
  petitionerArguments: string[];
  respondentArguments: string[];
  relevantStatutes: string[];
}

export interface PDFDocumentItem {
  id: string;
  title: string;
  subject?: string;
  type: 'case_brief' | 'section_notes' | 'draft' | 'analysis' | 'viva' | 'upload' | 'sample';
  content: string;
  fileUrl?: string;
  createdAt: string;
  pageCount?: number;
}


