import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { StatisticsSection } from '../components/landing/StatisticsSection';
import { WorkerDashboardPreview } from '../components/worker/WorkerDashboardPreview';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-10">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Key Metrics Statistics Strip */}
      <StatisticsSection />

      {/* 3. Worker Dashboard Live Preview */}
      <WorkerDashboardPreview />
    </div>
  );
};
