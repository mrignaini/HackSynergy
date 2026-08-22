/**
 * SHRAMIKK Ecosystem & Financial Connectivity Services
 * Integration-ready service abstractions for Government Schemes, Insurance Partners,
 * Payment Verification, and Future Banking / Regulated Financial Partners.
 */

import { verifiedSchemes, verifiedInsuranceOptions, type VerifiedScheme, type InsuranceOption } from '../data/safetyNetData';

export interface EcosystemIntegrationStatus {
  id: string;
  name: string;
  nameHi: string;
  category: 'government' | 'insurance' | 'payments' | 'banking' | 'credit';
  status: 'available' | 'future_integration' | 'coming_soon';
  description: string;
  descriptionHi: string;
  partnerType: string;
}

// 1. Government Welfare & Scheme Services
export const GovernmentService = {
  getSchemes: (): VerifiedScheme[] => {
    return verifiedSchemes.filter((s) => s.active);
  },
  getSchemeById: (id: string): VerifiedScheme | undefined => {
    return verifiedSchemes.find((s) => s.id === id);
  },
  checkEligibilityPreview: (workerSkill: string, city: string) => {
    return {
      status: 'eligible_preview',
      disclaimer: 'Official eligibility is verified by the respective government authority or portal.',
      eligibleSchemesCount: verifiedSchemes.length,
    };
  },
};

// 2. Regulated Insurance Partner Services
export const InsuranceProviderService = {
  getInsuranceOptions: (): InsuranceOption[] => {
    return verifiedInsuranceOptions.filter((i) => i.active);
  },
  getInsuranceById: (id: string): InsuranceOption | undefined => {
    return verifiedInsuranceOptions.find((i) => i.id === id);
  },
  getProviderNotice: () => {
    return 'SHRAMIKK is a discovery and routing layer. All insurance products are provided through regulated government and insurance partners.';
  },
};

// 3. Banking & Financial Partners (Future Integration)
export const FinancialPartnerService = {
  getBankingStatus: () => {
    return {
      status: 'coming_soon',
      message: 'SHRAMIKK will connect eligible workers with regulated financial institutions and banks in future phases.',
      messageHi: 'SHRAMIKK भविष्य के चरणों में पात्र श्रमिकों को विनियमित वित्तीय संस्थानों और बैंकों से जोड़ेगा।',
      availableInHackathon: false,
    };
  },
  getCreditAccessStatus: () => {
    return {
      status: 'coming_soon',
      message: 'Formal credit access will be provided directly by regulated NBFCs/Banks based on work records.',
      messageHi: 'विनियमित NBFCs/बैंकों द्वारा कार्य अभिलेखों के आधार पर औपचारिक ऋण पहुंच भविष्य में उपलब्ध होगी।',
      availableInHackathon: false,
    };
  },
};

// 4. UPI Payment Verification Service (Demo / Future Integration)
export const UpiPaymentService = {
  getVerificationStatus: () => {
    return {
      mode: 'dual_confirmation_mvp',
      futureMode: 'regulated_upi_stack',
      message: 'Current MVP verifies payments through dual Worker + Hirer confirmation. Regulated UPI infrastructure verification is scheduled for future ecosystem rollouts.',
      messageHi: 'वर्तमान MVP कामगार और नियोक्ता की दो-तरफ़ा पुष्टि द्वारा भुगतान सत्यापित करता है। विनियमित UPI अवसंरचना सत्यापन भविष्य के लिए नियोजित है।',
    };
  },
};

// 5. Ecosystem Integrations Summary Matrix
export const ecosystemIntegrationsList: EcosystemIntegrationStatus[] = [
  {
    id: 'eco-gov',
    name: 'Government Welfare Schemes',
    nameHi: 'सरकारी कल्याणकारी योजनाएं',
    category: 'government',
    status: 'available',
    description: '10 verified central & state welfare programs including e-Shram, BOCW, and APY.',
    descriptionHi: 'e-Shram, BOCW व APY सहित 10 सत्यापित केंद्रीय व राज्य कल्याणकारी कार्यक्रम।',
    partnerType: 'Ministry of Labour & Employment / State Boards',
  },
  {
    id: 'eco-ins',
    name: 'Insurance Discovery',
    nameHi: 'सुरक्षा व बीमा खोज',
    category: 'insurance',
    status: 'available',
    description: 'Accidental, health, and life insurance discovery (PMSBY, PMJJBY, Ayushman Bharat).',
    descriptionHi: 'दुर्घटना, स्वास्थ्य और जीवन बीमा खोज (PMSBY, PMJJBY, आयुष्मान भारत)।',
    partnerType: 'National Health Authority & Regulated Insurers',
  },
  {
    id: 'eco-pay',
    name: 'Work Payment Records & Slips',
    nameHi: 'कार्य भुगतान रिकॉर्ड व पर्चियां',
    category: 'payments',
    status: 'available',
    description: 'Two-sided worker and hirer payment confirmations with digitally generated wage slips.',
    descriptionHi: 'डिजिटल पर्चियों के साथ कामगार व नियोक्ता की दो-तरफ़ा भुगतान पुष्टि।',
    partnerType: 'SHRAMIKK Core Ledger',
  },
  {
    id: 'eco-upi',
    name: 'UPI Payment Infrastructure',
    nameHi: 'UPI भुगतान अवसंरचना',
    category: 'payments',
    status: 'future_integration',
    description: 'Automated instant payment verification through NPCI / bank UPI rails.',
    descriptionHi: 'NPCI / बैंक UPI रेल के माध्यम से स्वचालित त्वरित भुगतान सत्यापन।',
    partnerType: 'Regulated Payment Aggregators & Banks',
  },
  {
    id: 'eco-bank',
    name: 'Banking Partners',
    nameHi: 'बैंकिंग साझेदार',
    category: 'banking',
    status: 'future_integration',
    description: 'Zero-balance accounts and formal banking connectivity for daily wage earners.',
    descriptionHi: 'दैनिक वेतनभोगियों के लिए शून्य-शेष खाते और औपचारिक बैंकिंग कनेक्टिविटी।',
    partnerType: 'Scheduled Commercial Banks & Small Finance Banks',
  },
  {
    id: 'eco-credit',
    name: 'Credit Access & Micro-Finance',
    nameHi: 'ऋण पहुंच व माइक्रो-फाइनेंस',
    category: 'credit',
    status: 'future_integration',
    description: 'Work-record-linked credit facilitation through regulated NBFC partners.',
    descriptionHi: 'विनियमित NBFC साझेदारों के माध्यम से कार्य-रिकॉर्ड आधारित ऋण सुविधा।',
    partnerType: 'RBI Regulated NBFCs & Fintech Partners',
  },
];
