import React, { createContext, useContext, useState, useEffect } from 'react';
import type { VerifiedScheme, InsuranceOption } from '../data/safetyNetData';

export interface SafetyNetNotification {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  type: 'scheme_match' | 'work_activity' | 'protection' | 'general';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

interface SafetyNetState {
  safetyNetEnabled: boolean;
  savedSchemeIds: string[];
  savedInsuranceIds: string[];
  aiHistory: Array<{ role: 'user' | 'ai'; text: string; timestamp: string }>;
  notifications: SafetyNetNotification[];
}

interface SafetyNetContextType {
  state: SafetyNetState;
  toggleSafetyNet: () => void;
  saveScheme: (id: string) => void;
  unsaveScheme: (id: string) => void;
  isSchemeSaved: (id: string) => boolean;
  saveInsurance: (id: string) => void;
  unsaveInsurance: (id: string) => void;
  isInsuranceSaved: (id: string) => boolean;
  addAiMessage: (role: 'user' | 'ai', text: string) => void;
  clearAiHistory: () => void;
  addNotification: (n: Omit<SafetyNetNotification, 'id' | 'isRead' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  getUnreadCount: () => number;
}

const SafetyNetContext = createContext<SafetyNetContextType | undefined>(undefined);

const defaultNotifications: SafetyNetNotification[] = [
  {
    id: 'notif-seed-1',
    title: 'New scheme match',
    titleHi: 'नई योजना मिलान',
    message: 'Based on your worker profile, you may be eligible for e-Shram Card Registration.',
    messageHi: 'आपके कामगार प्रोफ़ाइल के आधार पर, ई-श्रम कार्ड पंजीकरण के लिए आप पात्र हो सकते हैं।',
    type: 'scheme_match',
    isRead: false,
    timestamp: new Date().toLocaleDateString('en-GB'),
    actionUrl: '/worker/schemes?id=scheme-001',
  },
  {
    id: 'notif-seed-2',
    title: 'New protection option available',
    titleHi: 'नया सुरक्षा विकल्प उपलब्ध',
    message: 'PM Suraksha Bima Yojana offers ₹2 lakh accidental cover at just ₹20/year.',
    messageHi: 'PM सुरक्षा बीमा योजना मात्र ₹20/वर्ष पर ₹2 लाख दुर्घटना कवर देती है।',
    type: 'protection',
    isRead: false,
    timestamp: new Date().toLocaleDateString('en-GB'),
    actionUrl: '/worker/insurance?id=ins-001',
  },
];

export const SafetyNetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SafetyNetState>(() => {
    const saved = localStorage.getItem('shramikk_safetynet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure notifications array exists (backward compat)
        if (!parsed.notifications) parsed.notifications = defaultNotifications;
        return parsed;
      } catch { /* fallback */ }
    }
    return {
      safetyNetEnabled: false,
      savedSchemeIds: [],
      savedInsuranceIds: [],
      aiHistory: [],
      notifications: defaultNotifications,
    };
  });

  useEffect(() => {
    localStorage.setItem('shramikk_safetynet', JSON.stringify(state));
  }, [state]);

  const toggleSafetyNet = () => {
    setState((prev) => ({ ...prev, safetyNetEnabled: !prev.safetyNetEnabled }));
  };

  const saveScheme = (id: string) => {
    setState((prev) => ({
      ...prev,
      savedSchemeIds: prev.savedSchemeIds.includes(id) ? prev.savedSchemeIds : [...prev.savedSchemeIds, id],
    }));
  };

  const unsaveScheme = (id: string) => {
    setState((prev) => ({
      ...prev,
      savedSchemeIds: prev.savedSchemeIds.filter((s) => s !== id),
    }));
  };

  const isSchemeSaved = (id: string) => state.savedSchemeIds.includes(id);

  const saveInsurance = (id: string) => {
    setState((prev) => ({
      ...prev,
      savedInsuranceIds: prev.savedInsuranceIds.includes(id) ? prev.savedInsuranceIds : [...prev.savedInsuranceIds, id],
    }));
  };

  const unsaveInsurance = (id: string) => {
    setState((prev) => ({
      ...prev,
      savedInsuranceIds: prev.savedInsuranceIds.filter((s) => s !== id),
    }));
  };

  const isInsuranceSaved = (id: string) => state.savedInsuranceIds.includes(id);

  const addAiMessage = (role: 'user' | 'ai', text: string) => {
    setState((prev) => ({
      ...prev,
      aiHistory: [...prev.aiHistory, { role, text, timestamp: new Date().toLocaleTimeString('hi-IN') }],
    }));
  };

  const clearAiHistory = () => {
    setState((prev) => ({ ...prev, aiHistory: [] }));
  };

  const addNotification = (n: Omit<SafetyNetNotification, 'id' | 'isRead' | 'timestamp'>) => {
    const newNotif: SafetyNetNotification = {
      ...n,
      id: `notif-${Date.now().toString().slice(-6)}`,
      isRead: false,
      timestamp: new Date().toLocaleDateString('en-GB'),
    };
    setState((prev) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications],
    }));
  };

  const dismissNotification = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  };

  const markNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
    }));
  };

  const getUnreadCount = () => state.notifications.filter((n) => !n.isRead).length;

  return (
    <SafetyNetContext.Provider
      value={{
        state,
        toggleSafetyNet,
        saveScheme,
        unsaveScheme,
        isSchemeSaved,
        saveInsurance,
        unsaveInsurance,
        isInsuranceSaved,
        addAiMessage,
        clearAiHistory,
        addNotification,
        dismissNotification,
        markNotificationRead,
        getUnreadCount,
      }}
    >
      {children}
    </SafetyNetContext.Provider>
  );
};

export const useSafetyNet = () => {
  const ctx = useContext(SafetyNetContext);
  if (!ctx) throw new Error('useSafetyNet must be used within SafetyNetProvider');
  return ctx;
};

