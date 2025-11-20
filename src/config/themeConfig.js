/**
 * Theme Configuration
 * Central configuration for all themes
 */

export const THEME_NAMES = {
  TECH_DARK: 'tech-dark',
  BIZ_CLEAN: 'biz-clean',
  EMOTIONAL_ESSAY: 'emotional-essay',
  MINIMALIST_CARD: 'minimalist-card',
  BOLD_MAGAZINE: 'bold-magazine',
  INSTAGRAM_STORY: 'instagram-story',
};

export const THEME_DISPLAY_NAMES = {
  'Tech Dark': THEME_NAMES.TECH_DARK,
  'Biz Clean': THEME_NAMES.BIZ_CLEAN,
  'Emotional Essay': THEME_NAMES.EMOTIONAL_ESSAY,
  'Minimalist Card': THEME_NAMES.MINIMALIST_CARD,
  'Bold Magazine': THEME_NAMES.BOLD_MAGAZINE,
  'Instagram Story': THEME_NAMES.INSTAGRAM_STORY,
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
  [THEME_NAMES.MINIMALIST_CARD]: {
    name: 'Minimalist Card',
    displayName: 'Minimalist Card',
    backgroundColor: '#f9fafb',
    backgroundGradient: 'from-gray-50 to-gray-100',
    textColor: 'text-gray-900',
    highlightColor: 'text-indigo-600',
    accentColor: 'indigo',
    accentGradient: 'from-indigo-500 to-purple-600',
    fontFamily: 'font-sans',
    overlayOpacity: 'bg-white/80',
    layout: 'center',
    description: '미니멀 카드, 깔끔한 디자인',
  },
  [THEME_NAMES.BOLD_MAGAZINE]: {
    name: 'Bold Magazine',
    displayName: 'Bold Magazine',
    backgroundColor: '#ffffff',
    backgroundGradient: 'bg-white',
    textColor: 'text-black',
    highlightColor: 'text-red-600',
    accentColor: 'red',
    accentGradient: 'bg-red-600',
    fontFamily: 'font-sans',
    overlayOpacity: 'bg-white/85',
    layout: 'left',
    description: '잡지 스타일, 대담한 타이포',
  },
  [THEME_NAMES.INSTAGRAM_STORY]: {
    name: 'Instagram Story',
    displayName: 'Instagram Story',
    backgroundColor: '#8b5cf6',
    backgroundGradient: 'from-purple-600 via-pink-500 to-orange-400',
    textColor: 'text-white',
    highlightColor: 'text-pink-400',
    accentColor: 'pink',
    accentGradient: 'from-pink-500 to-rose-500',
    fontFamily: 'font-sans',
    overlayOpacity: 'bg-gradient-to-b from-black/40 via-black/30 to-black/60',
    layout: 'center',
    description: '스토리 최적화, 세로형 레이아웃',
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
