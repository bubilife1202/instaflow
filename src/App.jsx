import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Type, Heading1, Heading2, Bold, Sparkles, Minus, BookOpen, Image as ImageIcon, Instagram, RotateCcw, Copy, Wand2, FileText, Palette, Share2, Twitter, Facebook, Menu, X, Zap, Edit3, ChevronRight } from 'lucide-react';

// Import utilities and configuration
import { parseSlide } from './utils/parseSlide';
import { THEME_DISPLAY_NAMES, getThemeBackgroundColor } from './config/themeConfig';
import { TEMPLATES, getTemplateList } from './config/templates';

// Import data presets
import { SCRIPT_PRESETS, getScriptPresetsList, SCRIPT_CATEGORIES } from './data/scriptPresets';
import { DESIGN_TEMPLATES, getDesignTemplatesList, DESIGN_CATEGORIES, applyDesignToElement } from './data/designTemplates';

// Import theme components
import { TechDarkTheme } from './components/themes/TechDarkTheme';
import { BizCleanTheme } from './components/themes/BizCleanTheme';
import { EmotionalEssayTheme } from './components/themes/EmotionalEssayTheme';
import { MinimalistCardTheme } from './components/themes/MinimalistCardTheme';
import { BoldMagazineTheme } from './components/themes/BoldMagazineTheme';
import { InstagramStoryTheme } from './components/themes/InstagramStoryTheme';
import { ModernGradientTheme } from './components/themes/ModernGradientTheme';
import { EmotionalFilmTheme } from './components/themes/EmotionalFilmTheme';

// Import new Batch Flow Maker
import BatchFlowMaker from './components/BatchFlowMaker';

const THEMES = THEME_DISPLAY_NAMES;

// LocalStorage keys
const STORAGE_KEYS = {
  SCRIPT: 'instaflow_script',
  THEME: 'instaflow_theme',
  ASPECT_RATIO: 'instaflow_aspect_ratio',
  INSTAGRAM_ID: 'instaflow_instagram_id',
  DESIGN_TEMPLATE: 'instaflow_design_template',
};

// Landing Page Component
function LandingPage({ onSelectMode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Type className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">InstaFlow</h1>
            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-bold rounded-full">PRO</span>
          </div>

          {/* Tagline */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              인스타그램 카드뉴스,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">3초만에 만들기</span>
            </h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              디자인 경험 없이도 전문가 수준의 카드뉴스를 만들 수 있습니다.
              내용만 입력하면 디자인은 자동으로!
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Batch Flow Maker - Recommended */}
            <button
              onClick={() => onSelectMode('batch')}
              className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-3xl p-8 text-left hover:border-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full">
                추천
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">원클릭 메이커</h3>
              <p className="text-white/60 mb-4">
                구조 선택 → 내용 입력 → 테마 적용<br />
                6장 세트를 한 번에 완성!
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs">✓</span>
                  10가지 검증된 구조 템플릿
                </li>
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs">✓</span>
                  AI 제목 추천 (Gemini 연동)
                </li>
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs">✓</span>
                  테마 팩 실시간 미리보기
                </li>
              </ul>
              <div className="flex items-center text-purple-400 font-semibold group-hover:text-purple-300">
                시작하기 <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Classic Editor */}
            <button
              onClick={() => onSelectMode('classic')}
              className="group bg-white/5 border-2 border-white/10 rounded-3xl p-8 text-left hover:border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <Edit3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">클래식 에디터</h3>
              <p className="text-white/60 mb-4">
                마크다운으로 자유롭게 작성<br />
                기존 사용자를 위한 에디터
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-white/50 text-xs">✓</span>
                  자유로운 마크다운 문법
                </li>
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-white/50 text-xs">✓</span>
                  8가지 테마 선택
                </li>
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <span className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-white/50 text-xs">✓</span>
                  30+ 디자인 템플릿
                </li>
              </ul>
              <div className="flex items-center text-white/60 font-semibold group-hover:text-white/80">
                에디터 열기 <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: '🚀', label: '서버 비용 없음', desc: '100% 무료' },
              { icon: '🎨', label: '10+ 테마 팩', desc: '표지~CTA 세트' },
              { icon: '🤖', label: 'AI 지원', desc: 'Gemini 연동' },
              { icon: '📱', label: '고해상도', desc: '1080px 출력' },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">{f.icon}</div>
                <div className="font-bold text-white text-sm">{f.label}</div>
                <div className="text-xs text-white/50">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <a
              href="https://www.instagram.com/reels_code_official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition text-sm"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
          <p className="text-sm text-white/40">© 2024 InstaFlow. Made with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

// Classic Editor Component (Original App)
function ClassicEditor({ onBack }) {
  // Load from localStorage or use tutorial as default
  const [script, setScript] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCRIPT);
    return saved || SCRIPT_PRESETS['tutorial'].content;
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
  const [showContentModal, setShowContentModal] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [instagramId, setInstagramId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.INSTAGRAM_ID) || '';
  });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [useBackgroundImage, setUseBackgroundImage] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DESIGN_TEMPLATE) || null;
  });
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null); // { current: 0, total: 0 }
  const [showDownloadComplete, setShowDownloadComplete] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
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
    if (selectedDesign) {
      localStorage.setItem(STORAGE_KEYS.DESIGN_TEMPLATE, selectedDesign);
    }
  }, [selectedDesign]);

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

  // Load template (old system - kept for backward compatibility)
  const loadTemplate = (templateKey) => {
    const template = TEMPLATES[templateKey];
    if (template) {
      setScript(template.content);
    }
  };

  // Load content preset (new system - content only)
  const loadContentPreset = (presetId) => {
    const preset = SCRIPT_PRESETS[presetId];
    if (preset) {
      setScript(preset.content);
      setShowContentModal(false);
    }
  };

  // Apply design template (new system - design only)
  const applyDesignTemplate = (templateId) => {
    setSelectedDesign(templateId);
    setShowDesignModal(false);
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

  // Social Share Functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://instaflow.netlify.app';
  const shareText = 'InstaFlow - 인스타그램 카드뉴스, 3초 만에 만들기';

  const handleShare = (platform) => {
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('링크가 복사되었습니다! 친구들에게 공유해주세요.');
        });
        setShowShareMenu(false);
        return;
    }
    if (url) window.open(url, '_blank');
    setShowShareMenu(false);
  };

  // Render slide using theme components with optional design template
  const renderSlide = (slideContent, index, themeClass) => {
    const { elements, background } = parseSlide(slideContent);

    // Determine which background to use
    const bgImage = background || (useBackgroundImage ? backgroundImage : null);

    // Get design template if selected (only applies when no bgImage)
    let designStyles = null;
    let designTemplate = null;
    if (selectedDesign && !bgImage) {
      designTemplate = DESIGN_TEMPLATES[selectedDesign];
      if (designTemplate) {
        designStyles = applyDesignToElement(designTemplate);
      }
    }

    // Common props for all theme components
    const themeProps = {
      elements,
      bgImage,
      instagramId,
      useDesignTemplate: !!designStyles, // Flag to make theme background transparent
      designColors: designTemplate ? {
        textColor: designTemplate.textColor,
        accentColor: designTemplate.accentColor,
        highlightColor: designTemplate.highlightColor || designTemplate.accentColor,
      } : null,
    };

    // Render based on theme
    let themeComponent;
    switch (themeClass) {
      case 'tech-dark':
        themeComponent = <TechDarkTheme {...themeProps} />;
        break;
      case 'biz-clean':
        themeComponent = <BizCleanTheme {...themeProps} />;
        break;
      case 'emotional-essay':
        themeComponent = <EmotionalEssayTheme {...themeProps} />;
        break;
      case 'minimalist-card':
        themeComponent = <MinimalistCardTheme {...themeProps} />;
        break;
      case 'bold-magazine':
        themeComponent = <BoldMagazineTheme {...themeProps} />;
        break;
      case 'instagram-story':
        themeComponent = <InstagramStoryTheme {...themeProps} />;
        break;
      case 'modern-gradient':
        themeComponent = <ModernGradientTheme {...themeProps} />;
        break;
      case 'emotional-film':
        themeComponent = <EmotionalFilmTheme {...themeProps} />;
        break;
      default:
        themeComponent = <TechDarkTheme {...themeProps} />;
    }

    // If design template is selected, wrap theme with design background
    if (designStyles) {
      return (
        <div className="w-full h-full relative overflow-hidden" style={designStyles}>
          {themeComponent}
        </div>
      );
    }

    return themeComponent;
  };

  const downloadAll = async () => {
    setIsDownloading(true);
    setDownloadProgress({ current: 0, total: slides.length });

    // Store current tab to restore later if needed
    const previousTab = activeTab;

    // If on mobile and in editor tab, switch to preview temporarily for capture
    if (window.innerWidth < 1024 && activeTab !== 'preview') {
      setActiveTab('preview');
      // Wait for render/layout
      await new Promise(r => setTimeout(r, 200));
    }

    try {
      // Wait for fonts to load
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {}

    const zip = new JSZip();
    const results = [];

    try {
      // Sequential processing to prevent UI freeze
      for (let i = 0; i < slides.length; i++) {
        if (!slideRefs.current[i]) continue;

        // Update progress to show we are working on this slide
        setDownloadProgress({ current: i + 1, total: slides.length });

        // Yield to main thread to let UI update
        await new Promise(r => setTimeout(r, 50));

        try {
          // Calculate pixel ratio to ensure consistent high resolution output (target 1080px width)
          const node = slideRefs.current[i];
          const currentWidth = node.offsetWidth;
          const targetWidth = 1080;
          const pixelRatio = targetWidth / currentWidth;

          const dataUrl = await toPng(node, {
            quality: 1,
            pixelRatio: pixelRatio, // Dynamic ratio for high res
            backgroundColor: getThemeBackgroundColor(themeClass),
          });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          results.push({ index: i, blob });
        } catch (err) {
          console.error(`Error capturing slide ${i + 1}:`, err);
        }
      }

      // Add captured slides to zip
      results.forEach(result => {
        if (result && result.blob) {
          zip.file(`slide-${String(result.index + 1).padStart(2, '0')}.png`, result.blob);
        }
      });

      // Generate filename from first H1 or default
      let filename = 'instaflow.zip';
      const firstSlide = parseSlide(slides[0]);
      const title = firstSlide.elements.find(el => el.type === 'h1');
      if (title) {
        // Clean up title to be filename safe
        const safeTitle = title.content.replace(/[^a-zA-Z0-9가-힣]/g, '_').substring(0, 30);
        if (safeTitle) filename = `${safeTitle}_InstaFlow.zip`;
      }

      // Generate and download zip file
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = filename;
      link.click();

      // Show success modal
      setShowDownloadComplete(true);

    } catch (err) {
      console.error('Download error:', err);
      alert('다운로드 중 오류가 발생했습니다.');
    }

    setIsDownloading(false);
    setDownloadProgress(null);

    // Restore tab if we switched it
    if (previousTab !== activeTab) {
      setActiveTab(previousTab);
    }
  };

  const themeClass = THEMES[theme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="메인으로"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Type className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">InstaFlow</h1>
              <span className="px-2 py-0.5 md:py-1 bg-cyan-500/20 text-cyan-400 text-[10px] md:text-xs font-bold rounded border border-cyan-500/30">클래식</span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-white hover:bg-slate-700 rounded-lg transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Controls */}
            <div className="hidden lg:flex flex-wrap items-center gap-3">
              {/* Share Menu (New Viral Feature) */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-3 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 text-sm flex items-center gap-2 border border-slate-600"
                >
                  <Share2 className="w-4 h-4" />
                  공유
                </button>

                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                    <div className="p-2 space-y-1">
                      <button onClick={() => handleShare('twitter')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                        <Twitter className="w-4 h-4 text-sky-500" /> 트위터 공유
                      </button>
                      <button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                        <Facebook className="w-4 h-4 text-blue-600" /> 페이스북 공유
                      </button>
                      <div className="h-px bg-gray-100 my-1" />
                      <button onClick={() => handleShare('copy')} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                        <Copy className="w-4 h-4 text-gray-500" /> 링크 복사
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
                    {downloadProgress ? `${downloadProgress.current}/${downloadProgress.total}` : '생성 중...'}
                  </span>
                ) : '다운로드'}
              </button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-slate-700 space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowGuide(true)} className="px-4 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 text-sm flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  가이드
                </button>
                <button onClick={() => setShowAIPrompt(true)} className="px-4 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 text-sm flex items-center justify-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  AI 도우미
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">템플릿</label>
                <select onChange={(e) => loadTemplate(e.target.value)} className="w-full px-3 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg text-sm">
                  <option value="">템플릿 선택...</option>
                  {getTemplateList().map(({ key, name }) => <option key={key} value={key}>{name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">테마</label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-3 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg text-sm">
                  {Object.keys(THEMES).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">비율</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setAspectRatio('1:1')} className={`px-3 py-3 rounded-lg text-sm font-semibold transition ${aspectRatio === '1:1' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300'}`}>1:1 (피드)</button>
                  <button onClick={() => setAspectRatio('4:5')} className={`px-3 py-3 rounded-lg text-sm font-semibold transition ${aspectRatio === '4:5' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300'}`}>4:5 (스토리)</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block">배경 이미지</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-3 py-3 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {backgroundImage ? '이미지 변경' : '이미지 업로드'}
                  </button>
                  {backgroundImage && (
                    <button
                      onClick={() => setUseBackgroundImage(!useBackgroundImage)}
                      className={`flex-1 px-3 py-3 rounded-lg text-sm font-semibold transition ${useBackgroundImage ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-gray-300'}`}
                    >
                      {useBackgroundImage ? '배경 사용 ON' : '배경 사용 OFF'}
                    </button>
                  )}
                </div>
              </div>

              <button onClick={downloadAll} disabled={isDownloading} className={`w-full py-4 rounded-xl font-bold text-base transition shadow-lg ${isDownloading ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'}`}>
                {isDownloading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {downloadProgress ? `${downloadProgress.current}/${downloadProgress.total}` : '생성 중...'}
                  </span>
                ) : '전체 다운로드'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Mobile Tabs */}
        <div className="flex lg:hidden bg-white rounded-xl shadow-md p-1 mb-4">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'editor' ? 'bg-slate-800 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            에디터
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'preview' ? 'bg-slate-800 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            미리보기 ({slides.length})
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className={`${activeTab === 'editor' ? 'flex' : 'hidden'} lg:flex bg-white rounded-xl shadow-lg p-4 md:p-6 min-h-[500px] lg:h-[700px] flex-col`}>
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

            {/* Content/Design Selector Buttons */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setShowContentModal(true)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 text-sm flex items-center justify-center gap-2 transition"
              >
                <FileText className="w-4 h-4" />
                📝 내용 불러오기
              </button>
              <button
                onClick={() => setShowDesignModal(true)}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 text-sm flex items-center justify-center gap-2 transition"
              >
                <Palette className="w-4 h-4" />
                🎨 디자인 변경
              </button>
            </div>

            {/* Editor Toolbar */}
            <div className="flex gap-2 mb-3 pb-3 border-b justify-between overflow-x-auto custom-scrollbar">
              <div className="flex gap-2">
                <button onClick={() => insertText('# ')} className="p-2 md:p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition shrink-0" title="H1">
                  <Heading1 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button onClick={() => insertText('## ')} className="p-2 md:p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition shrink-0" title="H2">
                  <Heading2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button onClick={() => insertText('**', '**')} className="p-2 md:p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition shrink-0" title="Bold">
                  <Bold className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button onClick={() => insertText('*', '*')} className="p-2 md:p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition shrink-0" title="Highlight">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button onClick={() => insertText('\n---\n')} className="p-2 md:p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition shrink-0" title="New Slide">
                  <Minus className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={copyCaption} className="p-2 md:p-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition shrink-0" title="캡션 복사">
                  <Copy className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button onClick={handleReset} className="p-2 md:p-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition shrink-0" title="초기화">
                  <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="flex-1 p-4 border-2 border-gray-200 rounded-lg font-mono text-sm resize-none focus:border-cyan-500 focus:outline-none transition min-h-[300px]"
              placeholder="여기에 스크립트를 작성하세요..."
            />
          </div>

          {/* Preview Panel */}
          <div className={`${activeTab === 'preview' ? 'flex' : 'hidden'} lg:flex bg-white rounded-xl shadow-lg p-4 md:p-6 min-h-[500px] lg:h-[700px] flex-col`}>
            <label className="text-sm font-bold text-gray-700 mb-4">미리보기 ({slides.length}개 슬라이드)</label>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-8 pb-12">
                {slides.map((slide, i) => (
                  <div key={i} className="flex justify-center px-2">
                    {/* Responsive Smartphone Mockup */}
                    <div
                      className="relative mx-auto transform transition-transform hover:scale-[1.02]"
                      style={{
                        width: '100%',
                        maxWidth: '420px',
                        aspectRatio: aspectRatio === '1:1' ? '420 / 420' : '420 / 520'
                      }}
                    >
                      {/* Phone Body with Gradient Bezel */}
                      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] md:rounded-[42px] shadow-2xl p-[3%] w-full h-full relative">
                        {/* Side Buttons */}
                        <div className="absolute -left-[2px] top-[15%] w-[3px] h-[6%] bg-gray-900 rounded-l-sm" />
                        <div className="absolute -left-[2px] top-[25%] w-[3px] h-[8%] bg-gray-900 rounded-l-sm" />
                        <div className="absolute -right-[2px] top-[20%] w-[3px] h-[12%] bg-gray-900 rounded-r-sm" />

                        {/* Screen Container */}
                        <div className="relative w-full h-full bg-black rounded-[1.5rem] md:rounded-[32px] overflow-hidden shadow-inner">
                          {/* Notch */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[30%] h-[5%] bg-gray-900 rounded-b-2xl z-10 flex items-center justify-center">
                            <div className="w-[40%] h-[15%] bg-gray-800 rounded-full mt-1" />
                          </div>

                          {/* Actual Slide Content */}
                          <div ref={el => slideRefs.current[i] = el} className="w-full h-full">
                            {renderSlide(slide, i, themeClass)}
                          </div>

                          {/* Slide Indicators */}
                          <div className="absolute top-2 right-2 text-xs font-bold opacity-30 text-white mix-blend-difference pointer-events-none z-20">{i+1}/{slides.length}</div>
                          {i < slides.length - 1 && <div className="absolute bottom-2 right-2 text-lg opacity-30 pointer-events-none z-20">👉</div>}
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 shadow-2xl custom-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
              <h2 className="text-2xl md:text-3xl font-black">사용 가이드</h2>
              <button onClick={() => setShowGuide(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
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
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 shadow-2xl custom-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
              <h2 className="text-xl md:text-3xl font-black flex items-center gap-2">
                <Wand2 className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                AI 프롬프트 생성기
              </h2>
              <button onClick={() => setShowAIPrompt(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
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

      {/* Content Preset Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowContentModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 shadow-2xl custom-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
              <h2 className="text-xl md:text-3xl font-black flex items-center gap-2">
                <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                📝 내용 불러오기
              </h2>
              <button onClick={() => setShowContentModal(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              원하는 콘텐츠 템플릿을 선택하면 에디터의 텍스트만 변경됩니다. 디자인은 그대로 유지됩니다.
            </p>

            {/* Presets by Category */}
            {Object.entries(SCRIPT_CATEGORIES).map(([catKey, catName]) => {
              const presets = getScriptPresetsList().filter(p => p.category === catKey);
              if (presets.length === 0) return null;

              return (
                <div key={catKey} className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{catName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {presets.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => loadContentPreset(preset.id)}
                        className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                      >
                        <div className="font-bold text-gray-800 mb-1">{preset.title}</div>
                        <div className="text-sm text-gray-600">{preset.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Design Template Modal */}
      {showDesignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDesignModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 shadow-2xl custom-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
              <h2 className="text-xl md:text-3xl font-black flex items-center gap-2">
                <Palette className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                🎨 디자인 변경
              </h2>
              <button onClick={() => setShowDesignModal(false)} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              원하는 디자인을 선택하면 배경과 색상만 변경됩니다. 에디터의 내용은 그대로 유지됩니다.
            </p>

            {/* Clear Design Button */}
            <div className="mb-6">
              <button
                onClick={() => applyDesignTemplate(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${!selectedDesign ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ⚪ 기본 테마 사용 (디자인 없음)
              </button>
            </div>

            {/* Designs by Category */}
            {Object.entries(DESIGN_CATEGORIES).map(([catKey, catName]) => {
              const designs = getDesignTemplatesList().filter(d => d.category === catKey);
              if (designs.length === 0) return null;

              return (
                <div key={catKey} className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{catName}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {designs.map(design => {
                      const styles = applyDesignToElement(design);
                      return (
                        <button
                          key={design.id}
                          onClick={() => applyDesignTemplate(design.id)}
                          className={`text-left p-4 border-2 rounded-lg transition ${selectedDesign === design.id ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-400'}`}
                        >
                          {/* Preview Box */}
                          <div
                            className="w-full h-20 rounded mb-2 flex items-center justify-center text-xs font-bold"
                            style={styles}
                          >
                            Preview
                          </div>
                          <div className="font-bold text-gray-800 text-sm mb-1">{design.name}</div>
                          <div className="text-xs text-gray-600">{design.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Download Complete Modal */}
      {showDownloadComplete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDownloadComplete(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-black mb-2">다운로드 완료!</h2>
            <p className="text-gray-600 mb-6">
              멋진 카드뉴스가 완성되었습니다.<br />
              인스타그램에 올릴 때 아래 해시태그를 사용해보세요!
            </p>

            <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm font-mono text-gray-600 break-all">
              #InstaFlow #카드뉴스 #마케팅 #카드뉴스만들기
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('#InstaFlow #카드뉴스 #마케팅 #카드뉴스만들기');
                  alert('해시태그가 복사되었습니다!');
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                태그 복사
              </button>
              <button
                onClick={() => setShowDownloadComplete(false)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App Component with Mode Selection
function App() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('instaflow_mode') || null;
  });

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    localStorage.setItem('instaflow_mode', selectedMode);
  };

  const handleBack = () => {
    setMode(null);
    localStorage.removeItem('instaflow_mode');
  };

  // Render based on mode
  if (mode === 'batch') {
    return <BatchFlowMaker onBack={handleBack} />;
  }

  if (mode === 'classic') {
    return <ClassicEditor onBack={handleBack} />;
  }

  // Landing page for mode selection
  return <LandingPage onSelectMode={handleSelectMode} />;
}

export default App;
// Trigger deploy Thu Nov 27 11:55:58 UTC 2025
