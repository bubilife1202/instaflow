import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import {
  ChevronRight, ChevronLeft, Sparkles, Download, Wand2, RotateCcw,
  Settings, Eye, Edit3, Palette, Check, X, Zap, Copy, ChevronDown, ChevronUp
} from 'lucide-react';

// Import data
import { FLOW_STRUCTURES, FLOW_CATEGORIES, getFlowStructuresList } from '../data/flowStructures';
import { THEME_PACKS, PACK_CATEGORIES, getThemePacksList } from '../data/themePacks';
import {
  hasApiKey, getApiKey, saveApiKey, generateTitles,
  generateFullContent, getTitleSuggestions
} from '../services/geminiAI';

/**
 * BatchFlowMaker - One-click card news generator
 * Step 1: Select structure
 * Step 2: Left=Input Form, Right=Theme+Preview (simultaneous)
 */
export default function BatchFlowMaker({ onBack }) {
  // Current step: 1=structure, 2=editor+preview
  const [step, setStep] = useState(1);

  // Selected structure
  const [selectedStructure, setSelectedStructure] = useState(null);

  // Content data for each slide
  const [contentData, setContentData] = useState({});

  // Selected theme pack - default to first one
  const [selectedThemePack, setSelectedThemePack] = useState('modernMinimal');

  // Preview settings
  const [aspectRatio, setAspectRatio] = useState('4:5');
  const [instagramId, setInstagramId] = useState(() =>
    localStorage.getItem('instaflow_instagram_id') || ''
  );

  // AI features
  const [showAISettings, setShowAISettings] = useState(false);
  const [apiKey, setApiKey] = useState(getApiKey());
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [topic, setTopic] = useState('');

  // Download state
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTag, setSearchTag] = useState('');

  // Theme panel collapse state
  const [showThemePanel, setShowThemePanel] = useState(true);

  // Current preview slide index
  const [previewIndex, setPreviewIndex] = useState(0);

  // Refs for download
  const slideRefs = useRef([]);

  // Save instagram ID
  useEffect(() => {
    localStorage.setItem('instaflow_instagram_id', instagramId);
  }, [instagramId]);

  // Filter structures
  const filteredStructures = getFlowStructuresList().filter(s => {
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    if (searchTag && !s.tags.some(t => t.toLowerCase().includes(searchTag.toLowerCase()))) return false;
    return true;
  });

  // Handle structure selection
  const handleSelectStructure = (structure) => {
    setSelectedStructure(structure);
    const initialData = {};
    structure.slides.forEach((slide, index) => {
      initialData[index] = { type: slide.type, ...getDefaultContent(slide) };
    });
    setContentData(initialData);
    setStep(2);
  };

  // Get default content for slide type
  const getDefaultContent = (slide) => {
    const defaults = {
      cover: { title: '', subtitle: '' },
      item: { itemTitle: '', itemDescription: '', number: slide.number },
      question: { questionText: '' },
      answer: { answerText: '', answerDetail: '' },
      cta: { ctaText: '', ctaAction: '' },
      step: { stepTitle: '', stepDescription: '', number: slide.number },
      intro: { introText: '' },
      body: { bodyText: '' },
      climax: { climaxText: '', climaxHighlight: '' },
      quote: { quoteText: '', quoteAuthor: '' },
      before: { beforeTitle: '', beforeDescription: '' },
      after: { afterTitle: '', afterDescription: '' },
      process: { processText: '' },
      result: { resultText: '', resultHighlight: '' },
      benefit: { benefitTitle: '', benefitList: '' },
      detail: { detailText: '' },
      howto: { howtoSteps: '' },
      specs: { specList: '' },
      pros: { prosList: '' },
      cons: { consList: '' },
      verdict: { rating: '', verdictText: '' },
      hint: { hintText: '' },
      explanation: { explanationText: '' },
      insight: { insightText: '' },
      action: { actionList: '' }
    };
    return defaults[slide.type] || {};
  };

  // Update content for a slide
  const updateContent = (slideIndex, field, value) => {
    setContentData(prev => ({
      ...prev,
      [slideIndex]: {
        ...prev[slideIndex],
        [field]: value
      }
    }));
  };

  // Generate AI content
  const handleGenerateAI = async () => {
    if (!topic.trim()) {
      alert('주제를 입력해주세요.');
      return;
    }

    if (!hasApiKey()) {
      setShowAISettings(true);
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateFullContent(topic, selectedStructure);
      if (content && Array.isArray(content)) {
        const newData = { ...contentData };
        content.forEach((item, index) => {
          if (newData[index]) {
            newData[index] = { ...newData[index], ...item };
          }
        });
        setContentData(newData);
      }
    } catch (error) {
      alert('AI 생성 중 오류: ' + error.message);
    }
    setIsGenerating(false);
  };

  // Generate AI title suggestions
  const handleGetTitleSuggestions = async () => {
    if (!topic.trim()) return;

    if (!hasApiKey()) {
      setAiSuggestions(getTitleSuggestions(topic));
      return;
    }

    setIsGenerating(true);
    try {
      const titles = await generateTitles(topic);
      setAiSuggestions(titles.map(t => ({ suggestion: t })));
    } catch (error) {
      setAiSuggestions(getTitleSuggestions(topic));
    }
    setIsGenerating(false);
  };

  // Apply title suggestion
  const applyTitleSuggestion = (title) => {
    updateContent(0, 'title', title);
    setAiSuggestions([]);
  };

  // Save API key
  const handleSaveApiKey = () => {
    saveApiKey(apiKey);
    setShowAISettings(false);
  };

  // Render slide preview
  const renderSlidePreview = (slideData, index, forDownload = false) => {
    const themePack = THEME_PACKS[selectedThemePack] || THEME_PACKS['modernMinimal'];
    const slideType = slideData.type;

    let styles = {};
    if (slideType === 'cover') {
      styles = themePack.cover;
    } else if (slideType === 'cta') {
      styles = themePack.cta;
    } else {
      styles = themePack.body;
    }

    const containerStyle = {
      background: styles.background,
      color: styles.textColor || styles.titleColor,
      ...(styles.pattern && { backgroundImage: `${styles.pattern}, ${styles.background}` })
    };

    return (
      <div
        ref={forDownload ? (el => slideRefs.current[index] = el) : null}
        className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative"
        style={containerStyle}
      >
        {slideType === 'cover' && (
          <>
            <h1
              className="text-2xl md:text-3xl font-black mb-3 leading-tight"
              style={{ color: styles.titleColor }}
            >
              {slideData.title || '제목을 입력하세요'}
            </h1>
            <p
              className="text-base md:text-lg opacity-90"
              style={{ color: styles.subtitleColor }}
            >
              {slideData.subtitle || '부제목'}
            </p>
          </>
        )}

        {(slideType === 'item' || slideType === 'step') && (
          <>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black mb-3"
              style={{ background: styles.numberBg, color: styles.numberColor }}
            >
              {slideData.number || index}
            </div>
            <h2
              className="text-xl md:text-2xl font-bold mb-2"
              style={{ color: styles.titleColor }}
            >
              {slideData.itemTitle || slideData.stepTitle || '항목 제목'}
            </h2>
            <p
              className="text-sm md:text-base"
              style={{ color: styles.textColor }}
            >
              {slideData.itemDescription || slideData.stepDescription || '설명을 입력하세요'}
            </p>
          </>
        )}

        {slideType === 'question' && (
          <>
            <div className="text-4xl mb-3">❓</div>
            <h2
              className="text-xl md:text-2xl font-bold"
              style={{ color: styles.titleColor }}
            >
              {slideData.questionText || '질문을 입력하세요'}
            </h2>
          </>
        )}

        {slideType === 'answer' && (
          <>
            <div className="text-4xl mb-3">💡</div>
            <h2
              className="text-xl md:text-2xl font-bold mb-2"
              style={{ color: styles.titleColor }}
            >
              {slideData.answerText || '답변'}
            </h2>
            <p
              className="text-sm md:text-base"
              style={{ color: styles.textColor }}
            >
              {slideData.answerDetail || ''}
            </p>
          </>
        )}

        {slideType === 'quote' && (
          <>
            <div className="text-3xl mb-3">"</div>
            <p
              className="text-lg md:text-xl font-medium italic mb-3"
              style={{ color: styles.titleColor }}
            >
              {slideData.quoteText || '명언을 입력하세요'}
            </p>
            {slideData.quoteAuthor && (
              <p className="text-xs opacity-70" style={{ color: styles.textColor }}>
                - {slideData.quoteAuthor}
              </p>
            )}
          </>
        )}

        {slideType === 'cta' && (
          <>
            <h2
              className="text-xl md:text-2xl font-bold mb-4"
              style={{ color: styles.titleColor }}
            >
              {slideData.ctaText || '지금 바로 시작하세요!'}
            </h2>
            <div
              className="px-5 py-2 rounded-full font-bold text-base"
              style={{ background: styles.buttonBg, color: styles.buttonColor }}
            >
              {slideData.ctaAction || '팔로우하기'}
            </div>
          </>
        )}

        {/* Generic fallback */}
        {!['cover', 'item', 'step', 'question', 'answer', 'quote', 'cta'].includes(slideType) && (
          <div style={{ color: styles.titleColor }}>
            <div className="text-3xl mb-3">📝</div>
            <p className="text-lg font-medium">
              {Object.values(slideData).find(v => typeof v === 'string' && v && v !== slideType) || `${slideType} 슬라이드`}
            </p>
          </div>
        )}

        {/* Instagram ID watermark */}
        {instagramId && (
          <div className="absolute bottom-2 right-3 text-[10px] opacity-40" style={{ color: styles.textColor || styles.titleColor }}>
            {instagramId}
          </div>
        )}
      </div>
    );
  };

  // Download all slides
  const downloadAll = async () => {
    setIsDownloading(true);
    const totalSlides = Object.keys(contentData).length;
    setDownloadProgress({ current: 0, total: totalSlides });

    const zip = new JSZip();
    const results = [];

    try {
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 100));

      for (let i = 0; i < totalSlides; i++) {
        if (!slideRefs.current[i]) continue;

        setDownloadProgress({ current: i + 1, total: totalSlides });
        await new Promise(r => setTimeout(r, 50));

        try {
          const node = slideRefs.current[i];
          const currentWidth = node.offsetWidth;
          const targetWidth = 1080;
          const pixelRatio = targetWidth / currentWidth;

          const dataUrl = await toPng(node, {
            quality: 1,
            pixelRatio: pixelRatio,
          });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          results.push({ index: i, blob });
        } catch (err) {
          console.error(`Error capturing slide ${i + 1}:`, err);
        }
      }

      results.forEach(result => {
        if (result && result.blob) {
          zip.file(`slide-${String(result.index + 1).padStart(2, '0')}.png`, result.blob);
        }
      });

      const title = contentData[0]?.title || 'instaflow';
      const safeTitle = title.replace(/[^a-zA-Z0-9가-힣]/g, '_').substring(0, 30);
      const filename = `${safeTitle}_InstaFlow.zip`;

      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = filename;
      link.click();

    } catch (err) {
      console.error('Download error:', err);
      alert('다운로드 중 오류가 발생했습니다.');
    }

    setIsDownloading(false);
    setDownloadProgress(null);
  };

  // Reset all
  const handleReset = () => {
    if (confirm('모든 내용을 초기화하시겠습니까?')) {
      setStep(1);
      setSelectedStructure(null);
      setContentData({});
      setSelectedThemePack('modernMinimal');
      setTopic('');
      setAiSuggestions([]);
      setPreviewIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  원클릭 메이커
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {step === 2 && (
                <>
                  <div className="flex gap-1 mr-2">
                    <button
                      onClick={() => setAspectRatio('1:1')}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        aspectRatio === '1:1' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      1:1
                    </button>
                    <button
                      onClick={() => setAspectRatio('4:5')}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        aspectRatio === '4:5' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      4:5
                    </button>
                  </div>
                  <button
                    onClick={downloadAll}
                    disabled={isDownloading}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-sm hover:from-green-600 hover:to-emerald-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? `${downloadProgress?.current || 0}/${downloadProgress?.total || 0}` : '다운로드'}
                  </button>
                </>
              )}
              <button
                onClick={() => setShowAISettings(true)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Step 1: Structure Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">어떤 구조로 만들까요?</h2>
              <p className="text-white/60">목적에 맞는 카드뉴스 구조를 선택하세요</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  categoryFilter === 'all' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                전체
              </button>
              {Object.entries(FLOW_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    categoryFilter === key ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Structure Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredStructures.map(structure => (
                <button
                  key={structure.id}
                  onClick={() => handleSelectStructure(structure)}
                  className="group p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="text-3xl mb-2">{structure.icon}</div>
                  <h3 className="text-sm font-bold text-white mb-1">{structure.name}</h3>
                  <p className="text-xs text-white/50 mb-2 line-clamp-2">{structure.description}</p>
                  <div className="text-xs text-purple-400">{structure.slides.length}장</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Editor + Preview */}
        {step === 2 && selectedStructure && (
          <div className="grid lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
            {/* Left Panel: Input Form */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-purple-400" />
                  내용 입력
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" /> 구조 변경
                </button>
              </div>

              {/* AI Topic Input */}
              <div className="mb-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="주제 입력 (예: 다이어트 꿀팁)"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="px-3 py-2 bg-purple-500 text-white rounded-lg font-medium text-sm hover:bg-purple-600 transition disabled:opacity-50 flex items-center gap-1"
                  >
                    <Wand2 className="w-4 h-4" />
                    {isGenerating ? '...' : 'AI'}
                  </button>
                </div>
                {topic && (
                  <button
                    onClick={handleGetTitleSuggestions}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> 터지는 제목 추천
                  </button>
                )}
                {aiSuggestions.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                    {aiSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => applyTitleSuggestion(s.suggestion)}
                        className="block w-full text-left px-2 py-1 bg-white/5 rounded text-xs text-white/80 hover:bg-white/10 transition truncate"
                      >
                        {s.suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Slide Forms */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {selectedStructure.slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition cursor-pointer ${
                      previewIndex === index
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setPreviewIndex(index)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="text-xs font-medium text-white/80">{slide.label}</span>
                    </div>

                    {/* Dynamic form fields */}
                    {slide.type === 'cover' && (
                      <>
                        <input
                          type="text"
                          value={contentData[index]?.title || ''}
                          onChange={(e) => updateContent(index, 'title', e.target.value)}
                          placeholder="메인 제목"
                          className="w-full px-2 py-1.5 mb-2 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={contentData[index]?.subtitle || ''}
                          onChange={(e) => updateContent(index, 'subtitle', e.target.value)}
                          placeholder="부제목"
                          className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                      </>
                    )}

                    {(slide.type === 'item' || slide.type === 'step') && (
                      <>
                        <input
                          type="text"
                          value={contentData[index]?.itemTitle || contentData[index]?.stepTitle || ''}
                          onChange={(e) => updateContent(index, slide.type === 'item' ? 'itemTitle' : 'stepTitle', e.target.value)}
                          placeholder="제목"
                          className="w-full px-2 py-1.5 mb-2 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={contentData[index]?.itemDescription || contentData[index]?.stepDescription || ''}
                          onChange={(e) => updateContent(index, slide.type === 'item' ? 'itemDescription' : 'stepDescription', e.target.value)}
                          placeholder="설명"
                          className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                      </>
                    )}

                    {slide.type === 'question' && (
                      <input
                        type="text"
                        value={contentData[index]?.questionText || ''}
                        onChange={(e) => updateContent(index, 'questionText', e.target.value)}
                        placeholder="질문"
                        className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                      />
                    )}

                    {slide.type === 'answer' && (
                      <>
                        <input
                          type="text"
                          value={contentData[index]?.answerText || ''}
                          onChange={(e) => updateContent(index, 'answerText', e.target.value)}
                          placeholder="핵심 답변"
                          className="w-full px-2 py-1.5 mb-2 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={contentData[index]?.answerDetail || ''}
                          onChange={(e) => updateContent(index, 'answerDetail', e.target.value)}
                          placeholder="추가 설명"
                          className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                      </>
                    )}

                    {slide.type === 'quote' && (
                      <>
                        <input
                          type="text"
                          value={contentData[index]?.quoteText || ''}
                          onChange={(e) => updateContent(index, 'quoteText', e.target.value)}
                          placeholder="명언/인용구"
                          className="w-full px-2 py-1.5 mb-2 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={contentData[index]?.quoteAuthor || ''}
                          onChange={(e) => updateContent(index, 'quoteAuthor', e.target.value)}
                          placeholder="출처 (선택)"
                          className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                      </>
                    )}

                    {slide.type === 'cta' && (
                      <>
                        <input
                          type="text"
                          value={contentData[index]?.ctaText || ''}
                          onChange={(e) => updateContent(index, 'ctaText', e.target.value)}
                          placeholder="CTA 문구"
                          className="w-full px-2 py-1.5 mb-2 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={contentData[index]?.ctaAction || ''}
                          onChange={(e) => updateContent(index, 'ctaAction', e.target.value)}
                          placeholder="버튼 텍스트"
                          className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                        />
                      </>
                    )}

                    {/* Generic input for other types */}
                    {!['cover', 'item', 'step', 'question', 'answer', 'quote', 'cta'].includes(slide.type) && (
                      <input
                        type="text"
                        value={Object.entries(contentData[index] || {}).find(([k, v]) => k !== 'type' && typeof v === 'string')?.[1] || ''}
                        onChange={(e) => {
                          const field = Object.keys(contentData[index] || {}).find(k => k !== 'type' && k !== 'number') || 'text';
                          updateContent(index, field, e.target.value);
                        }}
                        placeholder="내용 입력"
                        className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                      />
                    )}
                  </div>
                ))}

                {/* Instagram ID */}
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <label className="text-xs text-white/50 mb-1 block">Instagram ID</label>
                  <input
                    type="text"
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                    placeholder="@your_instagram"
                    className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel: Theme + Preview */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col overflow-hidden">
              {/* Theme Selector */}
              <div className="mb-3">
                <button
                  onClick={() => setShowThemePanel(!showThemePanel)}
                  className="w-full flex items-center justify-between text-white mb-2"
                >
                  <span className="text-sm font-bold flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-400" />
                    테마 선택
                  </span>
                  {showThemePanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showThemePanel && (
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto pr-1">
                    {getThemePacksList().map(pack => (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedThemePack(pack.id)}
                        className={`p-2 rounded-lg border transition ${
                          selectedThemePack === pack.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        title={pack.name}
                      >
                        <div
                          className="w-full aspect-square rounded mb-1"
                          style={{ background: pack.preview.background }}
                        />
                        <div className="text-[9px] text-white/60 truncate">{pack.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    미리보기
                  </span>
                  <span className="text-xs text-white/50">
                    {previewIndex + 1} / {Object.keys(contentData).length}
                  </span>
                </div>

                {/* Main Preview */}
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className="rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      width: '100%',
                      maxWidth: '280px',
                      aspectRatio: aspectRatio === '1:1' ? '1/1' : '4/5'
                    }}
                  >
                    {contentData[previewIndex] && renderSlidePreview(contentData[previewIndex], previewIndex)}
                  </div>
                </div>

                {/* Slide Navigator */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                    disabled={previewIndex === 0}
                    className="p-1 text-white/50 hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-1">
                    {Object.keys(contentData).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPreviewIndex(i)}
                        className={`w-2 h-2 rounded-full transition ${
                          previewIndex === i ? 'bg-purple-500' : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setPreviewIndex(Math.min(Object.keys(contentData).length - 1, previewIndex + 1))}
                    disabled={previewIndex === Object.keys(contentData).length - 1}
                    className="p-1 text-white/50 hover:text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Mini Thumbnails */}
                <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
                  {Object.entries(contentData).map(([idx, data]) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewIndex(parseInt(idx))}
                      className={`flex-shrink-0 rounded overflow-hidden border-2 transition ${
                        previewIndex === parseInt(idx) ? 'border-purple-500' : 'border-transparent hover:border-white/30'
                      }`}
                      style={{
                        width: '48px',
                        aspectRatio: aspectRatio === '1:1' ? '1/1' : '4/5'
                      }}
                    >
                      <div className="w-full h-full scale-[0.15] origin-top-left" style={{ width: '320px', height: aspectRatio === '1:1' ? '320px' : '400px' }}>
                        {renderSlidePreview(data, parseInt(idx))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hidden slides for download */}
            <div className="fixed -left-[9999px] -top-[9999px]">
              {Object.entries(contentData).map(([idx, data]) => (
                <div
                  key={idx}
                  style={{
                    width: '1080px',
                    height: aspectRatio === '1:1' ? '1080px' : '1350px'
                  }}
                >
                  {renderSlidePreview(data, parseInt(idx), true)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Settings Modal */}
      {showAISettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAISettings(false)}>
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                AI 설정
              </h2>
              <button onClick={() => setShowAISettings(false)} className="p-1 text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Gemini API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-white/50 mt-2">Google AI Studio에서 무료 발급</p>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-purple-400 hover:text-purple-300"
              >
                API 키 발급받기 →
              </a>

              <button
                onClick={handleSaveApiKey}
                className="w-full py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
