import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Biz Clean Theme Component
 * Professional white card design with blue accents
 */
export const BizCleanTheme = ({ elements, bgImage, instagramId, useDesignTemplate, designColors }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

  // Use design colors if available, otherwise use default theme colors
  const colors = designColors || {
    textColor: '#1e293b',
    accentColor: '#2563eb',
    highlightColor: '#2563eb',
  };

  return (
    <div className={`w-full h-full flex items-center justify-center p-6 relative overflow-hidden ${useDesignTemplate ? 'bg-transparent' : 'bg-slate-50'}`}>
      {/* Background Image with Overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-black/45" />
        </>
      )}
      <div className={`${useDesignTemplate ? 'bg-white/95 backdrop-blur-sm' : bgImage ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'} w-full h-full shadow-2xl p-8 relative overflow-hidden rounded-lg z-10`}>
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: colors.accentColor }} />

        <div className="h-full flex flex-col justify-center pl-4">
          {h1 && (
            <h1 className="text-4xl font-black mb-5 leading-tight line-clamp-2" style={{ letterSpacing: '-0.02em', color: colors.textColor }}>
              {renderStyledText(h1.content, 'biz-clean')}
            </h1>
          )}

          {h2 && (
            <div className="mb-5">
              <div className="px-5 py-2.5 inline-block rounded shadow-lg" style={{ backgroundColor: colors.accentColor, color: '#ffffff' }}>
                <h2 className="text-2xl font-bold line-clamp-1" style={{ letterSpacing: '-0.02em' }}>
                  {renderStyledText(h2.content, 'biz-clean')}
                </h2>
              </div>
            </div>
          )}

          {quotes.length > 0 && (
            <div className="mb-5 space-y-2">
              {quotes.slice(0, 2).map((q, i) => (
                <div key={i} className="text-2xl font-bold border-l-4 pl-3 line-clamp-2" style={{ color: colors.accentColor, borderColor: colors.accentColor }}>
                  {renderStyledText(q.content, 'biz-clean')}
                </div>
              ))}
            </div>
          )}

          {texts.length > 0 && (
            <div className="mb-5 space-y-2">
              {texts.slice(0, 3).map((t, i) => (
                <p key={i} className="text-base flex items-start line-clamp-1" style={{ color: colors.textColor }}>
                  <span className="mr-2 flex-shrink-0" style={{ color: colors.accentColor }}>✓</span>
                  <span>{renderStyledText(t.content, 'biz-clean')}</span>
                </p>
              ))}
            </div>
          )}

          {specs.length > 0 && (
            <div className="space-y-2">
              {specs.slice(0, 4).map((spec, i) => (
                <div key={i} className="flex items-center text-sm border-b pb-2" style={{ borderColor: colors.accentColor + '20' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-2" style={{ backgroundColor: colors.accentColor + '20' }}>
                    <span className="text-xs" style={{ color: colors.accentColor }}>✓</span>
                  </span>
                  <span className="font-semibold min-w-[80px] truncate" style={{ color: colors.textColor }}>{spec.key}</span>
                  <span className="ml-2 truncate" style={{ color: colors.textColor }}>{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instagram ID Branding */}
        {instagramId && (
          <div className="absolute bottom-3 right-3 text-xs font-semibold" style={{ color: colors.accentColor, opacity: 0.6 }}>
            {instagramId}
          </div>
        )}
      </div>
    </div>
  );
};
