import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { Toast } from '../common/Toast';
import { SensorDetailsModal } from '../sensors/SensorDetailsModal';
import { UnitDetailModal } from '../units/UnitDetailModal';

export const AppShell: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Sidebar for desktop & mobile */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main layout container */}
      <div className="flex flex-1 flex-col lg:pl-64 transition-all duration-200">
        <TopHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <Toast />
      <SensorDetailsModal />
      <UnitDetailModal />
    </div>
  );
};
