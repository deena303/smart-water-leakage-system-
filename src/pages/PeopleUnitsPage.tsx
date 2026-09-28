import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Droplet,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  MapPin
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { ConsumptionStatusBadge } from '../components/common/RiskBadge';
import { UnitPerson, ConsumptionStatus } from '../types';

export const PeopleUnitsPage: React.FC = () => {
  const { unitPeople, setSelectedUnit, terms, currentProperty, searchQuery, setSearchQuery } = useWater();
  const [statusFilter, setStatusFilter] = useState<'All' | ConsumptionStatus>('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('All');

  const locations = Array.from(new Set(unitPeople.map((u) => u.locationName)));

  const filteredUnits = unitPeople.filter((unit) => {
    const matchesStatus = statusFilter === 'All' || unit.status === statusFilter;
    const matchesLocation = selectedLocationFilter === 'All' || unit.locationName === selectedLocationFilter;
    const matchesSearch =
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesLocation && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {terms.personPlural} & {terms.unitPlural}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor granular water consumption across individual {terms.unitPlural.toLowerCase()} and assigned {terms.personPlural.toLowerCase()} in {currentProperty.name}.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-600 shadow-2xs">
          <Users className="h-4 w-4 text-cyan-600" />
          <span>Tracking <strong>{unitPeople.length} {terms.unitPlural}</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search by ${terms.personLabel.toLowerCase()}, ${terms.unitLabel.toLowerCase()} or location...`}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto text-xs">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {(['All', 'Possible Leak', 'Anomaly', 'High Consumption', 'Normal'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Location filter select */}
          <select
            value={selectedLocationFilter}
            onChange={(e) => setSelectedLocationFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-700 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Distinction explanation banner */}
      <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-600 text-white text-[10px] font-bold">
            i
          </span>
          <span>
            <strong>AI Anomaly Rule:</strong> AquaGuard AI distinguishes between <strong>High Consumption</strong> (peer-relative volume), <strong>Anomaly</strong> (departure from personal baseline), and <strong>Possible Leak</strong> (continuous nocturnal flow).
          </span>
        </div>
      </div>

      {/* People / Units Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">{terms.unitLabel}</th>
                <th className="py-3.5 px-4">{terms.personLabel}</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Today's Usage</th>
                <th className="py-3.5 px-4">Normal Baseline</th>
                <th className="py-3.5 px-4">Difference</th>
                <th className="py-3.5 px-4">Status & Category</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No {terms.unitPlural.toLowerCase()} match your current filter.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedUnit(item)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {item.unitNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {item.locationName}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {item.todayUsage} L
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {item.averageUsage} L/day
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-extrabold ${
                          item.differencePercentage > 50
                            ? 'text-rose-600'
                            : item.differencePercentage > 10
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {item.differencePercentage > 0
                          ? `+${item.differencePercentage}%`
                          : `${item.differencePercentage}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <ConsumptionStatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUnit(item);
                        }}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-cyan-700 hover:bg-slate-50 shadow-2xs transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Profile</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
