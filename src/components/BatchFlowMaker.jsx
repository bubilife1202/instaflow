import { useState, useRef, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import Moveable from 'react-moveable';
import {
  ChevronRight, ChevronLeft, Sparkles, Download, RotateCcw,
  Eye, Edit3, Palette, Check, X, Zap, ChevronDown, ChevronUp,
  ImagePlus, Trash2, Upload, GripVertical
} from 'lucide-react';

// Import data
import { FLOW_STRUCTURES, FLOW_CATEGORIES, getFlowStructuresList } from '../data/flowStructures';
import { THEME_PACKS, PACK_CATEGORIES, getThemePacksList } from '../data/themePacks';

/**
 * MiniSlidePreview - Simplified mini preview for thumbnails
 */
function MiniSlidePreview({ slideData, themePack, aspectRatio }) {
  const slideType = slideData?.type || 'cover';
  let styles = {};

  if (slideType === 'cover') {
    styles = themePack.cover;
  } else if (slideType === 'cta') {
    styles = themePack.cta;
  } else {
    styles = themePack.body;
  }

  const accentColor = styles.accentColor || styles.titleColor;

  // Get the main text content from slideData based on type
  const getMainText = () => {
    switch (slideType) {
      case 'cover': return slideData?.title || '제목';
      case 'item': return slideData?.itemTitle || '항목';
      case 'step': return slideData?.stepTitle || '단계';
      case 'question': return slideData?.questionText || '질문';
      case 'answer': return slideData?.answerText || '답변';
      case 'cta': return slideData?.ctaText || 'CTA';
      case 'quote': return slideData?.quoteText || '명언';
      case 'intro': return slideData?.introText || '인트로';
      case 'body': return slideData?.bodyText || '본문';
      case 'climax': return slideData?.climaxText || '클라이맥스';
      case 'result': return slideData?.resultText || '결과';
      case 'benefit': return slideData?.benefitTitle || '혜택';
      case 'detail': return slideData?.detailText || '상세';
      case 'howto': return slideData?.howtoSteps || '방법';
      case 'specs': return slideData?.specList || '스펙';
      case 'pros': return slideData?.prosList || '장점';
      case 'cons': return slideData?.consList || '단점';
      case 'verdict': return slideData?.verdictText || '결론';
      case 'hint': return slideData?.hintText || '힌트';
      case 'explanation': return slideData?.explanationText || '설명';
      case 'insight': return slideData?.insightText || '인사이트';
      case 'action': return slideData?.actionList || '액션';
      case 'process': return slideData?.processText || '과정';
      case 'before': return slideData?.beforeTitle || '이전';
      case 'after': return slideData?.afterTitle || '이후';
      default:
        // Try to find any text content
        const textFields = Object.entries(slideData || {}).find(
          ([k, v]) => typeof v === 'string' && v && !['type', 'number', 'image', 'objectImage'].includes(k)
        );
        return textFields ? textFields[1] : slideType;
    }
  };

  // Get icon/badge for the slide type
  const getIcon = () => {
    switch (slideType) {
      case 'question': return '?';
      case 'answer': return '💡';
      case 'quote': return '"';
      case 'hint': return '💡';
      case 'pros': return '👍';
      case 'cons': return '👎';
      case 'before': return '⬅';
      case 'after': return '➡';
      case 'result': return '🎯';
      case 'insight': return '✨';
      default: return null;
    }
  };

  const mainText = getMainText();
  const icon = getIcon();
  const hasNumber = ['item', 'step'].includes(slideType) && slideData?.number;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
      style={{
        background: styles.background,
        aspectRatio: aspectRatio === '1:1' ? '1/1' : '4/5'
      }}
    >
      {/* Background image overlay */}
      {slideData?.image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slideData.image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}

      {/* Object image thumbnail */}
      {slideData?.objectImage && (
        <div
          className="absolute w-4 h-4 rounded bg-cover bg-center z-10 shadow"
          style={{
            backgroundImage: `url(${slideData.objectImage})`,
            top: '12%',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
      )}

      <div className="relative z-10 p-1 flex flex-col items-center justify-center w-full">
        {/* Cover slide */}
        {slideType === 'cover' && (
          <>
            <div className="w-4 h-0.5 rounded-full mb-0.5" style={{ background: accentColor, opacity: 0.5 }} />
            <div
              className="text-[6px] font-black leading-tight text-center px-0.5 line-clamp-2 break-keep"
              style={{ color: slideData?.image ? '#fff' : styles.titleColor }}
            >
              {mainText}
            </div>
          </>
        )}

        {/* Number badge slides (item/step) */}
        {hasNumber && !slideData?.objectImage && (
          <div
            className="w-3 h-3 rounded text-[5px] font-bold flex items-center justify-center mb-0.5"
            style={{ background: styles.numberBg, color: styles.numberColor }}
          >
            {slideData.number}
          </div>
        )}

        {/* Icon badge slides */}
        {icon && !hasNumber && !slideData?.objectImage && slideType !== 'cover' && (
          <div
            className="w-3 h-3 rounded-full text-[6px] font-bold flex items-center justify-center mb-0.5"
            style={{
              background: slideType === 'quote' ? 'transparent' : `${accentColor}30`,
              color: accentColor,
              opacity: slideType === 'quote' ? 0.5 : 1
            }}
          >
            {icon}
          </div>
        )}

        {/* Main text for non-cover slides */}
        {slideType !== 'cover' && slideType !== 'cta' && (
          <div
            className="text-[5px] font-bold leading-tight text-center line-clamp-2 px-0.5 break-keep"
            style={{ color: styles.titleColor }}
          >
            {mainText}
          </div>
        )}

        {/* CTA slide */}
        {slideType === 'cta' && (
          <>
            <div
              className="text-[5px] font-bold leading-tight text-center mb-0.5 line-clamp-1 px-0.5 break-keep"
              style={{ color: styles.titleColor }}
            >
              {mainText}
            </div>
            <div
              className="text-[4px] px-1 py-0.5 rounded-full font-bold break-keep"
              style={{ background: styles.buttonBg, color: styles.buttonColor }}
            >
              {slideData?.ctaAction || '버튼'}
            </div>
          </>
        )}
      </div>

      {/* Slide number indicator at bottom */}
      {slideData?.number && !['item', 'step'].includes(slideType) && (
        <div
          className="absolute bottom-0.5 right-0.5 text-[4px] font-bold opacity-40"
          style={{ color: styles.titleColor }}
        >
          {slideData.number}
        </div>
      )}
    </div>
  );
}

/**
 * ThemePreviewCard - Shows actual mini card news preview for theme selection
 */
function ThemePreviewCard({ themePack, isSelected, onClick }) {
  const styles = themePack.cover;
  const bodyStyles = themePack.body;

  return (
    <button
      onClick={onClick}
      className={`group relative rounded-xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.02] ${
        isSelected
          ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900'
          : 'hover:ring-1 hover:ring-white/30'
      }`}
    >
      {/* Mini Card Preview - shows actual design */}
      <div
        className="aspect-[4/5] relative overflow-hidden rounded-lg"
        style={{ background: styles.background }}
      >
        {/* Mini title preview */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
          <div
            className="w-6 h-0.5 rounded-full mb-1.5"
            style={{ background: styles.accentColor || styles.titleColor }}
          />
          <div
            className="text-[8px] font-black text-center leading-tight px-1"
            style={{ color: styles.titleColor }}
          >
            {themePack.name}
          </div>
          <div
            className="text-[5px] mt-0.5 opacity-70"
            style={{ color: styles.subtitleColor }}
          >
            샘플 텍스트
          </div>
          {/* Mini number badge */}
          <div
            className="w-4 h-4 rounded mt-2 flex items-center justify-center text-[6px] font-bold"
            style={{ background: bodyStyles.numberBg, color: bodyStyles.numberColor }}
          >
            1
          </div>
        </div>

        {/* Selection check */}
        {isSelected && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Theme name */}
      <div className="mt-1.5 text-center">
        <div className="text-[10px] font-medium text-white/80 truncate">{themePack.name}</div>
      </div>
    </button>
  );
}

/**
 * ImageDropZone - Drag & drop image upload with preview
 */
function ImageDropZone({ image, onUpload, onRemove, type = 'background', className = '' }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => onUpload(ev.target.result);
      reader.readAsDataURL(files[0]);
    }
  }, [onUpload]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => onUpload(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const isBackground = type === 'background';

  if (image) {
    return (
      <div className={`relative group ${className}`}>
        <div
          className={`w-full aspect-video rounded-lg bg-cover bg-center border-2 ${
            isBackground ? 'border-white/20' : 'border-purple-400/50'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="opacity-0 group-hover:opacity-100 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className={`absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded ${
          isBackground ? 'bg-black/60 text-white/80' : 'bg-purple-500/80 text-white'
        }`}>
          {isBackground ? '배경' : '오브젝트'}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-all ${className} ${
        isDragging
          ? (isBackground ? 'border-white/60 bg-white/10' : 'border-purple-400 bg-purple-500/10')
          : (isBackground ? 'border-white/20 hover:border-white/40 hover:bg-white/5' : 'border-purple-400/30 hover:border-purple-400/60 hover:bg-purple-500/5')
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center py-3 px-2">
        <div className={`p-2 rounded-full mb-1 ${isBackground ? 'bg-white/10' : 'bg-purple-500/20'}`}>
          {isBackground ? (
            <ImagePlus className="w-4 h-4 text-white/50" />
          ) : (
            <Upload className="w-4 h-4 text-purple-400" />
          )}
        </div>
        <div className={`text-[10px] text-center ${isBackground ? 'text-white/40' : 'text-purple-300/70'}`}>
          {isDragging ? '놓으세요!' : (isBackground ? '배경 이미지' : '오브젝트 이미지')}
        </div>
        <div className="text-[8px] text-white/30 mt-0.5">
          드래그 또는 클릭
        </div>
      </div>
    </div>
  );
}

/**
 * TemplatePreviewCard - Shows actual card news preview with hover animation
 */
function TemplatePreviewCard({ structure, themePack, onClick }) {
  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  const exampleContent = structure.exampleContent || [];
  const coverContent = exampleContent[0] || { title: structure.name, subtitle: structure.description };

  useEffect(() => {
    if (isHovering && exampleContent.length > 1) {
      intervalRef.current = setInterval(() => {
        setHoverIndex(prev => (prev + 1) % Math.min(exampleContent.length, 4));
      }, 1200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setHoverIndex(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHovering, exampleContent.length]);

  const currentSlide = exampleContent[hoverIndex] || coverContent;
  const slideType = currentSlide.type || 'cover';
  const slideStyles = slideType === 'cover' ? themePack.cover : slideType === 'cta' ? themePack.cta : themePack.body;

  // Get display content based on slide type
  const getSlideContent = () => {
    switch (slideType) {
      case 'cover':
        return { title: currentSlide.title || structure.name, subtitle: currentSlide.subtitle };
      case 'item':
        return { number: currentSlide.number, title: currentSlide.itemTitle };
      case 'step':
        return { number: currentSlide.number, title: currentSlide.stepTitle, label: 'STEP' };
      case 'question':
        return { icon: '?', title: currentSlide.questionText };
      case 'answer':
        return { icon: '💡', title: currentSlide.answerText };
      case 'quote':
        return { icon: '"', title: currentSlide.quoteText, isItalic: true };
      case 'cta':
        return { title: currentSlide.ctaText, button: currentSlide.ctaAction };
      case 'before':
        return { icon: '⬅', title: currentSlide.beforeTitle || '이전' };
      case 'after':
        return { icon: '➡', title: currentSlide.afterTitle || '이후' };
      case 'pros':
        return { icon: '👍', title: currentSlide.prosList || '장점' };
      case 'cons':
        return { icon: '👎', title: currentSlide.consList || '단점' };
      case 'result':
        return { icon: '🎯', title: currentSlide.resultText || '결과' };
      case 'insight':
        return { icon: '✨', title: currentSlide.insightText || '인사이트' };
      default:
        // Find any text field
        const textField = Object.entries(currentSlide).find(
          ([k, v]) => typeof v === 'string' && v && !['type', 'number'].includes(k)
        );
        return { title: textField ? textField[1] : slideType };
    }
  };

  const content = getSlideContent();

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden text-left hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
    >
      <div className="aspect-[4/5] relative overflow-hidden" style={{ background: slideStyles.background }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
          {/* Cover slide */}
          {slideType === 'cover' && (
            <>
              <div className="text-[10px] font-black leading-tight mb-1 break-keep text-balance px-2" style={{ color: slideStyles.titleColor }}>
                {content.title}
              </div>
              {content.subtitle && (
                <div className="text-[7px] opacity-80 break-keep" style={{ color: slideStyles.subtitleColor }}>{content.subtitle}</div>
              )}
            </>
          )}

          {/* Numbered slides (item/step) */}
          {(slideType === 'item' || slideType === 'step') && (
            <>
              {content.label && (
                <div className="text-[6px] font-bold tracking-wider mb-0.5 break-keep" style={{ color: slideStyles.accentColor || slideStyles.titleColor }}>
                  {content.label} {content.number}
                </div>
              )}
              {!content.label && (
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold mb-1" style={{ background: slideStyles.numberBg, color: slideStyles.numberColor }}>
                  {content.number}
                </div>
              )}
              <div className="text-[9px] font-bold leading-tight break-keep text-balance" style={{ color: slideStyles.titleColor }}>
                {content.title}
              </div>
            </>
          )}

          {/* Icon-based slides */}
          {content.icon && !['cover', 'item', 'step', 'cta'].includes(slideType) && (
            <>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1"
                style={{
                  background: slideType === 'quote' ? 'transparent' : `${slideStyles.accentColor || slideStyles.titleColor}20`,
                  color: slideStyles.accentColor || slideStyles.titleColor,
                  opacity: slideType === 'quote' ? 0.5 : 1
                }}
              >
                {content.icon}
              </div>
              <div
                className={`text-[8px] font-bold leading-tight break-keep text-balance px-2 ${content.isItalic ? 'italic' : ''}`}
                style={{ color: slideStyles.titleColor }}
              >
                {content.title}
              </div>
            </>
          )}

          {/* CTA slide */}
          {slideType === 'cta' && (
            <>
              {content.title && (
                <div className="text-[8px] font-bold leading-tight mb-1.5 break-keep text-balance" style={{ color: slideStyles.titleColor }}>
                  {content.title}
                </div>
              )}
              <div className="text-[6px] px-2 py-0.5 rounded-full font-bold break-keep" style={{ background: slideStyles.buttonBg, color: slideStyles.buttonColor }}>
                {content.button || '버튼'}
              </div>
            </>
          )}

          {/* Generic fallback */}
          {!content.icon && !['cover', 'item', 'step', 'cta'].includes(slideType) && (
            <div className="text-[8px] font-bold leading-tight break-keep text-balance px-2" style={{ color: slideStyles.titleColor }}>
              {content.title}
            </div>
          )}
        </div>

        {isHovering && exampleContent.length > 1 && (
          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-0.5">
            {exampleContent.slice(0, 4).map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === hoverIndex ? 'bg-white scale-125' : 'bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="p-2.5 bg-gradient-to-t from-black/40 to-transparent">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-lg">{structure.icon}</span>
          <h3 className="text-xs font-bold text-white truncate">{structure.name}</h3>
        </div>
        <p className="text-[10px] text-white/50 line-clamp-1">{structure.description}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-purple-400 font-medium">{structure.slides.length}장</span>
          <span className="text-[9px] text-white/30 group-hover:text-purple-400 transition-colors">클릭하여 시작 →</span>
        </div>
      </div>
    </button>
  );
}

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

  // Mobile view mode: 'input' | 'preview'
  const [mobileView, setMobileView] = useState('input');

  // Refs for download
  const slideRefs = useRef([]);

  // Moveable refs
  const moveableRef = useRef(null);
  const objectImageRef = useRef(null);
  const textRef = useRef(null);

  // Draggable element state (stores x, y as percentages)
  const [dragPositions, setDragPositions] = useState({});

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
  const handleImageUpload = (slideIndex, imageData) => {
    updateContent(slideIndex, 'image', imageData);
  };

  // Handle object image upload for a slide (image as object, not background)
  const handleObjectImageUpload = (slideIndex, imageData) => {
    updateContent(slideIndex, 'objectImage', imageData);
    // Initialize drag position for the object image
    setDragPositions(prev => ({
      ...prev,
      [`${slideIndex}-object`]: prev[`${slideIndex}-object`] || { x: 50, y: 20 }
    }));
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
    // Also remove drag position
    setDragPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[`${slideIndex}-object`];
      return newPositions;
    });
  };

  // Update drag position
  const updateDragPosition = (slideIndex, type, x, y) => {
    setDragPositions(prev => ({
      ...prev,
      [`${slideIndex}-${type}`]: { x, y }
    }));
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
  const renderSlidePreview = (slideData, index, forDownload = false, isInteractive = false) => {
    const themePack = THEME_PACKS[selectedThemePack] || THEME_PACKS['modernMinimal'];
    const slideType = slideData.type;
    const isDownload = forDownload;

    // Scale factors for download vs preview
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

    // Image size for draggable objects
    const objectImgSize = isDownload ? 180 : 90;

    // Get drag position for this slide's object image
    const objectPos = dragPositions[`${index}-object`] || { x: 50, y: 15 };

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

            {/* Draggable Object Image */}
            {slideData.objectImage && (
              <div
                className={`absolute z-20 rounded-2xl bg-cover bg-center shadow-xl ${isInteractive ? 'cursor-move' : ''}`}
                data-moveable={isInteractive ? 'object' : undefined}
                style={{
                  width: objectImgSize,
                  height: objectImgSize,
                  left: `${objectPos.x}%`,
                  top: `${objectPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundImage: `url(${slideData.objectImage})`,
                  boxShadow: `0 8px 32px ${accentColor}30`
                }}
              >
                {isInteractive && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <GripVertical className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            )}

            <div className="relative z-10 px-8 py-6 flex flex-col items-center justify-center h-full w-full">
              {/* Top accent line */}
              {!slideData.objectImage && (
                <div
                  className="w-16 h-1 rounded-full mb-6"
                  style={{ background: slideData.image ? '#ffffff' : accentColor }}
                />
              )}

              {/* Main title with enhanced typography */}
              <h1
                className={`${titleSize} font-black mb-4 leading-tight tracking-tight break-keep text-balance text-center`}
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
          </>
        )}

        {/* Item/Step Slide - Card Style Design */}
        {(slideType === 'item' || slideType === 'step') && (
          <>
            <DecoGeometric color={accentColor} opacity={0.1} />
            <DecoDots color={accentColor} opacity={0.2} />

            {/* Draggable Object Image */}
            {slideData.objectImage && (
              <div
                className={`absolute z-20 rounded-xl bg-cover bg-center shadow-lg ${isInteractive ? 'cursor-move' : ''}`}
                data-moveable={isInteractive ? 'object' : undefined}
                style={{
                  width: objectImgSize * 0.7,
                  height: objectImgSize * 0.7,
                  left: `${objectPos.x}%`,
                  top: `${objectPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundImage: `url(${slideData.objectImage})`,
                  boxShadow: `0 6px 24px ${accentColor}25`
                }}
              >
                {isInteractive && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <GripVertical className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            )}

            <div className="relative z-10 px-8 py-6 flex flex-col items-center justify-center h-full w-full">
              {/* Large number badge - show when no object image */}
              {!slideData.objectImage && (
                <div
                  className={`${numberSize} rounded-2xl flex items-center justify-center font-black mb-6 shadow-lg`}
                  style={{
                    background: styles.numberBg,
                    color: styles.numberColor,
                    boxShadow: `0 8px 32px ${accentColor}30`
                  }}
                >
                  {slideData.number || index}
                </div>
              )}

              {/* Text content wrapper */}
              <div className="flex flex-col items-center text-center">
                {/* Step label for tutorial */}
                {slideType === 'step' && (
                  <div className={`${smallSize} font-bold uppercase tracking-widest mb-2`} style={{ color: accentColor }}>
                    STEP {slideData.number || index}
                  </div>
                )}

                {/* Title */}
                <h2 className={`${headingSize} font-bold mb-3 leading-tight break-keep text-balance`} style={{ color: styles.titleColor }}>
                  {slideData.itemTitle || slideData.stepTitle || '항목 제목'}
                </h2>

                {/* Accent underline */}
                <div className="w-12 h-1 rounded-full mb-4" style={{ background: accentColor }} />

                {/* Description */}
                <div className="px-6 py-3 rounded-xl max-w-[85%]" style={{ background: `${styles.highlightColor || accentColor}15` }}>
                  <p className={`${bodySize} leading-relaxed break-keep text-pretty`} style={{ color: styles.textColor }}>
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

            {/* Draggable Object Image */}
            {slideData.objectImage && (
              <div
                className={`absolute z-20 rounded-xl bg-cover bg-center shadow-lg ${isInteractive ? 'cursor-move' : ''}`}
                data-moveable={isInteractive ? 'object' : undefined}
                style={{
                  width: objectImgSize * 0.7,
                  height: objectImgSize * 0.7,
                  left: `${objectPos.x}%`,
                  top: `${objectPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundImage: `url(${slideData.objectImage})`,
                  boxShadow: `0 6px 24px ${accentColor}25`
                }}
              >
                {isInteractive && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <GripVertical className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            )}

            <div className="relative z-10 px-8 py-6 flex flex-col items-center justify-center h-full w-full">
              {/* Question mark icon - show when no object image */}
              {!slideData.objectImage && (
                <div
                  className={`${isDownload ? 'w-20 h-20 text-5xl' : 'w-12 h-12 text-2xl'} rounded-full flex items-center justify-center mb-6 font-black`}
                  style={{ background: `${accentColor}20`, color: accentColor, boxShadow: `0 0 40px ${accentColor}20` }}
                >
                  ?
                </div>
              )}

              {/* Question text */}
              <h2 className={`${headingSize} font-bold leading-snug max-w-[90%] break-keep text-balance text-center`} style={{ color: styles.titleColor }}>
                {slideData.questionText || '질문을 입력하세요'}
              </h2>

              {/* Decorative bottom element */}
              <div className="flex items-center gap-2 mt-6">
                <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                <div className="w-2 h-2 rounded-full" style={{ background: accentColor, opacity: 0.6 }} />
                <div className="w-2 h-2 rounded-full" style={{ background: accentColor, opacity: 0.3 }} />
              </div>
            </div>
          </>
        )}

        {/* Answer Slide - Reveal Design */}
        {slideType === 'answer' && (
          <>
            <DecoCorners color={accentColor} opacity={0.2} />
            <DecoLines color={accentColor} opacity={0.15} />

            {/* Draggable Object Image */}
            {slideData.objectImage && (
              <div
                className={`absolute z-20 rounded-xl bg-cover bg-center shadow-lg ${isInteractive ? 'cursor-move' : ''}`}
                data-moveable={isInteractive ? 'object' : undefined}
                style={{
                  width: objectImgSize * 0.7,
                  height: objectImgSize * 0.7,
                  left: `${objectPos.x}%`,
                  top: `${objectPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundImage: `url(${slideData.objectImage})`,
                  boxShadow: `0 6px 24px ${accentColor}25`
                }}
              >
                {isInteractive && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <GripVertical className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            )}

            <div className="relative z-10 px-8 py-6 flex flex-col items-center justify-center h-full w-full">
              {/* Lightbulb icon - show when no object image */}
              {!slideData.objectImage && (
                <div
                  className={`${isDownload ? 'w-16 h-16 text-4xl' : 'w-10 h-10 text-xl'} rounded-full flex items-center justify-center mb-5`}
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`, color: styles.numberColor || '#fff', boxShadow: `0 4px 20px ${accentColor}40` }}
                >
                  💡
                </div>
              )}

              {/* Answer label */}
              <div className={`${smallSize} font-bold uppercase tracking-widest mb-3`} style={{ color: accentColor }}>
                ANSWER
              </div>

              {/* Main answer */}
              <h2 className={`${headingSize} font-bold mb-4 leading-tight break-keep text-balance text-center`} style={{ color: styles.titleColor }}>
                {slideData.answerText || '답변'}
              </h2>

              {/* Detail with card style */}
              {slideData.answerDetail && (
                <div className="px-6 py-4 rounded-2xl max-w-[90%] border" style={{ background: `${styles.highlightColor || accentColor}10`, borderColor: `${accentColor}20` }}>
                  <p className={`${bodySize} leading-relaxed break-keep text-pretty text-center`} style={{ color: styles.textColor }}>
                    {slideData.answerDetail}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Quote Slide - Elegant Design */}
        {slideType === 'quote' && (
          <>
            <DecoFrame color={accentColor} opacity={0.1} />

            <div className="relative z-10 px-10 py-8 flex flex-col items-center justify-center h-full w-full">
              {/* Large quotation mark */}
              <div className={`${isDownload ? 'text-8xl' : 'text-5xl'} font-serif leading-none mb-2`} style={{ color: accentColor, opacity: 0.3 }}>
                "
              </div>

              {/* Quote text */}
              <p className={`${headingSize} font-medium italic leading-relaxed max-w-[85%] mb-4 break-keep text-balance text-center`} style={{ color: styles.titleColor }}>
                {slideData.quoteText || '명언을 입력하세요'}
              </p>

              {/* Author with line */}
              {slideData.quoteAuthor && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-px" style={{ background: accentColor, opacity: 0.5 }} />
                  <p className={`${smallSize} font-medium tracking-wide break-keep`} style={{ color: styles.textColor, opacity: 0.8 }}>
                    {slideData.quoteAuthor}
                  </p>
                  <div className="w-8 h-px" style={{ background: accentColor, opacity: 0.5 }} />
                </div>
              )}
            </div>
          </>
        )}

        {/* CTA Slide - Action-Oriented Design */}
        {slideType === 'cta' && (
          <>
            <DecoCircles color={styles.buttonBg} opacity={0.15} />
            <DecoGeometric color={styles.buttonBg} opacity={0.1} />

            {/* Draggable Object Image */}
            {slideData.objectImage && (
              <div
                className={`absolute z-20 rounded-xl bg-cover bg-center shadow-lg ${isInteractive ? 'cursor-move' : ''}`}
                data-moveable={isInteractive ? 'object' : undefined}
                style={{
                  width: objectImgSize * 0.7,
                  height: objectImgSize * 0.7,
                  left: `${objectPos.x}%`,
                  top: `${objectPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundImage: `url(${slideData.objectImage})`,
                  boxShadow: `0 6px 24px ${typeof styles.buttonBg === 'string' ? styles.buttonBg : '#000'}25`
                }}
              >
                {isInteractive && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <GripVertical className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            )}

            <div className="relative z-10 px-8 py-6 flex flex-col items-center justify-center h-full w-full">
              {/* Top decorative element - show when no object image */}
              {!slideData.objectImage && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full" style={{ background: styles.buttonBg }} />
                  <div className="w-6 h-1" style={{ background: styles.buttonBg }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: styles.buttonBg }} />
                </div>
              )}

              {/* CTA headline */}
              <h2
                className={`${headingSize} font-black mb-6 leading-tight break-keep text-balance text-center`}
                style={{ color: styles.titleColor, textShadow: styles.glow ? `0 0 20px ${styles.titleColor}40` : 'none' }}
              >
                {slideData.ctaText || '지금 바로 시작하세요!'}
              </h2>

              {/* CTA Button */}
              <div
                className={`${buttonPadding} rounded-full font-bold shadow-lg break-keep`}
                style={{ background: styles.buttonBg, color: styles.buttonColor, boxShadow: `0 8px 30px ${typeof styles.buttonBg === 'string' && styles.buttonBg.includes('gradient') ? 'rgba(0,0,0,0.3)' : styles.buttonBg + '50'}` }}
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
          </>
        )}

        {/* Generic fallback with improved design */}
        {!['cover', 'item', 'step', 'question', 'answer', 'quote', 'cta'].includes(slideType) && (
          <>
            <DecoCorners color={accentColor} opacity={0.15} />
            <div className="relative z-10 px-8 py-6 flex flex-col items-center justify-center h-full w-full">
              <div className={`${isDownload ? 'w-16 h-16 text-4xl' : 'w-10 h-10 text-xl'} rounded-xl flex items-center justify-center mb-4`} style={{ background: `${accentColor}20` }}>
                📝
              </div>
              <p className={`${headingSize} font-bold max-w-[85%] break-keep text-balance text-center`} style={{ color: styles.titleColor }}>
                {Object.values(slideData).find(v => typeof v === 'string' && v && v !== slideType) || `${slideType} 슬라이드`}
              </p>
            </div>
          </>
        )}

        {/* Instagram ID watermark - improved positioning */}
        {instagramId && (
          <div
            className={`absolute bottom-3 right-4 ${isDownload ? 'text-sm' : 'text-[10px]'} font-medium tracking-wide break-keep`}
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

  // Download all slides - optimized for smooth UX (sequential processing)
  const downloadAll = async () => {
    setIsDownloading(true);
    const totalSlides = Object.keys(contentData).length;
    setDownloadProgress({ current: 0, total: totalSlides });

    const zip = new JSZip();

    try {
      // Wait for fonts to be ready
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 100)); // Initial breathing time

      // Sequential processing - one slide at a time to prevent browser freeze
      for (let i = 0; i < totalSlides; i++) {
        const node = slideRefs.current[i];
        if (!node) continue;

        // Update progress BEFORE processing (shows "처리 중 1/6")
        setDownloadProgress({ current: i + 1, total: totalSlides });

        // UI breathing time - let browser render progress indicator
        await new Promise(r => setTimeout(r, 100));

        try {
          // Capture slide with pixelRatio 2 for retina/mobile display
          const dataUrl = await toPng(node, {
            quality: 1,
            pixelRatio: 2, // 2160x2160 or 2160x2700 for crisp mobile display
            cacheBust: true, // Prevent caching issues
          });

          // Convert to blob and add to ZIP
          const blob = dataURLtoBlob(dataUrl);
          zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, blob);

        } catch (err) {
          console.error(`Error capturing slide ${i + 1}:`, err);
        }

        // Additional breathing time after each capture
        await new Promise(r => setTimeout(r, 50));
      }

      // Generate ZIP file
      setDownloadProgress({ current: totalSlides, total: totalSlides, status: 'zipping' });
      await new Promise(r => setTimeout(r, 100)); // Let UI update

      const title = contentData[0]?.title || 'instaflow';
      const safeTitle = title.replace(/[^a-zA-Z0-9가-힣]/g, '_').substring(0, 30);
      const filename = `${safeTitle}_InstaFlow.zip`;

      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = filename;
      link.click();

      // Cleanup
      URL.revokeObjectURL(link.href);

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
      setPreviewIndex(0);
      setDragPositions({});
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] relative overflow-hidden">
      {/* 2025 Background - Gradient + Noise Texture */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/40 via-slate-950 to-indigo-950/30 pointer-events-none" />
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Header - Glassmorphism 2025 (Mobile Optimized) */}
      <div className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/[0.08] sticky top-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onBack}
                className="p-1.5 sm:p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg sm:rounded-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  원클릭 메이커
                </h1>
              </div>
              {/* Mobile: Mini logo */}
              <div className="sm:hidden flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-bold text-white">메이커</span>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {step === 2 && (
                <>
                  {/* Aspect ratio - hidden on mobile, shown in preview tab */}
                  <div className="hidden sm:flex gap-1 mr-2 p-1 bg-white/5 rounded-lg">
                    <button
                      onClick={() => setAspectRatio('1:1')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        aspectRatio === '1:1' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      1:1
                    </button>
                    <button
                      onClick={() => setAspectRatio('4:5')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        aspectRatio === '4:5' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      4:5
                    </button>
                  </div>
                  {/* Download Button - Compact on mobile */}
                  <button
                    onClick={downloadAll}
                    disabled={isDownloading}
                    className="group relative px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-1.5 sm:gap-2">
                      {isDownloading ? (
                        <>
                          <div className="w-3.5 sm:w-4 h-3.5 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="hidden sm:inline">
                            {downloadProgress?.status === 'zipping'
                              ? '압축 중...'
                              : `처리 중 ${downloadProgress?.current || 0}/${downloadProgress?.total || 0}`
                            }
                          </span>
                          <span className="sm:hidden">{downloadProgress?.current || 0}/{downloadProgress?.total || 0}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          <span className="hidden sm:inline">다운로드</span>
                        </>
                      )}
                    </span>
                  </button>
                </>
              )}
              <button
                onClick={handleReset}
                className="p-2 sm:p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg sm:rounded-xl transition-all"
              >
                <RotateCcw className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Step 1: Structure Selection */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">어떤 구조로 만들까요?</h2>
              <p className="text-sm sm:text-base text-white/60">목적에 맞는 카드뉴스 구조를 선택하세요</p>
            </div>

            {/* Category Filter - Horizontal scroll on mobile */}
            <div className="flex gap-2 justify-start sm:justify-center overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap hide-scrollbar">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                  categoryFilter === 'all' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                전체
              </button>
              {Object.entries(FLOW_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    categoryFilter === key ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Structure Grid - 2 cols on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4">
              {filteredStructures.map(structure => (
                <TemplatePreviewCard
                  key={structure.id}
                  structure={structure}
                  themePack={THEME_PACKS[structure.defaultTheme] || THEME_PACKS['modernMinimal']}
                  onClick={() => handleSelectStructure(structure)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Editor + Preview */}
        {step === 2 && selectedStructure && (
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-5 h-[calc(100vh-110px)] sm:h-[calc(100vh-120px)]">

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden flex items-center gap-2 mb-1">
              <button
                onClick={() => setMobileView('input')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  mobileView === 'input'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-white/5 text-white/50 border border-white/10'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                내용 입력
              </button>
              <button
                onClick={() => setMobileView('preview')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  mobileView === 'preview'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-white/50 border border-white/10'
                }`}
              >
                <Eye className="w-4 h-4" />
                미리보기
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
                  {previewIndex + 1}/{Object.keys(contentData).length}
                </span>
              </button>
            </div>

            {/* Left Panel: Input Form - Darker for contrast */}
            <div className={`bg-black/40 backdrop-blur-sm border border-white/[0.06] rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col overflow-hidden shadow-xl ${
              mobileView === 'input' ? 'flex' : 'hidden lg:flex'
            }`}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Edit3 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-400" />
                  </div>
                  <span className="hidden sm:inline">내용 입력</span>
                  <span className="sm:hidden">{selectedStructure.name}</span>
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-[10px] sm:text-xs text-white/40 hover:text-white/80 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
                >
                  <ChevronLeft className="w-3 h-3" /> <span className="hidden sm:inline">구조</span> 변경
                </button>
              </div>

              {/* Slide Forms */}
              <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 pr-1 custom-scrollbar">
                {selectedStructure.slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`p-2.5 sm:p-3 rounded-lg border transition cursor-pointer ${
                      previewIndex === index
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => { setPreviewIndex(index); }}
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

                    {/* Image Upload Section - Drop Zones */}
                    <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2">
                      {/* Background Image Drop Zone */}
                      <ImageDropZone
                        image={contentData[index]?.image}
                        onUpload={(data) => handleImageUpload(index, data)}
                        onRemove={() => removeImage(index)}
                        type="background"
                      />

                      {/* Object Image Drop Zone */}
                      <ImageDropZone
                        image={contentData[index]?.objectImage}
                        onUpload={(data) => handleObjectImageUpload(index, data)}
                        onRemove={() => removeObjectImage(index)}
                        type="object"
                      />
                    </div>

                    {/* Drag hint when object image exists */}
                    {contentData[index]?.objectImage && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-purple-300/60">
                        <GripVertical className="w-3 h-3" />
                        <span>미리보기에서 이미지를 드래그하여 위치 조정</span>
                      </div>
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

            {/* Right Panel: Theme + Preview - Lighter for contrast */}
            <div className={`bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col overflow-hidden shadow-xl flex-1 lg:flex-none ${
              mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
            }`}>
              {/* Mobile: Aspect Ratio + Theme Toggle */}
              <div className="lg:hidden flex items-center justify-between mb-3">
                {/* Aspect ratio buttons */}
                <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      aspectRatio === '1:1' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50'
                    }`}
                  >
                    1:1
                  </button>
                  <button
                    onClick={() => setAspectRatio('4:5')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      aspectRatio === '4:5' ? 'bg-white/20 text-white shadow-sm' : 'text-white/50'
                    }`}
                  >
                    4:5
                  </button>
                </div>
                {/* Theme toggle */}
                <button
                  onClick={() => setShowThemePanel(!showThemePanel)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-lg text-white/60 hover:text-white transition-all"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span className="text-xs">{THEME_PACKS[selectedThemePack]?.name}</span>
                  {showThemePanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Theme Selector - Actual Preview Cards */}
              <div className="mb-3 sm:mb-4 hidden lg:block">
                <button
                  onClick={() => setShowThemePanel(!showThemePanel)}
                  className="w-full flex items-center justify-between text-white mb-3"
                >
                  <span className="text-sm font-bold flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center">
                      <Palette className="w-3.5 h-3.5 text-pink-400" />
                    </div>
                    테마 스타일
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40">{THEME_PACKS[selectedThemePack]?.name}</span>
                    {showThemePanel ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                  </div>
                </button>

                {showThemePanel && (
                  <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                    {getThemePacksList().map(pack => (
                      <ThemePreviewCard
                        key={pack.id}
                        themePack={pack}
                        isSelected={selectedThemePack === pack.id}
                        onClick={() => setSelectedThemePack(pack.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Theme Panel - Horizontal scroll */}
              {showThemePanel && (
                <div className="lg:hidden mb-3 -mx-3 px-3">
                  <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {getThemePacksList().map(pack => (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedThemePack(pack.id)}
                        className={`flex-shrink-0 w-14 rounded-lg overflow-hidden transition-all ${
                          selectedThemePack === pack.id
                            ? 'ring-2 ring-purple-500 ring-offset-1 ring-offset-black scale-105'
                            : 'opacity-70'
                        }`}
                      >
                        <div
                          className="aspect-[4/5] w-full"
                          style={{ background: pack.cover.background }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <div
                              className="text-[6px] font-bold text-center px-1 break-keep"
                              style={{ color: pack.cover.titleColor }}
                            >
                              {pack.name}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Desktop Header */}
                <div className="hidden lg:flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    미리보기
                  </span>
                  <div className="flex items-center gap-2">
                    {contentData[previewIndex]?.objectImage && (
                      <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                        드래그로 이동
                      </span>
                    )}
                    <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                      {previewIndex + 1} / {Object.keys(contentData).length}
                    </span>
                  </div>
                </div>

                {/* Main Preview - Responsive Size */}
                <div className="flex-1 flex items-center justify-center py-2 min-h-0">
                  <div className="relative w-full flex items-center justify-center">
                    {/* Preview container with shadow - responsive sizing */}
                    <div
                      ref={moveableRef}
                      className="rounded-lg overflow-hidden bg-zinc-900 relative shadow-2xl shadow-black/50 ring-1 ring-white/10 max-w-full"
                      style={{
                        width: 'min(324px, calc(100vw - 48px))',
                        aspectRatio: aspectRatio === '1:1' ? '1/1' : '4/5'
                      }}
                      onMouseMove={(e) => {
                        if (!contentData[previewIndex]?.objectImage) return;
                        const target = e.currentTarget.querySelector('[data-moveable="object"]');
                        if (target && e.buttons === 1) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = ((e.clientX - rect.left) / rect.width) * 100;
                          const y = ((e.clientY - rect.top) / rect.height) * 100;
                          updateDragPosition(previewIndex, 'object', Math.max(10, Math.min(90, x)), Math.max(10, Math.min(90, y)));
                        }
                      }}
                      onTouchMove={(e) => {
                        if (!contentData[previewIndex]?.objectImage) return;
                        const touch = e.touches[0];
                        if (touch) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = ((touch.clientX - rect.left) / rect.width) * 100;
                          const y = ((touch.clientY - rect.top) / rect.height) * 100;
                          updateDragPosition(previewIndex, 'object', Math.max(10, Math.min(90, x)), Math.max(10, Math.min(90, y)));
                        }
                      }}
                    >
                      {contentData[previewIndex] && renderSlidePreview(contentData[previewIndex], previewIndex, false, true)}
                    </div>

                    {/* Size indicator - Desktop only */}
                    <div className="hidden sm:block absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/30">
                      {aspectRatio === '1:1' ? '1080 × 1080' : '1080 × 1350'} px
                    </div>
                  </div>
                </div>

                {/* Slide Navigator - Mobile optimized */}
                <div className="flex items-center justify-center gap-3 sm:gap-2 mt-2 sm:mt-3">
                  <button
                    onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                    disabled={previewIndex === 0}
                    className="p-2 sm:p-1 text-white/50 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft className="w-6 sm:w-5 h-6 sm:h-5" />
                  </button>
                  <div className="flex gap-1.5 sm:gap-1">
                    {Object.keys(contentData).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPreviewIndex(i)}
                        className={`w-2.5 sm:w-2 h-2.5 sm:h-2 rounded-full transition ${
                          previewIndex === i ? 'bg-purple-500' : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setPreviewIndex(Math.min(Object.keys(contentData).length - 1, previewIndex + 1))}
                    disabled={previewIndex === Object.keys(contentData).length - 1}
                    className="p-2 sm:p-1 text-white/50 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <ChevronRight className="w-6 sm:w-5 h-6 sm:h-5" />
                  </button>
                </div>

                {/* Mini Thumbnails - Horizontal scroll */}
                <div className="flex gap-1.5 sm:gap-1.5 mt-2 sm:mt-3 overflow-x-auto pb-2 sm:pb-1 px-1 -mx-1 hide-scrollbar">
                  {Object.entries(contentData).map(([idx, data]) => {
                    const themePack = THEME_PACKS[selectedThemePack] || THEME_PACKS['modernMinimal'];
                    return (
                      <button
                        key={idx}
                        onClick={() => setPreviewIndex(parseInt(idx))}
                        className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                          previewIndex === parseInt(idx)
                            ? 'ring-2 ring-purple-500 ring-offset-1 ring-offset-black scale-105'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          width: '40px',
                          aspectRatio: aspectRatio === '1:1' ? '1/1' : '4/5'
                        }}
                      >
                        <MiniSlidePreview
                          slideData={data}
                          themePack={themePack}
                          aspectRatio={aspectRatio}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Mobile: Quick edit current slide button */}
                <div className="lg:hidden mt-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setMobileView('input')}
                    className="w-full py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    슬라이드 {previewIndex + 1} 편집하기
                  </button>
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

    </div>
  );
}
