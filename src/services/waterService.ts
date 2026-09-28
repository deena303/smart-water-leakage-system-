import { 
  Property,
  LocationZone,
  UnitPerson,
  Sensor, 
  WaterReading, 
  Alert, 
  ActivityItem, 
  LeakIncident, 
  SystemSettings 
} from '../types';
import { 
  initialProperties,
  initialLocations,
  initialUnitPeople,
  initialSensors, 
  initialAlerts, 
  initialIncident, 
  initialActivities, 
  consumptionData24H, 
  consumptionData7D, 
  consumptionData30D,
  initialSystemSettings
} from '../data/mockData';

export interface ConsumptionStats {
  todayConsumption: number;
  todayVsYesterdayChange: number;
  waterSaved: number;
  waterSavedPercentage: number;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  warningAlertsCount: number;
  possibleWaterLoss: number; // in Litres
}

export const waterService = {
  async getProperties(): Promise<Property[]> {
    return Promise.resolve([...initialProperties]);
  },

  async getLocations(propertyId?: string): Promise<LocationZone[]> {
    if (propertyId) {
      return Promise.resolve(initialLocations.filter((l) => l.propertyId === propertyId));
    }
    return Promise.resolve([...initialLocations]);
  },

  async getUnits(): Promise<UnitPerson[]> {
    return Promise.resolve([...initialUnitPeople]);
  },

  async getPeople(): Promise<UnitPerson[]> {
    return Promise.resolve([...initialUnitPeople]);
  },

  async getUnitById(id: string): Promise<UnitPerson | undefined> {
    const item = initialUnitPeople.find((u) => u.id === id || u.unitNumber === id);
    return Promise.resolve(item ? { ...item } : undefined);
  },

  async getSensors(): Promise<Sensor[]> {
    return Promise.resolve([...initialSensors]);
  },

  async getSensorById(id: string): Promise<Sensor | undefined> {
    const sensor = initialSensors.find((s) => s.id === id);
    return Promise.resolve(sensor ? { ...sensor } : undefined);
  },

  async getWaterReadings(range: '24H' | '7D' | '30D' = '24H'): Promise<WaterReading[]> {
    if (range === '7D') return Promise.resolve([...consumptionData7D]);
    if (range === '30D') return Promise.resolve([...consumptionData30D]);
    return Promise.resolve([...consumptionData24H]);
  },

  async getAlerts(filter?: 'all' | 'critical' | 'warning' | 'resolved'): Promise<Alert[]> {
    if (!filter || filter === 'all') {
      return Promise.resolve([...initialAlerts]);
    }
    return Promise.resolve(initialAlerts.filter((a) => a.severity === filter || (filter === 'resolved' && a.status === 'resolved')));
  },

  async getConsumptionStats(): Promise<ConsumptionStats> {
    return Promise.resolve({
      todayConsumption: 8420,
      todayVsYesterdayChange: 6.2,
      waterSaved: 1240,
      waterSavedPercentage: 12.4,
      activeAlertsCount: 3,
      criticalAlertsCount: 1,
      warningAlertsCount: 2,
      possibleWaterLoss: 126,
    });
  },

  async getLeakAnalysis(): Promise<LeakIncident> {
    return Promise.resolve({ ...initialIncident });
  },

  async getActivities(): Promise<ActivityItem[]> {
    return Promise.resolve([...initialActivities]);
  },

  async getSystemSettings(): Promise<SystemSettings> {
    return Promise.resolve({ ...initialSystemSettings });
  },
};
