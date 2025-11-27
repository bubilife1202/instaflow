import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import {
  ChevronRight, ChevronLeft, Sparkles, Download, Wand2, RotateCcw,
  Settings, Eye, Edit3, Palette, Check, X, Zap, Copy, Plus, Trash2
} from 'lucide-react';

// Import data
import { FLOW_STRUCTURES, FLOW_CATEGORIES, getFlowStructuresList } from '../data/flowStructures';
import { THEME_PACKS, PACK_CATEGORIES, getThemePacksList } from '../data/themePacks';
import {
  hasApiKey, getApiKey, saveApiKey, generateTitles,
  generateFullContent, getTitleSuggestions, TITLE_PATTERNS
} from '../services/geminiAI';

/**
 * BatchFlowMaker - One-click card news generator
 * Step 1: Select structure
 * Step 2: Input content
 * Step 3: Select theme
 * Step 4: Preview & Download
 */
export default function BatchFlowMaker({ onBack }) {
  // Current step: 1=structure, 2=content, 3=theme, 4=preview
  const [step, setStep] = useState(1);

  // Selected structure
  const [selectedStructure, setSelectedStructure] = useState(null);

  // Content data for each slide
  const [contentData, setContentData] = useState({});

  // Selected theme pack
  const [selectedThemePack, setSelectedThemePack] = useState(null);

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

  // Filter theme packs
  const [themeCategory, setThemeCategory] = useState('all');
  const filteredPacks = getThemePacksList().filter(p => {
    if (themeCategory !== 'all' && p.category !== themeCategory) return false;
    return true;
  });

  // Handle structure selection
  const handleSelectStructure = (structure) => {
    setSelectedStructure(structure);
    // Initialize content data based on structure
    const initialData = {};
    structure.slides.forEach((slide, index) => {
      initialData[index] = { type: slide.type, ...getDefaultContent(slide) };
    });
    setContentData(initialData);
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
      // Show offline suggestions
      setAiSuggestions(getTitleSuggestions(topic));
      return;
    }

    setIsGenerating(true);
    try {
      const titles = await generateTitles(topic);
      setAiSuggestions(titles.map(t => ({ suggestion: t })));
    } catch (error) {
      // Fallback to offline suggestions
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
  const renderSlidePreview = (slideData, index) => {
    const themePack = selectedThemePack ? THEME_PACKS[selectedThemePack] : THEME_PACKS['modernMinimal'];
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
      ...(styles.pattern && { backgroundImage: styles.pattern })
    };

    return (
      <div
        ref={el => slideRefs.current[index] = el}
        className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
        style={containerStyle}
      >
        {slideType === 'cover' && (
          <>
            <h1
              className="text-3xl md:text-4xl font-black mb-4 leading-tight"
              style={{ color: styles.titleColor }}
            >
              {slideData.title || '제목을 입력하세요'}
            </h1>
            <p
              className="text-lg md:text-xl opacity-90"
              style={{ color: styles.subtitleColor }}
            >
              {slideData.subtitle || '부제목'}
            </p>
          </>
        )}

        {(slideType === 'item' || slideType === 'step') && (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mb-4"
              style={{ background: styles.numberBg, color: styles.numberColor }}
            >
              {slideData.number || index}
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: styles.titleColor }}
            >
              {slideData.itemTitle || slideData.stepTitle || '항목 제목'}
            </h2>
            <p
              className="text-base md:text-lg"
              style={{ color: styles.textColor }}
            >
              {slideData.itemDescription || slideData.stepDescription || '설명'}
            </p>
          </>
        )}

        {slideType === 'question' && (
          <>
            <div className="text-5xl mb-4">?</div>
            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ color: styles.titleColor }}
            >
              {slideData.questionText || '질문을 입력하세요'}
            </h2>
          </>
        )}

        {slideType === 'answer' && (
          <>
            <div className="text-5xl mb-4">!</div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: styles.titleColor }}
            >
              {slideData.answerText || '답변'}
            </h2>
            <p
              className="text-base md:text-lg"
              style={{ color: styles.textColor }}
            >
              {slideData.answerDetail || ''}
            </p>
          </>
        )}

        {slideType === 'quote' && (
          <>
            <div className="text-4xl mb-4">"</div>
            <p
              className="text-xl md:text-2xl font-medium italic mb-4"
              style={{ color: styles.titleColor }}
            >
              {slideData.quoteText || '명언을 입력하세요'}
            </p>
            {slideData.quoteAuthor && (
              <p className="text-sm opacity-70" style={{ color: styles.textColor }}>
                - {slideData.quoteAuthor}
              </p>
            )}
          </>
        )}

        {slideType === 'cta' && (
          <>
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: styles.titleColor }}
            >
              {slideData.ctaText || '지금 바로 시작하세요!'}
            </h2>
            <div
              className="px-6 py-3 rounded-full font-bold text-lg"
              style={{ background: styles.buttonBg, color: styles.buttonColor }}
            >
              {slideData.ctaAction || '팔로우하기'}
            </div>
          </>
        )}

        {/* Generic fallback for other types */}
        {!['cover', 'item', 'step', 'question', 'answer', 'quote', 'cta'].includes(slideType) && (
          <>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: styles.titleColor }}
            >
              {Object.values(slideData).find(v => typeof v === 'string' && v) || slideType}
            </h2>
          </>
        )}

        {/* Instagram ID watermark */}
        {instagramId && (
          <div className="absolute bottom-4 right-4 text-xs opacity-50">
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
      setSelectedThemePack(null);
      setTopic('');
      setAiSuggestions([]);
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
                  Batch Flow Maker
                </h1>
                <p className="text-xs text-white/60">카드뉴스 원클릭 메이커</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAISettings(true)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="AI 설정"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="초기화"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { num: 1, label: '구조 선택' },
              { num: 2, label: '내용 입력' },
              { num: 3, label: '테마 선택' },
              { num: 4, label: '미리보기' }
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => {
                    if (s.num <= step || (s.num === 2 && selectedStructure)) setStep(s.num);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    step === s.num
                      ? 'bg-purple-500 text-white'
                      : step > s.num
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < 3 && (
                  <ChevronRight className="w-4 h-4 text-white/30 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Step 1: Structure Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">어떤 구조로 만들까요?</h2>
              <p className="text-white/60">목적에 맞는 카드뉴스 구조를 선택하세요</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  categoryFilter === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                전체
              </button>
              {Object.entries(FLOW_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    categoryFilter === key
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search by tag */}
            <div className="max-w-md mx-auto mb-6">
              <input
                type="text"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                placeholder="태그로 검색 (예: 리스트, 꿀팁, 후기...)"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Structure Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStructures.map(structure => (
                <button
                  key={structure.id}
                  onClick={() => {
                    handleSelectStructure(structure);
                    setStep(2);
                  }}
                  className={`group p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 ${
                    selectedStructure?.id === structure.id ? 'border-purple-500 bg-purple-500/10' : ''
                  }`}
                >
                  <div className="text-4xl mb-3">{structure.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{structure.name}</h3>
                  <p className="text-sm text-white/60 mb-3">{structure.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {structure.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/10 rounded text-xs text-white/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-white/40">
                    {structure.slides.length}개 슬라이드
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Content Input */}
        {step === 2 && selectedStructure && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-purple-400" />
                  내용 입력
                </h2>

                {/* Topic & AI Generation */}
                <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    주제 입력 (AI 생성에 사용)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="예: 다이어트 꿀팁, 신상 맛집 추천..."
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      <Wand2 className="w-4 h-4" />
                      {isGenerating ? '생성 중...' : 'AI 생성'}
                    </button>
                  </div>

                  {/* Title Suggestions */}
                  {topic && (
                    <div className="mt-3">
                      <button
                        onClick={handleGetTitleSuggestions}
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        터지는 제목 추천받기
                      </button>
                      {aiSuggestions.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {aiSuggestions.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => applyTitleSuggestion(s.suggestion)}
                              className="block w-full text-left px-3 py-2 bg-white/5 rounded-lg text-sm text-white/80 hover:bg-white/10 transition"
                            >
                              {s.suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Slide Content Forms */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  {selectedStructure.slides.map((slide, index) => (
                    <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <span className="font-medium text-white">{slide.label}</span>
                        <span className="text-xs text-white/40">({slide.type})</span>
                      </div>

                      {/* Dynamic form fields based on slide type */}
                      {slide.type === 'cover' && (
                        <>
                          <input
                            type="text"
                            value={contentData[index]?.title || ''}
                            onChange={(e) => updateContent(index, 'title', e.target.value)}
                            placeholder="메인 제목"
                            className="w-full px-3 py-2 mb-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                          />
                          <input
                            type="text"
                            value={contentData[index]?.subtitle || ''}
                            onChange={(e) => updateContent(index, 'subtitle', e.target.value)}
                            placeholder="부제목"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                          />
                        </>
                      )}

                      {(slide.type === 'item' || slide.type === 'step') && (
                        <>
                          <input
                            type="text"
                            value={contentData[index]?.itemTitle || contentData[index]?.stepTitle || ''}
                            onChange={(e) => updateContent(index, slide.type === 'item' ? 'itemTitle' : 'stepTitle', e.target.value)}
                            placeholder={slide.type === 'item' ? '항목 제목' : '단계 제목'}
                            className="w-full px-3 py-2 mb-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                          />
                          <textarea
                            value={contentData[index]?.itemDescription || contentData[index]?.stepDescription || ''}
                            onChange={(e) => updateContent(index, slide.type === 'item' ? 'itemDescription' : 'stepDescription', e.target.value)}
                            placeholder="설명 (간결하게)"
                            rows={2}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
                          />
                        </>
                      )}

                      {slide.type === 'question' && (
                        <textarea
                          value={contentData[index]?.questionText || ''}
                          onChange={(e) => updateContent(index, 'questionText', e.target.value)}
                          placeholder="질문 내용"
                          rows={2}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
                        />
                      )}

                      {slide.type === 'answer' && (
                        <>
                          <input
                            type="text"
                            value={contentData[index]?.answerText || ''}
                            onChange={(e) => updateContent(index, 'answerText', e.target.value)}
                            placeholder="핵심 답변"
                            className="w-full px-3 py-2 mb-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                          />
                          <textarea
                            value={contentData[index]?.answerDetail || ''}
                            onChange={(e) => updateContent(index, 'answerDetail', e.target.value)}
                            placeholder="추가 설명"
                            rows={2}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
                          />
                        </>
                      )}

                      {slide.type === 'quote' && (
                        <>
                          <textarea
                            value={contentData[index]?.quoteText || ''}
                            onChange={(e) => updateContent(index, 'quoteText', e.target.value)}
                            placeholder="명언 / 인용구"
                            rows={2}
                            className="w-full px-3 py-2 mb-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
                          />
                          <input
                            type="text"
                            value={contentData[index]?.quoteAuthor || ''}
                            onChange={(e) => updateContent(index, 'quoteAuthor', e.target.value)}
                            placeholder="출처 (선택)"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                          />
                        </>
                      )}

                      {slide.type === 'cta' && (
                        <>
                          <input
                            type="text"
                            value={contentData[index]?.ctaText || ''}
                            onChange={(e) => updateContent(index, 'ctaText', e.target.value)}
                            placeholder="CTA 문구 (예: 지금 시작하세요!)"
                            className="w-full px-3 py-2 mb-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                          />
                          <input
                            type="text"
                            value={contentData[index]?.ctaAction || ''}
                            onChange={(e) => updateContent(index, 'ctaAction', e.target.value)}
                            placeholder="버튼 텍스트 (예: 팔로우하기)"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                          />
                        </>
                      )}

                      {/* Generic text input for other types */}
                      {!['cover', 'item', 'step', 'question', 'answer', 'quote', 'cta'].includes(slide.type) && (
                        <textarea
                          value={Object.entries(contentData[index] || {}).find(([k, v]) => k !== 'type' && typeof v === 'string')?.[1] || ''}
                          onChange={(e) => {
                            const field = Object.keys(contentData[index] || {}).find(k => k !== 'type') || 'text';
                            updateContent(index, field, e.target.value);
                          }}
                          placeholder="내용 입력"
                          rows={2}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Instagram ID */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Instagram ID (워터마크)
                  </label>
                  <input
                    type="text"
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                    placeholder="@your_instagram"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition"
                >
                  <ChevronLeft className="w-5 h-5 inline mr-1" />
                  이전
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition"
                >
                  테마 선택하기
                  <ChevronRight className="w-5 h-5 inline ml-1" />
                </button>
              </div>
            </div>

            {/* Live Preview (Mini) */}
            <div className="hidden lg:block">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-32">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  실시간 미리보기
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(contentData).slice(0, 6).map(([idx, data]) => (
                    <div
                      key={idx}
                      className="aspect-[4/5] rounded-lg overflow-hidden"
                      style={{
                        background: THEME_PACKS[selectedThemePack || 'modernMinimal']?.preview?.background || '#f0f0f0'
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center p-2 text-center">
                        <span className="text-[8px] truncate" style={{
                          color: THEME_PACKS[selectedThemePack || 'modernMinimal']?.preview?.text || '#000'
                        }}>
                          {data.title || data.itemTitle || data.stepTitle || data.questionText || data.ctaText || `슬라이드 ${parseInt(idx) + 1}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Theme Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">테마를 선택하세요</h2>
              <p className="text-white/60">선택한 테마가 모든 슬라이드에 적용됩니다</p>
            </div>

            {/* Theme Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <button
                onClick={() => setThemeCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  themeCategory === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                전체
              </button>
              {Object.entries(PACK_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setThemeCategory(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    themeCategory === key
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Theme Pack Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPacks.map(pack => (
                <button
                  key={pack.id}
                  onClick={() => {
                    setSelectedThemePack(pack.id);
                  }}
                  className={`group p-4 bg-white/5 border rounded-2xl text-left hover:scale-[1.02] transition-all duration-300 ${
                    selectedThemePack === pack.id
                      ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50'
                      : 'border-white/10 hover:border-purple-500/50'
                  }`}
                >
                  {/* Preview */}
                  <div
                    className="aspect-[4/5] rounded-xl mb-3 flex items-center justify-center overflow-hidden"
                    style={{
                      background: pack.preview.background,
                      color: pack.preview.text
                    }}
                  >
                    <div className="text-center p-3">
                      <div className="text-2xl mb-1">{pack.icon}</div>
                      <div className="text-xs font-bold opacity-70">Preview</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-sm">{pack.name}</h3>
                  <p className="text-xs text-white/50 mt-1">{pack.description}</p>
                  {selectedThemePack === pack.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 justify-center mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition"
              >
                <ChevronLeft className="w-5 h-5 inline mr-1" />
                이전
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!selectedThemePack}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                미리보기 & 다운로드
                <ChevronRight className="w-5 h-5 inline ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Download */}
        {step === 4 && selectedThemePack && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">미리보기</h2>
                <p className="text-white/60">{Object.keys(contentData).length}개의 슬라이드가 준비되었습니다</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      aspectRatio === '1:1' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    1:1
                  </button>
                  <button
                    onClick={() => setAspectRatio('4:5')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      aspectRatio === '4:5' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    4:5
                  </button>
                </div>
                <button
                  onClick={downloadAll}
                  disabled={isDownloading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  {isDownloading
                    ? `${downloadProgress?.current || 0}/${downloadProgress?.total || 0}`
                    : '전체 다운로드'
                  }
                </button>
              </div>
            </div>

            {/* Slide Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(contentData).map(([index, data]) => (
                <div
                  key={index}
                  className="relative group"
                  style={{ aspectRatio: aspectRatio === '1:1' ? '1/1' : '4/5' }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden shadow-xl">
                    {renderSlidePreview(data, parseInt(index))}
                  </div>
                  <div className="absolute top-2 left-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {parseInt(index) + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center mt-8">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition"
              >
                <Palette className="w-5 h-5 inline mr-1" />
                테마 변경
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition"
              >
                <Edit3 className="w-5 h-5 inline mr-1" />
                내용 수정
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Settings Modal */}
      {showAISettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAISettings(false)}>
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                AI 설정
              </h2>
              <button onClick={() => setShowAISettings(false)} className="p-2 text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-white/50 mt-2">
                  Google AI Studio에서 무료로 API 키를 발급받을 수 있습니다.
                </p>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-purple-400 hover:text-purple-300"
              >
                API 키 발급받기 &rarr;
              </a>

              <button
                onClick={handleSaveApiKey}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
