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
      background: 'linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)',
      titleColor: '#1a1a1a',
      subtitleColor: '#555555',
      accentColor: '#333333',
      pattern: null
    },
    body: {
      background: '#fafafa',
      titleColor: '#1a1a1a',
      textColor: '#444444',
      accentColor: '#333333',
      highlightColor: '#f0f0f0',
      numberBg: 'linear-gradient(135deg, #333333 0%, #1a1a1a 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
      titleColor: '#ffffff',
      textColor: '#cccccc',
      buttonBg: '#ffffff',
      buttonColor: '#1a1a1a'
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255,255,255,0.95)',
      accentColor: '#ffd700',
      pattern: null,
      glow: '0 0 60px rgba(102,126,234,0.3)'
    },
    body: {
      background: 'linear-gradient(180deg, #fafbff 0%, #f0f3ff 100%)',
      titleColor: '#5a67d8',
      textColor: '#4a5568',
      accentColor: '#805ad5',
      highlightColor: '#e9e3ff',
      numberBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #805ad5 0%, #667eea 50%, #764ba2 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.95)',
      buttonBg: 'linear-gradient(90deg, #ffd700 0%, #ffed4a 100%)',
      buttonColor: '#1a1a1a',
      glow: '0 0 40px rgba(118,75,162,0.4)'
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
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      titleColor: '#6b2d5c',
      subtitleColor: '#8b4d6b',
      accentColor: '#ff6b8a',
      pattern: null,
      glow: '0 0 50px rgba(255,154,158,0.2)'
    },
    body: {
      background: 'linear-gradient(180deg, #fff5f7 0%, #ffeef2 100%)',
      titleColor: '#c44569',
      textColor: '#6b4f5c',
      accentColor: '#f093fb',
      highlightColor: '#ffe4ec',
      numberBg: 'linear-gradient(135deg, #ff9a9e 0%, #f093fb 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #f093fb 0%, #ff9a9e 50%, #fecfef 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.95)',
      buttonBg: '#ffffff',
      buttonColor: '#c44569',
      glow: '0 0 40px rgba(240,147,251,0.3)'
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
      background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #16213e 100%)',
      titleColor: '#ffffff',
      subtitleColor: '#00d4ff',
      accentColor: '#00d4ff',
      pattern: null,
      glow: '0 0 80px rgba(0,212,255,0.15)'
    },
    body: {
      background: 'linear-gradient(180deg, #0f0f17 0%, #121220 100%)',
      titleColor: '#00d4ff',
      textColor: '#b0b8c8',
      accentColor: '#00d4ff',
      highlightColor: '#1a1a2e',
      numberBg: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
      numberColor: '#000000',
      glow: '0 0 20px rgba(0,212,255,0.2)'
    },
    cta: {
      background: 'linear-gradient(135deg, #16213e 0%, #0f0f17 100%)',
      titleColor: '#00d4ff',
      textColor: '#e0e8f0',
      buttonBg: 'linear-gradient(90deg, #00d4ff 0%, #00a0cc 100%)',
      buttonColor: '#000000',
      glow: '0 0 50px rgba(0,212,255,0.25)'
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
      pattern: null,
      glow: '0 0 60px rgba(0,255,249,0.2), 0 0 100px rgba(255,0,255,0.1)'
    },
    body: {
      background: 'linear-gradient(180deg, #0f0c29 0%, #1a1545 100%)',
      titleColor: '#ff00ff',
      textColor: '#c8d0e0',
      accentColor: '#00fff9',
      highlightColor: 'rgba(255,0,255,0.15)',
      numberBg: 'linear-gradient(135deg, #ff00ff 0%, #00fff9 100%)',
      numberColor: '#000000',
      glow: '0 0 30px rgba(255,0,255,0.3)'
    },
    cta: {
      background: 'linear-gradient(135deg, #1a1545 0%, #0f0c29 100%)',
      titleColor: '#00fff9',
      textColor: '#e0e8f0',
      buttonBg: 'linear-gradient(90deg, #00fff9 0%, #ff00ff 100%)',
      buttonColor: '#000000',
      glow: '0 0 40px rgba(0,255,249,0.3), 0 0 60px rgba(255,0,255,0.2)'
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
      background: 'linear-gradient(135deg, #ffeef8 0%, #e8f4f8 50%, #fff5e6 100%)',
      titleColor: '#5c4a5e',
      subtitleColor: '#8b7a8b',
      accentColor: '#d4a5c9',
      pattern: null
    },
    body: {
      background: 'linear-gradient(180deg, #fefefe 0%, #faf8ff 100%)',
      titleColor: '#6b5177',
      textColor: '#6b5b6e',
      accentColor: '#c9a5d4',
      highlightColor: '#f5e6f0',
      numberBg: 'linear-gradient(135deg, #d4a5c9 0%, #a5c9d4 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #c9a5d4 0%, #a5c9d4 50%, #d4c9a5 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.95)',
      buttonBg: '#ffffff',
      buttonColor: '#6b5177'
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
      accent: '#e63946',
      text: '#000000'
    },
    cover: {
      background: '#ffffff',
      titleColor: '#1d3557',
      subtitleColor: '#e63946',
      accentColor: '#e63946',
      pattern: null
    },
    body: {
      background: '#f8f9fa',
      titleColor: '#e63946',
      textColor: '#2b2d42',
      accentColor: '#e63946',
      highlightColor: '#fff1f3',
      numberBg: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.95)',
      buttonBg: '#ffffff',
      buttonColor: '#e63946'
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
      background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dfd0 50%, #ddd5c5 100%)',
      titleColor: '#3e3028',
      subtitleColor: '#7a6555',
      accentColor: '#a08060',
      pattern: null
    },
    body: {
      background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)',
      titleColor: '#5a4a3a',
      textColor: '#6b5a4a',
      accentColor: '#a08060',
      highlightColor: '#f0ebe0',
      numberBg: 'linear-gradient(135deg, #a08060 0%, #8b7355 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #8b7355 0%, #6b5545 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.95)',
      buttonBg: '#f5f0e8',
      buttonColor: '#5a4a3a'
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
      background: 'linear-gradient(135deg, #667eea 0%, #64b3f4 50%, #89f7fe 100%)',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255,255,255,0.95)',
      accentColor: '#ffffff',
      pattern: null,
      glow: '0 0 60px rgba(100,179,244,0.3)'
    },
    body: {
      background: 'linear-gradient(180deg, #f0f9ff 0%, #e6f4ff 100%)',
      titleColor: '#1e5799',
      textColor: '#2d5a7b',
      accentColor: '#4a90d9',
      highlightColor: '#e0f0ff',
      numberBg: 'linear-gradient(135deg, #4a90d9 0%, #64b3f4 100%)',
      numberColor: '#ffffff'
    },
    cta: {
      background: 'linear-gradient(135deg, #4a90d9 0%, #667eea 100%)',
      titleColor: '#ffffff',
      textColor: 'rgba(255,255,255,0.95)',
      buttonBg: '#ffffff',
      buttonColor: '#1e5799',
      glow: '0 0 40px rgba(74,144,217,0.3)'
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
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
      titleColor: '#d4af37',
      subtitleColor: '#e8e8e8',
      accentColor: '#d4af37',
      pattern: null,
      glow: '0 0 80px rgba(212,175,55,0.15)'
    },
    body: {
      background: 'linear-gradient(180deg, #faf8f2 0%, #f5f0e5 100%)',
      titleColor: '#2a2a2a',
      textColor: '#4a4a4a',
      accentColor: '#c9a227',
      highlightColor: '#faf5e8',
      numberBg: 'linear-gradient(135deg, #d4af37 0%, #e8c84a 50%, #d4af37 100%)',
      numberColor: '#1a1a1a'
    },
    cta: {
      background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      titleColor: '#d4af37',
      textColor: '#e8e8e8',
      buttonBg: 'linear-gradient(90deg, #c9a227 0%, #d4af37 50%, #e8c84a 100%)',
      buttonColor: '#1a1a1a',
      glow: '0 0 50px rgba(212,175,55,0.2)'
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
