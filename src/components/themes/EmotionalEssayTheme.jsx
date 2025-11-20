import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Emotional Essay Theme Component
 * Centered design with serif fonts and warm colors
 */
export const EmotionalEssayTheme = ({ elements, bgImage, instagramId, useDesignTemplate, designColors }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

  // Use design colors if available, otherwise use default theme colors
  const colors = designColors || {
    textColor: bgImage || useDesignTemplate ? '#ffffff' : '#2c2416',
    accentColor: bgImage || useDesignTemplate ? '#ffffff' : '#8B7355',
    highlightColor: bgImage || useDesignTemplate ? '#ffffff' : '#5a4a3a',
  };

  return (
    <div className={`w-full h-full flex items-center justify-center p-12 relative overflow-hidden ${useDesignTemplate ? 'bg-transparent' : 'bg-[#fffef8]'}`}>
      {/* Background Image with Overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      <div className="text-center h-full flex flex-col justify-center max-w-md relative z-10">
        {h1 && (
          <h1 className="text-5xl font-serif mb-6 leading-tight line-clamp-2" style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.01em', color: colors.textColor }}>
            {renderStyledText(h1.content, 'emotional-essay')}
          </h1>
        )}

        {h2 && (
          <div className="mb-6">
            <div className="border-t-2 border-b-2 py-2.5 px-5 inline-block" style={{ borderColor: colors.accentColor }}>
              <h2 className="text-xl font-serif line-clamp-1" style={{ fontFamily: 'Georgia, serif', color: colors.highlightColor }}>
                {renderStyledText(h2.content, 'emotional-essay')}
              </h2>
            </div>
          </div>
        )}

        {quotes.length > 0 && (
          <div className="mb-6 space-y-4">
            {quotes.slice(0, 2).map((q, i) => (
              <blockquote key={i} className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-4xl" style={{ color: colors.accentColor, opacity: 0.3 }}>"</div>
                <div className="text-3xl font-serif italic px-2 line-clamp-2" style={{ fontFamily: 'Georgia, serif', color: colors.highlightColor }}>
                  {renderStyledText(q.content, 'emotional-essay')}
                </div>
              </blockquote>
            ))}
          </div>
        )}

        {texts.length > 0 && (
          <div className="mb-6 space-y-3">
            {texts.slice(0, 3).map((t, i) => (
              <p key={i} className="text-lg font-serif leading-relaxed line-clamp-2" style={{ fontFamily: 'Georgia, serif', color: colors.textColor }}>
                {renderStyledText(t.content, 'emotional-essay')}
              </p>
            ))}
          </div>
        )}

        {specs.length > 0 && (
          <div className="space-y-2">
            {specs.slice(0, 3).map((spec, i) => (
              <div key={i} className="text-center text-base">
                <span className="font-serif" style={{ fontFamily: 'Georgia, serif', color: colors.accentColor, opacity: 0.8 }}>{spec.key}</span>
                <span className="mx-2" style={{ color: colors.accentColor, opacity: 0.6 }}>·</span>
                <span className="font-serif" style={{ fontFamily: 'Georgia, serif', color: colors.textColor }}>{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.accentColor, opacity: 0.6 }} />
          <div className="w-8 h-px" style={{ backgroundColor: colors.accentColor, opacity: 0.4 }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.accentColor, opacity: 0.6 }} />
        </div>

        {/* Instagram ID Branding */}
        {instagramId && (
          <div className="absolute bottom-3 right-3 text-xs font-semibold" style={{ color: colors.accentColor, opacity: 0.5 }}>
            {instagramId}
          </div>
        )}
      </div>
    </div>
  );
};
