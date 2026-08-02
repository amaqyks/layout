import { StyleConfig } from '../types';

export interface LayoutAgentResponse {
  success: boolean;
  markdownContent?: string;
  summary?: string;
  layoutSuggestion?: string;
  error?: string;
}

// System prompt is now fully managed by server.ts to ensure consistency
// with the wechat-article-formatter SKILL.md specification.
// The server uses a comprehensive 7-step prompt that covers:
//   1. 通读全文 → 2. 文章类型判断 → 3. 段落重组
//   4. 标题命名 → 5. 视觉元素密度控制 → 6. 输出格式
//   7. 排版建议

/**
 * Executes AI Layout Agent via the server-side DeepSeek endpoint.
 */
export async function runAILayoutAgent(
  rawContent: string,
  articleTitle?: string,
  styleConfig?: StyleConfig
): Promise<LayoutAgentResponse> {
  try {
    const res = await fetch('/api/ai/layout-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: articleTitle,
        content: rawContent,
        styleConfig,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'AI 排版 Agent 处理失败');
    }

    return {
      success: true,
      markdownContent: data.result,
      summary: data.summary || 'AI 已完成文章结构化排版',
      layoutSuggestion: data.layoutSuggestion || '',
    };
  } catch (err: any) {
    console.error('AI Layout Agent error:', err);
    return {
      success: false,
      error: err.message || '调用 AI 排版失败',
    };
  }
}
