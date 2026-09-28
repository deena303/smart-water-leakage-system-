import React from 'react';
import { Sensor } from '../../types';
import { SensorStatusBadge } from '../common/RiskBadge';
import { Battery, Clock, Droplets, ChevronRight, MapPin } from 'lucide-react';
import { useWater } from '../../context/WaterContext';

interface SensorCardProps {
  sensor: Sensor;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const { setSelectedSensor } = useWater();

  const isAnomaly = sensor.currentFlow > sensor.baselineFlow * 1.35;

  return (
    <div
      onClick={() => setSelectedSensor(sensor)}
      className={`group cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isAnomaly
          ? 'border-rose-300 bg-rose-50/20'
          : 'border-slate-200/80 bg-white shadow-2xs'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
            {sensor.name}
          </h4>
          <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            {sensor.locationName}
          </p>
        </div>
        <SensorStatusBadge status={sensor.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-y border-slate-100 py-3 text-xs">
        <div>
          <span className="text-[11px] text-slate-500 font-medium">Flow Rate</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span
              className={`text-lg font-extrabold ${
                isAnomaly ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {sensor.currentFlow}
            </span>
            <span className="text-[11px] text-slate-500">L/min</span>
          </div>
          <span className="text-[10px] text-slate-400">Baseline: {sensor.baselineFlow} L/min</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 font-medium">Battery</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Battery
              className={`h-4 w-4 ${
                sensor.battery < 25
                  ? 'text-rose-500'
                  : sensor.battery < 70
                  ? 'text-amber-500'
                  : 'text-emerald-600'
              }`}
            />
            <span className="text-base font-bold text-slate-900">{sensor.battery}%</span>
          </div>
          <span className="text-[10px] text-slate-400">{sensor.pipeDiameter}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-[11px]">
          <Clock className="h-3 w-3 text-slate-400" />
          {sensor.lastUpdated}
        </span>
        <span className="font-semibold text-cyan-600 group-hover:text-cyan-700 inline-flex items-center gap-0.5">
          Details <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
};
