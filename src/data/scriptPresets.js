/**
 * Script Presets - Content-only templates
 * Pure markdown content without design elements
 */

export const SCRIPT_PRESETS = {
  // Tutorial (Default)
  'tutorial': {
    id: 'tutorial',
    title: '📚 InstaFlow 사용법',
    category: 'info',
    description: '처음 사용하는 분들을 위한 가이드',
    content: `# InstaFlow 사용법
## 카드뉴스 3분만에 만들기
---
# STEP 1: 텍스트 작성
왼쪽 에디터에서
*마크다운 문법*으로 작성하세요
---
# 문법 예시
제목::# 큰 제목
부제목::## 작은 제목
강조::*하이라이트* **굵게**
구분::--- (슬라이드 구분)
---
# STEP 2: 디자인 선택
> 테마를 바꿔보세요
> 배경 이미지도 추가 가능
**실시간 미리보기**로 확인하세요
---
# STEP 3: 다운로드
모든 슬라이드가
**고해상도 이미지**로
자동 생성됩니다
---
# 시작해볼까요?
템플릿을 선택하거나
*AI 도우미*를 써보세요!`
  },

  // News/Information
  'newsUpdate': {
    id: 'newsUpdate',
    title: '📰 뉴스/정보 전달',
    category: 'info',
    description: '중요한 정보를 전달할 때',
    content: `# 중요 공지사항
## 2024년 12월 업데이트
---
# 무엇이 바뀌나요?
주요 변경사항을
알려드립니다
---
# 변경 내용
항목1::기능 개선
항목2::버그 수정
항목3::성능 향상
일시::12월 15일
---
> 자세한 내용은
> 공식 블로그를 확인하세요
**지금 바로 업데이트하세요**
---
# 문의하기
이메일: info@example.com
전화: 1234-5678`
  },

  // Emotional Essay
  'diary': {
    id: 'diary',
    title: '✨ 일상 기록/에세이',
    category: 'essay',
    description: '감성적인 일상 이야기',
    content: `# 오늘의 기록
## 소소한 일상
---
> 아침 커피 한 잔
창밖을 바라보며
생각에 잠기다
---
# 작은 행복
매일 반복되는 일상 속에서
*특별한 순간*을 찾아내는 것
---
> 천천히, 그러나 꾸준히
**나만의 속도**로
---
# 감사한 하루
오늘도 무사히
하루를 마무리합니다`
  },

  // Event Promotion
  'eventPromo': {
    id: 'eventPromo',
    title: '🎉 이벤트/프로모션',
    category: 'promo',
    description: '이벤트나 할인 행사 홍보',
    content: `# 특별 이벤트
## 선착순 100명
---
# 혜택 안내
할인율::30% OFF
기간::12/1 - 12/31
대상::전 상품
조건::회원 가입 시
---
> 지금 바로 참여하세요
*이번 기회를 놓치지 마세요*
---
# 참여 방법
1. 좋아요 누르기
2. 댓글 남기기
3. 친구 태그하기
---
# 당첨 발표
추첨::1월 5일
경품::상품권 5만원
인원::10명`
  },

  // Q&A / Quiz
  'quiz': {
    id: 'quiz',
    title: '❓ 퀴즈/문답',
    category: 'quiz',
    description: '재미있는 퀴즈나 Q&A',
    content: `# 오늘의 퀴즈
## 당신은 얼마나 알고 있나요?
---
# 문제 1
> 다음 중 맞는 것은?
선택지를 골라보세요
---
# 힌트
생각::천천히 생각해보세요
시간::제한 없음
---
> 정답은?
**다음 슬라이드에서 확인!**
---
# 정답 공개
정답::3번
해설::왜냐하면...
---
# 결과
축하합니다!
*다음 퀴즈도 기대하세요*`
  },

  // Tips & Tricks
  'lifeTips': {
    id: 'lifeTips',
    title: '💡 생활 꿀팁',
    category: 'info',
    description: '유용한 생활 정보 공유',
    content: `# 알아두면 유용한 꿀팁
## Top 5
---
# TIP 1: 시간 관리
> 아침 30분 일찍 일어나기
**하루가 달라집니다**
---
# TIP 2: 건강
물::하루 2리터
운동::매일 10분
수면::7시간 이상
---
# TIP 3: 생산성
> 포모도로 기법 활용
*25분 집중, 5분 휴식*
---
# TIP 4: 정리
**매일 5분 정리**로
깔끔한 공간 유지
---
# TIP 5: 습관
> 작은 것부터 시작하세요
*꾸준함이 힘입니다*`
  },

  // Product Review
  'review': {
    id: 'review',
    title: '⭐ 제품 리뷰',
    category: 'info',
    description: '제품 사용 후기 및 평가',
    content: `# 제품 리뷰
## 솔직한 사용 후기
---
# 첫인상
> 디자인이 정말 예쁘다
**포장부터 고급스러워요**
---
# 상세 스펙
가격::₩99,000
색상::3가지
무게::500g
배송::무료
---
# 장점
✓ 가성비 좋음
✓ 디자인 우수
✓ 사용 간편
---
# 단점
× 약간 무거움
× 색상 선택 제한
---
# 총평
만족도::★★★★☆
추천::강력 추천
재구매::의향 있음`
  },

  // Motivation
  'motivation': {
    id: 'motivation',
    title: '💪 동기부여/명언',
    category: 'essay',
    description: '힘이 되는 글귀',
    content: `# 오늘의 다짐
## 나를 위한 한마디
---
> 시작이 반이다
---
> 완벽하지 않아도 괜찮아
**진보가 중요해**
---
# 기억하세요
포기::하지 않기
노력::꾸준히
믿음::나 자신을
---
> 작은 발걸음도
> 앞으로 가는 것
*계속 나아가세요*
---
# 당신은 할 수 있습니다
**오늘도 화이팅!**`
  },

  // Recipe
  'recipe': {
    id: 'recipe',
    title: '🍳 레시피/요리법',
    category: 'info',
    description: '간단한 요리 레시피',
    content: `# 간단 레시피
## 10분 완성
---
# 재료 준비
재료1::달걀 2개
재료2::양파 1/4개
재료3::소금 약간
재료4::식용유
---
# STEP 1
> 재료를 손질합니다
**양파는 잘게 다지세요**
---
# STEP 2
팬 예열::중불
기름::두르기
재료::넣기
---
# STEP 3
> 뒤집으면서 익히기
*3-4분 정도*
---
# 완성!
맛있게 드세요
**꿀팁: 치즈 추가하면 더 맛있어요**`
  },

  // Before/After
  'beforeAfter': {
    id: 'beforeAfter',
    title: '📊 비포/애프터',
    category: 'promo',
    description: '변화 과정 보여주기',
    content: `# 변화의 기록
## 30일 챌린지 결과
---
# BEFORE
상태::시작 전
느낌::막막함
목표::작은 변화
---
> 하루하루 노력했습니다
---
# 진행 과정
1주차::적응기
2주차::힘든 시기
3주차::변화 감지
4주차::습관화
---
# AFTER
상태::목표 달성
느낌::뿌듯함
결과::**큰 변화**
---
> 여러분도 할 수 있습니다
*시작이 중요해요*`
  }
};

/**
 * Get preset by id
 */
export const getScriptPreset = (id) => {
  return SCRIPT_PRESETS[id] || null;
};

/**
 * Get all presets list
 */
export const getScriptPresetsList = () => {
  return Object.values(SCRIPT_PRESETS);
};

/**
 * Get presets by category
 */
export const getScriptPresetsByCategory = (category) => {
  return Object.values(SCRIPT_PRESETS).filter(preset => preset.category === category);
};

/**
 * Categories
 */
export const SCRIPT_CATEGORIES = {
  info: '📰 정보성',
  essay: '✨ 감성',
  promo: '🎉 홍보',
  quiz: '❓ 퀴즈'
};
