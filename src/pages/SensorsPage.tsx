import React, { useState } from 'react';
import {
  Radio,
  Search,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Filter,
  LayoutGrid,
  List,
  Battery,
  Clock,
  ArrowRight,
  Droplet,
  User,
  MapPin
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { SensorCard } from '../components/sensors/SensorCard';
import { SensorStatusBadge } from '../components/common/RiskBadge';
import { SensorStatus } from '../types';

export const SensorsPage: React.FC = () => {
  const { sensors, setSelectedSensor, searchQuery, setSearchQuery, terms, currentProperty } = useWater();
  const [statusFilter, setStatusFilter] = useState<'All' | SensorStatus>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const totalCount = sensors.length;
  const onlineCount = sensors.filter((s) => s.status === 'Online').length;
  const warningCount = sensors.filter((s) => s.status === 'Warning').length;
  const offlineCount = sensors.filter((s) => s.status === 'Offline').length;

  const filteredSensors = sensors.filter((s) => {
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignedUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.assignedPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Sensor Monitoring
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Distributed ultrasonic flow meter mesh deployed across {currentProperty.name}.
          </p>
        </div>

        {/* View toggle */}
        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Table View</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1 rounded-md px-3 py-1.5 font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* Sensor Health Status Cards (24 Total, 22 Online, 1 Warning, 1 Offline) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('All')}
          className={`rounded-xl border p-4 text-left transition-all ${
            statusFilter === 'All'
              ? 'border-slate-900 bg-slate-900 text-white shadow-md'
              : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              Total Sensors
            </span>
            <Radio className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">24</div>
          <p className="text-[11px] opacity-75 mt-1">100% telemetry coverage</p>
        </button>

        <button
          onClick={() => setStatusFilter('Online')}
          className={`rounded-xl border p-4 text-left transition-all ${
            statusFilter === 'Online'
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
              : 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Online
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-2">22</div>
          <p className="text-[11px] text-emerald-800 mt-1">Active sync & nominal</p>
        </button>

        <button
          onClick={() => setStatusFilter('Warning')}
          className={`rounded-xl border p-4 text-left transition-all ${
            statusFilter === 'Warning'
              ? 'border-amber-600 bg-amber-600 text-white shadow-md'
              : 'border-amber-200 bg-amber-50/40 hover:bg-amber-50 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Warning
            </span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-2">1</div>
          <p className="text-[11px] text-amber-800 mt-1">Flow delta flagged</p>
        </button>

        <button
          onClick={() => setStatusFilter('Offline')}
          className={`rounded-xl border p-4 text-left transition-all ${
            statusFilter === 'Offline'
              ? 'border-slate-700 bg-slate-700 text-white shadow-md'
              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Offline
            </span>
            <WifiOff className="h-4 w-4 text-slate-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">1</div>
          <p className="text-[11px] text-slate-500 mt-1">Maintenance required</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sensor name, assigned unit, location..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-500 mr-1">Status:</span>
          {(['All', 'Online', 'Warning', 'Offline'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor List Table / Grid */}
      {filteredSensors.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <Radio className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <h4 className="text-sm font-bold text-slate-900">No sensors match your filter</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting the search query or status filter</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Sensor Name</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Assigned Unit</th>
                  <th className="py-3.5 px-4">Current Flow</th>
                  <th className="py-3.5 px-4">Battery</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSensors.map((sensor) => (
                  <tr
                    key={sensor.id}
                    onClick={() => setSelectedSensor(sensor)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {sensor.name}
                      <span className="block text-[10px] text-slate-400 font-mono">{sensor.id}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {sensor.locationName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-slate-800">{sensor.assignedUnit}</span>
                      <span className="block text-[11px] text-slate-400">{sensor.assignedPerson}</span>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {sensor.currentFlow} L/min
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Battery
                          className={`h-4 w-4 ${
                            sensor.battery < 25
                              ? 'text-rose-500'
                              : sensor.battery < 70
                              ? 'text-amber-500'
                              : 'text-emerald-600'
                          }`}
                        />
                        <span className="font-medium">{sensor.battery}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <SensorStatusBadge status={sensor.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {sensor.lastUpdated}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSensor(sensor);
                        }}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-cyan-700 hover:bg-slate-50 shadow-2xs transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      )}
    </div>
  );
};
