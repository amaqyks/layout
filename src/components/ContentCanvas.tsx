import React, { useState, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Article, ContentBlock, BlockType, StyleConfig } from '../types';
import { getHeadingPrefix, stripHeadingPrefix } from '../utils/headingFormatter';

interface ContentCanvasProps {
  article: Article;
  styleConfig: StyleConfig;
  onUpdateTitle: (title: string) => void;
  onUpdateAuthor: (author: string) => void;
  onUpdateBlock: (blockId: string, updatedFields: Partial<ContentBlock>) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onInsertBlock: (index: number, type: BlockType) => void;
}

export interface ContentCanvasHandle {
  formatInline: (format: 'bold' | 'italic') => void;
}

export const ContentCanvas = forwardRef<ContentCanvasHandle, ContentCanvasProps>(({
  article,
  styleConfig,
  onUpdateTitle,
  onUpdateAuthor,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onInsertBlock,
}, ref) => {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [hoveredInsertIndex, setHoveredInsertIndex] = useState<number | null>(null);
  const textareaRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());

  const primaryColor = styleConfig.primaryColor || '#07C160';

  const defaultStockImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBUhAhGK4g1LR2VqeAgo9g0EjAQ8DZxrVsP38Po1y4oAP8NbH3TDU4WMYhIJ7P4nMa4tyNfgSZH82_GMbFRePmFS6Vi4Wh2XytCAlPm6mka8hc9APMx5UT6H6D1GgwuekWVNs86BExiEu0WvI_0d67Q3vPFaK1UmoP6YS3Kf1x85t1EGzY6XrS-Xqmv0unIwpeYBSXvmjnYuwWhnIW8xHAkuIohwepbAfXh-5rC03wlMKSrYX5hOqq5',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB5yGV_K2CTZA-KixQBi9LldWeGKWoqkUfxuaipiH2ubmT7oy0yq_-10lCehd2ONLKAqzBsg8tLW7g96MEQcF9UP1CmmBdtZCljnfsWOUJFAa1YISpcZxH7jUDuw4nIeaRTbSytH1ezLCpsOsgp6PuU2HbmxCRFDxwiJ_fVo0fIBo7h-mow3gSstHQOM5IhPUnS78E7lzP2BBV4XEsR01NHFjrK1YTVQyBiSsrXvjXY2nfy-D4yn3l_',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgPKnuD2I3dmK13vIZ4P0fN-5VAEu2m1S0nDxNkASWpR8sW5tLAAgXvUcpp-Zk5CTGHZ2xRz2azw9Szh4G2l0vmaZA6K2SwT9br6ASErbpKIFLg0POgQfK5WhmN3ej37G0MzoJx0kZLnueyROO77blBPt9TqrLhj26tiSg7AMNToJHbrD4F7a5gvqN2F56rkZQ4u8Y5VVSAvU_9UZXb38RLUuzJ-yElXh6O_Rqs1XwdpV0woiy-4IE',
  ];

  const setTextareaRef = useCallback((blockId: string, el: HTMLTextAreaElement | null) => {
    if (el) {
      textareaRefs.current.set(blockId, el);
    } else {
      textareaRefs.current.delete(blockId);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    formatInline(format: 'bold' | 'italic') {
      if (!activeBlockId) return;
      const textarea = textareaRefs.current.get(activeBlockId);
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) return; // no text selected

      const content = textarea.value;
      const marker = format === 'bold' ? '**' : '*';
      const selectedText = content.slice(start, end);

      // Toggle: if already wrapped, unwrap
      let newContent: string;
      let newCursorStart: number;
      let newCursorEnd: number;

      if (selectedText.startsWith(marker) && selectedText.endsWith(marker) && selectedText.length > marker.length * 2) {
        // Unwrap
        const inner = selectedText.slice(marker.length, -marker.length);
        newContent = content.slice(0, start) + inner + content.slice(end);
        newCursorStart = start;
        newCursorEnd = start + inner.length;
      } else {
        // Wrap
        newContent = content.slice(0, start) + marker + selectedText + marker + content.slice(end);
        newCursorStart = start + marker.length;
        newCursorEnd = end + marker.length;
      }

      onUpdateBlock(activeBlockId, { content: newContent });

      // Restore cursor position after React re-render
      setTimeout(() => {
        const el = textareaRefs.current.get(activeBlockId);
        if (el) {
          el.focus();
          el.setSelectionRange(newCursorStart, newCursorEnd);
        }
      }, 0);
    },
  }), [activeBlockId, onUpdateBlock]);

  const clearActiveBlock = () => setActiveBlockId(null);

  return (
    <div className="flex-1 overflow-y-auto p-5 lg:p-8 custom-scrollbar bg-[#ffffff]" onClick={clearActiveBlock}>
      <div className="max-w-[680px] mx-auto min-h-full pb-24">
        {/* Article Title Input */}
        <div className="mb-6 group relative">
          <input
            type="text"
            value={article.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            placeholder="输入文章标题..."
            className="w-full text-[28px] md:text-[32px] font-bold border-none focus:ring-0 focus:outline-none placeholder-[#bbcbba] mb-2 bg-transparent text-[#1b1c1c] tracking-tight"
          />
        </div>

        {/* Article Content Blocks */}
        <div className="space-y-4">
          {article.blocks.map((block, index) => {
            const isActive = activeBlockId === block.id;

            return (
              <div key={block.id} className="relative group">
                {/* Insert Divider Line on Hover */}
                <div
                  onMouseEnter={() => setHoveredInsertIndex(index)}
                  onMouseLeave={() => setHoveredInsertIndex(null)}
                  className="h-3 -my-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <div className="w-full border-t border-dashed border-[#006d33]/30" />
                  <button
                    onClick={() => onInsertBlock(index, 'paragraph')}
                    className="absolute bg-white text-[#006d33] border border-[#006d33]/30 rounded-full text-[10px] px-2 py-0.5 shadow-2xs hover:bg-[#006d33] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[12px]">add</span>
                    添加段落
                  </button>
                </div>

                {/* Block Wrapper Container */}
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveBlockId(block.id); }}
                  className={`group/block relative p-3 rounded-lg transition-all border ${
                    isActive
                      ? 'border-[#07C160] bg-[#07C160]/5 shadow-2xs'
                      : 'border-transparent hover:border-[#07C160]/30 hover:bg-[#07C160]/5'
                  }`}
                >
                  {/* Left Drag Indicator & Reorder Controls */}
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <button
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlock(index, 'up');
                      }}
                      className="p-1 text-[#5d5f5f] hover:text-[#006d33] disabled:opacity-30 cursor-pointer"
                      title="向上移动"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    </button>
                    <span className="text-[9px] font-mono text-[#aaa] my-0.5 select-none">
                      {block.type === 'heading1' ? 'H1' : block.type === 'heading2' ? 'H2' : block.type === 'paragraph' ? 'P' : block.type === 'image' ? 'IMG' : block.type === 'quote' ? 'Q' : block.type === 'callout' ? 'CA' : block.type === 'bullet_list' ? 'UL' : 'HR'}
                    </span>
                    <button
                      disabled={index === article.blocks.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveBlock(index, 'down');
                      }}
                      className="p-1 text-[#5d5f5f] hover:text-[#006d33] disabled:opacity-30 cursor-pointer"
                      title="向下移动"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    </button>
                  </div>

                  {/* Right Delete Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id); }}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[#e4e2e1] shadow-2xs hover:text-[#ba1a1a] hover:border-[#ba1a1a] transition-colors opacity-0 group-hover/block:opacity-100 cursor-pointer text-[#5d5f5f]"
                    title="删除此块"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>

                  {/* Block Type Label */}
                  <div className="absolute -top-3 left-3 px-2 py-0.5 rounded-full bg-white border border-[#e4e2e1] text-[9px] font-bold text-[#5d5f5f] uppercase tracking-wider opacity-0 group-hover/block:opacity-100 transition-opacity pointer-events-none">
                    {block.type === 'heading1' ? '一级标题' : block.type === 'heading2' ? '二级标题' : block.type === 'paragraph' ? '正文' : block.type === 'image' ? '图片' : block.type === 'quote' ? '引用' : block.type === 'callout' ? '要点' : block.type === 'bullet_list' ? '列表' : '分割线'}
                  </div>

                  {/* Render element based on block type */}
                  {block.type === 'heading1' && (
                    <div className="mt-1 mb-1">
                      <textarea
                        ref={(el) => setTextareaRef(block.id, el)}
                        value={block.content}
                        onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
                        placeholder="一级标题..."
                        rows={1}
                        className="w-full text-[22px] font-bold bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
                        style={{ color: primaryColor, borderLeft: `4px solid ${primaryColor}`, paddingLeft: '12px' }}
                      />
                    </div>
                  )}

                  {block.type === 'heading2' && (
                    <div className="mt-1 mb-1">
                      <textarea
                        ref={(el) => setTextareaRef(block.id, el)}
                        value={block.content}
                        onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
                        placeholder="二级标题..."
                        rows={1}
                        className="w-full text-[18px] font-bold bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-[#1b1c1c] pl-2"
                        style={{ borderLeft: `3px solid ${primaryColor}` }}
                      />
                    </div>
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-2 my-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
                          placeholder="粘贴图片 URL..."
                          className="flex-1 px-3 py-2 border border-[#e4e2e1] rounded-lg text-xs focus:outline-none focus:border-[#07C160] bg-[#fcfbfa]"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const randomImg = defaultStockImages[Math.floor(Math.random() * defaultStockImages.length)];
                            onUpdateBlock(block.id, { content: randomImg });
                          }}
                          className="px-2 py-1 text-[10px] bg-[#f0eded] rounded text-[#5d5f5f] hover:bg-[#06c755] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                        >
                          随机图
                        </button>
                      </div>
                      {block.content && (
                        <img
                          src={block.content}
                          alt={block.caption || '文章配图'}
                          className="max-w-full max-h-[320px] object-cover rounded-lg border border-[#e4e2e1] shadow-2xs"
                        />
                      )}
                      <input
                        type="text"
                        value={block.caption || ''}
                        onChange={(e) => onUpdateBlock(block.id, { caption: e.target.value })}
                        placeholder="添加图片描述 / 图注..."
                        className="w-full text-xs text-[#5d5f5f] bg-transparent border-none focus:outline-none focus:ring-0 italic"
                      />
                    </div>
                  )}

                  {block.type === 'quote' && (
                    <blockquote
                      className="p-3.5 my-1 rounded-md border-l-4"
                      style={{
                        backgroundColor: `${primaryColor}0d`,
                        borderColor: primaryColor,
                      }}
                    >
                      <textarea
                        ref={(el) => setTextareaRef(block.id, el)}
                        value={block.content}
                        onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
                        placeholder="输入引用的经典名言或引言内容..."
                        rows={2}
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none italic font-serif text-[#333333]"
                      />
                    </blockquote>
                  )}

                  {block.type === 'callout' && (
                    <div
                      className="p-4 rounded-xl border my-1"
                      style={{
                        backgroundColor: `${primaryColor}12`,
                        borderColor: `${primaryColor}33`,
                      }}
                    >
                      <input
                        type="text"
                        value={block.caption || '📌 重点要点提示'}
                        onChange={(e) => onUpdateBlock(block.id, { caption: e.target.value })}
                        className="w-full font-bold text-sm mb-1 bg-transparent border-none focus:outline-none focus:ring-0"
                        style={{ color: primaryColor }}
                      />
                      <textarea
                        ref={(el) => setTextareaRef(block.id, el)}
                        value={block.content}
                        onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
                        placeholder="在此写入需要特别强调的重点或公告内容..."
                        rows={2}
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-xs leading-relaxed text-[#1b1c1c]"
                      />
                    </div>
                  )}

                  {block.type === 'bullet_list' && (
                    <div className="pl-4 my-1">
                      <textarea
                        ref={(el) => setTextareaRef(block.id, el)}
                        value={block.content}
                        onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
                        placeholder="• 列表第一条&#10;• 列表第二条&#10;• 列表第三条"
                        rows={3}
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-sm leading-relaxed text-[#1b1c1c]"
                      />
                    </div>
                  )}

                  {block.type === 'divider' && (
                    <div className="py-2 flex items-center justify-center">
                      <hr className="w-full border-t border-[#e4e2e1]" />
                    </div>
                  )}

                  {block.type === 'paragraph' && (
                    <textarea
                      ref={(el) => setTextareaRef(block.id, el)}
                      value={block.content}
                      onChange={(e) => onUpdateBlock(block.id, { content: e.target.value })}
                      placeholder="输入正文段落..."
                      rows={2}
                      className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-base leading-relaxed text-[#1b1c1c]"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Quick Add Bar */}
        <div className="mt-8 pt-6 border-t border-dashed border-[#e4e2e1] flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-[#5d5f5f] mr-2">快捷插入:</span>
          <button
            onClick={() => onInsertBlock(article.blocks.length, 'paragraph')}
            className="px-3 py-1.5 rounded-lg bg-[#f0eded] hover:bg-[#006d33] hover:text-white text-xs font-medium text-[#1b1c1c] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">notes</span>
            + 段落
          </button>
          <button
            onClick={() => onInsertBlock(article.blocks.length, 'heading1')}
            className="px-3 py-1.5 rounded-lg bg-[#f0eded] hover:bg-[#006d33] hover:text-white text-xs font-medium text-[#1b1c1c] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">format_h1</span>
            + 标题
          </button>
          <button
            onClick={() => onInsertBlock(article.blocks.length, 'image')}
            className="px-3 py-1.5 rounded-lg bg-[#f0eded] hover:bg-[#006d33] hover:text-white text-xs font-medium text-[#1b1c1c] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">image</span>
            + 插图
          </button>
          <button
            onClick={() => onInsertBlock(article.blocks.length, 'quote')}
            className="px-3 py-1.5 rounded-lg bg-[#f0eded] hover:bg-[#006d33] hover:text-white text-xs font-medium text-[#1b1c1c] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">format_quote</span>
            + 引用
          </button>
          <button
            onClick={() => onInsertBlock(article.blocks.length, 'callout')}
            className="px-3 py-1.5 rounded-lg bg-[#f0eded] hover:bg-[#006d33] hover:text-white text-xs font-medium text-[#1b1c1c] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">featured_play_list</span>
            + 要点框
          </button>
        </div>
      </div>
    </div>
  );
});