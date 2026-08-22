// ==========================================
// SHRAMIKK - CORE DATA TYPES (PHASE 1)
// ==========================================

export type UserRole = 'worker' | 'hirer' | 'contractor' | 'admin';

export type Language = 'hi' | 'en';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  language: Language;
  createdAt: string;
}

export type SkillCategory = 
  | 'Mason / राजमिस्त्री'
  | 'Helper / हेल्पर'
  | 'Painter / पेंटर'
  | 'Plumber / प्लंबर'
  | 'Electrician / इलेक्ट्रीशियन'
  | 'Carpenter / बढ़ई'
  | 'Welder / वेल्डर'
  | 'Tile Worker / टाइल मिस्त्री';

export type WorkerGrade = 'A' | 'B' | 'C';

export interface Worker extends User {
  role: 'worker';
  primarySkill: SkillCategory;
  secondarySkills?: SkillCategory[];
  grade: WorkerGrade;
  dailyWageRate: number; // in INR
  experienceYears: number;
  rating: number; // e.g. 4.7
  totalReviews: number;
  completedJobsCount: number;
  totalWorkDays: number;
  monthlyEarnings: number;
  earningsGrowthPercent: number;
  city: string;
  locality: string;
  pincode: string;
  aadhaarLinked: boolean;
  eShramLinked: boolean;
  bocwRegistered: boolean;
  bocwRegistrationNumber?: string;
  bankAccountLinked: boolean;
  digitalIdCardNumber: string;
  qrCodeUrl?: string;
  bio?: string;
  profilePhotoUrl?: string;
  emergencyContact?: string;
}

export interface Hirer extends User {
  role: 'hirer' | 'contractor';
  companyName?: string;
  businessType?: 'individual_homeowner' | 'civil_contractor' | 'builder' | 'interior_decorator';
  gstNumber?: string;
  city: string;
  locality: string;
  totalJobsPosted: number;
  rating: number;
  verifiedBadge: boolean;
}

export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type JobUrgency = 'immediate_today' | 'tomorrow' | 'scheduled';

export interface Job {
  id: string;
  title: string;
  titleHi: string;
  category: SkillCategory;
  hirerId: string;
  hirerName: string;
  hirerPhone: string;
  hirerType: string;
  location: {
    address: string;
    locality: string;
    city: string;
    landmark?: string;
    coordinates?: { lat: number; lng: number };
  };
  requiredWorkersCount: number;
  filledWorkersCount: number;
  wagePerDay: number;
  durationDays: number;
  startDate: string;
  endDate?: string;
  shiftTiming: string; // e.g. "9:00 AM - 6:00 PM"
  status: JobStatus;
  urgency: JobUrgency;
  description: string;
  descriptionHi: string;
  perksProvided?: string[]; // e.g. ["चाय/नाश्ता", "यात्रा भत्ता", "सुरक्षा उपकरण"]
  createdAt: string;
}

export type ApplicationStatus = 'applied' | 'accepted' | 'rejected' | 'completed';

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerSkill: SkillCategory;
  workerRating: number;
  appliedDate: string;
  status: ApplicationStatus;
  wageAgreed: number;
}

export interface WorkRecord {
  id: string;
  workerId: string;
  jobId: string;
  contractorName: string;
  siteName: string;
  location: string;
  skillRendered: SkillCategory;
  date: string;
  hoursWorked: number;
  dailyWageAmount: number;
  paymentStatus: 'paid_instant' | 'paid_bank' | 'pending_verification';
  attendanceStatus: 'present' | 'half_day' | 'absent';
  supervisorVerified: boolean;
  supervisorSignatureHash?: string;
  wageSlipNumber: string;
}

export interface Payment {
  id: string;
  workerId: string;
  hirerId: string;
  workRecordId: string;
  amount: number;
  paymentMethod: 'upi' | 'bank_transfer' | 'cash_receipt' | 'shramik_escrow';
  transactionReference: string;
  timestamp: string;
  status: 'successful' | 'processing' | 'failed';
  wageSlipDownloadUrl?: string;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  jobId: string;
  score: number; // 1 to 5
  comment?: string;
  skillsRating?: {
    punctuality: number;
    skillProficiency: number;
    safetyCompliance: number;
    behavior: number;
  };
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  type: 'job_alert' | 'wage_credited' | 'verification' | 'bocw_scheme' | 'general';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface DigitalIdentity {
  workerId: string;
  fullName: string;
  fullNameHi: string;
  uniqueCardId: string; // e.g. "SHR-2026-DL-8892"
  grade: WorkerGrade;
  primaryTrade: string;
  experienceYears: number;
  rating: number;
  completedJobs: number;
  verifiedStatus: {
    aadhaar: boolean;
    eShram: boolean;
    bocw: boolean;
    bankAccount: boolean;
  };
  totalEarningsRecorded: number;
  currentMonthEarnings: number;
  monthlyGrowth: number;
  recentWorkDays: number;
  issuedDate: string;
  qrPayload: string;
}
