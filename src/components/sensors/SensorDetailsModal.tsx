import React from 'react';
import {
  Radio,
  Battery,
  Signal,
  Wrench,
  Clock,
  Gauge,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  User,
  ShieldAlert
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { SensorStatusBadge } from '../common/RiskBadge';
import { useWater } from '../../context/WaterContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const SensorDetailsModal: React.FC = () => {
  const { selectedSensor, setSelectedSensor, alerts } = useWater();

  if (!selectedSensor) return null;

  const sensorAlerts = alerts.filter(
    (a) =>
      a.sensorId === selectedSensor.id ||
      a.personOrUnit === selectedSensor.assignedUnit ||
      a.location.includes(selectedSensor.assignedUnit)
  );

  return (
    <Modal
      isOpen={!!selectedSensor}
      onClose={() => setSelectedSensor(null)}
      title={selectedSensor.name}
      subtitle={`Node ID: ${selectedSensor.id} · Assigned to: ${selectedSensor.assignedUnit} (${selectedSensor.assignedPerson})`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status header summary banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-cyan-600 shadow-2xs">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{selectedSensor.zone}</h4>
                <SensorStatusBadge status={selectedSensor.status} />
              </div>
              <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-slate-400" />
                {selectedSensor.locationName}
                <span>·</span>
                <Clock className="h-3 w-3 text-slate-400" />
                Updated {selectedSensor.lastUpdated}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Flow Rate</span>
            <div className="text-2xl font-extrabold text-slate-900">
              {selectedSensor.currentFlow} <span className="text-sm font-medium text-slate-500">L/min</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Baseline: {selectedSensor.baselineFlow} L/min
            </p>
          </div>
        </div>

        {/* Telemetry specs grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
          <div className="rounded-lg border border-slate-200 p-3 bg-white">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <User className="h-4 w-4 text-slate-400" />
              <span>Assigned Unit</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">{selectedSensor.assignedUnit}</div>
            <p className="text-[10px] text-slate-500 mt-1">{selectedSensor.assignedPerson}</p>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 bg-white">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Battery className="h-4 w-4 text-slate-400" />
              <span>Battery Level</span>
            </div>
            <div className="text-base font-bold text-slate-900">{selectedSensor.battery}%</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${
                  selectedSensor.battery > 50
                    ? 'bg-emerald-500'
                    : selectedSensor.battery > 20
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${selectedSensor.battery}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 bg-white">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Signal className="h-4 w-4 text-slate-400" />
              <span>LoRa Signal</span>
            </div>
            <div className="text-base font-bold text-slate-900">{selectedSensor.signalStrength}%</div>
            <p className="text-[10px] text-emerald-700 mt-1">Mesh carrier active</p>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 bg-white">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Gauge className="h-4 w-4 text-slate-400" />
              <span>Pipe Spec</span>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">{selectedSensor.pipeDiameter}</div>
            <p className="text-[10px] text-slate-500 mt-1">Ultrasonic transit</p>
          </div>
        </div>

        {/* Historical Readings Chart */}
        <div className="rounded-xl border border-slate-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Flow Rate vs Baseline Profile
              </h5>
              <p className="text-[11px] text-slate-500">Live telemetry samples over recent cycles</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
                <span className="text-slate-600 font-medium">Flow (L/min)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="text-slate-500">Baseline</span>
              </div>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedSensor.readingsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sensorFlowGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value} L/min`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="baseline" stroke="#94a3b8" strokeDasharray="4 4" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="flow" stroke="#0891b2" fill="url(#sensorFlowGrad2)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Associated Alerts */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Node Alert History
          </h5>
          {sensorAlerts.length === 0 ? (
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-center text-xs text-slate-500">
              <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500 mb-1" />
              No active or historical anomalies reported for this sensor node.
            </div>
          ) : (
            sensorAlerts.map((alt) => (
              <div
                key={alt.id}
                className="flex items-start justify-between rounded-lg border border-slate-200 p-3 bg-white text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{alt.title}</span>
                    <span className="text-[10px] text-slate-400">{alt.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-slate-600">{alt.description}</p>
                </div>
                <span className="rounded bg-rose-50 px-2 py-0.5 font-bold text-rose-700">
                  +{alt.percentageAboveBaseline}% delta
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
