import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WaterProvider } from './context/WaterContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ConsumptionPage } from './pages/ConsumptionPage';
import { PeopleUnitsPage } from './pages/PeopleUnitsPage';
import { LeakDetectionPage } from './pages/LeakDetectionPage';
import { SensorsPage } from './pages/SensorsPage';
import { AlertsPage } from './pages/AlertsPage';
import { LocationsPage } from './pages/LocationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <WaterProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="consumption" element={<ConsumptionPage />} />
            <Route path="people-units" element={<PeopleUnitsPage />} />
            <Route path="leak-detection" element={<LeakDetectionPage />} />
            <Route path="sensors" element={<SensorsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WaterProvider>
  );
}
