/**
 * Theme Configuration
 * Central configuration for all themes
 */

export const THEME_NAMES = {
  TECH_DARK: 'tech-dark',
  BIZ_CLEAN: 'biz-clean',
  EMOTIONAL_ESSAY: 'emotional-essay',
};

export const THEME_DISPLAY_NAMES = {
  'Tech Dark': THEME_NAMES.TECH_DARK,
  'Biz Clean': THEME_NAMES.BIZ_CLEAN,
  'Emotional Essay': THEME_NAMES.EMOTIONAL_ESSAY,
};

export const THEME_CONFIG = {
  [THEME_NAMES.TECH_DARK]: {
    name: 'Tech Dark',
    displayName: 'Tech Dark',
    backgroundColor: '#000000',
    backgroundGradient: 'from-slate-900 via-black to-slate-900',
    textColor: 'text-white',
    highlightColor: 'text-cyan-400',
    accentColor: 'cyan',
    accentGradient: 'from-cyan-500 to-blue-600',
    fontFamily: 'font-sans',
    overlayOpacity: 'bg-black/50',
    layout: 'left',
    description: 'IT 제품 리뷰, 테크 정보',
  },
  [THEME_NAMES.BIZ_CLEAN]: {
    name: 'Biz Clean',
    displayName: 'Biz Clean',
    backgroundColor: '#f8fafc',
    backgroundGradient: 'bg-slate-50',
    textColor: 'text-slate-900',
    highlightColor: 'text-blue-600',
    accentColor: 'blue',
    accentGradient: 'bg-blue-600',
    fontFamily: 'font-sans',
    overlayOpacity: 'bg-black/45',
    layout: 'left',
    description: '공식 공지, 이벤트, 비즈니스',
  },
  [THEME_NAMES.EMOTIONAL_ESSAY]: {
    name: 'Emotional Essay',
    displayName: 'Emotional Essay',
    backgroundColor: '#fffef8',
    backgroundGradient: 'bg-[#fffef8]',
    textColor: 'text-[#2c2416]',
    highlightColor: 'text-amber-600',
    accentColor: 'amber',
    accentGradient: 'border-[#8B7355]',
    fontFamily: 'font-serif',
    overlayOpacity: 'bg-black/40',
    layout: 'center',
    description: '감성 글, 에세이, 일상',
  },
};

/**
 * Get theme configuration by theme class
 */
export const getThemeConfig = (themeClass) => {
  return THEME_CONFIG[themeClass] || THEME_CONFIG[THEME_NAMES.TECH_DARK];
};

/**
 * Get background color for download
 */
export const getThemeBackgroundColor = (themeClass) => {
  const config = getThemeConfig(themeClass);
  return config.backgroundColor;
};
