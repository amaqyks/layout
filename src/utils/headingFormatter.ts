import { ContentBlock, StyleConfig } from '../types';

// Regex to match prefixes like "一、", "1.", "①", "1. ", "一. "
export const HEADING_PREFIX_REGEX = /^(?:[一二三四五六七八九十十一十二系统百]+[、\.]\s*|\d+[、\.\s]\s*|[\u2460-\u2473]\s*)/;

/**
 * Strips any existing heading numbering prefix from the text.
 */
export function stripHeadingPrefix(text: string): string {
  if (!text) return '';
  return text.replace(HEADING_PREFIX_REGEX, '').trim();
}

/**
 * Generates the automatic heading prefix based on config.
 */
export function getHeadingPrefix(
  blockType: 'heading1' | 'heading2',
  blockId: string,
  blocks: ContentBlock[],
  styleConfig: StyleConfig
): string {
  if (blockType === 'heading1') {
    const mode = styleConfig.h1Prefix || 'none';
    if (mode === 'none') return '';
    
    const h1Blocks = blocks.filter(b => b.type === 'heading1');
    const idx = h1Blocks.findIndex(b => b.id === blockId);
    if (idx === -1) return '';
    
    const num = idx + 1;
    if (mode === 'chinese') {
      const chineseNums = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
      const textVal = chineseNums[idx] || String(num);
      return `${textVal}、`;
    } else if (mode === 'numeric') {
      return `${num}. `;
    }
  } else if (blockType === 'heading2') {
    const mode = styleConfig.h2Prefix || 'none';
    if (mode === 'none') return '';
    
    const h2Blocks = blocks.filter(b => b.type === 'heading2');
    const idx = h2Blocks.findIndex(b => b.id === blockId);
    if (idx === -1) return '';
    
    const num = idx + 1;
    if (mode === 'circles') {
      const circles = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];
      return (circles[idx] || `(${num})`) + ' ';
    } else if (mode === 'numeric') {
      return `${num}. `;
    }
  }
  return '';
}
