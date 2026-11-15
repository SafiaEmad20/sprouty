import { ApiPlantType, PlantRequirement, PlantType } from '../models';

const CATEGORY: Record<string, string> = { 'أعشاب': 'Herbs', 'زهور': 'Flowers', 'عام': 'General', 'نباتات عصارية': 'Succulents', 'صبار': 'Succulents' };
export const categoryLabel = (c: string) => CATEGORY[(c ?? '').trim()] ?? c;

export function emojiFor(nameEn: string, category: string): string {
  const n = (nameEn ?? '').toLowerCase();
  const byName: Record<string, string> = { basil: '🌿', mint: '🍃', parsley: '🥬', aloe: '🪴', cactus: '🌵', rose: '🌹', marigold: '🌼', flowers: '🌸', generic: '🪴' };
  const hit = Object.keys(byName).find(k => n.includes(k));
  if (hit) return byName[hit];
  return ({ Herbs: '🌿', Succulents: '🪴', Flowers: '🌸', General: '🌱' } as Record<string, string>)[category] ?? '🌱';
}

export const DEFAULT_REQUIREMENT: PlantRequirement = {
  id: 'default', plantTypeId: '', minMoisture: 30, maxMoisture: 70, minTemperature: 15, maxTemperature: 30, minLight: 40, maxLight: 90,
};

/** Backend DTO -> frontend models. Care notes/steps/sun schedule are not in the API yet, so they stay empty. */
export function mapPlantType(a: ApiPlantType): { type: PlantType; requirement: PlantRequirement } {
  const category = categoryLabel(a.category);
  const r = a.requirement;
  return {
    type: { id: a.id, nameAr: a.nameAr, nameEn: a.nameEn, category, imageUrl: a.imageUrl ?? '', emoji: emojiFor(a.nameEn, category), careNotes: '', careSteps: [], sunSchedule: '' },
    requirement: r
      ? { id: a.id + '-req', plantTypeId: a.id, minMoisture: r.minMoisture, maxMoisture: r.maxMoisture, minTemperature: r.minTemperature, maxTemperature: r.maxTemperature, minLight: r.minLight, maxLight: r.maxLight }
      : { ...DEFAULT_REQUIREMENT, plantTypeId: a.id },
  };
}
