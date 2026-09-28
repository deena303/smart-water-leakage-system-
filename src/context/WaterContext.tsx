import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property,
  LocationZone,
  UnitPerson,
  Sensor, 
  Alert, 
  LeakIncident, 
  ActivityItem, 
  SystemSettings, 
  WaterReading,
  PropertyTerms
} from '../types';
import { 
  initialProperties,
  hostelData,
  apartmentData,
  homeData,
  propertyDataMap,
  PropertyDataBundle
} from '../data/mockData';
import { calculateAnomaly, getPropertyTerminology } from '../utils/anomalyDetection';

export interface ToastMessage {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
}

interface WaterContextType {
  properties: Property[];
  currentProperty: Property;
  terms: ReturnType<typeof getPropertyTerminology>;
  locations: LocationZone[];
  unitPeople: UnitPerson[];
  sensors: Sensor[];
  alerts: Alert[];
  activities: ActivityItem[];
  activeIncident: LeakIncident;
  settings: SystemSettings;
  locationBreakdown: { name: string; litres: number; percentage: number; trend: number; color: string }[];
  decisionSection: PropertyDataBundle['decisionSection'];
  leakTimelineData: PropertyDataBundle['leakTimelineData'];
  
  // Selection states
  selectedUnit: UnitPerson | null;
  selectedSensor: Sensor | null;
  activeAlertBannerDismissed: boolean;
  activeTimeRange: 'Today' | '7 Days' | '30 Days';
  chartRange: '24H' | '7D' | '30D';
  chartData: WaterReading[];
  toast: ToastMessage | null;
  searchQuery: string;

  // Actions
  selectProperty: (propertyId: string) => void;
  setSelectedUnit: (unit: UnitPerson | null) => void;
  setSelectedSensor: (sensor: Sensor | null) => void;
  setActiveTimeRange: (range: 'Today' | '7 Days' | '30 Days') => void;
  setChartRange: (range: '24H' | '7D' | '30D') => void;
  setSearchQuery: (query: string) => void;
  dismissAlertBanner: () => void;
  dismissAlert: (alertId: string) => void;
  markAlertResolved: (alertId: string) => void;
  resolveActiveIncident: () => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  clearToast: () => void;

  // Simulation controls
  simulateNormalReading: () => void;
  simulateHighConsumption: (unitId?: string) => void;
  simulateLeak: (unitId?: string) => void;
  resetDemo: () => void;

  // Top KPI Metrics
  kpiStats: {
    totalConsumption: number;
    todayVsYesterday: number;
    waterSaved: number;
    waterSavedPercentage: number;
    activeAlertsCount: number;
    criticalCount: number;
    warningCount: number;
    possibleWaterLoss: number;
    isSystemHealthy: boolean;
  };
}

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export const WaterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties] = useState<Property[]>(initialProperties);
  const [currentProperty, setCurrentProperty] = useState<Property>(initialProperties[0]);
  
  // Property bundle state initialized from hostelData
  const [locations, setLocations] = useState<LocationZone[]>(hostelData.locations);
  const [unitPeople, setUnitPeople] = useState<UnitPerson[]>(hostelData.unitPeople);
  const [sensors, setSensors] = useState<Sensor[]>(hostelData.sensors);
  const [alerts, setAlerts] = useState<Alert[]>(hostelData.alerts);
  const [activities, setActivities] = useState<ActivityItem[]>(hostelData.activities);
  const [activeIncident, setActiveIncident] = useState<LeakIncident>(hostelData.activeIncident);
  const [settings, setSettings] = useState<SystemSettings>(hostelData.settings);
  const [locationBreakdown, setLocationBreakdown] = useState(hostelData.locationBreakdown);
  const [decisionSection, setDecisionSection] = useState(hostelData.decisionSection);
  const [leakTimelineData, setLeakTimelineData] = useState(hostelData.leakTimelineData);

  const [selectedUnit, setSelectedUnit] = useState<UnitPerson | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [activeAlertBannerDismissed, setActiveAlertBannerDismissed] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState<'Today' | '7 Days' | '30 Days'>('Today');
  const [chartRange, setChartRange] = useState<'24H' | '7D' | '30D'>('24H');
  const [chartData, setChartData] = useState<WaterReading[]>(hostelData.consumptionData24H);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const terms = getPropertyTerminology(currentProperty.type);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync chart range data whenever chartRange or currentProperty changes
  useEffect(() => {
    const bundle = propertyDataMap[currentProperty.id] || hostelData;
    if (chartRange === '7D') setChartData(bundle.consumptionData7D);
    else if (chartRange === '30D') setChartData(bundle.consumptionData30D);
    else setChartData(bundle.consumptionData24H);
  }, [chartRange, currentProperty.id]);

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    setToast({
      id: Math.random().toString(36).substring(7),
      type,
      title,
      message,
    });
  };

  const clearToast = () => setToast(null);

  // SWITCH PROPERTY: Loads the complete unique dataset for the selected property!
  const selectProperty = (propertyId: string) => {
    const bundle = propertyDataMap[propertyId] || hostelData;
    setCurrentProperty(bundle.property);
    setSettings(bundle.settings);
    setLocations(bundle.locations);
    setUnitPeople(bundle.unitPeople);
    setSensors(bundle.sensors);
    setAlerts(bundle.alerts);
    setActivities(bundle.activities);
    setActiveIncident(bundle.activeIncident);
    setLocationBreakdown(bundle.locationBreakdown);
    setDecisionSection(bundle.decisionSection);
    setLeakTimelineData(bundle.leakTimelineData);
    
    // Reset range and selections
    setChartRange('24H');
    setChartData(bundle.consumptionData24H);
    setActiveTimeRange('Today');
    setActiveAlertBannerDismissed(false);
    setSelectedUnit(null);
    setSelectedSensor(null);

    showToast(
      'info',
      `Switched to ${bundle.property.name}`,
      `Loaded telemetry for ${bundle.property.type} (${bundle.locations.length} locations, ${bundle.unitPeople.length} units).`
    );
  };

  const dismissAlertBanner = () => {
    setActiveAlertBannerDismissed(true);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'dismissed' } : a))
    );
    showToast('info', 'Alert Dismissed', 'Moved alert from priority queue.');
  };

  const markAlertResolved = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, status: 'resolved', severity: 'resolved', resolvedAt: 'Just now' }
          : a
      )
    );

    const alertItem = alerts.find((a) => a.id === alertId);
    if (alertItem && (alertItem.personOrUnit === activeIncident.unit || alertItem.id.includes('leak') || alertItem.id === 'alt-01' || alertItem.id === 'alt-apt-01' || alertItem.id === 'alt-home-01')) {
      resolveActiveIncident();
    } else {
      showToast('success', 'Alert Resolved', 'Water flow verified within nominal limits.');
    }
  };

  const resolveActiveIncident = () => {
    setActiveIncident((prev) => ({
      ...prev,
      status: 'resolved',
      currentFlow: prev.expectedFlow,
      excessFlow: 0,
      riskLevel: 'Normal',
    }));

    // Update active incident unit in unitPeople
    setUnitPeople((prev) =>
      prev.map((u) =>
        u.unitNumber === activeIncident.unit || u.id === activeIncident.unit
          ? {
              ...u,
              todayUsage: u.averageUsage + 5,
              differencePercentage: 4,
              status: 'Normal',
              statusBadge: 'normal',
              flowRate: u.baselineFlow,
              aiAnalysis: 'Fixture leak has been resolved by maintenance. Flow has stabilized at nominal baseline.',
            }
          : u
      )
    );

    // Update corresponding sensor
    setSensors((prev) =>
      prev.map((s) =>
        s.id === activeIncident.sensorId || s.assignedUnit === activeIncident.unit
          ? { ...s, currentFlow: s.baselineFlow, status: 'Online', lastUpdated: 'Just now' }
          : s
      )
    );

    // Mark alerts resolved
    setAlerts((prev) =>
      prev.map((a) =>
        a.personOrUnit === activeIncident.unit || a.sensorId === activeIncident.sensorId || a.severity === 'critical'
          ? { ...a, status: 'resolved', severity: 'resolved', resolvedAt: 'Just now' }
          : a
      )
    );

    // Add activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `${activeIncident.unit} leak resolved by maintenance`,
        location: activeIncident.location,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeAgo: 'Just now',
        type: 'resolution',
        severity: 'success',
      },
      ...prev,
    ]);

    setActiveAlertBannerDismissed(true);
    showToast('success', 'Incident Resolved', `${activeIncident.unit} flow restored to nominal baseline.`);
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('success', 'Settings Saved', 'System configurations updated.');
  };

  // 1. Simulate Normal Reading
  const simulateNormalReading = () => {
    setSensors((prev) =>
      prev.map((s) => ({
        ...s,
        currentFlow: Number((s.baselineFlow * (0.96 + Math.random() * 0.08)).toFixed(1)),
        lastUpdated: 'Just now',
      }))
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'Normal telemetry reading logged across all zones',
        location: currentProperty.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeAgo: 'Just now',
        type: 'normal',
        severity: 'success',
      },
      ...prev,
    ]);

    showToast('success', 'Simulated Normal Reading', 'Current telemetry readings are matching rolling baseline profiles.');
  };

  // 2. Simulate High Consumption (NOT A LEAK!)
  const simulateHighConsumption = (unitId?: string) => {
    const targetUnit = unitPeople.find((u) => u.status === 'High Consumption') || unitPeople[2] || unitPeople[0];
    const targetId = unitId || targetUnit.id;

    setUnitPeople((prev) =>
      prev.map((u) =>
        u.id === targetId
          ? {
              ...u,
              todayUsage: Math.round(u.averageUsage * 1.6),
              differencePercentage: 60,
              status: 'High Consumption',
              statusBadge: 'high',
              aiAnalysis: 'Occupant is using high volume during peak hours, but flow turns off between usages. No continuous leak pattern.',
            }
          : u
      )
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `High water consumption recorded in ${targetUnit.unitNumber} (Non-leak)`,
        location: `${targetUnit.locationName} — ${targetUnit.unitNumber}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeAgo: 'Just now',
        type: 'high_consumption',
        severity: 'info',
      },
      ...prev,
    ]);

    showToast(
      'info',
      'High Consumption Recorded',
      `${targetUnit.unitNumber} consumed high volume (+60%). Categorized as High Consumption, NOT a leak (usage shows intermittent human pattern).`
    );
  };

  // 3. Simulate Leak (CRITICAL CONTINUOUS ANOMALY)
  const simulateLeak = (unitId?: string) => {
    const leakUnit = unitPeople.find((u) => u.status === 'Possible Leak') || unitPeople[0];
    const highFlow = Number((leakUnit.baselineFlow * 3.2).toFixed(1));
    const baseline = leakUnit.baselineFlow;
    const anomaly = calculateAnomaly(highFlow, baseline, { isContinuousFlow: true, isOffHours: true, flowDurationMinutes: 145 });

    setUnitPeople((prev) =>
      prev.map((u) =>
        u.id === leakUnit.id
          ? {
              ...u,
              todayUsage: Math.round(u.averageUsage * 3.5),
              differencePercentage: 250,
              status: 'Possible Leak',
              statusBadge: 'leak',
              flowRate: highFlow,
              aiAnalysis: `Urgent: Continuous nocturnal flow pattern detected with steady ${highFlow} L/min discharge. High confidence fixture seal failure.`,
            }
          : u
      )
    );

    setSensors((prev) =>
      prev.map((s) =>
        s.id === leakUnit.sensorId || s.assignedUnit === leakUnit.unitNumber
          ? { ...s, currentFlow: highFlow, status: 'Warning', lastUpdated: 'Just now' }
          : s
      )
    );

    const newAlert: Alert = {
      id: `alt-sim-${Date.now()}`,
      severity: 'critical',
      title: 'Possible Continuous Leak',
      personOrUnit: leakUnit.unitNumber,
      location: `${leakUnit.locationName} — ${leakUnit.unitNumber}`,
      locationId: leakUnit.locationId,
      sensorId: leakUnit.sensorId,
      currentUsage: Math.round(leakUnit.averageUsage * 3.5),
      normalUsage: leakUnit.averageUsage,
      percentageAboveBaseline: 250,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detectedAt: 'Just now',
      description: `Continuous water flow at ${highFlow} L/min vs ${baseline} L/min expected (+250%). High confidence pipe rupture or cistern valve failure.`,
      status: 'active',
      currentFlow: highFlow,
      expectedFlow: baseline,
      leakConfidence: 94,
      estimatedWaterLost: 185,
    };

    setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);

    setActiveIncident({
      id: `inc-${Date.now()}`,
      title: 'Possible Continuous Leak',
      location: `${leakUnit.locationName} — ${leakUnit.unitNumber}`,
      unit: leakUnit.unitNumber,
      person: leakUnit.name,
      pipeline: `${leakUnit.unitNumber} Main Water Riser`,
      sensorId: leakUnit.sensorId,
      detectedTime: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timeAgo: 'Just now',
      durationMinutes: 45,
      expectedFlow: baseline,
      currentFlow: highFlow,
      excessFlow: Number((highFlow - baseline).toFixed(1)),
      estimatedExcessWater: 185,
      anomalyPercentage: anomaly.anomalyPercentage,
      leakConfidence: 94,
      riskLevel: 'Critical',
      timeWindow: 'Live telemetry continuous window',
      status: 'active',
      recommendedActions: [
        `Inspect bathroom fixtures and connected pipeline inside ${leakUnit.unitNumber} immediately.`,
        `Shut down manual isolation valve located outside ${leakUnit.unitNumber}.`,
        'Confirm pressure stabilization after valve closure.',
        'Alert maintenance engineer on duty.',
      ],
      findings: [
        `Live flow surged to ${highFlow} L/min (+${anomaly.anomalyPercentage}% above baseline).`,
        'Continuous unbroken profile indicates fixture or pipe rupture.',
        'Calculated 94% leak confidence based on absence of flow decay.',
      ],
    });

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: `Possible leak detected in ${leakUnit.unitNumber}`,
        location: `${leakUnit.locationName} — ${leakUnit.unitNumber}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timeAgo: 'Just now',
        type: 'alert',
        severity: 'critical',
      },
      ...prev,
    ]);

    setActiveAlertBannerDismissed(false);
    showToast('critical', `Possible Leak Detected in ${leakUnit.unitNumber}`, `Continuous flow (+250% variance) detected. 94% leak confidence.`);
  };

  // 4. Reset Demo
  const resetDemo = () => {
    const bundle = propertyDataMap[currentProperty.id] || hostelData;
    setLocations(bundle.locations);
    setUnitPeople(bundle.unitPeople);
    setSensors(bundle.sensors);
    setAlerts(bundle.alerts);
    setActivities(bundle.activities);
    setActiveIncident(bundle.activeIncident);
    setLocationBreakdown(bundle.locationBreakdown);
    setDecisionSection(bundle.decisionSection);
    setLeakTimelineData(bundle.leakTimelineData);
    setActiveAlertBannerDismissed(false);
    setChartData(bundle.consumptionData24H);
    setChartRange('24H');
    setActiveTimeRange('Today');
    showToast('info', 'Demo State Reset', `Initial baseline data restored for ${bundle.property.name}.`);
  };

  // Compute live KPIs based on current property data and incident state
  const activeAlertsList = alerts.filter((a) => a.status === 'active');
  const criticalCount = activeAlertsList.filter((a) => a.severity === 'critical').length;
  const warningCount = activeAlertsList.filter((a) => a.severity === 'warning').length;
  const activeAlertsCount = activeAlertsList.length;

  const currentBundle = propertyDataMap[currentProperty.id] || hostelData;
  const isLeakActive = activeIncident.status === 'active';

  const kpiStats = {
    totalConsumption: isLeakActive 
      ? currentBundle.kpi.totalConsumption + Math.round(activeIncident.estimatedExcessWater * 0.4) 
      : currentBundle.kpi.totalConsumption,
    todayVsYesterday: currentBundle.kpi.todayVsYesterday,
    waterSaved: isLeakActive ? currentBundle.kpi.waterSaved : Math.round(currentBundle.kpi.waterSaved * 1.15),
    waterSavedPercentage: currentBundle.kpi.waterSavedPercentage,
    activeAlertsCount,
    criticalCount,
    warningCount,
    possibleWaterLoss: isLeakActive ? activeIncident.estimatedExcessWater : 0,
    isSystemHealthy: activeAlertsCount === 0 || criticalCount === 0,
  };

  return (
    <WaterContext.Provider
      value={{
        properties,
        currentProperty,
        terms,
        locations,
        unitPeople,
        sensors,
        alerts,
        activities,
        activeIncident,
        settings,
        locationBreakdown,
        decisionSection,
        leakTimelineData,
        selectedUnit,
        selectedSensor,
        activeAlertBannerDismissed,
        activeTimeRange,
        chartRange,
        chartData,
        toast,
        searchQuery,
        selectProperty,
        setSelectedUnit,
        setSelectedSensor,
        setActiveTimeRange,
        setChartRange,
        setSearchQuery,
        dismissAlertBanner,
        dismissAlert,
        markAlertResolved,
        resolveActiveIncident,
        updateSettings,
        showToast,
        clearToast,
        simulateNormalReading,
        simulateHighConsumption,
        simulateLeak,
        resetDemo,
        kpiStats,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = (): WaterContextType => {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }
  return context;
};
