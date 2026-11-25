import { ApiPlantType, PlantRequirement, PlantType } from '../models';
import { mapRequirement } from './status';

const CATEGORY: Record<string, string> = { 'أعشاب': 'Herbs', 'زهور': 'Flowers', 'عام': 'General', 'نباتات عصارية': 'Succulents', 'صبار': 'Succulents' };
export const categoryLabel = (c: string) => CATEGORY[(c ?? '').trim()] ?? c;
export function emojiFor(nameEn: string, category: string): string {
  const n = (nameEn ?? '').toLowerCase();
  const byName: Record<string, string> = { basil: '', mint: '', parsley: '', aloe: '', cactus: '', rose: '', marigold: '', flowers: '', generic: '' };
  const hit = Object.keys(byName).find(k => n.includes(k));
  if (hit) return byName[hit];
  return ({ Herbs: '', Succulents: '', Flowers: '', General: '' } as Record<string, string>)[category] ?? '';
}
export function mapPlantType(a: ApiPlantType): { type: PlantType; requirement: PlantRequirement | null } {
  const category = categoryLabel(a.category);
  return {
    type: { id: a.id, nameAr: a.nameEn === 'Flowers' ? 'نبات مزهر (نوع عام)' : a.nameEn === 'Generic' ? 'نبات آخر' : a.nameAr, nameEn: a.nameEn === 'Flowers' ? 'Flowering plant' : a.nameEn === 'Generic' ? 'Other plant' : a.nameEn, category: a.nameEn === 'Generic' ? 'Other' : category, imageUrl: a.imageUrl ?? '', emoji: emojiFor(a.nameEn, category), careNotes: '', careSteps: [], sunSchedule: '' },
    requirement: mapRequirement(a.requirement, a.id),
  };
}
