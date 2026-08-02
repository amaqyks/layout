import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { fetchWeChatArticleHtml } from './src/utils/wechatFetcher';

dotenv.config();

async function startServer() {
  const app = express();

  app.use(express.json());

  // API endpoint for AI Title & Article Polish
  app.post('/api/ai/polish', async (req, res) => {
    try {
      const { title, content, action } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        if (action === 'title') {
          return res.json({
            success: true,
            result: title ? `${title}：深度解析与独家视角` : '极简与美感：微信排版创作实战指南',
          });
        }
        return res.json({
          success: true,
          result: content + '\n\n【总结】精简排版，重塑高品质阅读体验。',
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      if (action === 'title') {
        const prompt = `你是一位顶尖的微信公众号爆款文章编辑。请为以下文章标题进行优选润色，生成1个极具吸引力、高点击率且符合极简与美感风格的公众号标题。直接输出标题文字，不要带引号或额外解释。\n原标题：${title || '无标题'}`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const resultText = response.text?.trim() || title;
        return res.json({ success: true, result: resultText });
      } else {
        const prompt = `你是一位微信公众号编辑大师。请对以下正文或段落进行润点，优化行文流畅度与信息层级，使其更适合手机端快速阅读。直接输出润色后的文字：\n${content}`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const resultText = response.text?.trim() || content;
        return res.json({ success: true, result: resultText });
      }
    } catch (err: any) {
      console.error('AI Polish error:', err);
      return res.status(500).json({ success: false, error: err.message || 'AI processing error' });
    }
  });

  // API endpoint for WeChat Article Theme Extraction
  app.post('/api/extract-theme', async (req, res) => {
    try {
      const { url, rawHtml } = req.body;
      let htmlContent = rawHtml || '';

      if (url && !htmlContent) {
        htmlContent = await fetchWeChatArticleHtml(url.trim());
      }

      if (!htmlContent) {
        return res.status(400).json({ success: false, error: '请提供有效的公众号文章 URL 或 HTML 内容' });
      }

      return res.json({
        success: true,
        html: htmlContent,
      });
    } catch (err: any) {
      console.error('Theme extraction error:', err);
      return res.status(500).json({ success: false, error: err.message || '抓取/解析公众号文章失败，请检查网址或尝试【直接粘贴 HTML 源码】模式' });
    }
  });

  // API endpoint for AI Layout Agent via DeepSeek API
  app.post('/api/ai/layout-agent', async (req, res) => {
    try {
      const { title, content } = req.body;
      const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-bd205bbf08c34ec79c591d879355c516';
      const apiBase = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com';

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, error: '请输入要排版的文章内容' });
      }

      const systemPrompt = `你是一位顶级微信公众号排版专家。你的唯一任务是——为用户的原始文本添加排版结构标记。内容一字不改，只做结构重组。

【核心理念】
排版是为内容服务的。好的排版让读者感受不到排版的存在。克制比炫技更重要。目标：手机端阅读体验流畅、视觉层次清晰、读者能快速抓住重点。

【铁律 · 绝对禁止】
1. 严禁增删改用户原文的任何字、词、句。
2. 严禁添加原文中不存在的观点、事实或结论。
3. 只能添加 Markdown 结构标记（##、**、>、::: callout、- 列表等）。

【第一步：通读全文，理解结构】
读完全文后，先在心里判断以下信息：
- 文章的核心主题和主要论点是什么？
- 段落之间的逻辑关系是怎样的（并列/递进/因果/对比）？
- 这是一篇什么类型的文章？

【第二步：判断文章类型，选择排版策略】

| 文章类型 | 识别特征 | 排版策略 |
|---------|----------|----------|
| 观点文 | 论点+论证，观点密集，有说理感 | 开篇>引用作引子 → 2-3个H2章节，每段1-2处关键词加粗，全文1个::: callout放核心论点 |
| 教程文 | 步骤清晰，"首先/然后/最后"，操作性强 | 每步骤一个H2，步骤内用-列表展开，文末1个::: callout总结要点 |
| 清单文 | 罗列式，"N个方法/N个技巧"，条目化 | 用简短引言开头，正文用列表，不加callout，不加引用 |
| 叙事文 | 故事线，情感为主，时间顺序 | 极简排版，不强行拆分加标题，1-2个>引用点缀，不加callout |
| 科普文 | 概念+解释，知识密集，"什么是/为什么" | 每个概念一个H2，关键术语**加粗**，1个::: callout放冷知识/核心数据 |

【第三步：段落重组】
- 每段聚焦一个核心观点，控制在手机端3-5行（约80-150字）
- 原文超过200字的段落，在句号处拆分为2段
- 不足30字的孤立短句（非引言）与相邻段落合并
- 段落间用空行分隔，增强阅读呼吸感

【第四步：标题命名规范】
- 标题不是序号（不要"一、""1."），而是该段落的实质内容概括
- 从原文该段落中提炼核心关键词，3-8字最佳
- 同级标题风格保持一致（全部用疑问句/全部用陈述句/全部用动宾结构）
- 标题不超过三级：## 为章节大标题，### 为子标题（仅在必要时使用）

【第五步：视觉元素 · 密度严格控制】

| 元素 | 密度规则 |
|------|----------|
| ## H2 标题 | ≤ 文章字数÷300，最少1个，最多6个 |
| ### H3 子标题 | 仅H2内容超过300字时使用，全文≤2个 |
| **加粗** | 每段≤2处，每处≤6个字。只加粗核心概念、关键数字、总结性短句 |
| > 引用 | 仅用于真正有启发感、总结感的完整句子，全文≤3处 |
| ::: callout | 仅保留最核心的1条结论/提醒，全文≤1个（宁可没有也不要硬凑） |
| - 列表 | 仅当原文确有3条以上并列结构时用，全文≤3处 |

【第六步：输出格式】
直接输出带 Markdown 结构标记的完整正文。不要包裹在代码块中，正文前不要加任何解释说明。

正文输出结构示例（按文章类型灵活调整，勿机械套用）：

> 适合做引言的原文金句

正文段落，包含适量 **关键词** 加粗。

## 从原文提炼的实质标题

正文段落内容。确保每段有一个核心观点，段落长度适合手机阅读。

## 第二个实质标题

正文段落内容。关键概念用 **加粗** 突出。

::: callout 核心结论
仅最关键的1条结论放这里
:::

正文段落，自然收尾。

【第七步：输出排版建议】
在正文之后，用如下格式附加排版建议（这段建议不计入正文）：

---
> **排版建议**
> - **封面图**：适合配什么风格/色调的图
> - **摘要**：一句话概括，用于公众号摘要字段
> - **其他**：是否适合拆分为系列、是否建议增加互动引导等`;

      const userPrompt = `文章标题：${title || '未命名文章'}\n\n文章内容：\n${content}`;

      const dsRes = await fetch(`${apiBase}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.6,
        }),
      });

      if (!dsRes.ok) {
        const errText = await dsRes.text();
        console.error('DeepSeek API Error:', errText);
        throw new Error(`DeepSeek API 请求失败 (${dsRes.status})`);
      }

      const dsData = await dsRes.json();
      const rawOutput = dsData.choices?.[0]?.message?.content?.trim() || content;

      // Parse out the layout suggestion section (after "---")
      // Format: ---\n> **排版建议**\n> - **封面图**：...\n> - **摘要**：...
      let bodyContent = rawOutput;
      let layoutSuggestion = '';
      const suggestionMatch = rawOutput.match(/\n---\s*\n(> \*\*排版建议\*\*[\s\S]*)$/);
      if (suggestionMatch) {
        bodyContent = rawOutput.substring(0, suggestionMatch.index!).trim();
        layoutSuggestion = suggestionMatch[1].trim();
      }

      return res.json({
        success: true,
        result: bodyContent,
        summary: 'AI 已完成结构化排版',
        layoutSuggestion,
      });
    } catch (err: any) {
      console.error('AI Layout Agent API error:', err);
      return res.status(500).json({ success: false, error: err.message || 'AI 排版 Agent 处理异常' });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const initialPort = parseInt(process.env.PORT || '3000', 10);

  function listenOnAvailablePort(currentPort: number) {
    const server = app.listen(currentPort, '0.0.0.0', () => {
      console.log(`Server successfully running on http://localhost:${currentPort}`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${currentPort} is already in use. Retrying on port ${currentPort + 1}...`);
        listenOnAvailablePort(currentPort + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  }

  listenOnAvailablePort(initialPort);
}

startServer();