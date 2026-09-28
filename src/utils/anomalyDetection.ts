import { AnomalyResult, RiskLevel } from '../types';

/**
 * Anomaly Detection & Leak Risk Scoring Utility
 * 
 * Crucial Product Rule:
 * High consumption != Leak.
 * - High Consumption: An area consumes more water than peers.
 * - Anomalous Consumption: Consumption departs from that entity's historical baseline.
 * - Possible Leak: Continuous persistent flow during low-usage windows with sustained pressure drop.
 */
export function calculateAnomaly(
  currentUsage: number,
  baselineUsage: number,
  options?: {
    isContinuousFlow?: boolean;
    isOffHours?: boolean;
    flowDurationMinutes?: number;
  }
): AnomalyResult {
  const safeBaseline = baselineUsage <= 0 ? 0.1 : baselineUsage;
  const excessFlow = Math.max(0, Number((currentUsage - safeBaseline).toFixed(2)));
  const anomalyPercentage = Math.round(((currentUsage - safeBaseline) / safeBaseline) * 100);

  let riskScore = 0;
  let riskLevel: RiskLevel = 'Normal';
  let isAnomaly = false;
  let possibleLeak = false;

  // Percentage difference mapping
  if (anomalyPercentage <= 30) {
    riskScore = Math.max(5, Math.min(30, Math.round((anomalyPercentage / 30) * 30)));
    riskLevel = 'Normal';
    isAnomaly = false;
  } else if (anomalyPercentage <= 60) {
    riskScore = Math.round(31 + ((anomalyPercentage - 30) / 30) * 29);
    riskLevel = 'Low';
    isAnomaly = false;
  } else if (anomalyPercentage <= 80) {
    riskScore = Math.round(61 + ((anomalyPercentage - 60) / 20) * 19);
    riskLevel = 'Warning';
    isAnomaly = true;
  } else {
    // 81 - 100%
    riskScore = Math.min(100, Math.round(81 + Math.min(19, (anomalyPercentage - 80) * 0.15)));
    riskLevel = 'Critical';
    isAnomaly = true;
  }

  // Leak probability requires continuous nocturnal flow / uninterrupted pattern
  const isContinuous = options?.isContinuousFlow ?? (anomalyPercentage > 100);
  const isOffHours = options?.isOffHours ?? false;
  const longDuration = (options?.flowDurationMinutes ?? 0) > 30;

  if (anomalyPercentage > 120 && (isContinuous || isOffHours || longDuration)) {
    possibleLeak = true;
  } else if (anomalyPercentage > 180) {
    possibleLeak = true;
  }

  return {
    anomalyPercentage,
    riskScore: Math.min(100, Math.max(0, riskScore)),
    riskLevel,
    isAnomaly,
    possibleLeak,
    excessFlow,
  };
}

/**
 * Returns clean domain terminology mapping based on property type
 */
export function getPropertyTerminology(propertyType: string) {
  switch (propertyType) {
    case 'APARTMENT':
      return {
        unitLabel: 'Flat',
        unitPlural: 'Flats',
        personLabel: 'Resident',
        personPlural: 'Residents',
        locationLabel: 'Tower / Block',
        locationPlural: 'Towers',
        adminRole: 'Apartment In-charge',
      };
    case 'HOUSE':
      return {
        unitLabel: 'Room / Area',
        unitPlural: 'Areas',
        personLabel: 'Family Member',
        personPlural: 'Members',
        locationLabel: 'Section',
        locationPlural: 'Sections',
        adminRole: 'House Owner',
      };
    case 'HOTEL':
      return {
        unitLabel: 'Guest Room',
        unitPlural: 'Guest Rooms',
        personLabel: 'Occupant',
        personPlural: 'Guests',
        locationLabel: 'Floor / Wing',
        locationPlural: 'Floors',
        adminRole: 'Hotel Manager',
      };
    case 'HOSPITAL':
      return {
        unitLabel: 'Ward',
        unitPlural: 'Wards',
        personLabel: 'Department',
        personPlural: 'Departments',
        locationLabel: 'Building Wing',
        locationPlural: 'Wings',
        adminRole: 'Facility Manager',
      };
    case 'FACTORY':
      return {
        unitLabel: 'Production Zone',
        unitPlural: 'Production Zones',
        personLabel: 'Operational Line',
        personPlural: 'Lines',
        locationLabel: 'Industrial Plant',
        locationPlural: 'Plants',
        adminRole: 'Operations Director',
      };
    case 'SCHOOL':
      return {
        unitLabel: 'Classroom / Lab',
        unitPlural: 'Rooms',
        personLabel: 'Department',
        personPlural: 'Departments',
        locationLabel: 'Academic Block',
        locationPlural: 'Blocks',
        adminRole: 'School Administrator',
      };
    case 'HOSTEL':
    default:
      return {
        unitLabel: 'Room',
        unitPlural: 'Rooms',
        personLabel: 'Student',
        personPlural: 'Students',
        locationLabel: 'Hostel Block',
        locationPlural: 'Blocks',
        adminRole: 'Hostel Warden',
      };
  }
}
