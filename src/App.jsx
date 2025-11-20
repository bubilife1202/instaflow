import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Type, Heading1, Heading2, Bold, Sparkles, Minus, BookOpen, Image as ImageIcon, Instagram, RotateCcw, Copy, Wand2 } from 'lucide-react';

// Import utilities and configuration
import { parseSlide } from './utils/parseSlide';
import { THEME_DISPLAY_NAMES, getThemeBackgroundColor } from './config/themeConfig';
import { TEMPLATES, getTemplateList } from './config/templates';

// Import theme components
import { TechDarkTheme } from './components/themes/TechDarkTheme';
import { BizCleanTheme } from './components/themes/BizCleanTheme';
import { EmotionalEssayTheme } from './components/themes/EmotionalEssayTheme';

const THEMES = THEME_DISPLAY_NAMES;

// LocalStorage keys
const STORAGE_KEYS = {
  SCRIPT: 'instaflow_script',
  THEME: 'instaflow_theme',
  ASPECT_RATIO: 'instaflow_aspect_ratio',
  INSTAGRAM_ID: 'instaflow_instagram_id',
};

function App() {
  // Load from localStorage or use defaults
  const [script, setScript] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCRIPT);
    return saved || TEMPLATES['techReview'].content;
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'Tech Dark';
  });
  const [aspectRatio, setAspectRatio] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ASPECT_RATIO) || '4:5';
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [instagramId, setInstagramId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.INSTAGRAM_ID) || '';
  });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [useBackgroundImage, setUseBackgroundImage] = useState(false);
  const slideRefs = useRef([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCRIPT, script);
  }, [script]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASPECT_RATIO, aspectRatio);
  }, [aspectRatio]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTAGRAM_ID, instagramId);
  }, [instagramId]);

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

  // Editor Toolbar Functions
  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = script.substring(start, end);
    const newText = script.substring(0, start) + before + selectedText + after + script.substring(end);

    setScript(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Background Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setBackgroundImage(url);
      setUseBackgroundImage(true);
    }
  };

  // Load template
  const loadTemplate = (templateKey) => {
    const template = TEMPLATES[templateKey];
    if (template) {
      setScript(template.content);
    }
  };

  // Reset all content
  const handleReset = () => {
    if (confirm('모든 내용을 초기화하시겠습니까?')) {
      setScript(TEMPLATES['techReview'].content);
      setTheme('Tech Dark');
      setAspectRatio('4:5');
      setInstagramId('');
      setBackgroundImage(null);
      setUseBackgroundImage(false);
      localStorage.clear();
    }
  };

  // Copy caption text
  const copyCaption = () => {
    const caption = slides.map((slide, i) => {
      const { elements } = parseSlide(slide);
      const texts = elements
        .filter(el => el.type === 'text' || el.type === 'quote')
        .map(el => el.content)
        .join('\n');
      return texts;
    }).filter(t => t).join('\n\n');

    navigator.clipboard.writeText(caption).then(() => {
      alert('캡션이 클립보드에 복사되었습니다!');
    });
  };

  // Generate AI Prompt
  const [aiTopic, setAiTopic] = useState('');
  const generateAIPrompt = () => {
    const prompt = `다음 주제로 인스타그램 카드뉴스 콘텐츠를 작성해주세요.

주제: ${aiTopic}

형식:
- # 제목 (메인 타이틀)
- ## 부제목 (서브 타이틀 또는 가격)
- 키::값 (스펙 항목, 예: CPU::Intel Core i7)
- > 인용 (강조 문구)
- *텍스트* (하이라이트)
- **텍스트** (굵게)
- --- (슬라이드 구분)

슬라이드는 5-8개 정도로 작성하고, 각 슬라이드는 간결하면서도 임팩트 있게 만들어주세요.`;

    return prompt;
  };

  const copyAIPrompt = () => {
    const prompt = generateAIPrompt();
    navigator.clipboard.writeText(prompt).then(() => {
      alert('AI 프롬프트가 복사되었습니다!\nChatGPT나 Claude에 붙여넣어 사용하세요.');
    });
  };

  // Render slide using theme components
  const renderSlide = (slideContent, index, themeClass) => {
    const { elements, background } = parseSlide(slideContent);

    // Determine which background to use
    const bgImage = background || (useBackgroundImage ? backgroundImage : null);

    // Common props for all theme components
    const themeProps = {
      elements,
      bgImage,
      instagramId,
    };

    // Render based on theme
    switch (themeClass) {
      case 'tech-dark':
        return <TechDarkTheme {...themeProps} />;
      case 'biz-clean':
        return <BizCleanTheme {...themeProps} />;
      case 'emotional-essay':
        return <EmotionalEssayTheme {...themeProps} />;
      default:
        return <TechDarkTheme {...themeProps} />;
    }
  };

  const downloadAll = async () => {
    setIsDownloading(true);
    try {
      // Font loading - only once at the beginning
      await document.fonts.ready;
      // Minimal initial delay - reduced from 800ms to 200ms
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {}

    const zip = new JSZip();
    for (let i = 0; i < slides.length; i++) {
      if (slideRefs.current[i]) {
        try {
          // Reduced delay between captures: 100ms instead of 400ms
          if (i > 0) await new Promise(r => setTimeout(r, 100));

          const dataUrl = await toPng(slideRefs.current[i], {
            quality: 1,
            pixelRatio: 2, // Reduced from 3 to 2 for faster processing (still high quality: 800x800 or 800x1000)
            backgroundColor: getThemeBackgroundColor(themeClass),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Type className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">InstaFlow</h1>
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded border border-cyan-500/30">PRO</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setShowGuide(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                가이드
              </button>

              <button onClick={() => setShowAIPrompt(true)} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 text-sm flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                AI 도우미
              </button>

              <select onChange={(e) => loadTemplate(e.target.value)} className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg text-sm">
                <option value="">템플릿 선택...</option>
                {getTemplateList().map(({ key, name }) => <option key={key} value={key}>{name}</option>)}
              </select>

              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg text-sm">
                {Object.keys(THEMES).map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div className="flex gap-2">
                <button onClick={() => setAspectRatio('1:1')} className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${aspectRatio === '1:1' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300'}`}>1:1</button>
                <button onClick={() => setAspectRatio('4:5')} className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${aspectRatio === '4:5' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300'}`}>4:5</button>
              </div>

              {/* Background Image Controls */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition flex items-center gap-2"
                title="Upload Background Image"
              >
                <ImageIcon className="w-4 h-4" />
                {backgroundImage ? '✓' : '배경'}
              </button>
              {backgroundImage && (
                <button
                  onClick={() => setUseBackgroundImage(!useBackgroundImage)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${useBackgroundImage ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300'}`}
                  title="Toggle Background Image"
                >
                  {useBackgroundImage ? 'BG ON' : 'BG OFF'}
                </button>
              )}

              <button onClick={downloadAll} disabled={isDownloading} className={`px-6 py-2 rounded-lg font-bold text-sm transition shadow-lg ${isDownloading ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'}`}>
                {isDownloading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    생성 중...
                  </span>
                ) : '다운로드'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-[700px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-gray-700">스크립트 에디터</label>
              <input
                type="text"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                placeholder="@your_instagram"
                className="px-3 py-1 text-xs border border-gray-300 rounded-lg w-40"
              />
            </div>

            {/* Editor Toolbar */}
            <div className="flex gap-2 mb-3 pb-3 border-b justify-between">
              <div className="flex gap-2">
                <button onClick={() => insertText('# ')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition" title="H1">
                  <Heading1 className="w-4 h-4" />
                </button>
                <button onClick={() => insertText('## ')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition" title="H2">
                  <Heading2 className="w-4 h-4" />
                </button>
                <button onClick={() => insertText('**', '**')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition" title="Bold">
                  <Bold className="w-4 h-4" />
                </button>
                <button onClick={() => insertText('*', '*')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition" title="Highlight">
                  <Sparkles className="w-4 h-4" />
                </button>
                <button onClick={() => insertText('\n---\n')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition" title="New Slide">
                  <Minus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={copyCaption} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition" title="캡션 복사">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={handleReset} className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded transition" title="초기화">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="flex-1 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm resize-none focus:border-cyan-500 focus:outline-none transition"
              placeholder="여기에 스크립트를 작성하세요..."
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-[700px] flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-4">미리보기 ({slides.length}개 슬라이드)</label>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6">
                {slides.map((slide, i) => (
                  <div key={i} className="flex justify-center">
                    {/* Smartphone Mockup Frame */}
                    <div className="relative inline-block" style={{ width: '420px', height: aspectRatio === '1:1' ? '420px' : '520px' }}>
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[40px] shadow-2xl p-[10px] w-full h-full">
                        <div ref={el => slideRefs.current[i] = el} className="relative overflow-hidden rounded-[32px]" style={{ width: '400px', height: aspectRatio === '1:1' ? '400px' : '500px' }}>
                          {renderSlide(slide, i, themeClass)}
                          <div className="absolute top-2 right-2 text-xs font-bold opacity-30 text-white mix-blend-difference">{i+1}/{slides.length}</div>
                          {i < slides.length - 1 && <div className="absolute bottom-2 right-2 text-lg opacity-30">👉</div>}
                        </div>
                      </div>
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

        {/* Footer */}
        <footer className="mt-12 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="border-t border-gray-300 pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.instagram.com/reels_code_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition shadow-md"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="font-semibold">Instagram</span>
                  </a>
                  <a
                    href="https://www.threads.com/@reels_code_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-md"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" fill="currentColor"/>
                    </svg>
                    <span className="font-semibold">Threads</span>
                  </a>
                </div>
                <p className="text-sm text-gray-500">© 2024 InstaFlow. Made with ❤️ by reels_code_official</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowGuide(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
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
                  <div><code className="text-pink-600">[bg: 이미지URL]</code> → 슬라이드별 배경 이미지 (선택)</div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-cyan-600">🖼 배경 이미지</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>배경</strong> 버튼으로 이미지 업로드 (전체 슬라이드 적용)</p>
                  <p><strong>BG ON/OFF</strong> 토글로 배경 사용 여부 전환</p>
                  <p>슬라이드별로 다른 배경을 쓰려면 <code className="text-pink-600 bg-gray-100 px-1 rounded">[bg: URL]</code> 문법 사용</p>
                  <p className="text-sm text-gray-500">※ 배경 이미지 사용 시 텍스트 가독성을 위해 자동으로 어두운 오버레이가 적용됩니다</p>
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
                <h3 className="text-xl font-bold mb-3 text-purple-600">🛠 에디터 툴바</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>툴바 버튼으로 빠르게 마크다운 삽입</li>
                  <li>Instagram ID를 입력하면 모든 슬라이드에 워터마크 추가</li>
                  <li>텍스트를 선택하고 Bold/Highlight 클릭</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-red-600">💡 사용 팁</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>한 슬라이드에 3-5줄 권장</li>
                  <li>스펙은 최대 4개까지</li>
                  <li>1:1은 피드, 4:5는 스토리용</li>
                  <li>고해상도 3x 픽셀로 다운로드됩니다</li>
                </ul>
              </section>
            </div>

            <button onClick={() => setShowGuide(false)} className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700">
              닫기
            </button>
          </div>
        </div>
      )}

      {/* AI Prompt Generator Modal */}
      {showAIPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAIPrompt(false)}>
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black flex items-center gap-2">
                <Wand2 className="w-8 h-8 text-purple-600" />
                AI 프롬프트 생성기
              </h2>
              <button onClick={() => setShowAIPrompt(false)} className="text-3xl text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                ChatGPT나 Claude에게 가져갈 프롬프트를 생성합니다. 주제만 입력하면 InstaFlow 형식에 맞는 콘텐츠를 요청하는 프롬프트가 만들어집니다.
              </p>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">주제를 입력하세요</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="예: 건강한 아침 루틴 만들기"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              {aiTopic && (
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-700">생성된 프롬프트</span>
                    <button onClick={copyAIPrompt} className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-1">
                      <Copy className="w-3 h-3" />
                      복사
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                    {generateAIPrompt()}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">💡 사용 방법</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>위에 주제를 입력하세요</li>
                  <li>"복사" 버튼을 클릭하세요</li>
                  <li>ChatGPT 또는 Claude에 접속하세요</li>
                  <li>복사한 프롬프트를 붙여넣으세요</li>
                  <li>AI가 생성한 내용을 InstaFlow 에디터에 붙여넣으세요</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
