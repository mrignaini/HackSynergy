import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, Language, SkillCategory, WorkerGrade } from '../types';

export interface WorkerProfileData {
  fullName: string;
  phone: string;
  avatar: string;
  skills: SkillCategory[];
  experience: string;
  availability: 'now' | 'date' | 'working';
  availableDate?: string;
  city: string;
  locality: string;
  pincode?: string;
  dailyWageRate?: number;
  grade?: WorkerGrade;
}

export interface HirerProfileData {
  fullName: string;
  phone: string;
  hirerType: string;
  city: string;
  locality: string;
  companyName?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  mobile: string | null;
  role: UserRole | null;
  language: Language;
  workerProfile: WorkerProfileData | null;
  hirerProfile: HirerProfileData | null;
}

interface AuthContextType {
  auth: AuthState;
  loginWithMobile: (mobile: string) => void;
  verifyOtp: (otp: string) => boolean;
  setAuthLanguage: (lang: Language) => void;
  setAuthRole: (role: UserRole) => void;
  saveWorkerOnboarding: (data: WorkerProfileData) => void;
  saveHirerOnboarding: (data: HirerProfileData) => void;
  logout: () => void;
}

const DEMO_OTP = '123456';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('shramikk_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore fallback
      }
    }
    return {
      isAuthenticated: false,
      userId: null,
      mobile: null,
      role: null,
      language: 'hi',
      workerProfile: null,
      hirerProfile: null,
    };
  });

  useEffect(() => {
    localStorage.setItem('shramikk_auth', JSON.stringify(auth));
  }, [auth]);

  const loginWithMobile = (mobile: string) => {
    setAuth((prev) => ({
      ...prev,
      mobile,
    }));
  };

  const verifyOtp = (otp: string): boolean => {
    // Hackathon demo validation: accepts 123456 or any 6-digit number in demo mode
    if (otp === DEMO_OTP || (otp.length === 6 && /^\d+$/.test(otp))) {
      const generatedId = `USR-${Date.now().toString().slice(-6)}`;
      setAuth((prev) => ({
        ...prev,
        isAuthenticated: true,
        userId: prev.userId || generatedId,
      }));
      return true;
    }
    return false;
  };

  const setAuthLanguage = (lang: Language) => {
    setAuth((prev) => ({
      ...prev,
      language: lang,
    }));
  };

  const setAuthRole = (role: UserRole) => {
    setAuth((prev) => ({
      ...prev,
      role,
    }));
  };

  const saveWorkerOnboarding = (data: WorkerProfileData) => {
    setAuth((prev) => ({
      ...prev,
      role: 'worker',
      workerProfile: data,
    }));
  };

  const saveHirerOnboarding = (data: HirerProfileData) => {
    setAuth((prev) => ({
      ...prev,
      role: 'hirer',
      hirerProfile: data,
    }));
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      userId: null,
      mobile: null,
      role: null,
      language: 'hi',
      workerProfile: null,
      hirerProfile: null,
    });
    localStorage.removeItem('shramikk_auth');
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        loginWithMobile,
        verifyOtp,
        setAuthLanguage,
        setAuthRole,
        saveWorkerOnboarding,
        saveHirerOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
