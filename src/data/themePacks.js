/**
 * Theme Packs - Complete design sets (cover + body + CTA)
 * Each pack includes coordinated colors, fonts, and styles
 */

export const THEME_PACKS = {
  'modernMinimal': {
    id: 'modernMinimal',
    name: '모던 미니멀',
    icon: '⬜',
    description: '깔끔하고 세련된 비즈니스 스타일',
    category: 'business',
    tags: ['비즈니스', '깔끔', '전문적'],
    preview: {
      background: '#ffffff',
      accent: '#000000',
      text: '#1a1a1a'
    },
    cover: {
      background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
      titleColor: '#000000',
      subtitleColor: '#666666',
      accentColor: '#000000',
      pattern: null
    },
    body: {
      background: '#ffffff',
      titleColor: '#000000',
      textColor: '#333333',
      accentColor: '#000000',
      highlightColor: '#f0f0f0',
      numberBg: '#000000',
      numberColor: '#ffffff'
    },
    cta: {
      background: '#000000',
      titleColor: '#ffffff',
      textColor: '#cccccc',
      buttonBg: '#ffffff',
      buttonColor: '#000000'
    }
  },

  'vibrantGradient': {
    id: 'vibrantGradient',
    name: '비비드 그라디언트',
    icon: '🌈',
    description: '눈에 띄는 화려한 그라디언트',
    category: 'creative',
    tags: ['화려함', '그라디언트', '트렌디'],
    preview: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: '#ffd700',
      text: '#ffffff'
    },
    cover: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255,255,255,0.9)',
      accentColor: '#ffd700',
      pattern: null
    },
    body: {
      background: 'linear-gradient(180deg, #f5f7fa 0%, #e4e8ec 100%)',
      titleColor: '#667eea',
      textColor: '#333333',
      accentColor: '#764ba2',
      highlightColor: '#667eea',
      numberBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.9)',
      buttonBg: '#ffd700',
      buttonColor: '#1a1a1a'
    }
  },

  'warmSunset': {
    id: 'warmSunset',
    name: '웜 선셋',
    icon: '🌅',
    description: '따뜻하고 감성적인 노을빛',
    category: 'lifestyle',
    tags: ['감성', '따뜻함', '일상'],
    preview: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: '#fff3e0',
      text: '#ffffff'
    },
    cover: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255,255,255,0.95)',
      accentColor: '#fff3e0',
      pattern: null
    },
    body: {
      background: '#fffaf5',
      titleColor: '#f5576c',
      textColor: '#4a3f3f',
      accentColor: '#f093fb',
      highlightColor: '#fff0f5',
      numberBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.9)',
      buttonBg: '#ffffff',
      buttonColor: '#f5576c'
    }
  },

  'techDark': {
    id: 'techDark',
    name: '테크 다크',
    icon: '🖥️',
    description: 'IT/테크 콘텐츠에 최적화',
    category: 'tech',
    tags: ['테크', 'IT', '다크모드'],
    preview: {
      background: '#0a0a0a',
      accent: '#00d4ff',
      text: '#ffffff'
    },
    cover: {
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      titleColor: '#ffffff',
      subtitleColor: '#00d4ff',
      accentColor: '#00d4ff',
      pattern: 'radial-gradient(circle, rgba(0,212,255,0.1) 1px, transparent 1px)'
    },
    body: {
      background: '#0f0f0f',
      titleColor: '#00d4ff',
      textColor: '#e0e0e0',
      accentColor: '#00d4ff',
      highlightColor: '#1a1a2e',
      numberBg: '#00d4ff',
      numberColor: '#000000'
    },
    cta: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)',
      titleColor: '#00d4ff',
      textColor: '#ffffff',
      buttonBg: '#00d4ff',
      buttonColor: '#000000'
    }
  },

  'neonPunk': {
    id: 'neonPunk',
    name: '네온 펑크',
    icon: '💜',
    description: '사이버펑크 스타일 네온',
    category: 'creative',
    tags: ['네온', '펑크', '사이버'],
    preview: {
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)',
      accent: '#ff00ff',
      text: '#00fff9'
    },
    cover: {
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      titleColor: '#00fff9',
      subtitleColor: '#ff00ff',
      accentColor: '#ff00ff',
      pattern: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,249,0.03) 2px, rgba(0,255,249,0.03) 4px)',
      glow: '0 0 20px rgba(0,255,249,0.5)'
    },
    body: {
      background: '#0f0c29',
      titleColor: '#ff00ff',
      textColor: '#00fff9',
      accentColor: '#ff00ff',
      highlightColor: 'rgba(255,0,255,0.1)',
      numberBg: '#ff00ff',
      numberColor: '#000000',
      glow: '0 0 10px rgba(255,0,255,0.5)'
    },
    cta: {
      background: 'linear-gradient(135deg, #24243e 0%, #0f0c29 100%)',
      titleColor: '#00fff9',
      textColor: '#ff00ff',
      buttonBg: 'linear-gradient(90deg, #00fff9 0%, #ff00ff 100%)',
      buttonColor: '#000000',
      glow: '0 0 15px rgba(0,255,249,0.5)'
    }
  },

  'softPastel': {
    id: 'softPastel',
    name: '소프트 파스텔',
    icon: '🍬',
    description: '부드럽고 편안한 파스텔톤',
    category: 'lifestyle',
    tags: ['파스텔', '부드러움', '감성'],
    preview: {
      background: '#ffeef8',
      accent: '#b8a9c9',
      text: '#5c4a5e'
    },
    cover: {
      background: 'linear-gradient(180deg, #ffeef8 0%, #e8f4f8 100%)',
      titleColor: '#5c4a5e',
      subtitleColor: '#8b7a8b',
      accentColor: '#b8a9c9',
      pattern: null
    },
    body: {
      background: '#fefefe',
      titleColor: '#5c4a5e',
      textColor: '#6b5b6e',
      accentColor: '#b8a9c9',
      highlightColor: '#f5e6f0',
      numberBg: 'linear-gradient(135deg, #b8a9c9 0%, #a8d8ea 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #b8a9c9 0%, #a8d8ea 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.95)',
      buttonBg: '#ffffff',
      buttonColor: '#5c4a5e'
    }
  },

  'boldMagazine': {
    id: 'boldMagazine',
    name: '볼드 매거진',
    icon: '📰',
    description: '대담하고 임팩트 있는 매거진 스타일',
    category: 'business',
    tags: ['매거진', '대담', '임팩트'],
    preview: {
      background: '#ffffff',
      accent: '#ff0000',
      text: '#000000'
    },
    cover: {
      background: '#ffffff',
      titleColor: '#000000',
      subtitleColor: '#ff0000',
      accentColor: '#ff0000',
      pattern: null
    },
    body: {
      background: '#f8f8f8',
      titleColor: '#ff0000',
      textColor: '#1a1a1a',
      accentColor: '#ff0000',
      highlightColor: '#fff0f0',
      numberBg: '#ff0000',
      numberColor: '#ffffff'
    },
    cta: {
      background: '#ff0000',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.9)',
      buttonBg: '#000000',
      buttonColor: '#ffffff'
    }
  },

  'naturalEarth': {
    id: 'naturalEarth',
    name: '네추럴 어스',
    icon: '🌿',
    description: '자연스럽고 따뜻한 어스톤',
    category: 'lifestyle',
    tags: ['자연', '어스톤', '힐링'],
    preview: {
      background: '#f5f0e8',
      accent: '#8b7355',
      text: '#3e3028'
    },
    cover: {
      background: 'linear-gradient(180deg, #f5f0e8 0%, #e8dfd0 100%)',
      titleColor: '#3e3028',
      subtitleColor: '#8b7355',
      accentColor: '#8b7355',
      pattern: null
    },
    body: {
      background: '#faf8f5',
      titleColor: '#3e3028',
      textColor: '#5a4a3a',
      accentColor: '#8b7355',
      highlightColor: '#f0ebe0',
      numberBg: '#8b7355',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #8b7355 0%, #6b5545 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.9)',
      buttonBg: '#f5f0e8',
      buttonColor: '#3e3028'
    }
  },

  'oceanBlue': {
    id: 'oceanBlue',
    name: '오션 블루',
    icon: '🌊',
    description: '시원하고 청량한 바다 느낌',
    category: 'lifestyle',
    tags: ['시원함', '바다', '청량'],
    preview: {
      background: 'linear-gradient(180deg, #89f7fe 0%, #66a6ff 100%)',
      accent: '#0066cc',
      text: '#ffffff'
    },
    cover: {
      background: 'linear-gradient(180deg, #89f7fe 0%, #66a6ff 100%)',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255,255,255,0.95)',
      accentColor: '#ffffff',
      pattern: null
    },
    body: {
      background: '#f0f9ff',
      titleColor: '#0066cc',
      textColor: '#1a3a5c',
      accentColor: '#0088ff',
      highlightColor: '#e0f2fe',
      numberBg: 'linear-gradient(135deg, #66a6ff 0%, #89f7fe 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #66a6ff 0%, #0066cc 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.9)',
      buttonBg: '#ffffff',
      buttonColor: '#0066cc'
    }
  },

  'luxuryGold': {
    id: 'luxuryGold',
    name: '럭셔리 골드',
    icon: '✨',
    description: '고급스럽고 프리미엄한 느낌',
    category: 'business',
    tags: ['럭셔리', '고급', '프리미엄'],
    preview: {
      background: '#1a1a1a',
      accent: '#d4af37',
      text: '#ffffff'
    },
    cover: {
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      titleColor: '#d4af37',
      subtitleColor: '#ffffff',
      accentColor: '#d4af37',
      pattern: 'radial-gradient(circle, rgba(212,175,55,0.05) 1px, transparent 1px)'
    },
    body: {
      background: '#f8f6f0',
      titleColor: '#1a1a1a',
      textColor: '#333333',
      accentColor: '#d4af37',
      highlightColor: '#faf5e8',
      numberBg: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
      numberColor: '#1a1a1a'
    },
    cta: {
      background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
      titleColor: '#d4af37',
      textColor: '#ffffff',
      buttonBg: 'linear-gradient(90deg, #d4af37 0%, #f4d03f 100%)',
      buttonColor: '#1a1a1a'
    }
  }
};

/**
 * Theme pack categories
 */
export const PACK_CATEGORIES = {
  business: { name: '💼 비즈니스', description: '전문적이고 신뢰감 있는 스타일' },
  creative: { name: '🎨 크리에이티브', description: '창의적이고 눈에 띄는 스타일' },
  lifestyle: { name: '🌿 라이프스타일', description: '일상과 감성을 담은 스타일' },
  tech: { name: '💻 테크', description: 'IT와 기술 콘텐츠에 적합' }
};

/**
 * Get all theme packs
 */
export const getThemePacksList = () => {
  return Object.values(THEME_PACKS);
};

/**
 * Get packs by category
 */
export const getThemePacksByCategory = (category) => {
  return Object.values(THEME_PACKS).filter(p => p.category === category);
};

/**
 * Get pack by id
 */
export const getThemePack = (id) => {
  return THEME_PACKS[id] || null;
};

/**
 * Search packs by tag
 */
export const searchThemePacksByTag = (tag) => {
  const lowerTag = tag.toLowerCase();
  return Object.values(THEME_PACKS).filter(p =>
    p.tags.some(t => t.toLowerCase().includes(lowerTag))
  );
};
