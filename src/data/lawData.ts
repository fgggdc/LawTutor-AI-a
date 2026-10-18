import { LawSubject, LegalMaxim, LawSectionItem, DraftingTemplate, MootCaseScenario } from '../types';

export const LAW_SUBJECTS: LawSubject[] = [
  {
    id: 'property',
    serialNo: 1,
    nameBn: '১. সম্পত্তি হস্তান্তর আইন',
    nameEn: 'Transfer of Property Act',
    actName: 'The Transfer of Property Act',
    year: '1882',
    iconName: 'Home',
    color: 'border-amber-700 text-amber-800 bg-amber-50',
    description: 'স্থাবর ও অস্থাবর সম্পত্তির বিক্রয়, বন্ধক, ইজারা, বিনিময় ও দান (Gift) হস্তান্তর বিধান।',
    popularTopics: [
      'লিস পেন্ডেন্স বা বিচারাধীন মামলা নীতি (Lis Pendens - ধারা ৫২)',
      'আংশিক সম্পাদন নীতি (Doctrine of Part Performance - ধারা ৫৩ক)',
      'অযৌক্তিক শর্তারোপ ও চিরস্থায়িত্বের বিরুদ্ধে নীতি (Rule against Perpetuity - ধারা ১৪)',
      'বন্ধকের প্রকারভেদ ও খালাসের অধিকার (Mortgage & Right of Redemption - ধারা ৫৮ ও ৬০)',
      'দান বা হেবা এর উপাদান ও শর্তাবলী (Gift - ধারা ১২২-১২৯)',
      'অসৎ উদ্দেশ্যে হস্তান্তর (Fraudulent Transfer - ধারা ৫৩)'
    ]
  },
  {
    id: 'intellectual_property',
    serialNo: 2,
    nameBn: '২. বুদ্ধিবৃত্তিক সম্পত্তি আইন',
    nameEn: 'Intellectual Property Law',
    actName: 'Copyright, Patent, Design & Trademark Acts',
    year: '2009-2023',
    iconName: 'Sparkles',
    color: 'border-purple-700 text-purple-800 bg-purple-50',
    description: 'কপিরাইট (কৃতিস্বত্ব), ট্রেডমার্ক, পেটেন্ট, ডিজাইন এবং ভৌগোলিক নির্দেশক (GI) সুরক্ষা আইন।',
    popularTopics: [
      'কপিরাইট আইন ২০২৩: কৃতিস্বত্বের অধিকার ও লঙ্ঘন (Infringement)',
      'ট্রেডমার্ক আইন ২০০৯: ট্রেডমার্ক নিবন্ধন, প্রতারণামূলক সাদৃশ্য ও পাসিং অফ (Passing Off)',
      'বাংলাদেশ পেটেন্ট আইন ২০২৩: উদ্ভাবনের শর্তাবলী ও বাধ্যতামূলক লাইসেন্স',
      'ভৌগোলিক নির্দেশক পণ্য (GI) সুরক্ষা ও জামদানি/ইলিশ উদাহরণ',
      'ফেয়ার ইউজ নীতি (Fair Use Doctrine) ও শিক্ষামূলক ব্যতিক্রম',
      'মেধা সম্পত্তি সুরক্ষার আন্তর্জাতিক চুক্তি (TRIPS, Berne, Paris Convention)'
    ]
  },
  {
    id: 'cpc',
    serialNo: 3,
    nameBn: '৩. দেওয়ানি কার্যবিধি',
    nameEn: 'Code of Civil Procedure',
    actName: 'The Code of Civil Procedure (CPC)',
    year: '1908',
    iconName: 'FileText',
    color: 'border-blue-700 text-blue-800 bg-blue-50',
    description: 'দেওয়ানি আদালতের এখতিয়ার, আরজি দাখিল, লিখিত জবাব, নিষেধাজ্ঞা ও ডিক্রি জারি পদ্ধতি।',
    popularTopics: [
      'রেস জুডিকাটা নীতি (Res Judicata - ধারা ১১) ও রেজ সাবজুডিস (ধারা ১০)',
      'অস্থায়ী নিষেধাজ্ঞা ও অন্তর্ভর্তিকালীন আদেশ (Order 39 Rule 1-2)',
      'আরজি বাতিল বা রিজেকশন অব প্লেন্ট (Rejection of Plaint - Order 7 Rule 11)',
      'একতরফা ডিক্রি ও তা বাতিলের আবেদন (Setting Aside Ex-parte Decree - Order 9 Rule 13)',
      'দেওয়ানি আদালতের এখতিয়ার (Territorial & Pecuniary Jurisdiction - ধারা ৯, ১৫-২০)',
      'ডিক্রি জারি মোকদ্দমা (Execution of Decree - ধারা ৩৮-৭৪, Order 21)'
    ]
  },
  {
    id: 'limitation',
    serialNo: 4,
    nameBn: '৪. তামাদি আইন',
    nameEn: 'Limitation Act',
    actName: 'The Limitation Act',
    year: '1908',
    iconName: 'Clock',
    color: 'border-rose-700 text-rose-800 bg-rose-50',
    description: 'মামলা, আপিল ও দরখাস্ত দাখিলের নির্দিষ্ট সময়সীমা, তামাদি মার্জনা ও স্বত্ব অর্জন।',
    popularTopics: [
      'তামাদি উত্তীর্ণের ফলাফল ও আদালতের দায়িত্ব (Dismissal of suits - ধারা ৩)',
      'বিলম্ব মওকুফ বা তামাদি মার্জনা (Condonation of Delay - ধারা ৫)',
      'আইনি অক্ষমতা বা নাবালকত্বে তামাদি গণনা (Legal Disability - ধারা ৬-৮)',
      'নকল তুলতে বিলম্ব ও সময় বর্জন (Exclusion of time in legal proceedings - ধারা ১২)',
      'প্রতারণা ও লিখিত স্বীকৃতির প্রভাব (Effect of Fraud & Written Acknowledgment - ধারা ১৮, ১৯ ও ২০)',
      'দখল দ্বারা সুখাধিকার ও স্বত্ব অর্জন (Acquisition of Easement by Prescription - ধারা ২৬-২৮)'
    ]
  },
  {
    id: 'penal_code',
    serialNo: 5,
    nameBn: '৫. দণ্ডবিধি (পেনাল কোড)',
    nameEn: 'Penal Code',
    actName: 'The Penal Code',
    year: '1860',
    iconName: 'Scale',
    color: 'border-amber-700 text-amber-800 bg-amber-50',
    description: 'অপরাধের উপাদান, অপরাধমূলক মানসিকতা (Mens Rea), নরহত্যা, খুন, চুরি ও প্রতারণার দণ্ড।',
    popularTopics: [
      'খুন বনাম নির্দোষ নরহত্যার পার্থক্য (Culpable Homicide vs Murder - ধারা ২৯৯ ও ৩০০)',
      'আত্মরক্ষার ব্যক্তিগত অধিকার (Right of Private Defence - ধারা ৯৬-১০৬)',
      'অভিন্ন অভিপ্রায় ও সাধারণ উদ্দেশ্য (Common Intention vs Common Object - ধারা ৩৪ ও ১৪৯)',
      'চুরি, বলপূর্বক গ্রহণ, দস্যুতা ও ডাকাতি (Sections 378, 383, 390, 391)',
      'প্রতারণা ও বিশ্বাসভঙ্গ (Cheating & Criminal Breach of Trust - ধারা ৪১৫ ও ৪০৫)',
      'ধর্ষণ ও নারী নির্যাতন সংক্রান্ত বিধান (Rape & Sexual Offences - ধারা ৩৭৫)'
    ]
  },
  {
    id: 'crpc',
    serialNo: 6,
    nameBn: '৬. ফৌজদারি কার্যবিধি',
    nameEn: 'Code of Criminal Procedure',
    actName: 'The Code of Criminal Procedure (CrPC)',
    year: '1898',
    iconName: 'ShieldAlert',
    color: 'border-red-700 text-red-800 bg-red-50',
    description: 'থানায় এজাহার (FIR), তদন্ত, রিমান্ড, স্বীকারোক্তি, জামিন, চার্জ গঠন ও বিচার প্রক্রিয়া।',
    popularTopics: [
      'এজাহার বনাম জিডি (FIR vs General Diary - ধারা ১৫৪)',
      'পুলিশ রিমান্ড ও স্বীকারোক্তিমূলক জবানবন্দি (Sections 167 & 164)',
      'জামিন মঞ্জুরের বিধান ও আগাম জামিন (Bail Provisions - ধারা ৪৯৬, ৪৯৭ ও ৪৯৮)',
      'শান্তিশৃঙ্খলা বজায় রাখা ও ১৪৪ ধারা জারি (Section 144 CrPC)',
      'ফৌজদারি আদালতে চার্জ গঠন ও বিচার প্রক্রিয়া (Framing of Charge - ধারা ২৪১ক-২৪৫)',
      'হাইকোর্ট বিভাগের রিভিশন ও আপিল এখতিয়ার (Sections 439 & 417)'
    ]
  },
  {
    id: 'evidence',
    serialNo: 7,
    nameBn: '৭. সাক্ষ্য আইন',
    nameEn: 'Law of Evidence',
    actName: 'The Evidence Act',
    year: '1872',
    iconName: 'Eye',
    color: 'border-emerald-700 text-emerald-800 bg-emerald-50',
    description: 'মৌখিক, দালিলিক ও ডিজিটাল সাক্ষ্যের গ্রহণযোগ্যতা, প্রমাণের দায়ভার ও এস্টোপেল।',
    popularTopics: [
      'মৃত্যুকালীন ঘোষণা বা জবানবন্দি (Dying Declaration - ধারা ৩২(১))',
      'স্বীকারোক্তি বনাম স্বীকৃতি (Confession & Admission - ধারা ২৪-৩০)',
      'রেস জেস্টে বা একই কার্যের অংশ (Doctrine of Res Gestae - ধারা ৬)',
      'প্রমাণের দায়ভার বা বার্ডেন অব প্রুফ (Burden of Proof - ধারা ১০১-১০৫)',
      'এস্টোপেল বা স্বীকৃতি বাধা নীতি (Doctrine of Estoppel - ধারা ১১৫)',
      'সাক্ষীর জেরা, জবানবন্দি ও পুনর্জেরা (Examination of Witnesses - ধারা ১৩৭-১৬৫)'
    ]
  },
  {
    id: 'international_law',
    serialNo: 8,
    nameBn: '৮. আন্তর্জাতিক আইন',
    nameEn: 'Public International Law',
    actName: 'International Treaties & UN Conventions',
    year: 'Global',
    iconName: 'Globe',
    color: 'border-sky-700 text-sky-800 bg-sky-50',
    description: 'সার্বভৌমত্ব, আন্তর্জাতিক চুক্তি (Treaties), সমুদ্র আইন, প্রত্যর্পণ, আশ্রয় ও মানবাধিকার।',
    popularTopics: [
      'আন্তর্জাতিক আইনের উৎসসমূহ (আইসিজে সংবিধির অনুচ্ছেদ ৩৮)',
      'চুক্তি সম্পাদনের ভিয়েনা কনভেনশন ১৯৬৯ (Pacta Sunt Servanda)',
      'রাষ্ট্রের স্বীকৃতি (De Jure vs De Facto Recognition)',
      'প্রত্যর্পণ ও রাজনৈতিক আশ্রয় (Extradition and Asylum)',
      'আন্তর্জাতিক আদালত (ICJ & ICC) এর এখতিয়ার ও রায় বাস্তবায়ন',
      'আন্তর্জাতিক মানবাধিকার আইন (UDHR 1948, ICCPR & ICESCR)'
    ]
  },
  {
    id: 'land_law',
    serialNo: 9,
    nameBn: '৯. ভূমি আইন',
    nameEn: 'Land Law of Bangladesh',
    actName: 'State Acquisition & Tenancy Act (SAT Act) / Land Reforms',
    year: '1950-2023',
    iconName: 'MapPin',
    color: 'border-lime-800 text-lime-900 bg-lime-50',
    description: 'জমিদারি উচ্ছেদ, খতিয়ান, নামজারি (Mutation), জমি ক্রয়-বিক্রয়, প্রিয়েম্পশন ও ভূমি অপরাধ প্রতিরোধ।',
    popularTopics: [
      'অগ্রক্রয়াধিকার বা প্রিয়েম্পশন মোকদ্দমা (Pre-emption - SAT Act ধারা ৯৬)',
      'খতিয়ান ও রেকর্ড অব রাইটস (CS, SA, RS, BS ও City Survey Khatian)',
      'নামজারি ও জমাভাগ (Mutation & Separation of Jote)',
      'ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩ (জাল দলিল ও অবৈধ দখল প্রতিরোধ)',
      'অকৃষি প্রজা আইন (Non-Agricultural Tenancy Act, 1949)',
      'খাস জমি ও অর্পিত সম্পত্তি (Vested Property) বন্দোবস্তের বিধান'
    ]
  },
  {
    id: 'registration',
    serialNo: 10,
    nameBn: '১০. রেজিস্ট্রেশন আইন',
    nameEn: 'Registration Act',
    actName: 'The Registration Act',
    year: '1908',
    iconName: 'FileCheck2',
    color: 'border-orange-800 text-orange-900 bg-orange-50',
    description: 'স্থাবর সম্পত্তির দলিল নিবন্ধন, বাধ্যতামূলক ও ঐচ্ছিক দলিল এবং নিবন্ধনের স্থান।',
    popularTopics: [
      'বাধ্যতামূলক রেজিস্ট্রিকরণযোগ্য দলিলসমূহ (Compulsory Registration - ধারা ১৭)',
      'ঐচ্ছিক রেজিস্ট্রিকরণ দলিলসমূহ (Optional Documents - ধারা ১৮)',
      'অনিবন্ধিত দলিলের আইনি ফলাফল ও আদালতে অগ্রহণযোগ্যতা (ধারা ৪৯)',
      'দলিল রেজিস্ট্রেশনের সময়সীমা ও বিলম্ব মওকুফ (ধারা ২৩-২৬)',
      'হেবা বা বায়না দলিলের বাধ্যতামূলক রেজিস্ট্রেশন ও ধারা ৫২ক বিধান',
      'সাব-রেজিস্ট্রার কর্তৃক দলিল গ্রহণে অস্বীকৃতি ও প্রতিকার (ধারা ৭২-৭৭)'
    ]
  },
  {
    id: 'pdr_act',
    serialNo: 11,
    nameBn: '১১. সরকারি দাবী আদায় আইন',
    nameEn: 'Public Demands Recovery Act (PDR Act)',
    actName: 'The Public Demands Recovery Act',
    year: '1913',
    iconName: 'Landmark',
    color: 'border-stone-800 text-stone-900 bg-stone-100',
    description: 'সরকারি বকেয়া রাজস্ব, ঋণ ও দাবি আদায়ে সার্টিফিকেট মামলা ও দেনাদারের সম্পত্তি ক্রোক।',
    popularTopics: [
      'সরকারি দাবি (Public Demand) এর সংজ্ঞা ও তফসিল ১ তালিকা',
      'সার্টিফিকেট প্রস্তুত ও দাখিল পদ্ধতি (Sections 4 & 6)',
      'দেনাদারের প্রতি নোটিশ জারি ও তার আইনি ফলাফল (Section 7 Notice)',
      'দেনাদার কর্তৃক দায় অস্বীকার করে দরখাস্ত দাখিল (Petition denying liability - Section 9)',
      'সার্টিফিকেট কার্যকরণ ও দেনাদারের স্থাবর-অস্থাবর সম্পত্তি ক্রোক ও নিলাম (Section 17-28)',
      'সার্টিফিকেট অফিসারের আদেশের বিরুদ্ধে আপিল ও রিভিশন (Sections 51 & 53)'
    ]
  },
  {
    id: 'company_law',
    serialNo: 12,
    nameBn: '১২. কোম্পানি আইন',
    nameEn: 'Company Law',
    actName: 'The Companies Act',
    year: '1994',
    iconName: 'Building',
    color: 'border-indigo-800 text-indigo-900 bg-indigo-50',
    description: 'কোম্পানি গঠন, স্মারকলিপি (MoA), সংঘবিধি (AoA), কর্পোরেট পর্দা উন্মোচন ও অবসায়ন (Winding Up)।',
    popularTopics: [
      'স্বতন্ত্র সত্তা ও কর্পোরেট পর্দা উন্মোচন (Salomon v. Salomon & Lifting the Veil)',
      'স্মারকলিপি (Memorandum) বনাম সংঘবিধি (Articles of Association)',
      'ক্ষমতাবহির্ভূত কাজ বা আল্ট্রা ভাইয়ার্স মতবাদ (Doctrine of Ultra Vires)',
      'পরিচালকদের ক্ষমতা, দায়দায়িত্ব ও দায়িত্বহীনতার প্রতিকার (Fiduciary Duties)',
      'সংখ্যালঘু শেয়ারহোল্ডারদের সুরক্ষা ও নির্যাতন প্রতিরোধ (Sections 233)',
      'আদালত কর্তৃক কোম্পানি অবসায়ন বা ওয়াইন্ডিং আপ (Winding Up by Court)'
    ]
  },
  {
    id: 'business_law',
    serialNo: 13,
    nameBn: '১৩. বাংলাদেশের ব্যবসায়িক আইন',
    nameEn: 'Commercial & Business Law',
    actName: 'Sale of Goods, Partnership & NI Acts',
    year: '1881-1932',
    iconName: 'Coins',
    color: 'border-emerald-800 text-emerald-900 bg-emerald-50',
    description: 'পণ্য বিক্রয় আইন, অংশীদারি কারবার ও চেক ডিজঅনার (NI Act 138) মামলা পরিচালনা।',
    popularTopics: [
      'চেক ডিজঅনার মামলার পূর্ণাঙ্গ আইনি প্রক্রিয়া ও নোটিশ (NI Act Section 138)',
      'শর্ত বনাম নিশ্চয়তা (Conditions and Warranties - Sale of Goods Act)',
      'ক্রেতা সাবধান নীতি (Doctrine of Caveat Emptor) ও এর ব্যতিক্রমসমূহ',
      'অংশীদারি কারবারের অপরিহার্য উপাদান ও অংশীদারিত্ব পরীক্ষা (Partnership Act)',
      'অনিবন্ধিত অংশীদারি ফার্মের মামলা করার সীমাবদ্ধতা (Section 69)',
      'অনাদায়ী বিক্রেতার অধিকার বা রাইট অব আনপেইড সেলার (Unpaid Seller Rights)'
    ]
  },
  {
    id: 'drafting_ethics',
    serialNo: 14,
    nameBn: '১৪. সিভিল ও ক্রিমিনাল ড্রাফটিং এবং প্রফেশনাল এথিকস',
    nameEn: 'Legal Drafting & Professional Ethics',
    actName: 'Bar Council Canons of Professional Conduct',
    year: 'Bangladesh Bar Council',
    iconName: 'ScrollText',
    color: 'border-teal-800 text-teal-900 bg-teal-50',
    description: 'আরজি, লিখিত জবাব, সি.আর মামলা, জামিনের দরখাস্ত ও আইনজীবীদের পেশাগত আচরণ বিধিমালা।',
    popularTopics: [
      'সিভিল ড্রাফটিং: স্বত্ব ঘোষণার আরজি (Plaint) ও লিখিত জবাব (Written Statement)',
      'সিভিল ড্রাফটিং: অস্থায়ী নিষেধাজ্ঞার আবেদন ও হলফনামা (Order 39 Rule 1-2 CPC)',
      'ক্রিমিনাল ড্রাফটিং: নালিশি সি.আর পিটিশন (Complaint u/s 200 CrPC)',
      'ক্রিমিনাল ড্রাফটিং: দায়রা জজ ও ম্যাজিস্ট্রেট আদালতে জামিনের দরখাস্ত (Bail Petition)',
      'ক্রিমিনাল ড্রাফটিং: চেক ডিজঅনার মামলার লিগ্যাল নোটিশ ও আরজি (NI Act 138)',
      'প্রফেশনাল এথিকস: মক্কেল, আদালত, সহকর্মী আইনজীবী ও জনগণের প্রতি অ্যাডভোকেটের আচরণ বিধিমালা'
    ]
  },
  {
    id: 'viva_moot',
    serialNo: 15,
    nameBn: '১৫. ভাইভা-ভোসি ও মুট কোর্ট',
    nameEn: 'Viva-Voce & Moot Court Simulator',
    actName: 'Bar Council Viva & Moot Court Trial Practice',
    year: 'Practical Legal Training',
    iconName: 'Award',
    color: 'border-yellow-700 text-yellow-900 bg-yellow-50',
    description: 'বার কাউন্সিল ও জুডিশিয়ারি পরীক্ষার সরাসরি ভাইভা বোর্ড প্রশ্ন ও কাল্পনিক আদালতের আর্গুমেন্ট ট্রায়াল।',
    popularTopics: [
      'বার কাউন্সিল ভাইভা বোর্ডে কমন প্রশ্ন ও উত্তর দেওয়ার নিখুঁত কৌশল',
      'মুট কোর্ট মেমোরিয়াল প্রস্তুতকরণ (Facts, Issues, Jurisdiction, Prayer)',
      'আদালতে মৌখিক আর্গুমেন্ট উপস্থাপন (Court Etiquette, Decorum & Submissions)',
      'কেস ল সাইটেশন ও জাজদের কঠিন প্রশ্নের তাৎক্ষণিক উত্তর দেওয়া',
      'প্রসিকিউশন বনাম ডিফেন্স লয়ার ট্রায়াল সিমুলেশন',
      'সিভিল অ্যাপিল্যান্ট ও রেসপন্ডেন্টের মুট আর্গুমেন্ট'
    ]
  }
];

export const DRAFTING_TEMPLATES: DraftingTemplate[] = [
  {
    id: 'draft-civil-plaint',
    type: 'civil',
    titleBn: 'জমির স্বত্ব ঘোষণা ও খাস দখল উদ্ধারের আরজি',
    titleEn: 'Plaint for Declaration of Title & Recovery of Khas Possession',
    statuteReference: 'Order 7 Rule 1 CPC & Section 8, 42 of Specific Relief Act',
    description: 'বাদীপক্ষের পক্ষে বিবাদী কর্তৃক বেআইনি দখলের বিরুদ্ধে সহকারী জজ আদালতে মূল মোকদ্দমার আরজি।',
    sampleFacts: 'বাদী ১ নং তপশিল বর্ণিত জমি ক্রয়সূত্রে বৈধ মালিক হইয়া ভোগদখল করিতে থাকা অবস্থায় বিবাদী গত ১০/০১/২০২৪ তারিখে জোরপূর্বক বেদখল করিয়াছে।',
    templateFormat: `মোকাম: বিজ্ঞ ১ম আদালত সিনিয়র সহকারী জজ, ঢাকা।
দেওয়ানি মোকাদ্দমা নং: ......... / ২০২৪

ক (নাম, পিতা, ঠিকানা) ........................................ বাদী
বনাম
খ (নাম, পিতা, ঠিকানা) ........................................ বিবাদী

বিষয়: সুনির্দিষ্ট প্রতিকার আইনের ৮ ও ৪২ ধারা মতে স্বত্ব ঘোষণা ও খাস দখল পাওয়ার প্রার্থনায় আরজি।
মোকদ্দমার মূল্যায়ন: ৫০,০০,০০০/- (পঞ্চাশ লক্ষ) টাকা।

বাদীপক্ষের বিনীত নিবেদন এই যে:
১. তপশিল বর্ণিত জমি মূল মালিক হইতে বাদী বিগত ... তারিখে সাফ কাওলা দলিল নং ... মূলে ক্রয় করিয়া খাজনাদি পরিশোধ করত নিজ নামে খতিয়ান সৃজনপূর্বক ভোগদখল করিয়া আসিতেছিলেন।
২. বিবাদী কোনো রূপ স্বত্ব ও অধিকার ব্যতীত বিগত ১০/০১/২০২৪ তারিখে বেআইনি জনতাবদ্ধে দেশীয় অস্ত্রশস্ত্রে সজ্জিত হইয়া বাদীকে বলপূর্বক বেদখল করিয়াছে।
৩. বাদী স্থানীয় গণ্যমান্য ব্যক্তিদের দ্বারা আপস মীমাংসার চেষ্টা করিয়া ব্যর্থ হইয়াছেন। মোকদ্দমার কারণ (Cause of Action) বিগত ১০/০১/২০২৪ তারিখে উৎপন্ন হইয়া অদ্যাবধি বলবৎ রহিয়াছে।

প্রার্থনা:
অতএব, সুবিচার প্রার্থনা করিয়া আদালত সমীপে প্রার্থনা:
(ক) ১ নং তপশিল বর্ণিত জমিতে বাদীর ১৬ আনা স্বত্ব সাব্যস্ত ঘোষণা প্রদান করা হউক।
(খ) বিবাদীকে উচ্ছেদ করিয়া আদালতের নাজির মারফত বাদীকে বিরোধীয় জমির খাস দখল বুঝাইয়া দেওয়ার ডিক্রি প্রদান করা হউক।
(গ) মোকদ্দমার যাবতীয় খরচ ও খরচা বাদীকে প্রদানের আদেশ হউক।

হলফনামা (Verification & Affidavit):
আমি শ্রী/মোঃ ক, এই মর্মে শপথ করিয়া বলিতেছি যে, উপরিউক্ত আরজির ১ হইতে ৩ দফার বিবরণাদি আমার জ্ঞান ও বিশ্বাস মতে সত্য।`
  },
  {
    id: 'draft-civil-injunction',
    type: 'civil',
    titleBn: 'অস্থায়ী নিষেধাজ্ঞার দরখাস্ত ও হলফনামা',
    titleEn: 'Application for Temporary Injunction with Affidavit',
    statuteReference: 'Order 39 Rule 1 & 2 read with Section 151 CPC',
    description: 'মোকদ্দমা চলাকালীন বিরোধীয় জমির প্রকৃতি পরিবর্তন ও বিক্রি বন্ধে স্থিতাবস্থা জারির আবেদন।',
    sampleFacts: 'বিবাদী বিরোধীয় জমিতে থাকা পুরাতন দালান ভাঙ্গিয়া নূতন নির্মাণ কাজ শুরু করার হুমকি প্রদান করিতেছে।',
    templateFormat: `মোকাম: বিজ্ঞ যুগ্ম জেলা জজ ১ম আদালত, চট্টগ্রাম।
দেওয়ানি মোকদ্দমা নং: ......... / ২০২৪

ক ................................................................ বাদী/দরখাস্তকারী
বনাম
খ ................................................................ বিবাদী/প্রতিপক্ষ

বিষয়: দেওয়ানি কার্যবিধির ৩৯ আদেশের ১ ও ২ নিয়ম সহ ১৫১ ধারা মতে অস্থায়ী নিষেধাজ্ঞার দরখাস্ত।

দরখাস্তকারীর বিনীত আরজ এই যে:
১. অত্র মোকদ্দমায় বাদী নালিশি জমিতে স্বত্ব ঘোষণার প্রার্থনা করিয়াছেন যাহা বিচারাধীন রহিয়াছে।
২. দরখাস্তকারীর অনুকূলে একটি সুস্পষ্ট প্রাথমিক বিশ্বাসযোগ্য মামলা (Prima Facie Case) রহিয়াছে।
৩. প্রতিপক্ষ বিবাদী মোকদ্দমা চলাকালীন বিরোধীয় জমিতে অবৈধভাবে জোরপূর্বক পাকা দালান নির্মাণের অপচেষ্টা করিতেছে।
৪. বিবাদীকে অবিলম্বে নিষেধ না করিলে বাদীর অপূরণীয় ক্ষতি (Irreparable Loss) সাধিত হইবে এবং সুবিধার ভারসাম্যতা (Balance of Convenience) বাদীর অনুকূলে বিদ্যমান।

প্রার্থনা:
অতএব, বিনীত প্রার্থনা এই যে, অত্র মোকদ্দমা চূড়ান্ত নিষ্পত্তি না হওয়া পর্যন্ত বিবাদী যাহাতে নালিশি জমিতে প্রবেশ করিতে না পারে এবং জমির কোনো প্রকার রূপ পরিবর্তন করিতে না পারে সেই মর্মে অস্থায়ী নিষেধাজ্ঞার আদেশ প্রদানে মর্জি হয়।`
  },
  {
    id: 'draft-crim-bail',
    type: 'criminal',
    titleBn: 'মহানগর দায়রা জজ আদালতে ফৌজদারি নিয়মিত জামিনের দরখাস্ত',
    titleEn: 'Regular Bail Petition in Sessions Court',
    statuteReference: 'Section 497 & 498 Code of Criminal Procedure, 1898',
    description: 'কারাগারে আটক আসামির পক্ষে জামিন মঞ্জুরের জন্য বিজ্ঞ মহানগর দায়রা জজ বরাবরে দরখাস্ত।',
    sampleFacts: 'আসামি দীর্ঘদিন যাবৎ জেলহাজতে আছেন, তিনি নির্দোষ এবং স্থানীয় রাজনীতির শিকার হইয়া মিথ্যা মামলায় জড়িয়েছেন।',
    templateFormat: `মোকাম: বিজ্ঞ মহানগর দায়রা জজ আদালত, ঢাকা।
মহানগর দায়রা মোকদ্দমা নং: ......... / ২০২৪
(সূত্র: ধানমন্ডি থানা মামলা নং: ১২, তারিখ: ১৫/০৩/২০২৪; জি.আর নং: ১৮০/২৪)

রাষ্ট্র ................................................................ বাদী পক্ষ
বনাম
মোঃ রহিম (পিতা: আব্দুল করিম, হাজতী আসামি) ....... আসামি/দরখাস্তকারী

বিষয়: ফৌজদারি কার্যবিধির ৪৯৮ ধারা মতে আসামির জামিনের প্রার্থনা।

আসামিপক্ষের বিনীত নিবেদন এই যে:
১. আসামি সম্পূর্ণ নির্দোষ। এজাহারে আসামির বিরুদ্ধে সুনির্দিষ্ট কোনো অপরাধমূলক কাজের অভিযোগ নাই।
২. আসামি একজন সম্মানিত ব্যবসায়ী এবং সমাজে সুপ্রতিষ্ঠিত। পূর্ব শত্রুতার জের ধরিয়া তাহাকে ফাঁসানো হইয়াছে।
৩. আসামি বিগত ০৬ (ছয়) মাস যাবৎ জেলহাজতে মানবেতর জীবনযাপন করিতেছেন। মামলার তদন্ত প্রতিবেদন দাখিল হইয়াছে এবং তিনি বিচারে কোনো প্রকার বিঘ্ন সৃষ্টি করিবেন না।
৪. আসামি জামিন পাইলে কোনো অবস্থাতেই পলায়ন করিবেন না এবং বিজ্ঞ আদালতের যেকোনো শর্তে স্থানীয় জামিনদার দিতে প্রস্তুত আছেন।

প্রার্থনা:
অতএব, প্রার্থনা এই যে, সার্বিক দিক বিবেচনা করিয়া বিচার নিষ্পত্তি না হওয়া পর্যন্ত বিজ্ঞ আদালত সমীপে আসামির জামিন মঞ্জুর করিতে মর্জি হয়।`
  },
  {
    id: 'draft-crim-niact',
    type: 'criminal',
    titleBn: 'চেক ডিজঅনারের জন্য লিগ্যাল নোটিশ ও নালিশি আরজি',
    titleEn: 'Legal Notice & Complaint Petition under Section 138 of NI Act',
    statuteReference: 'Section 138 & 141 of Negotiable Instruments Act, 1881',
    description: 'ব্যাংক চেক অপর্যাপ্ত তহবিল (Insufficient Funds) কারণে প্রত্যাখ্যাত হলে মামলা দায়েরের ফরম্যাট।',
    sampleFacts: 'বিবাদী ব্যবসার পাওনা বাবদ ১০ লক্ষ টাকার চেক প্রদান করেন, যাহা ব্যাংকে জমা দিলে অপর্যাপ্ত তহবিলের কারণে ডিজঅনার হয়।',
    templateFormat: `মোকাম: বিজ্ঞ চিফ মেট্রোপলিটন ম্যাজিস্ট্রেট আদালত, ঢাকা।
সি.আর মোকদ্দমা নং: ......... / ২০২৪

ক (নাম, পিতা, ঠিকানা) ........................................ ফরিয়াদী / নালিশকারী
বনাম
খ (নাম, পিতা, ঠিকানা) ........................................ আসামি

বিষয়: Negotiable Instruments Act, 1881 এর ১৩৮ ধারার অধীনে অপরাধের শাস্তির নালিশি দরখাস্ত।

ফরিয়াদীর বিনীত নিবেদন এই যে:
১. আসামি ব্যবসার লেনদেন বাবদ ফরিয়াদীকে সোনালী ব্যাংক লিঃ এর ১০,০০,০০০/- (দশ লক্ষ) টাকার চেক নং-১২৩৪৫৬ তারিখ ০১/০৪/২০২৪ প্রদান করেন।
২. ফরিয়াদী উক্ত চেকটি ব্যাংকে নগদায়নের জন্য জমা দিলে ব্যাংক মেমোতে "Insufficient Fund" মন্তব্য সহ চেকটি ডিজঅনার হয়।
৩. ফরিয়াদী বিগত ১৫/০৪/২০২৪ তারিখে রেজিস্ট্রি ডাকযোগে প্রাপ্তিস্বীকারপত্র সহ আসামির বরাবর ৩০ দিনের মধ্যে টাকা পরিশোধের লিগ্যাল নোটিশ জারি করেন।
৪. আসামি নোটিশ প্রাপ্তির ৩০ দিন অতিবাহিত হইলেও কোনো টাকা পরিশোধ করেন নাই। অতএব আসামি এন.আই অ্যাক্টের ১৩৮ ধারার অধীনে শাস্তিযোগ্য অপরাধ করিয়াছেন।

প্রার্থনা:
অতএব, আসামির বিরুদ্ধে এন.আই অ্যাক্টের ১৩৮ ধারা মোতাবেক সমন/গ্রেফতারি পরোয়ানা জারি করিয়া আইনানুগ সর্বোচ্চ দণ্ড প্রদান করিতে মর্জি হয়।`
  },
  {
    id: 'draft-ethics-rules',
    type: 'ethics',
    titleBn: 'আইনজীবীর পেশাগত আচরণ ও বার কাউন্সিল বিধিমালা (Canons of Conduct)',
    titleEn: 'Bangladesh Bar Council Canons of Professional Conduct',
    statuteReference: 'Bangladesh Legal Practitioners and Bar Council Order & Rules, 1972',
    description: 'অ্যাডভোকেটদের পালনীয় ৪টি অধ্যায়ের গুরুত্বপূর্ণ নৈতিক আচরণ বিধি ও ট্রাইব্যুনাল বিচার।',
    sampleFacts: 'আদালতের মর্যাদা রক্ষা, মক্কেলের বিশ্বাসভঙ্গ না করা এবং অসদাচরণের বিরুদ্ধে শাস্তিমূলক ব্যবস্থা।',
    templateFormat: `অধ্যায় ১: আদালতের প্রতি আইনজীবীর কর্তব্য (Conduct with Regard to Court)
• বিচারকের প্রতি সর্বদা সম্মান ও মর্যাদা প্রদর্শন করা।
• বিচারককে ব্যক্তিগতভাবে প্রভাবিত করার কোনো চেষ্টা না করা।
• আদালতে মিথ্যা তথ্য বা বিভ্রান্তিকর নজির উপস্থাপন না করা।

অধ্যায় ২: মক্কেলের প্রতি আইনজীবীর কর্তব্য (Conduct with Regard to Clients)
• মক্কেলের গোপনীয় তথ্য (Privileged Communication) চিরকাল গোপন রাখা (সাক্ষ্য আইনের ১২৬ ধারা)।
• মক্কেলের সাথে এমন চুক্তি না করা যেখানে মামলার সাফল্যের উপর ভিত্তি করে ফি নির্ধারিত হয় (Contingent Fee নিষিদ্ধ)।
• প্রতিপক্ষের সাথে গোপনে কোনো আপস বা স্বার্থবিরোধমূলক কাজ না করা।

অধ্যায় ৩: সহকর্মী আইনজীবীদের প্রতি কর্তব্য (Duty to Fellow Advocates)
• কোনো সহকর্মীর মক্কেলকে অনৈতিকভাবে ছিনিয়ে নেওয়ার চেষ্টা না করা (No Poaching)।
• বিজ্ঞ সহকর্মীদের সঙ্গে সৌহার্দ্যপূর্ণ সম্পর্ক বজায় রাখা এবং নোটিশ ছাড়া কোনো কাজ না করা।

অধ্যায় ৪: জনগণের প্রতি কর্তব্য (Duty to Public)
• বিজ্ঞাপন দিয়ে বা সাইনবোর্ড ঝুলিয়ে মামলা খোঁজার অনৈতিক প্রচার না করা (No Commercial Solicitation)।
• দরিদ্র ও অসহায় বিচারপ্রার্থীদের আইনি সহায়তা প্রদানে এগিয়ে আসা।`
  }
];

export const MOOT_CASE_SCENARIOS: MootCaseScenario[] = [
  {
    id: 'moot-case-1',
    titleBn: 'ডিজিটাল প্রাইভেসি বনাম রাষ্ট্রীয় নজরদারি (মৌলিক অধিকার রিট)',
    titleEn: 'Digital Surveillance vs Right to Privacy under Article 43 of Bangladesh Constitution',
    forum: 'Supreme Court of Bangladesh (High Court Division - Writ Jurisdiction under Article 102)',
    factsSummary: 'সরকার সাইবার অপরাধ দমনের নামে একটি গোয়েন্দা সফটওয়্যার ব্যবহার করে নাগরিকদের ফোনালাপ ও ডিজিটাল চ্যাট মনিটর করার নির্বাহী আদেশ জারি করেছে। মানবাধিকার সংগঠন "অধিকার সুরক্ষা" রিট পিটিশন দায়ের করেছে।',
    issues: [
      '১. নির্বাহী আদেশের মাধ্যমে নাগরিকদের ফোনালাপ রেকর্ড করা সংবিধানের ৪৩ অনুচ্ছেদে বর্ণিত চিঠিপত্র ও যোগাযোগের গোপনীয়তার অধিকার লঙ্ঘন করে কিনা?',
      '২. রিট আবেদনকারী মানবাধিকার সংগঠনের এই বিষয়ে সংক্ষুব্ধ ব্যক্তি (Aggrieved Person) হিসেবে লোকাস স্ট্যান্ডাই (Locus Standi) আছে কিনা?',
      '৩. জাতীয় নিরাপত্তা সুরক্ষার অজুহাতে মৌলিক অধিকারের উপর অযৌক্তিক বিধিনিষেধ আরোপ করা যায় কিনা?'
    ],
    petitionerArguments: [
      'সংবিধানের অনুচ্ছেদ ৪৩ অনুযায়ী প্রত্যেক নাগরিকের বাসগৃহের নিরাপত্তা ও চিঠিপত্র বা যোগাযোগের গোপনীয়তা রক্ষার পূর্ণ অধিকার রয়েছে।',
      'আইন প্রণয়ন ছাড়া কেবল নির্বাহী আদেশে নাগরিকদের মৌলিক অধিকার ক্ষুণ্ন করা সংবিধানের ২৬ অনুচ্ছেদ অনুযায়ী সরাসরি বাতিল বা Void।',
      'Kazi Mukhlesur Rahman v. Bangladesh (1974) মামলার নজির অনুযায়ী জনস্বার্থ সংশ্লিষ্ট বিষয়ে রিট আবেদন সম্পূর্ণ রক্ষণীয়।'
    ],
    respondentArguments: [
      'সংবিধানের অনুচ্ছেদ ৪৩ এর শুরুতেই বলা আছে "আইনসঙ্গত যেকোনো যুক্তিসঙ্গত বিধিনিষেধ সাপেক্ষে" রাষ্ট্র জাতীয় নিরাপত্তা ও সার্বভৌমত্ব রক্ষার্থে পদক্ষেপ নিতে পারে।',
      'সাইবার সন্ত্রাস ও জাতীয় অখণ্ডতা রক্ষায় সরকারের নজরদারি একটি বৈধ রাষ্ট্রের অপরিহার্য কর্তব্য।',
      'পিটিশনার কোনো নির্দিষ্ট ব্যক্তি নন যার ফোন বাস্তবে ট্যাপ করা হয়েছে, ফলে রিটটি অপরিপক্ব (Premature)।'
    ],
    relevantStatutes: [
      'The Constitution of Bangladesh (Articles 26, 31, 43, 44 & 102)',
      'Telecommunication Act, 2001 (Section 97A)',
      'Universal Declaration of Human Rights (UDHR - Article 12)'
    ]
  },
  {
    id: 'moot-case-2',
    titleBn: 'কৃত্রিম বুদ্ধিমত্তা ও কপিরাইট লঙ্ঘন (মেধা সম্পত্তি বিরোধ)',
    titleEn: 'AI Training on Copyrighted Literary Works without License',
    forum: 'Commercial Court / High Court Division (Original Civil Jurisdiction)',
    factsSummary: 'একটি শীর্ষস্থানীয় সফটওয়্যার কোম্পানি "বঙ্গ-এআই" অনুমতি না নিয়েই বাংলাদেশের শীর্ষ লেখকদের হাজার হাজার বই ও গবেষণাপত্র ব্যবহার করে তাদের এলএলএম মডেল ট্রেইন করেছে। লেখকদের সমিতি ক্ষতিপূরণ ও নিষেধাজ্ঞা চেয়ে মামলা করেছে।',
    issues: [
      '১. কপিরাইটকৃত সাহিত্যকর্ম এআই মডেলের ট্রেইনিং ডেটাসেটে ইনপুট দেওয়া কি কপিরাইট আইন ২০২৩ অনুযায়ী পুনরুৎপাদন (Infringing Reproduction)?',
      '২. বাণিজ্যিক এআই মডেল তৈরির ক্ষেত্রে কি ফেয়ার ইউজ (Fair Use / Fair Dealing) নীতি প্রযোজ্য হবে?',
      '৩. লেখকদের কি রয়্যালটি ও বিক্রয়লব্ধ লাভের অংশ পাওয়ার অধিকার রয়েছে?'
    ],
    petitionerArguments: [
      'কপিরাইট আইনের ধারা অনুযায়ী কপিরাইটধারীর অনুমতি ছাড়া মূল বই ডিজিটাল ফর্মে কপি বা স্টোর করা সরাসরি লঙ্ঘন।',
      'বাণিজ্যিক উদ্দেশ্যে সফটওয়্যার বিক্রি করে কোটি টাকা আয় করা কোনোভাবেই "শিক্ষা বা গবেষণামূলক" ফেয়ার ডিলিং এর আওতায় পড়ে না।',
      'লেখকদের নৈতিক অধিকার (Moral Rights) ও অর্থনৈতিক অধিকার দুটিই এখানে চরমভাবে ধ্বংস করা হয়েছে।'
    ],
    respondentArguments: [
      'এআই মডেল মানুষের লেখার মূল শব্দ হুবহু কপি করে প্রকাশ করে না, বরং ভাষার ব্যাকরণ ও প্যাটার্ন শিখে সম্পূর্ণ নতুন উত্তর তৈরি করে (Transformative Use)।',
      'প্রযুক্তির অগ্রগতি ও জাতীয় কৃত্রিম বুদ্ধিমত্তা বিকাশের স্বার্থে মেশিন লার্নিং বিশ্লেষণ ফেয়ার ইউজ নীতির আওতাভুক্ত হওয়া উচিত।',
      'লেখকদের কোনো বাস্তবিক আর্থিক ক্ষতি প্রমাণিত হয়নি কারণ বইয়ের মূল বাজারে কোনো ক্ষতি সৃষ্টি হয়নি।'
    ],
    relevantStatutes: [
      'Copyright Act of Bangladesh, 2023 (Sections 24, 71 & 72)',
      'Berne Convention for the Protection of Literary and Artistic Works',
      'TRIPS Agreement (Article 9 & 13)'
    ]
  }
];

export const LEGAL_MAXIMS: LegalMaxim[] = [
  {
    id: 'm1',
    latin: 'Actus non facit reum nisi mens sit rea',
    english: 'An act does not make anyone guilty unless the mind is also guilty',
    bengali: 'অপরাধমূলক মন ছাড়া কেবল কোনো কাজ অপরাধ বলে গণ্য হয় না।',
    explanation: 'ফৌজদারি আইনের অন্যতম প্রধান মূলনীতি। অপরাধ সাব্যস্ত হতে হলে শারীরিক কাজ (Actus Reus) এবং অপরাধমূলক মানসিক অভিপ্রায় (Mens Rea) উভয়ের উপস্থিতি বাধ্যতামূলক।',
    landmarkCase: 'R v. Tolson (1889), Fowler v. Padget (1798)',
    category: 'Criminal Law'
  },
  {
    id: 'm2',
    latin: 'Res Judicata Pro Veritate Accipitur',
    english: 'A matter judged is taken for truth (Doctrine of Res Judicata)',
    bengali: 'যে বিষয়ে ইতিমধ্যে চূড়ান্ত রায় হয়ে গেছে, সেই একই বিষয়ে পুনরায় মামলা চালানো যাবে না।',
    explanation: 'দেওয়ানি কার্যবিধির ধারা ১১ এর মূল ভিত্তি। মামলার চূড়ান্ত নিষ্পত্তি নিশ্চিত করা এবং বিবাদীকে একই কারণে বারবার হয়রানি থেকে রক্ষা করার জন্য এ নীতি প্রয়োগ করা হয়।',
    landmarkCase: 'Duchess of Kingston\'s Case (1776), Daryao v. State of UP',
    category: 'Civil Procedure'
  },
  {
    id: 'm3',
    latin: 'Audi Alteram Partem',
    english: 'Listen to the other side / No man should be condemned unheard',
    bengali: 'অন্য পক্ষের বক্তব্যও শুনুন / কোনো ব্যক্তিকে তার আত্মপক্ষ সমর্থনের সুযোগ না দিয়ে শাস্তি দেওয়া যাবে না।',
    explanation: 'প্রাকৃতিক ন্যায়বিচারের (Natural Justice) প্রথম এবং প্রধান স্তম্ভ। যে কোনো প্রশাসনিক বা বিচারিক আদেশের পূর্বে প্রভাবিত ব্যক্তিকে নোটিশ ও শুনানির সুযোগ প্রদান আবশ্যক।',
    landmarkCase: 'Maneka Gandhi v. Union of India (1978), Ridge v. Baldwin (1964)',
    category: 'Constitutional & Administrative'
  },
  {
    id: 'm4',
    latin: 'Nemo Judex In Causa Sua',
    english: 'No one should be a judge in his own cause (Rule against Bias)',
    bengali: 'নিজের মামলায় কেউ বিচারক হতে পারে না / বিচারকের পক্ষপাতহীনতার নীতি।',
    explanation: 'প্রাকৃতিক ন্যায়বিচারের দ্বিতীয় মূলনীতি। বিচারক যদি কোনো পক্ষের স্বার্থের সাথে আর্থিকভাবে, ব্যক্তিগতভাবে বা আনুষ্ঠানিকভাবে সংশ্লিষ্ট থাকেন, তবে তিনি বিচার করতে পারবেন না।',
    landmarkCase: 'Dimes v. Grand Junction Canal (1852), AK Kraipak v. Union of India',
    category: 'Administrative Law'
  },
  {
    id: 'm5',
    latin: 'Injuria Sine Damno',
    english: 'Injury without damage (Violation of legal right without actual financial loss)',
    bengali: 'আর্থিক বা শারীরিক ক্ষতি ছাড়া কেবল আইনি অধিকারের লঙ্ঘন।',
    explanation: 'টর্ট আইনের নীতি। যদি কোনো ব্যক্তির বৈধ আইনি অধিকার লঙ্ঘিত হয়, তবে তার বাস্তবে কোনো আর্থিক বা দৃশ্যমান ক্ষতি না হলেও তিনি আদালতে ক্ষতিপূরণ দাবি করতে পারেন।',
    landmarkCase: 'Ashby v. White (1703) - ভোটদানে বাধা দেওয়ার বিখ্যাত কেস',
    category: 'Law of Torts'
  },
  {
    id: 'm6',
    latin: 'Damnum Sine Injuria',
    english: 'Damage without injury (Actual loss without infringement of a legal right)',
    bengali: 'আইনি অধিকার লঙ্ঘন ছাড়া আর্থিক ক্ষতি।',
    explanation: 'যদি কোনো ব্যক্তির প্রকৃত আর্থিক ক্ষতি হয় কিন্তু কারো কোনো আইনি অধিকার লঙ্ঘিত না হয় বা কোনো বেআইনি কাজ না করা হয়, তবে আদালতে কোনো মামলা বা ক্ষতিপূরণ পাওয়া যাবে না।',
    landmarkCase: 'Gloucester Grammar School Case (1410), Chasemore v. Richards',
    category: 'Law of Torts'
  },
  {
    id: 'm7',
    latin: 'Volenti Non Fit Injuria',
    english: 'To a willing person, injury is not done',
    bengali: 'স্বেচ্ছায় ঝুঁকি গ্রহণকারীর প্রতি কোনো অন্যায় বা ক্ষতি করা হয় না।',
    explanation: 'যদি কোনো ব্যক্তি নিজ ইচ্ছায় এবং জেনে-শুনে কোনো ঝুঁকির প্রতি সম্মতি দেয় (যেমন: ক্রিকেট খেলা, ঝুঁকিপূর্ণ স্টান্ট দেখা), তবে দুর্ঘটনা ঘটলে সে ক্ষতিপূরণ দাবি করতে পারে না।',
    landmarkCase: 'Hall v. Brooklands Auto Racing Club (1933), Smith v. Baker',
    category: 'Law of Torts'
  },
  {
    id: 'm8',
    latin: 'Ignorantia Juris Non Excusat',
    english: 'Ignorance of the law is no excuse',
    bengali: 'আইন না জানা বা অজ্ঞতা কোনো অজুহাত হতে পারে না।',
    explanation: 'দেশের প্রত্যেক নাগরিক দেশের প্রচলিত আইন জানে বলে আদালত ধরে নেয়। সুতরাং অপরাধ বা চুক্তি ভঙ্গের পর "আমি আইন জানতাম না" বলে দায় এড়ানো সম্ভব নয়।',
    landmarkCase: 'M.H. George v. State of Maharashtra (1965)',
    category: 'Jurisprudence & Criminal Law'
  },
  {
    id: 'm9',
    latin: 'Ubi Jus Ibi Remedium',
    english: 'Where there is a right, there is a remedy',
    bengali: 'যেখানে অধিকার আছে, সেখানে প্রতিকারও আছে।',
    explanation: 'যদি আইন কোনো অধিকার দেয়, তবে সেই অধিকার লঙ্ঘনের বিরুদ্ধে প্রতিকার পাওয়ার আইনি উপায়ও রাষ্ট্রকে প্রদান করতে হবে। এটি সুনির্দিষ্ট প্রতিকার ও টর্টের ভিত্তি।',
    landmarkCase: 'Ashby v. White (1703), Sardar Amarjit Singh v. Pramod Gupta',
    category: 'Civil & Specific Relief'
  },
  {
    id: 'm10',
    latin: 'Caveat Emptor',
    english: 'Let the buyer beware',
    bengali: 'ক্রেতা সাবধান নীতি।',
    explanation: 'পণ্য কেনার সময় ক্রেতাকে সতর্ক থাকতে হবে এবং পণ্যের গুণাগুণ যাচাই করে নিতে হবে। তবে বিক্রেতা প্রতারণা করলে বা গোপন ত্রুটি থাকলে এই নিয়মের ব্যতিক্রম ঘটে।',
    landmarkCase: 'Ward v. Hobbs (1878), Priest v. Last',
    category: 'Contract & Commercial'
  },
  {
    id: 'm11',
    latin: 'Stare Decisis',
    english: 'To stand by things decided (Doctrine of Precedent)',
    bengali: 'পূর্বে নির্ধারিত সিদ্ধান্তের প্রতি অনুগত থাকা / বিচারিক নজির নীতি।',
    explanation: 'উচ্চ আদালত কর্তৃক প্রদত্ত আইনি ব্যাখ্যা বা সিদ্ধান্ত নিম্ন আদালতের জন্য বাধ্যতামূলক। এটি আইনি স্থিতিশীলতা ও নিশ্চয়তা প্রদান করে। সংবিধানে অনুচ্ছেদ ১১১ দ্বারা সমর্থিত।',
    landmarkCase: 'Kudrat-E-Elahi Panir v. Bangladesh (1992)',
    category: 'Jurisprudence & Constitutional'
  },
  {
    id: 'm12',
    latin: 'Nemo Dat Quod Non Habet',
    english: 'No one gives what they do not have',
    bengali: 'যার যা নেই, সে তা অন্যকে দিতে পারে না (মালিকানা হস্তান্তর নীতি)।',
    explanation: 'কেউ যদি কোনো সম্পত্তির বৈধ মালিক না হয়, তবে সে অন্য কাউকে সেই সম্পত্তির নিখুঁত মালিকানা বা স্বত্ব প্রদান করতে পারে না। সম্পত্তি হস্তান্তর আইনের মূল নীতি।',
    landmarkCase: 'Cundy v. Lindsay (1878), Greenwood v. Bennett',
    category: 'Property Law'
  }
];

export const POPULAR_SECTIONS: LawSectionItem[] = [
  {
    id: 'sec-prop-52',
    subjectId: 'property',
    sectionNumber: 'সম্পত্তি হস্তান্তর আইন ধারা ৫২',
    titleBn: 'বিচারাধীন মামলা নীতি (Doctrine of Lis Pendens)',
    titleEn: 'Transfer of Property pending suit relating thereto',
    summaryBn: 'কোনো স্থাবর সম্পত্তি সংক্রান্ত মামলা উপযুক্ত আদালতে বিচারাধীন থাকা অবস্থায় মামলার কোনো পক্ষ উক্ত সম্পত্তি হস্তান্তর করলে তা আদালতের চূড়ান্ত রায়ের অধীন হবে।',
    keyIngredients: [
      'উপযুক্ত এখতিয়ারবান আদালতে মামলা বিচারাধীন থাকতে হবে',
      'মামলাটি যোগসাজশমূলক বা ফেইক (Non-collusive) হওয়া যাবে না',
      'মামলার মূল বিবাদীয় বিষয় কোনো স্থাবর সম্পত্তির স্বত্ব বা অধিকার হতে হবে',
      'মামলা চলাকালীন ক্রেতা মামলার চূড়ান্ত ডিক্রি মানতে বাধ্য থাকবে'
    ],
    landmarkCase: 'Bellamy v. Sabine (1857), Rajender Singh v. Santa Singh',
    examTip: 'ধারা ৫২ এর নীতি ও এর ৪টি আবশ্যকীয় উপাদান এবং ব্যতিক্রমসমূহ সুন্দর পয়েন্ট আকারে লিখবেন।'
  },
  {
    id: 'sec-ip-copyright',
    subjectId: 'intellectual_property',
    sectionNumber: 'কপিরাইট আইন ২০২৩',
    titleBn: 'কৃতিস্বত্ব লঙ্ঘন ও দেওয়ানি-ফৌজদারি প্রতিকার',
    titleEn: 'Copyright Infringement & Remedies',
    summaryBn: 'লেখক বা মূল স্রষ্টার অনুমতি ব্যতীত সাহিত্য, সংগীত, সফটওয়্যার বা শিল্পকর্মের অনুলিপি তৈরি, বিক্রয় বা ইন্টারনেটে বিতরণ শাস্তিযোগ্য দেওয়ানি ও ফৌজদারি অপরাধ।',
    keyIngredients: [
      'কৃতিস্বত্বের মৌলিকতা (Originality of Work)',
      'কপিরাইট মালিকের সুস্পষ্ট অনুমতি বা লাইসেন্সের অভাব',
      'বাণিজ্যিক উদ্দেশ্যে পুনরুৎপাদন বা পরিবর্তন',
      'আদালতে নিষেধাজ্ঞা, ক্ষতিপূরণ এবং পাইরেসি মালামাল জব্দের আবেদন'
    ],
    landmarkCase: 'RG Anand v. Delux Films (1978), Eastern Book Company v. Navin J. Desai',
    examTip: 'কপিরাইট নিবন্ধিত না থাকলেও স্বত্বাধিকারী আদালতে মামলা করতে পারেন কিনা তা আলোচনা করবেন।'
  },
  {
    id: 'sec-limitation-5',
    subjectId: 'limitation',
    sectionNumber: 'তামাদি আইন ধারা ৫',
    titleBn: 'বিলম্ব মওকুফ বা তামাদি মার্জনা (Condonation of Delay)',
    titleEn: 'Extension of period in certain cases',
    summaryBn: 'আপিল, পুনর্বিবেচনা বা রিভিশনের ক্ষেত্রে নির্ধারিত তামাদির মেয়াদ শেষ হওয়ার পর উপযুক্ত কারণ (Sufficient Cause) দর্শাতে পারলে আদালত বিলম্ব মার্জনা করতে পারে। তবে মূল মোকদ্দমায় (Suits) এই ধারা প্রযোজ্য নয়।',
    keyIngredients: [
      'উপযুক্ত ও সন্তোষজনক কারণ (Sufficient Cause) প্রমাণ করতে হবে',
      'আবেদনকারী ইচ্ছাকৃত অবহেলা বা অসতর্কতা করেন নাই',
      'কেবল আপিল, রিভিউ, রিভিশন ও দরখাস্তে প্রযোজ্য; মূল আরজি দাখিলে ৫ ধারা চলে না'
    ],
    landmarkCase: 'Collector, Land Acquisition v. Katiji (1987), Ramlal v. Rewa Coalfields',
    examTip: 'ধারা ৩ (বাধ্যতামূলক তামাদি) এর সাথে ধারা ৫ এর সম্পর্ক এবং কেন মূল মোকদ্দমায় ৫ ধারা চলে না তা লিখবেন।'
  },
  {
    id: 'sec-penal-299-300',
    subjectId: 'penal_code',
    sectionNumber: 'দণ্ডবিধি ধারা ২৯৯ ও ৩০০',
    titleBn: 'খুন বনাম নির্দোষ নরহত্যা',
    titleEn: 'Culpable Homicide vs Murder',
    summaryBn: '২৯৯ ধারায় বর্ণিত অপরাধমূলক নরহত্যা হলো জেনাস (Genus) এবং ৩০০ ধারায় বর্ণিত খুন হলো স্পিসিস (Species)। অর্থাৎ সকল খুনই নরহত্যা, কিন্তু সকল নরহত্যা খুন নয়।',
    keyIngredients: [
      'মৃত্যু ঘটানোর সুনির্দিষ্ট অভিপ্রায় (Intention)',
      'এমন দৈহিক আঘাতের অভিপ্রায় যা মৃত্যু ঘটাতে যথেষ্ট সম্ভাব্য',
      'কাজের পরিণাম সম্পর্কে চরম নিশ্চিত জ্ঞান (Knowledge)',
      'ধারা ৩০০ এর ৫টি ব্যতিক্রমের যেকোনো একটি প্রযোজ্য হলে তা খুন না হয়ে নির্দোষ নরহত্যা (ধারা ৩০৪) হবে।'
    ],
    landmarkCase: 'Reg v. Govinda (1876) - মেলভিল বিচারপতির ঐতিহাসিক রায়',
    examTip: 'পরীক্ষায় আসলে প্রথমে ২৯৯ ও ৩০০ এর তুলনামূলক ছক লিখবেন এবং Reg v. Govinda মামলার মূল পার্থক্যসূত্র তুলে ধরবেন।'
  },
  {
    id: 'sec-crpc-497',
    subjectId: 'crpc',
    sectionNumber: 'সিআরপিসি ধারা ৪৯৭',
    titleBn: 'অজামিনযোগ্য অপরাধে জামিন মঞ্জুরের ক্ষমতা',
    titleEn: 'Bail in Non-bailable offences',
    summaryBn: 'অজামিনযোগ্য অপরাধে জামিন পাওয়া আদালতের স্বেচ্ছাধীন ক্ষমতা। তবে মৃত্যুদণ্ড বা যাবজ্জীবন কারাদণ্ডে দণ্ডনীয় অপরাধ ছাড়া এবং নারী, শিশু, রুগ্ন বা বৃদ্ধ ব্যক্তির ক্ষেত্রে আদালত জামিন দিতে পারে।',
    keyIngredients: [
      'আসামি নারী, নাবালক (১৬ বছরের কম), বা অসুস্থ/অক্ষম কিনা',
      'প্রমাণ লোপাট বা সাক্ষীকে প্রভাবিত করার সম্ভাবনা না থাকা',
      'তদন্তের অগ্রগতি ও পর্যাপ্ত প্রমাণের অভাব (No reasonable grounds to believe guilty)'
    ],
    landmarkCase: 'State v. Joynal Abedin (1980), Babu v. The State',
    examTip: '৪৯৬ (জামিনযোগ্য) বনাম ৪৯৭ (অজামিনযোগ্য) এর তুলনামূলক আলোচনা এবং জামিনের সাধারণ শর্তাবলি তুলে ধরুন।'
  },
  {
    id: 'sec-cpc-11',
    subjectId: 'cpc',
    sectionNumber: 'সিপিসি ধারা ১১',
    titleBn: 'রেস জুডিকাটা (পূর্ব বিচার নীতি)',
    titleEn: 'Doctrine of Res Judicata',
    summaryBn: 'সক্ষম আদালত কর্তৃক পূর্বে চূড়ান্তভাবে নিষ্পত্তি করা মামলার মূল বিষয়বস্তু নিয়ে একই পক্ষদ্বয়ের মধ্যে পুনরায় কোনো নতুন মোকদ্দমা দায়ের করা যাবে না।',
    keyIngredients: [
      'উভয় মামলায় মূল বিবাদীয় বিষয় সরাসরি ও প্রত্যক্ষভাবে একই হতে হবে',
      'উভয় মামলায় পক্ষগণ একই বা তাদের স্বার্থের প্রতিনিধিত্বকারী হতে হবে',
      'পূর্ববর্তী আদালতটি মামলা নিষ্পত্তির বিষয়ে উপযুক্ত বা এখতিয়ারবান হতে হবে',
      'পূর্ববর্তী মামলায় বিষয়টি চূড়ান্তভাবে শুনানি ও নিষ্পত্তি হতে হবে'
    ],
    landmarkCase: 'Duchess of Kingston\'s Case (1776), Satyadhayan Ghosal v. Deorajin Debi',
    examTip: 'ধারা ১১ এর ব্যাখ্যাসমূহ (Explanation IV: Constructive Res Judicata) বিশেষভাবে উল্লেখ করবেন।'
  },
  {
    id: 'sec-evidence-32',
    subjectId: 'evidence',
    sectionNumber: 'সাক্ষ্য আইন ধারা ৩২(১)',
    titleBn: 'মৃত্যুকালীন ঘোষণা বা জবানবন্দি',
    titleEn: 'Dying Declaration',
    summaryBn: 'মৃত্যুর মুখে পতিত কোনো ব্যক্তি যদি তার মৃত্যুর কারণ বা সংশ্লিষ্ট পরিস্থিতি সম্পর্কে মৌখিক বা লিখিত বিবৃতি প্রদান করে, তবে তা সাক্ষ্য হিসেবে গ্রহণযোগ্য।',
    keyIngredients: [
      'বিবৃতিদাতার মৃত্যু হতে হবে',
      'বিবৃতিটি তার মৃত্যুর কারণ বা সংশ্লিষ্ট পরিস্থিতির সাথে সরাসরি সম্পর্কিত হতে হবে',
      'বিবৃতি প্রদানের সময় ব্যক্তি মানসিকভাবে সুস্থ ও সচেতন (Fit state of mind) থাকতে হবে'
    ],
    landmarkCase: 'Pakala Narayana Swami v. Emperor (1939), Sharad Birdhichand Sarda Case',
    examTip: 'পাকালা নারায়না স্বামীর প্রিভি কাউন্সিলের রায়ের মূল বক্তব্য এবং ডাক্তারি সার্টিফিকেটের গুরুত্ব বর্ণনা করুন।'
  },
  {
    id: 'sec-land-96',
    subjectId: 'land_law',
    sectionNumber: 'রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব আইন ধারা ৯৬',
    titleBn: 'অগ্রক্রয়াধিকার মোকদ্দমা (Right of Pre-emption)',
    titleEn: 'Right of Pre-emption under Section 96 of SAT Act',
    summaryBn: 'কোনো জোতের সহ-শরিক প্রজা তার অংশ কোনো তৃতীয় পক্ষের কাছে হস্তান্তর করলে অপরাপর সহ-শরিক প্রজা নির্দিষ্ট সময়ের মধ্যে আদালতে টাকা জমা দিয়ে অগ্রক্রয়ের দাবি করতে পারেন।',
    keyIngredients: [
      'আবেদনকারীকে হস্তান্তরিত জোতের বৈধ সহ-শরিক (Co-sharer tenant) হতে হবে',
      'হস্তান্তরের নোটিশ প্রাপ্তির ২ মাসের মধ্যে আবেদন করতে হবে',
      'বিক্রয়মূল্যের উপর নির্দিষ্ট ২৫% অতিরিক্ত ক্ষতিপূরণ অর্থ সহ জমা দিতে হবে'
    ],
    landmarkCase: 'Md. Hossain v. Shah Alam (DLR), Abdul Aziz v. Golam Ali',
    examTip: 'উত্তরাধিকারসূত্রে সহ-শরিক বনাম ক্রয়সূত্রে সহ-শরিকের অগ্রক্রয়াধিকারের শর্তাবলি তুলে ধরবেন।'
  },
  {
    id: 'sec-reg-17',
    subjectId: 'registration',
    sectionNumber: 'রেজিস্ট্রেশন আইন ধারা ১৭',
    titleBn: 'বাধ্যতামূলক রেজিস্ট্রিকরণযোগ্য দলিল',
    titleEn: 'Documents of which registration is compulsory',
    summaryBn: 'স্থাবর সম্পত্তির বিক্রয় কবলা, হেবা বা দানপত্র, বন্ধক দলিল এবং স্থাবর সম্পত্তি হস্তান্তরের বায়না চুক্তি রেজিস্ট্রি করা বাধ্যতামূলক। অনিবন্ধিত হলে স্বত্ব হস্তান্তর ঘটে না।',
    keyIngredients: [
      '১০০ টাকার অধিক মূল্যের স্থাবর সম্পত্তির স্বত্ব সৃষ্টি বা হস্তান্তর',
      'হেবানামা ও মুসলিম হেবা দলিল (২০০৪ সালের সংশোধনী)',
      'স্থাবর সম্পত্তি বিক্রয়ের বায়নাপত্র (ধারা ১৭ক)',
      'অনিবন্ধিত দলিলের সাক্ষ্যমূল্য বাতিল (ধারা ৪৯)'
    ],
    landmarkCase: 'K.B. Saha & Sons v. Development Consultant (2008)',
    examTip: '২০০৪ সালের সংশোধনীর পর কোন কোন দলিলের রেজিস্ট্রেশন বাধ্যতামূলক করা হয়েছে তার তালিকা লিখবেন।'
  },
  {
    id: 'sec-pdr-7',
    subjectId: 'pdr_act',
    sectionNumber: 'সরকারি দাবী আদায় আইন ধারা ৭',
    titleBn: 'সার্টিফিকেট দেনাদারের প্রতি নোটিশ ও এর ফলাফল',
    titleEn: 'Service of Notice under Section 7 of PDR Act',
    summaryBn: 'সার্টিফিকেট অফিসারের নিকট সরকারি দাবির সার্টিফিকেট দাখিলের পর দেনাদারের বরাবর ৭ ধারার নোটিশ জারি করা হয়। নোটিশ জারির পর দেনাদারের সকল সম্পত্তি আইনত আবদ্ধ হয়ে যায়।',
    keyIngredients: [
      'সার্টিফিকেট অফিসারের স্বাক্ষরে যথানিয়মে নোটিশ জারি',
      'নোটিশ জারির পর দেনাদারের সম্পত্তি হস্তান্তর বা দান আইনত বাতিল',
      'দেনাদার নোটিশ প্রাপ্তির ৩০ দিনের মধ্যে ৯ ধারা মতে আপত্তি দিতে পারেন'
    ],
    landmarkCase: 'Province of East Pakistan v. Abdul Jalil, Al-Amin v. Certificate Officer',
    examTip: '৭ ধারার নোটিশ জারি না করে দেনাদারের সম্পত্তি নিলামে বিক্রি করলে তা সম্পূর্ণ অবৈধ বা Void ab initio হয়।'
  },
  {
    id: 'sec-company-salomon',
    subjectId: 'company_law',
    sectionNumber: 'কোম্পানি আইন ১৯৯৪',
    titleBn: 'স্বতন্ত্র আইনি সত্তা ও কর্পোরেট পর্দা উন্মোচন',
    titleEn: 'Separate Legal Personality & Lifting the Corporate Veil',
    summaryBn: 'কোম্পানি নিবন্ধনের পর তা তার শেয়ারহোল্ডারদের থেকে সম্পূর্ণ পৃথক একটি কৃত্রিম আইনি ব্যক্তিসত্তা লাভ করে। তবে জালিয়াতি বা কর ফাঁকি দিলে আদালত কর্পোরেট পর্দা উন্মোচন করে।',
    keyIngredients: [
      'কোম্পানির নিজস্ব নামে চুক্তি, সম্পদ ধারণ ও মামলা করার অধিকার',
      'সীমিত দায়বদ্ধতা (Limited Liability of Shareholders)',
      'প্রতারণা বা বেআইনি কাজ রোধে Lifting the Corporate Veil প্রয়োগ'
    ],
    landmarkCase: 'Salomon v. Salomon & Co. Ltd. (1897), Lee v. Lee\'s Air Farming Ltd.',
    examTip: 'স্যালোমন বনাম স্যালোমন মামলার ঘটনা ও লর্ড ম্যাকনাগটেনের রায়ের মূল অংশ উল্লেখ করবেন।'
  },
  {
    id: 'sec-ni-138',
    subjectId: 'business_law',
    sectionNumber: 'এন.আই অ্যাক্ট ধারা ১৩৮',
    titleBn: 'চেক ডিজঅনারের ফৌজদারি অপরাধ ও শাস্তি',
    titleEn: 'Dishonour of Cheque for Insufficiency of Funds',
    summaryBn: 'ব্যাংকে পর্যাপ্ত টাকা না থাকায় বা অ্যাকাউন্ট বন্ধ থাকায় চেক প্রত্যাখ্যাত হলে এবং ৩০ দিনের লিগ্যাল নোটিশের পরও টাকা না দিলে ১ বছর পর্যন্ত কারাদণ্ড ও চেকে বর্ণিত টাকার তিনগুণ পর্যন্ত অর্থদণ্ড হতে পারে।',
    keyIngredients: [
      'বৈধ দেনা বা দায়ের বিপরীতে চেক প্রদান',
      'চেকের মেয়াদের মধ্যে ব্যাংকে উপস্থাপন ও প্রত্যাখ্যাত হওয়া',
      'ডিজঅনার হওয়ার ৩০ দিনের মধ্যে লিখিত লিগ্যাল নোটিশ প্রদান',
      'নোটিশ প্রাপ্তির ৩০ দিনের মধ্যে টাকা পরিশোধ না করলে পরবর্তী ৩০ দিনে মামলা দায়ের'
    ],
    landmarkCase: 'Khondoker Mahtabuddin v. State (1998), Majibur Rahman v. State',
    examTip: '১৩৮ ধারার তামাদির ধাপগুলো (Cheque validity -> 30 days Legal Notice -> 30 days Payment Window -> 30 days Complaint filing) ছক আকারে লিখবেন।'
  }
];

export const INITIAL_PRESET_PROMPTS = [
  {
    titleBn: '১. সম্পত্তি হস্তান্তর: লিস পেন্ডেন্স ও আংশিক সম্পাদন',
    prompt: 'সম্পত্তি হস্তান্তর আইনের ধারা ৫২ (Lis Pendens) এবং ধারা ৫৩ক (Part Performance) এর মূল শর্তাবলী ও পরীক্ষার জন্য প্রয়োজনীয় উপাদান বুঝিয়ে দাও।'
  },
  {
    titleBn: '২. মেধা সম্পত্তি: কপিরাইট লঙ্ঘন ও ফেয়ার ইউজ',
    prompt: 'কপিরাইট আইন ২০২৩ অনুযায়ী কপিরাইট লঙ্ঘনের দেওয়ানি ও ফৌজদারি প্রতিকার কী? ফেয়ার ইউজ (Fair Use) মতবাদের প্রয়োগ ব্যাখ্যা করো।'
  },
  {
    titleBn: '৩. দেওয়ানি কার্যবিধি: রেস জুডিকাটা ও নিষেধাজ্ঞা',
    prompt: 'সিপিসির ধারা ১১ (Res Judicata) এর মূল উপাদান এবং Order 39 Rule 1-2 অনুযায়ী অস্থায়ী নিষেধাজ্ঞা পাওয়ার ৩টি অপরিহার্য শর্ত সহজ ভাষায় বুঝিয়ে দাও।'
  },
  {
    titleBn: '৪. তামাদি আইন: ধারা ৫ বিলম্ব মওকুফ ও তামাদির ফলাফল',
    prompt: 'তামাদি আইনের ধারা ৩ এবং ধারা ৫ এর মধ্যে পার্থক্য কী? বিলম্ব মওকুফের ক্ষেত্রে "যথেষ্ট কারণ" (Sufficient Cause) কীভাবে আদালতে প্রমাণ করতে হয়?'
  },
  {
    titleBn: '৫. দণ্ডবিধি: খুন বনাম নির্দোষ নরহত্যা ও আত্মরক্ষা',
    prompt: 'দণ্ডবিধির ধারা ২৯৯ ও ৩০০ এর পার্থক্য এবং ধারা ১০০ অনুযায়ী আত্মরক্ষার্থে আক্রমণকারীর মৃত্যু ঘটানোর ৬টি ক্ষেত্র ব্যাখ্যা করো।'
  },
  {
    titleBn: '৬. ফৌজদারি কার্যবিধি: জামিনের বিধান ও ধারা ১৬৪',
    prompt: 'সিআরপিসির ধারা ৪৯৬ ও ৪৯৭ এর জামিনের শর্তাবলী এবং ধারা ১৬৪ তে ম্যাজিস্ট্রেটের সামনে আসামির স্বীকারোক্তিমূলক জবানবন্দির নিয়ম আলোচনা করো।'
  },
  {
    titleBn: '৭. সাক্ষ্য আইন: মৃত্যুকালীন ঘোষণা ও এস্টোপেল',
    prompt: 'সাক্ষ্য আইনের ধারা ৩২(১) অনুযায়ী মৃত্যুকালীন ঘোষণার সাক্ষ্যমূল্য এবং ধারা ১১৫ এর এস্টোপেল নীতি Pakala Narayana Swami কেসের আলোকে বুঝিয়ে দাও।'
  },
  {
    titleBn: '৮. আন্তর্জাতিক আইন: আইসিজে এখতিয়ার ও চুক্তি',
    prompt: 'আন্তর্জাতিক আদালতের (ICJ) এখতিয়ার এবং ভিয়েনা কনভেনশন ১৯৬৯ অনুযায়ী Pacta Sunt Servanda নীতির তাৎপর্য আলোচনা করো।'
  },
  {
    titleBn: '৯. ভূমি আইন: ধারা ৯৬ অগ্রক্রয়াধিকার ও নামজারি',
    prompt: 'SAT Act এর ধারা ৯৬ অনুযায়ী অগ্রক্রয়াধিকার (Pre-emption) মোকদ্দমার শর্ত ও তামাদি কত? নামজারি বা মিউটেশনের গুরুত্ব কী?'
  },
  {
    titleBn: '১০. রেজিস্ট্রেশন আইন: ধারা ১৭ বাধ্যতামূলক দলিল',
    prompt: 'রেজিস্ট্রেশন আইনের ধারা ১৭ অনুযায়ী কোন কোন দলিল রেজিস্ট্রি বাধ্যতামূলক? অনিবন্ধিত দলিলের আইনি ফলাফল ধারা ৪৯ অনুযায়ী কী?'
  },
  {
    titleBn: '১১. সরকারি দাবী আদায়: পিডিআর অ্যাক্ট ৭ ধারার নোটিশ',
    prompt: 'Public Demands Recovery Act এর ৭ ধারার নোটিশের ফলাফল কী? দেনাদার দায় অস্বীকার করে ৯ ধারায় কীভাবে আপত্তি দাখিল করবেন?'
  },
  {
    titleBn: '১২. কোম্পানি আইন: স্বতন্ত্র ব্যক্তিসত্তা ও কর্পোরেট পর্দা',
    prompt: 'Salomon v. Salomon মামলার আলোকে কোম্পানির স্বতন্ত্র আইনি সত্তা এবং কোন কোন ক্ষেত্রে আদালত Lifting the Corporate Veil প্রয়োগ করে?'
  },
  {
    titleBn: '১৩. ব্যবসায়িক আইন: এন.আই অ্যাক্ট ১৩৮ চেক ডিজঅনার',
    prompt: 'এন.আই অ্যাক্টের ১৩৮ ধারায় চেক ডিজঅনার মামলার সম্পূর্ণ ধাপ, লিগ্যাল নোটিশ পাঠানোর নিয়ম ও তামাদির হিসাব বুঝিয়ে দাও।'
  },
  {
    titleBn: '১৪. ড্রাফটিং ও প্রফেশনাল এথিকস: আরজি ও আইনজীবীর কর্তব্য',
    prompt: 'দেওয়ানি আরজি (Plaint) লেখার মৌলিক নিয়মাবলী এবং বার কাউন্সিল বিধিমালা অনুযায়ী মক্কেল ও আদালতের প্রতি একজন আইনজীবীর প্রধান কর্তব্যগুলো আলোচনা করো।'
  },
  {
    titleBn: '১৫. ভাইভা-ভোসি ও মুট কোর্ট: আদালত শিষ্টাচার ও আর্গুমেন্ট',
    prompt: 'বার কাউন্সিল ভাইভায় ভালো করার মূল কৌশলগুলো কী? মুট কোর্টে মেমোরিয়াল প্রস্তুত ও জাজদের সামনে মৌখিক আর্গুমেন্ট দেওয়ার নিয়ম বুঝিয়ে দাও।'
  }
];
