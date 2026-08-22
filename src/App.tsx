import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { SafetyNetProvider } from './context/SafetyNetContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { FindWorkPage } from './pages/FindWorkPage';
import { HireWorkersPage } from './pages/HireWorkersPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { AiSaathiPage } from './pages/AiSaathiPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Worker Routes
import { WorkerDashboardPage } from './pages/worker/WorkerDashboardPage';
import { DigitalIdentityPage } from './pages/worker/DigitalIdentityPage';
import { FinancialHubPage } from './pages/worker/FinancialHubPage';
import { MyWorkPage } from './pages/worker/MyWorkPage';
import { WorkerProfilePage } from './pages/worker/WorkerProfilePage';
import { WorkerApplicationsPage } from './pages/worker/WorkerApplicationsPage';
import { WorkHistoryPage } from './pages/worker/WorkHistoryPage';

// Phase 7 — Safety Net
import { SafetyNetHomePage } from './pages/worker/SafetyNetHomePage';
import { AiSaathiChatPage } from './pages/worker/AiSaathiChatPage';
import { SchemesPage } from './pages/worker/SchemesPage';
import { InsurancePage } from './pages/worker/InsurancePage';
import { IncomeProtectionPage } from './pages/worker/IncomeProtectionPage';
import { MySupportPage } from './pages/worker/MySupportPage';

// Phase 8 — Digital Work Identity & Public Sharing
import { PublicWorkIdentityPage } from './pages/worker/PublicWorkIdentityPage';
import { HirerProfilePage } from './pages/hirer/HirerProfilePage';

// Hirer Routes
import { HirerDashboardPage } from './pages/hirer/HirerDashboardPage';
import { PostJobPage } from './pages/hirer/PostJobPage';
import { MyJobsPage } from './pages/hirer/MyJobsPage';
import { HirerPaymentsPage } from './pages/hirer/HirerPaymentsPage';

// Worker Payment
import { WorkerPaymentsPage } from './pages/worker/WorkerPaymentsPage';

// Payments & Escrow Hub
import { PaymentGatewayPage } from './pages/payment/PaymentGatewayPage';

// Admin
import { AdminPage } from './pages/admin/AdminPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <JobProvider>
        <SafetyNetProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
              {/* Main Top Navigation */}
              <Navbar />

              {/* Page Content */}
              <main className="flex-1">
                <Routes>
                  {/* Landing & Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/find-work" element={<FindWorkPage />} />
                  <Route path="/hire-workers" element={<HireWorkersPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/ai-saathi" element={<AiSaathiPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Top-Level Payments & Escrow Hub */}
                  <Route path="/payments" element={<PaymentGatewayPage />} />
                  <Route path="/payment" element={<PaymentGatewayPage />} />

                  {/* Public Digital Work Identity Routes */}
                  <Route path="/worker/:workerId/identity" element={<PublicWorkIdentityPage />} />
                  <Route path="/identity/:workerId" element={<PublicWorkIdentityPage />} />

                  {/* Worker Sub-Routes */}
                  <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
                  <Route path="/worker/profile" element={<WorkerProfilePage />} />
                  <Route path="/worker/digital-identity" element={<DigitalIdentityPage />} />
                  <Route path="/worker/financial-hub" element={<FinancialHubPage />} />
                  <Route path="/worker/my-work" element={<MyWorkPage />} />
                  <Route path="/worker/applications" element={<WorkerApplicationsPage />} />
                  <Route path="/worker/work-history" element={<WorkHistoryPage />} />
                  <Route path="/worker/safety-net" element={<SafetyNetHomePage />} />
                  <Route path="/worker/ai-saathi" element={<AiSaathiChatPage />} />
                  <Route path="/worker/schemes" element={<SchemesPage />} />
                  <Route path="/worker/insurance" element={<InsurancePage />} />
                  <Route path="/worker/income-protection" element={<IncomeProtectionPage />} />
                  <Route path="/worker/my-support" element={<MySupportPage />} />
                  <Route path="/worker/payments" element={<WorkerPaymentsPage />} />

                  {/* Hirer Sub-Routes */}
                  <Route path="/hirer/dashboard" element={<HirerDashboardPage />} />
                  <Route path="/hirer/profile" element={<HirerProfilePage />} />
                  <Route path="/hirer/post-job" element={<PostJobPage />} />
                  <Route path="/hirer/my-jobs" element={<MyJobsPage />} />
                  <Route path="/hirer/payments" element={<HirerPaymentsPage />} />

                  {/* Admin Portal */}
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </main>

              {/* Global Footer */}
              <Footer />
            </div>
          </Router>
        </SafetyNetProvider>
        </JobProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
