import { ContentBlock, Article, StyleConfig } from '../types';

/** Renders inline markdown markup **bold** and *italic* as HTML tags */
export function formatInlineMarkdown(text: string, primaryColor?: string): string {
  if (!text) return '';
  let cleaned = text.replace(/^#{1,6}\s*/, '').trim();
  // **bold** → <strong>
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, `<strong style="font-weight: bold; color: ${primaryColor || '#07C160'};">$1</strong>`);
  // *italic* → <em>
  cleaned = cleaned.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return cleaned.replace(/^[#*]+\s*$/g, '').replace(/\*/g, '').replace(/^#+\s*/g, '');
}

export interface DoocsThemeJSON {
  theme: { name: string; description?: string; version?: string };
  global: {
    body: {
      fontSize: string;
      color: string;
      lineHeight: string;
      letterSpacing?: string;
      fontFamily?: string;
      paragraphSpacing?: string;
    };
    link?: { color: string; textDecoration?: string };
  };
  components: Array<{
    type: 'HeadingDecorator' | 'QuoteBox' | 'AccentCard' | string;
    name?: string;
    props: Record<string, any>;
  }>;
}

export const DEFAULT_DOOCS_THEME_JSON: DoocsThemeJSON = {
  theme: { name: "默认极简主题", version: "1.0.0" },
  global: {
    body: {
      fontSize: "16px",
      color: "#3f3f3f",
      lineHeight: "1.75",
      letterSpacing: "1px",
      fontFamily: "-apple-system-font, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, sans-serif"
    },
    link: { color: "#07C160" }
  },
  components: [
    {
      type: "HeadingDecorator",
      props: {
        tag: "h2", color: "#1a1a1a", fontSize: "20px", fontWeight: "bold",
        decoratorType: "left-bar", decoratorColor: "#07C160", decoratorWidth: "4px",
        padding: "8px 0 8px 12px", margin: "25px 0 15px 0"
      }
    },
    {
      type: "QuoteBox",
      props: {
        borderLeft: "4px solid #07C160", backgroundColor: "#f7f7f7", color: "#555555",
        padding: "12px 18px", borderRadius: "0 6px 6px 0", fontSize: "15px", quoteStyle: "left-bar"
      }
    },
    {
      type: "AccentCard",
      props: {
        backgroundColor: "#e8f5e9", borderColor: "#a5d6a7", borderRadius: "8px",
        padding: "16px 20px", cardType: "bordered"
      }
    }
  ]
};

export function styleConfigToDoocsThemeJSON(style: StyleConfig, themeName = "提取主题"): DoocsThemeJSON {
  const primaryColor = style.primaryColor || '#07C160';
  const fontSize = `${style.fontSize || 16}px`;
  const lineHeight = String(style.lineHeight || 1.75);
  const paragraphSpacing = `${style.paragraphSpacing || 16}px`;
  const secondaryColor = style.secondaryColor || `${primaryColor}0d`;

  let headingProps: Record<string, any> = {
    tag: "h2",
    color: style.headingStyle === 'solid-bg' ? "#ffffff" : (style.textColor || "#1b1c1c"),
    fontSize: "21px",
    fontWeight: "bold",
    decoratorType: style.headingStyle === 'solid-bg' ? 'bg-block'
      : style.headingStyle === 'bottom-line' ? 'bottom-line'
      : 'left-bar',
    decoratorColor: primaryColor,
    decoratorWidth: "4px",
    padding: style.headingStyle === 'solid-bg' ? "11px 16px" : "8px 0 8px 12px",
    margin: "30px 0 16px 0",
  };

  if (style.headingStyle === 'solid-bg') {
    headingProps = {
      ...headingProps,
      backgroundColor: primaryColor,
      borderRadius: "6px",
    };
  }

  // Support badge and gradient-text modes from SKILL spec
  if (style.headingStyle === 'badge') {
    headingProps = {
      ...headingProps,
      decoratorType: 'emoji-prefix',
      color: primaryColor,
      decoratorColor: primaryColor,
      backgroundColor: 'transparent',
    };
  }

  const quoteProps: Record<string, any> = {
    borderLeft: `3px solid ${primaryColor}`,
    backgroundColor: secondaryColor,
    color: style.textColor || "#333333",
    padding: "15px 18px",
    borderRadius: "6px",
    fontSize: "15px",
    quoteStyle: style.quoteStyle === 'card' ? 'bg-only' : 'left-bar',
  };

  return {
    theme: { name: themeName, version: "1.0.0" },
    global: {
      body: {
        fontSize,
        color: style.textColor || "#1b1c1c",
        lineHeight,
        letterSpacing: "1px",
        fontFamily: style.fontFamily || "-apple-system-font, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, sans-serif",
        paragraphSpacing,
      },
      link: { color: primaryColor }
    },
    components: [
      { type: "HeadingDecorator", props: headingProps },
      { type: "QuoteBox", props: quoteProps },
      {
        type: "AccentCard",
        props: {
          backgroundColor: `${primaryColor}12`,
          borderColor: `${primaryColor}40`,
          borderRadius: "8px",
          padding: "18px 20px",
          cardType: "bordered"
        }
      }
    ]
  };
}

export function renderArticleWithDoocsTheme(article: Article, themeJSON: DoocsThemeJSON): string {
  const globalBody = themeJSON.global.body;
  const headingComp = themeJSON.components.find(c => c.type === 'HeadingDecorator')?.props || {};
  const quoteComp = themeJSON.components.find(c => c.type === 'QuoteBox')?.props || {};
  const cardComp = themeJSON.components.find(c => c.type === 'AccentCard')?.props || {};
  const paragraphSpacing = globalBody.paragraphSpacing || '16px';

  const bodyStyle = `font-size: ${globalBody.fontSize}; color: ${globalBody.color}; line-height: ${globalBody.lineHeight}; letter-spacing: ${globalBody.letterSpacing || '1px'}; font-family: ${(globalBody.fontFamily || 'sans-serif').replace(/'/g, '')}; padding: 16px; max-width: 677px; margin: 0 auto; box-sizing: border-box; background-color: #ffffff;`;

  const blocksHtml = article.blocks.map((block) => {
    const alignStyle = block.align ? `text-align: ${block.align};` : '';
    const fontWeight = block.bold ? 'font-weight: bold;' : '';
    const fontStyle = block.italic ? 'font-style: italic;' : '';
    const formatted = formatInlineMarkdown(block.content, themeJSON.global.link?.color);

    switch (block.type) {
      case 'heading1':
      case 'heading2': {
        const decoratorType = headingComp.decoratorType || 'left-bar';
        let decStyle = '';

        switch (decoratorType) {
          case 'bg-block':
            decStyle = `background-color: ${headingComp.backgroundColor || headingComp.decoratorColor}; color: ${headingComp.color || '#ffffff'}; padding: ${headingComp.padding || '10px 16px'}; border-radius: ${headingComp.borderRadius || '6px'};`;
            break;
          case 'bottom-line':
            decStyle = `border-bottom: ${headingComp.decoratorWidth || '2px'} solid ${headingComp.decoratorColor || '#07C160'}; padding-bottom: 8px; color: ${headingComp.color || '#07C160'};`;
            break;
          case 'emoji-prefix':
            decStyle = `color: ${headingComp.color || '#07C160'};`;
            break;
          case 'gradient-text':
            decStyle = `background: linear-gradient(135deg, ${headingComp.decoratorColor || '#07C160'}, ${headingComp.gradientEnd || '#006d33'}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent;`;
            break;
          case 'left-bar':
          default:
            decStyle = `border-left: ${headingComp.decoratorWidth || '4px'} solid ${headingComp.decoratorColor || '#07C160'}; padding-left: 12px; color: ${headingComp.color || '#07C160'};`;
        }

        const cleanTitle = formatted.replace(/<[^>]+>/g, '');
        const isPrimaryHeading = block.type === 'heading1';
        const headingTagStyle = isPrimaryHeading
          ? decStyle
          : `color: ${globalBody.color}; border-bottom: 1px solid ${(headingComp.decoratorColor || '#07C160')}33; padding-bottom: 6px;`;
        return `<section style="margin-top: ${isPrimaryHeading ? (headingComp.margin ? headingComp.margin.split(' ')[0] : '30px') : '22px'}; margin-bottom: ${isPrimaryHeading ? '16px' : '12px'};">
            <h2 style="${headingTagStyle} font-size: ${isPrimaryHeading ? (headingComp.fontSize || '21px') : '18px'}; font-weight: ${headingComp.fontWeight || 'bold'}; margin: 0; ${alignStyle}">
              ${cleanTitle}
            </h2>
          </section>`;
      }

      case 'quote': {
        const quoteStyle = quoteComp.quoteStyle || 'left-bar';
        let qStyle = '';
        const qColor = quoteComp.color || '#333333';

        switch (quoteStyle) {
          case 'full-border':
            qStyle = `border: 1px solid ${quoteComp.borderColor || '#e0e0e0'}; background-color: ${quoteComp.backgroundColor || '#f7f7f7'}; padding: ${quoteComp.padding || '14px 18px'}; border-radius: ${quoteComp.borderRadius || '8px'};`;
            break;
          case 'bg-only':
            qStyle = `background-color: ${quoteComp.backgroundColor || '#f7f7f7'}; padding: ${quoteComp.padding || '14px 18px'}; border-radius: ${quoteComp.borderRadius || '6px'};`;
            break;
          case 'italic':
            qStyle = `font-style: italic; color: ${qColor}; padding-left: 20px; border-left: 2px solid ${quoteComp.borderLeftColor || '#07C160'};`;
            break;
          case 'left-bar':
          default:
            qStyle = `border-left: ${quoteComp.borderLeft || '4px solid #07C160'}; background-color: ${quoteComp.backgroundColor || '#f7f7f7'}; padding: ${quoteComp.padding || '14px 18px'}; border-radius: ${quoteComp.borderRadius || '0 6px 6px 0'};`;
        }

        return `<blockquote style="margin-top: 20px; margin-bottom: 20px; ${qStyle} color: ${qColor}; font-size: ${quoteComp.fontSize || '15px'}; line-height: 1.75; ${fontStyle}">${formatted}</blockquote>`;
      }

      case 'callout': {
        const cardType = cardComp.cardType || 'bordered';
        const cBg = cardComp.backgroundColor || '#f7f7f7';
        const cRadius = cardComp.borderRadius || '8px';
        const cPadding = cardComp.padding || '16px';
        let cStyle = '';

        switch (cardType) {
          case 'shadow':
            cStyle = `background-color: ${cBg}; border: 1px solid ${cardComp.borderColor || '#e0e0e0'}; border-radius: ${cRadius}; padding: ${cPadding};`;
            break;
          case 'solid':
            cStyle = `background-color: ${cBg}; border-radius: ${cRadius}; padding: ${cPadding};`;
            break;
          case 'gradient':
            cStyle = `background: linear-gradient(135deg, ${cardComp.gradientStart || cBg}, ${cardComp.gradientEnd || cBg}); border-radius: ${cRadius}; padding: ${cPadding};`;
            break;
          case 'bordered':
          default:
            cStyle = `background-color: ${cBg}; border: 1px solid ${cardComp.borderColor || '#e0e0e0'}; border-radius: ${cRadius}; padding: ${cPadding};`;
        }

        return `<section style="margin-top: 20px; margin-bottom: 20px; ${cStyle}">
            ${block.caption ? `<div style="font-weight: bold; color: ${themeJSON.global.link?.color || '#07C160'}; font-size: 14px; margin-bottom: 6px;">${block.caption}</div>` : ''}
            <div style="color: ${globalBody.color}; font-size: 15px; line-height: 1.7;">${formatted}</div>
          </section>`;
      }

      case 'image': {
        return `<section style="margin-top: 20px; margin-bottom: 20px; text-align: center;">
            <img src="${block.content}" alt="${block.caption || ''}" style="width: 100%; max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />
            ${block.caption ? `<p style="font-size: 13px; color: #888888; margin-top: 8px; margin-bottom: 0; text-align: center;">${block.caption}</p>` : ''}
          </section>`;
      }

      case 'bullet_list': {
        const items = block.content.split('\n').filter(Boolean);
        const listItems = items.map(item => `<li style="margin-bottom: 6px;">${formatInlineMarkdown(item.replace(/^[•\-\*]\s*/, ''), themeJSON.global.link?.color)}</li>`).join('');
        return `<ul style="margin-top: 14px; margin-bottom: 18px; padding-left: 22px; color: ${globalBody.color}; line-height: ${globalBody.lineHeight};">${listItems}</ul>`;
      }

      case 'divider': {
        return `<hr style="border: none; border-top: 1px solid #e0e0e0; margin-top: 28px; margin-bottom: 28px;" />`;
      }

      case 'paragraph':
      default: {
        return `<p style="margin-bottom: ${paragraphSpacing}; font-size: ${globalBody.fontSize}; line-height: ${globalBody.lineHeight}; color: ${globalBody.color}; text-align: justify; ${fontWeight} ${fontStyle} ${alignStyle}">${formatted.replace(/\n/g, '<br />')}</p>`;
      }
    }
  }).join('\n');

  return `<section style="${bodyStyle}"><div>${blocksHtml}</div></section>`;
}
