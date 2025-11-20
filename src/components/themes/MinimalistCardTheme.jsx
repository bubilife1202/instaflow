import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Minimalist Card Theme Component
 * Clean, minimal design with subtle shadows and spacing
 */
export const MinimalistCardTheme = ({ elements, bgImage, instagramId, useDesignTemplate, designColors }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

  // Use design colors if available, otherwise use default theme colors
  const colors = designColors || {
    textColor: '#1a1a1a',
    accentColor: '#6366f1',
    highlightColor: '#8b5cf6',
  };

  return (
    <div className={`w-full h-full flex items-center justify-center p-8 relative overflow-hidden ${useDesignTemplate ? 'bg-transparent' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Background Image with Overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        </>
      )}

      <div className={`${useDesignTemplate || bgImage ? 'bg-white/90 backdrop-blur-md' : 'bg-white'} w-full max-w-md rounded-3xl shadow-xl p-10 relative z-10`}>
        {/* Small accent bar */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1.5 rounded-full" style={{ backgroundColor: colors.accentColor }} />

        <div className="space-y-6">
          {h1 && (
            <h1 className="text-4xl font-bold text-center leading-tight" style={{ color: colors.textColor, letterSpacing: '-0.02em' }}>
              {renderStyledText(h1.content, 'minimalist-card')}
            </h1>
          )}

          {h2 && (
            <div className="text-center">
              <h2 className="text-lg font-medium" style={{ color: colors.accentColor }}>
                {renderStyledText(h2.content, 'minimalist-card')}
              </h2>
            </div>
          )}

          {quotes.length > 0 && (
            <div className="space-y-4">
              {quotes.slice(0, 2).map((q, i) => (
                <blockquote key={i} className="text-center px-4 py-3 rounded-2xl" style={{ backgroundColor: colors.accentColor + '10', borderLeft: `4px solid ${colors.accentColor}` }}>
                  <div className="text-xl font-semibold" style={{ color: colors.highlightColor }}>
                    {renderStyledText(q.content, 'minimalist-card')}
                  </div>
                </blockquote>
              ))}
            </div>
          )}

          {texts.length > 0 && (
            <div className="space-y-3">
              {texts.slice(0, 4).map((t, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: colors.textColor, opacity: 0.8 }}>
                  {renderStyledText(t.content, 'minimalist-card')}
                </p>
              ))}
            </div>
          )}

          {specs.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {specs.slice(0, 4).map((spec, i) => (
                <div key={i} className="text-center p-3 rounded-xl" style={{ backgroundColor: colors.accentColor + '08' }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: colors.accentColor, opacity: 0.7 }}>{spec.key}</div>
                  <div className="text-sm font-bold" style={{ color: colors.textColor }}>{spec.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instagram ID Branding */}
        {instagramId && (
          <div className="absolute bottom-4 right-4 text-xs font-medium" style={{ color: colors.accentColor, opacity: 0.5 }}>
            {instagramId}
          </div>
        )}
      </div>
    </div>
  );
};
