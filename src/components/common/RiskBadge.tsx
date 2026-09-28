import React from 'react';
import { RiskLevel, SensorStatus, AlertSeverity } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, showDot = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5',
  };

  const getStyles = () => {
    switch (level) {
      case 'Critical':
        return {
          bg: 'bg-rose-50 text-rose-700 border border-rose-200/80',
          dot: 'bg-rose-600',
        };
      case 'High':
        return {
          bg: 'bg-rose-50 text-rose-700 border border-rose-200/80',
          dot: 'bg-rose-600',
        };
      case 'Warning':
        return {
          bg: 'bg-amber-50 text-amber-800 border border-amber-200/80',
          dot: 'bg-amber-500',
        };
      case 'Low':
        return {
          bg: 'bg-sky-50 text-sky-700 border border-sky-200/80',
          dot: 'bg-sky-500',
        };
      case 'Normal':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
          dot: 'bg-emerald-600',
        };
    }
  };

  const styles = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium tracking-wide uppercase ${styles.bg} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${styles.dot} ${
            level === 'Critical' || level === 'High' ? 'animate-pulse' : ''
          }`}
          aria-hidden="true"
        />
      )}
      {level}
    </span>
  );
};

export const SensorStatusBadge: React.FC<{ status: SensorStatus }> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Online':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200/80';
      case 'Warning':
        return 'text-amber-800 bg-amber-50 border-amber-200/80';
      case 'Offline':
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getDot = () => {
    switch (status) {
      case 'Online':
        return 'bg-emerald-500';
      case 'Warning':
        return 'bg-amber-500 animate-pulse';
      case 'Offline':
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${getStyles()}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${getDot()}`} aria-hidden="true" />
      {status}
    </span>
  );
};

export const AlertSeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const getStyles = () => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'info':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'resolved':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${getStyles()}`}
    >
      {severity}
    </span>
  );
};

export const ConsumptionStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'Possible Leak':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
          Possible Leak
        </span>
      );
    case 'Anomaly':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Anomaly
        </span>
      );
    case 'High Consumption':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-800">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          High Consumption
        </span>
      );
    case 'Normal':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Normal
        </span>
      );
  }
};

