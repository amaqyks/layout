import { Article, StyleConfig } from '../types';
import { renderArticleWithDoocsTheme, styleConfigToDoocsThemeJSON } from './doocsThemeRenderer';

/**
 * Generates WeChat-compatible inline CSS HTML string from Article and StyleConfig.
 * WeChat MP backend requires inline styles for proper rendering.
 */
export function formatInlineMarkdown(text: string, primaryColor?: string): string {
  if (!text) return '';
  // Strip leading heading markers (e.g. "## Title")
  let cleaned = text.replace(/^#{1,6}\s*/gm, '').trim();

  // Convert **bold** or __bold__ to <strong> HTML elements
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, (_, match) => `<strong style="font-weight: bold; color: ${primaryColor || '#07C160'};">${match}</strong>`);
  cleaned = cleaned.replace(/__(.+?)__/g, (_, match) => `<strong style="font-weight: bold; color: ${primaryColor || '#07C160'};">${match}</strong>`);
  
  // Convert *italic* or _italic_ to <em> (only single * not already consumed by bold)
  cleaned = cleaned.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  cleaned = cleaned.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em>$1</em>');

  // Strip any residual markdown characters that shouldn't appear in final output
  cleaned = cleaned.replace(/\*/g, '');
  cleaned = cleaned.replace(/^>\s*/gm, '');

  return cleaned;
}

export function generateWeChatHtml(article: Article, style: StyleConfig): string {
  const themeJSON = styleConfigToDoocsThemeJSON(style, article.title || '公众号文章主题');
  return renderArticleWithDoocsTheme(article, themeJSON);
}

export function generateLegacyWeChatHtml(article: Article, style: StyleConfig): string {
  const primaryColor = style.primaryColor || '#07C160';
  const fontFamily = style.fontFamily || "-apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif";
  
  const fontSize = `${style.fontSize || 16}px`;
  const lineHeight = style.lineHeight || 1.75;
  const paragraphGap = `${style.paragraphSpacing || 16}px`;
  let blocksHtml = article.blocks.map(block => {
    const alignStyle = block.align ? `text-align: ${block.align};` : '';
    const fontWeight = block.bold ? 'font-weight: bold;' : '';
    const fontStyle = block.italic ? 'font-style: italic;' : '';
    const formattedContent = formatInlineMarkdown(block.content, primaryColor);

    switch (block.type) {
      case 'heading1': {
        const titleText = formattedContent.replace(/<[^>]+>/g, ''); // strip HTML tags for clean title font
        if (style.headingStyle === 'solid-bg') {
          return `
            <section style="margin-top: 24px; margin-bottom: 16px;">
              <h2 style="background-color: ${primaryColor}; color: #ffffff; padding: 10px 16px; border-radius: 6px; font-size: 20px; font-weight: bold; margin: 0; ${alignStyle}">
                ${titleText}
              </h2>
            </section>
          `;
        } else if (style.headingStyle === 'badge') {
          return `
            <section style="margin-top: 24px; margin-bottom: 16px;">
              <div style="display: inline-block; background-color: ${primaryColor}20; color: ${primaryColor}; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">SECTION</div>
              <h2 style="color: ${primaryColor}; font-size: 20px; font-weight: bold; margin: 0; ${alignStyle}">
                ${titleText}
              </h2>
            </section>
          `;
        } else if (style.headingStyle === 'bottom-line') {
          return `
            <section style="margin-top: 24px; margin-bottom: 16px; border-bottom: 2px solid ${primaryColor}; padding-bottom: 8px;">
              <h2 style="color: ${primaryColor}; font-size: 20px; font-weight: bold; margin: 0; ${alignStyle}">
                ${titleText}
              </h2>
            </section>
          `;
        } else {
          // default left-border
          return `
            <section style="margin-top: 24px; margin-bottom: 16px;">
              <h2 style="border-left: 4px solid ${primaryColor}; padding-left: 12px; font-size: 20px; font-weight: bold; color: ${primaryColor}; margin: 0; ${alignStyle}">
                ${titleText}
              </h2>
            </section>
          `;
        }
      }

      case 'heading2': {
        const titleText = formattedContent.replace(/<[^>]+>/g, '');
        return `
          <h3 style="font-size: 18px; font-weight: bold; color: #1b1c1c; margin-top: 20px; margin-bottom: 12px; ${alignStyle}">
            ${titleText}
          </h3>
        `;
      }

      case 'image': {
        return `
          <figure style="margin-top: 20px; margin-bottom: 20px; text-align: center;">
            <img src="${block.content}" alt="${block.caption || ''}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: block; margin: 0 auto;" />
            ${block.caption ? `<figcaption style="font-size: 13px; color: #666666; margin-top: 8px; text-align: center;">${block.caption}</figcaption>` : ''}
          </figure>
        `;
      }

      case 'quote': {
        return `
          <blockquote style="margin-top: 18px; margin-bottom: 18px; padding: 14px 18px; background-color: ${primaryColor}0d; border-left: 4px solid ${primaryColor}; border-radius: 4px; color: #333333; font-size: 15px; line-height: 1.7; ${fontStyle}">
            ${formattedContent}
          </blockquote>
        `;
      }

      case 'callout': {
        return `
          <section style="margin-top: 20px; margin-bottom: 20px; padding: 16px; background-color: ${primaryColor}12; border: 1px solid ${primaryColor}33; border-radius: 8px;">
            ${block.caption ? `<div style="font-weight: bold; color: ${primaryColor}; font-size: 14px; margin-bottom: 6px;">${block.caption}</div>` : ''}
            <div style="color: #1b1c1c; font-size: 15px; line-height: 1.6;">${formattedContent}</div>
          </section>
        `;
      }

      case 'bullet_list': {
        const items = block.content.split('\n').filter(Boolean);
        const listHtml = items.map(item => {
          const cleanedText = formatInlineMarkdown(item.replace(/^[•\-\*]\s*/, ''), primaryColor);
          return `
            <section style="display: flex; align-items: flex-start; margin-bottom: 8px; font-size: ${fontSize}; line-height: ${lineHeight}; color: #1b1c1c;">
              <span style="color: ${primaryColor}; margin-right: 8px; font-weight: bold; flex-shrink: 0; line-height: inherit;">•</span>
              <span style="flex-grow: 1; line-height: inherit;">${cleanedText}</span>
            </section>
          `;
        }).join('');
        return `<section style="margin-top: 12px; margin-bottom: 12px;">${listHtml}</section>`;
      }

      case 'divider': {
        return `
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin-top: 28px; margin-bottom: 28px;" />
        `;
      }

      case 'paragraph':
      default: {
        return `
          <p style="margin-bottom: ${paragraphGap}; font-size: ${fontSize}; line-height: ${lineHeight}; color: #1b1c1c; ${fontWeight} ${fontStyle} ${alignStyle}">
            ${formattedContent.replace(/\n/g, '<br />')}
          </p>
        `;
      }
    }
  }).join('\n');

  return `
    <section style="font-family: ${fontFamily}; color: #1b1c1c; background-color: #ffffff; padding: 16px; max-width: 677px; margin: 0 auto; box-sizing: border-box;">
      <div style="line-height: ${lineHeight}; font-size: ${fontSize};">
        ${blocksHtml}
      </div>
    </section>
  `.trim();
}

/**
 * Copies the rich text HTML to clipboard so users can paste directly into WeChat Official Account editor.
 */
export async function copyToWeChatClipboard(article: Article, style: StyleConfig): Promise<boolean> {
  const html = generateWeChatHtml(article, style);
  
  // Extract plain text for plain text clipboard fallback
  const plainText = article.title + '\n\n' + article.blocks.map(b => b.content).join('\n\n');

  try {
    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([plainText], { type: 'text/plain' });
      const data = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
      });
      await navigator.clipboard.write([data]);
      return true;
    } else {
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (err) {
    console.warn('Rich text copy fallback:', err);
    try {
      await navigator.clipboard.writeText(plainText);
      return true;
    } catch {
      return false;
    }
  }
}
