import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Modern Gradient Theme Component
 * High-end, glassmorphism style with animated gradient
 */
export const ModernGradientTheme = ({ elements, bgImage, instagramId, useDesignTemplate, designColors }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

  // Use design colors if available
  const colors = designColors || {
    textColor: '#1e293b',
    accentColor: '#6366f1', // Indigo-500
    highlightColor: '#8b5cf6', // Violet-500
  };

  return (
    <div className={`w-full h-full flex items-center justify-center relative overflow-hidden ${useDesignTemplate ? 'bg-transparent' : 'bg-white'}`}>
      {/* Premium Gradient Background */}
      {!bgImage && !useDesignTemplate && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100" />
          {/* Abstract shapes for depth */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </>
      )}

      {/* Image Background */}
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-lg" />
        </>
      )}

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-[85%] h-[85%] bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 p-8 flex flex-col justify-between overflow-hidden">

        {/* Top Content */}
        <div className="flex flex-col gap-6">
          {h1 && (
            <div className="relative">
               {/* Decorative line */}
              <div className="w-12 h-1.5 rounded-full mb-4" style={{ background: `linear-gradient(to right, ${colors.accentColor}, ${colors.highlightColor})` }}></div>
              <h1 className="text-4xl font-black leading-[1.2] tracking-tight text-slate-800" style={{ color: colors.textColor }}>
                {renderStyledText(h1.content, 'modern-gradient')}
              </h1>
            </div>
          )}

          {h2 && (
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-slate-600" style={{ color: colors.accentColor }}>
                {renderStyledText(h2.content, 'modern-gradient')}
              </h2>
            </div>
          )}
        </div>

        {/* Middle Content (Quotes/Texts) */}
        <div className="flex-1 flex flex-col justify-center gap-4 my-4">
          {quotes.length > 0 && (
            <div className="relative p-6 rounded-2xl bg-white/50 border border-white/60">
              <div className="absolute top-4 left-4 text-4xl font-serif opacity-20" style={{ color: colors.accentColor }}>"</div>
              {quotes.slice(0, 1).map((q, i) => (
                <div key={i} className="relative z-10 text-lg font-semibold italic text-center leading-relaxed" style={{ color: colors.textColor }}>
                  {renderStyledText(q.content, 'modern-gradient')}
                </div>
              ))}
            </div>
          )}

          {texts.length > 0 && (
            <div className="space-y-3">
              {texts.slice(0, 3).map((t, i) => (
                <p key={i} className="text-base font-medium leading-relaxed text-slate-700" style={{ color: colors.textColor }}>
                  {renderStyledText(t.content, 'modern-gradient')}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Content (Specs) */}
        {specs.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-200/50">
            {specs.slice(0, 4).map((spec, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{spec.key}</span>
                <span className="text-sm font-bold text-slate-800 truncate" style={{ color: colors.textColor }}>{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Branding */}
        {instagramId && (
          <div className="absolute top-8 right-8 flex items-center gap-1.5 opacity-50">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }}></div>
            <span className="text-[10px] font-bold tracking-widest uppercase">{instagramId.replace('@', '')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
