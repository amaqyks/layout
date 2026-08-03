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
      const apiKey = process.env.DEEPSEEK_API_KEY;
      const apiBase = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com';

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, error: '请输入要排版的文章内容' });
      }
      if (!apiKey) {
        return res.status(500).json({ success: false, error: '未配置 DEEPSEEK_API_KEY，请检查服务端环境变量' });
      }

      const systemPrompt = `你是一位顶级微信公众号排版专家。你的唯一任务是——为用户的原始文本添加排版结构标记。内容一字不改，只做结构重组。

【核心理念】
排版是为内容服务的。克制与合理结构比视觉花哨更重要。目标：手机端阅读体验流畅、视觉层次清晰、读者能快速抓住重点。

【铁律 · 绝对禁止】
1. 严禁增删改用户原文的任何字、词、句。
2. 严禁添加原文中不存在的观点、事实或结论。
3. 只能添加 Markdown 结构标记（#、##、###、**、>、---、- 列表等）。

【排版转换规则】

1. **标题保留序号与标点**：
   - 必须使用 \`#\` 作为文章大标题（第一行）。
   - 必须使用 \`##\` 作为章节大标题，使用 \`###\` 作为二级小标题。
   - **绝对禁止去除原文中的任何数字、序号、括号或点号前缀**：如果原文中有 "一、"、"二、"、"1."、"2."、"①"、"②" 等标记，必须原封不动地保留在标题前，例如 \`## 一、这个产品在解决什么问题\` 或 \`### ① 胜任感\`。

2. **引言与引用块规范 (\`> \`)**：
   - 全文开篇的总结段或金句导语，必须包裹在 \`> **「金句标题」**——内容\` 中。
   - 正文中的示例、案例、Prompt 等具有演示或深思性质的段落，整段使用 \`> \` 引用包裹。

3. **章节分割线 (\`--- \`)**：
   - 在每个章节大标题（\`##\`）的上方，必须加上 \`--- \` 作为结构分割线，为长文营造呼吸感。

4. **观点句与核心陈述长句加粗**：
   - 在每个章节大标题（\`##\`）下的首个核心结论句，应当将**整句进行加粗**作为独立导语段落。
   - 正文中的长句核心论点、过渡判断等，允许整句加粗（字数控制在 10-30 字以内）。
   - 并列项目词汇使用加粗标记。

5. **并列项转换为智能无序列表 (\`- \`)**：
   - 如果原文中有并列条目、步骤、选项（如“可以是情侣手册... 可以是人生日记...”），**必须重构为以 \`- \` 开头的无序列表**，并加粗列表项开头的关键词，例如：
     - \`- **情侣手册**——内容。\`

【输出格式】
直接输出带 Markdown 结构标记的完整正文。不要包裹在 \`\`\` 块中，正文前后绝对不要加任何解释或问候说明。

正文输出结构示例：

# 文章主标题

> **「做生活的漫画家」**——引言总结句。

---

## 一、章节大标题

**本章核心论点总结句整句加粗。**

### ① 二级小标题

正文内容。

- **并列项一**——描述细节。
- **并列项二**——描述细节。

---

## 二、第二个章节标题

**第二个章节核心结论。**

> **示例 / 案例：**
> 内容正文。

## 结语

正文段落，自然收尾。`;

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