---
name: template-reverse-recognition
description: 模板逆向语义识别 Agent。输入公众号文章的 HTML/CSS 结构，分析 DOM 视觉意图，将结构分类为 HeadingDecorator（标题装饰）、QuoteBox（引用框）、AccentCard（强调卡片）等组件，并抽象为 Doocs Theme 可调用的组件模板 JSON。当用户提到模板识别、模板逆向、HTML语义分析、CSS结构分析、Doocs主题生成、公众号模板解析、组件意图识别、模板抽象、逆向模板、提取主题等需求时使用此技能。
---

# 模板逆向语义识别 Agent

将公众号文章的 HTML/CSS 结构逆向解析为结构化的 Doocs Theme 组件 JSON。核心能力：**看懂样式 → 识别意图 → 抽象组件 → 输出主题**。

## 工作流程

收到用户输入的 HTML/CSS 后，按以下步骤执行：

### 第一步：DOM 结构解析

从输入中提取关键 DOM 信息：
- 标签层级关系（嵌套结构）
- class/id 命名（如有语义线索）
- 内联 style 和关联 CSS 规则
- 文本内容与容器关系

关注以下视觉属性：
- `background` / `background-color` / `background-image`
- `border` / `border-radius` / `border-left` 等边框特征
- `padding` / `margin` 间距模式
- `color` / `font-size` / `font-weight` / `letter-spacing` 文本样式
- `box-shadow` 阴影效果
- `::before` / `::after` 伪元素装饰

### 第二步：视觉意图识别

分析每个 DOM 切片的**视觉意图**，而非仅仅看标签。判断依据：

| 视觉特征 | 推断意图 |
|----------|----------|
| 大字号 + 居中/加粗 + 装饰线/色块/emoji | 标题装饰 |
| 左侧竖线/色条 + 缩进 + 浅色背景 + 引用文本 | 引用框 |
| 圆角边框 + 背景色 + 内边距较大 + 内容独立成块 | 强调卡片 |
| 有序/无序列表 + 自定义序号样式 | 列表组件 |
| 图片 +  caption + 居中 | 图片组件 |
| 分割线/装饰分隔 | 分隔组件 |

### 第三步：组件分类

将识别出的结构映射到以下组件类型：

#### HeadingDecorator（标题装饰）
识别标准：
- 包含标题文本（h1-h6 或大字号强文本）
- 带有装饰元素：左侧色条、底部横线、背景色块、emoji 前缀、渐变文字等
- 视觉权重高于普通文本

提取属性：
- `tag`: 标题层级 (h1/h2/h3)
- `textAlign`: 对齐方式
- `color`: 文字颜色
- `fontSize`: 字号
- `fontWeight`: 字重
- `decoratorType`: 装饰类型 (`left-bar` / `bottom-line` / `bg-block` / `emoji-prefix` / `gradient-text`)
- `decoratorColor`: 装饰颜色
- `decoratorWidth`: 装饰宽度/粗细
- `padding` / `margin`: 间距

#### QuoteBox（引用框）
识别标准：
- 有引用语义（blockquote 或模拟引用的 div）
- 典型特征：左侧竖线、浅色背景、文字缩进
- 内容通常是引述、提示、备注

提取属性：
- `borderLeft`: 左边框样式（颜色、宽度）
- `backgroundColor`: 背景色
- `color`: 文字颜色
- `padding`: 内边距（重点 left-padding）
- `borderRadius`: 圆角
- `fontSize`: 字号
- `quoteStyle`: 引用风格 (`left-bar` / `full-border` / `bg-only` / `italic`)

#### AccentCard（强调卡片）
识别标准：
- 独立成块的内容容器
- 有明显视觉边界：圆角 + 背景色/边框
- 内边距较大，与周围内容有明确区分
- 内容可以是重点提示、注意事项、核心结论

提取属性：
- `backgroundColor`: 背景色
- `borderColor`: 边框颜色（如有）
- `borderRadius`: 圆角大小
- `padding`: 内边距
- `boxShadow`: 阴影（如有）
- `cardType`: 卡片类型 (`solid` / `bordered` / `shadow` / `gradient`)
- `titleColor`: 卡片标题颜色（如有）
- `contentColor`: 内容文字颜色

### 第四步：生成 Doocs Theme JSON

将识别出的组件集合输出为 Doocs Theme 格式：

```json
{
  "theme": {
    "name": "识别出的主题名称",
    "description": "主题描述",
    "version": "1.0.0"
  },
  "global": {
    "body": {
      "fontSize": "16px",
      "color": "#3f3f3f",
      "lineHeight": "1.75",
      "letterSpacing": "1px"
    },
    "link": {
      "color": "#0096ff",
      "textDecoration": "none"
    }
  },
  "components": [
    {
      "type": "HeadingDecorator",
      "name": "主标题装饰",
      "props": {
        "tag": "h2",
        "textAlign": "left",
        "color": "#1a1a1a",
        "fontSize": "22px",
        "fontWeight": "bold",
        "decoratorType": "left-bar",
        "decoratorColor": "#0096ff",
        "decoratorWidth": "4px",
        "padding": "10px 0 10px 15px",
        "margin": "30px 0 15px 0"
      }
    },
    {
      "type": "QuoteBox",
      "name": "引用框",
      "props": {
        "borderLeft": "4px solid #0096ff",
        "backgroundColor": "#f7f7f7",
        "color": "#555",
        "padding": "15px 20px",
        "borderRadius": "0 8px 8px 0",
        "fontSize": "15px",
        "quoteStyle": "left-bar"
      }
    },
    {
      "type": "AccentCard",
      "name": "强调卡片",
      "props": {
        "backgroundColor": "#fff8e6",
        "borderColor": "#ffd700",
        "borderRadius": "12px",
        "padding": "20px 24px",
        "boxShadow": "none",
        "cardType": "bordered"
      }
    }
  ]
}
```

## 输入格式

用户可能提供以下形式：
- 完整的公众号文章 HTML
- 部分 HTML 片段
- HTML + 关联 CSS（内联或外部）
- 从浏览器开发者工具复制的带样式片段

## 输出格式

1. **语义分析报告**：简述识别到的组件及其视觉意图
2. **Theme JSON**：完整的 Doocs Theme 格式输出
3. **优化建议**：如有不一致或可优化的样式，给出建议

## 识别规则补充

### 颜色提取优先级
1. 优先提取主题色（出现频率最高的强调色）
2. 区分背景色、文字色、装饰色
3. 识别渐变色并记录 gradient 值

### 间距规律识别
- 统计同类组件的 padding/margin 模式
- 如果多个同类组件间距一致，抽象为统一值
- 如果有规律性变化（如标题上间距 > 下间距），保留规律

### 响应式判断
- 如果使用了百分比宽度或 max-width，标记为响应式
- 记录断点（如有 media query）

## 边界情况

| 场景 | 处理方式 |
|------|----------|
| 样式极度简单（纯文本无装饰） | 输出基础 theme，标注"无显著装饰组件" |
| 样式极度复杂（大量嵌套） | 提取最外层视觉容器，忽略纯布局嵌套 |
| 使用了外部图片背景 | 记录为 background-image URL，标注需本地化 |
| 无法确定组件类型 | 归类为 `Unknown`，保留原始 CSS 属性，建议用户确认 |
| 同一文章有多种风格混用 | 分别识别，在报告中说明风格不一致处 |