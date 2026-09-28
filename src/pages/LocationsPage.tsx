import React, { useState } from 'react';
import {
  Building2,
  AlertCircle,
  Radio,
  Droplets,
  TrendingUp,
  TrendingDown,
  Layers,
  ChevronRight,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { LocationZone } from '../types';
import { Modal } from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const LocationsPage: React.FC = () => {
  const { locations, sensors, alerts, unitPeople, setSelectedUnit, currentProperty, terms } = useWater();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<LocationZone | null>(null);

  const totalFacilityConsumption = locations.reduce((sum, l) => sum + l.dailyConsumption, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Property Hierarchy & Locations
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Zone isolation, submeter telemetry, and risk evaluation across {currentProperty.name}.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-xs text-slate-600 shadow-2xs">
          <Droplets className="h-4 w-4 text-cyan-600" />
          <span>Combined Total: <strong>{totalFacilityConsumption.toLocaleString()} L/day</strong></span>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {locations.map((loc) => {
          const hasActiveAlerts = loc.activeAlerts > 0;
          const locUnits = unitPeople.filter((u) => u.locationId === loc.id);
          const highestInLoc = locUnits.sort((a, b) => b.todayUsage - a.todayUsage)[0];

          return (
            <div
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`group cursor-pointer rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                loc.riskStatus === 'Critical' || loc.riskStatus === 'High'
                  ? 'border-rose-300 bg-rose-50/15'
                  : 'border-slate-200/80 bg-white shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {loc.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">{currentProperty.name}</span>
                </div>
                <RiskBadge level={loc.riskStatus} />
              </div>

              {/* Metrics Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Consumption</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-black text-slate-900">
                      {loc.dailyConsumption.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500">L today</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px]">
                    {loc.trend > 0 ? (
                      <span className="text-rose-600 font-bold flex items-center">
                        <TrendingUp className="h-3 w-3" /> +{loc.trend}%
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center">
                        <TrendingDown className="h-3 w-3" /> {loc.trend}%
                      </span>
                    )}
                    <span className="text-slate-400">vs target ({loc.baselineDaily} L)</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Sensors & Alerts</span>
                  <div className="mt-1 space-y-1">
                    <p className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Radio className="h-3.5 w-3.5 text-slate-400" />
                      <span>{loc.totalSensors} sensors</span>
                    </p>
                    <p
                      className={`flex items-center gap-1.5 font-bold ${
                        hasActiveAlerts ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {hasActiveAlerts ? (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>{loc.activeAlerts} active alert</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>0 active alerts</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Highest consumer note if available */}
              {highestInLoc && (
                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Top consumer: <strong>{highestInLoc.unitNumber}</strong></span>
                  <span className="font-extrabold text-slate-800">{highestInLoc.todayUsage} L</span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Flow rate: <strong>{loc.currentFlowRate} L/min</strong>
                </span>
                <span className="font-bold text-cyan-700 group-hover:text-cyan-800 inline-flex items-center gap-0.5">
                  Inspect Location <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOCATION DETAIL MODAL */}
      {selectedLocation && (
        <Modal
          isOpen={!!selectedLocation}
          onClose={() => setSelectedLocation(null)}
          title={selectedLocation.name}
          subtitle={`Location Hierarchy Detail · ${currentProperty.name}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Location Risk Profile</span>
                <div className="mt-1 flex items-center gap-2">
                  <RiskBadge level={selectedLocation.riskStatus} size="lg" />
                  <span className="text-slate-600 font-medium">
                    {selectedLocation.activeAlerts > 0
                      ? `${selectedLocation.activeAlerts} active anomalies logged`
                      : 'All sensors and flow lines operating normally'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Daily Volume</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedLocation.dailyConsumption} L
                </p>
                <span className="text-slate-500">Average: {selectedLocation.baselineDaily} L</span>
              </div>
            </div>

            {/* Top Consumers in this location */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Top {terms.unitPlural} in {selectedLocation.name}
              </h4>
              <div className="space-y-2">
                {unitPeople
                  .filter((u) => u.locationId === selectedLocation.id)
                  .map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedLocation(null);
                        setSelectedUnit(u);
                      }}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-extrabold text-slate-900">{u.unitNumber}</span>
                        <span className="text-slate-500 ml-2">({u.name})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">{u.todayUsage} L</span>
                        <span className={`font-semibold ${u.differencePercentage > 20 ? 'text-rose-600' : 'text-slate-500'}`}>
                          {u.differencePercentage > 0 ? `+${u.differencePercentage}%` : `${u.differencePercentage}%`}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Connected sensors */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Connected Sensors ({selectedLocation.totalSensors})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {sensors
                  .filter((s) => s.locationId === selectedLocation.id)
                  .slice(0, 4)
                  .map((sens) => (
                    <div key={sens.id} className="rounded-lg border border-slate-200 p-2.5 bg-white">
                      <span className="font-bold text-slate-900 block truncate">{sens.name}</span>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                        <span>{sens.assignedUnit}</span>
                        <span className="font-bold text-slate-800">{sens.currentFlow} L/m</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {selectedLocation.activeAlerts > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocation(null);
                    navigate('/leak-detection');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs"
                >
                  <span>Open Anomaly in Leak Detection</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
