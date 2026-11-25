export interface User { id: string; name: string; email: string; role?: string; }
export interface AuthResponse { token: string; user: User; expiresAt?: string; }
export interface ApiAuthResponse { userId: string; name: string; email: string; role: string; token: string; expiresAt: string; }

export interface PlantType {
  id: string; nameAr: string; nameEn: string; category: string; imageUrl: string; emoji?: string;
  careNotes: string; careSteps: string[]; sunSchedule: string;
}
export interface PlantRequirement {
  id: string; plantTypeId: string;
  minMoisture: number; maxMoisture: number;
  minTemperature: number; maxTemperature: number;
  minHumidity: number; maxHumidity: number;
  minLight: number; maxLight: number;
}
export interface Plant {
  id: string; userId: string; plantTypeId: string; nickname: string; imageUrl: string | null;
  addedAt: string; sensorId?: string | null;
}
export interface SensorReading {
  id: string; sensorId: string; moisture: number; temperature: number; humidity: number;
  light: number; lightLevel?: number; recordedAt: string;
}
export type StatusType = 'Healthy' | 'NeedsWater' | 'TooMuchWater' | 'TooHot' | 'TooCold' | 'NeedsLight' | 'AirTooDry' | 'AirTooHumid' | 'NoData';
export interface PlantStatus { id: string; plantId: string; statusType: StatusType; message: string; computedAt: string; }
export interface AppNotification {
  id: string; plantId: string; plantNickname?: string; title: string; message: string;
  type: 'NeedsAttention' | 'SensorOffline' | 'Info'; isRead: boolean; createdAt: string;
}
export interface LatestReading { reading: SensorReading | null; status: PlantStatus; requirement: PlantRequirement | null; }
export interface NewReadingDto { moisture: number; temperature: number; humidity: number; light: number; }
export interface ApiRequirement {
  minMoisture: number; maxMoisture: number; minTemperature: number; maxTemperature: number;
  minHumidity: number; maxHumidity: number; minLight: number; maxLight: number;
}
export interface ApiPlantType { id: string; nameAr: string; nameEn: string; category: string; imageUrl?: string | null; requirement?: ApiRequirement | null; }
export interface ApiSensorReading {
  id: string; sensorId: string; moisture: number; temperature: number; humidity: number;
  light: number; lightLevel?: number | null; recordedAt: string;
}
export interface ApiPlantStatus { plantId: string; status: string | number; message?: string | null; computedAt: string; }
export interface ApiLatestReading {
  plantId: string; reading?: ApiSensorReading | null; requirement?: ApiRequirement | null; status?: ApiPlantStatus | null;
}
export interface ApiAddReadingResponse { reading: ApiSensorReading; status: ApiPlantStatus; }
