# InstaFlow

Serverless Instagram Card News Generator - Transform your text into beautiful, styled slides instantly!

## Features

### Core Functionality
- **Text-to-Slide Parser**: Converts raw text scripts into styled slides
- **Live Preview**: See your changes in real-time as you type
- **Multiple Themes**: Choose from 3 professionally designed themes
- **Aspect Ratio Control**: Toggle between 1:1 (Square) and 4:5 (Portrait) formats
- **Export to Images**: Download all slides as high-resolution PNG files in a ZIP archive

### Markdown-like Syntax

- `# Title` - Main heading (H1)
- `## Subtitle` - Secondary heading or price box (H2)
- `Key::Value` - Spec grid items (e.g., `CPU::Intel Core i7`)
- `> Quote` - Highlighted quote or big metric
- `*text*` - Highlight color
- `**text**` - Bold text
- `---` - Slide separator

### Themes

#### Theme A: Tech Dark
- **Style**: Premium, Cyber, IT Review
- **Background**: Deep black with gradient
- **Typography**: Noto Sans KR, white text
- **Special UI**: Spec grid with 2-column layout, translucent price boxes
- **Best for**: Product reviews, tech specs, gadget announcements

#### Theme B: Biz Clean
- **Style**: Trustworthy, Professional, Official
- **Background**: Pure white with heavy shadows
- **Typography**: Bold sans-serif, dark slate text
- **Special UI**: Card boxes, blue checkmarks
- **Best for**: Business presentations, information cards, announcements

#### Theme C: Emotional Essay
- **Style**: Calm, Emotional, Minimal
- **Background**: Warm beige/paper texture
- **Typography**: Georgia serif font, dark brown text
- **Special UI**: Center-aligned, large whitespace, no borders
- **Best for**: Vlogs, diary entries, inspirational quotes, storytelling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bubilife1202/instaflow.git
cd instaflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app will be available at `http://localhost:5173/`

### Usage

1. **Write Your Script**: Enter your text in the left textarea using the markdown-like syntax
2. **Separate Slides**: Use `---` (triple dash) to create new slides
3. **Choose Theme**: Select from the dropdown (Tech Dark, Biz Clean, or Emotional Essay)
4. **Adjust Ratio**: Toggle between 1:1 (Square) or 4:5 (Portrait) aspect ratios
5. **Preview**: Watch your slides render in real-time on the right panel
6. **Export**: Click "Download All" to save all slides as PNG images in a ZIP file

### Example Script

```
# InstaFlow
## 서버리스 카드뉴스 생성기
---
# Galaxy Book 4 Pro
## ₩1,890,000
---
# 주요 스펙
CPU::Intel Core i7-14650H
RAM::16GB LPDDR5X
Storage::512GB NVMe SSD
Display::14" AMOLED 2.8K
---
> 초경량 990g
> 배터리 65Wh
*최고의 이동성*을 자랑하는 **프리미엄 노트북**
---
# 완벽한 선택
당신의 **생산성**을 한 단계 높여줄
*최고의 파트너*입니다
```

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **html-to-image** - Convert DOM to high-quality images
- **JSZip** - Create ZIP archives in the browser
- **Google Fonts (Noto Sans KR)** - Korean font support

## Export Quality

All images are exported at 3x pixel ratio for high resolution, suitable for Instagram and other social media platforms.

## License

MIT

## Author

bubilife1202
