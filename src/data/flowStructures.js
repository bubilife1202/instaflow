/**
 * Flow Structures - Predefined card news structures
 * Each structure defines the slide layout and input fields
 */

export const FLOW_STRUCTURES = {
  'top4List': {
    id: 'top4List',
    name: 'Top 4 리스트',
    icon: '🏆',
    description: '인기 있는 4가지 항목을 소개하는 구조',
    category: 'info',
    tags: ['리스트', '순위', '추천', 'TOP'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'item', label: '항목 1', number: 1 },
      { type: 'item', label: '항목 2', number: 2 },
      { type: 'item', label: '항목 3', number: 3 },
      { type: 'item', label: '항목 4', number: 4 },
      { type: 'cta', label: 'CTA (마무리)' }
    ],
    fields: {
      cover: ['title', 'subtitle'],
      item: ['itemTitle', 'itemDescription'],
      cta: ['ctaText', 'ctaAction']
    }
  },

  'top5List': {
    id: 'top5List',
    name: 'Top 5 리스트',
    icon: '🥇',
    description: '5가지 핵심 포인트를 전달하는 구조',
    category: 'info',
    tags: ['리스트', '순위', '꿀팁', 'TOP5'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'item', label: '항목 1', number: 1 },
      { type: 'item', label: '항목 2', number: 2 },
      { type: 'item', label: '항목 3', number: 3 },
      { type: 'item', label: '항목 4', number: 4 },
      { type: 'item', label: '항목 5', number: 5 },
      { type: 'cta', label: 'CTA (마무리)' }
    ],
    fields: {
      cover: ['title', 'subtitle'],
      item: ['itemTitle', 'itemDescription'],
      cta: ['ctaText', 'ctaAction']
    }
  },

  'qna': {
    id: 'qna',
    name: 'Q&A형',
    icon: '❓',
    description: '질문과 답변 형식으로 정보 전달',
    category: 'quiz',
    tags: ['질문', '답변', 'QnA', '문답'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'question', label: '질문 1' },
      { type: 'answer', label: '답변 1' },
      { type: 'question', label: '질문 2' },
      { type: 'answer', label: '답변 2' },
      { type: 'cta', label: 'CTA (마무리)' }
    ],
    fields: {
      cover: ['title', 'subtitle'],
      question: ['questionText'],
      answer: ['answerText', 'answerDetail'],
      cta: ['ctaText', 'ctaAction']
    }
  },

  'storytelling': {
    id: 'storytelling',
    name: '스토리텔링형',
    icon: '📖',
    description: '이야기 흐름으로 몰입감 있게 전달',
    category: 'essay',
    tags: ['스토리', '감성', '에세이', '일상'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'intro', label: '도입' },
      { type: 'body', label: '전개 1' },
      { type: 'body', label: '전개 2' },
      { type: 'climax', label: '클라이맥스' },
      { type: 'cta', label: 'CTA (마무리)' }
    ],
    fields: {
      cover: ['title', 'subtitle'],
      intro: ['introText'],
      body: ['bodyText'],
      climax: ['climaxText', 'climaxHighlight'],
      cta: ['ctaText', 'ctaAction']
    }
  },

  'tutorial': {
    id: 'tutorial',
    name: '튜토리얼형',
    icon: '📚',
    description: '단계별로 방법을 알려주는 구조',
    category: 'info',
    tags: ['튜토리얼', '가이드', '방법', 'HOW-TO'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'step', label: 'STEP 1', number: 1 },
      { type: 'step', label: 'STEP 2', number: 2 },
      { type: 'step', label: 'STEP 3', number: 3 },
      { type: 'step', label: 'STEP 4', number: 4 },
      { type: 'cta', label: 'CTA (마무리)' }
    ],
    fields: {
      cover: ['title', 'subtitle'],
      step: ['stepTitle', 'stepDescription'],
      cta: ['ctaText', 'ctaAction']
    }
  },

  'beforeAfter': {
    id: 'beforeAfter',
    name: '비포/애프터형',
    icon: '🔄',
    description: '변화 전후를 비교하는 구조',
    category: 'promo',
    tags: ['비교', '변화', '결과', '후기'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'before', label: 'BEFORE' },
      { type: 'process', label: '과정' },
      { type: 'after', label: 'AFTER' },
      { type: 'result', label: '결과 정리' },
      { type: 'cta', label: 'CTA (마무리)' }
    ],
    fields: {
      cover: ['title', 'subtitle'],
      before: ['beforeTitle', 'beforeDescription'],
      process: ['processText'],
      after: ['afterTitle', 'afterDescription'],
      result: ['resultText', 'resultHighlight'],
      cta: ['ctaText', 'ctaAction']
    }
  },

  'eventPromo': {
    id: 'eventPromo',
    name: '이벤트 홍보형',
    icon: '🎉',
    description: '이벤트나 프로모션 홍보에 최적화',
    category: 'promo',
    tags: ['이벤트', '할인', '프로모션', '홍보'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'benefit', label: '혜택 안내' },
      { type: 'detail', label: '상세 내용' },
      { type: 'howto', label: '참여 방법' },
      { type: 'cta', label: 'CTA (마무리)' }
    ],
    fields: {
      cover: ['title', 'subtitle', 'eventDate'],
      benefit: ['benefitTitle', 'benefitList'],
      detail: ['detailText'],
      howto: ['howtoSteps'],
      cta: ['ctaText', 'ctaAction']
    }
  },

  'productReview': {
    id: 'productReview',
    name: '제품 리뷰형',
    icon: '⭐',
    description: '제품이나 서비스 리뷰에 적합',
    category: 'info',
    tags: ['리뷰', '후기', '제품', '평가'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'intro', label: '첫인상' },
      { type: 'specs', label: '스펙/특징' },
      { type: 'pros', label: '장점' },
      { type: 'cons', label: '단점' },
      { type: 'verdict', label: '총평' }
    ],
    fields: {
      cover: ['title', 'subtitle'],
      intro: ['introText'],
      specs: ['specList'],
      pros: ['prosList'],
      cons: ['consList'],
      verdict: ['rating', 'verdictText']
    }
  },

  'quiz': {
    id: 'quiz',
    name: '퀴즈형',
    icon: '🧩',
    description: '퀴즈로 참여를 유도하는 구조',
    category: 'quiz',
    tags: ['퀴즈', '참여', '재미', '테스트'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'question', label: '문제' },
      { type: 'hint', label: '힌트' },
      { type: 'answer', label: '정답 공개' },
      { type: 'explanation', label: '해설' },
      { type: 'cta', label: 'CTA (마무리)' }
    ],
    fields: {
      cover: ['title', 'subtitle'],
      question: ['questionText', 'options'],
      hint: ['hintText'],
      answer: ['answerText'],
      explanation: ['explanationText'],
      cta: ['ctaText', 'ctaAction']
    }
  },

  'motivation': {
    id: 'motivation',
    name: '동기부여형',
    icon: '💪',
    description: '동기부여와 영감을 주는 구조',
    category: 'essay',
    tags: ['동기부여', '명언', '영감', '힐링'],
    slides: [
      { type: 'cover', label: '표지' },
      { type: 'quote', label: '명언 1' },
      { type: 'quote', label: '명언 2' },
      { type: 'insight', label: '인사이트' },
      { type: 'action', label: '실천 방법' },
      { type: 'cta', label: 'CTA (마무리)' }
    ],
    fields: {
      cover: ['title', 'subtitle'],
      quote: ['quoteText', 'quoteAuthor'],
      insight: ['insightText'],
      action: ['actionList'],
      cta: ['ctaText', 'ctaAction']
    }
  }
};

/**
 * Flow categories for filtering
 */
export const FLOW_CATEGORIES = {
  info: { name: '📰 정보 전달형', description: '유용한 정보와 지식을 전달' },
  essay: { name: '✨ 감성/에세이형', description: '감성적인 이야기와 일상' },
  promo: { name: '🎉 홍보/이벤트형', description: '제품, 서비스, 이벤트 홍보' },
  quiz: { name: '❓ 퀴즈/참여형', description: '퀴즈와 참여를 유도' }
};

/**
 * Get all flow structures
 */
export const getFlowStructuresList = () => {
  return Object.values(FLOW_STRUCTURES);
};

/**
 * Get structures by category
 */
export const getFlowStructuresByCategory = (category) => {
  return Object.values(FLOW_STRUCTURES).filter(s => s.category === category);
};

/**
 * Search structures by tag
 */
export const searchFlowStructuresByTag = (tag) => {
  const lowerTag = tag.toLowerCase();
  return Object.values(FLOW_STRUCTURES).filter(s =>
    s.tags.some(t => t.toLowerCase().includes(lowerTag))
  );
};

/**
 * Get structure by id
 */
export const getFlowStructure = (id) => {
  return FLOW_STRUCTURES[id] || null;
};
