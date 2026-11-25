import { PlantRequirement, PlantStatus, SensorReading, StatusType } from '../models';

export const VOICE: Record<StatusType, string> = {
  NoData: "I'm waiting for my first reading.",
  Healthy: "I feel great today. Thank you!",
  NeedsWater: "I'm a little thirsty. Could I have some water?",
  TooMuchWater: "My roots are too wet. Let me dry a little.",
  TooHot: "It's a bit too warm for me today.",
  TooCold: "I'm feeling cold. Can you move me somewhere warmer?",
  NeedsLight: "I could use a little more sunlight.",
  AirTooDry: "The air around me feels a little dry.",
  AirTooHumid: "The air around me feels too humid.",
};

const BACKEND_STATUS: StatusType[] = ['NoData', 'Healthy', 'NeedsWater', 'TooMuchWater', 'TooHot', 'TooCold', 'NeedsLight', 'AirTooDry', 'AirTooHumid'];
export function normalizeStatus(value: string | number | null | undefined): StatusType {
  if (value === null || value === undefined) return 'NoData';
  const name = typeof value === 'number' ? BACKEND_STATUS[value] : value;
  if (name === 'OverWatered') return 'TooMuchWater';
  if (name === 'TooMuchWater' || BACKEND_STATUS.includes(name as StatusType)) return name as StatusType;
  return 'NoData';
}
export function mapStatus(plantId: string, api?: { status?: string | number; message?: string | null; computedAt?: string } | null): PlantStatus {
  const statusType = normalizeStatus(api?.status);
  return { id: `${plantId}-${api?.computedAt ?? 'nodata'}`, plantId, statusType, message: api?.message || VOICE[statusType], computedAt: api?.computedAt || new Date().toISOString() };
}
export function statusTone(t: StatusType): 'ok' | 'bad' | 'idle' {
  return t === 'Healthy' ? 'ok' : t === 'NoData' ? 'idle' : 'bad';
}
export function lightRawToPercent(raw: number): number { return Math.round(((4095 - raw) / 4095) * 1000) / 10; }
export function lightPercentToRaw(percent: number): number { return Math.round(4095 * (1 - Math.min(100, Math.max(0, percent)) / 100)); }
export function mapReading(r: any): SensorReading {
  const lightLevel = typeof r.lightLevel === 'number' ? r.lightLevel : lightRawToPercent(Number(r.light ?? 0));
  return { id: r.id, sensorId: r.sensorId, moisture: Number(r.moisture), temperature: Number(r.temperature), humidity: Number(r.humidity), light: lightLevel, lightLevel, recordedAt: r.recordedAt };
}
export function mapRequirement(r: any, plantTypeId = ''): PlantRequirement | null {
  if (!r) return null;
  return { id: `${plantTypeId}-requirement`, plantTypeId, minMoisture: r.minMoisture, maxMoisture: r.maxMoisture, minTemperature: r.minTemperature, maxTemperature: r.maxTemperature, minHumidity: r.minHumidity, maxHumidity: r.maxHumidity, minLight: r.minLight, maxLight: r.maxLight };
}
