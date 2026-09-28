import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Building,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Building2,
  Home
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    kpiStats,
    alerts,
    settings,
    searchQuery,
    setSearchQuery,
    properties,
    currentProperty,
    selectProperty,
    terms
  } = useWater();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPropertyMenu, setShowPropertyMenu] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const propertyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (propertyRef.current && !propertyRef.current.contains(e.target as Node)) {
        setShowPropertyMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/consumption':
        return 'Consumption Analytics';
      case '/people-units':
        return `${terms.personPlural} & ${terms.unitPlural}`;
      case '/leak-detection':
        return 'Leak Detection';
      case '/sensors':
        return 'Sensors';
      case '/alerts':
        return 'Alerts';
      case '/locations':
        return 'Locations';
      case '/reports':
        return 'Reports';
      case '/settings':
        return 'Settings';
      default:
        return 'AquaGuard AI';
    }
  };

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-slate-900 sm:text-lg">
            {getPageTitle()}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500">
            {terms.adminRole} · {currentProperty.name}
          </p>
        </div>
      </div>

      {/* Middle: Property Selector Dropdown */}
      <div className="relative" ref={propertyRef}>
        <button
          onClick={() => setShowPropertyMenu(!showPropertyMenu)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
          title="Switch Active Property"
        >
          <Building2 className="h-4 w-4 text-cyan-600" />
          <span className="font-bold text-slate-900 max-w-[140px] sm:max-w-none truncate">
            {currentProperty.name}
          </span>
          <span className="hidden md:inline-block rounded bg-cyan-100/70 px-1.5 py-0.2 text-[10px] font-bold text-cyan-800 uppercase">
            {currentProperty.type}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {showPropertyMenu && (
          <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
            <div className="px-3 py-1.5 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Monitored Property
              </span>
            </div>
            <div className="py-1">
              {properties.map((prop) => (
                <button
                  key={prop.id}
                  onClick={() => {
                    selectProperty(prop.id);
                    setShowPropertyMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                    currentProperty.id === prop.id
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="font-semibold leading-tight">{prop.name}</p>
                    <p className={`text-[10px] ${currentProperty.id === prop.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {prop.address}
                    </p>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      currentProperty.id === prop.id
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {prop.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System Health Badge */}
        <div
          className={`hidden lg:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
            kpiStats.isSystemHealthy
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              kpiStats.isSystemHealthy ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
            }`}
          />
          <span className="font-semibold">
            {kpiStats.isSystemHealthy ? 'System Operational' : `${kpiStats.activeAlertsCount} Alerts Active`}
          </span>
        </div>

        {/* Notifications Icon & Drawer */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-600"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {kpiStats.activeAlertsCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {kpiStats.activeAlertsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <span className="text-xs font-bold text-slate-900">Active Anomaly Alerts</span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {kpiStats.activeAlertsCount} active
                </span>
              </div>

              <div className="mt-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {activeAlerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-500 mb-1" />
                    No active alerts. All water zones nominal.
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/leak-detection');
                      }}
                      className="cursor-pointer py-2.5 px-2 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {alert.severity === 'critical' ? (
                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                          )}
                          <span className="text-xs font-bold text-slate-900">{alert.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{alert.detectedAt}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                        {alert.description}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-cyan-600 font-semibold">
                        <span>{alert.location}</span>
                        <span className="inline-flex items-center gap-0.5 hover:underline">
                          Investigate <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/alerts');
                  }}
                  className="text-xs font-semibold text-cyan-600 hover:text-cyan-800"
                >
                  View All Alerts Center →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-lg border border-slate-200/90 bg-slate-50/70 p-1.5 pl-2 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">
              AD
            </div>
            <div className="hidden xl:block text-left text-xs pr-1">
              <p className="font-semibold text-slate-900 leading-tight">Admin Console</p>
              <p className="text-[10px] text-slate-500">{terms.adminRole}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Administrator</p>
                <p className="text-[11px] text-slate-500">Role: {terms.adminRole}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-md font-medium"
                >
                  Property Configuration
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/reports');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-md font-medium"
                >
                  Audit Reports
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
