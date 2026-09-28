import React, { useState } from 'react';
import {
  Sliders,
  Bell,
  Building,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Radio,
  SlidersHorizontal,
  Mail,
  Volume2,
  Gauge
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { PropertyType } from '../types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, currentProperty, terms } = useWater();
  const [form, setForm] = useState({ ...settings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  const propertyTypeOptions: { value: PropertyType; label: string; desc: string }[] = [
    { value: 'HOSTEL', label: 'Hostel', desc: 'Students, Rooms, Blocks, Warden' },
    { value: 'APARTMENT', label: 'Apartment', desc: 'Residents, Flats, Blocks, Apartment In-charge' },
    { value: 'HOUSE', label: 'House', desc: 'Family Members, Rooms, Areas, House Owner' },
    { value: 'HOTEL', label: 'Hotel', desc: 'Guests, Rooms, Floors, Hotel Manager' },
    { value: 'HOSPITAL', label: 'Hospital', desc: 'Departments, Wards, Wings, Facility Manager' },
    { value: 'SCHOOL', label: 'School / College', desc: 'Classrooms, Labs, Academic Blocks, Administrator' },
    { value: 'FACTORY', label: 'Factory / Industrial', desc: 'Production Zones, Lines, Plants, Operations Director' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            System & Property Settings
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure monitoring thresholds, alert notifications, and multi-domain terminology.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700 active:scale-98 transition-all shadow-xs"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Property Settings */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Building className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">1. Property Settings</h3>
              <p className="text-xs text-slate-500">
                Property identification, address, and domain archetype
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Property Name
              </label>
              <input
                type="text"
                value={form.propertyName}
                onChange={(e) => setForm({ ...form, propertyName: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:border-cyan-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Property Type (Adapts UI Terminology)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2">
                {propertyTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, propertyType: opt.value })}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      form.propertyType === opt.value
                        ? 'border-cyan-600 bg-cyan-50/70 text-cyan-950 ring-1 ring-cyan-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-extrabold text-xs">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Monitoring Settings */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">2. Monitoring & Algorithmic Settings</h3>
              <p className="text-xs text-slate-500">
                Baseline calculation window, anomaly threshold, and sensitivity
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leak sensitivity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Leak Sensitivity
                </label>
                <span className="rounded bg-cyan-50 px-2 py-0.5 text-xs font-extrabold text-cyan-800 border border-cyan-200">
                  Level {form.leakSensitivity} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={form.leakSensitivity}
                onChange={(e) => setForm({ ...form, leakSensitivity: Number(e.target.value) })}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Higher sensitivity detects micro-leaks rapidly with shorter sampling durations.
              </p>
            </div>

            {/* Baseline Calculation Period */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Baseline Calculation Period
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['7d', '14d', '30d'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setForm({ ...form, baselineCalculationPeriod: period })}
                    className={`rounded-lg py-2 text-xs font-semibold border transition-all ${
                      form.baselineCalculationPeriod === period
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {period === '7d' ? '7 Days' : period === '14d' ? '14 Days' : '30 Days'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Rolling historical timeframe used to build normal expected consumption curves.
              </p>
            </div>

            {/* Anomaly threshold */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Anomaly Threshold
                </label>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-800">
                  +{form.anomalyThresholdPercent}% above baseline
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                step="5"
                value={form.anomalyThresholdPercent}
                onChange={(e) => setForm({ ...form, anomalyThresholdPercent: Number(e.target.value) })}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Variance percentage required to flag an anomaly alert without calling it a leak.
              </p>
            </div>

            {/* Measurement Units */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Telemetry Measurement Units
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Litres', 'Litres/minute'] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setForm({ ...form, measurementUnit: unit })}
                    className={`rounded-lg py-2 text-xs font-semibold border transition-all ${
                      form.measurementUnit === unit
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Standard units applied to consumption summaries and instantaneous telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Alert Settings */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">3. Alert & Notification Routing</h3>
              <p className="text-xs text-slate-500">
                Dispatches to on-duty administrator and maintenance staff
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Critical Alerts</span>
                <span className="text-[11px] text-slate-500">Instant notification for continuous flow leaks (&gt;80% confidence)</span>
              </div>
              <input
                type="checkbox"
                checked={form.enableCriticalAlerts}
                onChange={(e) => setForm({ ...form, enableCriticalAlerts: e.target.checked })}
                className="h-4 w-4 rounded accent-cyan-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Warning Alerts</span>
                <span className="text-[11px] text-slate-500">Notifies of unusual consumption departures (&gt;50% variance)</span>
              </div>
              <input
                type="checkbox"
                checked={form.enableWarningAlerts}
                onChange={(e) => setForm({ ...form, enableWarningAlerts: e.target.checked })}
                className="h-4 w-4 rounded accent-cyan-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Email Notifications</span>
                <span className="text-[11px] text-slate-500">Send immediate incident summaries to property administrator</span>
              </div>
              <input
                type="checkbox"
                checked={form.enableEmailNotifications}
                onChange={(e) => setForm({ ...form, enableEmailNotifications: e.target.checked })}
                className="h-4 w-4 rounded accent-cyan-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">In-App Dashboard Alerts</span>
                <span className="text-[11px] text-slate-500">Render floating incident priority banners on the Dashboard</span>
              </div>
              <input
                type="checkbox"
                checked={form.enableDashboardNotifications}
                onChange={(e) => setForm({ ...form, enableDashboardNotifications: e.target.checked })}
                className="h-4 w-4 rounded accent-cyan-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-cyan-700 active:scale-98 transition-all shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
