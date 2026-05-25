// UAO Brand Colors
export const Colors = {
  primaryRed: '#C8102E',
  primaryRedDark: '#A00D24',
  darkGray: '#333333',
  white: '#FFFFFF',
  accentGold: '#FFB81C',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  error: '#D32F2F',
  success: '#2E7D32',
  inactive: '#999999',
  border: '#E0E0E0',
} as const;

// Gradient tuples for expo-linear-gradient
export const Gradients = {
  primaryButton: ['#C8102E', '#A00D24'] as const,
} as const;

// Walking speed in meters per minute
export const WALKING_SPEED_M_PER_MIN = 80;

// Font families with platform fallbacks
import { Platform } from 'react-native';

const systemFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'Arial, sans-serif',
}) as string;

export const Fonts = {
  headingBold: 'Montserrat_700Bold',
  headingSemiBold: 'Montserrat_600SemiBold',
  bodyRegular: 'OpenSans_400Regular',
  bodyMedium: 'OpenSans_500Medium',
  fallback: systemFont,
} as const;

// Spacing (8pt grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
