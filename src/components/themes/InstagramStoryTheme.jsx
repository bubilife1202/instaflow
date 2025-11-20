import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Instagram Story Theme Component
 * Vertical story-optimized layout with modern Instagram aesthetics
 */
export const InstagramStoryTheme = ({ elements, bgImage, instagramId, useDesignTemplate, designColors }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

  // Use design colors if available, otherwise use default theme colors
  const colors = designColors || {
    textColor: '#ffffff',
    accentColor: '#e91e63',
    highlightColor: '#ff4081',
  };

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden ${useDesignTemplate ? 'bg-transparent' : 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400'}`}>
      {/* Background Image with Overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </>
      )}

      {/* Story Progress Bar (decorative) */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: colors.textColor, opacity: 0.5 }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm text-center space-y-6">
        {/* Profile-like header */}
        {instagramId && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full border-2" style={{ borderColor: colors.accentColor, backgroundColor: colors.accentColor + '40' }} />
            <span className="text-sm font-bold" style={{ color: colors.textColor }}>{instagramId}</span>
          </div>
        )}

        {h1 && (
          <h1 className="text-5xl font-black leading-tight mb-6" style={{ color: colors.textColor, textShadow: '0 2px 10px rgba(0,0,0,0.3)', letterSpacing: '-0.02em' }}>
            {renderStyledText(h1.content, 'instagram-story')}
          </h1>
        )}

        {h2 && (
          <div className="mb-4">
            <div className="inline-block px-5 py-2 rounded-full backdrop-blur-xl" style={{ backgroundColor: colors.accentColor }}>
              <h2 className="text-xl font-bold" style={{ color: colors.textColor }}>
                {renderStyledText(h2.content, 'instagram-story')}
              </h2>
            </div>
          </div>
        )}

        {quotes.length > 0 && (
          <div className="space-y-4">
            {quotes.slice(0, 2).map((q, i) => (
              <div key={i} className="text-2xl font-bold italic px-6" style={{ color: colors.textColor, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                "{renderStyledText(q.content, 'instagram-story')}"
              </div>
            ))}
          </div>
        )}

        {texts.length > 0 && (
          <div className="space-y-3 px-4">
            {texts.slice(0, 3).map((t, i) => (
              <p key={i} className="text-base font-medium leading-relaxed backdrop-blur-sm rounded-2xl px-4 py-2" style={{ color: colors.textColor, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                {renderStyledText(t.content, 'instagram-story')}
              </p>
            ))}
          </div>
        )}

        {specs.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-6">
            {specs.slice(0, 4).map((spec, i) => (
              <div key={i} className="backdrop-blur-xl rounded-2xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <div className="text-xs font-bold mb-1" style={{ color: colors.accentColor }}>{spec.key}</div>
                <div className="text-sm font-bold" style={{ color: colors.textColor }}>{spec.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button Style */}
        <div className="mt-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl" style={{ backgroundColor: colors.textColor + '20', border: `2px solid ${colors.textColor}` }}>
            <span className="text-sm font-bold" style={{ color: colors.textColor }}>Swipe Up</span>
            <span style={{ color: colors.textColor }}>↑</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
};
