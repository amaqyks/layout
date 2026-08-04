# 🎨 公众号排版助手 (WeChat Markdown Editor AI)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4.svg)](https://tailwindcss.com/)

一款面向微信公众号创作者与极客的 **「AI 智能结构化排版系统」**。只需粘贴纯文本，AI 自动完成结构化梳理、智能加粗与分排；支持公众号文章逆向解构提取模板、标题序号规范切换、悬挂缩进列表与全历史快捷键撤回。一键复制兼容微信白名单的 HTML，直接粘贴至公众号后台极速发布。

---

## ✨ 核心亮点

### 🤖 1. AI 结构化智能排版 (DeepSeek-driven Layout Agent)
- **零修改内容**：严禁改变用户原文字词，仅做视觉与结构优化。
- **序列标题一致性**：自动识别并保护并列子论点（如 `矛盾 1`、`矛盾 2`、`矛盾 3` 等），统一赋予主题装饰线。
- **黄金阅读导语**：章节首段观点整句加粗，手机端阅读体验舒畅。
- **多行引用框防护**：多步骤 Prompt 或金句引用整块收纳，绝不被切碎。

### 🔍 2. 公众号文章模板逆向解构提取
- **链接/HTML 逆向**：输入任意已知公众号文章 URL 或网页源码，自动反编译提取其主主题色、正文字号、行高、引用样式。
- **自定义模板命名**：解构成功后支持自定义命名保存并一键套用。

### 📌 3. 标题序号规范与悬挂缩进列表
- **标题序号规范**：支持在 `一、标题`（中文数字）、`1. 标题`（阿拉伯数字）、`① 标题`（圆圈数字）及 `无序号` 之间自由切换。
- **微信悬挂缩进 Flex 列表**：采用微信专用 Flexbox 列表结构，列表圆点色与主题完美呼应，解决传统 HTML 列表多行对齐错位与样式被剥离的痛点。

### ↺ 4. 全局撤回重做与快捷操作
- **历史快照与撤回**：支持 `Ctrl + Z` (撤回) / `Ctrl + Y` (重做)，涵盖清空文字、模版切换、AI 排版等重度操作。
- **清空文字**：一键清空全部正文，完美保留当前选中模板与版式配置。

---

## 🛠️ 技术栈

- **前端**：React 19 + TypeScript + Vite + Tailwind CSS v4 + Material Symbols
- **后端服务**：Express Server (`server.ts`)
- **AI 引擎**：DeepSeek API (`deepseek-chat`)
- **构建打包**：Vite (Client) + esbuild (Server CJS Bundle)

---

## 🚀 快速开始

### 1. 环境准备
确保您的本地环境已安装 **Node.js 18+**。

### 2. 克隆与安装依赖
```bash
git clone https://github.com/amaqyks/layout.git
cd layout
npm install
```

### 3. 配置环境变量
复制 `.env.example` 为 `.env` 并填写 API 密钥：
```bash
cp .env.example .env
```
编辑 `.env` 文件：
```ini
PORT=3001
DEEPSEEK_API_KEY="your_deepseek_api_key_here"
DEEPSEEK_API_BASE="https://api.deepseek.com"
```

### 4. 启动开发服务器
```bash
npm run dev
```
打开浏览器访问：`http://localhost:3001`

### 5. 生产构建与启动
```bash
npm run build
npm start
```

---

## 📂 项目目录结构

```
layout/
├── src/
│   ├── components/         # 编辑器、实时预览、模板切换与历史控制组件
│   ├── data/               # 预置优秀长文模板与预设样式数据
│   ├── services/           # AI 排版 Agent 业务调优逻辑
│   ├── types.ts            # TypeScript 核心数据模型 (StyleConfig/Article)
│   └── utils/              # HTML 解析器、微信白名单导出器、模板提取器
├── docs/                   # AI 调优文档、错误处理与隐私合规说明
├── server.ts               # Express API 服务与 DeepSeek 代理
├── .env.example            # 环境变量占位模版 (无敏感密钥)
├── README.md               # 项目说明文档
└── vite.config.ts          # Vite 打包配置
```

---

## 🔒 隐私与安全说明

- **密钥隔离**：`.env` 包含敏感密钥，已列入 `.gitignore`，**不会**被提交到 GitHub 仓库。
- **零数据追踪**：本框架不内置任何第三方 Trackers、Google Analytics 或广告 SDK。
- **微信兼容**：所有排版元素采用内联 CSS（Inline Styles），完全符合微信公众号后台富文本白名单规范。

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 协议开源。