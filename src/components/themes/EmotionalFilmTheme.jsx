import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Emotional Film Theme Component
 * Retro, cinematic, moody aesthetic for emotional content
 */
export const EmotionalFilmTheme = ({ elements, bgImage, instagramId, useDesignTemplate, designColors }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const texts = elements.filter(el => el.type === 'text');
  const quotes = elements.filter(el => el.type === 'quote');

  // Use design colors if available
  const colors = designColors || {
    textColor: '#f5f5f4', // Warm white
    accentColor: '#d6d3d1', // Stone-300
    highlightColor: '#a8a29e', // Stone-400
  };

  return (
    <div className={`w-full h-full flex items-center justify-center relative overflow-hidden font-serif ${useDesignTemplate ? 'bg-transparent' : 'bg-[#1c1917]'}`}>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-20 opacity-[0.08] pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Background */}
      {bgImage ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply" />
        </>
      ) : !useDesignTemplate && (
        <div className="absolute inset-0 bg-[#1c1917]">
          {/* Subtle lighting */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-stone-800/50 to-transparent" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-30 w-full h-full p-10 flex flex-col justify-center items-center text-center">

        {/* Film Border Effect (Top/Bottom lines) */}
        <div className="absolute top-6 left-6 right-6 h-px bg-stone-500/30" />
        <div className="absolute bottom-6 left-6 right-6 h-px bg-stone-500/30" />

        {/* Date/Time stamp style */}
        <div className="absolute top-8 right-8 font-mono text-[10px] tracking-widest opacity-40" style={{ color: colors.accentColor }}>
          REC ●
        </div>

        <div className="flex-1 flex flex-col justify-center gap-8">
          {h1 && (
            <h1 className="text-3xl md:text-4xl font-light leading-relaxed tracking-wide" style={{ color: colors.textColor }}>
              {renderStyledText(h1.content, 'emotional-film')}
            </h1>
          )}

          {h2 && (
            <div className="w-full flex justify-center">
               <h2 className="text-sm font-medium tracking-[0.2em] uppercase border-b pb-1" style={{ color: colors.accentColor, borderColor: colors.accentColor }}>
                {renderStyledText(h2.content, 'emotional-film')}
              </h2>
            </div>
          )}

          {quotes.length > 0 && (
            <div className="my-4">
              {quotes.map((q, i) => (
                <p key={i} className="text-lg md:text-xl italic font-light leading-loose opacity-90" style={{ color: colors.textColor }}>
                  "{renderStyledText(q.content, 'emotional-film')}"
                </p>
              ))}
            </div>
          )}

          {texts.length > 0 && (
            <div className="space-y-4">
              {texts.map((t, i) => (
                <p key={i} className="text-sm md:text-base font-light leading-7 opacity-80 whitespace-pre-wrap" style={{ color: colors.textColor }}>
                  {renderStyledText(t.content, 'emotional-film')}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Footer Branding */}
        {instagramId && (
          <div className="absolute bottom-8 font-mono text-[10px] tracking-widest opacity-40" style={{ color: colors.accentColor }}>
            {instagramId}
          </div>
        )}
      </div>
    </div>
  );
};
