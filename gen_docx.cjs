const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const outFile = "D:/at happen/layout/公众号排版助手-产品设计说明书.docx";
const baseDir = "D:/at happen/layout/_dxb";
if (fs.existsSync(baseDir)) fs.rmSync(baseDir, { recursive: true });
["_rels","docProps","word","word/_rels"].forEach(d => fs.mkdirSync(path.join(baseDir,d), {recursive:true}));

function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function E(tag, attrs, content) {
  let a = ""; if (attrs) for (let k in attrs) a += " " + k + '="' + attrs[k] + '"';
  if (content === undefined) return "<" + tag + a + "/>";
  return "<" + tag + a + ">" + content + "</" + tag + ">";
}
function emptyPara() { return E("w:p",{},E("w:r",{},"")); }
function sectionBreak() { return E("w:p",{},E("w:r",{},E("w:br",{"w:type":"page"}))); }

function heading(text, level) {
  let sz = level===1?"36":level===2?"28":"24";
  let color = level<=2?"006D33":"1B1C1C";
  let before = level===1?"480":level===2?"360":"240";
  let after = level===1?"240":level===2?"160":"120";
  let rpr = E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:b",{}) + E("w:sz",{"w:val":sz}) + E("w:color",{"w:val":color});
  let ppr = E("w:spacing",{"w:before":before,"w:after":after,"w:line":"360","w:lineRule":"auto"});
  return E("w:p",{},E("w:pPr",{},ppr) + E("w:r",{},E("w:rPr",{},rpr) + E("w:t",{"xml:space":"preserve"},esc(text))));
}

function para(text) {
  let rpr = E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:sz",{"w:val":"22"}) + E("w:color",{"w:val":"333333"});
  return E("w:p",{},E("w:r",{},E("w:rPr",{},rpr) + E("w:t",{"xml:space":"preserve"},esc(text))));
}

function bullet(text, bp) {
  let runs = "";
  if (bp) runs += E("w:r",{},E("w:rPr",{},E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:b",{}) + E("w:sz",{"w:val":"22"})) + E("w:t",{"xml:space":"preserve"},esc(bp)));
  runs += E("w:r",{},E("w:rPr",{},E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:sz",{"w:val":"22"})) + E("w:t",{"xml:space":"preserve"},esc(text)));
  let ppr = E("w:ind",{"w:left":"720"});
  return E("w:p",{},E("w:pPr",{},ppr) + runs);
}

function quote(text) {
  let ppr = E("w:ind",{"w:left":"720"}) + E("w:pBdr",{},E("w:left",{"w:val":"single","w:sz":"12","w:space":"8","w:color":"07C160"})) + E("w:shd",{"w:val":"clear","w:fill":"F0FAF4"});
  let rpr = E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:i",{}) + E("w:sz",{"w:val":"20"}) + E("w:color",{"w:val":"555555"});
  return E("w:p",{},E("w:pPr",{},ppr) + E("w:r",{},E("w:rPr",{},rpr) + E("w:t",{"xml:space":"preserve"},esc(text))));
}

function tblRow(row, isHdr, stripe) {
  let cells = row.map(function(cell) {
    let shd = "";
    if (isHdr) shd = E("w:shd",{"w:val":"clear","w:fill":"006D33"});
    else if (stripe) shd = E("w:shd",{"w:val":"clear","w:fill":"F6F3F2"});
    let rpr = E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + (isHdr?E("w:b",{}):"") + E("w:sz",{"w:val":"20"}) + (isHdr?E("w:color",{"w:val":"FFFFFF"}):"");
    return E("w:tc",{},E("w:tcPr",{},shd) + E("w:p",{},E("w:r",{},E("w:rPr",{},rpr) + E("w:t",{"xml:space":"preserve"},esc(cell)))));
  });
  return E("w:tr",{},cells.join(""));
}

function makeTable(rows, colWidths) {
  let hdr = rows[0];
  let grid = colWidths.map(function(w){return E("w:gridCol",{"w:w":String(w)},"");}).join("");
  let borders = E("w:top",{"w:val":"single","w:sz":"4","w:color":"006D33"}) + E("w:bottom",{"w:val":"single","w:sz":"4","w:color":"006D33"}) + E("w:left",{"w:val":"single","w:sz":"4","w:color":"006D33"}) + E("w:right",{"w:val":"single","w:sz":"4","w:color":"006D33"});
  let tblPr = E("w:tblW",{"w:w":"9000","w:type":"dxa"}) + E("w:jc",{"w:val":"center"}) + E("w:tblBorders",{},borders);
  let inner = tblRow(hdr, true, false);
  for (let i=1; i<rows.length; i++) {
    inner += tblRow(rows[i], false, i%2===0);
  }
  return E("w:tbl",{},E("w:tblPr",{},tblPr) + E("w:tblGrid",{},grid) + inner);
}

// ── Build body ──
let body = "";

// COVER
for (let i=0;i<8;i++) body += emptyPara();
body += E("w:p",{},E("w:pPr",{},E("w:jc",{"w:val":"center"})) + E("w:r",{},E("w:rPr",{},E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:b",{}) + E("w:sz",{"w:val":"72"}) + E("w:color",{"w:val":"006D33"})) + E("w:t",{"xml:space":"preserve"},"公众号排版助手")));
body += emptyPara();
body += E("w:p",{},E("w:pPr",{},E("w:jc",{"w:val":"center"})) + E("w:r",{},E("w:rPr",{},E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:sz",{"w:val":"40"}) + E("w:color",{"w:val":"5D5F5F"})) + E("w:t",{"xml:space":"preserve"},"产品设计说明书")));
for (let i=0;i<3;i++) body += emptyPara();
body += E("w:p",{},E("w:pPr",{},E("w:jc",{"w:val":"center"})) + E("w:r",{},E("w:rPr",{},E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:sz",{"w:val":"24"}) + E("w:color",{"w:val":"888888"})) + E("w:t",{"xml:space":"preserve"},"一款专为微信公众号创作者打造的「一键排版」工具")));
for (let i=0;i<5;i++) body += emptyPara();
body += E("w:p",{},E("w:pPr",{},E("w:jc",{"w:val":"center"})) + E("w:r",{},E("w:rPr",{},E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:sz",{"w:val":"20"}) + E("w:color",{"w:val":"AAAAAA"})) + E("w:t",{"xml:space":"preserve"},"版本：v2.0  |  日期：2026-08-03  |  状态：MVP 已交付")));
body += sectionBreak();

// TOC
body += heading("目录",1);
var tocItems = [
  ["一、产品概述","产品定位 · 核心工作流 · 技术栈"],
  ["二、设计思路","一键排版心智模型 · 三栏布局 · Markdown 数据层"],
  ["三、关键功能设计","AI 排版 · 风格模板 · 主题逆向提取 · 字符格式化 · 一键导出"],
  ["四、完整功能矩阵","已交付功能分解表"],
  ["五、亮点","6 个差异化设计优势"],
  ["六、不足与改进方向","功能缺失 · 体验细节 · 健壮性"],
  ["七、技术架构","前后端架构 + AI 排版与导出数据流"],
];
tocItems.forEach(function(x) {
  body += E("w:p",{},
    E("w:r",{},E("w:rPr",{},E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:b",{}) + E("w:sz",{"w:val":"24"}) + E("w:color",{"w:val":"006D33"})) + E("w:t",{"xml:space":"preserve"},esc(x[0]))) +
    E("w:r",{},E("w:rPr",{},E("w:rFonts",{"w:eastAsia":"Microsoft YaHei"}) + E("w:sz",{"w:val":"20"})) + E("w:t",{"xml:space":"preserve"},esc("  ——  " + x[1]))));
});
body += sectionBreak();

// 1. 产品概述
body += heading("一、产品概述",1);
body += heading("1.1 产品定位",2);
body += para("公众号排版助手是一款面向微信公众号创作者的轻量级排版工具。产品只做一件事：将用户写好的纯文本，一键转化为排版精良、风格统一的公众号文章，排好后可直接复制到公众号后台发布。");
body += para("不同于通用 Markdown 编辑器或拖拽式排版工具（如秀米、135编辑器），本产品的核心差异在于：");
body += bullet("用户不需要具备排版知识","零门槛：");
body += bullet("AI 自动完成标题层级划分、关键词高亮、引用金句标注、要点卡片生成","全自动：");
body += bullet("内置 3 套专业排版风格，一键切换","风格一致：");
body += bullet("生成微信后台完全兼容的内联样式 HTML，复制粘贴后样式零丢失","微信原生兼容：");

body += heading("1.2 核心工作流",2);
body += para("产品的心智模型极简，从打开工具到发布完成仅需四步：");
body += makeTable([
  ["步骤","操作","耗时"],
  ["①","打开工具，粘贴或撰写文字","< 30 秒"],
  ["②","点击「AI 结构化排版」按钮","1 次点击"],
  ["③","在手机预览器中确认效果，如需调整可选风格模板","< 1 分钟"],
  ["④","点击「复制正文」，粘贴到公众号后台发布","< 10 秒"],
], [1500,4000,3500]);
body += emptyPara();

body += heading("1.3 技术栈",2);
body += makeTable([
  ["层级","技术选型","说明"],
  ["前端框架","React 19 + TypeScript","组件化 SPA，类型安全"],
  ["样式方案","Tailwind CSS 4","原子化 CSS，极简设计语言"],
  ["构建工具","Vite 6","秒级 HMR，生产构建 < 90KB gzip"],
  ["后端服务","Express + tsx","API 代理 + 静态文件服务"],
  ["AI 引擎","DeepSeek Chat API","结构化排版智能体"],
  ["数据存储","localStorage","前端全量持久化"],
], [2000,3000,4000]);
body += emptyPara();
body += sectionBreak();

// 2. 设计思路
body += heading("二、设计思路",1);
body += heading("2.1 一键排版心智模型",2);
body += para("产品的核心设计理念是「输入 → 排版 → 发布」的极简闭环。用户只需提供内容，工具负责呈现——排版决策完全交给 AI。");
body += quote("设计原则：每一步的用户阻力都应被降到最低。排版不是目的，发布才是。");
body += heading("2.2 三栏工位式布局",2);
body += para("界面采用固定三栏布局，模拟「写作桌面 → 发布终端」的心智模型。左侧 230px 导航栏（项目管理/模板库/主题提取/正在编辑）、中央弹性编辑区（内容画布 + 格式化工具栏）、右侧 380px iPhone 形态预览器 + 可折叠样式面板。编辑在左，结果在右，实时同步（< 100ms 延迟），创作者无需频繁切换到手机检查效果。");
body += heading("2.3 Markdown 标记驱动的数据层",2);
body += para("所有内容以纯文本存储，字符级格式化通过轻量 Markdown 标记表达：## 表示标题、**文字** 表示加粗、*文字* 表示斜体、> 表示引用块、::: callout 表示要点卡片。编辑器 textarea 中显示原始标记，预览器和微信导出管道自动将标记转换为富文本 HTML，保证编辑、预览、导出三层之间的渲染一致性。");
body += sectionBreak();

// 3. 关键功能
body += heading("三、关键功能设计阐述",1);
body += heading("3.1 AI 一键排版（核心功能）",2);
body += para("AI 排版采用「三层漏斗」架构，逐层确保输出质量：");
body += heading("第一层：提示词策略（文章类型感知）",3);
body += para("DeepSeek system prompt 先引导 AI 判断文章类型（观点文/教程文/清单文/叙事文/科普文），再按对应策略排版——观点文重引用+章节，教程文重步骤+列表，清单文重列表+简短首尾，叙事文极简，科普文重概念+术语加粗。不是一套规则套所有文章。");
body += heading("第二层：密度控制（少即是多）",3);
body += para("AI 天然倾向过度排版。系统通过严格数值上限约束：H2 标题 ≤ 字数÷300 且最多 6 个，加粗每段 ≤ 2 处且全文占比 ≤ 15%，引用全文 ≤ 4 处，callout 全文 ≤ 2 个，列表全文 ≤ 3 处。避免满屏「重点」和碎片化结构。");
body += heading("第三层：后处理美化器",3);
body += para("AI 输出后经过 7 条规则修正：删除空标题/空引用/空列表（清理脏输出），合并过短相邻段落 < 30 字（减少碎片化），限制连续引用/callout ≤ 2 个（避免视觉疲劳），拆分过长段落 > 200 字（适配手机屏幕），控制标题数量 ≤ 8 个（防止层级过深），控制加粗密度 ≤ 15%（满屏重点=没有重点），统一列表符号（视觉一致性）。三层递进消除「AI 味」。");

body += heading("3.2 排版风格模板",2);
body += para("样式面板顶部提供 3 套预设排版风格，一键切换全局参数：");
body += makeTable([
  ["模板","主色","标题风格","字体","行高","场景"],
  ["极简绿色","#07C160","左侧色条","PingFang SC","1.75x","日常推文、生活类"],
  ["杂志黑白","#1F2937","底部粗线","Source Serif 4","1.85x","深度长文、观点类"],
  ["商务蓝","#2563EB","色块背景","Microsoft YaHei","1.70x","企业号、B2B 内容"],
], [1500,1200,1500,2000,1200,1600]);
body += emptyPara();
body += para("每套模板在卡片中展示主色色块、风格名称和简短描述，当前激活模板有绿色勾选标识。用户也可在模板基础上微调单个参数（字号、行高、段落间距均有滑块控件）。");

body += heading("3.3 模板库与主题逆向提取",2);
body += para("模板库内置 6 个模板（设计/文化/产品发布/美食/教程/松果时刻深度长文范例）。主题逆向提取是差异化功能：输入公众号文章 URL → 自动解析排版 DNA：颜色直方图取最高频非灰非白颜色作为主配色；遍历内联 style 的 font-size 和 line-height 取众数作为字号行高；检测 H2/section 的 border-left/background-color/border-bottom 推断标题装饰类型；检测 blockquote 左边框色和背景色提取引用框样式；检测圆角边框+背景色+大 padding 独立容器推断卡片类型（bordered/solid/shadow）。提取结果可在预览器中查看，确认后一键套用到当前文章或存入模板库。");

body += heading("3.4 字符级内联格式化",2);
body += para("选中编辑器中任意文字 → 点击工具栏 B（加粗）或 I（斜体）按钮（或快捷键 Ctrl+B / Ctrl+I）→ 自动在选中文字两侧包裹或取消 ** 和 * 标记。AI 排版时自动批量标注关键词加粗。预览器和导出管道自动将标记转换为 <strong> 和 <em> HTML 标签。");

body += heading("3.5 一键导出到微信公众号",2);
body += para("点击底部「复制正文」按钮 → 遍历 ContentBlock[] + StyleConfig → 生成微信兼容的全内联 style HTML → Clipboard API 同时写入 text/html 和 text/plain → 粘贴到公众号后台发布。严格遵循微信 HTML 白名单：不使用 flexbox、grid、CSS 变量、rem/em，颜色全部十六进制，所有图片带 width 属性。");
body += sectionBreak();

// 4. 功能矩阵
body += heading("四、完整功能矩阵",1);
body += makeTable([
  ["模块","功能","状态"],
  ["内容编辑","8 种内容块（H1/H2/P/图片/引用/Callout/列表/分割线）","?"],
  ["内容编辑","字符级内联格式化（加粗/斜体）+ Ctrl+B/I 快捷键","?"],
  ["内容编辑","AI 一键结构化排版（三层漏斗质控）","?"],
  ["样式系统","3 套排版风格模板，一键切换","?"],
  ["样式系统","全局参数调节（配色/字体/字号/行高/段落间距）","?"],
  ["样式系统","4 种标题装饰风格","?"],
  ["模板库","6 个内置模板 + 分类筛选 + 收藏","?"],
  ["模板库","模板套用创建新文章","?"],
  ["模板库","主题逆向提取（URL 输入/HTML 粘贴）","?"],
  ["导出","一键复制到微信（内联样式 HTML）","?"],
  ["项目管理","文章增删改查 + 搜索 + 分类","?"],
  ["项目管理","localStorage 持久化","?"],
  ["辅助","草稿保存时间戳（\u201CX 分钟前\u201D + 绿闪反馈）","?"],
  ["辅助","实时手机预览（iPhone 外壳可切换）","?"],
  ["辅助","字数统计 + 阅读时长估算","?"],
], [2000,5000,2000]);
body += emptyPara();
body += sectionBreak();

// 5. 亮点
body += heading("五、亮点",1);
var highlights = [
  ["一键排版闭环","粘贴文字 → 点一下按钮 → 排版完成。AI 理解语义后自动完成全部排版决策，用户只需确认和发布。"],
  ["三层 AI 质控漏斗","提示词层做文章类型感知，密度控制层约束 AI 不过度排版，后处理美化器消除 AI 味——三层递进确保输出质量。"],
  ["文章类型感知策略","观点文、教程文、清单文、叙事文、科普文各有不同排版节奏。AI 先判断类型再排版。"],
  ["主题逆向工程","输入公众号文章 URL → 提取排版 DNA → 生成可复用模板。市面上少有。"],
  ["极简三栏 + 实时预览","编辑/预览/样式三栏同屏，任何修改实时反映，无需切手机检查。"],
  ["微信兼容性深度定制","导出 HTML 严格遵循微信内联样式白名单，复制粘贴后样式零丢失。"],
];
highlights.forEach(function(x,i) {
  body += heading("亮点 " + (i+1) + "：" + x[0], 3);
  body += para(x[1]);
});
body += sectionBreak();

// 6. 不足
body += heading("六、不足与改进方向",1);
body += heading("6.1 功能缺失",2);
body += makeTable([
  ["问题","影响","建议方向"],
  ["无图片上传","只能引用外链 URL","集成图床或本地上传"],
  ["无 Markdown 导入","无法拖入 .md 文件","添加文件导入按钮"],
  ["无 PDF 导出","只能复制到剪贴板","增加多格式导出"],
  ["无移动端适配","桌面端专用","平板优先响应式"],
  ["模板不可原位编辑","只能「存为模板」","添加模板编辑模式"],
  ["无撤销/重做","误操作无法恢复","Command 模式 undo stack"],
], [2500,3000,3500]);
body += emptyPara();

body += heading("6.2 体验与健壮性",2);
body += makeTable([
  ["问题","说明"],
  ["字数统计不区分中英文","英文场景一个单词计多个字符"],
  ["AI API 外部依赖","DeepSeek 不可用时功能失效（已做本地回退）"],
  ["API Key 硬编码","需环境变量化以保障安全"],
  ["零测试覆盖","无单元测试或集成测试"],
  ["单用户设计","无账号系统、无云端同步"],
], [3500,5500]);
body += emptyPara();
body += sectionBreak();

// 7. 技术架构
body += heading("七、技术架构",1);
body += para("产品采用前后端分离架构，前端 React SPA 负责界面渲染、状态管理、AI 输出后处理和微信 HTML 生成；后端 Express 仅做 API 代理和静态文件服务，无数据库依赖。");
body += para("AI 排版数据流：FormattingToolbar 触发 → App.tsx 收集所有块文本并拼接 → POST /api/ai/layout-agent → server.ts 代理 DeepSeek Chat API → AI 推理输出结构化 Markdown → wechatArticleFormatter.ts 解析为 ContentBlock[] 并执行 7 条后处理规则 → React setState → 编辑器和手机预览同步刷新。");
body += para("导出数据流：FloatingActionToolbar 触发「复制正文」→ wechatExporter.ts 遍历 ContentBlock[] + StyleConfig → 生成微信兼容的全内联 style HTML → Clipboard API 同时写入 text/html 和 text/plain → 用户在公众号后台粘贴 → 样式完整保留 → 发布。");

// ── Assemble ──
let docXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\n<w:body>\n' + body + '\n<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1800" w:bottom="1440" w:left="1800"/></w:sectPr>\n</w:body>\n</w:document>';

fs.writeFileSync(path.join(baseDir,"[Content_Types].xml"), '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-officedocument.core-properties+xml"/></Types>');

fs.writeFileSync(path.join(baseDir,"_rels",".rels"), '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>');

fs.writeFileSync(path.join(baseDir,"docProps","core.xml"), '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>公众号排版助手 - 产品设计说明书</dc:title><dc:creator>Codex</dc:creator><cp:revision>1</cp:revision></cp:coreProperties>');

fs.writeFileSync(path.join(baseDir,"word","_rels","document.xml.rels"), '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');

fs.writeFileSync(path.join(baseDir,"word","styles.xml"), '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:eastAsia="Microsoft YaHei"/><w:sz w:val="22"/><w:color w:val="333333"/></w:rPr><w:pPr><w:spacing w:after="120" w:line="360" w:lineRule="auto"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:rPr><w:rFonts w:eastAsia="Microsoft YaHei"/><w:b/><w:sz w:val="36"/><w:color w:val="006D33"/></w:rPr><w:pPr><w:spacing w:before="480" w:after="240"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:rPr><w:rFonts w:eastAsia="Microsoft YaHei"/><w:b/><w:sz w:val="28"/><w:color w:val="006D33"/></w:rPr><w:pPr><w:spacing w:before="360" w:after="160"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:rPr><w:rFonts w:eastAsia="Microsoft YaHei"/><w:b/><w:sz w:val="24"/><w:color w:val="1B1C1C"/></w:rPr><w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr></w:style></w:styles>');

fs.writeFileSync(path.join(baseDir,"word","document.xml"), docXml);

// ZIP
let cwd = process.cwd();
process.chdir(baseDir);
execSync('powershell -Command "Compress-Archive -Path * -DestinationPath \\"' + outFile.replace(/\//g,'\\\\') + '\\" -Force"', {stdio:"pipe"});
process.chdir(cwd);
fs.rmSync(baseDir, { recursive: true });
console.log("DOCX done: " + outFile + " (" + fs.statSync(outFile).size + " bytes)");