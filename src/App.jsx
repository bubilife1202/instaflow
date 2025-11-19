import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';

const THEMES = {
  'Tech Dark': 'tech-dark',
  'Biz Clean': 'biz-clean',
  'Emotional Essay': 'emotional-essay'
};

const EXAMPLE_SCRIPTS = {
  'Galaxy Book (테크 리뷰)': `# Galaxy Book 4 Pro
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
*최고의 파트너*입니다`,

  '신제품 출시 (비즈 공지)': `# 신제품 출시
## 2024년 12월 15일
---
# 혁신적인 디자인
새로운 기준을 제시합니다
---
가격::₩299,000
사전예약::12월 1일부터
배송::12월 20일 시작
특별혜택::사은품 증정
---
> 지금 바로 사전예약하세요
**20% 할인** *선착순 100명*
---
# 문의하기
고객센터: 1588-0000
웹사이트: example.com`,

  '일상 에세이 (감성)': `# 오늘의 생각
## 작은 행복
---
> 커피 한 잔의 여유
아침 햇살이 참 좋았다
---
# 소중한 순간
매일이 새로운 시작
그 속에서 찾는 의미
---
> 천천히, 그러나 꾸준히
**나만의 속도**로 걸어가기
---
# 오늘도 감사
작은 것에 감사하며
*행복을 만들어가는 하루*`,

  '이벤트 안내': `# 특별 이벤트
## 100명 한정
---
# 이벤트 내용
참여방법::좋아요 + 댓글
당첨인원::추첨 100명
상품::스타벅스 기프티콘
발표일::12월 25일
---
> 지금 바로 참여하세요!
*선착순이 아닌 추첨입니다*
---
# 참여 방법
1. 이 게시물에 좋아요
2. 친구 태그하기
3. 팔로우 필수
---
# 행운을 빕니다
많은 참여 부탁드립니다
**모두에게 기회가 있습니다**`
};

function App() {
  const [script, setScript] = useState(EXAMPLE_SCRIPTS['Galaxy Book (테크 리뷰)']);
  const [theme, setTheme] = useState('Tech Dark');
  const [aspectRatio, setAspectRatio] = useState('4:5');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const slideRefs = useRef([]);

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
        return <strong key={i} className="font-black">{part.content}</strong>;
      } else if (part.type === 'highlight') {
        const color = themeClass === 'tech-dark' ? 'text-cyan-400' : themeClass === 'biz-clean' ? 'text-blue-600' : 'text-amber-600';
        return <span key={i} className={color + ' font-bold'}>{part.content}</span>;
      }
      return <span key={i}>{part.content}</span>;
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
    const h1 = elements.find(el => el.type === 'h1');
    const h2 = elements.find(el => el.type === 'h2');
    const specs = elements.filter(el => el.type === 'spec');
    const quotes = elements.filter(el => el.type === 'quote');
    const texts = elements.filter(el => el.type === 'text');

    // 🌑 TECH DARK
    if (themeClass === 'tech-dark') {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />

          <div className="relative z-10 w-full h-full p-10 flex flex-col justify-center">
            {h1 && (
              <h1 className="text-5xl font-black text-white mb-6 leading-tight line-clamp-2">
                {renderStyledText(h1.content, themeClass)}
              </h1>
            )}

            {h2 && (
              <div className="mb-6">
                <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5">
                  <h2 className="text-2xl font-bold text-white line-clamp-1">
                    {renderStyledText(h2.content, themeClass)}
                  </h2>
                </div>
              </div>
            )}

            {quotes.length > 0 && (
              <div className="mb-6 space-y-2">
                {quotes.slice(0, 2).map((q, i) => (
                  <div key={i} className="text-3xl font-black text-cyan-400 line-clamp-1">
                    {renderStyledText(q.content, themeClass)}
                  </div>
                ))}
              </div>
            )}

            {texts.length > 0 && (
              <div className="mb-6 space-y-2">
                {texts.slice(0, 3).map((t, i) => (
                  <p key={i} className="text-lg text-gray-300 line-clamp-1">
                    {renderStyledText(t.content, themeClass)}
                  </p>
                ))}
              </div>
            )}

            {specs.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5">
                {specs.slice(0, 4).map((spec, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-3 backdrop-blur">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 truncate">{spec.key}</div>
                    <div className="text-sm font-bold text-white truncate">{spec.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 💼 BIZ CLEAN
    else if (themeClass === 'biz-clean') {
      return (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white w-full h-full shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />

            <div className="h-full flex flex-col justify-center pl-4">
              {h1 && (
                <h1 className="text-4xl font-black text-slate-900 mb-5 leading-tight line-clamp-2">
                  {renderStyledText(h1.content, themeClass)}
                </h1>
              )}

              {h2 && (
                <div className="mb-5">
                  <div className="bg-blue-600 text-white px-5 py-2.5 inline-block">
                    <h2 className="text-2xl font-bold line-clamp-1">
                      {renderStyledText(h2.content, themeClass)}
                    </h2>
                  </div>
                </div>
              )}

              {quotes.length > 0 && (
                <div className="mb-5 space-y-2">
                  {quotes.slice(0, 2).map((q, i) => (
                    <div key={i} className="text-2xl font-bold text-blue-600 border-l-4 border-blue-600 pl-3 line-clamp-2">
                      {renderStyledText(q.content, themeClass)}
                    </div>
                  ))}
                </div>
              )}

              {texts.length > 0 && (
                <div className="mb-5 space-y-2">
                  {texts.slice(0, 3).map((t, i) => (
                    <p key={i} className="text-base text-slate-700 flex items-start line-clamp-1">
                      <span className="text-blue-600 mr-2 flex-shrink-0">✓</span>
                      <span>{renderStyledText(t.content, themeClass)}</span>
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
          </div>
        </div>
      );
    }

    // 📖 EMOTIONAL ESSAY
    else if (themeClass === 'emotional-essay') {
      return (
        <div className="w-full h-full bg-[#fffef8] flex items-center justify-center p-12">
          <div className="text-center h-full flex flex-col justify-center max-w-md">
            {h1 && (
              <h1 className="text-5xl font-serif text-[#2c2416] mb-6 leading-tight line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                {renderStyledText(h1.content, themeClass)}
              </h1>
            )}

            {h2 && (
              <div className="mb-6">
                <div className="border-t-2 border-b-2 border-[#8B7355] py-2.5 px-5 inline-block">
                  <h2 className="text-xl font-serif text-[#5a4a3a] line-clamp-1" style={{ fontFamily: 'Georgia, serif' }}>
                    {renderStyledText(h2.content, themeClass)}
                  </h2>
                </div>
              </div>
            )}

            {quotes.length > 0 && (
              <div className="mb-6 space-y-4">
                {quotes.slice(0, 2).map((q, i) => (
                  <blockquote key={i} className="relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-4xl text-[#8B7355]/20">"</div>
                    <div className="text-3xl font-serif italic text-[#5a4a3a] px-2 line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                      {renderStyledText(q.content, themeClass)}
                    </div>
                  </blockquote>
                ))}
              </div>
            )}

            {texts.length > 0 && (
              <div className="mb-6 space-y-3">
                {texts.slice(0, 3).map((t, i) => (
                  <p key={i} className="text-lg font-serif text-[#2c2416] leading-relaxed line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {renderStyledText(t.content, themeClass)}
                  </p>
                ))}
              </div>
            )}

            {specs.length > 0 && (
              <div className="space-y-2">
                {specs.slice(0, 3).map((spec, i) => (
                  <div key={i} className="text-center text-base">
                    <span className="font-serif text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>{spec.key}</span>
                    <span className="mx-2 text-[#8B7355]">·</span>
                    <span className="font-serif text-[#2c2416]" style={{ fontFamily: 'Georgia, serif' }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="w-1 h-1 rounded-full bg-[#8B7355]" />
              <div className="w-8 h-px bg-[#8B7355]/40" />
              <div className="w-1 h-1 rounded-full bg-[#8B7355]" />
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
      await new Promise(r => setTimeout(r, 800));
    } catch (e) {}

    const zip = new JSZip();
    for (let i = 0; i < slides.length; i++) {
      if (slideRefs.current[i]) {
        try {
          await new Promise(r => setTimeout(r, 400));
          const dataUrl = await toPng(slideRefs.current[i], {
            quality: 1,
            pixelRatio: 3,
            backgroundColor: themeClass === 'tech-dark' ? '#000' : themeClass === 'biz-clean' ? '#f8fafc' : '#fffef8',
          });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, blob);
        } catch (err) {
          console.error('Error:', err);
        }
      }
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'instaflow.zip';
      link.click();
    } catch (err) {}

    setIsDownloading(false);
  };

  const themeClass = THEMES[theme];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black text-gray-900">InstaFlow</h1>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setShowGuide(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 text-sm">
              사용 가이드
            </button>

            <select value={Object.keys(EXAMPLE_SCRIPTS).find(key => EXAMPLE_SCRIPTS[key] === script) || ''} onChange={(e) => setScript(EXAMPLE_SCRIPTS[e.target.value])} className="px-3 py-2 border rounded-lg text-sm">
              <option value="">예시 선택...</option>
              {Object.keys(EXAMPLE_SCRIPTS).map(name => <option key={name} value={name}>{name}</option>)}
            </select>

            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
              {Object.keys(THEMES).map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <div className="flex gap-2">
              <button onClick={() => setAspectRatio('1:1')} className={`px-3 py-2 rounded-lg text-sm font-semibold ${aspectRatio === '1:1' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1:1</button>
              <button onClick={() => setAspectRatio('4:5')} className={`px-3 py-2 rounded-lg text-sm font-semibold ${aspectRatio === '4:5' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>4:5</button>
            </div>

            <button onClick={downloadAll} disabled={isDownloading} className={`px-5 py-2 rounded-lg font-semibold text-sm ${isDownloading ? 'bg-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}>
              {isDownloading ? '다운로드 중...' : 'Download'}
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-[600px] flex flex-col">
            <label className="text-sm font-bold mb-2">Script (구분: ---)</label>
            <textarea value={script} onChange={(e) => setScript(e.target.value)} className="flex-1 p-4 border-2 rounded-lg font-mono text-sm resize-none" />
          </div>

          <div className="h-[600px] flex flex-col">
            <label className="text-sm font-bold mb-2">미리보기 ({slides.length}개)</label>
            <div className="flex-1 overflow-y-auto bg-gray-100 rounded-lg p-4">
              <div className="space-y-4 max-w-md mx-auto">
                {slides.map((slide, i) => (
                  <div key={i}>
                    <div ref={el => slideRefs.current[i] = el} className="relative overflow-hidden shadow-xl rounded-lg" style={{ width: '400px', height: aspectRatio === '1:1' ? '400px' : '500px' }}>
                      {renderSlide(slide, i, themeClass)}
                      <div className="absolute top-2 right-2 text-xs font-bold opacity-30 text-white mix-blend-difference">{i+1}/{slides.length}</div>
                      {i < slides.length - 1 && <div className="absolute bottom-2 right-2 text-lg opacity-30">👉</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AdSense */}
        <div className="mt-8 flex justify-center">
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-8245597797545485" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true" />
        </div>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGuide(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black">사용 가이드</h2>
              <button onClick={() => setShowGuide(false)} className="text-3xl text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-600">📝 기본 문법</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 font-mono text-sm">
                  <div><code className="text-pink-600"># 제목</code> → 메인 타이틀</div>
                  <div><code className="text-pink-600">## 부제목</code> → 서브 타이틀 / 가격</div>
                  <div><code className="text-pink-600">키::값</code> → 스펙 항목</div>
                  <div><code className="text-pink-600">&gt; 인용</code> → 강조 문구</div>
                  <div><code className="text-pink-600">*텍스트*</code> → 하이라이트</div>
                  <div><code className="text-pink-600">**텍스트**</code> → 굵게</div>
                  <div><code className="text-pink-600">---</code> → 슬라이드 구분</div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-green-600">🎨 테마 선택</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-black pl-4">
                    <strong>Tech Dark</strong> - IT 제품 리뷰, 테크 정보
                  </div>
                  <div className="border-l-4 border-blue-600 pl-4">
                    <strong>Biz Clean</strong> - 공식 공지, 이벤트, 비즈니스
                  </div>
                  <div className="border-l-4 border-amber-600 pl-4">
                    <strong>Emotional Essay</strong> - 감성 글, 에세이, 일상
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-purple-600">💡 사용 팁</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>한 슬라이드에 너무 많은 내용을 넣지 마세요 (3-5줄 권장)</li>
                  <li>스펙은 최대 4개까지 추천합니다</li>
                  <li>예시 스크립트를 선택해서 참고하세요</li>
                  <li>1:1은 피드, 4:5는 스토리에 적합합니다</li>
                  <li>Download 버튼으로 ZIP 파일로 다운로드됩니다</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-red-600">📌 예시</h3>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
{`# 신제품 출시
## 특별 할인 이벤트
---
가격::₩299,000
할인::20% OFF
배송::무료배송
---
> 지금 바로 구매하세요
**선착순 100명** *한정*`}
                </div>
              </section>
            </div>

            <button onClick={() => setShowGuide(false)} className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
