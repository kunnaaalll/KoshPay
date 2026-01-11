import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// On Web, we want fixed mobile-like scaling, not blown up full screen
const isWeb = Platform.OS === 'web';
const CLAMP_WIDTH = isWeb ? Math.min(SCREEN_WIDTH, 450) : SCREEN_WIDTH;
const CLAMP_HEIGHT = isWeb ? Math.min(SCREEN_HEIGHT, 900) : SCREEN_HEIGHT;

export const scale = (size: number) => {
  return (CLAMP_WIDTH / BASE_WIDTH) * size;
};

export const verticalScale = (size: number) => {
  return (CLAMP_HEIGHT / BASE_HEIGHT) * size;
};

export const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

export const scaleFont = (size: number) => {
  const newSize = scale(size);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }
};

export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

export const isSmallDevice = SCREEN_HEIGHT < 700; // iPhone SE
export const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;
export const isLargeDevice = SCREEN_HEIGHT >= 900;
