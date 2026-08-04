import React, { useState } from 'react';
import { BlockType } from '../types';

interface FormattingToolbarProps {
  wordCount: number;
  onAddBlock: (type: BlockType) => void;
  onAIPolish?: () => void;
  onClearContent?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isAiWorking?: boolean;
  isStylePanelOpen?: boolean;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  wordCount,
  onAddBlock,
  onAIPolish,
  onClearContent,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isAiWorking = false,
  isStylePanelOpen = false,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const blockOptions: { type: BlockType; label: string; icon: string }[] = [
    { type: 'paragraph', label: '正文段落', icon: 'notes' },
    { type: 'heading1', label: '一级标题', icon: 'format_h1' },
    { type: 'heading2', label: '二级标题', icon: 'format_h2' },
    { type: 'image', label: '插图及图注', icon: 'image' },
    { type: 'quote', label: '引用金句', icon: 'format_quote' },
    { type: 'callout', label: '亮点要点框', icon: 'wysiwyg' },
    { type: 'bullet_list', label: '项目列表', icon: 'format_list_bulleted' },
    { type: 'divider', label: '分割线', icon: 'horizontal_rule' },
  ];

  return (
    <div className="h-12 border-b border-[#e4e2e1] flex items-center px-4 gap-2 bg-white sticky top-0 z-20 shadow-2xs select-none">
      {/* Undo / Redo Shortcuts */}
      <div className="flex items-center gap-0.5 border-r border-[#e4e2e1] pr-2 mr-1">
        <button
          title="撤回 (Ctrl + Z)"
          disabled={!canUndo}
          onClick={onUndo}
          className={`p-1.5 rounded transition-colors ${
            canUndo
              ? 'hover:bg-[#f6f3f2] text-[#3d4a3d] cursor-pointer'
              : 'text-[#ccc] cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">undo</span>
        </button>
        <button
          title="重做 (Ctrl + Y)"
          disabled={!canRedo}
          onClick={onRedo}
          className={`p-1.5 rounded transition-colors ${
            canRedo
              ? 'hover:bg-[#f6f3f2] text-[#3d4a3d] cursor-pointer'
              : 'text-[#ccc] cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">redo</span>
        </button>
      </div>

      {/* Quick Insert Blocks */}
      <div className="flex items-center gap-1">
        <button
          title="插入图片"
          onClick={() => onAddBlock('image')}
          className="p-1.5 rounded hover:bg-[#f6f3f2] text-[#3d4a3d] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">image</span>
        </button>
        <button
          title="插入引用"
          onClick={() => onAddBlock('quote')}
          className="p-1.5 rounded hover:bg-[#f6f3f2] text-[#3d4a3d] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">format_quote</span>
        </button>
        <button
          title="插入要点框"
          onClick={() => onAddBlock('callout')}
          className="p-1.5 rounded hover:bg-[#f6f3f2] text-[#3d4a3d] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">featured_play_list</span>
        </button>

        {/* Add Block Menu Dropdown - hidden when style panel is open */}
        {!isStylePanelOpen && (
          <div className="relative ml-1">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#f0eded] hover:bg-[#eae8e7] text-xs font-medium text-[#1b1c1c] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              插入模块
              <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
            </button>

            {showAddMenu && (
              <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-[#e4e2e1] rounded-lg shadow-lg py-1 z-50">
                {blockOptions.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => {
                      onAddBlock(opt.type);
                      setShowAddMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#1b1c1c] hover:bg-[#f6f3f2] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#006d33]">
                      {opt.icon}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Assistant Buttons & Clear Content - hidden when style panel is open */}
      {!isStylePanelOpen && (
        <div className="flex items-center gap-2 ml-2">
          {onAIPolish && (
            <button
              onClick={onAIPolish}
              disabled={isAiWorking}
              className="px-3 py-1 rounded-full bg-[#07C160]/10 hover:bg-[#07C160]/20 text-[#006d33] font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-[#07C160]/30"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isAiWorking ? 'autorenew' : 'auto_awesome'}
              </span>
              {isAiWorking ? 'AI 排版中...' : 'AI 结构化排版'}
            </button>
          )}

          {onClearContent && (
            <button
              title="清空文字（保留排版与模板）"
              onClick={() => {
                if (window.confirm('确定要清空文章的所有文字吗？此操作将保留您当前的排版与模板样式。')) {
                  onClearContent();
                }
              }}
              className="px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer border border-red-200"
            >
              <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
              清空文字
            </button>
          )}
        </div>
      )}

      {/* Right Stats Info */}
      <div className="ml-auto flex items-center gap-3 text-xs text-[#5d5f5f]">
        <span>字数: {wordCount.toLocaleString()}</span>
        <span className="text-[#e4e2e1]">|</span>
        <span>阅读时长: {Math.max(1, Math.ceil(wordCount / 400))} 分钟</span>
      </div>
    </div>
  );
};