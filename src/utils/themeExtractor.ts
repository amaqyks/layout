import { StyleConfig, ExtractedTheme } from '../types';

/**
 * Helper to convert rgb(r, g, b) or rgba to Hex color
 */
export function normalizeColor(colorStr: string): string | null {
  if (!colorStr || colorStr === 'transparent' || colorStr === 'inherit' || colorStr === 'initial') {
    return null;
  }
  colorStr = colorStr.trim();
  if (colorStr.startsWith('#')) {
    if (colorStr.length === 4) {
      return `#${colorStr[1]}${colorStr[1]}${colorStr[2]}${colorStr[2]}${colorStr[3]}${colorStr[3]}`.toUpperCase();
    }
    return colorStr.slice(0, 7).toUpperCase();
  }
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }
  return null;
}

function isVibrantColor(hex: string): boolean {
  if (!hex || hex.length !== 7 || !hex.startsWith('#')) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  if (max > 245 && min > 245) return false;
  if (max < 30) return false;
  if (diff < 18) return false;
  return true;
}

export function parseInlineStyle(styleStr: string): Record<string, string> {
  const styles: Record<string, string> = {};
  if (!styleStr) return styles;
  const declarations = styleStr.split(';');
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(':');
    if (colonIdx !== -1) {
      const prop = decl.slice(0, colonIdx).trim().toLowerCase();
      const val = decl.slice(colonIdx + 1).trim();
      if (prop && val) {
        styles[prop] = val;
      }
    }
  }
  return styles;
}

export interface ExtractedStyleData {
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
  headingStyle: 'left-border' | 'solid-bg' | 'badge' | 'bottom-line' | 'custom';
  quoteStyle: 'simple' | 'card' | 'speech' | 'custom';
  headingRules: string;
  quoteRules: string;
  allExtractedColors: string[];
  accentCard?: {
    backgroundColor: string;
    borderColor: string;
    borderRadius: string;
    cardType: 'solid' | 'bordered' | 'shadow' | 'gradient';
  };
}

/**
 * Client-side HTML Theme Extractor — enhanced with AccentCard detection
 * from template-reverse-recognition SKILL rules.
 */
export function extractThemeFromHTML(htmlContent: string, sourceUrl?: string): ExtractedTheme {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const container = doc.querySelector('#js_content') || doc.body;

  const colorCounts: Record<string, number> = {};
  const fontSizes: number[] = [];
  const lineHeights: number[] = [];
  const paragraphSpacings: number[] = [];

  let extractedH2BorderColor = '';
  let extractedH2BgColor = '';
  let extractedH2Color = '';
  let extractedH2DecoratorType = '';
  let extractedQuoteBg = '';
  let extractedQuoteBorder = '';
  let extractedQuoteBorderRadius = '';

  // AccentCard extraction
  let extractedCardBg = '';
  let extractedCardBorder = '';
  let extractedCardRadius = '';
  let extractedCardShadow = '';
  let extractedCardMaxPadding = 0;

  const elements = Array.from(container.querySelectorAll('*'));
  for (const el of elements) {
    const styleAttr = el.getAttribute('style') || '';
    const styleMap = parseInlineStyle(styleAttr);
    const tagName = el.tagName.toLowerCase();

    const textColor = normalizeColor(styleMap['color']);
    const bgColor = normalizeColor(styleMap['background-color'] || styleMap['background']);
    const borderColor = normalizeColor(styleMap['border-color'] || styleMap['border-left-color']);

    // Color histogram
    [textColor, bgColor, borderColor].forEach((c) => {
      if (c && isVibrantColor(c)) {
        colorCounts[c] = (colorCounts[c] || 0) + 1;
      }
    });

    // Font size (exclude headings)
    if (styleMap['font-size'] && !['h1', 'h2', 'h3', 'h4'].includes(tagName)) {
      const pxMatch = styleMap['font-size'].match(/([\d.]+)\s*px/);
      if (pxMatch) {
        const sz = parseFloat(pxMatch[1]);
        if (sz >= 12 && sz <= 24) fontSizes.push(sz);
      }
    }

    // Line height
    if (styleMap['line-height']) {
      const lhMatch = styleMap['line-height'].match(/^([\d.]+)/);
      if (lhMatch) {
        const lh = parseFloat(lhMatch[1]);
        if (lh >= 1.2 && lh <= 2.5) lineHeights.push(lh);
      }
    }

    // Paragraph spacing (margin-bottom on p or div)
    if (styleMap['margin-bottom'] && (tagName === 'p' || tagName === 'div' || tagName === 'section')) {
      const mbMatch = styleMap['margin-bottom'].match(/([\d.]+)\s*px/);
      if (mbMatch) {
        const mb = parseFloat(mbMatch[1]);
        if (mb >= 4 && mb <= 48) paragraphSpacings.push(mb);
      }
    }

    // Heading extraction
    if (tagName === 'h2' || (styleAttr.includes('font-weight') && styleAttr.includes('font-size') && (tagName === 'section' || tagName === 'div'))) {
      if (styleMap['border-left'] || styleMap['border-left-color']) {
        const bColor = normalizeColor(styleMap['border-left-color'] || styleMap['border-left']);
        if (bColor) { extractedH2BorderColor = bColor; extractedH2DecoratorType = 'left-bar'; }
      }
      if (styleMap['border-bottom']) {
        const bColor = normalizeColor(styleMap['border-bottom-color'] || styleMap['border-bottom']);
        if (bColor) { extractedH2BorderColor = bColor; extractedH2DecoratorType = 'bottom-line'; }
      }
      if (bgColor && isVibrantColor(bgColor)) {
        extractedH2BgColor = bgColor;
        if (!extractedH2DecoratorType) extractedH2DecoratorType = 'bg-block';
      }
      if (textColor) extractedH2Color = textColor;
    }

    // Blockquote / Quote section
    if (tagName === 'blockquote' || (styleMap['border-left'] && (tagName === 'section' || tagName === 'div'))) {
      if (bgColor) extractedQuoteBg = bgColor;
      const bColor = normalizeColor(styleMap['border-left-color'] || styleMap['border-left']);
      if (bColor) extractedQuoteBorder = bColor;
      if (styleMap['border-radius']) extractedQuoteBorderRadius = styleMap['border-radius'];
    }

    // AccentCard detection: rounded border + bg + significant padding + self-contained
    const paddingVal = styleMap['padding'];
    let padNum = 0;
    if (paddingVal) {
      const pm = paddingVal.match(/([\d.]+)\s*px/);
      if (pm) padNum = parseFloat(pm[1]);
      else {
        const parts = paddingVal.split(/\s+/);
        padNum = Math.max(...parts.map(p => parseFloat(p) || 0));
      }
    }

    const hasBorder = !!(styleMap['border'] || styleMap['border-color']);
    const hasRadius = !!(styleMap['border-radius']);
    const hasBoxShadow = !!(styleMap['box-shadow']);
    const isCardLike = hasBorder && hasRadius && padNum >= 10 && bgColor && isVibrantColor(bgColor);

    if (isCardLike && padNum > extractedCardMaxPadding) {
      extractedCardMaxPadding = padNum;
      extractedCardBg = bgColor!;
      if (styleMap['border-color']) extractedCardBorder = normalizeColor(styleMap['border-color']) || bgColor!;
      else if (styleMap['border']) {
        const bc = normalizeColor(styleMap['border']);
        if (bc) extractedCardBorder = bc;
      }
      extractedCardRadius = styleMap['border-radius'] || '8px';
      if (styleMap['box-shadow']) extractedCardShadow = styleMap['box-shadow'];
    }
  }

  // Determine card type
  let cardType: 'solid' | 'bordered' | 'shadow' | 'gradient' = 'solid';
  if (extractedCardShadow && extractedCardBorder) cardType = 'shadow';
  else if (extractedCardBorder && extractedCardBg) cardType = 'bordered';

  // Dominant primary color
  const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
  const primaryColor = sortedColors[0]?.[0] || extractedH2BorderColor || extractedH2BgColor || '#07C160';

  const fontSize = fontSizes.length > 0
    ? Math.round(fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length)
    : 16;

  const lineHeight = lineHeights.length > 0
    ? Math.round((lineHeights.reduce((a, b) => a + b, 0) / lineHeights.length) * 100) / 100
    : 1.75;

  const paragraphSpacing = paragraphSpacings.length > 0
    ? Math.round(paragraphSpacings.reduce((a, b) => a + b, 0) / paragraphSpacings.length)
    : 16;

  // Infer heading style from decorator type
  let headingStyle: StyleConfig['headingStyle'] = 'left-border';
  if (extractedH2DecoratorType === 'bg-block') headingStyle = 'solid-bg';
  else if (extractedH2DecoratorType === 'bottom-line') headingStyle = 'bottom-line';
  else if (extractedH2BorderColor) headingStyle = 'left-border';

  // Build AccentCard CSS
  let accentCardCss = '';
  if (extractedCardBg) {
    accentCardCss = `
.preview-wrapper .accent-card {
  background-color: ${extractedCardBg};
  ${extractedCardBorder ? `border: 1px solid ${extractedCardBorder};` : ''}
  border-radius: ${extractedCardRadius};
  padding: 16px 20px;
  ${extractedCardShadow ? `box-shadow: ${extractedCardShadow};` : ''}
}`.trim();
  }

  const customCss = `
/* 逆向提取主题 — 标题装饰 */
.preview-wrapper h2 {
  color: ${extractedH2Color || primaryColor};
  ${extractedH2BgColor ? `background-color: ${extractedH2BgColor}; padding: 6px 12px; border-radius: 4px;` : ''}
  ${extractedH2BorderColor ? `border-left: 4px solid ${extractedH2BorderColor}; padding-left: 10px;` : `border-left: 4px solid ${primaryColor}; padding-left: 10px;`}
}

/* 逆向提取主题 — 引用框 */
.preview-wrapper blockquote {
  background-color: ${extractedQuoteBg || '#F8F9FA'};
  border-left: 4px solid ${extractedQuoteBorder || primaryColor};
  padding: 12px 16px;
  border-radius: ${extractedQuoteBorderRadius || '6px'};
  color: #555555;
}

/* 逆向提取主题 — 强调卡片 */
${accentCardCss}
`.trim();

  const titleMeta = doc.querySelector('h1')?.textContent?.trim() ||
    doc.querySelector('.rich_media_title')?.textContent?.trim() ||
    '已提取的微信文章模板';

  const themeId = `extracted_${Date.now()}`;

  return {
    id: themeId,
    name: titleMeta.length > 20 ? `${titleMeta.slice(0, 18)}... 模板` : `${titleMeta} 模板`,
    description: `从公众号文章逆向提取的主题。主配色：${primaryColor}，字号：${fontSize}px，行高：${lineHeight}${extractedCardBg ? `，含强调卡片样式` : ''}`,
    sourceUrl,
    createdAt: new Date().toLocaleDateString('zh-CN'),
    styleConfig: {
      primaryColor,
      fontFamily: '-apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif',
      fontSize,
      lineHeight,
      paragraphSpacing,
      headingStyle,
      quoteStyle: extractedQuoteBg ? 'card' : 'simple',
      cssVariables: {
        '--md-primary-color': primaryColor,
        '--md-font-size-base': `${fontSize}px`,
        '--md-line-height-base': String(lineHeight),
        '--md-paragraph-spacing': `${paragraphSpacing}px`,
      },
      customCss,
    },
    customCss,
    previewSample: {
      title: titleMeta,
      h2: '逆向提取的二级标题',
      quote: '“包含提取自原公众号文章的引言框与边框样式。”',
      paragraph: '这是套用逆向提取模板渲染的正文段落，已精准复现字号、颜色、行高与段间距。',
    },
  };
}