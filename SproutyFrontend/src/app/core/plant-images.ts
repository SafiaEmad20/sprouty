
import { PlantType } from '../models';

// Distinct realistic fallback images for each plant type.
const PHOTOS: Record<string, string> = {
  basil: 'https://images.unsplash.com/photo-1664882366127-8f47fc5e58c8?auto=format&fit=crop&w=900&q=85',
  mint: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=85',
  flowers: 'https://images.unsplash.com/photo-1617655583693-685b47271164?auto=format&fit=crop&w=900&q=85',
  generic: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=85',
};

export function plantPhoto(type?: PlantType | null): string {
  if (!type) return '';

  if (type.imageUrl?.trim()) return type.imageUrl;

  const key = type.nameEn.toLowerCase();

  if (key.includes('basil')) return PHOTOS['basil'];
  if (key.includes('mint')) return PHOTOS['mint'];
  if (key.includes('flower')) return PHOTOS['flowers'];

  return PHOTOS['generic'];
}
