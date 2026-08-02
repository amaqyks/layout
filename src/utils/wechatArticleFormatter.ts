import { ContentBlock, Article } from '../types';

const makeId = () => `b_fmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

/**
 * Layer 3: AI 输出后处理美化器
 * 
 * 规则：
 * 1. 删除空标题、空引用、空列表
 * 2. 合并过短相邻段落（<30字）
 * 3. 限制连续引用/连续callout（最多2个连续）
 * 4. 拆分过长段落（>200字）在中文句号处断开
 * 5. 控制全文标题数量（≤8）
 * 6. 智能加粗密度控制（优先保留短关键词加粗）
 * 7. 统一列表标记符号
 * 8. 过滤低质量引用（过短或无实质内容的引用降级为段落）
 * 9. Callout 密度限制（全文≤2个）
 */
function postProcessBlocks(blocks: ContentBlock[]): ContentBlock[] {
  // Rule 1: Remove empty blocks
  let cleaned = blocks.filter(b => {
    const txt = (b.content || '').trim();
    if (b.type === 'divider') return true;
    return txt.length > 0;
  });

  // Rule 7: Normalize list markers
  cleaned = cleaned.map(b => {
    if (b.type === 'bullet_list') {
      const lines = b.content.split('\n').map(line =>
        line.replace(/^[���\-\*\d+\.]\s*/, '').trim()
      ).filter(Boolean);
      return { ...b, content: lines.join('\n') };
    }
    return b;
  });

  // Rule 2: Merge very short adjacent paragraphs
  const merged: ContentBlock[] = [];
  for (let i = 0; i < cleaned.length; i++) {
    const curr = cleaned[i];
    if (
      curr.type === 'paragraph' &&
      merged.length > 0 &&
      merged[merged.length - 1].type === 'paragraph' &&
      (curr.content || '').trim().length < 30
    ) {
      const prev = merged[merged.length - 1];
      prev.content = prev.content + '\n' + curr.content;
      continue;
    }
    merged.push({ ...curr });
  }

  // Rule 8: Filter low-quality quotes (too short or no substance)
  const quoteFiltered = merged.map(b => {
    if (b.type !== 'quote') return b;
    const txt = (b.content || '').trim();
    // Remove ** markers for length check
    const plainText = txt.replace(/\*{1,2}(.+?)\*{1,2}/g, '$1');
    // Quotes shorter than 12 chars are likely not meaningful quotes
    if (plainText.length < 12) {
      return { ...b, type: 'paragraph' as const, caption: undefined };
    }
    return b;
  });

  // Rule 3: Limit consecutive quotes/callouts
  const limited: ContentBlock[] = [];
  let consecutiveSpecial = 0;
  for (const b of quoteFiltered) {
    if (b.type === 'quote' || b.type === 'callout') {
      consecutiveSpecial++;
      if (consecutiveSpecial > 2) {
        limited.push({ ...b, type: 'paragraph' as const, caption: undefined });
        continue;
      }
    } else {
      consecutiveSpecial = 0;
    }
    limited.push(b);
  }

  // Rule 9: Limit callout count (max 2, keep first ones)
  let calloutCount = 0;
  const calloutLimited = limited.map(b => {
    if (b.type === 'callout') {
      calloutCount++;
      if (calloutCount > 2) {
        return { id: makeId(), type: 'paragraph' as const, content: (b.caption ? '**' + b.caption + '**\n' : '') + (b.content || '') };
      }
    }
    return b;
  });

  // Rule 4: Split long paragraphs at Chinese sentence boundaries
  const split: ContentBlock[] = [];
  for (const b of calloutLimited) {
    if (b.type === 'paragraph' && (b.content || '').length > 200) {
      // Split on Chinese/English sentence-ending punctuation, keeping the delimiter
      const sentences = b.content.split(/(?<=[。！？；\.\!\?])/);
      let chunk = '';
      for (const s of sentences) {
        if ((chunk + s).length > 120 && chunk.length > 40) {
          split.push({ id: makeId(), type: 'paragraph', content: chunk.trim() });
          chunk = s;
        } else {
          chunk += s;
        }
      }
      if (chunk.trim()) {
        split.push({ id: makeId(), type: 'paragraph', content: chunk.trim() });
      }
    } else {
      split.push(b);
    }
  }

  // Rule 5: Limit headings
  const headingCount = split.filter(b => b.type === 'heading1' || b.type === 'heading2').length;
  if (headingCount > 8) {
    const reduced: ContentBlock[] = [];
    let hCount = 0;
    for (const b of split) {
      if ((b.type === 'heading1' || b.type === 'heading2') && hCount >= 8) {
        reduced.push({ id: makeId(), type: 'paragraph', content: '**' + b.content + '**' });
      } else {
        if (b.type === 'heading1' || b.type === 'heading2') hCount++;
        reduced.push(b);
      }
    }
    return controlBoldDensity(reduced);
  }

  return controlBoldDensity(split);
}

/**
 * Rule 6: 智能加粗密度控制
 * 全文 ** 标记总字符数不超过文本总长度的 15%
 * 优先保留短关键词加粗（≤6字），移除长句加粗
 */
function controlBoldDensity(blocks: ContentBlock[]): ContentBlock[] {
  let totalText = 0;
  let boldText = 0;

  for (const b of blocks) {
    const txt = b.content || '';
    totalText += txt.length;
    const boldMatches = txt.match(/\*\*(.+?)\*\*/g);
    if (boldMatches) {
      boldText += boldMatches.reduce((sum, m) => sum + m.length, 0);
    }
  }

  const density = totalText > 0 ? boldText / totalText : 0;
  if (density <= 0.15) return blocks;

  // Smart reduction: keep short keyword bolds (≤6 chars inner text), strip long-phrase bolds
  return blocks.map(b => {
    if (b.type !== 'paragraph' && b.type !== 'quote' && b.type !== 'bullet_list') return b;
    let content = b.content || '';
    // Only strip bolds where the inner text is a long phrase (>6 chars)
    content = content.replace(/\*\*(.+?)\*\*/g, (match, inner) => {
      if (inner.length <= 6) return match; // Keep short keyword bolds
      return inner; // Strip long-phrase bolds
    });
    return { ...b, content };
  });
}

/**
 * Parse AI Layout Agent output into ContentBlock[]
 * Includes full post-processing pipeline
 */
export function parseFormattedMarkdownToBlocks(aiOutput: string): ContentBlock[] {
  const lines = aiOutput.split('\n');
  const rawBlocks: ContentBlock[] = [];
  let inCallout = false;
  let calloutCaption = '';
  let calloutContent: string[] = [];

  const cleanHeading = (s: string) => s.replace(/^#{1,3}\s*/, '').trim();
  const cleanQuote = (s: string) => s.replace(/^>\s*/, '').trim();
  const cleanList = (s: string) => s.replace(/^[���\-\*]\s*/, '').trim();

  const pushCallout = () => {
    if (calloutContent.length > 0) {
      rawBlocks.push({
        id: makeId(),
        type: 'callout',
        content: calloutContent.join('\n'),
        caption: calloutCaption || '📌',
      });
    }
    calloutContent = [];
    calloutCaption = '';
    inCallout = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // ::: callout blocks — start
    if (trimmed.startsWith('::: callout')) {
      if (inCallout) { pushCallout(); }
      inCallout = true;
      calloutCaption = trimmed.replace(/^:::\s*callout\s*/i, '').trim();
      if (!calloutCaption) calloutCaption = '📌';
      continue;
    }
    // ::: callout blocks — end
    if (trimmed === ':::') {
      if (inCallout) { pushCallout(); }
      continue;
    }
    if (inCallout) { calloutContent.push(trimmed); continue; }

    // Headings
    if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      rawBlocks.push({
        id: makeId(),
        type: trimmed.startsWith('### ') ? 'heading2' : 'heading1',
        content: cleanHeading(trimmed),
      });
      continue;
    }

    // Quotes
    if (trimmed.startsWith('> ')) {
      rawBlocks.push({ id: makeId(), type: 'quote', content: cleanQuote(trimmed) });
      continue;
    }

    // Lists — merge consecutive
    if (trimmed.match(/^[���\-\*]\s/)) {
      const last = rawBlocks[rawBlocks.length - 1];
      if (last && last.type === 'bullet_list') {
        last.content += '\n' + cleanList(trimmed);
      } else {
        rawBlocks.push({ id: makeId(), type: 'bullet_list', content: cleanList(trimmed) });
      }
      continue;
    }

    // Dividers
    if (trimmed === '---' || trimmed === '***') {
      rawBlocks.push({ id: makeId(), type: 'divider', content: '' });
      continue;
    }

    // Default: paragraph
    rawBlocks.push({ id: makeId(), type: 'paragraph', content: trimmed.replace(/^#+\s*/, '') });
  }

  if (inCallout) pushCallout();

  // Run post-processing pipeline
  return postProcessBlocks(rawBlocks);
}

/**
 * Fallback: 本地格式化 — 对现有文章块做基础规则修正
 * 当 AI API 不可用时使用
 */
export function formatArticleByWechatSkill(article: Article): ContentBlock[] {
  const blocks = article.blocks.filter(b => b.content?.trim() || b.type === 'divider');
  if (blocks.length === 0) return blocks;

  // Apply post-processing rules to existing blocks
  return postProcessBlocks(blocks.map(b => ({ ...b })));
}