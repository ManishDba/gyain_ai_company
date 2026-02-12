/**
 * App Theme Configuration
 * Fully responsive design for iOS & Android, mobile & tablet
 * Font: Manrope
 * Icons: Phosphor Icons
 */

import { Dimensions, Platform, PixelRatio } from 'react-native';

// Device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Device type detection
const isTablet = SCREEN_WIDTH >= 768;
const isSmallPhone = SCREEN_WIDTH < 375;

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const AppColors = {
  // Primary Dark Colors
  darkest: '#191919', // Main dark background
  dark: '#262625', // Secondary dark
  darkMedium: '#40403E', // Medium dark

  // Light/Background Colors
  lightMedium: '#E5E5DF', // Light medium
  light: '#F0F0EB', // Light background
  lightest: '#FAFAF7', // Lightest background

  // Gray Scale
  gray: '#666663', // Primary gray
  grayMedium: '#91918D', // Medium gray
  grayLight: '#BFBFBA', // Light gray

  // Accent Colors
  terracotta: '#CC785C', // Primary accent
  sand: '#D4A27F', // Secondary accent
  cream: '#EBDBBC', // Tertiary accent

  // Semantic Colors
  background: '#FAFAF7', // Main background
  surface: '#F0F0EB', // Card/surface background
  surfaceElevated: '#FFFFFF', // Elevated surface
  
  // Text Colors
  textPrimary: '#191919', // Primary text
  textSecondary: '#666663', // Secondary text
  textTertiary: '#91918D', // Tertiary text
  textOnDark: '#FAFAF7', // Text on dark backgrounds
  textOnAccent: '#FFFFFF', // Text on accent colors

  // Border Colors
  border: '#E5E5DF', // Default border
  borderLight: '#F0F0EB', // Light border
  borderMedium: '#BFBFBA', // Medium border
  borderDark: '#91918D', // Dark border

  // Status Colors (using your palette)
  success: '#D4A27F', // Sand for success
  warning: '#CC785C', // Terracotta for warning
  error: '#CC785C', // Terracotta for error
  info: '#91918D', // Medium gray for info

  // Interactive States
  hover: 'rgba(204, 120, 92, 0.08)', // Terracotta hover
  pressed: 'rgba(204, 120, 92, 0.16)', // Terracotta pressed
  disabled: '#BFBFBA', // Light gray
  disabledText: '#91918D', // Medium gray

  // Overlay Colors
  overlayLight: 'rgba(25, 25, 25, 0.3)',
  overlayMedium: 'rgba(25, 25, 25, 0.5)',
  overlayDark: 'rgba(25, 25, 25, 0.7)',
  overlayWhite: 'rgba(255, 255, 255, 0.3)',

  // Shadow Colors
  shadow: '#191919',
  shadowLight: 'rgba(25, 25, 25, 0.08)',
  shadowMedium: 'rgba(25, 25, 25, 0.12)',
  shadowDark: 'rgba(25, 25, 25, 0.16)',

  // Special Colors
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

// ============================================================================
// RESPONSIVE SIZING SYSTEM
// ============================================================================

// Normalize function for responsive sizing
const scale = (size) => {
  const baseWidth = 375; // iPhone 11 Pro base width
  return (SCREEN_WIDTH / baseWidth) * size;
};

const verticalScale = (size) => {
  const baseHeight = 812; // iPhone 11 Pro base height
  return (SCREEN_HEIGHT / baseHeight) * size;
};

const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

export const AppSizes = {
  // Screen Dimensions
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isTablet,
  isSmallPhone,

  // Responsive Padding & Margins
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(40),
  xxxl: moderateScale(48),

  // Responsive Border Radius
  radiusXs: moderateScale(4),
  radiusSm: moderateScale(8),
  radiusMd: moderateScale(12),
  radiusLg: moderateScale(16),
  radiusXl: moderateScale(24),
  radiusXxl: moderateScale(32),
  radiusRound: 9999,

  // Responsive Icon Sizes
  iconXs: moderateScale(16),
  iconSm: moderateScale(20),
  iconMd: moderateScale(24),
  iconLg: moderateScale(32),
  iconXl: moderateScale(40),
  iconXxl: moderateScale(48),

  // Responsive Button Heights
  buttonSm: moderateScale(36),
  buttonMd: moderateScale(44),
  buttonLg: moderateScale(52),
  buttonXl: moderateScale(60),

  // Responsive Input Heights
  inputSm: moderateScale(36),
  inputMd: moderateScale(44),
  inputLg: moderateScale(52),
  inputXl: moderateScale(60),

  // Responsive Card Heights
  cardSm: moderateScale(80),
  cardMd: moderateScale(120),
  cardLg: moderateScale(160),
  cardXl: moderateScale(200),
  cardXxl: moderateScale(240),

  // Responsive Header Heights
  headerHeight: Platform.select({
    ios: moderateScale(44),
    android: moderateScale(56),
  }),
  tabBarHeight: moderateScale(60),

  // Responsive Container Widths
  containerSm: SCREEN_WIDTH * 0.9,
  containerMd: SCREEN_WIDTH * 0.85,
  containerLg: isTablet ? 720 : SCREEN_WIDTH * 0.9,
  containerXl: isTablet ? 1140 : SCREEN_WIDTH,

  // Safe Area (for notched devices)
  safeAreaTop: Platform.OS === 'ios' ? moderateScale(44) : moderateScale(24),
  safeAreaBottom: Platform.OS === 'ios' ? moderateScale(34) : moderateScale(16),

  // Responsive Spacing Scale
  space1: moderateScale(4),
  space2: moderateScale(8),
  space3: moderateScale(12),
  space4: moderateScale(16),
  space5: moderateScale(20),
  space6: moderateScale(24),
  space7: moderateScale(28),
  space8: moderateScale(32),
  space9: moderateScale(36),
  space10: moderateScale(40),
};

// ============================================================================
// TYPOGRAPHY SYSTEM - MANROPE FONT FAMILY
// ============================================================================

export const AppFonts = {
  // Manrope Font Families
  light: 'Manrope-Light', // 300
  regular: 'Manrope-Regular', // 400
  medium: 'Manrope-Medium', // 500
  semiBold: 'Manrope-SemiBold', // 600
  bold: 'Manrope-Bold', // 700
  extraBold: 'Manrope-ExtraBold', // 800

  // Responsive Font Sizes
  xs: moderateScale(10),
  sm: moderateScale(12),
  base: moderateScale(14),
  md: moderateScale(16),
  lg: moderateScale(18),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(28),
  xxxxl: moderateScale(32),
  xxxxxl: moderateScale(36),
  huge: moderateScale(40),
  massive: moderateScale(48),

  // Responsive Line Heights
  lineHeightTight: 1.2,
  lineHeightSnug: 1.3,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,
  lineHeightLoose: 1.8,

  // Letter Spacing
  letterSpacingTight: -0.5,
  letterSpacingNormal: 0,
  letterSpacingWide: 0.5,
  letterSpacingWider: 1,
};

// Helper function to get Manrope font family based on weight
export const getFontFamily = (weight) => {
  const weightMap = {
    300: AppFonts.light,
    light: AppFonts.light,
    400: AppFonts.regular,
    normal: AppFonts.regular,
    regular: AppFonts.regular,
    500: AppFonts.medium,
    medium: AppFonts.medium,
    600: AppFonts.semiBold,
    semibold: AppFonts.semiBold,
    semiBold: AppFonts.semiBold,
    700: AppFonts.bold,
    bold: AppFonts.bold,
    800: AppFonts.extraBold,
    extrabold: AppFonts.extraBold,
    extraBold: AppFonts.extraBold,
  };

  return weightMap[String(weight)] || AppFonts.regular;
};

// Helper to create text styles with Manrope
export const createTextStyle = (styles = {}) => {
  const { fontWeight, ...restStyles } = styles;
  const fontFamily = fontWeight ? getFontFamily(fontWeight) : AppFonts.regular;

  return {
    fontFamily,
    ...restStyles,
  };
};

// Predefined Text Styles
export const TextStyles = {
  // Display Styles
  displayLarge: createTextStyle({
    fontSize: AppFonts.massive,
    fontWeight: 'bold',
    lineHeight: AppFonts.massive * AppFonts.lineHeightTight,
    letterSpacing: AppFonts.letterSpacingTight,
    color: AppColors.textPrimary,
  }),
  displayMedium: createTextStyle({
    fontSize: AppFonts.huge,
    fontWeight: 'bold',
    lineHeight: AppFonts.huge * AppFonts.lineHeightTight,
    letterSpacing: AppFonts.letterSpacingTight,
    color: AppColors.textPrimary,
  }),
  displaySmall: createTextStyle({
    fontSize: AppFonts.xxxxxl,
    fontWeight: 'semiBold',
    lineHeight: AppFonts.xxxxxl * AppFonts.lineHeightSnug,
    color: AppColors.textPrimary,
  }),

  // Heading Styles
  h1: createTextStyle({
    fontSize: AppFonts.xxxxl,
    fontWeight: 'bold',
    lineHeight: AppFonts.xxxxl * AppFonts.lineHeightSnug,
    color: AppColors.textPrimary,
  }),
  h2: createTextStyle({
    fontSize: AppFonts.xxxl,
    fontWeight: 'semiBold',
    lineHeight: AppFonts.xxxl * AppFonts.lineHeightSnug,
    color: AppColors.textPrimary,
  }),
  h3: createTextStyle({
    fontSize: AppFonts.xxl,
    fontWeight: 'semiBold',
    lineHeight: AppFonts.xxl * AppFonts.lineHeightNormal,
    color: AppColors.textPrimary,
  }),
  h4: createTextStyle({
    fontSize: AppFonts.xl,
    fontWeight: 'medium',
    lineHeight: AppFonts.xl * AppFonts.lineHeightNormal,
    color: AppColors.textPrimary,
  }),
  h5: createTextStyle({
    fontSize: AppFonts.lg,
    fontWeight: 'medium',
    lineHeight: AppFonts.lg * AppFonts.lineHeightNormal,
    color: AppColors.textPrimary,
  }),
  h6: createTextStyle({
    fontSize: AppFonts.md,
    fontWeight: 'medium',
    lineHeight: AppFonts.md * AppFonts.lineHeightNormal,
    color: AppColors.textPrimary,
  }),

  // Body Styles
  bodyLarge: createTextStyle({
    fontSize: AppFonts.lg,
    fontWeight: 'regular',
    lineHeight: AppFonts.lg * AppFonts.lineHeightRelaxed,
    color: AppColors.textPrimary,
  }),
  bodyMedium: createTextStyle({
    fontSize: AppFonts.md,
    fontWeight: 'regular',
    lineHeight: AppFonts.md * AppFonts.lineHeightRelaxed,
    color: AppColors.textPrimary,
  }),
  bodySmall: createTextStyle({
    fontSize: AppFonts.base,
    fontWeight: 'regular',
    lineHeight: AppFonts.base * AppFonts.lineHeightRelaxed,
    color: AppColors.textPrimary,
  }),

  // Label Styles
  labelLarge: createTextStyle({
    fontSize: AppFonts.md,
    fontWeight: 'medium',
    lineHeight: AppFonts.md * AppFonts.lineHeightNormal,
    color: AppColors.textPrimary,
  }),
  labelMedium: createTextStyle({
    fontSize: AppFonts.base,
    fontWeight: 'medium',
    lineHeight: AppFonts.base * AppFonts.lineHeightNormal,
    color: AppColors.textPrimary,
  }),
  labelSmall: createTextStyle({
    fontSize: AppFonts.sm,
    fontWeight: 'medium',
    lineHeight: AppFonts.sm * AppFonts.lineHeightNormal,
    color: AppColors.textSecondary,
  }),

  // Caption Styles
  caption: createTextStyle({
    fontSize: AppFonts.sm,
    fontWeight: 'regular',
    lineHeight: AppFonts.sm * AppFonts.lineHeightNormal,
    color: AppColors.textSecondary,
  }),
  captionBold: createTextStyle({
    fontSize: AppFonts.sm,
    fontWeight: 'semiBold',
    lineHeight: AppFonts.sm * AppFonts.lineHeightNormal,
    color: AppColors.textSecondary,
  }),

  // Button Styles
  button: createTextStyle({
    fontSize: AppFonts.md,
    fontWeight: 'semiBold',
    lineHeight: AppFonts.md * AppFonts.lineHeightNormal,
    color: AppColors.white,
    textTransform: 'none',
  }),
  buttonSmall: createTextStyle({
    fontSize: AppFonts.base,
    fontWeight: 'semiBold',
    lineHeight: AppFonts.base * AppFonts.lineHeightNormal,
    color: AppColors.white,
  }),
};

// ============================================================================
// SHADOWS - RESPONSIVE ELEVATION SYSTEM
// ============================================================================

export const AppShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: moderateScale(1) },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(2),
    elevation: 1,
  },
  sm: {
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3),
    elevation: 2,
  },
  md: {
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.12,
    shadowRadius: moderateScale(6),
    elevation: 4,
  },
  lg: {
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: moderateScale(8) },
    shadowOpacity: 0.14,
    shadowRadius: moderateScale(10),
    elevation: 8,
  },
  xl: {
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: moderateScale(12) },
    shadowOpacity: 0.16,
    shadowRadius: moderateScale(16),
    elevation: 12,
  },
  xxl: {
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: moderateScale(16) },
    shadowOpacity: 0.18,
    shadowRadius: moderateScale(24),
    elevation: 16,
  },
};

// ============================================================================
// PHOSPHOR ICONS CONFIGURATION
// ============================================================================

export const IconConfig = {
  // Default icon library: Phosphor
  library: 'phosphor',
  
  // Icon weights (Phosphor specific)
  weights: {
    thin: 'thin',
    light: 'light',
    regular: 'regular',
    bold: 'bold',
    fill: 'fill',
    duotone: 'duotone',
  },

  // Default icon size
  defaultSize: AppSizes.iconMd,
  defaultWeight: 'regular',
  defaultColor: AppColors.textPrimary,

  // Icon size presets
  sizes: {
    xs: AppSizes.iconXs,
    sm: AppSizes.iconSm,
    md: AppSizes.iconMd,
    lg: AppSizes.iconLg,
    xl: AppSizes.iconXl,
    xxl: AppSizes.iconXxl,
  },

  // Commonly used icon colors
  colors: {
    primary: AppColors.textPrimary,
    secondary: AppColors.textSecondary,
    tertiary: AppColors.textTertiary,
    accent: AppColors.terracotta,
    light: AppColors.grayLight,
    dark: AppColors.darkest,
    white: AppColors.white,
  },
};

// Helper function to get icon props
export const getIconProps = (size = 'md', color = 'primary', weight = 'regular') => {
  return {
    size: typeof size === 'number' ? size : IconConfig.sizes[size] || IconConfig.defaultSize,
    color: IconConfig.colors[color] || color,
    weight: IconConfig.weights[weight] || weight,
  };
};

// ============================================================================
// COMPONENT STYLES
// ============================================================================

export const ComponentStyles = {
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  containerPadded: {
    flex: 1,
    backgroundColor: AppColors.background,
    padding: AppSizes.md,
  },
  containerCentered: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card Styles
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: AppSizes.radiusMd,
    padding: AppSizes.md,
    ...AppShadows.sm,
  },
  cardElevated: {
    backgroundColor: AppColors.surfaceElevated,
    borderRadius: AppSizes.radiusMd,
    padding: AppSizes.md,
    ...AppShadows.md,
  },
  cardOutlined: {
    backgroundColor: AppColors.surface,
    borderRadius: AppSizes.radiusMd,
    padding: AppSizes.md,
    borderWidth: 1,
    borderColor: AppColors.border,
  },

  // Button Base Styles
  buttonBase: {
    height: AppSizes.buttonMd,
    paddingHorizontal: AppSizes.lg,
    borderRadius: AppSizes.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonPrimary: {
    backgroundColor: AppColors.terracotta,
  },
  buttonSecondary: {
    backgroundColor: AppColors.sand,
  },
  buttonOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AppColors.terracotta,
  },
  buttonText: {
    backgroundColor: 'transparent',
  },

  // Input Styles
  input: {
    height: AppSizes.inputMd,
    borderRadius: AppSizes.radiusMd,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingHorizontal: AppSizes.md,
    backgroundColor: AppColors.surface,
    ...createTextStyle({
      fontSize: AppFonts.md,
      color: AppColors.textPrimary,
    }),
  },
  inputFocused: {
    borderColor: AppColors.terracotta,
    borderWidth: 2,
  },
  inputError: {
    borderColor: AppColors.error,
  },

  // Header Styles
  header: {
    height: AppSizes.headerHeight,
    backgroundColor: AppColors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppSizes.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },

  // Tab Bar Styles
  tabBar: {
    height: AppSizes.tabBarHeight,
    backgroundColor: AppColors.background,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    flexDirection: 'row',
    paddingBottom: AppSizes.safeAreaBottom,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: AppColors.border,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: AppColors.border,
  },
};

// ============================================================================
// ANIMATION CONFIGURATION
// ============================================================================

export const AnimationConfig = {
  // Timing
  timing: {
    fast: 150,
    normal: 250,
    slow: 350,
    verySlow: 500,
  },

  // Easing (for use with Animated API)
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },

  // Spring configurations
  spring: {
    gentle: {
      damping: 20,
      stiffness: 150,
    },
    bouncy: {
      damping: 10,
      stiffness: 100,
    },
    stiff: {
      damping: 15,
      stiffness: 200,
    },
  },
};

// ============================================================================
// LAYOUT BREAKPOINTS
// ============================================================================

export const Breakpoints = {
  small: 320,
  medium: 375,
  large: 414,
  tablet: 768,
  desktop: 1024,
};

// Helper to check device size
export const isDevice = {
  small: SCREEN_WIDTH < Breakpoints.medium,
  medium: SCREEN_WIDTH >= Breakpoints.medium && SCREEN_WIDTH < Breakpoints.large,
  large: SCREEN_WIDTH >= Breakpoints.large && SCREEN_WIDTH < Breakpoints.tablet,
  tablet: SCREEN_WIDTH >= Breakpoints.tablet && SCREEN_WIDTH < Breakpoints.desktop,
  desktop: SCREEN_WIDTH >= Breakpoints.desktop,
};

// ============================================================================
// MAIN THEME EXPORT
// ============================================================================

export const AppTheme = {
  colors: AppColors,
  sizes: AppSizes,
  fonts: AppFonts,
  textStyles: TextStyles,
  shadows: AppShadows,
  icons: IconConfig,
  components: ComponentStyles,
  animation: AnimationConfig,
  breakpoints: Breakpoints,
  isDevice,
  
  // Helper functions
  getFontFamily,
  createTextStyle,
  getIconProps,
  
  // Responsive functions
  scale,
  verticalScale,
  moderateScale,
};

// Default export
export default AppTheme;