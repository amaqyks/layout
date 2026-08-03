import React, { useState } from 'react';
import { Article } from '../types';

interface TemplateLibraryProps {
  templates: Article[];
  onUseTemplate: (template: Article) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  templates,
  onUseTemplate,
  onDeleteTemplate,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [previewTemplate, setPreviewTemplate] = useState<Article | null>(null);

  const tags = ['全部', '新闻', '文化', '科技', '美食', '教程', '解构 • 模板'];

  const toggleFav = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedTag === '全部') return true;
    return tpl.category.includes(selectedTag);
  });

  return (
    <div className="flex-1 p-5 lg:p-8 overflow-y-auto custom-scrollbar bg-[#f6f3f2] select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-[26px] font-bold text-[#1b1c1c] tracking-tight">模板库</h2>
            <p className="text-xs text-[#5d5f5f] mt-1">
              探索精美的微信公众号 Theme 样式组合，直观预览标题、边框与配色。
            </p>
          </div>
        </header>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-[#006d33] text-white shadow-xs'
                  : 'bg-white text-[#5d5f5f] hover:bg-[#e4e2e1] border border-[#e4e2e1]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Templates Grid (Pure Typography & Component Spec Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => {
            const isFav = favorites[tpl.id];
            
            // Infer sample theme accent color based on title / category
            const themeColor = tpl.title.includes('科技')
              ? '#1890ff'
              : tpl.title.includes('美食') || tpl.title.includes('解构')
              ? '#ff5722'
              : tpl.title.includes('文化')
              ? '#722ed1'
              : '#07C160';

            const sampleHeading = tpl.blocks.find((b) => b.type === 'heading1' || b.type === 'heading2')?.content || '样式二级标题预览';
            const sampleQuote = tpl.blocks.find((b) => b.type === 'quote' || b.type === 'callout')?.content || '“金句与引言样式示例。”';

            return (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl border border-[#e4e2e1] overflow-hidden canvas-shadow hover:border-[#006d33] hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Style Specs Live Card Header (No Cover Image!) */}
                <div className="p-5 bg-[#fbf9f8] border-b border-[#e4e2e1] space-y-4">
                  {/* Category Badge & Favorite */}
                  <div className="flex justify-between items-center">
                    <span
                      className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border shadow-2xs"
                      style={{
                        backgroundColor: `${themeColor}15`,
                        color: themeColor,
                        borderColor: `${themeColor}33`,
                      }}
                    >
                      {tpl.category}
                    </span>
                    <button
                      onClick={() => toggleFav(tpl.id)}
                      className="text-[#5d5f5f] hover:text-[#ba1a1a] transition-colors cursor-pointer p-1"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isFav ? 'text-[#ba1a1a]' : ''
                        }`}
                      >
                        {isFav ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>

                  {/* Template Title */}
                  <h3 className="font-bold text-[#1b1c1c] text-base group-hover:text-[#006d33] transition-colors">
                    {tpl.title}
                  </h3>

                  {/* Component Preview Box */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#e4e2e1] space-y-2.5 shadow-2xs">
                    {/* Styled Heading Spec Preview */}
                    <div
                      className="text-xs font-bold pl-2.5 border-l-3 leading-snug truncate"
                      style={{ borderColor: themeColor, color: themeColor }}
                    >
                      {sampleHeading}
                    </div>

                    {/* Styled Quote Spec Preview */}
                    <div
                      className="text-[11px] p-2 rounded italic leading-relaxed truncate"
                      style={{
                        backgroundColor: `${themeColor}0d`,
                        color: '#444444',
                        borderLeft: `2px solid ${themeColor}`,
                      }}
                    >
                      {sampleQuote}
                    </div>
                  </div>
                </div>

                {/* Card Body & Action Buttons */}
                <div className="p-4 bg-white space-y-3">
                  <p className="text-xs text-[#5d5f5f] line-clamp-2 leading-relaxed">
                    {tpl.description || '基于精准的字体、行高与色彩搭配构成的排版模板。'}
                  </p>

                  <div className="flex items-center justify-between border-t border-[#e4e2e1] pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeColor }} />
                      <span className="text-[11px] font-mono text-[#888888]">
                        {themeColor}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewTemplate(tpl)}
                        className="px-3 py-1.5 rounded-lg border border-[#e4e2e1] text-xs font-medium text-[#5d5f5f] hover:bg-[#f6f3f2] transition-colors cursor-pointer"
                      >
                        预览
                      </button>
                      <button
                        onClick={() => onUseTemplate(tpl)}
                        className="px-4 py-1.5 bg-[#07C160] hover:bg-[#006d33] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        套用模板
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteTemplate(tpl.id); }}
                        title="删除模板"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#aaa] hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Template Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e4e2e1] max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-[#e4e2e1] flex justify-between items-center bg-[#fbf9f8]">
              <h3 className="font-bold text-base text-[#1b1c1c]">{previewTemplate.title} 预览</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1 rounded hover:bg-[#f0eded] text-[#5d5f5f] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="p-4 bg-[#f6f3f2] rounded-xl border border-[#e4e2e1] space-y-1">
                <span className="text-xs font-bold text-[#006d33]">{previewTemplate.category}</span>
                <p className="text-xs text-[#5d5f5f] leading-relaxed">{previewTemplate.description}</p>
              </div>

              {previewTemplate.styleConfig && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#07C160]">palette</span>
                    全局排版变量
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#fbf9f8] border border-[#e4e2e1] p-2.5 rounded-lg flex justify-between items-center">
                      <span className="text-[11px] text-[#888888]">主色调</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: previewTemplate.styleConfig.primaryColor }} />
                        <span className="text-xs font-mono font-medium text-[#444]">{previewTemplate.styleConfig.primaryColor}</span>
                      </div>
                    </div>
                    <div className="bg-[#fbf9f8] border border-[#e4e2e1] p-2.5 rounded-lg flex justify-between items-center">
                      <span className="text-[11px] text-[#888888]">正文字号</span>
                      <span className="text-xs font-mono font-medium text-[#444]">{previewTemplate.styleConfig.fontSize}px</span>
                    </div>
                    <div className="bg-[#fbf9f8] border border-[#e4e2e1] p-2.5 rounded-lg flex justify-between items-center">
                      <span className="text-[11px] text-[#888888]">正文行高</span>
                      <span className="text-xs font-mono font-medium text-[#444]">{previewTemplate.styleConfig.lineHeight}</span>
                    </div>
                    <div className="bg-[#fbf9f8] border border-[#e4e2e1] p-2.5 rounded-lg flex justify-between items-center">
                      <span className="text-[11px] text-[#888888]">段落间距</span>
                      <span className="text-xs font-mono font-medium text-[#444]">{previewTemplate.styleConfig.paragraphSpacing}px</span>
                    </div>
                  </div>
                </div>
              )}

              {previewTemplate.highlightHabits && previewTemplate.highlightHabits.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#ff9800]">flare</span>
                    高光习惯设定
                  </h4>
                  <div className="space-y-2">
                    {previewTemplate.highlightHabits.map((habit, idx) => (
                      <div key={idx} className="bg-white border border-[#e4e2e1] p-3 rounded-xl shadow-2xs flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1b1c1c] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.badgeColor || '#07C160' }} />
                            {habit.name}
                          </span>
                          <span className="text-[10px] font-mono bg-[#f6f3f2] text-[#5d5f5f] px-1.5 py-0.5 rounded border border-[#e4e2e1]">
                            触发场景: {habit.scene}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5d5f5f] bg-[#fbf9f8] p-2 rounded border border-[#e4e2e1] border-dashed">
                          表现形式：{habit.style}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#1b1c1c]">article</span>
                  样式结构预览
                </h4>
                <div className="border border-[#e4e2e1] p-4 rounded-xl bg-white shadow-2xs space-y-3">
                  {previewTemplate.blocks.map((blk, i) => (
                    <div key={i} className="text-sm text-[#1b1c1c]">
                      {blk.type === 'heading1' && (
                        <h4 className="font-bold text-[#006d33] text-base border-l-3 border-[#07C160] pl-2.5 py-0.5">
                          {blk.content}
                        </h4>
                      )}
                      {blk.type === 'heading2' && (
                        <h5 className="font-bold text-[#1b1c1c] text-sm mt-2">
                          {blk.content}
                        </h5>
                      )}
                      {blk.type === 'paragraph' && <p className="leading-relaxed">{blk.content}</p>}
                      {blk.type === 'quote' && (
                        <blockquote className="italic bg-[#07C160]/10 p-3 rounded border-l-3 border-[#07C160]">
                          {blk.content}
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#e4e2e1] bg-[#fbf9f8] flex justify-end gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 border border-[#e4e2e1] text-[#5d5f5f] rounded-xl text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  const tpl = previewTemplate;
                  setPreviewTemplate(null);
                  onUseTemplate(tpl);
                }}
                className="px-5 py-2 bg-[#07C160] text-white rounded-xl text-xs font-bold hover:bg-[#006d33] cursor-pointer shadow-sm"
              >
                使用此模板创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
