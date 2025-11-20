import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Tech Dark Theme Component
 * Dark background with cyan accents, modern tech aesthetic
 */
export const TechDarkTheme = ({ elements, bgImage, instagramId, useDesignTemplate }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

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
          <h1 className="text-5xl font-black text-white mb-6 leading-tight line-clamp-2" style={{ letterSpacing: '-0.02em' }}>
            {renderStyledText(h1.content, 'tech-dark')}
          </h1>
        )}

        {h2 && (
          <div className="mb-6">
            <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 backdrop-blur-xl bg-opacity-90">
              <h2 className="text-2xl font-bold text-white line-clamp-1" style={{ letterSpacing: '-0.02em' }}>
                {renderStyledText(h2.content, 'tech-dark')}
              </h2>
            </div>
          </div>
        )}

        {quotes.length > 0 && (
          <div className="mb-6 space-y-2">
            {quotes.slice(0, 2).map((q, i) => (
              <div key={i} className="text-3xl font-black text-cyan-400 line-clamp-1" style={{ letterSpacing: '-0.02em' }}>
                {renderStyledText(q.content, 'tech-dark')}
              </div>
            ))}
          </div>
        )}

        {texts.length > 0 && (
          <div className="mb-6 space-y-2">
            {texts.slice(0, 3).map((t, i) => (
              <p key={i} className="text-lg text-gray-300 line-clamp-1">
                {renderStyledText(t.content, 'tech-dark')}
              </p>
            ))}
          </div>
        )}

        {specs.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            {specs.slice(0, 4).map((spec, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-3 backdrop-blur-xl rounded-lg">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 truncate">{spec.key}</div>
                <div className="text-sm font-bold text-white truncate">{spec.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instagram ID Branding */}
      {instagramId && (
        <div className="absolute bottom-3 right-3 text-xs text-white/40 font-semibold">
          {instagramId}
        </div>
      )}
    </div>
  );
};
