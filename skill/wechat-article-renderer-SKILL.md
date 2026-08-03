---
name: wechat-article-renderer
description: 公众号文章渲染 Agent。将 Markdown 格式的文章结构 + Doocs Theme 主题 JSON 合并渲染，生成可直接复制到微信公众号后台的 HTML 富文本。当用户提到公众号渲染、文章转HTML、生成公众号HTML、Markdown转公众号、公众号富文本、复制HTML到公众号、渲染公众号文章、公众号HTML输出、发布公众号等需求时使用此技能。
---

# 公众号文章渲染 Agent

将 **Markdown 文章结构** + **Doocs Theme 主题 JSON** 合并渲染，输出可直接粘贴到微信公众号后台的 HTML 富文本。

核心原则：**生成的 HTML 必须兼容微信公众号编辑器**，用户复制粘贴后样式不丢失。

## 工作流程

收到用户输入后，按以下步骤执行：

### 第一步：解析输入

确认用户提供了什么：
- **文章结构**（必须有）：Markdown 格式的文章，包含标题、段落、列表、引用等
- **主题模板**（必须有）：Doocs Theme JSON，包含 global 全局样式和 components 组件样式
- 如果用户只提供文章没提供主题 → 使用内置默认主题
- 如果用户只提供主题没提供文章 → 提示需要同时提供文章

### 第二步：Markdown → HTML 结构转换

将 Markdown 解析为 HTML DOM 结构：

| Markdown 元素 | HTML 标签 | 说明 |
|--------------|-----------|------|
| `# 标题` | `<h1>` | 全文仅一个 |
| `## 标题` | `<h2>` | 章节标题 |
| `### 标题` | `<h3>` | 子章节 |
| `段落文本` | `<p>` | 正文段落 |
| `**加粗**` | `<strong>` | 强调文本 |
| `*斜体*` | `<em>` | 次要强调 |
| `> 引用` | `<blockquote>` | 引用块 |
| `- 列表项` | `<ul><li>` | 无序列表 |
| `1. 列表项` | `<ol><li>` | 有序列表 |
| `---` | `<hr>` | 分隔线 |
| `[图片](url)` | `<img>` | 图片 |
| `` `代码` `` | `<code>` | 行内代码 |
| 代码块 | `<pre><code>` | 代码块 |

### 第三步：应用主题样式

根据 Theme JSON 中的 global 和 components 配置，为每个 HTML 元素注入**内联样式**。

#### 全局样式映射

```
global.body → 应用到 <section> 根容器
global.link → 应用到 <a> 标签
```

#### 组件样式映射

根据 HTML 标签匹配 Theme JSON 中的 components：

```
HeadingDecorator → 应用到 <h1>/<h2>/<h3>
QuoteBox → 应用到 <blockquote>
AccentCard → 应用到带有标记的容器 <section>
```

**匹配规则：**
1. 遍历 components 数组
2. 按 type 匹配 HTML 标签
3. 将 props 中的样式属性转为内联 style 字符串
4. 如果同类型有多个组件定义，按顺序应用（第一个匹配 h2，第二个匹配 h3，以此类推）

#### 样式属性转换规则

将 JSON props 转为 CSS 内联样式：

```json
// props 输入
{
  "fontSize": "22px",
  "color": "#1a1a1a",
  "fontWeight": "bold",
  "decoratorType": "left-bar",
  "decoratorColor": "#0096ff",
  "decoratorWidth": "4px",
  "padding": "10px 0 10px 15px"
}
```

```css
/* CSS 输出 */
font-size: 22px;
color: #1a1a1a;
font-weight: bold;
padding: 10px 0 10px 15px;
border-left: 4px solid #0096ff;  /* 由 decoratorType=left-bar 推导 */
```

#### 装饰类型渲染方案

**HeadingDecorator.decoratorType:**
- `left-bar` → `border-left: {width} solid {color}; padding-left: 15px`
- `bottom-line` → `border-bottom: {width} solid {color}; padding-bottom: 10px`
- `bg-block` → `background-color: {decoratorColor}; padding: 10px 15px; border-radius: 4px`
- `emoji-prefix` → 在标题前添加装饰 emoji（如有）
- `gradient-text` → `background: linear-gradient(...); -webkit-background-clip: text; color: transparent`

**QuoteBox.quoteStyle:**
- `left-bar` → `border-left: 4px solid {borderLeftColor}; background: {bgColor}; padding: 15px 20px`
- `full-border` → `border: 1px solid {borderColor}; background: {bgColor}; border-radius: 8px`
- `bg-only` → 仅 `background: {bgColor}; padding: 15px 20px`
- `italic` → `font-style: italic; color: {color}; padding-left: 20px; border-left: 2px solid #ddd`

**AccentCard.cardType:**
- `solid` → `background: {bgColor}; border-radius: {radius}; padding: {padding}`
- `bordered` → `border: 1px solid {borderColor}; border-radius: {radius}; padding: {padding}`
- `shadow` → `background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.1); border-radius: {radius}; padding: {padding}`
- `gradient` → `background: linear-gradient(...); border-radius: {radius}; padding: {padding}`

### 第四步：微信兼容化处理

**这一步至关重要。** 微信公众号编辑器有大量限制，必须确保生成的 HTML 能正确渲染：

#### 必须遵守的规则

1. **只使用内联样式** — 微信会剥离 `<style>` 标签和 class 样式
2. **禁止 JavaScript** — `<script>` 标签会被完全移除
3. **禁止外部资源** — 不能引用外部 CSS/JS/字体
4. **使用 section 作为根容器** — 不要用 `<article>` 或 `<main>`
5. **颜色只用十六进制** — 不用 rgb()、hsl()、CSS 变量
6. **字号用 px** — 微信不支持 rem/em 相对单位
7. **图片必须带 width** — 否则可能显示异常
8. **不用 flexbox** — 兼容性差，用 table 布局或 margin/padding 替代
9. **不用 CSS Grid** — 同上
10. **渐变谨慎** — 部分渐变写法不兼容，用 `-webkit-` 前缀兜底
11. **box-shadow 有限支持** — 用 `border` 模拟更安全
12. **行高用无单位数值** — `line-height: 1.75` 而非 `line-height: 28px`

#### 样式白名单（高兼容）

这些属性和值在微信中稳定工作：
- `color`, `background-color`, `font-size`, `font-weight`, `font-style`
- `text-align`, `text-decoration`, `text-indent`, `letter-spacing`
- `line-height`, `margin`, `padding`
- `border`, `border-left`, `border-radius`
- `width`, `max-width`, `height`
- `display: inline-block / block`
- `vertical-align`

#### 样式黑名单（避免使用）

- `display: flex / grid`
- `position: fixed / sticky`
- `@media` 查询
- `transform`, `transition`, `animation`
- `var(--css-variable)`
- `calc()`
- `::before`, `::after`（部分支持，不可靠）

### 第五步：输出 HTML

输出格式：

```html
<section style="font-size: 16px; color: #3f3f3f; line-height: 1.75; letter-spacing: 1px; padding: 10px 8px;">

  <!-- 标题 -->
  <h2 style="font-size: 22px; color: #1a1a1a; font-weight: bold; border-left: 4px solid #0096ff; padding: 10px 0 10px 15px; margin: 30px 0 15px 0;">
    章节标题
  </h2>

  <!-- 正文段落 -->
  <p style="margin: 15px 0; text-align: justify;">
    正文内容...<strong style="color: #0096ff;">强调文字</strong>...
  </p>

  <!-- 引用框 -->
  <blockquote style="border-left: 4px solid #0096ff; background-color: #f7f7f7; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; font-size: 15px; color: #555;">
    引用内容
  </blockquote>

</section>
```

## 输入格式

用户可能提供：
- Markdown 文章（纯文本或代码块）
- Doocs Theme JSON（代码块或文件）
- 两者一起或分步提供

## 输出格式

1. **完整的 HTML 代码**（用代码块包裹，方便复制）
2. **预览说明**：简述关键样式应用情况
3. **使用指引**：告知用户复制 HTML 后如何粘贴到公众号后台

## 默认主题

当用户未提供主题 JSON 时，使用以下默认主题：

```json
{
  "theme": {
    "name": "默认主题",
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
      "color": "#0096ff"
    }
  },
  "components": [
    {
      "type": "HeadingDecorator",
      "props": {
        "tag": "h2",
        "color": "#1a1a1a",
        "fontSize": "20px",
        "fontWeight": "bold",
        "decoratorType": "left-bar",
        "decoratorColor": "#0096ff",
        "decoratorWidth": "4px",
        "padding": "8px 0 8px 12px",
        "margin": "25px 0 15px 0"
      }
    },
    {
      "type": "QuoteBox",
      "props": {
        "borderLeft": "4px solid #0096ff",
        "backgroundColor": "#f7f7f7",
        "color": "#555",
        "padding": "12px 18px",
        "borderRadius": "0 6px 6px 0",
        "fontSize": "15px"
      }
    }
  ]
}
```

## 边界情况

| 场景 | 处理方式 |
|------|----------|
| 用户只提供文章没提供主题 | 使用默认主题渲染 |
| 主题 JSON 缺少某些组件定义 | 该组件使用内置 fallback 样式 |
| 文章包含代码块 | 用 `background: #f8f8f8; padding: 12px; border-radius: 4px; font-family: monospace` 渲染 |
| 文章包含图片链接 | 输出 `<img>` 标签，提醒用户需在公众号后台重新上传 |
| 主题中有不兼容微信的样式 | 自动降级为兼容写法，在预览说明中标注 |
| 文章内容中有 HTML 特殊字符 | 自动转义 `<` `>` `&` 等字符 |