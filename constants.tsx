
import { TeamColor } from './types';

export const COLORS_MAP: Record<TeamColor, { bg: string, text: string, hex: string, surface: string, border: string }> = {
  [TeamColor.Blue]: { bg: 'bg-[#4AA8FF]', text: 'text-white', hex: '#4AA8FF', surface: '#1E3A5F', border: '#4AA8FF' },
  [TeamColor.Red]: { bg: 'bg-[#FF6363]', text: 'text-white', hex: '#FF6363', surface: '#4A1E29', border: '#FF6363' },
  [TeamColor.Green]: { bg: 'bg-[#6CFF7D]', text: 'text-black', hex: '#6CFF7D', surface: '#1E4A2A', border: '#6CFF7D' },
  [TeamColor.Yellow]: { bg: 'bg-[#FFD447]', text: 'text-black', hex: '#FFD447', surface: '#4A431E', border: '#FFD447' },
};

export const UI_COLORS = {
  bgPrimary: '#17142C',
  bgSecondary: '#241B3D',
  correct: '#9CFF57',
  passSwap: '#43D9FF',
  danger: '#FF6B6B',
  darkBorder: '#181425',
  neonPink: '#FF007F'
};

// Use identifiers as keys for i18n lookup
export const CATEGORIES: Record<string, string[]> = {
  "CAT_OBJECTS": [],
  "CAT_FOOD": [],
  "CAT_ANIMALS": [],
  "CAT_JOBS": [],
  "CAT_PLACES": [],
  "CAT_VEHICLES": [],
  "CAT_FEELINGS": [],
  "CAT_SPORTS": [],
  "CAT_ADJECTIVES": [],
  "CAT_TECH": [],
  "CAT_ENTERTAINMENT": []
};
