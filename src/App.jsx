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
  const [aspectRatio, setAspectRatio] = useState('4:5'); // '1:1' or '4:5'
  const [isDownloading, setIsDownloading] = useState(false);
  const slideRefs = useRef([]);
  const downloadRef = useRef(null);

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

  // Parse script into slides
  const slides = script.split('---').map(s => s.trim()).filter(s => s.length > 0);

  // Parse markdown styling
  const parseInlineMarkdown = (text) => {
    // Handle **bold** and *highlight*
    const parts = [];
    let lastIndex = 0;

    // First handle **bold**
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;
    let processedText = text;
    const boldMatches = [];

    while ((match = boldRegex.exec(text)) !== null) {
      boldMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1], type: 'bold' });
    }

    // Then handle *highlight* (but not part of **)
    const highlightRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g;
    const highlightMatches = [];

    while ((match = highlightRegex.exec(text)) !== null) {
      highlightMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1], type: 'highlight' });
    }

    // Combine and sort matches
    const allMatches = [...boldMatches, ...highlightMatches].sort((a, b) => a.start - b.start);

    allMatches.forEach((match, i) => {
      // Add text before match
      if (match.start > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.start) });
      }

      // Add matched text
      parts.push({ type: match.type, content: match.text });
      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    if (parts.length === 0) {
      parts.push({ type: 'text', content: text });
    }

    return parts;
  };

  // Render inline styled text
  const renderStyledText = (text, themeClass) => {
    const parts = parseInlineMarkdown(text);

    return parts.map((part, i) => {
      if (part.type === 'bold') {
        return <span key={i} className="font-bold">{part.content}</span>;
      } else if (part.type === 'highlight') {
        const highlightColor = themeClass === 'tech-dark'
          ? 'text-blue-400'
          : themeClass === 'biz-clean'
          ? 'text-blue-600'
          : 'text-amber-700';
        return <span key={i} className={highlightColor}>{part.content}</span>;
      } else {
        return <span key={i}>{part.content}</span>;
      }
    });
  };

  // Parse slide content
  const parseSlide = (content) => {
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    return lines.map(line => {
      line = line.trim();

      if (line.startsWith('# ')) {
        return { type: 'h1', content: line.slice(2) };
      } else if (line.startsWith('## ')) {
        return { type: 'h2', content: line.slice(3) };
      } else if (line.includes('::')) {
        const [key, value] = line.split('::').map(s => s.trim());
        return { type: 'spec', key, value };
      } else if (line.startsWith('> ')) {
        return { type: 'quote', content: line.slice(2) };
      } else {
        return { type: 'text', content: line };
      }
    });
  };

  // Render slide based on theme
  const renderSlide = (slideContent, index, themeClass) => {
    const elements = parseSlide(slideContent);
    const hasSpecs = elements.some(el => el.type === 'spec');
    const specElements = elements.filter(el => el.type === 'spec');
    const nonSpecElements = elements.filter(el => el.type !== 'spec');

    // Tech Dark Theme - 프리미엄 테크 리뷰 스타일
    if (themeClass === 'tech-dark') {
      return (
        <div className="w-full h-full relative overflow-hidden bg-[#000000]">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#000000]" />

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* Content Container */}
          <div className="relative h-full flex flex-col justify-between p-16">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-center">
              {nonSpecElements.map((el, i) => {
                if (el.type === 'h1') {
                  return (
                    <h1 key={i} className="text-7xl font-black mb-6 leading-[1.1] tracking-tight text-white">
                      {renderStyledText(el.content, themeClass)}
                    </h1>
                  );
                } else if (el.type === 'h2') {
                  return (
                    <div key={i} className="inline-block mb-8">
                      <div className="relative px-8 py-4 bg-white/5 border-2 border-white/20 backdrop-blur-xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
                        <h2 className="relative text-4xl font-bold text-white tracking-wide">
                          {renderStyledText(el.content, themeClass)}
                        </h2>
                      </div>
                    </div>
                  );
                } else if (el.type === 'quote') {
                  return (
                    <blockquote key={i} className="my-8 space-y-3">
                      <div className="text-5xl font-black text-cyan-400 leading-tight">
                        {renderStyledText(el.content, themeClass)}
                      </div>
                    </blockquote>
                  );
                } else {
                  return (
                    <p key={i} className="text-2xl mb-4 text-gray-300 leading-relaxed font-light">
                      {renderStyledText(el.content, themeClass)}
                    </p>
                  );
                }
              })}

              {/* Spec Grid */}
              {hasSpecs && (
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {specElements.map((el, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg blur-sm group-hover:blur-md transition-all" />
                      <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-lg p-5">
                        <div className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">{el.key}</div>
                        <div className="text-xl font-bold text-white">{el.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          </div>
        </div>
      );
    }

    // Biz Clean Theme - 기업 공식 발표 스타일
    else if (themeClass === 'biz-clean') {
      return (
        <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center p-12">
          {/* Main Card */}
          <div className="relative w-full max-w-4xl">
            {/* Blue Accent Bar */}
            <div className="absolute -left-3 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full" />

            {/* Content Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-14 border border-gray-100">
              {elements.map((el, i) => {
                if (el.type === 'h1') {
                  return (
                    <h1 key={i} className="text-6xl font-black mb-6 text-slate-900 leading-[1.15] tracking-tight">
                      {renderStyledText(el.content, themeClass)}
                    </h1>
                  );
                } else if (el.type === 'h2') {
                  return (
                    <div key={i} className="mb-8 inline-block">
                      <div className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow-lg">
                        <h2 className="text-4xl font-bold tracking-tight">
                          {renderStyledText(el.content, themeClass)}
                        </h2>
                      </div>
                    </div>
                  );
                } else if (el.type === 'spec') {
                  return (
                    <div key={i} className="flex items-baseline mb-5 pb-5 border-b border-gray-100 last:border-0">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-xl font-semibold text-slate-700 min-w-[140px]">{el.key}</span>
                      <span className="text-xl text-slate-900 font-medium ml-3">{el.value}</span>
                    </div>
                  );
                } else if (el.type === 'quote') {
                  return (
                    <blockquote key={i} className="my-8 pl-6 border-l-4 border-blue-500">
                      <div className="text-4xl font-bold text-blue-600 leading-snug">
                        {renderStyledText(el.content, themeClass)}
                      </div>
                    </blockquote>
                  );
                } else {
                  return (
                    <p key={i} className="text-2xl mb-4 text-slate-700 leading-relaxed font-normal">
                      {renderStyledText(el.content, themeClass)}
                    </p>
                  );
                }
              })}

              {/* Bottom Brand Line */}
              <div className="mt-10 pt-8 border-t-2 border-gray-100">
                <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Emotional Essay Theme - 감성 에세이/브런치 스타일
    else if (themeClass === 'emotional-essay') {
      return (
        <div className="w-full h-full bg-[#FFFEF9] flex items-center justify-center px-20 py-24">
          <div className="max-w-2xl text-center space-y-8">
            {elements.map((el, i) => {
              if (el.type === 'h1') {
                return (
                  <h1 key={i} className="text-7xl font-serif mb-10 text-[#2c2416] leading-[1.2] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {renderStyledText(el.content, themeClass)}
                  </h1>
                );
              } else if (el.type === 'h2') {
                return (
                  <div key={i} className="mb-10">
                    <div className="inline-block border-t-2 border-b-2 border-[#8B7355] py-4 px-8">
                      <h2 className="text-3xl font-serif text-[#5a4a3a] tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                        {renderStyledText(el.content, themeClass)}
                      </h2>
                    </div>
                  </div>
                );
              } else if (el.type === 'spec') {
                return (
                  <div key={i} className="text-center my-6">
                    <span className="text-xl font-serif text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                      {el.key}
                    </span>
                    <span className="mx-3 text-[#8B7355]">·</span>
                    <span className="text-xl font-serif text-[#2c2416]" style={{ fontFamily: 'Georgia, serif' }}>
                      {el.value}
                    </span>
                  </div>
                );
              } else if (el.type === 'quote') {
                return (
                  <blockquote key={i} className="my-12 relative">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl text-[#8B7355]/20">"</div>
                    <div className="text-5xl font-serif italic text-[#5a4a3a] leading-snug px-8" style={{ fontFamily: 'Georgia, serif' }}>
                      {renderStyledText(el.content, themeClass)}
                    </div>
                  </blockquote>
                );
              } else {
                return (
                  <p key={i} className="text-2xl font-serif text-[#2c2416] leading-[1.8] my-6" style={{ fontFamily: 'Georgia, serif' }}>
                    {renderStyledText(el.content, themeClass)}
                  </p>
                );
              }
            })}

            {/* Decorative Element */}
            <div className="flex items-center justify-center gap-2 mt-12 pt-8">
              <div className="w-2 h-2 rounded-full bg-[#8B7355]" />
              <div className="w-12 h-0.5 bg-[#8B7355]/40" />
              <div className="w-2 h-2 rounded-full bg-[#8B7355]" />
            </div>
          </div>
        </div>
      );
    }
  };

  // Download all slides
  const downloadAll = async () => {
    setIsDownloading(true);

    // 폰트 로드 대기
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 500)); // 추가 대기
    } catch (e) {
      console.log('Font loading check failed, continuing anyway');
    }

    const zip = new JSZip();
    const totalSlides = slides.length;

    console.log(`Starting to capture ${totalSlides} slides...`);

    for (let i = 0; i < totalSlides; i++) {
      if (slideRefs.current[i]) {
        try {
          console.log(`Capturing slide ${i + 1}/${totalSlides}...`);

          // 약간의 딜레이
          await new Promise(resolve => setTimeout(resolve, 300));

          const element = slideRefs.current[i];

          // 실제 크기로 캡처 (scale 사용)
          const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 4, // 높은 해상도
            backgroundColor: themeClass === 'tech-dark' ? '#0a0a0a' : themeClass === 'biz-clean' ? '#f3f4f6' : '#FDFBF7',
            cacheBust: true,
            fontEmbedCSS: '',
            skipFonts: false,
          });

          // Convert data URL to blob
          const response = await fetch(dataUrl);
          const blob = await response.blob();

          zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, blob);

          console.log(`✓ Slide ${i + 1} captured`);
        } catch (error) {
          console.error(`✗ Error capturing slide ${i + 1}:`, error);
          alert(`슬라이드 ${i + 1} 캡처 실패: ${error.message}`);
        }
      }
    }

    try {
      console.log('Generating ZIP file...');
      const content = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'instaflow.zip';
      link.click();

      console.log('✓ Download started!');
      alert(`${totalSlides}개 슬라이드 다운로드 완료!`);
    } catch (error) {
      console.error('ZIP generation failed:', error);
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900">InstaFlow</h1>

          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(THEMES).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">Ratio:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    aspectRatio === '1:1'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  1:1
                </button>
                <button
                  onClick={() => setAspectRatio('4:5')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    aspectRatio === '4:5'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  4:5
                </button>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadAll}
              disabled={isDownloading}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors shadow-md ${
                isDownloading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isDownloading ? '다운로드 중...' : 'Download All'}
            </button>
          </div>
        </div>
      </div>

      {/* Google AdSense Banner */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="flex justify-center">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8245597797545485"
               data-ad-slot="auto"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left: Text Editor */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-2">
              Script (Use --- to separate slides)
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
              placeholder="Enter your script here..."
            />
          </div>

          {/* Right: Live Preview */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-2">
              Live Preview ({slides.length} slides)
            </label>
            <div className="flex-1 overflow-y-auto bg-gray-100 rounded-lg p-4">
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                {slides.map((slide, index) => (
                  <div key={index} className="relative">
                    <div
                      ref={(el) => (slideRefs.current[index] = el)}
                      className={`${aspectClasses} w-full min-w-[400px] relative overflow-hidden shadow-lg rounded-lg`}
                      style={{ minHeight: aspectRatio === '1:1' ? '400px' : '500px' }}
                    >
                      {renderSlide(slide, index, themeClass)}

                      {/* Page Number */}
                      <div className="absolute top-4 right-4 text-sm font-bold opacity-50">
                        {index + 1}/{slides.length}
                      </div>

                      {/* Swipe Arrow (except last slide) */}
                      {index < slides.length - 1 && (
                        <div className="absolute bottom-4 right-4 text-2xl opacity-50">
                          👉
                        </div>
                      )}
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
