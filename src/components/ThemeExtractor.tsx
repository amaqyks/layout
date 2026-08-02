import React, { useState } from 'react';
import { ExtractedTheme } from '../types';
import { extractThemeFromHTML } from '../utils/themeExtractor';

interface ThemeExtractorProps {
  onSaveAndApplyTheme: (theme: ExtractedTheme) => void;
}

export const ThemeExtractor: React.FC<ThemeExtractorProps> = ({ onSaveAndApplyTheme }) => {
  const [inputMode, setInputMode] = useState<'url' | 'html'>('url');
  const [url, setUrl] = useState('');
  const [rawHtml, setRawHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [extractedTheme, setExtractedTheme] = useState<ExtractedTheme | null>(null);

  const handleExtract = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      if (inputMode === 'url') {
        if (!url.trim() || !url.startsWith('http')) {
          throw new Error('请输入有效的微信公众号文章网址 (必须以 http:// 或 https:// 开头)');
        }
        const res = await fetch('/api/extract-theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() }),
        });
        const data = await res.json();
        if (!data.success || !data.html) {
          throw new Error(data.error || '获取公众号文章 HTML 失败');
        }
        const theme = extractThemeFromHTML(data.html, url.trim());
        setExtractedTheme(theme);
      } else {
        if (!rawHtml.trim()) {
          throw new Error('请粘贴公众号文章的 HTML 源码');
        }
        const theme = extractThemeFromHTML(rawHtml.trim());
        setExtractedTheme(theme);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || '解构与提取模板失败，请检查网址或源码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#fbf9f8] p-5 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1c] tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-[32px] text-[#07C160]">auto_fix</span>
            微信公众号文章模板逆向提取系统
          </h1>
          <p className="text-sm text-[#5d5f5f] mt-1">
            输入任意已被排版好的微信公众号文章链接，工具将自动从文章中逆向解构其配色、字体、行高、标题格式、引用框样式并生成可复用的 Theme 模板。
          </p>
        </div>

        {/* Extractor Input Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#e4e2e1] shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-[#e4e2e1] pb-4">
            <button
              onClick={() => setInputMode('url')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                inputMode === 'url'
                  ? 'bg-[#e8f5e9] text-[#006d33] font-bold'
                  : 'text-[#5d5f5f] hover:bg-[#f6f3f2]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">link</span>
              输入公众号文章 URL
            </button>
            <button
              onClick={() => setInputMode('html')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                inputMode === 'html'
                  ? 'bg-[#e8f5e9] text-[#006d33] font-bold'
                  : 'text-[#5d5f5f] hover:bg-[#f6f3f2]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">code</span>
              直接粘贴网页 HTML 源码
            </button>
          </div>

          {inputMode === 'url' ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#5d5f5f] uppercase tracking-wider">
                微信公众号文章链接 (URL)
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://mp.weixin.qq.com/s/..."
                  className="flex-1 px-4 py-3 border border-[#e4e2e1] rounded-xl text-sm focus:outline-none focus:border-[#07C160] transition-all bg-[#fcfbfa]"
                />
                <button
                  onClick={handleExtract}
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#07C160] hover:bg-[#006d33] text-white font-medium text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      正在逆向解构样式...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">bolt</span>
                      开始提取模板
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#5d5f5f] uppercase tracking-wider">
                粘贴公众号网页正文 HTML
              </label>
              <textarea
                value={rawHtml}
                onChange={(e) => setRawHtml(e.target.value)}
                placeholder="<div id='js_content'>...</div>"
                rows={6}
                className="w-full px-4 py-3 border border-[#e4e2e1] rounded-xl text-sm font-mono focus:outline-none focus:border-[#07C160] transition-all bg-[#fcfbfa]"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleExtract}
                  disabled={isLoading}
                  className="px-6 py-3 bg-[#07C160] hover:bg-[#006d33] text-white font-medium text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      正在解构...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">bolt</span>
                      提取 HTML 模板
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-[#ffebee] text-[#c62828] text-sm rounded-xl flex items-center gap-2 border border-[#ffcdd2]">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {errorMessage}
            </div>
          )}
        </div>

        {/* Extracted Result Inspection & Preview */}
        {extractedTheme && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Style Specifications */}
            <div className="bg-white rounded-2xl p-6 border border-[#e4e2e1] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-[#e8f5e9] text-[#006d33] mb-1">
                    解构成功
                  </span>
                  <h2 className="text-lg font-bold text-[#1b1c1c]">{extractedTheme.name}</h2>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#f6f3f2] border border-[#e4e2e1]">
                  <span className="block text-xs text-[#5d5f5f]">提取的主主题色</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-6 h-6 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: extractedTheme.styleConfig.primaryColor }}
                    />
                    <span className="font-mono text-sm font-bold text-[#1b1c1c]">
                      {extractedTheme.styleConfig.primaryColor}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f6f3f2] border border-[#e4e2e1]">
                  <span className="block text-xs text-[#5d5f5f]">正文基础字号</span>
                  <span className="block font-mono text-sm font-bold text-[#1b1c1c] mt-1">
                    {extractedTheme.styleConfig.fontSize} px
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#f6f3f2] border border-[#e4e2e1]">
                  <span className="block text-xs text-[#5d5f5f]">正文基准行高</span>
                  <span className="block font-mono text-sm font-bold text-[#1b1c1c] mt-1">
                    {extractedTheme.styleConfig.lineHeight}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#f6f3f2] border border-[#e4e2e1]">
                  <span className="block text-xs text-[#5d5f5f]">标题样式类型</span>
                  <span className="block font-mono text-sm font-bold text-[#1b1c1c] mt-1 capitalize">
                    {extractedTheme.styleConfig.headingStyle}
                  </span>
                </div>
              </div>

              {/* Extracted Custom CSS */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#5d5f5f] uppercase tracking-wider">
                  提取的反编译 CSS 规则
                </label>
                <textarea
                  readOnly
                  value={extractedTheme.customCss}
                  rows={6}
                  className="w-full p-3 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs rounded-xl focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={() => onSaveAndApplyTheme(extractedTheme)}
                  className="w-full py-3.5 bg-[#006d33] hover:bg-[#07C160] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  保存为可复用模板并立即套用
                </button>
              </div>
            </div>

            {/* Right: Live Rendered Phone Preview */}
            <div className="bg-white rounded-2xl p-6 border border-[#e4e2e1] shadow-sm flex flex-col items-center">
              <h3 className="text-xs font-bold text-[#5d5f5f] uppercase tracking-wider mb-4">
                提取模板实时渲染效果
              </h3>
              
              {/* Phone Container Mock */}
              <div className="w-[340px] bg-white border-[8px] border-[#1b1c1c] rounded-[36px] shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-[#1b1c1c] text-white text-[10px] px-6 py-1.5 flex justify-between items-center">
                  <span>9:41</span>
                  <span className="material-symbols-outlined text-[12px]">wifi</span>
                </div>

                <div className="p-5 overflow-y-auto max-h-[500px] space-y-4 preview-wrapper" style={{
                  fontSize: `${extractedTheme.styleConfig.fontSize}px`,
                  lineHeight: extractedTheme.styleConfig.lineHeight,
                  fontFamily: extractedTheme.styleConfig.fontFamily,
                }}>
                  <style>{extractedTheme.customCss}</style>
                  
                  <h1 className="text-xl font-bold text-[#1b1c1c] leading-tight">
                    {extractedTheme.previewSample?.title || '预览排版标题'}
                  </h1>

                  <h2>{extractedTheme.previewSample?.h2 || '二级标题'}</h2>

                  <p className="text-[#333333]">
                    {extractedTheme.previewSample?.paragraph || '这是段落内容预览。'}
                  </p>

                  <blockquote>
                    {extractedTheme.previewSample?.quote || '引用框样式预览。'}
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
