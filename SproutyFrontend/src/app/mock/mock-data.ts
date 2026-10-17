import { AppNotification, Plant, PlantRequirement, PlantType, SensorReading } from '../models';

const T = (id: string, nameEn: string, nameAr: string, category: string, emoji: string, careNotes: string, careSteps: string[], sunSchedule: string): PlantType =>
  ({ id, nameEn, nameAr, category, emoji, imageUrl: '', careNotes, careSteps, sunSchedule });

export const MOCK_PLANT_TYPES: PlantType[] = [
  // Herbs
  T('pt1', 'Basil', 'ريحان', 'Herbs', '🌿', 'Basil loves warmth and steady moisture. Pinch off flower buds to keep leaves growing.',
    ['Plant in well-draining soil', 'Water when the top 2 cm feel dry', 'Pinch the top leaves weekly', 'Keep away from cold drafts'], 'Full sun from 8 AM to 2 PM; shade after 2 PM in hot weather'),
  T('pt2', 'Mint', 'نعناع', 'Herbs', '🍃', 'Mint spreads fast and likes damp soil. Give it its own pot.',
    ['Use a wide pot', 'Keep the soil evenly moist', 'Trim often to keep it bushy'], 'Morning sun until 11 AM, then bright shade'),
  T('pt5', 'Parsley', 'بقدونس', 'Herbs', '🥬', 'Parsley is easy and forgiving. Harvest the outer stems first so it keeps growing.',
    ['Sow in a deep pot', 'Keep the soil lightly moist', 'Cut outer stems, leave the center'], 'Morning sun until 12 PM, then bright shade'),
  // Succulents
  T('pt3', 'Aloe Vera', 'ألوفيرا', 'Succulents', '🪴', 'Aloe stores water in its leaves. Overwatering is the most common mistake.',
    ['Use cactus soil', 'Water deeply, then let it dry out fully', 'Never leave water in the saucer'], 'Bright light 9 AM to 4 PM; avoid harsh midday sun in summer'),
  T('pt6', 'Cactus', 'صبار', 'Succulents', '🌵', 'Cacti need very little water. Treat them to bright light and almost no fuss.',
    ['Use sandy cactus soil', 'Water only when the soil is completely dry', 'Use a pot with drainage holes'], 'Direct sun from 8 AM to 5 PM'),
  // Flowers
  T('pt4', 'Rose', 'ورد', 'Flowers', '🌹', 'Roses need sun and airflow. Water at the base, not on the leaves.',
    ['Plant in rich soil', 'Water at the base 2–3 times a week', 'Remove faded flowers', 'Prune in late winter'], 'At least 6 hours of sun, 7 AM to 1 PM is ideal'),
  T('pt7', 'Marigold', 'قطيفة', 'Flowers', '🌼', 'Marigolds are tough, cheerful and flower for months with very little care.',
    ['Plant in a sunny spot', 'Water when the top of the soil is dry', 'Remove dead flowers to get more blooms'], 'Full sun 8 AM to 4 PM'),
];

const req = (i: number, t: string, m: [number, number], te: [number, number], l: [number, number]): PlantRequirement =>
  ({ id: 'r' + i, plantTypeId: t, minMoisture: m[0], maxMoisture: m[1], minTemperature: te[0], maxTemperature: te[1], minLight: l[0], maxLight: l[1] });

export const MOCK_REQUIREMENTS: PlantRequirement[] = [
  req(1, 'pt1', [40, 70], [18, 30], [60, 90]),
  req(2, 'pt2', [50, 80], [15, 27], [40, 70]),
  req(3, 'pt3', [10, 30], [15, 32], [60, 95]),
  req(4, 'pt4', [40, 65], [15, 28], [70, 100]),
  req(5, 'pt5', [40, 70], [10, 25], [50, 80]),
  req(6, 'pt6', [5, 20], [15, 35], [70, 100]),
  req(7, 'pt7', [40, 65], [15, 30], [70, 100]),
];

export const MOCK_PLANTS: Plant[] = [
  { id: 'p1', userId: 'u1', plantTypeId: 'pt1', nickname: 'Bassil', imageUrl: '', addedAt: '2026-09-20T09:00:00Z' },
  { id: 'p2', userId: 'u1', plantTypeId: 'pt3', nickname: 'Aloe Aly', imageUrl: '', addedAt: '2026-10-01T09:00:00Z' },
];

// 24 hourly readings (moisture, temperature, light). p1 dries out over time so the demo shows an alert.
export function makeReadings(plantId: string): SensorReading[] {
  const now = Date.now();
  const thirsty = plantId === 'p1';
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return Array.from({ length: 24 }, (_, i) => ({
    id: `${plantId}-${i}`, sensorId: 's-' + plantId,
    moisture: r1(thirsty ? 62 - i * 1.0 : 20 + Math.sin(i / 3) * 4),
    temperature: r1(24 + Math.sin(i / 4) * 3),
    light: r1(Math.max(65, 80 + Math.sin(i / 3) * 8)),
    recordedAt: new Date(now - (23 - i) * 3600_000).toISOString(),
  }));
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', plantId: 'p1', title: 'Bassil is thirsty', message: "I'm a little thirsty. Could I have some water?", type: 'NeedsWater', isRead: false, createdAt: new Date(Date.now() - 1800_000).toISOString() },
  { id: 'n2', plantId: 'p2', title: 'Aloe Aly is happy', message: 'All good here. Thanks for the care!', type: 'Healthy', isRead: true, createdAt: new Date(Date.now() - 86400_000).toISOString() },
];
