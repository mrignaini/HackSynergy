import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Job, Application, Worker, Rating, Payment, WorkRecord } from '../types';
import { mockJobs, mockWorkersList, mockWorkRecords } from '../data/mockData';
import { useAuth } from './AuthContext';

export interface HireRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  jobTitleHi: string;
  workerId: string;
  workerName: string;
  workerSkill: string;
  workerRating: number;
  hirerId: string;
  wagePerDay: number;
  startDate: string;
  hiredAt: string;
  status: 'active' | 'completed';
}

export interface PaymentRecordItem {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  hirerId: string;
  hirerName: string;
  amount: number;
  wagePerDay: number;
  durationDays: number;
  date: string;
  status: 'verified' | 'pending' | 'under_review' | 'recorded';
  slipNumber: string;
  location: string;
  workerConfirmed?: boolean;
  hirerConfirmed?: boolean;
  disputeReason?: string;
  verifiedAt?: string;
}

interface JobContextType {
  jobs: Job[];
  workers: Worker[];
  applications: Application[];
  hires: HireRecord[];
  ratings: Rating[];
  paymentRecords: PaymentRecordItem[];
  applyToJob: (job: Job) => { success: boolean; message: string };
  hasApplied: (jobId: string) => boolean;
  getApplicationForJob: (jobId: string) => Application | undefined;
  getApplicationsForJob: (jobId: string) => Application[];
  postNewJob: (newJob: Omit<Job, 'id' | 'createdAt'>) => { success: boolean; job: Job };
  hireWorkerForJob: (jobId: string, worker: Worker | { id: string; name: string; primarySkill?: string; rating?: number }) => { success: boolean; message: string };
  startWork: (jobId: string) => void;
  completeWork: (jobId: string) => void;
  submitRating: (jobId: string, reviewerId: string, revieweeId: string, score: number, comment?: string) => { success: boolean; message: string };
  hasRated: (jobId: string, reviewerId: string) => boolean;
  getRatingForJobAndUser: (jobId: string, reviewerId: string) => Rating | undefined;
  rejectApplication: (appId: string) => void;
  closeJob: (jobId: string) => void;
  calculateMatchScore: (job: Job) => { score: number; reason: string };
  calculateWorkerMatchScore: (worker: Worker, targetSkill?: string, targetCity?: string) => { score: number; reason: string };
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  totalIncomeRecorded: number;
  confirmPaymentByWorker: (paymentId: string) => void;
  confirmPaymentByHirer: (paymentId: string) => void;
  reportPaymentIssue: (paymentId: string, reason?: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  
  // Jobs state
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('shramikk_jobs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return mockJobs;
  });

  const [workers, setWorkers] = useState<Worker[]>(mockWorkersList);

  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    return auth.workerProfile?.city || auth.hirerProfile?.city || 'Ghaziabad';
  });

  // Applications state
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('shramikk_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'app-seed-1',
        jobId: 'job-1',
        workerId: 'w-101',
        workerName: 'रमेश कुमार (Ramesh Kumar)',
        workerSkill: 'Mason / राजमिस्त्री',
        workerRating: 4.8,
        appliedDate: '2 hours ago',
        status: 'applied',
        wageAgreed: 1000,
      },
      {
        id: 'app-seed-2',
        jobId: 'job-1',
        workerId: 'w-106',
        workerName: 'दिनेश प्रजापति (Dinesh)',
        workerSkill: 'Tile Worker / टाइल मिस्त्री',
        workerRating: 4.8,
        appliedDate: '3 hours ago',
        status: 'applied',
        wageAgreed: 1000,
      },
    ];
  });

  // Hires state
  const [hires, setHires] = useState<HireRecord[]>(() => {
    const saved = localStorage.getItem('shramikk_hires');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'hire-seed-1',
        jobId: 'job-1',
        jobTitle: 'Need a Mason for Residential Villa Work',
        jobTitleHi: 'विला निर्माण हेतु कुशल राजमिस्त्री की आवश्यकता',
        workerId: 'w-101',
        workerName: 'रमेश कुमार (Ramesh Kumar)',
        workerSkill: 'Mason / राजमिस्त्री',
        workerRating: 4.8,
        hirerId: 'h-201',
        wagePerDay: 1000,
        startDate: '18 August 2026',
        hiredAt: 'Today',
        status: 'active',
      },
    ];
  });

  // Ratings state
  const [ratings, setRatings] = useState<Rating[]>(() => {
    const saved = localStorage.getItem('shramikk_ratings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'rat-1',
        fromUserId: 'h-201',
        toUserId: 'w-101',
        jobId: 'job-7',
        score: 5,
        comment: 'उत्कृष्ट राजमिस्त्री कार्य, समय पर पूर्ण किया। / Great work and completed on time.',
        createdAt: '16 August 2026',
      },
      {
        id: 'rat-2',
        fromUserId: 'w-101',
        toUserId: 'h-201',
        jobId: 'job-7',
        score: 5,
        comment: 'सभ्य व्यवहार और समय पर पूरा भुगतान प्राप्त हुआ। / Good hirer, prompt payment.',
        createdAt: '16 August 2026',
      },
    ];
  });

  // Payment Records state
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecordItem[]>(() => {
    const saved = localStorage.getItem('shramikk_payments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'pay-1',
        jobId: 'job-7',
        jobTitle: 'Senior Mason for Boundary Wall',
        workerId: 'w-101',
        workerName: 'रमेश कुमार (Ramesh Kumar)',
        hirerId: 'h-207',
        hirerName: 'सुरेश गुप्ता (Suresh Gupta)',
        amount: 1900,
        wagePerDay: 950,
        durationDays: 2,
        date: '16 August 2026',
        status: 'verified',
        slipNumber: 'SLIP-2026-08-9941',
        location: 'Lajpat Nagar, Delhi',
        workerConfirmed: true,
        hirerConfirmed: true,
        verifiedAt: '16 August 2026',
      },
      {
        id: 'pay-2',
        jobId: 'job-prev-1',
        jobTitle: 'Villa Plastering and Finishing',
        workerId: 'w-101',
        workerName: 'रमेश कुमार (Ramesh Kumar)',
        hirerId: 'h-201',
        hirerName: 'अमित शर्मा (Amit Sharma)',
        amount: 3000,
        wagePerDay: 1000,
        durationDays: 3,
        date: '10 August 2026',
        status: 'verified',
        slipNumber: 'SLIP-2026-08-8812',
        location: 'Raj Nagar Extension, Ghaziabad',
        workerConfirmed: true,
        hirerConfirmed: true,
        verifiedAt: '10 August 2026',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('shramikk_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('shramikk_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('shramikk_hires', JSON.stringify(hires));
  }, [hires]);

  useEffect(() => {
    localStorage.setItem('shramikk_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('shramikk_payments', JSON.stringify(paymentRecords));
  }, [paymentRecords]);

  const hasApplied = (jobId: string): boolean => {
    return applications.some((app) => app.jobId === jobId && (app.status === 'applied' || app.status === 'accepted'));
  };

  const getApplicationForJob = (jobId: string): Application | undefined => {
    return applications.find((app) => app.jobId === jobId);
  };

  const getApplicationsForJob = (jobId: string): Application[] => {
    return applications.filter((app) => app.jobId === jobId);
  };

  const applyToJob = (job: Job): { success: boolean; message: string } => {
    if (hasApplied(job.id)) {
      return { success: false, message: 'आप पहले ही इस काम के लिए आवेदन कर चुके हैं।' };
    }

    if (job.status !== 'open') {
      return { success: false, message: 'यह काम बंद हो चुका है।' };
    }

    const newApp: Application = {
      id: `app-${Date.now().toString().slice(-6)}`,
      jobId: job.id,
      workerId: auth.userId || 'w-101',
      workerName: auth.workerProfile?.fullName || 'रमेश कुमार (Ramesh Kumar)',
      workerSkill: (auth.workerProfile?.skills?.[0] as any) || 'Mason / राजमिस्त्री',
      workerRating: 4.8,
      appliedDate: 'Just now',
      status: 'applied',
      wageAgreed: job.wagePerDay,
    };

    setApplications((prev) => [newApp, ...prev]);
    return { success: true, message: 'आवेदन सफलतापूर्वक भेजा गया!' };
  };

  // Post a new job
  const postNewJob = (newJobData: Omit<Job, 'id' | 'createdAt'>): { success: boolean; job: Job } => {
    const newJob: Job = {
      ...newJobData,
      id: `job-${Date.now().toString().slice(-6)}`,
      createdAt: 'Just now',
    };

    setJobs((prev) => [newJob, ...prev]);
    return { success: true, job: newJob };
  };

  // Hire a worker for a job
  const hireWorkerForJob = (
    jobId: string,
    worker: Worker | { id: string; name: string; primarySkill?: string; rating?: number }
  ): { success: boolean; message: string } => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found' };

    if (job.filledWorkersCount >= job.requiredWorkersCount) {
      return { success: false, message: 'यह काम पहले से ही पूर्ण भरा हुआ है (Fully Staffed)।' };
    }

    const newHire: HireRecord = {
      id: `hire-${Date.now().toString().slice(-6)}`,
      jobId: job.id,
      jobTitle: job.title,
      jobTitleHi: job.titleHi,
      workerId: worker.id,
      workerName: worker.name,
      workerSkill: (worker as any).primarySkill || job.category,
      workerRating: (worker as any).rating || 4.8,
      hirerId: auth.userId || 'h-201',
      wagePerDay: job.wagePerDay,
      startDate: job.startDate,
      hiredAt: 'Just now',
      status: 'active',
    };

    setHires((prev) => [newHire, ...prev]);

    const updatedFilled = job.filledWorkersCount + 1;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              filledWorkersCount: updatedFilled,
              status: 'open',
            }
          : j
      )
    );

    // Update matching application to 'accepted'
    setApplications((prev) =>
      prev.map((app) =>
        app.jobId === jobId && (app.workerId === worker.id || app.workerName.includes(worker.name.split(' ')[0]))
          ? { ...app, status: 'accepted' }
          : app
      )
    );

    return { success: true, message: 'कामगार को सफलतापूर्वक काम पर रखा गया!' };
  };

  // Start Work Lifecycle
  const startWork = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'in_progress' } : j))
    );
  };

  // Complete Work Lifecycle & Automatically Generate Payment Record
  const completeWork = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'completed' } : j))
    );

    // Update hires status
    setHires((prev) =>
      prev.map((h) => (h.jobId === jobId ? { ...h, status: 'completed' } : h))
    );

    // Generate Payment Record (wagePerDay * durationDays)
    const totalAmount = job.wagePerDay * (job.durationDays || 1);
    const newPayment: PaymentRecordItem = {
      id: `pay-${Date.now().toString().slice(-6)}`,
      jobId: job.id,
      jobTitle: job.titleHi || job.title,
      workerId: auth.userId || 'w-101',
      workerName: auth.workerProfile?.fullName || 'रमेश कुमार (Ramesh Kumar)',
      hirerId: job.hirerId || 'h-201',
      hirerName: job.hirerName || 'अमित शर्मा (Amit Sharma)',
      amount: totalAmount,
      wagePerDay: job.wagePerDay,
      durationDays: job.durationDays || 1,
      date: 'Today, ' + new Date().toLocaleDateString('en-GB'),
      status: 'pending',
      slipNumber: `SLIP-${Date.now().toString().slice(-6)}`,
      location: `${job.location.locality}, ${job.location.city}`,
      workerConfirmed: false,
      hirerConfirmed: true, // Hirer initiated completion
    };

    setPaymentRecords((prev) => [newPayment, ...prev]);

    // Update worker completed jobs count in workers list
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === 'w-101'
          ? {
              ...w,
              completedJobsCount: w.completedJobsCount + 1,
              monthlyEarnings: w.monthlyEarnings + totalAmount,
            }
          : w
      )
    );
  };

  // Submit Rating
  const submitRating = (
    jobId: string,
    reviewerId: string,
    revieweeId: string,
    score: number,
    comment: string = ''
  ): { success: boolean; message: string } => {
    if (hasRated(jobId, reviewerId)) {
      return { success: false, message: 'आप पहले ही इस कार्य के लिए रेटिंग दे चुके हैं।' };
    }

    const newRating: Rating = {
      id: `rat-${Date.now().toString().slice(-6)}`,
      jobId,
      fromUserId: reviewerId,
      toUserId: revieweeId,
      score,
      comment,
      createdAt: 'Today',
    };

    setRatings((prev) => [newRating, ...prev]);
    return { success: true, message: 'रेटिंग सफलतापूर्वक दर्ज की गई!' };
  };

  const hasRated = (jobId: string, reviewerId: string): boolean => {
    return ratings.some((r) => r.jobId === jobId && r.fromUserId === reviewerId);
  };

  const getRatingForJobAndUser = (jobId: string, reviewerId: string): Rating | undefined => {
    return ratings.find((r) => r.jobId === jobId && r.fromUserId === reviewerId);
  };

  // Reject Application
  const rejectApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'rejected' } : app))
    );
  };

  // Close Job
  const closeJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'completed' } : j))
    );
  };

  // Confirm payment by Worker (Two-sided verification)
  const confirmPaymentByWorker = (paymentId: string) => {
    setPaymentRecords((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          const isHirerConfirmed = p.hirerConfirmed ?? true;
          return {
            ...p,
            workerConfirmed: true,
            status: isHirerConfirmed ? 'verified' : 'pending',
            verifiedAt: isHirerConfirmed ? 'Today' : undefined,
          };
        }
        return p;
      })
    );
  };

  // Confirm payment by Hirer (Two-sided verification)
  const confirmPaymentByHirer = (paymentId: string) => {
    setPaymentRecords((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          const isWorkerConfirmed = Boolean(p.workerConfirmed);
          return {
            ...p,
            hirerConfirmed: true,
            status: isWorkerConfirmed ? 'verified' : 'pending',
            verifiedAt: isWorkerConfirmed ? 'Today' : undefined,
          };
        }
        return p;
      })
    );
  };

  // Report issue on payment
  const reportPaymentIssue = (paymentId: string, reason: string = 'Payment not received yet') => {
    setPaymentRecords((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              workerConfirmed: false,
              status: 'under_review',
              disputeReason: reason,
            }
          : p
      )
    );
  };

  // Calculate total recorded income from payment records
  const totalIncomeRecorded = paymentRecords.reduce((acc, curr) => acc + curr.amount, 0);

  // Rule-based match score for a job (from worker perspective)
  const calculateMatchScore = (job: Job): { score: number; reason: string } => {
    const worker = auth.workerProfile;
    const workerSkills = worker?.skills || ['Mason / राजमिस्त्री'];
    const workerCity = (selectedLocation || worker?.city || 'Ghaziabad').toLowerCase();
    const jobCity = job.location.city.toLowerCase();

    const isSkillMatch = workerSkills.some(
      (s) =>
        job.category.toLowerCase().includes(s.split('/')[0].trim().toLowerCase()) ||
        s.toLowerCase().includes(job.category.split('/')[0].trim().toLowerCase())
    );

    const isLocationMatch =
      jobCity.includes(workerCity) || workerCity.includes(jobCity);

    if (isSkillMatch && isLocationMatch) {
      return { score: 92, reason: 'Skill + location match' };
    } else if (isSkillMatch) {
      return { score: 78, reason: 'Skill match' };
    } else if (isLocationMatch) {
      return { score: 65, reason: 'Location match' };
    }
    return { score: 50, reason: 'Nearby trade' };
  };

  // Rule-based match score for a worker (from hirer perspective)
  const calculateWorkerMatchScore = (
    worker: Worker,
    targetSkill: string = 'Mason',
    targetCity: string = 'Ghaziabad'
  ): { score: number; reason: string } => {
    const isSkillMatch = worker.primarySkill.toLowerCase().includes(targetSkill.toLowerCase());
    const isLocationMatch = worker.city.toLowerCase().includes(targetCity.toLowerCase());
    const isHighRating = worker.rating >= 4.7;

    if (isSkillMatch && isLocationMatch && isHighRating) {
      return { score: 94, reason: 'Skill + location + rating match' };
    } else if (isSkillMatch && isLocationMatch) {
      return { score: 88, reason: 'Skill + location match' };
    } else if (isSkillMatch) {
      return { score: 76, reason: 'Skill match' };
    } else if (isLocationMatch) {
      return { score: 65, reason: 'Location match' };
    }
    return { score: 55, reason: 'Skilled worker' };
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        workers,
        applications,
        hires,
        ratings,
        paymentRecords,
        applyToJob,
        hasApplied,
        getApplicationForJob,
        getApplicationsForJob,
        postNewJob,
        hireWorkerForJob,
        startWork,
        completeWork,
        submitRating,
        hasRated,
        getRatingForJobAndUser,
        rejectApplication,
        closeJob,
        calculateMatchScore,
        calculateWorkerMatchScore,
        selectedLocation,
        setSelectedLocation,
        totalIncomeRecorded,
        confirmPaymentByWorker,
        confirmPaymentByHirer,
        reportPaymentIssue,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
