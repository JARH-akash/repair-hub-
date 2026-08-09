import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'bn';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'nav.services': 'Services',
    'nav.aiDiagnostics': 'AI Diagnostic',
    'nav.process': 'Process',
    'nav.portals': 'Workspace Portals',
    'nav.aiTroubleshoot': 'AI Troubleshoot',
    'nav.customer': 'Customer',
    'nav.technician': 'Technician',
    'nav.admin': 'Admin',
    'nav.bookRepair': 'Book Repair',
    'nav.trackPlaceholder': 'Track Job ID (e.g. RH-2026-1042)...',
    'nav.trackBtn': 'Track',
    'nav.certifiedTag': 'Certified Electronics Network',
    'nav.selectLanguage': 'Language',

    // Hero
    'hero.badge': 'Pan-India Certified Doorstep Service',
    'hero.title1': "India's #1 On-Demand",
    'hero.title2': "Electronics Repair Network",
    'hero.desc': "Doorstep technician dispatch within 30 minutes. Certified micro-soldering, OEM spare parts, transparent quote approvals, and 90-day warranty guarantee across 500+ cities in India.",
    'hero.bookBtn': 'Book Doorstep Repair',
    'hero.trackBtn': 'Track Existing Job',
    'hero.aiBtn': 'Try AI Diagnostics',
    'hero.coverage': 'All Over India (500+ Cities)',

    // Booking & AI
    'ai.title': 'Gemini AI Hardware Diagnostics',
    'ai.subtitle': 'Instant troubleshooting for smartphones, laptops, TVs & appliances',
    'book.title': 'Book On-Demand Repair Service',
    'book.submit': 'Confirm & Dispatch Technician',

    // Footer
    'footer.tagline': "India's premier certified electronics repair platform. On-demand doorstep service, live technician location tracking, transparent quote approvals, and 90-day warranty guarantee.",
    'footer.coverageTitle': 'Service Coverage',
    'footer.developedBy': 'Website Developed by',
    'footer.foundedBy': 'Founded by',
    'footer.rights': '© 2026 All Rights Reserved.',
  },
  hi: {
    // Header
    'nav.services': 'सेवाएं',
    'nav.aiDiagnostics': 'एआई निदान',
    'nav.process': 'प्रक्रिया',
    'nav.portals': 'कार्यस्थल पोर्टल',
    'nav.aiTroubleshoot': 'एआई सहायता',
    'nav.customer': 'ग्राहक',
    'nav.technician': 'तकनीशियन',
    'nav.admin': 'एडमिन',
    'nav.bookRepair': 'रिपेयर बुक करें',
    'nav.trackPlaceholder': 'जॉब आईडी ट्रैक करें (जैसे RH-2026-1042)...',
    'nav.trackBtn': 'ट्रैक',
    'nav.certifiedTag': 'प्रमाणित इलेक्ट्रॉनिक्स नेटवर्क',
    'nav.selectLanguage': 'भाषा',

    // Hero
    'hero.badge': 'पूरे भारत में प्रमाणित डोरस्टेप सेवा',
    'hero.title1': 'भारत का #1 ऑन-डिमांड',
    'hero.title2': 'इलेक्ट्रॉनिक्स रिपेयर नेटवर्क',
    'hero.desc': '30 मिनट के भीतर डोरस्टेप तकनीशियन सेवा। भारत के 500+ शहरों में ओरिजिनल स्पेयर पार्ट्स, पारदर्शी कोटेशन और 90 दिनों की वारंटी गारंटी।',
    'hero.bookBtn': 'डोरस्टेप रिपेयर बुक करें',
    'hero.trackBtn': 'जॉब स्थिति ट्रैक करें',
    'hero.aiBtn': 'एआई निदान आज़माएं',
    'hero.coverage': 'पूरे भारत में (500+ शहर)',

    // Booking & AI
    'ai.title': 'जेमिनी एआई हार्डवेयर निदान',
    'ai.subtitle': 'स्मार्टफोन, लैपटॉप, टीवी और उपकरणों के लिए त्वरित समस्या निवारण',
    'book.title': 'ऑन-डिमांड रिपेयर सेवा बुक करें',
    'book.submit': 'पुष्टि करें और तकनीशियन भेजें',

    // Footer
    'footer.tagline': 'भारत का प्रमुख प्रमाणित इलेक्ट्रॉनिक्स रिपेयर प्लेटफॉर्म। ऑन-डिमांड डोरस्टेप सेवा, लाइव तकनीशियन लोकेशन ट्रैकिंग और 90 दिनों की वारंटी।',
    'footer.coverageTitle': 'सेवा कवरेज',
    'footer.developedBy': 'वेबसाइट डेवलपर:',
    'footer.foundedBy': 'संस्थापक:',
    'footer.rights': '© 2026 सर्वाधिकार सुरक्षित।',
  },
  bn: {
    // Header
    'nav.services': 'সেবাসমূহ',
    'nav.aiDiagnostics': 'এআই ডায়াগনস্টিক',
    'nav.process': 'প্রক্রিয়া',
    'nav.portals': 'ওয়ার্কস্পেস পোর্টাল',
    'nav.aiTroubleshoot': 'এআই ট্রাবলশুট',
    'nav.customer': 'গ্রাহক',
    'nav.technician': 'টেকনিশিয়ান',
    'nav.admin': 'এডমিন',
    'nav.bookRepair': 'রিপেয়ার বুক করুন',
    'nav.trackPlaceholder': 'জব আইডি ট্র্যাক করুন (যেমন RH-2026-1042)...',
    'nav.trackBtn': 'ট্র্যাক',
    'nav.certifiedTag': 'সার্টিফাইড ইলেকট্রনিক্স নেটওয়ার্ক',
    'nav.selectLanguage': 'ভাষা',

    // Hero
    'hero.badge': 'সমগ্র ভারতে সার্টিফাইড ডোরস্টেপ পরিসেবা',
    'hero.title1': 'ভারতের #১ অন-ডিমান্ড',
    'hero.title2': 'ইলেকট্রনিক্স রিপেয়ার নেটওয়ার্ক',
    'hero.desc': '৩০ মিনিটের মধ্যে ডোরস্টেপ টেকনিশিয়ান ডিসপ্যাচ। ভারতের ৫০০+ শহরে মূল পার্টস, স্বচ্ছ কোটেশন এবং ৯০ দিনের ওয়ারেন্টি গ্যারান্টি।',
    'hero.bookBtn': 'ডোরস্টেপ রিপেয়ার বুক করুন',
    'hero.trackBtn': 'জব ট্র্যাকিং করুন',
    'hero.aiBtn': 'এআই ডায়াগনস্টিক ব্যবহার করুন',
    'hero.coverage': 'সমগ্র ভারত জুড়ে (৫০০+ শহর)',

    // Booking & AI
    'ai.title': 'জেমিয়াই এআই হার্ডওয়্যার ডায়াগনস্টিক',
    'ai.subtitle': 'স্মার্টফোন, ল্যাপটপ, টিভি ও হোম অ্যাপ্লায়েন্স ট্রাবলশুটিং',
    'book.title': 'অন-ডিমান্ড রিপেয়ার বুক করুন',
    'book.submit': 'কনফার্ম ও টেকনিশিয়ান পাঠান',

    // Footer
    'footer.tagline': 'ভারতের প্রিমিয়ার সার্টিফাইড ইলেকট্রনিক্স রিপেয়ার প্ল্যাটফর্ম। ডোরস্টেপ সার্ভিস, লাইভ ট্র্যাকিং এবং ৯০ দিনের ওয়ারেন্টি।',
    'footer.coverageTitle': 'সার্ভিস কভারেজ',
    'footer.developedBy': 'ওয়েবসাইট তৈরি করেছেন',
    'footer.foundedBy': 'প্রতিষ্ঠাতা',
    'footer.rights': '© 2026 সর্বস্বত্ব সংরক্ষিত।',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('repairhub_language');
    if (saved === 'hi' || saved === 'bn' || saved === 'en') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('repairhub_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
