import { ContributionLevel } from '../models/Contribution';

const HEATMAP_COLORS: Record<ContributionLevel, string> = {
  0: '#EBEDF0',
  1: '#9BE9A8',
  2: '#40C463',
  3: '#30A14E',
  4: '#216E39',
};

export function getHeatmapColor(level: ContributionLevel): string {
  return HEATMAP_COLORS[level];
}

// Notion palette
export const Colors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceHover: '#F7F6F3',
  border: '#E8E7E3',
  borderLight: '#F0EFEB',
  textPrimary: '#37352F',
  textSecondary: '#6B6B6B',
  textTertiary: '#9B9A97',
  accent: '#2EAADC',
  error: '#EB5757',
  success: '#27AE60',
  divider: '#E8E7E3',
} as const;
