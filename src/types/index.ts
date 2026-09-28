export type RiskLevel = 'Normal' | 'Low' | 'Warning' | 'High' | 'Critical';

export type SensorStatus = 'Online' | 'Warning' | 'Offline';

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'resolved';

export type ConsumptionStatus = 'Normal' | 'High Consumption' | 'Anomaly' | 'Possible Leak';

export type PropertyType = 
  | 'HOSTEL'
  | 'APARTMENT'
  | 'HOUSE'
  | 'HOTEL'
  | 'HOSPITAL'
  | 'SCHOOL'
  | 'FACTORY';

export interface PropertyTerms {
  unitLabel: string; // e.g. "Room", "Flat", "Area", "Ward", "Production Zone"
  personLabel: string; // e.g. "Student", "Resident", "Family Member", "Guest", "Department"
  locationLabel: string; // e.g. "Block", "Building", "Floor"
  adminRole: string; // e.g. "Hostel Warden", "Apartment In-charge", "House Owner", "Facility Manager"
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  address: string;
  totalLocations: number;
  totalUnits: number;
  totalSensors: number;
}

export interface LocationZone {
  id: string;
  propertyId: string;
  name: string;
  totalSensors: number;
  activeAlerts: number;
  dailyConsumption: number; // Litres
  baselineDaily: number;
  currentFlowRate: number; // L/min
  riskStatus: RiskLevel;
  percentageOfTotal: number;
  trend: number; // positive or negative percentage
  subzones: string[];
}

export interface UnitPerson {
  id: string;
  name: string; // e.g. "Student A", "Room 204"
  unitNumber: string; // e.g. "Room 204", "Flat 4B"
  locationId: string;
  locationName: string; // e.g. "Hostel Block B"
  todayUsage: number; // in Litres
  averageUsage: number; // in Litres
  differencePercentage: number; // e.g. +300%
  status: ConsumptionStatus;
  statusBadge: 'normal' | 'high' | 'anomaly' | 'leak';
  rank: number;
  sensorId: string;
  flowRate: number; // L/min
  baselineFlow: number; // L/min
  aiAnalysis: string;
  recommendation: string;
  hourlyHistory: { time: string; actual: number; baseline: number }[];
  weeklyHistory: { day: string; actual: number; baseline: number }[];
}

export interface Sensor {
  id: string;
  name: string;
  locationId: string;
  locationName: string;
  assignedUnit: string;
  assignedPerson: string;
  zone: string;
  status: SensorStatus;
  currentFlow: number; // in L/min
  baselineFlow: number; // in L/min
  battery: number; // percentage
  lastUpdated: string; // e.g. "12 seconds ago"
  firmwareVersion: string;
  pipeDiameter: string;
  signalStrength: number; // percentage
  readingsHistory: {
    time: string;
    flow: number;
    baseline: number;
  }[];
}

export interface WaterReading {
  timestamp: string;
  timeLabel: string;
  actualConsumption: number; // in Litres
  baselineConsumption: number; // in Litres
  flowRate?: number; // L/min
  isAnomaly?: boolean;
  anomalyDelta?: number;
  temperature?: number;
  pressure?: number;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  personOrUnit: string;
  location: string;
  locationId: string;
  sensorId?: string;
  currentUsage: number; // L or L/min
  normalUsage: number; // L or L/min
  percentageAboveBaseline: number;
  timestamp: string;
  detectedAt: string;
  description: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  currentFlow: number;
  expectedFlow: number;
  leakConfidence: number; // 0 - 100
  estimatedWaterLost: number; // Litres
  resolvedAt?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  timeAgo: string;
  type: 'alert' | 'resolution' | 'normal' | 'battery' | 'system' | 'high_consumption';
  severity?: 'critical' | 'warning' | 'info' | 'success';
}

export interface LeakIncident {
  id: string;
  title: string;
  location: string;
  unit: string;
  person: string;
  pipeline: string;
  sensorId: string;
  detectedTime: string;
  timeAgo: string;
  durationMinutes: number;
  expectedFlow: number; // L/min
  currentFlow: number; // L/min
  excessFlow: number; // L/min
  estimatedExcessWater: number; // Litres
  anomalyPercentage: number;
  leakConfidence: number; // percentage
  riskLevel: RiskLevel;
  timeWindow: string; // e.g., "02:15 AM - 04:40 AM"
  status: 'active' | 'resolved';
  recommendedActions: string[];
  findings: string[];
}

export interface SystemSettings {
  propertyName: string;
  propertyType: PropertyType;
  address: string;
  measurementUnit: 'Litres' | 'Litres/minute';
  timeZone: string;
  leakSensitivity: number; // 1 to 10
  baselineCalculationPeriod: '7d' | '14d' | '30d';
  anomalyThresholdPercent: number;
  enableCriticalAlerts: boolean;
  enableWarningAlerts: boolean;
  enableEmailNotifications: boolean;
  enableDashboardNotifications: boolean;
}

export interface AnomalyResult {
  anomalyPercentage: number;
  riskScore: number;
  riskLevel: RiskLevel;
  isAnomaly: boolean;
  possibleLeak: boolean;
  excessFlow: number;
}
