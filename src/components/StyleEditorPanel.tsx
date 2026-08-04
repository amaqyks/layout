import React from 'react';
import { StyleConfig } from '../types';

interface StyleEditorPanelProps {
  styleConfig: StyleConfig;
  onUpdateStyle: (newStyle: Partial<StyleConfig>) => void;
  onClose?: () => void;
}

/** 预设排版风格模板 */
const STYLE_PRESETS: { name: string; config: Partial<StyleConfig>; description: string }[] = [
  {
    name: '极简绿色',
    description: '微信绿主色，清爽克制',
    config: {
      primaryColor: '#07C160',
      headingStyle: 'left-border',
      fontFamily: 'PingFang SC',
      fontSize: 16,
      lineHeight: 1.75,
      paragraphSpacing: 16,
    },
  },
  {
    name: '杂志黑白',
    description: '高对比黑白，适合深度长文',
    config: {
      primaryColor: '#1f2937',
      headingStyle: 'bottom-line',
      fontFamily: 'Source Serif 4',
      fontSize: 17,
      lineHeight: 1.85,
      paragraphSpacing: 20,
    },
  },
  {
    name: '商务蓝',
    description: '专业沉稳，适合企业号',
    config: {
      primaryColor: '#2563eb',
      headingStyle: 'solid-bg',
      fontFamily: 'Microsoft YaHei',
      fontSize: 16,
      lineHeight: 1.7,
      paragraphSpacing: 14,
    },
  },
];

export const StyleEditorPanel: React.FC<StyleEditorPanelProps> = ({
  styleConfig,
  onUpdateStyle,
  onClose,
}) => {
  const colorSwatches = [
    { name: '微信绿', value: '#07C160' },
    { name: '墨绿', value: '#006d33' },
    { name: '宝蓝', value: '#2563eb' },
    { name: '曜石黑', value: '#1f2937' },
    { name: '琥珀橙', value: '#d97706' },
    { name: '优雅紫', value: '#7c3aed' },
    { name: '玫瑰红', value: '#e11d48' },
  ];

  const fontOptions: { name: string; value: StyleConfig['fontFamily'] }[] = [
    { name: 'PingFang SC (苹方)', value: 'PingFang SC' },
    { name: 'Microsoft YaHei (微软雅黑)', value: 'Microsoft YaHei' },
    { name: 'Source Serif 4 (人文衬线)', value: 'Source Serif 4' },
    { name: 'Be Vietnam Pro (默认)', value: 'Be Vietnam Pro' },
  ];

  const headingStyles: { label: string; value: StyleConfig['headingStyle'] }[] = [
    { label: '左侧边框', value: 'left-border' },
    { label: '色块背景', value: 'solid-bg' },
    { label: '顶部标签', value: 'badge' },
    { label: '下划粗线', value: 'bottom-line' },
  ];

  return (
    <aside className="w-80 flex flex-col bg-[#fbf9f8] border-l border-[#e4e2e1] overflow-y-auto custom-scrollbar select-none">
      {/* Header */}
      <div className="h-12 border-b border-[#e4e2e1] flex items-center justify-between px-6 bg-white sticky top-0 z-10">
        <h3 className="font-semibold text-xs text-[#3d4a3d] uppercase tracking-wider flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#07C160]">palette</span>
          样式编辑区
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#f0eded] text-[#5d5f5f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Style Presets */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#5d5f5f] tracking-wide block">
            排版风格模板
          </label>
          <div className="space-y-2">
            {STYLE_PRESETS.map((preset) => {
              const isActive =
                styleConfig.primaryColor === preset.config.primaryColor &&
                styleConfig.headingStyle === preset.config.headingStyle;
              return (
                <button
                  key={preset.name}
                  onClick={() => onUpdateStyle(preset.config)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#07C160] bg-[#07C160]/8 shadow-2xs'
                      : 'border-[#e4e2e1] bg-white hover:bg-[#f6f3f2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: preset.config.primaryColor || '#07C160' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#1b1c1c]">{preset.name}</div>
                      <div className="text-[10px] text-[#5d5f5f] truncate">{preset.description}</div>
                    </div>
                    {isActive && (
                      <span className="material-symbols-outlined text-[16px] text-[#07C160]">check_circle</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Color Palette */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#5d5f5f] tracking-wide block">
            全局配色
          </label>
          <div className="flex flex-wrap gap-2.5">
            {colorSwatches.map((swatch) => {
              const isSelected = styleConfig.primaryColor === swatch.value;
              return (
                <button
                  key={swatch.value}
                  onClick={() => onUpdateStyle({ primaryColor: swatch.value })}
                  title={swatch.name}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative ${
                    isSelected
                      ? 'border-[#1b1c1c] scale-110 shadow-sm ring-2 ring-offset-1 ring-[#07C160]'
                      : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.value }}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-white absolute inset-0 flex items-center justify-center font-bold">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Heading Style Decoration */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#5d5f5f] tracking-wide block">
            标题装饰风格
          </label>
          <div className="grid grid-cols-2 gap-2">
            {headingStyles.map((item) => {
              const isSelected = styleConfig.headingStyle === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => onUpdateStyle({ headingStyle: item.value })}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#07C160] bg-[#07C160]/10 text-[#006d33] font-bold shadow-2xs'
                      : 'border-[#e4e2e1] bg-white text-[#1b1c1c] hover:bg-[#f6f3f2]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Heading Numbering Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#5d5f5f] tracking-wide block">
            标题序号规范
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'chinese', label: '一、标题' },
              { id: 'arabic', label: '1. 标题' },
              { id: 'circle', label: '① 标题' },
              { id: 'none', label: '无序号' },
            ].map((item) => {
              const isSelected = (styleConfig.headingNumbering || 'none') === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() =>
                    onUpdateStyle({
                      headingNumbering: item.id as StyleConfig['headingNumbering'],
                    })
                  }
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#07C160] bg-[#07C160]/10 text-[#006d33] font-bold shadow-2xs'
                      : 'border-[#e4e2e1] bg-white text-[#1b1c1c] hover:bg-[#f6f3f2]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Family Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#5d5f5f] tracking-wide block">
            字体设置
          </label>
          <select
            value={styleConfig.fontFamily}
            onChange={(e) =>
              onUpdateStyle({ fontFamily: e.target.value as StyleConfig['fontFamily'] })
            }
            className="w-full p-2.5 rounded-lg border border-[#e4e2e1] bg-white text-xs font-medium text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#07C160]/30 cursor-pointer"
          >
            {fontOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Line Height Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-[#5d5f5f]">正文行高</label>
            <span className="font-mono text-[#006d33]">{styleConfig.lineHeight || 1.75}x</span>
          </div>
          <input
            type="range"
            min="1.4"
            max="2.2"
            step="0.05"
            value={styleConfig.lineHeight || 1.75}
            onChange={(e) => onUpdateStyle({ lineHeight: parseFloat(e.target.value) })}
            className="w-full accent-[#07C160] cursor-pointer"
          />
        </div>

        {/* Paragraph Gap Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-[#5d5f5f]">段落间距</label>
            <span className="font-mono text-[#006d33]">{styleConfig.paragraphSpacing || 16}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            step="2"
            value={styleConfig.paragraphSpacing || 16}
            onChange={(e) => onUpdateStyle({ paragraphSpacing: parseInt(e.target.value, 10) })}
            className="w-full accent-[#07C160] cursor-pointer"
          />
        </div>

        {/* Base Font Size Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-[#5d5f5f]">基础字号</label>
            <span className="font-mono text-[#006d33]">{styleConfig.fontSize || 16}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="20"
            step="1"
            value={styleConfig.fontSize || 16}
            onChange={(e) => onUpdateStyle({ fontSize: parseInt(e.target.value, 10) })}
            className="w-full accent-[#07C160] cursor-pointer"
          />
        </div>
      </div>
    </aside>
  );
};