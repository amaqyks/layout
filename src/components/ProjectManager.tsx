import React, { useState } from 'react';
import { Article } from '../types';

interface ProjectManagerProps {
  articles: Article[];
  onSelectProject: (article: Article) => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (article: Article) => void;
  onCreateNew: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  articles,
  onSelectProject,
  onDeleteProject,
  onDuplicateProject,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const categories = ['全部', '设计类', '新闻周刊', '生活方式', '商业报告', '艺术访谈'];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === '全部' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 p-5 lg:p-8 overflow-y-auto custom-scrollbar bg-[#f6f3f2] select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-[26px] font-bold text-[#1b1c1c] tracking-tight">项目管理</h2>
            <p className="text-xs text-[#5d5f5f] mt-1">
              集中管理您的所有公众号文章与排版草稿，无需依赖外部图片，呈现纯粹内容美感。
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5d5f5f] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索项目..."
                className="w-full pl-9 pr-4 py-2 border border-[#e4e2e1] bg-white rounded-xl focus:ring-2 focus:ring-[#07C160]/20 focus:border-[#006d33] outline-none text-xs text-[#1b1c1c]"
              />
            </div>

            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-[#006d33] text-white rounded-xl font-medium text-xs flex items-center gap-1.5 hover:bg-[#005225] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              新建文章
            </button>
          </div>
        </header>

        {/* Category Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#006d33] text-white shadow-xs'
                  : 'bg-white text-[#5d5f5f] hover:bg-[#e4e2e1] border border-[#e4e2e1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid (Pure Layout / Component Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-[#e4e2e1]">
              <span className="material-symbols-outlined text-[48px] text-[#bbcbba] mb-3">
                folder_off
              </span>
              <p className="text-sm text-[#5d5f5f]">未找到匹配的项目，试着换个搜索词或新建文章吧</p>
            </div>
          ) : (
            filteredArticles.map((item) => {
              const h2Count = item.blocks.filter((b) => b.type === 'heading1' || b.type === 'heading2').length;
              const pCount = item.blocks.filter((b) => b.type === 'paragraph').length;
              const quoteCount = item.blocks.filter((b) => b.type === 'quote' || b.type === 'callout').length;
              const sampleParagraph = item.blocks.find((b) => b.type === 'paragraph')?.content || '这是文章的排版摘要内容...';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectProject(item)}
                  className="bg-white rounded-2xl border border-[#e4e2e1] overflow-hidden canvas-shadow hover:border-[#07C160] hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  {/* Top Color Accent Line & Mini Layout Card Mock */}
                  <div>
                    <div className="h-1.5 bg-[#006d33]" />
                    
                    <div className="p-5 bg-gradient-to-b from-[#fbf9f8] to-white border-b border-[#e4e2e1] space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e8f5e9] text-[#006d33] border border-[#07C160]/30 uppercase">
                          {item.category || '文章项目'}
                        </span>
                        <span className="text-[10px] text-[#888888] font-mono">
                          {item.updatedAt}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#1b1c1c] group-hover:text-[#006d33] transition-colors leading-snug line-clamp-2">
                        {item.title || '未命名文章'}
                      </h3>

                      {/* Content Preview Snippet */}
                      <p className="text-xs text-[#5d5f5f] line-clamp-2 leading-relaxed italic bg-white p-2.5 rounded-lg border border-[#e4e2e1]/60">
                        “{sampleParagraph}”
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Metadata & Quick Actions */}
                  <div className="p-4 bg-white flex flex-col gap-3">
                    {/* Component Stats Badges */}
                    <div className="flex items-center gap-3 text-[11px] text-[#5d5f5f]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#07C160]">title</span>
                        {h2Count} 标题
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#07C160]">notes</span>
                        {pCount} 段落
                      </span>
                      {quoteCount > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-[#07C160]">format_quote</span>
                          {quoteCount} 金句
                        </span>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between border-t border-[#e4e2e1] pt-3 mt-1">
                      <span className="text-[11px] text-[#888888] font-medium">
                        作者：{item.author || '微信排版助手'}
                      </span>
                      
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onDuplicateProject(item)}
                          className="p-1.5 text-[#5d5f5f] hover:text-[#006d33] rounded hover:bg-[#f6f3f2] transition-colors cursor-pointer"
                          title="复制副本"
                        >
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        </button>
                        <button
                          onClick={() => onDeleteProject(item.id)}
                          className="p-1.5 text-[#5d5f5f] hover:text-[#ba1a1a] rounded hover:bg-[#ffebee] transition-colors cursor-pointer"
                          title="删除项目"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                        <button
                          onClick={() => onSelectProject(item)}
                          className="ml-1 px-3 py-1 bg-[#006d33] hover:bg-[#07C160] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                        >
                          编辑
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
