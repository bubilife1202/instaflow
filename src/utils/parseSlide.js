/**
 * Parses slide content into structured elements
 * @param {string} content - Raw slide markdown content
 * @returns {object} - { elements: Array, background: string|null }
 */
export const parseSlide = (content) => {
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  let slideBackground = null;

  const elements = lines.map(line => {
    line = line.trim();

    // Parse [bg: url] syntax for per-slide backgrounds
    if (line.match(/^\[bg:\s*.+\]$/)) {
      const match = line.match(/^\[bg:\s*(.+)\]$/);
      if (match) slideBackground = match[1].trim();
      return null;
    }

    if (line.startsWith('# ')) return { type: 'h1', content: line.slice(2) };
    else if (line.startsWith('## ')) return { type: 'h2', content: line.slice(3) };
    else if (line.includes('::')) {
      const [key, value] = line.split('::').map(s => s.trim());
      return { type: 'spec', key, value };
    }
    else if (line.startsWith('> ')) return { type: 'quote', content: line.slice(2) };
    else return { type: 'text', content: line };
  }).filter(el => el !== null);

  return { elements, background: slideBackground };
};
