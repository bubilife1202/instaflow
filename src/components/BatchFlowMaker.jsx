import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import {
  ChevronRight, ChevronLeft, Sparkles, Download, Wand2, RotateCcw,
  Settings, Eye, Edit3, Palette, Check, X, Zap, Copy, ChevronDown, ChevronUp,
  ImagePlus, Trash2, Move, Type
} from 'lucide-react';

// Position options for object images and text
const POSITION_OPTIONS = [
  { id: 'top-left', label: '↖', align: 'items-start justify-start' },
  { id: 'top-center', label: '↑', align: 'items-start justify-center' },
  { id: 'top-right', label: '↗', align: 'items-start justify-end' },
  { id: 'center-left', label: '←', align: 'items-center justify-start' },
  { id: 'center', label: '●', align: 'items-center justify-center' },
  { id: 'center-right', label: '→', align: 'items-center justify-end' },
  { id: 'bottom-left', label: '↙', align: 'items-end justify-start' },
  { id: 'bottom-center', label: '↓', align: 'items-end justify-center' },
  { id: 'bottom-right', label: '↘', align: 'items-end justify-end' },
];

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

  // Refs for image upload
  const imageInputRefs = useRef({});
  const objectImageInputRefs = useRef({});

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

    // Use example content if available, otherwise use defaults
    if (structure.exampleContent && structure.exampleContent.length > 0) {
      structure.slides.forEach((slide, index) => {
        const example = structure.exampleContent[index] || {};
        initialData[index] = {
          type: slide.type,
          number: slide.number,
          ...example
        };
      });
    } else {
      structure.slides.forEach((slide, index) => {
        initialData[index] = { type: slide.type, ...getDefaultContent(slide) };
      });
    }

    setContentData(initialData);

    // Apply default theme for the structure
    if (structure.defaultTheme) {
      setSelectedThemePack(structure.defaultTheme);
    }

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

  // Handle image upload for a slide
  const handleImageUpload = (slideIndex, event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateContent(slideIndex, 'image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle object image upload for a slide (image as object, not background)
  const handleObjectImageUpload = (slideIndex, event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateContent(slideIndex, 'objectImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image from a slide
  const removeImage = (slideIndex) => {
    setContentData(prev => {
      const newData = { ...prev };
      if (newData[slideIndex]) {
        const { image, ...rest } = newData[slideIndex];
        newData[slideIndex] = rest;
      }
      return newData;
    });
  };

  // Remove object image from a slide
  const removeObjectImage = (slideIndex) => {
    setContentData(prev => {
      const newData = { ...prev };
      if (newData[slideIndex]) {
        const { objectImage, ...rest } = newData[slideIndex];
        newData[slideIndex] = rest;
      }
      return newData;
    });
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

  // SVG Decorations for professional designs
  const DecoCircles = ({ color, opacity = 0.1 }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <circle cx="10%" cy="15%" r="8%" fill={color} opacity={opacity} />
      <circle cx="90%" cy="85%" r="12%" fill={color} opacity={opacity * 0.7} />
      <circle cx="85%" cy="10%" r="5%" fill={color} opacity={opacity * 0.5} />
    </svg>
  );

  const DecoLines = ({ color, opacity = 0.15 }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <line x1="5%" y1="20%" x2="25%" y2="20%" stroke={color} strokeWidth="3" opacity={opacity} />
      <line x1="75%" y1="80%" x2="95%" y2="80%" stroke={color} strokeWidth="3" opacity={opacity} />
    </svg>
  );

  const DecoCorners = ({ color, opacity = 0.2 }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <path d="M0,0 L15%,0 L15%,3% L3%,3% L3%,15% L0,15% Z" fill={color} opacity={opacity} />
      <path d="M100%,100% L85%,100% L85%,97% L97%,97% L97%,85% L100%,85% Z" fill={color} opacity={opacity} />
    </svg>
  );

  const DecoGeometric = ({ color, opacity = 0.08 }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <polygon points="0,100 0,70 15,85" fill={color} opacity={opacity} />
      <polygon points="100,0 100,30 85,15" fill={color} opacity={opacity} />
      <rect x="80%" y="75%" width="15%" height="2%" fill={color} opacity={opacity * 1.5} />
      <rect x="5%" y="23%" width="15%" height="2%" fill={color} opacity={opacity * 1.5} />
    </svg>
  );

  const DecoDots = ({ color, opacity = 0.15 }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      {[...Array(5)].map((_, i) => (
        <circle key={`dot-top-${i}`} cx={`${8 + i * 4}%`} cy="8%" r="1%" fill={color} opacity={opacity} />
      ))}
      {[...Array(5)].map((_, i) => (
        <circle key={`dot-bottom-${i}`} cx={`${72 + i * 4}%`} cy="92%" r="1%" fill={color} opacity={opacity} />
      ))}
    </svg>
  );

  const DecoWave = ({ color, opacity = 0.1 }) => (
    <svg className="absolute bottom-0 left-0 w-full h-1/4 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
      <path d="M0,40 Q25,20 50,40 T100,40 L100,100 L0,100 Z" fill={color} opacity={opacity} />
      <path d="M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z" fill={color} opacity={opacity * 0.7} />
    </svg>
  );

  const DecoFrame = ({ color, opacity = 0.15 }) => (
    <div className="absolute inset-4 border-2 rounded-lg pointer-events-none" style={{ borderColor: color, opacity }} />
  );

  // Render slide preview with Canva-style professional designs
  const renderSlidePreview = (slideData, index, forDownload = false) => {
    const themePack = THEME_PACKS[selectedThemePack] || THEME_PACKS['modernMinimal'];
    const slideType = slideData.type;
    const isDownload = forDownload;

    // Scale factors for download vs preview
    const scale = isDownload ? 1 : 1;
    const titleSize = isDownload ? 'text-5xl' : 'text-2xl md:text-3xl';
    const subtitleSize = isDownload ? 'text-2xl' : 'text-base md:text-lg';
    const headingSize = isDownload ? 'text-4xl' : 'text-xl md:text-2xl';
    const bodySize = isDownload ? 'text-xl' : 'text-sm md:text-base';
    const smallSize = isDownload ? 'text-lg' : 'text-xs';
    const numberSize = isDownload ? 'w-24 h-24 text-4xl' : 'w-14 h-14 text-2xl';
    const buttonPadding = isDownload ? 'px-12 py-4 text-xl' : 'px-6 py-2.5 text-sm';

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
      ...(styles.pattern && { backgroundImage: `${styles.pattern}, ${styles.background}` }),
      ...(styles.glow && { boxShadow: styles.glow })
    };

    const accentColor = styles.accentColor || styles.titleColor;

    // Image size classes
    const imageSize = isDownload ? 'w-48 h-48' : 'w-24 h-24';
    const smallImageSize = isDownload ? 'w-32 h-32' : 'w-16 h-16';

    // Get position alignment classes
    const getPositionAlign = (position) => {
      const pos = POSITION_OPTIONS.find(p => p.id === position) || POSITION_OPTIONS.find(p => p.id === 'center');
      return pos.align;
    };

    // Position-based flex direction
    const getFlexDirection = (position) => {
      if (position?.startsWith('top')) return 'flex-col';
      if (position?.startsWith('bottom')) return 'flex-col-reverse';
      if (position?.includes('left')) return 'flex-row';
      if (position?.includes('right')) return 'flex-row-reverse';
      return 'flex-col';
    };

    const textPosition = slideData.textPosition || 'center';
    const objectImagePosition = slideData.objectImagePosition || 'center';
    const textAlign = getPositionAlign(textPosition);

    return (
      <div
        ref={forDownload ? (el => slideRefs.current[index] = el) : null}
        className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={containerStyle}
      >
        {/* Background image overlay if exists */}
        {slideData.image && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slideData.image})` }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}

        {/* Cover Slide - Professional Design */}
        {slideType === 'cover' && (
          <>
            {!slideData.image && <DecoCircles color={accentColor} opacity={0.1} />}
            {!slideData.image && <DecoCorners color={accentColor} opacity={0.25} />}
            {!slideData.image && <DecoLines color={accentColor} opacity={0.2} />}

            <div className={`relative z-10 px-8 py-6 flex flex-col ${textAlign} h-full w-full`}>
              {/* Object Image - positioned based on objectImagePosition */}
              {slideData.objectImage && (
                <div
                  className={`${imageSize} rounded-2xl mb-4 bg-cover bg-center shadow-xl flex-shrink-0`}
                  style={{
                    backgroundImage: `url(${slideData.objectImage})`,
                    boxShadow: `0 8px 32px ${accentColor}30`,
                    alignSelf: objectImagePosition.includes('left') ? 'flex-start' : objectImagePosition.includes('right') ? 'flex-end' : 'center'
                  }}
                />
              )}

              {/* Text content wrapper */}
              <div className={`flex flex-col ${textPosition.includes('left') ? 'items-start text-left' : textPosition.includes('right') ? 'items-end text-right' : 'items-center text-center'}`}>
                {/* Top accent line - only show if no object image */}
                {!slideData.objectImage && (
                  <div
                    className="w-16 h-1 rounded-full mb-6"
                    style={{ background: slideData.image ? '#ffffff' : accentColor }}
                  />
                )}

                {/* Main title with enhanced typography */}
                <h1
                  className={`${titleSize} font-black mb-4 leading-tight tracking-tight break-keep text-balance`}
                  style={{
                    color: slideData.image ? '#ffffff' : styles.titleColor,
                    textShadow: slideData.image ? '0 2px 20px rgba(0,0,0,0.5)' : (styles.glow ? `0 0 30px ${styles.titleColor}40` : 'none')
                  }}
                >
                  {slideData.title || '제목을 입력하세요'}
                </h1>

                {/* Subtitle with decorative elements */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px" style={{ background: slideData.image ? 'rgba(255,255,255,0.5)' : styles.subtitleColor, opacity: 0.5 }} />
                  <p
                    className={`${subtitleSize} font-medium tracking-wide break-keep text-pretty`}
                    style={{ color: slideData.image ? 'rgba(255,255,255,0.9)' : styles.subtitleColor }}
                  >
                    {slideData.subtitle || '부제목'}
                  </p>
                  <div className="w-8 h-px" style={{ background: slideData.image ? 'rgba(255,255,255,0.5)' : styles.subtitleColor, opacity: 0.5 }} />
                </div>

                {/* Bottom accent */}
                {!slideData.objectImage && (
                  <div
                    className="w-24 h-1 rounded-full mt-8"
                    style={{ background: slideData.image ? 'rgba(255,255,255,0.5)' : `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Item/Step Slide - Card Style Design */}
        {(slideType === 'item' || slideType === 'step') && (
          <>
            <DecoGeometric color={accentColor} opacity={0.1} />
            <DecoDots color={accentColor} opacity={0.2} />

            <div className={`relative z-10 px-8 py-6 flex flex-col ${textAlign} h-full w-full`}>
              {/* Object Image - show at top if exists */}
              {slideData.objectImage ? (
                <div
                  className={`${smallImageSize} rounded-xl mb-4 bg-cover bg-center shadow-lg flex-shrink-0`}
                  style={{
                    backgroundImage: `url(${slideData.objectImage})`,
                    boxShadow: `0 6px 24px ${accentColor}25`,
                    alignSelf: objectImagePosition.includes('left') ? 'flex-start' : objectImagePosition.includes('right') ? 'flex-end' : 'center'
                  }}
                />
              ) : (
                /* Large number badge with gradient - show when no object image */
                <div
                  className={`${numberSize} rounded-2xl flex items-center justify-center font-black mb-6 shadow-lg`}
                  style={{
                    background: styles.numberBg,
                    color: styles.numberColor,
                    boxShadow: `0 8px 32px ${accentColor}30`,
                    alignSelf: textPosition.includes('left') ? 'flex-start' : textPosition.includes('right') ? 'flex-end' : 'center'
                  }}
                >
                  {slideType === 'step' ? `${slideData.number || index}` : slideData.number || index}
                </div>
              )}

              {/* Text content wrapper */}
              <div className={`flex flex-col ${textPosition.includes('left') ? 'items-start text-left' : textPosition.includes('right') ? 'items-end text-right' : 'items-center text-center'}`}>
                {/* Step label for tutorial */}
                {slideType === 'step' && (
                  <div
                    className={`${smallSize} font-bold uppercase tracking-widest mb-2`}
                    style={{ color: accentColor }}
                  >
                    STEP {slideData.number || index}
                  </div>
                )}

                {/* Title with underline accent */}
                <h2
                  className={`${headingSize} font-bold mb-3 leading-tight break-keep text-balance`}
                  style={{ color: styles.titleColor }}
                >
                  {slideData.itemTitle || slideData.stepTitle || '항목 제목'}
                </h2>

                {/* Accent underline */}
                <div
                  className="w-12 h-1 rounded-full mb-4"
                  style={{ background: accentColor }}
                />

                {/* Description with styled container */}
                <div
                  className="px-6 py-3 rounded-xl max-w-[85%]"
                  style={{ background: `${styles.highlightColor || accentColor}15` }}
                >
                  <p
                    className={`${bodySize} leading-relaxed break-keep text-pretty`}
                    style={{ color: styles.textColor }}
                  >
                    {slideData.itemDescription || slideData.stepDescription || '설명을 입력하세요'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Question Slide - Engaging Design */}
        {slideType === 'question' && (
          <>
            <DecoCircles color={accentColor} opacity={0.12} />
            <DecoWave color={accentColor} opacity={0.08} />

            <div className={`relative z-10 px-8 py-6 flex flex-col ${textAlign} h-full w-full`}>
              {/* Object Image or Question mark icon */}
              {slideData.objectImage ? (
                <div
                  className={`${smallImageSize} rounded-xl mb-5 bg-cover bg-center shadow-lg flex-shrink-0`}
                  style={{
                    backgroundImage: `url(${slideData.objectImage})`,
                    boxShadow: `0 6px 24px ${accentColor}25`,
                    alignSelf: objectImagePosition.includes('left') ? 'flex-start' : objectImagePosition.includes('right') ? 'flex-end' : 'center'
                  }}
                />
              ) : (
                <div
                  className={`${isDownload ? 'w-20 h-20 text-5xl' : 'w-12 h-12 text-2xl'} rounded-full flex items-center justify-center mb-6 font-black`}
                  style={{
                    background: `${accentColor}20`,
                    color: accentColor,
                    boxShadow: `0 0 40px ${accentColor}20`,
                    alignSelf: textPosition.includes('left') ? 'flex-start' : textPosition.includes('right') ? 'flex-end' : 'center'
                  }}
                >
                  ?
                </div>
              )}

              {/* Text content wrapper */}
              <div className={`flex flex-col ${textPosition.includes('left') ? 'items-start text-left' : textPosition.includes('right') ? 'items-end text-right' : 'items-center text-center'}`}>
                {/* Question text with emphasis */}
                <h2
                  className={`${headingSize} font-bold leading-snug max-w-[90%] break-keep text-balance`}
                  style={{ color: styles.titleColor }}
                >
                  {slideData.questionText || '질문을 입력하세요'}
                </h2>

                {/* Decorative bottom element */}
                <div className="flex items-center gap-2 mt-6">
                  <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: accentColor, opacity: 0.6 }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: accentColor, opacity: 0.3 }} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Answer Slide - Reveal Design */}
        {slideType === 'answer' && (
          <>
            <DecoCorners color={accentColor} opacity={0.2} />
            <DecoLines color={accentColor} opacity={0.15} />

            <div className={`relative z-10 px-8 py-6 flex flex-col ${textAlign} h-full w-full`}>
              {/* Object Image or Lightbulb icon */}
              {slideData.objectImage ? (
                <div
                  className={`${smallImageSize} rounded-xl mb-4 bg-cover bg-center shadow-lg flex-shrink-0`}
                  style={{
                    backgroundImage: `url(${slideData.objectImage})`,
                    boxShadow: `0 6px 24px ${accentColor}25`,
                    alignSelf: objectImagePosition.includes('left') ? 'flex-start' : objectImagePosition.includes('right') ? 'flex-end' : 'center'
                  }}
                />
              ) : (
                <div
                  className={`${isDownload ? 'w-16 h-16 text-4xl' : 'w-10 h-10 text-xl'} rounded-full flex items-center justify-center mb-5`}
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                    color: styles.numberColor || '#fff',
                    boxShadow: `0 4px 20px ${accentColor}40`,
                    alignSelf: textPosition.includes('left') ? 'flex-start' : textPosition.includes('right') ? 'flex-end' : 'center'
                  }}
                >
                  💡
                </div>
              )}

              {/* Text content wrapper */}
              <div className={`flex flex-col ${textPosition.includes('left') ? 'items-start text-left' : textPosition.includes('right') ? 'items-end text-right' : 'items-center text-center'}`}>
                {/* Answer label */}
                <div
                  className={`${smallSize} font-bold uppercase tracking-widest mb-3`}
                  style={{ color: accentColor }}
                >
                  ANSWER
                </div>

                {/* Main answer */}
                <h2
                  className={`${headingSize} font-bold mb-4 leading-tight break-keep text-balance`}
                  style={{ color: styles.titleColor }}
                >
                  {slideData.answerText || '답변'}
                </h2>

                {/* Detail with card style */}
                {slideData.answerDetail && (
                  <div
                    className="px-6 py-4 rounded-2xl max-w-[90%] border"
                    style={{
                      background: `${styles.highlightColor || accentColor}10`,
                      borderColor: `${accentColor}20`
                    }}
                  >
                    <p
                      className={`${bodySize} leading-relaxed break-keep text-pretty`}
                      style={{ color: styles.textColor }}
                    >
                      {slideData.answerDetail}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Quote Slide - Elegant Design */}
        {slideType === 'quote' && (
          <>
            <DecoFrame color={accentColor} opacity={0.1} />

            <div className={`relative z-10 px-10 py-8 flex flex-col ${textAlign} h-full w-full`}>
              {/* Text content wrapper */}
              <div className={`flex flex-col ${textPosition.includes('left') ? 'items-start text-left' : textPosition.includes('right') ? 'items-end text-right' : 'items-center text-center'}`}>
                {/* Large quotation mark */}
                <div
                  className={`${isDownload ? 'text-8xl' : 'text-5xl'} font-serif leading-none mb-2`}
                  style={{ color: accentColor, opacity: 0.3 }}
                >
                  "
                </div>

                {/* Quote text */}
                <p
                  className={`${headingSize} font-medium italic leading-relaxed max-w-[85%] mb-4 break-keep text-balance`}
                  style={{ color: styles.titleColor }}
                >
                  {slideData.quoteText || '명언을 입력하세요'}
                </p>

                {/* Author with line */}
                {slideData.quoteAuthor && (
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-px" style={{ background: accentColor, opacity: 0.5 }} />
                    <p
                      className={`${smallSize} font-medium tracking-wide`}
                      style={{ color: styles.textColor, opacity: 0.8 }}
                    >
                      {slideData.quoteAuthor}
                    </p>
                    <div className="w-8 h-px" style={{ background: accentColor, opacity: 0.5 }} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* CTA Slide - Action-Oriented Design */}
        {slideType === 'cta' && (
          <>
            <DecoCircles color={styles.buttonBg} opacity={0.15} />
            <DecoGeometric color={styles.buttonBg} opacity={0.1} />

            <div className={`relative z-10 px-8 py-6 flex flex-col ${textAlign} h-full w-full`}>
              {/* Object Image or Top decorative element */}
              {slideData.objectImage ? (
                <div
                  className={`${smallImageSize} rounded-xl mb-5 bg-cover bg-center shadow-lg flex-shrink-0`}
                  style={{
                    backgroundImage: `url(${slideData.objectImage})`,
                    boxShadow: `0 6px 24px ${typeof styles.buttonBg === 'string' ? styles.buttonBg : '#000'}25`,
                    alignSelf: objectImagePosition.includes('left') ? 'flex-start' : objectImagePosition.includes('right') ? 'flex-end' : 'center'
                  }}
                />
              ) : (
                <div className="flex items-center gap-2 mb-6" style={{ alignSelf: textPosition.includes('left') ? 'flex-start' : textPosition.includes('right') ? 'flex-end' : 'center' }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: styles.buttonBg }} />
                  <div className="w-6 h-1" style={{ background: styles.buttonBg }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: styles.buttonBg }} />
                </div>
              )}

              {/* Text content wrapper */}
              <div className={`flex flex-col ${textPosition.includes('left') ? 'items-start text-left' : textPosition.includes('right') ? 'items-end text-right' : 'items-center text-center'}`}>
                {/* CTA headline */}
                <h2
                  className={`${headingSize} font-black mb-6 leading-tight break-keep text-balance`}
                  style={{
                    color: styles.titleColor,
                    textShadow: styles.glow ? `0 0 20px ${styles.titleColor}40` : 'none'
                  }}
                >
                  {slideData.ctaText || '지금 바로 시작하세요!'}
                </h2>

                {/* CTA Button with hover-like styling */}
                <div
                  className={`${buttonPadding} rounded-full font-bold shadow-lg transform transition`}
                  style={{
                    background: styles.buttonBg,
                    color: styles.buttonColor,
                    boxShadow: `0 8px 30px ${typeof styles.buttonBg === 'string' && styles.buttonBg.includes('gradient') ? 'rgba(0,0,0,0.3)' : styles.buttonBg + '50'}`
                  }}
                >
                  {slideData.ctaAction || '팔로우하기'}
                </div>

                {/* Swipe indicator */}
                <div className="flex items-center gap-1 mt-8">
                  <div className={`${isDownload ? 'w-4 h-1' : 'w-2 h-0.5'} rounded-full`} style={{ background: styles.textColor, opacity: 0.3 }} />
                  <div className={`${isDownload ? 'w-8 h-1' : 'w-4 h-0.5'} rounded-full`} style={{ background: styles.textColor, opacity: 0.5 }} />
                  <div className={`${isDownload ? 'w-4 h-1' : 'w-2 h-0.5'} rounded-full`} style={{ background: styles.textColor, opacity: 0.3 }} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Generic fallback with improved design */}
        {!['cover', 'item', 'step', 'question', 'answer', 'quote', 'cta'].includes(slideType) && (
          <>
            <DecoCorners color={accentColor} opacity={0.15} />
            <div className={`relative z-10 px-8 py-6 flex flex-col ${textAlign} h-full w-full`}>
              <div className={`flex flex-col ${textPosition.includes('left') ? 'items-start text-left' : textPosition.includes('right') ? 'items-end text-right' : 'items-center text-center'}`}>
                <div
                  className={`${isDownload ? 'w-16 h-16 text-4xl' : 'w-10 h-10 text-xl'} rounded-xl flex items-center justify-center mb-4`}
                  style={{ background: `${accentColor}20` }}
                >
                  📝
                </div>
                <p
                  className={`${headingSize} font-bold max-w-[85%] break-keep text-balance`}
                  style={{ color: styles.titleColor }}
                >
                  {Object.values(slideData).find(v => typeof v === 'string' && v && v !== slideType) || `${slideType} 슬라이드`}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Instagram ID watermark - improved positioning */}
        {instagramId && (
          <div
            className={`absolute bottom-3 right-4 ${isDownload ? 'text-sm' : 'text-[10px]'} font-medium tracking-wide`}
            style={{ color: styles.textColor || styles.titleColor, opacity: 0.4 }}
          >
            {instagramId}
          </div>
        )}
      </div>
    );
  };

  // Helper to convert data URL to blob efficiently (no fetch needed)
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Download all slides - optimized for speed
  const downloadAll = async () => {
    setIsDownloading(true);
    const totalSlides = Object.keys(contentData).length;
    setDownloadProgress({ current: 0, total: totalSlides });

    const zip = new JSZip();

    try {
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 50)); // Brief wait for fonts

      // Process all slides in parallel for maximum speed
      const capturePromises = [];
      for (let i = 0; i < totalSlides; i++) {
        if (!slideRefs.current[i]) continue;

        capturePromises.push(
          (async (index) => {
            try {
              const node = slideRefs.current[index];
              // Hidden slides are already 1080px wide, use pixelRatio 1
              const dataUrl = await toPng(node, {
                quality: 1,
                pixelRatio: 1,
              });
              const blob = dataURLtoBlob(dataUrl);
              return { index, blob };
            } catch (err) {
              console.error(`Error capturing slide ${index + 1}:`, err);
              return null;
            }
          })(i)
        );
      }

      // Wait for all captures to complete
      const results = await Promise.all(capturePromises);
      setDownloadProgress({ current: totalSlides, total: totalSlides });

      // Add successful results to ZIP
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

                    {/* Image Upload Section */}
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-2">
                      {/* Background Image */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={el => imageInputRefs.current[index] = el}
                        onChange={(e) => handleImageUpload(index, e)}
                        className="hidden"
                      />
                      {contentData[index]?.image ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-12 h-12 rounded bg-cover bg-center border border-white/20"
                            style={{ backgroundImage: `url(${contentData[index].image})` }}
                          />
                          <div className="flex-1 text-xs text-white/60">배경 이미지 적용됨</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition"
                            title="이미지 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            imageInputRefs.current[index]?.click();
                          }}
                          className="w-full flex items-center justify-center gap-2 px-2 py-1.5 bg-white/5 border border-dashed border-white/20 rounded text-white/50 text-xs hover:bg-white/10 hover:text-white/70 transition"
                        >
                          <ImagePlus className="w-4 h-4" />
                          배경 이미지 추가
                        </button>
                      )}

                      {/* Object Image */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={el => objectImageInputRefs.current[index] = el}
                        onChange={(e) => handleObjectImageUpload(index, e)}
                        className="hidden"
                      />
                      {contentData[index]?.objectImage ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-12 h-12 rounded bg-cover bg-center border border-purple-400/50"
                              style={{ backgroundImage: `url(${contentData[index].objectImage})` }}
                            />
                            <div className="flex-1 text-xs text-purple-300">오브젝트 이미지</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeObjectImage(index);
                              }}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition"
                              title="이미지 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {/* Object Image Position Selector */}
                          <div className="flex items-center gap-2">
                            <Move className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px] text-purple-300">위치:</span>
                            <div className="grid grid-cols-3 gap-0.5">
                              {POSITION_OPTIONS.map((pos) => (
                                <button
                                  key={pos.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateContent(index, 'objectImagePosition', pos.id);
                                  }}
                                  className={`w-5 h-5 text-[8px] rounded flex items-center justify-center transition ${
                                    (contentData[index]?.objectImagePosition || 'center') === pos.id
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-white/10 text-white/50 hover:bg-white/20'
                                  }`}
                                  title={pos.id}
                                >
                                  {pos.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            objectImageInputRefs.current[index]?.click();
                          }}
                          className="w-full flex items-center justify-center gap-2 px-2 py-1.5 bg-purple-500/10 border border-dashed border-purple-400/30 rounded text-purple-300/70 text-xs hover:bg-purple-500/20 hover:text-purple-300 transition"
                        >
                          <ImagePlus className="w-4 h-4" />
                          오브젝트 이미지 추가
                        </button>
                      )}

                      {/* Text Position Selector */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <Type className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] text-cyan-300">글씨 위치:</span>
                        <div className="grid grid-cols-3 gap-0.5">
                          {POSITION_OPTIONS.map((pos) => (
                            <button
                              key={pos.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateContent(index, 'textPosition', pos.id);
                              }}
                              className={`w-5 h-5 text-[8px] rounded flex items-center justify-center transition ${
                                (contentData[index]?.textPosition || 'center') === pos.id
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-white/10 text-white/50 hover:bg-white/20'
                              }`}
                              title={pos.id}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
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
