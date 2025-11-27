/**
 * Gemini AI Service - Client-side AI integration
 * Uses Gemini 2.0 Flash for title suggestions and content generation
 * No server required - API calls made directly from browser
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// LocalStorage key for API key
const API_KEY_STORAGE = 'instaflow_gemini_api_key';

/**
 * Get stored API key
 */
export const getApiKey = () => {
  return localStorage.getItem(API_KEY_STORAGE) || '';
};

/**
 * Save API key
 */
export const saveApiKey = (key) => {
  localStorage.setItem(API_KEY_STORAGE, key);
};

/**
 * Check if API key is configured
 */
export const hasApiKey = () => {
  return !!getApiKey();
};

/**
 * Call Gemini API
 */
const callGemini = async (prompt, apiKey) => {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API 호출 실패');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

/**
 * Generate catchy titles based on topic
 */
export const generateTitles = async (topic, style = 'general') => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  const styleGuides = {
    general: '일반적인 관심을 끄는',
    curiosity: '궁금증을 유발하는',
    howto: '방법을 알려주는',
    list: '리스트 형태의',
    emotional: '감성적인',
    urgent: '긴급하고 중요한'
  };

  const prompt = `당신은 인스타그램 카드뉴스 전문 카피라이터입니다.
다음 주제에 대해 ${styleGuides[style] || styleGuides.general} 제목 5개를 추천해주세요.

주제: ${topic}

요구사항:
1. 조회수가 높아지는 제목 패턴 사용 (예: "~하는 방법 Top 5", "절대 하지 말아야 할 3가지", "~해서 성공한 사람들의 비밀")
2. 이모지를 적절히 사용
3. 호기심을 자극하는 표현
4. 15자 내외의 간결한 제목
5. 한국어로 작성

JSON 형식으로만 응답해주세요:
{"titles": ["제목1", "제목2", "제목3", "제목4", "제목5"]}`;

  const response = await callGemini(prompt, apiKey);

  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.titles || [];
    }
  } catch (e) {
    // If JSON parsing fails, extract titles manually
    const lines = response.split('\n').filter(line => line.trim());
    return lines.slice(0, 5).map(line => line.replace(/^[\d\.\-\*]+\s*/, '').trim());
  }

  return [];
};

/**
 * Generate content for a specific slide type
 */
export const generateSlideContent = async (topic, slideType, context = {}) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  const slidePrompts = {
    cover: `표지 슬라이드를 위한 메인 타이틀과 서브 타이틀을 작성해주세요.
JSON: {"title": "메인제목", "subtitle": "서브제목"}`,

    item: `리스트 항목 ${context.number || 1}을 위한 제목과 설명을 작성해주세요.
JSON: {"itemTitle": "항목제목", "itemDescription": "간단한 설명 (1-2문장)"}`,

    question: `흥미로운 질문을 작성해주세요.
JSON: {"questionText": "질문 내용"}`,

    answer: `질문에 대한 답변을 작성해주세요.
JSON: {"answerText": "핵심 답변", "answerDetail": "추가 설명"}`,

    cta: `마지막 CTA 슬라이드를 위한 문구를 작성해주세요.
JSON: {"ctaText": "행동 유도 문구", "ctaAction": "팔로우/저장/공유 등"}`,

    step: `STEP ${context.number || 1}을 위한 내용을 작성해주세요.
JSON: {"stepTitle": "단계 제목", "stepDescription": "상세 설명"}`,

    quote: `영감을 주는 명언이나 인용구를 작성해주세요.
JSON: {"quoteText": "명언 내용", "quoteAuthor": "출처 (선택적)"}`,
  };

  const prompt = `당신은 인스타그램 카드뉴스 전문 콘텐츠 작성자입니다.

주제: ${topic}
슬라이드 타입: ${slideType}

${slidePrompts[slideType] || '적절한 내용을 작성해주세요.'}

요구사항:
- 간결하고 임팩트 있게
- 이모지 적절히 사용
- 한국어로 작성
- JSON 형식으로만 응답`;

  const response = await callGemini(prompt, apiKey);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('JSON parsing error:', e);
  }

  return null;
};

/**
 * Generate complete content for all slides
 */
export const generateFullContent = async (topic, structure) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  const slideDescriptions = structure.slides.map((slide, i) =>
    `${i + 1}. ${slide.label} (타입: ${slide.type})`
  ).join('\n');

  const prompt = `당신은 인스타그램 카드뉴스 전문 콘텐츠 작성자입니다.

주제: ${topic}
구조: ${structure.name}

슬라이드 구성:
${slideDescriptions}

각 슬라이드에 들어갈 내용을 작성해주세요.

요구사항:
1. 각 슬라이드는 간결하게 (제목 15자 이내, 설명 30자 이내)
2. 이모지를 적절히 사용
3. 일관된 톤앤매너 유지
4. 마지막 CTA는 행동을 유도하는 문구

JSON 배열 형식으로 응답:
[
  {"type": "cover", "title": "제목", "subtitle": "부제"},
  {"type": "item", "number": 1, "itemTitle": "항목1", "itemDescription": "설명"},
  ...
]`;

  const response = await callGemini(prompt, apiKey);

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('JSON parsing error:', e);
  }

  return null;
};

/**
 * Trending title patterns
 */
export const TITLE_PATTERNS = [
  { pattern: '~하는 방법 Top N', example: '살 빼는 방법 Top 5', category: 'howto' },
  { pattern: '절대 하지 말아야 할 N가지', example: '다이어트할 때 절대 하면 안되는 3가지', category: 'warning' },
  { pattern: 'N초만에 ~하기', example: '3초만에 눈 커지는 법', category: 'quick' },
  { pattern: '~하면 생기는 변화', example: '아침에 물 마시면 생기는 변화', category: 'result' },
  { pattern: '~인 사람 특징', example: '성공하는 사람 특징', category: 'traits' },
  { pattern: '~vs~', example: '아침운동 vs 저녁운동', category: 'comparison' },
  { pattern: '~했더니 결과가...', example: '30일 플랭크 했더니 결과가...', category: 'experience' },
  { pattern: '알면 인생이 바뀌는 ~', example: '알면 인생이 바뀌는 시간관리법', category: 'lifechanging' },
];

/**
 * Get title suggestions based on pattern
 */
export const getTitleSuggestions = (topic) => {
  return TITLE_PATTERNS.map(p => ({
    ...p,
    suggestion: p.pattern.replace('~', topic).replace('N', '5')
  }));
};
