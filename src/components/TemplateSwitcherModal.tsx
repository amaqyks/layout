import React, { useState } from 'react';
import { Article, StyleConfig } from '../types';
import { MobilePreviewFrame } from './MobilePreviewFrame';

interface TemplateSwitcherModalProps {
  currentArticle: Article;
  currentStyleConfig: StyleConfig;
  templates: Article[];
  onClose: () => void;
  onApplyTemplate: (template: Article) => void;
}

export const TemplateSwitcherModal: React.FC<TemplateSwitcherModalProps> = ({
  currentArticle,
  currentStyleConfig,
  templates,
  onClose,
  onApplyTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Article | null>(null);

  // Derive active style config for the preview
  const activeStyleConfig: StyleConfig = selectedTemplate?.styleConfig || currentStyleConfig;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-[90vw] h-[85vh] max-w-6xl overflow-hidden shadow-2xl border border-[#e4e2e1] flex">
        
        {/* Left Side: Template Selection */}
        <div className="w-1/3 min-w-[320px] bg-[#fbf9f8] border-r border-[#e4e2e1] flex flex-col h-full">
          <div className="p-5 border-b border-[#e4e2e1] bg-white flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-bold text-lg text-[#1b1c1c]">选择版式模板</h3>
              <p className="text-xs text-[#5d5f5f] mt-1">实时预览排版效果</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[#f0eded] text-[#5d5f5f] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group flex flex-col gap-2 ${
                  selectedTemplate?.id === tpl.id
                    ? 'bg-white border-[#07C160] shadow-md ring-1 ring-[#07C160]/30'
                    : 'bg-white border-[#e4e2e1] hover:border-[#006d33] hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-[#1b1c1c] group-hover:text-[#006d33] truncate pr-2">
                    {tpl.title}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006d33] bg-[#006d33]/10 px-2 py-0.5 rounded shrink-0">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-xs text-[#5d5f5f] line-clamp-2 leading-relaxed">
                  {tpl.description || '自定义模板'}
                </p>
                {tpl.styleConfig && (
                  <div className="flex gap-2 items-center mt-1">
                    <span className="w-3 h-3 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: tpl.styleConfig.primaryColor }} />
                    <span className="text-[10px] text-[#888888] font-mono">
                      {tpl.styleConfig.fontSize}px / {tpl.styleConfig.lineHeight}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-[#e4e2e1] flex gap-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#e4e2e1] text-sm font-medium text-[#5d5f5f] hover:bg-[#fbf9f8] transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                if (selectedTemplate) {
                  onApplyTemplate(selectedTemplate);
                }
              }}
              disabled={!selectedTemplate}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                selectedTemplate 
                  ? 'bg-[#07C160] hover:bg-[#006d33] text-white cursor-pointer'
                  : 'bg-[#e4e2e1] text-[#aaa] cursor-not-allowed'
              }`}
            >
              确定套用
            </button>
          </div>
        </div>

        {/* Right Side: Live Preview */}
        <div className="flex-1 bg-white relative flex flex-col h-full overflow-hidden">
          <div className="p-3 bg-[#fbf9f8] border-b border-[#e4e2e1] flex justify-between items-center shrink-0 z-10">
            <span className="text-xs font-medium text-[#5d5f5f] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              实时预览 ({selectedTemplate ? selectedTemplate.title : '原样式'})
            </span>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center py-5 bg-[#f6f3f2]">
            {/* Phone Frame Simulator */}
            <div className="w-[414px] bg-white shadow-xl min-h-[700px] pb-10 flex justify-center">
              <MobilePreviewFrame 
                article={currentArticle} 
                styleConfig={activeStyleConfig} 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
