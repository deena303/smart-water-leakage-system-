import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplets,
  Users,
  ShieldAlert,
  Radio,
  Bell,
  Building2,
  FileBarChart,
  Settings,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { kpiStats, terms, currentProperty } = useWater();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Consumption', path: '/consumption', icon: Droplets },
    {
      name: `${terms.personPlural} / ${terms.unitPlural}`,
      path: '/people-units',
      icon: Users,
    },
    {
      name: 'Leak Detection',
      path: '/leak-detection',
      icon: ShieldAlert,
      badge: kpiStats.criticalCount > 0 ? 'Active' : undefined,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    { name: 'Sensors', path: '/sensors', icon: Radio },
    {
      name: 'Alerts',
      path: '/alerts',
      icon: Bell,
      badgeCount: kpiStats.activeAlertsCount,
    },
    { name: 'Locations', path: '/locations', icon: Building2 },
    { name: 'Reports', path: '/reports', icon: FileBarChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo and Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <NavLink to="/" className="flex items-center gap-2.5 group" onClick={onCloseMobile}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-blue-700 text-white shadow-sm shadow-cyan-600/30 group-hover:scale-105 transition-transform">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  AquaGuard
                </span>
                <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200/60">
                  AI
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-tight">Water Intelligence Platform</p>
            </div>
          </NavLink>

          <button
            onClick={onCloseMobile}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Platform
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-700'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950'
                          : item.badgeCount > 1
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}

                  {item.badge && (
                    <span
                      className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom System Status Widget */}
        <div className="border-t border-slate-100 p-3.5">
          <div
            className={`rounded-xl border p-3 ${
              kpiStats.isSystemHealthy
                ? 'border-emerald-200 bg-emerald-50/50'
                : 'border-rose-200 bg-rose-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">System Status</span>
              {kpiStats.isSystemHealthy ? (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              ) : (
                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              {kpiStats.isSystemHealthy ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              )}
              <span
                className={`text-xs font-bold ${
                  kpiStats.isSystemHealthy ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                {kpiStats.isSystemHealthy
                  ? 'System Operational'
                  : `${kpiStats.activeAlertsCount} active alert${
                      kpiStats.activeAlertsCount > 1 ? 's' : ''
                    } flagged`}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {kpiStats.isSystemHealthy
                ? 'Telemetry baseline synced'
                : 'Immediate inspection advised'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
