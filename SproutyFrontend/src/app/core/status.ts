import { PlantRequirement, PlantStatus, SensorReading, StatusType } from '../models';

// Mock-only. In production the BACKEND computes the status ("Plant Voice").
export const VOICE: Record<StatusType, string> = {
  Healthy: "I feel great! Thanks for taking care of me.",
  NeedsWater: "I'm a little thirsty. Could I have some water?",
  TooMuchWater: "My roots are soaked. Please let me dry out.",
  TooHot: "It's too hot for me! Move me somewhere cooler.",
  TooCold: "Brr, I'm cold. Can you move me somewhere warmer?",
  NeedsLight: "It's dark here. Could I get some sun?",
  TooMuchLight: "That's too much sun! Give me some shade.",
};

export function evaluate(plantId: string, r: SensorReading, q: PlantRequirement): PlantStatus {
  let t: StatusType = 'Healthy';
  if (r.moisture < q.minMoisture) t = 'NeedsWater';
  else if (r.moisture > q.maxMoisture) t = 'TooMuchWater';
  else if (r.temperature > q.maxTemperature) t = 'TooHot';
  else if (r.temperature < q.minTemperature) t = 'TooCold';
  else if (r.light < q.minLight) t = 'NeedsLight';
  else if (r.light > q.maxLight) t = 'TooMuchLight';
  return { id: 'st-' + r.id, plantId, statusType: t, message: VOICE[t], computedAt: r.recordedAt };
}
