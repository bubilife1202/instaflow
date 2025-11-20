/**
 * Parses inline markdown (bold, highlight) in text
 * @param {string} text - Text with markdown syntax
 * @returns {Array} - Array of parsed text parts
 */
const parseInlineMarkdown = (text) => {
  const parts = [];
  let lastIndex = 0;
  const boldRegex = /\*\*(.+?)\*\*/g;
  const boldMatches = [];
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    boldMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1], type: 'bold' });
  }

  const highlightRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g;
  const highlightMatches = [];

  while ((match = highlightRegex.exec(text)) !== null) {
    highlightMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1], type: 'highlight' });
  }

  const allMatches = [...boldMatches, ...highlightMatches].sort((a, b) => a.start - b.start);

  allMatches.forEach((match) => {
    if (match.start > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.start) });
    }
    parts.push({ type: match.type, content: match.text });
    lastIndex = match.end;
  });

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', content: text });
  }

  return parts;
};

/**
 * Renders styled text with bold and highlight support
 * @param {string} text - Text to render
 * @param {string} themeClass - Current theme class
 * @returns {Array} - Array of React elements
 */
export const renderStyledText = (text, themeClass) => {
  const parts = parseInlineMarkdown(text);
  return parts.map((part, i) => {
    if (part.type === 'bold') {
      return <strong key={i} className="font-black">{part.content}</strong>;
    } else if (part.type === 'highlight') {
      const color = themeClass === 'tech-dark' ? 'text-cyan-400' : themeClass === 'biz-clean' ? 'text-blue-600' : 'text-amber-600';
      return <span key={i} className={color + ' font-bold'}>{part.content}</span>;
    }
    return <span key={i}>{part.content}</span>;
  });
};
