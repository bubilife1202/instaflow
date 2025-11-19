import { useState, useRef } from 'react';
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
  const slideRefs = useRef([]);

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

    // Tech Dark Theme
    if (themeClass === 'tech-dark') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white font-sans p-12 flex flex-col justify-center">
          {elements.map((el, i) => {
            if (el.type === 'h1') {
              return (
                <h1 key={i} className="text-6xl font-black mb-4 leading-tight">
                  {renderStyledText(el.content, themeClass)}
                </h1>
              );
            } else if (el.type === 'h2') {
              return (
                <div key={i} className="inline-block border-2 border-white/30 px-6 py-3 mb-6 backdrop-blur-sm">
                  <h2 className="text-3xl font-bold">{renderStyledText(el.content, themeClass)}</h2>
                </div>
              );
            } else if (el.type === 'spec') {
              return null; // Rendered in grid below
            } else if (el.type === 'quote') {
              return (
                <blockquote key={i} className="text-4xl font-bold my-4 text-blue-400">
                  {renderStyledText(el.content, themeClass)}
                </blockquote>
              );
            } else {
              return (
                <p key={i} className="text-xl mb-3 leading-relaxed">
                  {renderStyledText(el.content, themeClass)}
                </p>
              );
            }
          })}

          {hasSpecs && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              {elements.filter(el => el.type === 'spec').map((el, i) => (
                <div key={i} className="border border-white/20 p-4 backdrop-blur-sm">
                  <div className="text-sm text-gray-400 mb-1">{el.key}</div>
                  <div className="text-lg font-bold">{el.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Biz Clean Theme
    else if (themeClass === 'biz-clean') {
      return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center p-8">
          <div className="bg-white shadow-2xl rounded-lg p-12 max-w-[90%] max-h-[90%] overflow-auto">
            {elements.map((el, i) => {
              if (el.type === 'h1') {
                return (
                  <h1 key={i} className="text-5xl font-black mb-4 text-slate-900 font-sans">
                    {renderStyledText(el.content, themeClass)}
                  </h1>
                );
              } else if (el.type === 'h2') {
                return (
                  <div key={i} className="border-4 border-blue-600 px-6 py-4 mb-6 inline-block">
                    <h2 className="text-3xl font-bold text-slate-900">{renderStyledText(el.content, themeClass)}</h2>
                  </div>
                );
              } else if (el.type === 'spec') {
                return (
                  <div key={i} className="flex items-center mb-3">
                    <span className="text-blue-600 mr-3 text-2xl">✓</span>
                    <span className="text-lg font-semibold text-slate-700">{el.key}:</span>
                    <span className="text-lg text-slate-900 ml-2">{el.value}</span>
                  </div>
                );
              } else if (el.type === 'quote') {
                return (
                  <blockquote key={i} className="text-3xl font-bold my-4 text-blue-600 border-l-4 border-blue-600 pl-4">
                    {renderStyledText(el.content, themeClass)}
                  </blockquote>
                );
              } else {
                return (
                  <p key={i} className="text-lg mb-3 text-slate-800 flex items-start font-sans">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>{renderStyledText(el.content, themeClass)}</span>
                  </p>
                );
              }
            })}
          </div>
        </div>
      );
    }

    // Emotional Essay Theme
    else if (themeClass === 'emotional-essay') {
      return (
        <div className="w-full h-full bg-[#FDFBF7] flex items-center justify-center p-16">
          <div className="text-center max-w-2xl">
            {elements.map((el, i) => {
              if (el.type === 'h1') {
                return (
                  <h1 key={i} className="text-6xl font-serif mb-6 text-[#433422] leading-tight">
                    {renderStyledText(el.content, themeClass)}
                  </h1>
                );
              } else if (el.type === 'h2') {
                return (
                  <h2 key={i} className="text-3xl font-serif mb-6 text-[#6B5D4F]">
                    {renderStyledText(el.content, themeClass)}
                  </h2>
                );
              } else if (el.type === 'spec') {
                return (
                  <p key={i} className="text-xl my-3 text-[#433422] font-serif">
                    {el.key}: {el.value}
                  </p>
                );
              } else if (el.type === 'quote') {
                return (
                  <blockquote key={i} className="text-4xl font-serif my-8 text-[#8B7355] italic">
                    {renderStyledText(el.content, themeClass)}
                  </blockquote>
                );
              } else {
                return (
                  <p key={i} className="text-2xl my-4 text-[#433422] leading-relaxed font-serif">
                    {renderStyledText(el.content, themeClass)}
                  </p>
                );
              }
            })}
          </div>
        </div>
      );
    }
  };

  // Download all slides
  const downloadAll = async () => {
    const zip = new JSZip();

    for (let i = 0; i < slideRefs.current.length; i++) {
      if (slideRefs.current[i]) {
        try {
          const dataUrl = await toPng(slideRefs.current[i], {
            quality: 1,
            pixelRatio: 3,
            backgroundColor: themeClass === 'tech-dark' ? '#0a0a0a' : themeClass === 'biz-clean' ? '#f3f4f6' : '#FDFBF7'
          });

          // Convert data URL to blob
          const response = await fetch(dataUrl);
          const blob = await response.blob();

          zip.file(`slide-${i + 1}.png`, blob);
        } catch (error) {
          console.error(`Error capturing slide ${i + 1}:`, error);
        }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'instaflow.zip';
    link.click();
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              Download All
            </button>
          </div>
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
              <div className="grid grid-cols-2 gap-4">
                {slides.map((slide, index) => (
                  <div key={index} className="relative">
                    <div
                      ref={(el) => (slideRefs.current[index] = el)}
                      className={`${aspectClasses} w-full relative overflow-hidden shadow-lg rounded-lg`}
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
