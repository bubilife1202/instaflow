import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Bold Magazine Theme Component
 * Magazine-style layout with bold typography and dramatic spacing
 */
export const BoldMagazineTheme = ({ elements, bgImage, instagramId, useDesignTemplate, designColors }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

  // Use design colors if available, otherwise use default theme colors
  const colors = designColors || {
    textColor: '#000000',
    accentColor: '#ff0000',
    highlightColor: '#ff0000',
  };

  return (
    <div className={`w-full h-full flex flex-col relative overflow-hidden ${useDesignTemplate ? 'bg-transparent' : 'bg-white'}`}>
      {/* Background Image with Overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        </>
      )}

      <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
        {/* Top Section */}
        <div>
          {h2 && (
            <div className="mb-3">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest" style={{ backgroundColor: colors.accentColor, color: '#ffffff' }}>
                {h2.content}
              </div>
            </div>
          )}

          {h1 && (
            <h1 className="text-6xl font-black leading-none mb-6 uppercase" style={{ color: colors.textColor, letterSpacing: '-0.04em', lineHeight: '0.9' }}>
              {h1.content.split(' ').map((word, i) => (
                <span key={i}>
                  {i === 0 && <span style={{ color: colors.accentColor }}>{word} </span>}
                  {i > 0 && <span>{word} </span>}
                </span>
              ))}
            </h1>
          )}

          {quotes.length > 0 && (
            <div className="space-y-3 mb-6">
              {quotes.slice(0, 1).map((q, i) => (
                <div key={i} className="border-l-4 pl-4 py-2" style={{ borderColor: colors.accentColor }}>
                  <div className="text-2xl font-bold italic leading-tight" style={{ color: colors.textColor }}>
                    {renderStyledText(q.content, 'bold-magazine')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Middle Section */}
        <div className="space-y-3">
          {texts.length > 0 && (
            <div className="space-y-2">
              {texts.slice(0, 3).map((t, i) => (
                <p key={i} className="text-sm leading-relaxed font-medium" style={{ color: colors.textColor, opacity: 0.8 }}>
                  {renderStyledText(t.content, 'bold-magazine')}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section - Specs */}
        {specs.length > 0 && (
          <div className="border-t-2 pt-4" style={{ borderColor: colors.textColor + '20' }}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {specs.slice(0, 4).map((spec, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: colors.accentColor }}>{spec.key}</span>
                  <span className="text-sm font-black" style={{ color: colors.textColor }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instagram ID Branding */}
        {instagramId && (
          <div className="absolute bottom-3 right-3 text-xs font-black uppercase tracking-wider" style={{ color: colors.textColor, opacity: 0.3 }}>
            {instagramId}
          </div>
        )}
      </div>
    </div>
  );
};
