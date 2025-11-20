/**
 * Design Templates - Style-only templates
 * CSS patterns, gradients, and visual designs without content
 */

export const DESIGN_TEMPLATES = {
  // Gradient Designs
  'sunsetGradient': {
    id: 'sunsetGradient',
    name: '🌅 Sunset Gradient',
    category: 'gradient',
    description: '따뜻한 노을빛 그라디언트',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#ffd89b',
    pattern: null,
  },

  'oceanWave': {
    id: 'oceanWave',
    name: '🌊 Ocean Wave',
    category: 'gradient',
    description: '시원한 바다 그라디언트',
    background: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
    textColor: '#ffffff',
    accentColor: '#4facfe',
    pattern: null,
  },

  'forestGreen': {
    id: 'forestGreen',
    name: '🌲 Forest Green',
    category: 'gradient',
    description: '자연스러운 초록빛',
    background: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
    textColor: '#2d5016',
    accentColor: '#5a9e3a',
    pattern: null,
  },

  'royalPurple': {
    id: 'royalPurple',
    name: '👑 Royal Purple',
    category: 'gradient',
    description: '고급스러운 보라빛',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#a8c0ff',
    pattern: null,
  },

  'candyPink': {
    id: 'candyPink',
    name: '🍭 Candy Pink',
    category: 'gradient',
    description: '달콤한 핑크빛',
    background: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#ffffff',
    accentColor: '#ffeaa7',
    pattern: null,
  },

  // Pattern Designs
  'dotPattern': {
    id: 'dotPattern',
    name: '⚪ Dot Pattern',
    category: 'pattern',
    description: '점 패턴 배경',
    background: '#1a1a2e',
    textColor: '#ffffff',
    accentColor: '#0f3460',
    pattern: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
    patternSize: '20px 20px',
  },

  'gridPattern': {
    id: 'gridPattern',
    name: '⏹️ Grid Pattern',
    category: 'pattern',
    description: '격자 패턴 배경',
    background: '#16213e',
    textColor: '#ffffff',
    accentColor: '#0f3460',
    pattern: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
    patternSize: '30px 30px',
  },

  'diagonalStripe': {
    id: 'diagonalStripe',
    name: '📐 Diagonal Stripe',
    category: 'pattern',
    description: '대각선 줄무늬',
    background: '#2c3e50',
    textColor: '#ffffff',
    accentColor: '#3498db',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
    patternSize: 'auto',
  },

  'hexagonPattern': {
    id: 'hexagonPattern',
    name: '⬡ Hexagon Pattern',
    category: 'pattern',
    description: '육각형 패턴',
    background: '#0f0f0f',
    textColor: '#ffffff',
    accentColor: '#00d4ff',
    pattern: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2%, transparent 0%)',
    patternSize: '100px 100px',
  },

  'wavePattern': {
    id: 'wavePattern',
    name: '🌊 Wave Pattern',
    category: 'pattern',
    description: '물결 패턴',
    background: '#1e3a8a',
    textColor: '#ffffff',
    accentColor: '#60a5fa',
    pattern: 'repeating-radial-gradient(circle at 0 0, transparent 0, rgba(255,255,255,0.05) 10px, transparent 20px)',
    patternSize: 'auto',
  },

  // Solid Colors with Texture
  'minimalistWhite': {
    id: 'minimalistWhite',
    name: '⬜ Minimalist White',
    category: 'solid',
    description: '깔끔한 화이트',
    background: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    pattern: 'radial-gradient(circle, rgba(0,0,0,0.01) 1px, transparent 1px)',
    patternSize: '40px 40px',
  },

  'darkMatter': {
    id: 'darkMatter',
    name: '⬛ Dark Matter',
    category: 'solid',
    description: '우주같은 다크',
    background: '#0a0a0a',
    textColor: '#ffffff',
    accentColor: '#818cf8',
    pattern: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)',
    patternSize: '50px 50px',
  },

  'creamyBeige': {
    id: 'creamyBeige',
    name: '🟤 Creamy Beige',
    category: 'solid',
    description: '따뜻한 베이지',
    background: '#faf8f3',
    textColor: '#3e2723',
    accentColor: '#8d6e63',
    pattern: null,
  },

  // Neon Glow
  'neonCyan': {
    id: 'neonCyan',
    name: '💎 Neon Cyan',
    category: 'neon',
    description: '네온 사이버펑크',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    textColor: '#00fff9',
    accentColor: '#ff00ff',
    pattern: 'radial-gradient(circle, rgba(0,255,249,0.05) 1px, transparent 1px)',
    patternSize: '30px 30px',
    glow: '0 0 10px rgba(0,255,249,0.5)',
  },

  'retroVaporwave': {
    id: 'retroVaporwave',
    name: '🌆 Retro Vaporwave',
    category: 'neon',
    description: '레트로 감성',
    background: 'linear-gradient(180deg, #ff6ec7 0%, #7873f5 50%, #4facfe 100%)',
    textColor: '#ffffff',
    accentColor: '#ffed4e',
    pattern: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
    patternSize: 'auto',
    glow: '0 0 20px rgba(255,110,199,0.5)',
  },
};

/**
 * Get design template by id
 */
export const getDesignTemplate = (id) => {
  return DESIGN_TEMPLATES[id] || null;
};

/**
 * Get all design templates list
 */
export const getDesignTemplatesList = () => {
  return Object.values(DESIGN_TEMPLATES);
};

/**
 * Get templates by category
 */
export const getDesignTemplatesByCategory = (category) => {
  return Object.values(DESIGN_TEMPLATES).filter(template => template.category === category);
};

/**
 * Categories
 */
export const DESIGN_CATEGORIES = {
  gradient: '🌈 그라디언트',
  pattern: '🎨 패턴',
  solid: '🎯 단색',
  neon: '💡 네온',
};

/**
 * Apply design template to element
 */
export const applyDesignToElement = (template) => {
  if (!template) return {};

  const styles = {
    background: template.background,
    color: template.textColor,
  };

  if (template.pattern) {
    styles.backgroundImage = `${template.pattern}, ${template.background}`;
    if (template.patternSize) {
      styles.backgroundSize = `${template.patternSize}, cover`;
    }
  }

  if (template.glow) {
    styles.textShadow = template.glow;
  }

  return styles;
};
