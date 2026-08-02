import { useState, useEffect, useRef, useCallback } from 'react';
import { NavTab, Article, StyleConfig, BlockType, ContentBlock, ExtractedTheme } from './types';
import { SAMPLE_ARTICLES, SAMPLE_TEMPLATES, DEFAULT_STYLE_CONFIG } from './data/sampleArticles';
import { SideNavBar } from './components/SideNavBar';
import { ProjectManager } from './components/ProjectManager';
import { TemplateLibrary } from './components/TemplateLibrary';
import { ThemeExtractor } from './components/ThemeExtractor';
import { FormattingToolbar } from './components/FormattingToolbar';
import { ContentCanvas, ContentCanvasHandle } from './components/ContentCanvas';
import { MobilePreviewFrame } from './components/MobilePreviewFrame';
import { StyleEditorPanel } from './components/StyleEditorPanel';
import { FloatingActionToolbar } from './components/FloatingActionToolbar';
import { copyToWeChatClipboard } from './utils/wechatExporter';
import { formatArticleByWechatSkill, parseFormattedMarkdownToBlocks } from './utils/wechatArticleFormatter';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('editing');
  const contentCanvasRef = useRef<ContentCanvasHandle>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number>(Date.now());
  
  // Articles State with LocalStorage Persistence
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('wechat_editor_articles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SAMPLE_ARTICLES;
  });

  // Templates State
  const [templates, setTemplates] = useState<Article[]>(() => {
    const saved = localStorage.getItem('wechat_editor_templates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SAMPLE_TEMPLATES;
  });

  // Active Article ID & Active Article Reference
  const [activeArticleId, setActiveArticleId] = useState<string>('proj-1');
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(() => {
    const saved = localStorage.getItem('wechat_editor_styles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_STYLE_CONFIG;
  });

  const [isStylePanelOpen, setIsStylePanelOpen] = useState<boolean>(true);
  const [isAiWorking, setIsAiWorking] = useState<boolean>(false);
  const [layoutSuggestion, setLayoutSuggestion] = useState<string>('');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('wechat_editor_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('wechat_editor_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('wechat_editor_styles', JSON.stringify(styleConfig));
  }, [styleConfig]);

  // Current Article being edited
  const currentArticle = articles.find((a) => a.id === activeArticleId) || articles[0] || SAMPLE_ARTICLES[0];

  // Word count calculator
  const totalWordCount = currentArticle.blocks.reduce((acc, blk) => {
    return acc + (blk.content ? blk.content.trim().length : 0);
  }, currentArticle.title.length);

  // Handlers for Editing Article
  const handleUpdateTitle = (title: string) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === currentArticle.id ? { ...art, title } : art))
    );
  };

  const handleUpdateAuthor = (author: string) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === currentArticle.id ? { ...art, author } : art))
    );
  };

  const handleUpdateBlock = (blockId: string, updatedFields: Partial<ContentBlock>) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id !== currentArticle.id) return art;
        const newBlocks = art.blocks.map((blk) =>
          blk.id === blockId ? { ...blk, ...updatedFields } : blk
        );
        return { ...art, blocks: newBlocks };
      })
    );
  };

  const handleDeleteBlock = (blockId: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id !== currentArticle.id) return art;
        const newBlocks = art.blocks.filter((blk) => blk.id !== blockId);
        return { ...art, blocks: newBlocks };
      })
    );
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentArticle.blocks.length) return;

    setArticles((prev) =>
      prev.map((art) => {
        if (art.id !== currentArticle.id) return art;
        const newBlocks = [...art.blocks];
        const [moved] = newBlocks.splice(index, 1);
        newBlocks.splice(targetIndex, 0, moved);
        return { ...art, blocks: newBlocks };
      })
    );
  };

  const handleInsertBlock = (index: number, type: BlockType) => {
    const newBlock: ContentBlock = {
      id: `b_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      content:
        type === 'heading1'
          ? '��һ������'
          : type === 'heading2'
          ? '�¶�������'
          : type === 'quote'
          ? '�ڴ˴�д�뾫ѡ����...'
          : type === 'callout'
          ? '�ڴ�д�����������Ҫ���ܽ�'
          : type === 'image'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUhAhGK4g1LR2VqeAgo9g0EjAQ8DZxrVsP38Po1y4oAP8NbH3TDU4WMYhIJ7P4nMa4tyNfgSZH82_GMbFRePmFS6Vi4Wh2XytCAlPm6mka8hc9APMx5UT6H6D1GgwuekWVNs86BExiEu0WvI_0d67Q3vPFaK1UmoP6YS3Kf1x85t1EGzY6XrS-Xqmv0unIwpeYBSXvmjnYuwWhnIW8xHAkuIohwepbAfXh-5rC03wlMKSrYX5hOqq5'
          : type === 'divider'
          ? ''
          : '�ڴ���������...',
      caption: type === 'image' ? 'ͼƬ˵��' : type === 'callout' ? '?? �ص���ʾ' : undefined,
    };

    setArticles((prev) =>
      prev.map((art) => {
        if (art.id !== currentArticle.id) return art;
        const newBlocks = [...art.blocks];
        newBlocks.splice(index, 0, newBlock);
        return { ...art, blocks: newBlocks };
      })
    );
  };

  // Project Management Handlers
  const handleCreateNewArticle = () => {
    const newArticle: Article = {
      id: `proj_${Date.now()}`,
      title: '�����±���...',
      author: '΢���Ű�����',
      date: new Date().toISOString().slice(0, 10),
      category: '�����',
      coverImage: '',
      blocks: [
        {
          id: `b_${Date.now()}_1`,
          type: 'paragraph',
          content: '�����￪ʼ׫д��������...',
        },
      ],
      updatedAt: new Date().toLocaleDateString('zh-CN'),
    };
    setArticles((prev) => [...prev, newArticle]);
    setActiveArticleId(newArticle.id);
    setCurrentTab('editing');
  };

  const handleCreateNewTemplate = () => {
    if (!currentArticle) return;
    const newTemplate: Article = {
      ...currentArticle,
      id: `tpl_${Date.now()}`,
      isTemplate: true,
      description: `���ڡ�${currentArticle.title}���������Ű�ģ��`,
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  const handleSelectProject = (article: Article) => {
    setActiveArticleId(article.id);
    setCurrentTab('editing');
  };

  const handleDeleteProject = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (id === activeArticleId) {
      setActiveArticleId(articles[0]?.id || 'proj-1');
    }
  };

  const handleDuplicateProject = (article: Article) => {
    const dup: Article = {
      ...article,
      id: `proj_${Date.now()}`,
      title: `${article.title} (����)`,
      blocks: article.blocks.map((b) => ({ ...b, id: `b_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` })),
      updatedAt: new Date().toLocaleDateString('zh-CN'),
    };
    setArticles((prev) => [...prev, dup]);
  };

  const handleUseTemplate = (template: Article) => {
    const newArticle: Article = {
      ...template,
      id: `proj_${Date.now()}`,
      blocks: template.blocks.map((b) => ({ ...b, id: `b_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` })),
      isTemplate: false,
      updatedAt: new Date().toLocaleDateString('zh-CN'),
    };
    setArticles((prev) => [...prev, newArticle]);
    setActiveArticleId(newArticle.id);
    setCurrentTab('editing');
  };

  const handleSaveAndApplyExtractedTheme = (theme: ExtractedTheme) => {
    const newTemplate: Article = {
      id: `tpl_extracted_${Date.now()}`,
      title: theme.name,
      author: '������ȡ',
      date: new Date().toISOString().slice(0, 10),
      category: '��ȡ ? ģ��',
      coverImage: '',
      blocks: [
        {
          id: `b_ext_${Date.now()}_1`,
          type: 'heading1',
          content: theme.previewSample?.title || '��ȡ�ı�����ʽ',
        },
        {
          id: `b_ext_${Date.now()}_2`,
          type: 'heading2',
          content: theme.previewSample?.h2 || '��������Ԥ��',
        },
        {
          id: `b_ext_${Date.now()}_3`,
          type: 'paragraph',
          content: theme.previewSample?.paragraph || '���Ķ�����ʽԤ��...',
        },
        {
          id: `b_ext_${Date.now()}_4`,
          type: 'quote',
          content: theme.previewSample?.quote || '��ѡ����Ԥ��',
        },
      ],
      updatedAt: new Date().toLocaleDateString('zh-CN'),
      isTemplate: true,
      description: theme.description,
    };
    setTemplates((prev) => [...prev, newTemplate]);
    setStyleConfig(theme.styleConfig);
  };

  // Handler for inline formatting from toolbar
  const handleFormatInline = useCallback((format: 'bold' | 'italic') => {
    contentCanvasRef.current?.formatInline(format);
  }, []);

  // Handler for saving draft (updates timestamp)
  const handleSaveDraft = useCallback(() => {
    setLastSavedAt(Date.now());
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentTab !== 'editing') return;
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && e.key === 'b') {
        e.preventDefault();
        handleFormatInline('bold');
      } else if (isMod && e.key === 'i') {
        e.preventDefault();
        handleFormatInline('italic');
      } else if (isMod && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTab, handleFormatInline, handleSaveDraft]);

  // AI Polish Handler �� parses AI output into structured ContentBlock[]
  const handleAIPolish = async () => {
    setIsAiWorking(true);
    try {
      const allText = currentArticle.blocks.map((b) => b.content).join('\n\n');
      const res = await fetch('/api/ai/layout-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: currentArticle.title, content: allText }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        const newBlocks = parseFormattedMarkdownToBlocks(data.result);
        if (newBlocks.length > 0) {
          setArticles((prev) =>
            prev.map((art) =>
              art.id === currentArticle.id ? { ...art, blocks: newBlocks } : art
            )
          );
        }
        // Show layout suggestions if available
        if (data.layoutSuggestion) {
          setLayoutSuggestion(data.layoutSuggestion);
        }
      }
    } catch (e) {
      console.error('AI Layout Agent failed:', e);
      const newBlocks = formatArticleByWechatSkill(currentArticle);
      setArticles((prev) =>
        prev.map((art) =>
          art.id === currentArticle.id ? { ...art, blocks: newBlocks } : art
        )
      );
    } finally {
      setIsAiWorking(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fbf9f8] font-sans text-[#1b1c1c]">
      {/* Side Navigation Bar */}
      <SideNavBar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onNewArticle={handleCreateNewArticle}
        onNewTemplate={handleCreateNewTemplate}
      />

      {/* Main Container Area Shifted right for 230px sidebar */}
      <main className="ml-[230px] h-screen flex-1 flex overflow-hidden relative">
        {/* TAB 1: Project Management */}
        {currentTab === 'projects' && (
          <ProjectManager
            articles={articles}
            onSelectProject={handleSelectProject}
            onDeleteProject={handleDeleteProject}
            onDuplicateProject={handleDuplicateProject}
            onCreateNew={handleCreateNewArticle}
          />
        )}

        {/* TAB 2: Template Library */}
        {currentTab === 'templates' && (
          <TemplateLibrary
            templates={templates}
            onUseTemplate={handleUseTemplate}
          />
        )}

        {/* TAB 3: Theme Extractor */}
        {currentTab === 'extractor' && (
          <ThemeExtractor
            onSaveAndApplyTheme={handleSaveAndApplyExtractedTheme}
          />
        )}

        {/* TAB 3: Currently Editing (Editor Pane + Preview + Style Panel) */}
        {currentTab === 'editing' && (
          <div className="flex-1 flex h-full overflow-hidden relative">
            {/* Left: Editor Pane */}
            <section className="flex-1 flex flex-col border-r border-[#e4e2e1] bg-[#ffffff] relative min-w-0">
              {/* Formatting Toolbar Header */}
              <FormattingToolbar
                wordCount={totalWordCount}
                onAddBlock={(type) => handleInsertBlock(currentArticle.blocks.length, type)}
                onAIPolish={handleAIPolish}
                isAiWorking={isAiWorking}
                isStylePanelOpen={isStylePanelOpen}
                onFormatInline={handleFormatInline}
              />

              {/* AI Layout Suggestions Banner */}
              {layoutSuggestion && (
                <div className="mx-5 mt-2 px-4 py-3 bg-[#f0faf4] border border-[#07C160]/20 rounded-lg text-xs text-[#3d4a3d] leading-relaxed relative">
                  <button
                    onClick={() => setLayoutSuggestion('')}
                    className="absolute top-2 right-2 p-0.5 rounded hover:bg-[#07C160]/10 text-[#5d5f5f] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                  {layoutSuggestion.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('> - **') ? 'font-medium text-[#006d33]' : ''}>
                      {line.replace(/^> /, '')}
                    </p>
                  ))}
                </div>
              )}

              {/* Editable Article Content Canvas */}
              <ContentCanvas
                ref={contentCanvasRef}
                article={currentArticle}
                styleConfig={styleConfig}
                onUpdateTitle={handleUpdateTitle}
                onUpdateAuthor={handleUpdateAuthor}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
                onMoveBlock={handleMoveBlock}
                onInsertBlock={handleInsertBlock}
              />
            </section>

            {/* Right: Mobile Device Preview Pane */}
            <MobilePreviewFrame
              article={currentArticle}
              styleConfig={styleConfig}
            />

            {/* Optional Right Drawer: Style Editor Panel */}
            {isStylePanelOpen && (
              <StyleEditorPanel
                styleConfig={styleConfig}
                onUpdateStyle={(updated) => setStyleConfig((prev) => ({ ...prev, ...updated }))}
                onClose={() => setIsStylePanelOpen(false)}
              />
            )}

            {/* Bottom Floating Action Toolbar */}
            <FloatingActionToolbar
              isStylePanelOpen={isStylePanelOpen}
              onToggleStylePanel={() => setIsStylePanelOpen(!isStylePanelOpen)}
              onSaveTemplate={handleCreateNewTemplate}
              onSaveDraft={handleSaveDraft}
              onCopyWeChat={() => copyToWeChatClipboard(currentArticle, styleConfig)}
              lastSavedAt={lastSavedAt}
            />
          </div>
        )}
      </main>
    </div>
  );
}
