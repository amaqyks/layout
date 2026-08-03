# 公众号排版助手（AI WeChat Layout）

一款面向微信公众号创作者的「AI 一键排版」工具：粘贴纯文本 → AI 自动完成结构化排版 → 选择品牌模板 → 实时手机预览 → 一键复制微信兼容 HTML，直接粘贴到公众号后台发布。

## 核心功能

- **AI 结构化排版**：调用 DeepSeek 将纯文本自动解析为标题层级、段落、引用、加粗、要点卡片等结构化内容块，不修改原文内容
- **模板系统**：内置多套排版风格模板（极简绿 / 杂志黑白 / 商务蓝等），支持一键切换、保存个人模板、删除管理
- **主题提取**：上传 Logo / 品牌图，AI 自动提取品牌色并生成专属模板
- **微信兼容导出**：输出的内联样式严格遵守微信 HTML 白名单，复制后样式完整保留
- **项目管理**：多篇文章本地管理，随时继续编辑
- **手机预览**：右侧 iPhone 形态实时预览，所见即所得

## 技术栈

- 前端：React 19 + Vite + TypeScript + Tailwind CSS 4
- 后端：Express（开发用 tsx 直跑，生产用 esbuild 打包为 `dist/server.cjs`）
- AI：DeepSeek API（OpenAI 兼容接口）

## 快速开始

**环境要求**：Node.js 18+

1. 安装依赖：`npm install`
2. 配置环境变量：复制 `.env.example` 为 `.env` 并填写：

   | 变量 | 说明 |
   |------|------|
   | `DEEPSEEK_API_KEY` | DeepSeek API Key（AI 排版功能必需） |
   | `DEEPSEEK_API_BASE` | API 地址，默认 `https://api.deepseek.com` |
   | `PORT` | 服务端口，默认 `3001` |

3. 启动开发服务器：`npm run dev`，浏览器访问 `http://localhost:3001`
4. 生产构建：`npm run build`，然后 `npm start`

## 使用流程

```
打开工具 → 粘贴/撰写文章 → 点击「AI 结构化排版」→ 选择/生成模板 → 调整样式 → 复制 HTML → 粘贴到公众号后台发布
```

## 目录结构

```
├── src/                  # 前端源码
│   ├── components/       # 编辑器、预览、工具栏等组件
│   ├── data/             # 示例文章与模板数据
│   ├── services/         # AI 布局等业务服务
│   └── utils/            # 主题提取、微信导出、格式工具
├── scripts/              # 辅助脚本（抓取、文档生成）
├── skill/                # 配套技能文档
├── server.ts             # Express 开发服务器
└── vite.config.ts        # Vite 配置
```

## 安全说明

- `.env` 包含真实密钥，已被 `.gitignore` 排除，**不会**提交到仓库
- 请勿将任何 API Key、Token 等敏感信息提交到 git