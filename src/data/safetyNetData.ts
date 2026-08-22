// ============================================================
// SHRAMIKK — PHASE 7: VERIFIED SAFETY NET DATA LAYER
// All records must have source + verifiedAt for anti-hallucination
// ============================================================

export type SchemeCategory =
  | 'Worker Welfare'
  | 'Health'
  | 'Pension'
  | 'Housing'
  | 'Education'
  | 'Financial Support'
  | 'Skill Development'
  | 'Accident Protection';

export type InsuranceCategory =
  | 'Accident'
  | 'Health'
  | 'Life'
  | 'Worker Protection';

export interface VerifiedScheme {
  id: string;
  name: string;
  nameHi: string;
  category: SchemeCategory;
  targetWorkers: string[];
  location: string; // 'All India' or specific state
  description: string;
  descriptionHi: string;
  eligibility: string[];
  eligibilityHi: string[];
  benefits: string[];
  benefitsHi: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  officialSource: string | null; // null = official source unavailable
  officialSourceLabel: string;
  verifiedAt: string;
  active: boolean;
  matchKeywords: string[]; // for retrieval matching
}

export interface InsuranceOption {
  id: string;
  name: string;
  nameHi: string;
  provider: string;
  category: InsuranceCategory;
  targetWorkers: string[];
  description: string;
  descriptionHi: string;
  coverage: string[];
  coverageHi: string[];
  eligibility: string[];
  eligibilityHi: string[];
  officialSource: string | null;
  officialSourceLabel: string;
  verifiedAt: string;
  active: boolean;
  disclaimer: string;
  matchKeywords: string[];
}

// ============================================================
// VERIFIED GOVERNMENT SCHEMES (seeded, hackathon MVP)
// ============================================================
export const verifiedSchemes: VerifiedScheme[] = [
  {
    id: 'scheme-001',
    name: 'e-Shram Card Registration (Building & Construction Workers)',
    nameHi: 'ई-श्रम कार्ड पंजीकरण (निर्माण श्रमिक)',
    category: 'Worker Welfare',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India',
    description:
      'e-Shram is a national database of unorganised workers. Registered workers receive a UAN (Universal Account Number) card and may become eligible for social security benefits and schemes.',
    descriptionHi:
      'ई-श्रम असंगठित क्षेत्र के कामगारों का राष्ट्रीय डेटाबेस है। पंजीकृत श्रमिकों को UAN कार्ड मिलता है और वे सामाजिक सुरक्षा योजनाओं के पात्र हो सकते हैं।',
    eligibility: [
      'Age between 16–59 years',
      'Working in unorganised sector (construction, domestic work, agriculture etc.)',
      'Not a member of EPFO/ESIC',
      'Aadhaar number required',
    ],
    eligibilityHi: [
      'उम्र 16 से 59 वर्ष के बीच',
      'असंगठित क्षेत्र में काम (निर्माण, घरेलू कार्य, कृषि आदि)',
      'EPFO/ESIC का सदस्य नहीं होना चाहिए',
      'आधार नंबर आवश्यक है',
    ],
    benefits: [
      'Universal Account Number (UAN) for portability',
      'Accidental insurance cover of ₹2 lakh (via PMSBY)',
      'Access to future government welfare schemes',
      'Priority in welfare delivery',
    ],
    benefitsHi: [
      'पोर्टेबल यूनिवर्सल अकाउंट नंबर (UAN)',
      'दुर्घटना बीमा ₹2 लाख (PMSBY के माध्यम से)',
      'भविष्य की सरकारी कल्याण योजनाओं तक पहुंच',
      'कल्याण वितरण में प्राथमिकता',
    ],
    requiredDocuments: ['Aadhaar card', 'Mobile number linked to Aadhaar', 'Bank account details'],
    applicationSteps: [
      'Visit eshram.gov.in or nearest CSC Centre',
      'Enter Aadhaar number and OTP',
      'Fill in occupation and work details',
      'Download e-Shram card',
    ],
    officialSource: 'https://eshram.gov.in',
    officialSourceLabel: 'eshram.gov.in (Ministry of Labour & Employment)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['eshram', 'e-shram', 'registration', 'card', 'worker', 'unorganised', 'scheme', 'yojana', 'सरकारी', 'पंजीकरण', 'कार्ड'],
  },
  {
    id: 'scheme-002',
    name: 'BOCW Welfare Fund (Building & Other Construction Workers)',
    nameHi: 'BOCW कल्याण निधि (भवन एवं अन्य निर्माण श्रमिक)',
    category: 'Worker Welfare',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India (State-wise registration)',
    description:
      'The BOCW Act mandates welfare boards in each state to register construction workers and provide financial assistance including accident relief, pension, housing, education and maternity benefits.',
    descriptionHi:
      'BOCW अधिनियम प्रत्येक राज्य में निर्माण श्रमिकों के पंजीकरण और दुर्घटना राहत, पेंशन, आवास, शिक्षा व प्रसूति लाभ प्रदान करने के लिए कल्याण बोर्ड अनिवार्य करता है।',
    eligibility: [
      'Engaged in building or construction work for at least 90 days in the preceding 12 months',
      'Age between 18–60 years',
      'Registered with the state BOCW Board',
      'Aadhaar card required',
    ],
    eligibilityHi: [
      'पिछले 12 महीनों में कम से कम 90 दिन निर्माण कार्य में लगे हों',
      'आयु 18 से 60 वर्ष के बीच',
      'राज्य BOCW बोर्ड में पंजीकृत हों',
      'आधार कार्ड आवश्यक है',
    ],
    benefits: [
      'Accident relief and disability compensation',
      'Pension after 60 years of age',
      'Housing loan assistance',
      'Education grant for children',
      'Maternity benefit',
      'Death benefit for registered worker family',
    ],
    benefitsHi: [
      'दुर्घटना राहत और विकलांगता मुआवजा',
      '60 वर्ष की आयु के बाद पेंशन',
      'आवास ऋण सहायता',
      'बच्चों के लिए शिक्षा अनुदान',
      'मातृत्व लाभ',
      'पंजीकृत श्रमिक परिवार को मृत्यु लाभ',
    ],
    requiredDocuments: [
      'Aadhaar card',
      'Proof of construction work (contractor certificate or self-declaration)',
      'Bank passbook',
      'Passport-size photograph',
    ],
    applicationSteps: [
      'Contact the nearest Labour Department / CSC Centre',
      'Fill BOCW registration form',
      'Submit required documents',
      'Pay registration fee (₹25–₹50 varies by state)',
      'Receive BOCW registration card',
    ],
    officialSource: 'https://bocw.labour.gov.in',
    officialSourceLabel: 'bocw.labour.gov.in (Ministry of Labour & Employment)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['bocw', 'welfare', 'construction', 'pension', 'housing', 'accident', 'benefit', 'कल्याण', 'निर्माण', 'पेंशन'],
  },
  {
    id: 'scheme-003',
    name: 'PM Suraksha Bima Yojana (PMSBY) — Accidental Insurance',
    nameHi: 'प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY) — दुर्घटना बीमा',
    category: 'Accident Protection',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India',
    description:
      'PMSBY offers accidental death and disability insurance cover of ₹2 lakh for a nominal premium of ₹20/year. Available to bank account holders aged 18–70.',
    descriptionHi:
      'PMSBY मात्र ₹20/वर्ष के प्रीमियम पर ₹2 लाख का दुर्घटना मृत्यु और विकलांगता बीमा देती है। 18–70 वर्ष के बैंक खाताधारकों के लिए उपलब्ध।',
    eligibility: [
      'Age between 18–70 years',
      'Must have a savings bank account',
      'Mobile number linked to bank account',
    ],
    eligibilityHi: [
      'आयु 18 से 70 वर्ष के बीच',
      'बचत बैंक खाता होना आवश्यक',
      'बैंक खाते से मोबाइल नंबर लिंक हो',
    ],
    benefits: [
      '₹2 lakh on accidental death',
      '₹2 lakh on permanent total disability',
      '₹1 lakh on permanent partial disability',
      'Premium: ₹20/year (auto-debited from bank)',
    ],
    benefitsHi: [
      'आकस्मिक मृत्यु पर ₹2 लाख',
      'स्थायी पूर्ण विकलांगता पर ₹2 लाख',
      'स्थायी आंशिक विकलांगता पर ₹1 लाख',
      'प्रीमियम: ₹20/वर्ष (बैंक से स्वतः कटौती)',
    ],
    requiredDocuments: ['Savings bank account', 'Aadhaar card', 'Mobile number'],
    applicationSteps: [
      'Visit your bank or use net banking / mobile app',
      'Enroll in PMSBY scheme',
      'Auto-debit of ₹20 annually from bank account',
      'Download policy certificate',
    ],
    officialSource: 'https://jansuraksha.gov.in',
    officialSourceLabel: 'jansuraksha.gov.in (Ministry of Finance)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['pmsby', 'accident', 'insurance', 'bima', 'suraksha', 'death', 'disability', 'दुर्घटना', 'बीमा', 'सुरक्षा'],
  },
  {
    id: 'scheme-004',
    name: 'PM Jeevan Jyoti Bima Yojana (PMJJBY) — Life Insurance',
    nameHi: 'प्रधानमंत्री जीवन ज्योति बीमा योजना (PMJJBY) — जीवन बीमा',
    category: 'Worker Welfare',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India',
    description:
      'PMJJBY provides life insurance cover of ₹2 lakh for a premium of ₹436/year for bank account holders aged 18–50.',
    descriptionHi:
      'PMJJBY 18–50 वर्ष के बैंक खाताधारकों को ₹436/वर्ष के प्रीमियम पर ₹2 लाख का जीवन बीमा प्रदान करती है।',
    eligibility: [
      'Age between 18–50 years',
      'Savings bank account holder',
      'Aadhaar linked bank account preferred',
    ],
    eligibilityHi: [
      'आयु 18 से 50 वर्ष',
      'बचत बैंक खाताधारक',
      'आधार से जुड़ा बैंक खाता बेहतर',
    ],
    benefits: [
      '₹2 lakh life insurance cover (any cause of death)',
      'Premium: ₹436/year auto-debited',
      'Renewable annually',
    ],
    benefitsHi: [
      '₹2 लाख जीवन बीमा (किसी भी कारण से मृत्यु)',
      'प्रीमियम ₹436/वर्ष स्वतः कटौती',
      'प्रतिवर्ष नवीनीकरणीय',
    ],
    requiredDocuments: ['Savings bank account', 'Aadhaar card'],
    applicationSteps: [
      'Visit your bank branch or use mobile banking',
      'Opt-in for PMJJBY',
      'Annual premium of ₹436 auto-debited in May/June',
    ],
    officialSource: 'https://jansuraksha.gov.in',
    officialSourceLabel: 'jansuraksha.gov.in (Ministry of Finance)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['pmjjby', 'life', 'jeevan', 'jyoti', 'jivan', 'bima', 'insurance', 'जीवन', 'बीमा'],
  },
  {
    id: 'scheme-005',
    name: 'Pradhan Mantri Awas Yojana — Urban (PMAY-U)',
    nameHi: 'प्रधानमंत्री आवास योजना — शहरी (PMAY-U)',
    category: 'Housing',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India (Urban)',
    description:
      'PMAY-U provides housing support to economically weaker sections and low-income groups in urban areas. Construction workers may qualify under the EWS/LIG category.',
    descriptionHi:
      'PMAY-U शहरी क्षेत्रों में आर्थिक रूप से कमजोर वर्गों और निम्न आय समूहों को आवास सहायता प्रदान करती है। निर्माण श्रमिक EWS/LIG श्रेणी में योग्य हो सकते हैं।',
    eligibility: [
      'Annual household income below ₹3 lakh (EWS) or ₹3–6 lakh (LIG)',
      'No pucca house in India',
      'Aadhaar card',
      'Construction worker status may be considered',
    ],
    eligibilityHi: [
      'वार्षिक पारिवारिक आय ₹3 लाख से कम (EWS) या ₹3–6 लाख (LIG)',
      'भारत में कोई पक्का मकान नहीं',
      'आधार कार्ड',
      'निर्माण श्रमिक दर्जा विचारणीय',
    ],
    benefits: [
      'Interest subsidy on home loans',
      'Subsidy up to ₹2.67 lakh under CLSS',
      'Construction of affordable housing',
    ],
    benefitsHi: [
      'होम लोन पर ब्याज सब्सिडी',
      'CLSS के तहत ₹2.67 लाख तक सब्सिडी',
      'किफायती आवास निर्माण',
    ],
    requiredDocuments: [
      'Aadhaar card',
      'Income certificate',
      'Bank account details',
      'Photograph',
    ],
    applicationSteps: [
      'Visit pmaymis.gov.in or nearest Urban Local Body',
      'Fill the beneficiary application form',
      'Submit documents',
      'Wait for verification and allotment',
    ],
    officialSource: 'https://pmaymis.gov.in',
    officialSourceLabel: 'pmaymis.gov.in (Ministry of Housing & Urban Affairs)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['housing', 'awas', 'pmay', 'home', 'house', 'आवास', 'मकान', 'घर'],
  },
  {
    id: 'scheme-006',
    name: 'PM Skill Development Scheme — PMKVY 4.0',
    nameHi: 'प्रधानमंत्री कौशल विकास योजना — PMKVY 4.0',
    category: 'Skill Development',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India',
    description:
      'PMKVY 4.0 provides free skill training and government-recognised certification to construction and unorganised sector workers. Completion may improve job prospects and wage rates.',
    descriptionHi:
      'PMKVY 4.0 निर्माण और असंगठित क्षेत्र के श्रमिकों को मुफ्त कौशल प्रशिक्षण और सरकार-मान्यता प्राप्त प्रमाणपत्र प्रदान करती है।',
    eligibility: [
      'Age 15 years and above',
      'Indian citizen',
      'Construction/unorganised sector workers eligible',
    ],
    eligibilityHi: [
      '15 वर्ष और उससे अधिक आयु',
      'भारतीय नागरिक',
      'निर्माण/असंगठित क्षेत्र के श्रमिक पात्र',
    ],
    benefits: [
      'Free vocational training in 30+ construction trades',
      'Government-recognised NSQF certification',
      'Stipend during training (varies)',
      'Better employment and wage prospects',
    ],
    benefitsHi: [
      '30+ निर्माण ट्रेड में मुफ्त व्यावसायिक प्रशिक्षण',
      'सरकार-मान्यता प्राप्त NSQF प्रमाणपत्र',
      'प्रशिक्षण के दौरान वजीफा (अलग-अलग)',
      'रोजगार और वेतन संभावनाओं में सुधार',
    ],
    requiredDocuments: ['Aadhaar card', 'Bank account', 'Photograph'],
    applicationSteps: [
      'Visit skillindia.gov.in or nearest PMKVY training centre',
      'Register online or in-person',
      'Attend free training',
      'Appear for assessment and receive certificate',
    ],
    officialSource: 'https://skillindia.gov.in',
    officialSourceLabel: 'skillindia.gov.in (Ministry of Skill Development)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['skill', 'training', 'pmkvy', 'certificate', 'kaushal', 'development', 'कौशल', 'प्रशिक्षण', 'प्रमाणपत्र'],
  },
  {
    id: 'scheme-007',
    name: 'Ayushman Bharat PM-JAY (Health Insurance)',
    nameHi: 'आयुष्मान भारत PM-JAY (स्वास्थ्य बीमा)',
    category: 'Health',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India',
    description:
      'PM-JAY provides health cover of ₹5 lakh per family per year for secondary and tertiary hospitalisation for eligible low-income and construction worker families.',
    descriptionHi:
      'PM-JAY पात्र निम्न-आय और निर्माण श्रमिक परिवारों के लिए द्वितीयक और तृतीयक अस्पताल भर्ती हेतु प्रति परिवार ₹5 लाख का वार्षिक स्वास्थ्य आवरण प्रदान करती है।',
    eligibility: [
      'Listed in SECC 2011 database',
      'Construction workers and families in unorganised sector may be eligible',
      'BPL/low-income households',
      'Aadhaar card required',
    ],
    eligibilityHi: [
      'SECC 2011 डेटाबेस में सूचीबद्ध',
      'असंगठित क्षेत्र में निर्माण श्रमिक और परिवार पात्र हो सकते हैं',
      'BPL/निम्न-आय परिवार',
      'आधार कार्ड आवश्यक',
    ],
    benefits: [
      '₹5 lakh health cover per family per year',
      'Covers 1,500+ procedures and packages',
      'Cashless treatment at empanelled hospitals',
      'No premium from beneficiary',
    ],
    benefitsHi: [
      'प्रति परिवार ₹5 लाख वार्षिक स्वास्थ्य आवरण',
      '1,500+ प्रक्रियाओं और पैकेजों का समावेश',
      'सूचीबद्ध अस्पतालों में कैशलेस इलाज',
      'लाभार्थी से कोई प्रीमियम नहीं',
    ],
    requiredDocuments: ['Aadhaar card', 'SECC/Ration card', 'Family composition proof'],
    applicationSteps: [
      'Visit pmjay.gov.in or nearest empanelled hospital',
      'Check eligibility at the Ayushman Bharat kiosk',
      'Get Ayushman Card issued',
      'Use card for cashless treatment',
    ],
    officialSource: 'https://pmjay.gov.in',
    officialSourceLabel: 'pmjay.gov.in (National Health Authority)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['health', 'ayushman', 'hospital', 'medical', 'bimari', 'swasthya', 'pmjay', 'स्वास्थ्य', 'बीमारी', 'अस्पताल'],
  },
  {
    id: 'scheme-008',
    name: 'Atal Pension Yojana (APY)',
    nameHi: 'अटल पेंशन योजना (APY)',
    category: 'Pension',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India',
    description:
      'APY guarantees a minimum monthly pension of ₹1,000 to ₹5,000 after age 60 for unorganised sector workers. Contribution is as low as ₹42/month (age 18). Government co-contributes for eligible workers.',
    descriptionHi:
      'APY असंगठित क्षेत्र के श्रमिकों को 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 तक की न्यूनतम मासिक पेंशन की गारंटी देती है। अंशदान मात्र ₹42/माह (18 वर्ष) से शुरू। पात्र श्रमिकों के लिए सरकार सह-अंशदान करती है।',
    eligibility: [
      'Age between 18–40 years',
      'Savings bank account holder',
      'Not covered under any statutory social security scheme',
      'Aadhaar and mobile number required',
    ],
    eligibilityHi: [
      'आयु 18 से 40 वर्ष के बीच',
      'बचत बैंक खाताधारक',
      'किसी वैधानिक सामाजिक सुरक्षा योजना में शामिल नहीं',
      'आधार और मोबाइल नंबर आवश्यक',
    ],
    benefits: [
      'Guaranteed monthly pension of ₹1,000–₹5,000 after age 60',
      'Government co-contribution of 50% for eligible subscribers (5 years)',
      "Spouse pension after subscriber's death",
      'Corpus returned to nominee on death of both',
    ],
    benefitsHi: [
      '60 वर्ष के बाद ₹1,000–₹5,000 की गारंटीकृत मासिक पेंशन',
      'पात्र ग्राहकों के लिए सरकार 50% सह-अंशदान (5 वर्ष)',
      'ग्राहक की मृत्यु के बाद पत्नी/पति को पेंशन',
      'दोनों की मृत्यु पर नॉमिनी को कोष वापस',
    ],
    requiredDocuments: ['Savings bank account', 'Aadhaar card', 'Mobile number'],
    applicationSteps: [
      'Visit your bank branch or use net/mobile banking',
      'Fill APY registration form',
      'Choose pension amount (₹1,000–₹5,000)',
      'Monthly contribution auto-debited from bank',
    ],
    officialSource: 'https://npscra.nsdl.co.in/scheme-details.php',
    officialSourceLabel: 'npscra.nsdl.co.in (PFRDA)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['pension', 'atal', 'apy', 'retirement', 'old age', 'monthly', 'पेंशन', 'बुढ़ापा', 'रिटायरमेंट'],
  },
  {
    id: 'scheme-009',
    name: 'PM Garib Kalyan Yojana — Financial Assistance',
    nameHi: 'प्रधानमंत्री गरीब कल्याण योजना — वित्तीय सहायता',
    category: 'Financial Support',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India',
    description:
      'PM Garib Kalyan Yojana provides direct financial assistance and free food grain to economically weaker sections including construction workers during economic disruptions.',
    descriptionHi:
      'प्रधानमंत्री गरीब कल्याण योजना आर्थिक व्यवधानों के दौरान निर्माण श्रमिकों सहित आर्थिक रूप से कमज़ोर वर्गों को प्रत्यक्ष वित्तीय सहायता और मुफ्त खाद्यान्न प्रदान करती है।',
    eligibility: [
      'BPL/low-income families',
      'Ration card holder (NFSA)',
      'Jan Dhan account holder (for DBT)',
      'Construction workers registered with welfare boards may qualify',
    ],
    eligibilityHi: [
      'बीपीएल/निम्न-आय परिवार',
      'राशन कार्ड धारक (NFSA)',
      'जन धन खाता धारक (DBT हेतु)',
      'कल्याण बोर्ड में पंजीकृत निर्माण श्रमिक योग्य हो सकते हैं',
    ],
    benefits: [
      'Free food grain (rice/wheat) under NFSA',
      'Direct benefit transfer (DBT) to Jan Dhan accounts',
      'Additional financial relief during economic disruptions',
    ],
    benefitsHi: [
      'NFSA के तहत मुफ्त खाद्यान्न (चावल/गेहूं)',
      'जन धन खातों में प्रत्यक्ष लाभ अंतरण (DBT)',
      'आर्थिक व्यवधान के दौरान अतिरिक्त वित्तीय राहत',
    ],
    requiredDocuments: ['Aadhaar card', 'Ration card', 'Jan Dhan bank account'],
    applicationSteps: [
      'Ensure you have a ration card under NFSA',
      'Open a Jan Dhan account at any bank (zero balance)',
      'Benefits are delivered automatically via DBT or PDS',
      'Visit nearest fair price shop for food grain',
    ],
    officialSource: 'https://pib.gov.in',
    officialSourceLabel: 'pib.gov.in (Press Information Bureau)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['garib', 'kalyan', 'financial', 'support', 'food', 'ration', 'dbt', 'money', 'relief', 'गरीब', 'कल्याण', 'राशन', 'पैसा', 'सहायता'],
  },
  {
    id: 'scheme-010',
    name: 'National Apprenticeship Promotion Scheme (NAPS)',
    nameHi: 'राष्ट्रीय शिक्षुता संवर्धन योजना (NAPS)',
    category: 'Education',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    location: 'All India',
    description:
      'NAPS promotes apprenticeship training in construction and other trades by sharing stipend costs with employers. Workers can gain certified skills while earning a stipend.',
    descriptionHi:
      'NAPS नियोक्ताओं के साथ वजीफा लागत साझा करके निर्माण और अन्य ट्रेडों में शिक्षुता प्रशिक्षण को बढ़ावा देती है। श्रमिक वजीफा प्राप्त करते हुए प्रमाणित कौशल हासिल कर सकते हैं।',
    eligibility: [
      'Age 14 years and above (varies by trade)',
      'Indian citizen',
      'Minimum 5th pass (for designated trades)',
      'Construction workers seeking formal certification eligible',
    ],
    eligibilityHi: [
      'आयु 14 वर्ष और उससे अधिक (ट्रेड के अनुसार)',
      'भारतीय नागरिक',
      'न्यूनतम 5वीं पास (निर्दिष्ट ट्रेडों के लिए)',
      'औपचारिक प्रमाणन चाहने वाले निर्माण श्रमिक पात्र',
    ],
    benefits: [
      'Monthly stipend during apprenticeship',
      'Government shares 25% of prescribed stipend with employer (up to ₹1,500/month)',
      'National trade certificate on completion',
      'Better employment opportunities with formal certification',
    ],
    benefitsHi: [
      'शिक्षुता के दौरान मासिक वजीफा',
      'सरकार निर्धारित वजीफे का 25% नियोक्ता को देती है (₹1,500/माह तक)',
      'पूर्ण होने पर राष्ट्रीय ट्रेड प्रमाणपत्र',
      'औपचारिक प्रमाणन से बेहतर रोजगार अवसर',
    ],
    requiredDocuments: ['Aadhaar card', 'Educational certificates', 'Bank account', 'Photograph'],
    applicationSteps: [
      'Visit apprenticeshipindia.gov.in',
      'Register as a candidate',
      'Search and apply for apprenticeship in your trade',
      'Appear for selection and join training',
    ],
    officialSource: 'https://apprenticeshipindia.gov.in',
    officialSourceLabel: 'apprenticeshipindia.gov.in (Ministry of Skill Development)',
    verifiedAt: 'August 2026',
    active: true,
    matchKeywords: ['apprenticeship', 'education', 'training', 'naps', 'certificate', 'learning', 'शिक्षा', 'प्रशिक्षण', 'शिक्षुता', 'सीखना'],
  },
];

// ============================================================
// VERIFIED INSURANCE OPTIONS (seeded)
// SHRAMIKK is a discovery layer — not an insurance seller
// ============================================================
export const verifiedInsuranceOptions: InsuranceOption[] = [
  {
    id: 'ins-001',
    name: 'PM Suraksha Bima Yojana (PMSBY)',
    nameHi: 'प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)',
    provider: 'Government of India (via participating banks)',
    category: 'Accident',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    description:
      'Government-backed accidental death and disability insurance of ₹2 lakh. Available to all bank account holders at ₹20/year.',
    descriptionHi:
      'सरकार समर्थित ₹2 लाख का दुर्घटना मृत्यु और विकलांगता बीमा। सभी बैंक खाताधारकों के लिए ₹20/वर्ष पर उपलब्ध।',
    coverage: [
      '₹2 lakh on accidental death',
      '₹2 lakh on permanent total disability',
      '₹1 lakh on permanent partial disability',
    ],
    coverageHi: [
      'दुर्घटना मृत्यु पर ₹2 लाख',
      'स्थायी पूर्ण विकलांगता पर ₹2 लाख',
      'स्थायी आंशिक विकलांगता पर ₹1 लाख',
    ],
    eligibility: ['Age 18–70 years', 'Savings bank account holder'],
    eligibilityHi: ['आयु 18–70 वर्ष', 'बचत बैंक खाताधारक'],
    officialSource: 'https://jansuraksha.gov.in',
    officialSourceLabel: 'jansuraksha.gov.in',
    verifiedAt: 'August 2026',
    active: true,
    disclaimer:
      'SHRAMIKK helps you discover relevant protection options. Insurance products are provided by regulated partners and government schemes.',
    matchKeywords: ['accident', 'pmsby', 'suraksha', 'death', 'disability', 'bima', 'दुर्घटना', 'बीमा', 'protection'],
  },
  {
    id: 'ins-002',
    name: 'BOCW Board — Accidental Death & Disability Benefit',
    nameHi: 'BOCW बोर्ड — दुर्घटना मृत्यु एवं विकलांगता लाभ',
    provider: 'State BOCW Welfare Boards',
    category: 'Worker Protection',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    description:
      'Registered BOCW workers are eligible for accident compensation and death benefits under the state BOCW welfare fund. Benefit amounts vary by state.',
    descriptionHi:
      'पंजीकृत BOCW श्रमिक राज्य BOCW कल्याण निधि के तहत दुर्घटना मुआवजा और मृत्यु लाभ के पात्र हैं। लाभ राशि राज्य के अनुसार अलग होती है।',
    coverage: [
      'Accident compensation (amount varies by state)',
      'Death benefit for registered workers',
      'Disability assistance',
    ],
    coverageHi: [
      'दुर्घटना मुआवजा (राज्य के अनुसार अलग)',
      'पंजीकृत श्रमिकों के लिए मृत्यु लाभ',
      'विकलांगता सहायता',
    ],
    eligibility: [
      'Must be registered with state BOCW Board',
      'Worked in construction for 90+ days in last 12 months',
    ],
    eligibilityHi: [
      'राज्य BOCW बोर्ड में पंजीकृत होना आवश्यक',
      'पिछले 12 महीनों में 90+ दिन निर्माण कार्य',
    ],
    officialSource: 'https://bocw.labour.gov.in',
    officialSourceLabel: 'bocw.labour.gov.in',
    verifiedAt: 'August 2026',
    active: true,
    disclaimer:
      'SHRAMIKK helps you discover relevant protection options. Insurance products are provided by regulated partners and government schemes.',
    matchKeywords: ['bocw', 'welfare', 'accident', 'construction', 'worker', 'death', 'disability', 'protection', 'कल्याण', 'निर्माण'],
  },
  {
    id: 'ins-003',
    name: 'Ayushman Bharat PM-JAY (Health Protection)',
    nameHi: 'आयुष्मान भारत PM-JAY (स्वास्थ्य सुरक्षा)',
    provider: 'National Health Authority (NHA)',
    category: 'Health',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    description:
      'Eligible construction worker families can receive ₹5 lakh annual health cover under PM-JAY for hospitalisation at empanelled government and private hospitals.',
    descriptionHi:
      'पात्र निर्माण श्रमिक परिवारों को PM-JAY के अंतर्गत सूचीबद्ध सरकारी और निजी अस्पतालों में भर्ती के लिए ₹5 लाख का वार्षिक स्वास्थ्य आवरण मिल सकता है।',
    coverage: [
      '₹5 lakh per family per year',
      '1,500+ medical procedures and packages',
      'Cashless hospitalisation at empanelled hospitals',
    ],
    coverageHi: [
      'प्रति परिवार ₹5 लाख प्रति वर्ष',
      '1,500+ चिकित्सा प्रक्रियाएं',
      'सूचीबद्ध अस्पतालों में कैशलेस भर्ती',
    ],
    eligibility: ['Listed in SECC 2011 or state-level inclusion criteria', 'Aadhaar card required'],
    eligibilityHi: ['SECC 2011 या राज्य स्तरीय समावेश मानदंड में सूचीबद्ध', 'आधार कार्ड आवश्यक'],
    officialSource: 'https://pmjay.gov.in',
    officialSourceLabel: 'pmjay.gov.in (National Health Authority)',
    verifiedAt: 'August 2026',
    active: true,
    disclaimer:
      'SHRAMIKK helps you discover relevant protection options. Insurance products are provided by regulated partners and government schemes.',
    matchKeywords: ['health', 'ayushman', 'pmjay', 'hospital', 'medical', 'health insurance', 'स्वास्थ्य', 'अस्पताल', 'बीमारी'],
  },
  {
    id: 'ins-004',
    name: 'PM Jeevan Jyoti Bima Yojana (PMJJBY)',
    nameHi: 'प्रधानमंत्री जीवन ज्योति बीमा योजना (PMJJBY)',
    provider: 'Government of India (via participating banks)',
    category: 'Life',
    targetWorkers: ['Mason', 'Helper', 'Painter', 'Plumber', 'Carpenter', 'Tile Worker', 'Electrician'],
    description:
      'PMJJBY provides life insurance cover of ₹2 lakh at ₹436/year for bank account holders aged 18–50. Covers death due to any cause.',
    descriptionHi:
      'PMJJBY 18–50 वर्ष के बैंक खाताधारकों को ₹436/वर्ष पर ₹2 लाख का जीवन बीमा प्रदान करती है। किसी भी कारण से मृत्यु पर कवर।',
    coverage: [
      '₹2 lakh life insurance cover (death due to any cause)',
      'Annual renewable at ₹436/year',
      'Coverage from 1 June to 31 May each year',
    ],
    coverageHi: [
      '₹2 लाख जीवन बीमा (किसी भी कारण से मृत्यु)',
      '₹436/वर्ष पर वार्षिक नवीनीकरणीय',
      'हर वर्ष 1 जून से 31 मई तक कवरेज',
    ],
    eligibility: ['Age 18–50 years', 'Savings bank account holder', 'Aadhaar linked bank account preferred'],
    eligibilityHi: ['आयु 18–50 वर्ष', 'बचत बैंक खाताधारक', 'आधार से जुड़ा बैंक खाता बेहतर'],
    officialSource: 'https://jansuraksha.gov.in',
    officialSourceLabel: 'jansuraksha.gov.in (Ministry of Finance)',
    verifiedAt: 'August 2026',
    active: true,
    disclaimer:
      'SHRAMIKK helps you discover relevant protection options. Insurance products are provided by regulated partners and government schemes.',
    matchKeywords: ['life', 'jeevan', 'jyoti', 'pmjjby', 'death', 'bima', 'insurance', 'जीवन', 'बीमा', 'मृत्यु'],
  },
];

// ============================================================
// SIMPLE RETRIEVAL FUNCTIONS — Anti-hallucination engine
// ============================================================

export type QueryIntent = 'scheme' | 'insurance' | 'income' | 'benefits' | 'general' | 'unknown';

export function detectIntent(query: string): QueryIntent {
  const q = query.toLowerCase();
  if (
    q.includes('yojan') || q.includes('scheme') || q.includes('sarkari') ||
    q.includes('government') || q.includes('sarkar') || q.includes('welfare') ||
    q.includes('kaushal') || q.includes('skill') || q.includes('eshram') ||
    q.includes('bocw') || q.includes('awas') || q.includes('pension') ||
    q.includes('housing') || q.includes('health') || q.includes('swasthya') ||
    q.includes('ayushman') || q.includes('yojana') || q.includes('garib') ||
    q.includes('apprentice') || q.includes('education') || q.includes('शिक्षा')
  ) return 'scheme';

  if (
    q.includes('insurance') || q.includes('bima') || q.includes('protection') ||
    q.includes('accident') || q.includes('suraksha') || q.includes('pmsby') ||
    q.includes('cover') || q.includes('hospital')
  ) return 'insurance';

  if (
    q.includes('income') || q.includes('earning') || q.includes('salary') ||
    q.includes('wage') || q.includes('kamai') || q.includes('paisa') ||
    q.includes('payment') || q.includes('work') || q.includes('job')
  ) return 'income';

  if (
    q.includes('benefit') || q.includes('labh') || q.includes('fayd') ||
    q.includes('understand') || q.includes('samajh') || q.includes('eligible') ||
    q.includes('patra')
  ) return 'benefits';

  if (
    q.includes('help') || q.includes('support') || q.includes('kya') ||
    q.includes('what') || q.includes('find') || q.includes('mujhe') ||
    q.includes('show') || q.includes('batao') || q.includes('chahiye')
  ) return 'general';

  return 'unknown';
}

export function retrieveSchemes(query: string, workerSkill: string = '', workerCity: string = ''): VerifiedScheme[] {
  const q = query.toLowerCase();
  const skill = workerSkill.toLowerCase();
  const city = workerCity.toLowerCase();

  return verifiedSchemes
    .filter((s) => s.active)
    .filter((s) => {
      const keywordMatch = s.matchKeywords.some((kw) => q.includes(kw));
      const skillMatch = s.targetWorkers.some((w) => skill.includes(w.toLowerCase().split('/')[0].trim()));
      const catMatch = s.category.toLowerCase().includes(q.split(' ')[0]);
      return keywordMatch || skillMatch || catMatch || q.includes('scheme') || q.includes('yojan') || q.includes('all') || q.includes('benefit') || q.includes('labh');
    })
    .slice(0, 5);
}

export function retrieveInsurance(query: string, workerSkill: string = ''): InsuranceOption[] {
  const q = query.toLowerCase();
  const skill = workerSkill.toLowerCase();

  return verifiedInsuranceOptions
    .filter((i) => i.active)
    .filter((i) => {
      const kw = i.matchKeywords.some((k) => q.includes(k));
      const sk = i.targetWorkers.some((w) => skill.includes(w.toLowerCase().split('/')[0].trim()));
      return kw || sk || q.includes('insurance') || q.includes('bima') || q.includes('all');
    })
    .slice(0, 4);
}

// ============================================================
// SCHEME MATCHING — Profile-aware relevance explanation
// ============================================================
export function getSchemeMatchReason(
  scheme: VerifiedScheme,
  workerSkill: string = '',
  workerCity: string = '',
  lang: 'hi' | 'en' = 'en'
): string {
  const skill = workerSkill.toLowerCase().split('/')[0].trim();
  const city = workerCity.toLowerCase();

  const skillMatch = scheme.targetWorkers.some((w) => w.toLowerCase().includes(skill));
  const locationMatch = scheme.location.toLowerCase().includes(city) || scheme.location === 'All India' || scheme.location.includes('All India');

  if (skillMatch && locationMatch) {
    return lang === 'hi'
      ? `कामगार श्रेणी (${skill}) + स्थान मिलान`
      : `Worker category (${skill}) + location match`;
  } else if (skillMatch) {
    return lang === 'hi'
      ? `कामगार श्रेणी (${skill}) मिलान`
      : `Worker category (${skill}) match`;
  } else if (locationMatch) {
    return lang === 'hi' ? 'स्थान मिलान' : 'Location match';
  }
  return lang === 'hi' ? 'निर्माण श्रमिकों के लिए उपलब्ध' : 'Available for construction workers';
}
