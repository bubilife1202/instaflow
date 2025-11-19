import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';

const THEMES = {
  'Tech Dark': 'tech-dark',
  'Biz Clean': 'biz-clean',
  'Emotional Essay': 'emotional-essay'
};

const DEFAULT_SCRIPT = `# InstaFlow
## 서버리스 카드뉴스 생성기
---
# Galaxy Book 4 Pro
## ₩1,890,000
---
# 주요 스펙
CPU::Intel Core i7-14650H
RAM::16GB LPDDR5X
Storage::512GB NVMe SSD
Display::14" AMOLED 2.8K
---
> 초경량 990g
> 배터리 65Wh
*최고의 이동성*을 자랑하는 **프리미엄 노트북**
---
# 핵심 특징
✓ AMOLED 디스플레이
✓ Thunderbolt 4 지원
✓ 초슬림 디자인
---
# 완벽한 선택
당신의 **생산성**을 한 단계 높여줄
*최고의 파트너*입니다`;

function App() {
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [theme, setTheme] = useState('Tech Dark');
  const [aspectRatio, setAspectRatio] = useState('4:5');
  const [isDownloading, setIsDownloading] = useState(false);
  const slideRefs = useRef([]);

  // AdSense initialization
  useEffect(() => {
    try {
      if (window.adsbygoogle && document.querySelector('.adsbygoogle')) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  const slides = script.split('---').map(s => s.trim()).filter(s => s.length > 0);

  const parseInlineMarkdown = (text) => {
    const parts = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.+?)\*\*/g;
    const boldMatches = [];
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      boldMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1], type: 'bold' });
    }

    const highlightRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g;
    const highlightMatches = [];

    while ((match = highlightRegex.exec(text)) !== null) {
      highlightMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1], type: 'highlight' });
    }

    const allMatches = [...boldMatches, ...highlightMatches].sort((a, b) => a.start - b.start);

    allMatches.forEach((match) => {
      if (match.start > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.start) });
      }
      parts.push({ type: match.type, content: match.text });
      lastIndex = match.end;
    });

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    if (parts.length === 0) {
      parts.push({ type: 'text', content: text });
    }

    return parts;
  };

  const renderStyledText = (text, themeClass) => {
    const parts = parseInlineMarkdown(text);
    return parts.map((part, i) => {
      if (part.type === 'bold') {
        return <span key={i} className="font-bold">{part.content}</span>;
      } else if (part.type === 'highlight') {
        const highlightColor = themeClass === 'tech-dark' ? 'text-cyan-400' : themeClass === 'biz-clean' ? 'text-blue-600' : 'text-amber-700';
        return <span key={i} className={highlightColor}>{part.content}</span>;
      } else {
        return <span key={i}>{part.content}</span>;
      }
    });
  };

  const parseSlide = (content) => {
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    return lines.map(line => {
      line = line.trim();
      if (line.startsWith('# ')) return { type: 'h1', content: line.slice(2) };
      else if (line.startsWith('## ')) return { type: 'h2', content: line.slice(3) };
      else if (line.includes('::')) {
        const [key, value] = line.split('::').map(s => s.trim());
        return { type: 'spec', key, value };
      }
      else if (line.startsWith('> ')) return { type: 'quote', content: line.slice(2) };
      else return { type: 'text', content: line };
    });
  };

  const renderSlide = (slideContent, index, themeClass) => {
    const elements = parseSlide(slideContent);
    const specElements = elements.filter(el => el.type === 'spec');
    const textElements = elements.filter(el => el.type === 'text');
    const h1 = elements.find(el => el.type === 'h1');
    const h2 = elements.find(el => el.type === 'h2');
    const quote = elements.filter(el => el.type === 'quote');

    // TECH DARK - 완전히 새로운 레이아웃
    if (themeClass === 'tech-dark') {
      return (
        <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden">
          {/* 배경 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900"></div>

          {/* 컨텐츠 컨테이너 - 고정 크기 */}
          <div className="relative z-10 w-full h-full p-12 flex flex-col justify-center">
            {h1 && (
              <div className="mb-8">
                <h1 className="text-6xl font-black text-white leading-tight mb-0">
                  {renderStyledText(h1.content, themeClass)}
                </h1>
              </div>
            )}

            {h2 && (
              <div className="mb-8">
                <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3">
                  <h2 className="text-3xl font-bold text-white">
                    {renderStyledText(h2.content, themeClass)}
                  </h2>
                </div>
              </div>
            )}

            {quote.length > 0 && (
              <div className="space-y-4 mb-8">
                {quote.map((q, i) => (
                  <div key={i} className="text-4xl font-black text-cyan-400">
                    {renderStyledText(q.content, themeClass)}
                  </div>
                ))}
              </div>
            )}

            {textElements.length > 0 && (
              <div className="space-y-3 mb-8">
                {textElements.map((el, i) => (
                  <p key={i} className="text-xl text-gray-300">
                    {renderStyledText(el.content, themeClass)}
                  </p>
                ))}
              </div>
            )}

            {specElements.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {specElements.map((spec, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur border border-white/10 p-4">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{spec.key}</div>
                    <div className="text-base font-bold text-white">{spec.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // BIZ CLEAN - 완전히 새로운 레이아웃
    else if (themeClass === 'biz-clean') {
      return (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-lg shadow-2xl p-10 relative">
            {/* 왼쪽 파란 바 */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>

            {h1 && (
              <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
                {renderStyledText(h1.content, themeClass)}
              </h1>
            )}

            {h2 && (
              <div className="bg-blue-600 text-white px-6 py-3 mb-6 inline-block">
                <h2 className="text-3xl font-bold">
                  {renderStyledText(h2.content, themeClass)}
                </h2>
              </div>
            )}

            {quote.length > 0 && (
              <div className="mb-6 space-y-3">
                {quote.map((q, i) => (
                  <div key={i} className="text-3xl font-bold text-blue-600 border-l-4 border-blue-600 pl-4">
                    {renderStyledText(q.content, themeClass)}
                  </div>
                ))}
              </div>
            )}

            {textElements.length > 0 && (
              <div className="space-y-3 mb-6">
                {textElements.map((el, i) => (
                  <p key={i} className="text-lg text-slate-700 flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>{renderStyledText(el.content, themeClass)}</span>
                  </p>
                ))}
              </div>
            )}

            {specElements.length > 0 && (
              <div className="space-y-3">
                {specElements.map((spec, i) => (
                  <div key={i} className="flex items-center border-b border-gray-100 pb-3">
                    <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-base font-semibold text-slate-700 min-w-[100px]">{spec.key}</span>
                    <span className="text-base text-slate-900 ml-2">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // EMOTIONAL ESSAY - 완전히 새로운 레이아웃
    else if (themeClass === 'emotional-essay') {
      return (
        <div className="w-full h-full bg-[#fffef8] flex items-center justify-center p-16">
          <div className="text-center max-w-xl">
            {h1 && (
              <h1 className="text-6xl font-serif text-[#2c2416] mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                {renderStyledText(h1.content, themeClass)}
              </h1>
            )}

            {h2 && (
              <div className="border-t-2 border-b-2 border-[#8B7355] py-3 px-6 inline-block mb-8">
                <h2 className="text-2xl font-serif text-[#5a4a3a]" style={{ fontFamily: 'Georgia, serif' }}>
                  {renderStyledText(h2.content, themeClass)}
                </h2>
              </div>
            )}

            {quote.length > 0 && (
              <div className="mb-8 space-y-6">
                {quote.map((q, i) => (
                  <blockquote key={i} className="relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-5xl text-[#8B7355]/20">"</div>
                    <div className="text-4xl font-serif italic text-[#5a4a3a] px-4" style={{ fontFamily: 'Georgia, serif' }}>
                      {renderStyledText(q.content, themeClass)}
                    </div>
                  </blockquote>
                ))}
              </div>
            )}

            {textElements.length > 0 && (
              <div className="space-y-4 mb-8">
                {textElements.map((el, i) => (
                  <p key={i} className="text-xl font-serif text-[#2c2416] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {renderStyledText(el.content, themeClass)}
                  </p>
                ))}
              </div>
            )}

            {specElements.length > 0 && (
              <div className="space-y-3">
                {specElements.map((spec, i) => (
                  <div key={i} className="text-center">
                    <span className="text-lg font-serif text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>{spec.key}</span>
                    <span className="mx-2 text-[#8B7355]">·</span>
                    <span className="text-lg font-serif text-[#2c2416]" style={{ fontFamily: 'Georgia, serif' }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 데코레이션 */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8B7355]"></div>
              <div className="w-10 h-px bg-[#8B7355]/40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#8B7355]"></div>
            </div>
          </div>
        </div>
      );
    }
  };

  const downloadAll = async () => {
    setIsDownloading(true);
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      console.log('Font loading check failed, continuing anyway');
    }

    const zip = new JSZip();
    const totalSlides = slides.length;

    for (let i = 0; i < totalSlides; i++) {
      if (slideRefs.current[i]) {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          const element = slideRefs.current[i];
          const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 4,
            backgroundColor: themeClass === 'tech-dark' ? '#000000' : themeClass === 'biz-clean' ? '#f8fafc' : '#fffef8',
            cacheBust: true,
          });

          const response = await fetch(dataUrl);
          const blob = await response.blob();
          zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, blob);
        } catch (error) {
          console.error(`Error capturing slide ${i + 1}:`, error);
        }
      }
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'instaflow.zip';
      link.click();
      alert(`${totalSlides}개 슬라이드 다운로드 완료!`);
    } catch (error) {
      alert('다운로드 실패: ' + error.message);
    }

    setIsDownloading(false);
  };

  const themeClass = THEMES[theme];
  const aspectClasses = aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[4/5]';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-black text-gray-900">InstaFlow</h1>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">Theme:</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.keys(THEMES).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">Ratio:</label>
              <div className="flex gap-2">
                <button onClick={() => setAspectRatio('1:1')} className={`px-4 py-2 rounded-lg font-semibold ${aspectRatio === '1:1' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>1:1</button>
                <button onClick={() => setAspectRatio('4:5')} className={`px-4 py-2 rounded-lg font-semibold ${aspectRatio === '4:5' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>4:5</button>
              </div>
            </div>

            <button onClick={downloadAll} disabled={isDownloading} className={`px-6 py-2 rounded-lg font-semibold ${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
              {isDownloading ? '다운로드 중...' : 'Download All'}
            </button>
          </div>
        </div>
      </div>

      {/* AdSense */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="flex justify-center">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8245597797545485" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="flex flex-col h-[600px]">
            <label className="text-sm font-bold text-gray-700 mb-2">Script (Use --- to separate slides)</label>
            <textarea value={script} onChange={(e) => setScript(e.target.value)} className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none" />
          </div>

          {/* Preview */}
          <div className="flex flex-col h-[600px]">
            <label className="text-sm font-bold text-gray-700 mb-2">Live Preview ({slides.length} slides)</label>
            <div className="flex-1 overflow-y-auto bg-gray-100 rounded-lg p-4">
              <div className="space-y-4 max-w-md mx-auto">
                {slides.map((slide, index) => (
                  <div key={index} className="relative">
                    <div ref={(el) => (slideRefs.current[index] = el)} className={`${aspectClasses} w-full relative overflow-hidden shadow-xl rounded-lg`} style={{ width: '400px', height: aspectRatio === '1:1' ? '400px' : '500px' }}>
                      {renderSlide(slide, index, themeClass)}
                      <div className="absolute top-3 right-3 text-xs font-bold opacity-40 text-white mix-blend-difference">
                        {index + 1}/{slides.length}
                      </div>
                      {index < slides.length - 1 && <div className="absolute bottom-3 right-3 text-xl opacity-40">👉</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
