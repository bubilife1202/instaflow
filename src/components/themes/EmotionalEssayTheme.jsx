import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Emotional Essay Theme Component
 * Centered design with serif fonts and warm colors
 */
export const EmotionalEssayTheme = ({ elements, bgImage, instagramId, useDesignTemplate }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

  // Determine if we should use light text (for dark backgrounds)
  const useLightText = bgImage || useDesignTemplate;

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
          <h1 className={`text-5xl font-serif ${useLightText ? 'text-white' : 'text-[#2c2416]'} mb-6 leading-tight line-clamp-2`} style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.01em' }}>
            {renderStyledText(h1.content, 'emotional-essay')}
          </h1>
        )}

        {h2 && (
          <div className="mb-6">
            <div className={`border-t-2 border-b-2 ${useLightText ? 'border-white' : 'border-[#8B7355]'} py-2.5 px-5 inline-block`}>
              <h2 className={`text-xl font-serif ${useLightText ? 'text-white' : 'text-[#5a4a3a]'} line-clamp-1`} style={{ fontFamily: 'Georgia, serif' }}>
                {renderStyledText(h2.content, 'emotional-essay')}
              </h2>
            </div>
          </div>
        )}

        {quotes.length > 0 && (
          <div className="mb-6 space-y-4">
            {quotes.slice(0, 2).map((q, i) => (
              <blockquote key={i} className="relative">
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 text-4xl ${useLightText ? 'text-white/30' : 'text-[#8B7355]/20'}`}>"</div>
                <div className={`text-3xl font-serif italic ${useLightText ? 'text-white' : 'text-[#5a4a3a]'} px-2 line-clamp-2`} style={{ fontFamily: 'Georgia, serif' }}>
                  {renderStyledText(q.content, 'emotional-essay')}
                </div>
              </blockquote>
            ))}
          </div>
        )}

        {texts.length > 0 && (
          <div className="mb-6 space-y-3">
            {texts.slice(0, 3).map((t, i) => (
              <p key={i} className={`text-lg font-serif ${useLightText ? 'text-white' : 'text-[#2c2416]'} leading-relaxed line-clamp-2`} style={{ fontFamily: 'Georgia, serif' }}>
                {renderStyledText(t.content, 'emotional-essay')}
              </p>
            ))}
          </div>
        )}

        {specs.length > 0 && (
          <div className="space-y-2">
            {specs.slice(0, 3).map((spec, i) => (
              <div key={i} className="text-center text-base">
                <span className={`font-serif ${useLightText ? 'text-white/80' : 'text-[#6B5D4F]'}`} style={{ fontFamily: 'Georgia, serif' }}>{spec.key}</span>
                <span className={`mx-2 ${useLightText ? 'text-white/60' : 'text-[#8B7355]'}`}>·</span>
                <span className={`font-serif ${useLightText ? 'text-white' : 'text-[#2c2416]'}`} style={{ fontFamily: 'Georgia, serif' }}>{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mt-8">
          <div className={`w-1 h-1 rounded-full ${useLightText ? 'bg-white/60' : 'bg-[#8B7355]'}`} />
          <div className={`w-8 h-px ${useLightText ? 'bg-white/40' : 'bg-[#8B7355]/40'}`} />
          <div className={`w-1 h-1 rounded-full ${useLightText ? 'bg-white/60' : 'bg-[#8B7355]'}`} />
        </div>

        {/* Instagram ID Branding */}
        {instagramId && (
          <div className={`absolute bottom-3 right-3 text-xs ${useLightText ? 'text-white/50' : 'text-[#8B7355]/60'} font-semibold`}>
            {instagramId}
          </div>
        )}
      </div>
    </div>
  );
};
