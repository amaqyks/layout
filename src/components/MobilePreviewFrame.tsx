import React, { useState } from 'react';
import { Article, StyleConfig } from '../types';
import { getHeadingPrefix, stripHeadingPrefix } from '../utils/headingFormatter';

interface MobilePreviewFrameProps {
  article: Article;
  styleConfig: StyleConfig;
}

/** Render inline markdown markers **bold** and *italic* as styled JSX */
function RenderInline({ text, primaryColor }: { text: string; primaryColor?: string }): React.ReactNode {
  if (!text) return null;
  const color = primaryColor || '#07C160';
  const parts: React.ReactNode[] = [];
  // Split by **bold** and *italic* patterns
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      // **bold**
      parts.push(<strong key={++key} style={{ fontWeight: 'bold', color }}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      // *italic*
      parts.push(<em key={++key}>{match[3]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? <>{parts}</> : text;
}

export const MobilePreviewFrame: React.FC<MobilePreviewFrameProps> = ({
  article,
  styleConfig,
}) => {
  const [showDeviceShell, setShowDeviceShell] = useState(true);

  const primaryColor = styleConfig.primaryColor || '#07C160';

  const fontFamilyClass = styleConfig.fontFamily === 'Source Serif 4'
    ? 'font-source-serif'
    : styleConfig.fontFamily === 'Be Vietnam Pro'
    ? 'font-be-vietnam'
    : 'font-sans';

  return (
    <section className="w-[380px] xl:w-[400px] flex flex-col items-center justify-center bg-[#fbf9f8] p-4 relative overflow-hidden select-none border-l border-[#e4e2e1]">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 opacity-20 bg-radial from-[#07C160]/20 to-transparent pointer-events-none" />

      {/* Mobile Device Container Frame */}
      <div
        className={`wechat-preview-shadow transition-all duration-300 relative bg-white overflow-hidden ${
          showDeviceShell
            ? 'w-[320px] sm:w-[340px] h-[570px] border-[6px] border-[#333333] rounded-[28px]'
            : 'w-[320px] sm:w-[340px] h-[570px] rounded-xl border border-[#e4e2e1]'
        }`}
      >
        {/* Status Bar */}
        {showDeviceShell && (
          <div className="h-6 w-full bg-white flex justify-between items-center px-4 text-[10px] text-[#333333] font-mono border-b border-gray-100">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[12px]">signal_cellular_4_bar</span>
              <span className="material-symbols-outlined text-[12px]">wifi</span>
              <span className="material-symbols-outlined text-[12px]">battery_full</span>
            </div>
          </div>
        )}

        {/* WeChat Official Account Article Container */}
        <div className={`h-[calc(100%-24px)] overflow-y-auto bg-white p-5 custom-scrollbar ${fontFamilyClass}`}>
          {/* Article Title */}
          <h1 className="text-[22px] font-bold text-[#1b1c1c] mb-4 leading-snug">
            {article.title || '输入文章标题...'}
          </h1>

          {/* Account Subtitle Info */}
          <div className="flex items-center gap-2 mb-6 text-xs text-gray-400">
            <span className="text-[#2563eb] font-medium">{article.author || '微信排版助手'}</span>
            <span>{article.date || new Date().toISOString().slice(0, 10)}</span>
          </div>

          {/* Render Article Blocks */}
          <div
            className="space-y-4 text-[16px] text-[#1b1c1c]"
            style={{
              lineHeight: styleConfig.lineHeight || 1.75,
              fontSize: `${styleConfig.fontSize || 16}px`,
            }}
          >
            {article.blocks.length === 0 ? (
              <p className="text-gray-400 italic text-sm text-center py-10">在左侧添加正文块以查看实时预览...</p>
            ) : (
              article.blocks.map((block) => {
                switch (block.type) {
                  case 'heading1': {
                    const prefix = getHeadingPrefix('heading1', block.id, article.blocks, styleConfig);
                    const cleanText = stripHeadingPrefix(block.content);
                    const displayText = prefix + cleanText;

                    if (styleConfig.headingStyle === 'solid-bg') {
                      return (
                        <div key={block.id} className="mt-6 mb-3">
                          <h2
                            className="text-[18px] font-bold text-white px-3 py-2 rounded-md"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {displayText}
                          </h2>
                        </div>
                      );
                    } else if (styleConfig.headingStyle === 'badge') {
                      return (
                        <div key={block.id} className="mt-6 mb-3">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                          >
                            SECTION
                          </span>
                          <h2 className="text-[18px] font-bold mt-1" style={{ color: primaryColor }}>
                            {displayText}
                          </h2>
                        </div>
                      );
                    } else if (styleConfig.headingStyle === 'bottom-line') {
                      return (
                        <div key={block.id} className="mt-6 mb-3 pb-1 border-b-2" style={{ borderColor: primaryColor }}>
                          <h2 className="text-[18px] font-bold" style={{ color: primaryColor }}>
                            {displayText}
                          </h2>
                        </div>
                      );
                    } else {
                      // default left-border
                      return (
                        <div key={block.id} className="mt-6 mb-3">
                          <h2
                            className="text-[18px] font-bold pl-3"
                            style={{ borderLeft: `4px solid ${primaryColor}`, color: primaryColor }}
                          >
                            {displayText}
                          </h2>
                        </div>
                      );
                    }
                  }

                  case 'heading2': {
                    const prefix = getHeadingPrefix('heading2', block.id, article.blocks, styleConfig);
                    const cleanText = stripHeadingPrefix(block.content);
                    const displayText = prefix + cleanText;

                    return (
                      <h3 
                        key={block.id} 
                        className="text-[16px] font-bold text-[#1b1c1c] mt-5 mb-2 pl-2"
                        style={{ borderLeft: `3px solid ${primaryColor}` }}
                      >
                        {displayText}
                      </h3>
                    );
                  }

                  case 'image':
                    return (
                      <figure key={block.id} className="my-4 text-center">
                        <img
                          src={block.content}
                          alt={block.caption || ''}
                          className="max-w-full h-auto rounded-lg"
                          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        />
                        {block.caption && (
                          <figcaption className="text-xs text-[#666] mt-2">{block.caption}</figcaption>
                        )}
                      </figure>
                    );

                  case 'quote':
                    return (
                      <blockquote
                        key={block.id}
                        className="my-3 p-3.5 rounded-md text-sm italic border-l-4 leading-relaxed"
                        style={{
                          backgroundColor: `${primaryColor}0d`,
                          borderColor: primaryColor,
                          color: '#333333',
                        }}
                      >
                        <RenderInline text={block.content} primaryColor={primaryColor} />
                      </blockquote>
                    );

                  case 'callout':
                    return (
                      <div
                        key={block.id}
                        className="my-4 p-4 rounded-xl border"
                        style={{
                          backgroundColor: `${primaryColor}12`,
                          borderColor: `${primaryColor}33`,
                        }}
                      >
                        {block.caption && (
                          <div className="font-bold text-xs mb-1" style={{ color: primaryColor }}>
                            {block.caption}
                          </div>
                        )}
                        <div className="text-xs leading-relaxed text-gray-800">
                          <RenderInline text={block.content} primaryColor={primaryColor} />
                        </div>
                      </div>
                    );

                  case 'bullet_list':
                    return (
                      <div key={block.id} className="my-3 space-y-2">
                        {block.content.split('\n').filter(Boolean).map((item, idx) => (
                          <div key={idx} className="flex items-start text-sm text-gray-800 leading-relaxed">
                            <span 
                              className="mr-2 font-bold select-none flex-shrink-0" 
                              style={{ color: primaryColor }}
                            >
                              •
                            </span>
                            <span className="flex-1">
                              <RenderInline text={item.replace(/^[•\-\*]\s*/, '')} primaryColor={primaryColor} />
                            </span>
                          </div>
                        ))}
                      </div>
                    );

                  case 'divider':
                    return <hr key={block.id} className="my-5 border-t border-gray-200" />;

                  case 'paragraph':
                  default:
                    return (
                      <p
                        key={block.id}
                        className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                        style={{ marginBottom: `${styleConfig.paragraphSpacing || 16}px` }}
                      >
                        <RenderInline text={block.content} primaryColor={primaryColor} />
                      </p>
                    );
                }
              })
            )}
          </div>
        </div>
      </div>

      {/* Preview Device Controls */}
      <div className="mt-6 flex gap-3 z-10">
        <button
          onClick={() => setShowDeviceShell(!showDeviceShell)}
          className={`p-2.5 rounded-full bg-white border border-[#e4e2e1] text-[#5d5f5f] hover:text-[#006d33] transition-all cursor-pointer shadow-2xs ${
            showDeviceShell ? 'text-[#006d33] bg-[#07C160]/10' : ''
          }`}
          title="切换手机外壳"
        >
          <span className="material-symbols-outlined text-[20px]">smartphone</span>
        </button>

        <button
          onClick={() => {
            // Force re-render refresh state animation
          }}
          className="p-2.5 rounded-full bg-white border border-[#e4e2e1] text-[#5d5f5f] hover:text-[#006d33] transition-all active:scale-95 cursor-pointer shadow-2xs"
          title="刷新同步"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
      </div>
    </section>
  );
};