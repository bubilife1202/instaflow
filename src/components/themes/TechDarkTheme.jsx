import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Tech Dark Theme Component
 * Dark background with cyan accents, modern tech aesthetic
 */
export const TechDarkTheme = ({ elements, bgImage, instagramId, useDesignTemplate, designColors }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

  // Use design colors if available, otherwise use default theme colors
  const colors = designColors || {
    textColor: '#ffffff',
    accentColor: '#22d3ee',
    highlightColor: '#22d3ee',
  };

  return (
    <div className={`w-full h-full flex items-center justify-center relative overflow-hidden ${useDesignTemplate ? 'bg-transparent' : 'bg-black'}`}>
      {/* Background Image with Overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}
      {!bgImage && !useDesignTemplate && <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />}

      <div className="relative z-10 w-full h-full p-10 flex flex-col justify-center">
        {h1 && (
          <h1 className="text-5xl font-black mb-6 leading-tight line-clamp-2" style={{ letterSpacing: '-0.02em', color: colors.textColor }}>
            {renderStyledText(h1.content, 'tech-dark')}
          </h1>
        )}

        {h2 && (
          <div className="mb-6">
            <div className="inline-block px-5 py-2.5 backdrop-blur-xl bg-opacity-90" style={{ background: `linear-gradient(to right, ${colors.accentColor}, ${colors.highlightColor})` }}>
              <h2 className="text-2xl font-bold line-clamp-1" style={{ letterSpacing: '-0.02em', color: colors.textColor }}>
                {renderStyledText(h2.content, 'tech-dark')}
              </h2>
            </div>
          </div>
        )}

        {quotes.length > 0 && (
          <div className="mb-6 space-y-2">
            {quotes.slice(0, 2).map((q, i) => (
              <div key={i} className="text-3xl font-black line-clamp-1" style={{ letterSpacing: '-0.02em', color: colors.accentColor }}>
                {renderStyledText(q.content, 'tech-dark')}
              </div>
            ))}
          </div>
        )}

        {texts.length > 0 && (
          <div className="mb-6 space-y-2">
            {texts.slice(0, 3).map((t, i) => (
              <p key={i} className="text-lg line-clamp-1" style={{ color: colors.textColor, opacity: 0.9 }}>
                {renderStyledText(t.content, 'tech-dark')}
              </p>
            ))}
          </div>
        )}

        {specs.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            {specs.slice(0, 4).map((spec, i) => (
              <div key={i} className="border p-3 backdrop-blur-xl rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: colors.accentColor + '30' }}>
                <div className="text-[10px] uppercase tracking-wider mb-1 truncate" style={{ color: colors.accentColor, opacity: 0.7 }}>{spec.key}</div>
                <div className="text-sm font-bold truncate" style={{ color: colors.textColor }}>{spec.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instagram ID Branding */}
      {instagramId && (
        <div className="absolute bottom-3 right-3 text-xs font-semibold" style={{ color: colors.textColor, opacity: 0.4 }}>
          {instagramId}
        </div>
      )}
    </div>
  );
};
