import { renderStyledText } from '../../utils/renderStyledText.jsx';

/**
 * Biz Clean Theme Component
 * Professional white card design with blue accents
 */
export const BizCleanTheme = ({ elements, bgImage, instagramId }) => {
  const h1 = elements.find(el => el.type === 'h1');
  const h2 = elements.find(el => el.type === 'h2');
  const specs = elements.filter(el => el.type === 'spec');
  const quotes = elements.filter(el => el.type === 'quote');
  const texts = elements.filter(el => el.type === 'text');

  return (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with Overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="absolute inset-0 bg-black/45" />
        </>
      )}
      <div className={`${bgImage ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'} w-full h-full shadow-2xl p-8 relative overflow-hidden rounded-lg z-10`}>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />

        <div className="h-full flex flex-col justify-center pl-4">
          {h1 && (
            <h1 className="text-4xl font-black text-slate-900 mb-5 leading-tight line-clamp-2" style={{ letterSpacing: '-0.02em' }}>
              {renderStyledText(h1.content, 'biz-clean')}
            </h1>
          )}

          {h2 && (
            <div className="mb-5">
              <div className="bg-blue-600 text-white px-5 py-2.5 inline-block rounded shadow-lg">
                <h2 className="text-2xl font-bold line-clamp-1" style={{ letterSpacing: '-0.02em' }}>
                  {renderStyledText(h2.content, 'biz-clean')}
                </h2>
              </div>
            </div>
          )}

          {quotes.length > 0 && (
            <div className="mb-5 space-y-2">
              {quotes.slice(0, 2).map((q, i) => (
                <div key={i} className="text-2xl font-bold text-blue-600 border-l-4 border-blue-600 pl-3 line-clamp-2">
                  {renderStyledText(q.content, 'biz-clean')}
                </div>
              ))}
            </div>
          )}

          {texts.length > 0 && (
            <div className="mb-5 space-y-2">
              {texts.slice(0, 3).map((t, i) => (
                <p key={i} className="text-base text-slate-700 flex items-start line-clamp-1">
                  <span className="text-blue-600 mr-2 flex-shrink-0">✓</span>
                  <span>{renderStyledText(t.content, 'biz-clean')}</span>
                </p>
              ))}
            </div>
          )}

          {specs.length > 0 && (
            <div className="space-y-2">
              {specs.slice(0, 4).map((spec, i) => (
                <div key={i} className="flex items-center text-sm border-b border-gray-100 pb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </span>
                  <span className="font-semibold text-slate-700 min-w-[80px] truncate">{spec.key}</span>
                  <span className="text-slate-900 ml-2 truncate">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instagram ID Branding */}
        {instagramId && (
          <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-semibold">
            {instagramId}
          </div>
        )}
      </div>
    </div>
  );
};
