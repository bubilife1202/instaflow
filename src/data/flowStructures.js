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
    defaultTheme: 'vibrantGradient',
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
    },
    exampleContent: [
      { type: 'cover', title: '직장인 필수 앱 TOP 4', subtitle: '생산성 200% 올려주는 앱 모음' },
      { type: 'item', number: 1, itemTitle: 'Notion', itemDescription: '메모, 문서, 프로젝트 관리를 한 곳에서 완벽하게' },
      { type: 'item', number: 2, itemTitle: 'Slack', itemDescription: '팀 커뮤니케이션의 표준, 실시간 협업 필수템' },
      { type: 'item', number: 3, itemTitle: 'Figma', itemDescription: '디자인부터 프로토타입까지 실시간 협업 가능' },
      { type: 'item', number: 4, itemTitle: 'Todoist', itemDescription: '할 일 관리의 끝판왕, 심플하지만 강력해요' },
      { type: 'cta', ctaText: '더 많은 생산성 팁이 궁금하다면?', ctaAction: '팔로우하기' }
    ]
  },

  'top5List': {
    id: 'top5List',
    name: 'Top 5 리스트',
    icon: '🥇',
    description: '5가지 핵심 포인트를 전달하는 구조',
    category: 'info',
    tags: ['리스트', '순위', '꿀팁', 'TOP5'],
    defaultTheme: 'oceanBlue',
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
    },
    exampleContent: [
      { type: 'cover', title: '아침 루틴 꿀팁 TOP 5', subtitle: '성공한 사람들의 공통 습관' },
      { type: 'item', number: 1, itemTitle: '기상 직후 물 마시기', itemDescription: '잠든 동안 빠진 수분 보충, 신진대사 활성화' },
      { type: 'item', number: 2, itemTitle: '10분 스트레칭', itemDescription: '굳은 몸을 풀어주고 하루 에너지 충전' },
      { type: 'item', number: 3, itemTitle: '오늘 할 일 3개 적기', itemDescription: '우선순위 정하고 집중력 높이기' },
      { type: 'item', number: 4, itemTitle: '건강한 아침 식사', itemDescription: '단백질 위주로 오전 집중력 유지' },
      { type: 'item', number: 5, itemTitle: '5분 명상', itemDescription: '마음 정리하고 하루를 차분하게 시작' },
      { type: 'cta', ctaText: '당신의 아침을 바꿔보세요!', ctaAction: '저장하기' }
    ]
  },

  'qna': {
    id: 'qna',
    name: 'Q&A형',
    icon: '❓',
    description: '질문과 답변 형식으로 정보 전달',
    category: 'quiz',
    tags: ['질문', '답변', 'QnA', '문답'],
    defaultTheme: 'softPastel',
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
    },
    exampleContent: [
      { type: 'cover', title: '자주 묻는 질문 Q&A', subtitle: '궁금증 한 번에 해결!' },
      { type: 'question', questionText: '하루에 물 얼마나 마셔야 하나요?' },
      { type: 'answer', answerText: '체중 1kg당 30ml', answerDetail: '60kg 기준 약 1.8L, 개인차가 있으니 목마를 때 마시세요' },
      { type: 'question', questionText: '운동은 아침 vs 저녁 언제가 좋아요?' },
      { type: 'answer', answerText: '본인에게 맞는 시간이 최고!', answerDetail: '아침: 신진대사 활성화 / 저녁: 스트레스 해소에 좋아요' },
      { type: 'cta', ctaText: '더 많은 건강 정보 원한다면?', ctaAction: '팔로우' }
    ]
  },

  'storytelling': {
    id: 'storytelling',
    name: '스토리텔링형',
    icon: '📖',
    description: '이야기 흐름으로 몰입감 있게 전달',
    category: 'essay',
    tags: ['스토리', '감성', '에세이', '일상'],
    defaultTheme: 'warmSunset',
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
    },
    exampleContent: [
      { type: 'cover', title: '퇴사 후 1년', subtitle: '회사를 나온 내가 배운 것들' },
      { type: 'intro', introText: '1년 전, 나는 7년 다니던 회사를 나왔다. 주변의 만류에도 불구하고.' },
      { type: 'body', bodyText: '처음 3개월은 정말 힘들었다. 월급 없는 삶, 매일 찾아오는 불안감...' },
      { type: 'body', bodyText: '하지만 6개월 쯤 지나니 깨달았다. 내가 원하는 삶이 뭔지, 진짜 하고 싶은 게 뭔지.' },
      { type: 'climax', climaxText: '지금 나는 좋아하는 일을 하며 산다', climaxHighlight: '후회 없는 선택이었다' },
      { type: 'cta', ctaText: '당신의 용기를 응원합니다', ctaAction: '공감하면 저장' }
    ]
  },

  'tutorial': {
    id: 'tutorial',
    name: '튜토리얼형',
    icon: '📚',
    description: '단계별로 방법을 알려주는 구조',
    category: 'info',
    tags: ['튜토리얼', '가이드', '방법', 'HOW-TO'],
    defaultTheme: 'techDark',
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
    },
    exampleContent: [
      { type: 'cover', title: 'ChatGPT 제대로 쓰는 법', subtitle: '업무 효율 10배 높이는 프롬프트' },
      { type: 'step', number: 1, stepTitle: '역할 부여하기', stepDescription: '"너는 마케팅 전문가야"처럼 AI에게 역할을 먼저 정해줘요' },
      { type: 'step', number: 2, stepTitle: '구체적으로 요청하기', stepDescription: '"블로그 글 써줘" 대신 "20대 여성 대상 500자 블로그 작성"' },
      { type: 'step', number: 3, stepTitle: '예시 제공하기', stepDescription: '원하는 결과물의 예시를 함께 보여주면 정확도 UP' },
      { type: 'step', number: 4, stepTitle: '피드백 주기', stepDescription: '"더 짧게", "더 친근하게" 등 계속 수정 요청하세요' },
      { type: 'cta', ctaText: 'AI 활용 팁 더 보기', ctaAction: '팔로우하기' }
    ]
  },

  'beforeAfter': {
    id: 'beforeAfter',
    name: '비포/애프터형',
    icon: '🔄',
    description: '변화 전후를 비교하는 구조',
    category: 'promo',
    tags: ['비교', '변화', '결과', '후기'],
    defaultTheme: 'boldMagazine',
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
    },
    exampleContent: [
      { type: 'cover', title: '책상 정리 프로젝트', subtitle: '어지러운 책상이 이렇게 변했어요' },
      { type: 'before', beforeTitle: 'BEFORE', beforeDescription: '서류 더미, 케이블 엉킴, 찾을 수 없는 펜...' },
      { type: 'process', processText: '주말 3시간 투자! 버릴 건 버리고, 정리함 구매, 케이블 정리' },
      { type: 'after', afterTitle: 'AFTER', afterDescription: '깔끔한 미니멀 데스크 완성! 집중력이 달라졌어요' },
      { type: 'result', resultText: '업무 효율 50% 상승', resultHighlight: '정리된 공간 = 정리된 생각' },
      { type: 'cta', ctaText: '정리 꿀팁 더 보러가기', ctaAction: '프로필 링크' }
    ]
  },

  'eventPromo': {
    id: 'eventPromo',
    name: '이벤트 홍보형',
    icon: '🎉',
    description: '이벤트나 프로모션 홍보에 최적화',
    category: 'promo',
    tags: ['이벤트', '할인', '프로모션', '홍보'],
    defaultTheme: 'neonPunk',
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
    },
    exampleContent: [
      { type: 'cover', title: '🎁 신규 가입 이벤트', subtitle: '지금 가입하면 혜택 폭발!' },
      { type: 'benefit', benefitTitle: '가입만 해도 받는 혜택', benefitList: '✓ 5,000원 할인 쿠폰\n✓ 무료 배송 3회\n✓ VIP 등급 1개월' },
      { type: 'detail', detailText: '기간: 12/1 ~ 12/31\n대상: 신규 가입 회원 전원\n중복 사용 가능!' },
      { type: 'howto', howtoSteps: '1. 회원가입\n2. 이벤트 페이지 접속\n3. 쿠폰 다운로드\n끝!' },
      { type: 'cta', ctaText: '선착순 1000명 마감 임박!', ctaAction: '지금 가입하기' }
    ]
  },

  'productReview': {
    id: 'productReview',
    name: '제품 리뷰형',
    icon: '⭐',
    description: '제품이나 서비스 리뷰에 적합',
    category: 'info',
    tags: ['리뷰', '후기', '제품', '평가'],
    defaultTheme: 'modernMinimal',
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
    },
    exampleContent: [
      { type: 'cover', title: '에어팟 프로 2 솔직 리뷰', subtitle: '3개월 사용 후기' },
      { type: 'intro', introText: '첫인상은 "와, 노이즈 캔슬링 진짜 좋아졌다!" 전작 대비 확실히 개선됨' },
      { type: 'specs', specList: '✓ 노이즈 캔슬링 2배 향상\n✓ 적응형 오디오 신기능\n✓ 배터리 6시간 (케이스 30시간)' },
      { type: 'pros', prosList: '👍 압도적인 노캔 성능\n👍 통화 품질 대폭 개선\n👍 애플 생태계 연동 최고' },
      { type: 'cons', consList: '👎 가격이 비쌈 (35만원대)\n👎 안드로이드는 기능 제한\n👎 케이스 스크래치 잘남' },
      { type: 'verdict', rating: '⭐ 4.5/5', verdictText: '애플 유저라면 무조건 추천! 가성비보다 품질 원하는 분께' }
    ]
  },

  'quiz': {
    id: 'quiz',
    name: '퀴즈형',
    icon: '🧩',
    description: '퀴즈로 참여를 유도하는 구조',
    category: 'quiz',
    tags: ['퀴즈', '참여', '재미', '테스트'],
    defaultTheme: 'vibrantGradient',
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
    },
    exampleContent: [
      { type: 'cover', title: '상식 퀴즈 타임!', subtitle: '맞히면 천재 인정' },
      { type: 'question', questionText: '세계에서 가장 긴 강은?' },
      { type: 'hint', hintText: '힌트: 아프리카에 있어요 🌍' },
      { type: 'answer', answerText: '정답: 나일강!', answerDetail: '총 길이 6,650km로 세계 1위' },
      { type: 'explanation', explanationText: '2위는 아마존강(6,400km), 나일강은 11개국을 지나요' },
      { type: 'cta', ctaText: '맞았으면 천재 인증 댓글!', ctaAction: '저장하기' }
    ]
  },

  'motivation': {
    id: 'motivation',
    name: '동기부여형',
    icon: '💪',
    description: '동기부여와 영감을 주는 구조',
    category: 'essay',
    tags: ['동기부여', '명언', '영감', '힐링'],
    defaultTheme: 'luxuryGold',
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
    },
    exampleContent: [
      { type: 'cover', title: '오늘 지친 당신에게', subtitle: '마음에 새길 한 마디' },
      { type: 'quote', quoteText: '실패는 성공의 어머니가 아니라, 성공의 선생님이다', quoteAuthor: '- 무명' },
      { type: 'quote', quoteText: '오늘 할 수 있는 일을 내일로 미루지 마라', quoteAuthor: '- 벤자민 프랭클린' },
      { type: 'insight', insightText: '완벽한 때는 없습니다. 지금이 가장 빠른 시작점이에요.' },
      { type: 'action', actionList: '✓ 작은 것부터 시작하기\n✓ 매일 1%씩 성장하기\n✓ 실패를 두려워하지 않기' },
      { type: 'cta', ctaText: '힘이 됐다면 저장해두세요', ctaAction: '저장하기' }
    ]
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
