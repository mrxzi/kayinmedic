export interface BristolStoolType {
  type: number;
  name: string;
  category: 'constipation' | 'normal' | 'diarrhea';
  badgeLabel: string;
  shortDesc: string;
  detailedDesc: string;
  appearance: string; // Visual icon or SVG shape type
  isDiarrhea: boolean;
  alertLevel: 'none' | 'moderate' | 'high';
  advice: string;
}

export interface StoolLogEntry {
  id: string;
  timestamp: string; // ISO string
  type: number;
  painLevel: number;
  notes?: string;
}

export type FoodCategory = 'BRAT' | 'Minuman' | 'Makanan Pokok' | 'Protein' | 'Sayur & Buah' | 'Camilan & Bumbu';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  isSafe: boolean; // true = AMAN (#68FFDE), false = PANTANG (Soft Crimson/Orange)
  badge: string;
  shortReason: string;
  details: string;
  consumptionTips?: string;
  icon?: string;
}

export interface HydrationState {
  waterGlasses: number; // in count of glasses (250ml)
  oralitGlasses: number; // in count of glasses
  targetGlasses: number;
  lastDrinkTime?: string;
}

export interface UserSettings {
  partnerName: string;
  caregiverName: string;
  waNumber: string;
  patientAvatar?: string;
  adminAvatar?: string;
}
