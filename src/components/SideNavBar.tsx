import React from 'react';
import { NavTab } from '../types';

interface SideNavBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNewArticle: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentTab,
  onTabChange,
  onNewArticle,
}) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-[230px] flex flex-col py-5 bg-white border-r border-[#e4e2e1] z-50 select-none shadow-sm">
      {/* Brand Header */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[24px] text-[#07C160]">
            draw
          </span>
          <span className="font-bold text-[17px] text-[#006d33] tracking-tight">
            公众号排版助手
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 space-y-1">
        <button
          onClick={() => onTabChange('projects')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium cursor-pointer ${
            currentTab === 'projects'
              ? 'text-[#006d33] font-bold border-r-2 border-[#006d33] bg-[#f6f3f2]'
              : 'text-[#5d5f5f] hover:text-[#1b1c1c] hover:bg-[#f6f3f2]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            dashboard
          </span>
          <span>项目管理</span>
        </button>

        <button
          onClick={() => onTabChange('templates')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium cursor-pointer ${
            currentTab === 'templates'
              ? 'text-[#006d33] font-bold border-r-2 border-[#006d33] bg-[#f6f3f2]'
              : 'text-[#5d5f5f] hover:text-[#1b1c1c] hover:bg-[#f6f3f2]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            bookmarks
          </span>
          <span>模板库</span>
        </button>

        <button
          onClick={() => onTabChange('extractor')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium cursor-pointer ${
            currentTab === 'extractor'
              ? 'text-[#006d33] font-bold border-r-2 border-[#006d33] bg-[#f6f3f2]'
              : 'text-[#5d5f5f] hover:text-[#1b1c1c] hover:bg-[#f6f3f2]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            auto_fix
          </span>
          <span>文章模板逆向提取</span>
        </button>

        <button
          onClick={() => onTabChange('editing')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium cursor-pointer ${
            currentTab === 'editing'
              ? 'text-[#006d33] font-bold border-r-2 border-[#006d33] bg-[#f6f3f2]'
              : 'text-[#5d5f5f] hover:text-[#1b1c1c] hover:bg-[#f6f3f2]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            edit_note
          </span>
          <span>正在编辑</span>
        </button>
      </div>

      {/* Bottom Action Buttons */}
      <div className="mt-auto px-4 space-y-3">
        <button
          onClick={onNewArticle}
          className="w-full py-2.5 rounded-xl bg-[#006d33] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-90 active:scale-98 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          新建文章
        </button>
      </div>
    </aside>
  );
};
