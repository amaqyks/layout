import { Article, StyleConfig } from '../types';

export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  primaryColor: '#07C160',
  fontFamily: 'Be Vietnam Pro',
  fontSize: 16,
  lineHeight: 1.75,
  paragraphSpacing: 16,
  headingStyle: 'left-border',
  quoteStyle: 'card',
};

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: 'proj-1',
    title: '输入文章标题...',
    author: '微信排版助手',
    date: '2023-10-24',
    category: '设计类',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgPKnuD2I3dmK13vIZ4P0fN-5VAEu2m1S0nDxNkASWpR8sW5tLAAgXvUcpp-Zk5CTGHZ2xRz2azw9Szh4G2l0vmaZA6K2SwT9br6ASErbpKIFLg0POgQfK5WhmN3ej37G0MzoJx0kZLnueyROO77blBPt9TqrLhj26tiSg7AMNToJHbrD4F7a5gvqN2F56rkZQ4u8Y5VVSAvU_9UZXb38RLUuzJ-yElXh6O_Rqs1XwdpV0woiy-4IE',
    updatedAt: '2023年10月24日',
    blocks: [
      {
        id: 'b1',
        type: 'paragraph',
        content: '在数字内容创作的时代，效率与美感的平衡是每一位编辑者的追求。微信排版助手旨在为创作者提供一个沉浸式的、无干扰的编辑环境，让文字与排版设计无缝融合。',
      },
      {
        id: 'b2',
        type: 'image',
        content: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUhAhGK4g1LR2VqeAgo9g0EjAQ8DZxrVsP38Po1y4oAP8NbH3TDU4WMYhIJ7P4nMa4tyNfgSZH82_GMbFRePmFS6Vi4Wh2XytCAlPm6mka8hc9APMx5UT6H6D1GgwuekWVNs86BExiEu0WvI_0d67Q3vPFaK1UmoP6YS3Kf1x85t1EGzY6XrS-Xqmv0unIwpeYBSXvmjnYuwWhnIW8xHAkuIohwepbAfXh-5rC03wlMKSrYX5hOqq5',
        caption: '图 1: 极简主义工作空间的视觉表达',
      },
      {
        id: 'b3',
        type: 'heading1',
        content: '极致的排版哲学',
      },
      {
        id: 'b4',
        type: 'paragraph',
        content: '通过“工位”式的设计哲学，我们将界面设计作为内容的陪衬。高品质的留白和有限的、具有目的性的色彩选择，确保了用户的认知负载完全聚焦在编辑过程本身。',
      },
      {
        id: 'b5',
        type: 'paragraph',
        content: '编辑器支持实时预览。在右侧的模拟器中，你可以立即看到文章在手机端的真实呈现效果。',
      },
    ],
  },
  {
    id: 'proj-2',
    title: '每周新闻汇总：科技与设计前沿',
    author: '微信排版助手',
    date: '2023-10-22',
    category: '新闻周刊',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFZ74BhGtDhCK5KD-XO-NYZXwjjV9bxTjAmXpKV9o3JagvRVky8SrbEl3M-TyyBTC90XI1kL9Y-2exTFsOVDwtWD7kPlVvaJyXKaPdEFDaYpVZzUpHNT1UVeZj3Gvh3aepaQfljzB_c790ChCEslukW-GJPmDixWqIT-igfg8T60HqN212sw1XDnBeATvO3J9bUscLeZ5etrBaF3VBswJgTlZGdWLdwr0jEMERQsYlHe2x2w2iL-J-',
    updatedAt: '2023年10月22日',
    blocks: [
      {
        id: 'nb1',
        type: 'paragraph',
        content: '【重大里程碑】项目 Alpha 第一阶段成功交付！团队完成3.5.0大版本更新，全面提升移动端编辑体验与排版效率。',
      },
      {
        id: 'nb2',
        type: 'callout',
        content: '【团队动态】欢迎新成员加入产品部！【安全公告】系统维护通知（10月25日）。',
        caption: '每周简讯要闻',
      },
      {
        id: 'nb3',
        type: 'heading1',
        content: '本周亮点之星',
      },
      {
        id: 'nb4',
        type: 'paragraph',
        content: '最佳贡献者：李明（开发）——“效率是第一生产力！”；效率先锋：王芳（设计）——“对美感绝不妥协！”',
      },
    ],
  },
  {
    id: 'proj-3',
    title: '都市探店指南：秋季篇',
    author: '微信排版助手',
    date: '2023-10-18',
    category: '生活方式',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsZmr_igTQNq1ENnMtWWK6W-JCxGla0hu482Pka_IWHYzCJhT5Yek-aA8RYQyq-AW4EEWX5aQZpDhTTdCPXTgk8f8aOGvmyYVXi4zPknTmRpxQfzQZKTyKpQkmDBhh2WuMwT-8cWramSlCY1heoOqMFGjq5b6hTU8I7b9FO6QBnWg93vKT5dZjfOhunO1JhWjd13UrNYkGswiaE6cddc9lxqNQFu7zNIywE0VnTrAp7ATYe22ZczxA',
    updatedAt: '2023年10月18日',
    blocks: [
      {
        id: 'tb1',
        type: 'heading1',
        content: '隐匿于街角的小众咖啡馆',
      },
      {
        id: 'tb2',
        type: 'paragraph',
        content: '秋意渐浓，找一个温暖的下午，漫步于梧桐树下的街道。每一家精心打理的小店，都藏着一段独特的人情故事与味蕾惊艳。',
      },
      {
        id: 'tb3',
        type: 'image',
        content: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5yGV_K2CTZA-KixQBi9LldWeGKWoqkUfxuaipiH2ubmT7oy0yq_-10lCehd2ONLKAqzBsg8tLW7g96MEQcF9UP1CmmBdtZCljnfsWOUJFAa1YISpcZxH7jUDuw4nIeaRTbSytH1ezLCpsOsgp6PuU2HbmxCRFDxwiJ_fVo0fIBo7h-mow3gSstHQOM5IhPUnS78E7lzP2BBV4XEsR01NHFjrK1YTVQyBiSsrXvjXY2nfy-D4yn3l_',
        caption: '秋日阳光下的植物与自然咖啡特调',
      },
    ],
  },
  {
    id: 'proj-4',
    title: '2023行业趋势分析',
    author: '微信排版助手',
    date: '2023-10-15',
    category: '商业报告',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCN6AmIDWJvlQaQzbkVcPBmqC7fs7F7NBNmc33CSnQzS__KiNQIYYMAZSAKORYN0AS1MELIU76WFwq_aV4gYQHaVq4puLyvst9UblfVBEcp4lyk4rGAdOQag0munoMhzPPmj0b3ZZ5OuaoXO9ucR_11oZ8_fLKekJSInqO4qZegII6iwBM__PnIEFy-QY-W4pirN_17mR39PS3f7Ml0u8rQbxg39yRjDP7QdMyyOPU1CmYelk_lkJO',
    updatedAt: '2023年10月15日',
    blocks: [
      {
        id: 'bb1',
        type: 'heading1',
        content: '数字化转型与智能化浪潮',
      },
      {
        id: 'bb2',
        type: 'paragraph',
        content: '基于过去一年的市场数据，企业在AI工具赋能与内容生产自动化方面的投入增长了近140%。效率提升正深刻重塑内容营销生态。',
      },
      {
        id: 'bb3',
        type: 'quote',
        content: '“技术的本质是让人回归创造力的核心，而非被繁琐的机械操作束缚。”',
      },
    ],
  },
  {
    id: 'proj-5',
    title: '灵感瞬间：艺术访谈录',
    author: '微信排版助手',
    date: '2023-10-10',
    category: '艺术访谈',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAWvtx_EOTAt5fftjDkW6-lngn2XlAljTxmWGRcR8dDpDXbkz40yeONBQ1XILvJncGhT9SnF_3zHkVtn96UuB38ItIzyNEvMYV1qt7gplmuFgmRFkhZ3V3wEZzFIbcgzMjnE3OJFI-4KVg8CaaoNv_Aznq78M8HG4X8C3ahrbJ42S6sSg72aJZyEF47LMyYS1-2XmC4_UN_wO66UV_sdIPzilzkgocdIq53i-ZD2cZzqpppZuTc_Eh',
    updatedAt: '2023年10月10日',
    blocks: [
      {
        id: 'ab1',
        type: 'heading1',
        content: '对话当代艺术家：探索创意背后的故事',
      },
      {
        id: 'ab2',
        type: 'paragraph',
        content: '色彩与线条如何表达内心未被道明的秩序？在本期特辑中，我们邀请到了视觉艺术家 Eliza，聊聊她关于空间、触感与留白的创作哲学。',
      },
    ],
  },
];

export const SAMPLE_TEMPLATES: Article[] = [
  {
    id: 'tpl-1',
    title: '极简新闻模板',
    author: '微信排版助手',
    date: '2023-10-24',
    category: '编辑 • 新闻',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjgfSi7qkQ55aZKZHkQuZN5zVTNRk6GsoMo8JyeoYlkNDgFtNOI_SWE8_YxhB-ZV8OKWy6PBgMbJ6wZ1bdtdE6IO050NLuzFz2mPbo1IO8deNNty1UWE174ylpfnnGiO2pIFEYSi-owUTSUTf4zHgAiMuQZAp3odmcoa9Zksq9G4jEq0J8-2HXuFXgUiipf7MLBPYEloNi9SyzXytZ7WHuQDWUzSF5y1Ktfx-xMidzw-8kv9P-CYf2',
    updatedAt: '2023年10月24日',
    isTemplate: true,
    description: '适合每日资讯、清爽排版与快讯发布的标准极简风格。',
    styleConfig: {
      primaryColor: '#07C160',
      fontFamily: '-apple-system-font, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
      fontSize: 16,
      lineHeight: 1.75,
      paragraphSpacing: 16,
      headingStyle: 'left-border',
      quoteStyle: 'simple'
    },
    highlightHabits: [
      { name: '核心结论加粗', style: '加粗 + 主色调', scene: '今日要闻 / 核心提要', badgeColor: '#07C160' }
    ],
    blocks: [
      {
        id: 't1_b1',
        type: 'paragraph',
        content: '【今日要闻】在这里输入您的新闻导语或摘要内容，保持语言精炼干净。',
      },
      {
        id: 't1_b2',
        type: 'heading1',
        content: '核心要点分析',
      },
      {
        id: 't1_b3',
        type: 'paragraph',
        content: '第一部分详细展开新闻背景，配合高清晰度配图呈现专业态度。',
      },
      {
        id: 't1_b4',
        type: 'image',
        content: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUhAhGK4g1LR2VqeAgo9g0EjAQ8DZxrVsP38Po1y4oAP8NbH3TDU4WMYhIJ7P4nMa4tyNfgSZH82_GMbFRePmFS6Vi4Wh2XytCAlPm6mka8hc9APMx5UT6H6D1GgwuekWVNs86BExiEu0WvI_0d67Q3vPFaK1UmoP6YS3Kf1x85t1EGzY6XrS-Xqmv0unIwpeYBSXvmjnYuwWhnIW8xHAkuIohwepbAfXh-5rC03wlMKSrYX5hOqq5',
        caption: '新闻配图说明',
      },
    ],
  },
  {
    id: 'tpl-2',
    title: '艺术家访谈模板',
    author: '微信排版助手',
    date: '2023-10-24',
    category: '杂志 • 文化',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH6sfxIBr5eDEKiwq2L8DTl-4HEgZoMhro5LgKNekQf9eCLSkRMF6JJuaSYX56O9V0MvVg6PGj_tHxVEjxQScEhXjf8Lmq4CdInc5807i2m4FOvA0jfnGOP3YBfW5sd7vIvlZDXT6nX03fgvvMFmNzjdFG8Fty0G_6-FJH520N0lBl-zJO1Zpe3v1O4j58s0HkraLIHhJswLpHKcp4e1MaW8Do1KHvlB8UgVwegXC-F-7KgtEvgC0v',
    updatedAt: '2023年10月24日',
    isTemplate: true,
    description: '长篇故事、深度访谈与人文专访的理想大留白排版。',
    styleConfig: {
      primaryColor: '#722ed1',
      fontFamily: 'Source Serif 4, serif',
      fontSize: 15,
      lineHeight: 1.9,
      paragraphSpacing: 20,
      headingStyle: 'bottom-line',
      quoteStyle: 'simple'
    },
    highlightHabits: [
      { name: '金句留白', style: '斜体 + 段落前留白', scene: '访谈引言 / 核心对话', badgeColor: '#722ed1' }
    ],
    blocks: [
      {
        id: 't2_b1',
        type: 'quote',
        content: '“灵感并非凭空降临，而是在沉静与对立中的自然显现。”',
      },
      {
        id: 't2_b2',
        type: 'heading1',
        content: '对话：关于创作与日常',
      },
      {
        id: 't2_b3',
        type: 'paragraph',
        content: '问：您是如何找到这种独特视觉语言的？\n答：一切都源于对细节的持续观测与对杂音的剔除。',
      },
    ],
  },
  {
    id: 'tpl-3',
    title: '产品发布模板',
    author: '微信排版助手',
    date: '2023-10-24',
    category: '营销 • 科技',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD34rMcmmPkNBy9Z_k-YcJD7QXx07QsVwTsv1NwdSbuJwrvyF0IoEvYf8Bg-Z3Oe4RxrQYId7cqUM5wJFQquMY5HexQvlUXiRbCxHdpT9F0uicXu11CCPuel_ewYhcAJy_WndgidWIwRubc5dkLsifP1QjI49nhl3yQHtxv4XCoWK1RZCRCR6FVWB9JJu1hsAVyVv6CXa_ox57OasycO9uXON4qtbss3G6vlAQ8HH473-4ah7M2fdmr',
    updatedAt: '2023年10月24日',
    isTemplate: true,
    description: '通过强烈的视觉冲击、亮点卡片与参数规格引导读者转化。',
    styleConfig: {
      primaryColor: '#1890ff',
      fontFamily: '-apple-system-font, sans-serif',
      fontSize: 17,
      lineHeight: 1.6,
      paragraphSpacing: 14,
      headingStyle: 'solid-bg',
      quoteStyle: 'card'
    },
    highlightHabits: [
      { name: '参数强调卡片', style: '浅色背景框 + 边框', scene: '产品亮点 / 技术规格', badgeColor: '#1890ff' }
    ],
    blocks: [
      {
        id: 't3_b1',
        type: 'heading1',
        content: '重磅发布：全新一代旗舰产品',
      },
      {
        id: 't3_b2',
        type: 'callout',
        content: '🚀 性能提升 200% | 💡 能效优化 40% | 🛡️ 硬件级安全防护',
        caption: '核心技术亮点',
      },
      {
        id: 't3_b3',
        type: 'paragraph',
        content: '重新定义生产力工具，专为追求极致效率的创作者倾力打造。',
      },
    ],
  },
  {
    id: 'tpl-4',
    title: '美食故事模板',
    author: '微信排版助手',
    date: '2023-10-24',
    category: '生活 • 美食',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXxGrZxvp2V5w8gwmdkAeAt8Vkt84DuuYpponOaGWHdxr55ZplCG9wrFGfsJtzbPX_MrsD_0F88RHZc9JPUnQfMXK2HKVd3lMTQhYNl1aHUuF8i0VfVeeKVPF4jQHx8kiJoqBECkFLiiLr5fPZ_5GYHZrpHdfOh_b_MrihedgQ5C02uHNEH_Bt1vMVy45pUw9ryeJwWf8A7kxq52Aihxje1z5O7vdaMfIJROe-QQnQUoHQfemJe04l',
    updatedAt: '2023年10月24日',
    isTemplate: true,
    description: '让食谱、美味图文与探店心得生动呈现在手机端的精致模板。',
    styleConfig: {
      primaryColor: '#ff5722',
      fontFamily: '-apple-system-font, sans-serif',
      fontSize: 16,
      lineHeight: 1.8,
      paragraphSpacing: 18,
      headingStyle: 'badge',
      quoteStyle: 'card'
    },
    highlightHabits: [
      { name: '食材黄底', style: '黄色背景高亮', scene: '重要食材 / 调料提示', badgeColor: '#ff5722' }
    ],
    blocks: [
      {
        id: 't4_b1',
        type: 'heading1',
        content: '舌尖上的秋日滋味：特调慢熬料理',
      },
      {
        id: 't4_b2',
        type: 'image',
        content: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXxGrZxvp2V5w8gwmdkAeAt8Vkt84DuuYpponOaGWHdxr55ZplCG9wrFGfsJtzbPX_MrsD_0F88RHZc9JPUnQfMXK2HKVd3lMTQhYNl1aHUuF8i0VfVeeKVPF4jQHx8kiJoqBECkFLiiLr5fPZ_5GYHZrpHdfOh_b_MrihedgQ5C02uHNEH_Bt1vMVy45pUw9ryeJwWf8A7kxq52Aihxje1z5O7vdaMfIJROe-QQnQUoHQfemJe04l',
        caption: '高品质原料与精心烹饪的完美结合',
      },
      {
        id: 't4_b3',
        type: 'paragraph',
        content: '食材的香气在温火中漫延，一道充满诚意的料理，能治愈所有的疲惫。',
      },
    ],
  },
  {
    id: 'tpl-5',
    title: '智能课程模板',
    author: '微信排版助手',
    date: '2023-10-24',
    category: '教育 • 教程',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwV5HqVcV-q1T02gbQ76RTIaAoCKJnDP4QTVffQ28SV0IrTNxE5990ZKbrZwyjpTLBTMVkdvPoGDxhBvNTf6nIrzcwA9mxDaWX8giUNKzyjSA_NqhSt5VKncsMMGDxwcdwFOPus1fWiOKtpmlJY8qMXnAWWWF59obV3UNyoS8xP_KPW6yAz6hrWYSSGU1ksWY4K-Y0lUqC3zys9i35V2Q0WYoqSFeD27OHOLrSQ8oGFrJ6j9I2iEVq',
    updatedAt: '2023年10月24日',
    isTemplate: true,
    description: '适合教程指南、课程大纲与结构化知识分享的清爽排版。',
    styleConfig: {
      primaryColor: '#006d33',
      fontFamily: 'Be Vietnam Pro, sans-serif',
      fontSize: 15,
      lineHeight: 1.7,
      paragraphSpacing: 16,
      headingStyle: 'left-border',
      quoteStyle: 'card'
    },
    highlightHabits: [
      { name: '术语定义框', style: '主色调浅色背景 + 左边框', scene: '概念解释 / 学习目标', badgeColor: '#006d33' }
    ],
    blocks: [
      {
        id: 't5_b1',
        type: 'heading1',
        content: '第一课：排版基础与视觉层级',
      },
      {
        id: 't5_b2',
        type: 'callout',
        content: '📌 学习目标：掌握行距、字号对比与色调调和的三要素。',
        caption: '课前提示',
      },
      {
        id: 't5_b3',
        type: 'paragraph',
        content: '好的排版不仅是美观，更是为信息的快速精准传递服务。',
      },
    ],
  },

  {
    id: 'tpl-pinecone-blue',
    title: '松果时刻 • 科技深蓝',
    author: '深度分析者',
    date: '2023-10-24',
    category: '科技趋势',
    coverImage: '',
    updatedAt: '2023年10月24日',
    isTemplate: true,
    description: '深蓝色调，色块背景标题，强调卡片框，适用于科技分析、深度产品拆解。',
    styleConfig: {
      primaryColor: '#0f4c81',
      fontFamily: '-apple-system-font, sans-serif',
      fontSize: 16,
      lineHeight: 1.75,
      paragraphSpacing: 18,
      headingStyle: 'solid-bg',
      quoteStyle: 'card'
    },
    highlightHabits: [
      { name: '核心洞察卡片', style: '带蓝色背景与边框', scene: '核心观点 / 摘要', badgeColor: '#0f4c81' },
      { name: '关键词加粗', style: '加粗 + 深蓝色', scene: '关键痛点 / 专业名词', badgeColor: '#0f4c81' }
    ],
    blocks: [
      {
        id: 'tpc_b1',
        type: 'quote',
        content: '做生活的漫画家。',
      },
      {
        id: 'tpc_b2',
        type: 'paragraph',
        content: '这款产品用 AI 把 **表达欲** 从深夜碎碎念，变成了 **自我主演的漫画**。普通人不缺表达欲，缺的是一个 **足够低压力、足够体面、足够有趣** 的出口。',
      },
      {
        id: 'tpc_b3',
        type: 'heading1',
        content: '一、这个产品在解决什么问题',
      },
      {
        id: 'tpc_b4',
        type: 'paragraph',
        content: '《松果时刻》满足的不是漫画需求，而是 **低压力表达需求**。对于没有写作、绘画天赋 of 普通人，想分享生活本身就存在心理阻力。而松果时刻把整个流程压缩成：**「上传图片」+「描述事实」** → 一张可以直接分享的完整漫画。',
      },
      {
        id: 'tpc_b5',
        type: 'callout',
        content: '漫画为用户提供了一个安全的心理缓冲层，让真实情绪能更无负担地流露，同时塑造出「好玩、有创意、懂技术」的个人形象。',
        caption: '🎭 核心洞察',
      },
      {
        id: 'tpc_b6',
        type: 'heading1',
        content: '二、为什么选漫画而不是其他形式',
      },
      {
        id: 'tpc_b7',
        type: 'paragraph',
        content: '漫画是当前阶段 **最适合 AI 生成** 的内容媒介之一：漫画天然允许 **风格夸张、细节省略、画面跳跃**，且天然适合分镜结构——可拆解为「分镜 + 场景推进 + 情绪节点 + 对白组织」，恰好契合大模型擅长分步骤、结构化、拆分的特点。',
      },
      {
        id: 'tpc_b8',
        type: 'quote',
        content: '长文本 AI 容易过度戏剧化，生成越多越失真。而漫画允许用画面、留白、氛围表达，让用户自己脑补情绪，降低 AI 过度理解的尴尬感。',
      },
      {
        id: 'tpc_b9',
        type: 'heading1',
        content: '三、产品现在卡在哪里',
      },
      {
        id: 'tpc_b10',
        type: 'paragraph',
        content: '产品真正的矛盾，在于 **记录需求与社区增长之间的冲突**。松果（token）是目前唯一可见的获利通道，想要变现就需要引导用户多生成漫画。但短视频靠 **前几秒刺激** 留住用户，漫画需要一定阅读成本，天然不适合高频 feed。',
      },
      {
        id: 'tpc_b11',
        type: 'callout',
        content: '记录行为需要持续的主动投入，缺乏即时正反馈，难以形成习惯。当 AI 生成漫画的新鲜感褪去，用户的表达欲会持续衰减——漫画本质上是社交的软需求，而非硬刚需。',
        caption: '⚠️ 留存难题',
      },
      {
        id: 'tpc_b12',
        type: 'heading1',
        content: '四、它可能往哪里走',
      },
      {
        id: 'tpc_b13',
        type: 'bullet_list',
        content: '路线 A：低频人生记录工具——情侣手册、人生日记，形成独属于自己的人生漫画集\n路线 B：兴趣驱动的视觉创作社区——同人圈、OC 圈、跑团、剧本杀等圈层用户',
      },
      {
        id: 'tpc_b14',
        type: 'paragraph',
        content: '过去，漫画创作属于 **「技能型创作」**；而 AI 正在把它逐渐变成 **「想象力型创作」**。未来的创作或许不再受限于天赋和学习成本，普通人可以用各种形式自由展现想象力——这或许也是 AI 发展的一种意义。',
      },
    ]
  },
  {
    id: 'tpl-pinecone-teal',
    title: '松果时刻 • 清新墨绿',
    author: '深度分析者',
    date: '2023-10-24',
    category: '商业洞察',
    coverImage: '',
    updatedAt: '2023年10月24日',
    isTemplate: true,
    description: '墨绿色调，底边线标题，简约引用，适用于清新散文、人文专访、深度阅读。',
    styleConfig: {
      primaryColor: '#0a8451',
      fontFamily: '-apple-system-font, sans-serif',
      fontSize: 16,
      lineHeight: 1.75,
      paragraphSpacing: 18,
      headingStyle: 'bottom-line',
      quoteStyle: 'simple'
    },
    highlightHabits: [
      { name: '学术金句', style: '绿色左竖线', scene: '引用文献 / 名言', badgeColor: '#0a8451' },
      { name: '段落摘要加粗', style: '加粗 + 墨绿色', scene: '章节核心提炼', badgeColor: '#0a8451' }
    ],
    blocks: [
      {
        id: 'tpc_b1',
        type: 'quote',
        content: '做生活的漫画家。',
      },
      {
        id: 'tpc_b2',
        type: 'paragraph',
        content: '这款产品用 AI 把 **表达欲** 从深夜碎碎念，变成了 **自我主演的漫画**。普通人不缺表达欲，缺的是一个 **足够低压力、足够体面、足够有趣** 的出口。',
      },
      {
        id: 'tpc_b3',
        type: 'heading1',
        content: '一、这个产品在解决什么问题',
      },
      {
        id: 'tpc_b4',
        type: 'paragraph',
        content: '《松果时刻》满足的不是漫画需求，而是 **低压力表达需求**。对于没有写作、绘画天赋 of 普通人，想分享生活本身就存在心理阻力。而松果时刻把整个流程压缩成：**「上传图片」+「描述事实」** → 一张可以直接分享的完整漫画。',
      },
      {
        id: 'tpc_b5',
        type: 'callout',
        content: '漫画为用户提供了一个安全的心理缓冲层，让真实情绪能更无负担地流露，同时塑造出「好玩、有创意、懂技术」的个人形象。',
        caption: '🎭 核心洞察',
      },
      {
        id: 'tpc_b6',
        type: 'heading1',
        content: '二、为什么选漫画而不是其他形式',
      },
      {
        id: 'tpc_b7',
        type: 'paragraph',
        content: '漫画是当前阶段 **最适合 AI 生成** 的内容媒介之一：漫画天然允许 **风格夸张、细节省略、画面跳跃**，且天然适合分镜结构——可拆解为「分镜 + 场景推进 + 情绪节点 + 对白组织」，恰好契合大模型擅长分步骤、结构化、拆分的特点。',
      },
      {
        id: 'tpc_b8',
        type: 'quote',
        content: '长文本 AI 容易过度戏剧化，生成越多越失真。而漫画允许用画面、留白、氛围表达，让用户自己脑补情绪，降低 AI 过度理解的尴尬感。',
      },
      {
        id: 'tpc_b9',
        type: 'heading1',
        content: '三、产品现在卡在哪里',
      },
      {
        id: 'tpc_b10',
        type: 'paragraph',
        content: '产品真正的矛盾，在于 **记录需求与社区增长之间的冲突**。松果（token）是目前唯一可见的获利通道，想要变现就需要引导用户多生成漫画。但短视频靠 **前几秒刺激** 留住用户，漫画需要一定阅读成本，天然不适合高频 feed。',
      },
      {
        id: 'tpc_b11',
        type: 'callout',
        content: '记录行为需要持续的主动投入，缺乏即时正反馈，难以形成习惯。当 AI 生成漫画的新鲜感褪去，用户的表达欲会持续衰减——漫画本质上是社交的软需求，而非硬刚需。',
        caption: '⚠️ 留存难题',
      },
      {
        id: 'tpc_b12',
        type: 'heading1',
        content: '四、它可能往哪里走',
      },
      {
        id: 'tpc_b13',
        type: 'bullet_list',
        content: '路线 A：低频人生记录工具——情侣手册、人生日记，形成独属于自己的人生漫画集\n路线 B：兴趣驱动的视觉创作社区——同人圈、OC 圈、跑团、剧本杀等圈层用户',
      },
      {
        id: 'tpc_b14',
        type: 'paragraph',
        content: '过去，漫画创作属于 **「技能型创作」**；而 AI 正在把它逐渐变成 **「想象力型创作」**。未来的创作或许不再受限于天赋和学习成本，普通人可以用各种形式自由展现想象力——这或许也是 AI 发展的一种意义。',
      },
    ]
  },
  {
    id: 'tpl-pinecone-charcoal',
    title: '松果时刻 • 极简炭灰',
    author: '深度分析者',
    date: '2023-10-24',
    category: '深度长文',
    coverImage: '',
    updatedAt: '2023年10月24日',
    isTemplate: true,
    description: '炭黑色调，左侧竖线标题，简约排版，适用于干货分享、极简商业评论。',
    styleConfig: {
      primaryColor: '#2c2c2c',
      fontFamily: '-apple-system-font, sans-serif',
      fontSize: 16,
      lineHeight: 1.75,
      paragraphSpacing: 18,
      headingStyle: 'left-border',
      quoteStyle: 'simple'
    },
    highlightHabits: [
      { name: '结论加粗', style: '加粗 + 炭灰色', scene: '章节核心提炼', badgeColor: '#2c2c2c' }
    ],
    blocks: [
      {
        id: 'tpc_b1',
        type: 'quote',
        content: '做生活的漫画家。',
      },
      {
        id: 'tpc_b2',
        type: 'paragraph',
        content: '这款产品用 AI 把 **表达欲** 从深夜碎碎念，变成了 **自我主演的漫画**。普通人不缺表达欲，缺的是一个 **足够低压力、足够体面、足够有趣** 的出口。',
      },
      {
        id: 'tpc_b3',
        type: 'heading1',
        content: '一、这个产品在解决什么问题',
      },
      {
        id: 'tpc_b4',
        type: 'paragraph',
        content: '《松果时刻》满足的不是漫画需求，而是 **低压力表达需求**。对于没有写作、绘画天赋 of 普通人，想分享生活本身就存在心理阻力。而松果时刻把整个流程压缩成：**「上传图片」+「描述事实」** → 一张可以直接分享的完整漫画。',
      },
      {
        id: 'tpc_b5',
        type: 'callout',
        content: '漫画为用户提供了一个安全的心理缓冲层，让真实情绪能更无负担地流露，同时塑造出「好玩、有创意、懂技术」的个人形象。',
        caption: '🎭 核心洞察',
      },
      {
        id: 'tpc_b6',
        type: 'heading1',
        content: '二、为什么选漫画而不是其他形式',
      },
      {
        id: 'tpc_b7',
        type: 'paragraph',
        content: '漫画是当前阶段 **最适合 AI 生成** 的内容媒介之一：漫画天然允许 **风格夸张、细节省略、画面跳跃**，且天然适合分镜结构——可拆解为「分镜 + 场景推进 + 情绪节点 + 对白组织」，恰好契合大模型擅长分步骤、结构化、拆分的特点。',
      },
      {
        id: 'tpc_b8',
        type: 'quote',
        content: '长文本 AI 容易过度戏剧化，生成越多越失真。而漫画允许用画面、留白、氛围表达，让用户自己脑补情绪，降低 AI 过度理解的尴尬感。',
      },
      {
        id: 'tpc_b9',
        type: 'heading1',
        content: '三、产品现在卡在哪里',
      },
      {
        id: 'tpc_b10',
        type: 'paragraph',
        content: '产品真正的矛盾，在于 **记录需求与社区增长之间的冲突**。松果（token）是目前唯一可见的获利通道，想要变现就需要引导用户多生成漫画。但短视频靠 **前几秒刺激** 留住用户，漫画需要一定阅读成本，天然不适合高频 feed。',
      },
      {
        id: 'tpc_b11',
        type: 'callout',
        content: '记录行为需要持续的主动投入，缺乏即时正反馈，难以形成习惯。当 AI 生成漫画的新鲜感褪去，用户的表达欲会持续衰减——漫画本质上是社交的软需求，而非硬刚需。',
        caption: '⚠️ 留存难题',
      },
      {
        id: 'tpc_b12',
        type: 'heading1',
        content: '四、它可能往哪里走',
      },
      {
        id: 'tpc_b13',
        type: 'bullet_list',
        content: '路线 A：低频人生记录工具——情侣手册、人生日记，形成独属于自己的人生漫画集\n路线 B：兴趣驱动的视觉创作社区——同人圈、OC 圈、跑团、剧本杀等圈层用户',
      },
      {
        id: 'tpc_b14',
        type: 'paragraph',
        content: '过去，漫画创作属于 **「技能型创作」**；而 AI 正在把它逐渐变成 **「想象力型创作」**。未来的创作或许不再受限于天赋和学习成本，普通人可以用各种形式自由展现想象力——这或许也是 AI 发展的一种意义。',
      },
    ]
  }];