import React, { useState, useEffect, useCallback } from 'react';

interface FloatingActionToolbarProps {
  isStylePanelOpen: boolean;
  onToggleStylePanel: () => void;
  onToggleTemplateSwitcher: () => void;
  onSaveTemplate: () => void;
  onCopyWeChat: () => Promise<boolean>;
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 10) return '刚刚';
  if (seconds < 60) return `${seconds} 秒前`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
}

export const FloatingActionToolbar: React.FC<FloatingActionToolbarProps> = ({
  isStylePanelOpen,
  onToggleStylePanel,
  onToggleTemplateSwitcher,
  onSaveTemplate,
  onCopyWeChat,
}) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleCopy = async () => {
    const success = await onCopyWeChat();
    if (success) {
      setCopied(true);
      showToast('已复制微信排版格式！可直接粘贴至公众号后台');
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast('复制失败，请重试');
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#1b1c1c] text-white text-xs px-5 py-2.5 rounded-full shadow-xl z-[100] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-[#07C160]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Action Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-[#bbcbba] canvas-shadow z-[60] gap-3 select-none">
        {/* Left Toggles */}
        <div className="flex items-center gap-1 border-r border-[#bbcbba] pr-4">
          <button
            onClick={onToggleTemplateSwitcher}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#f6f3f2] transition-colors text-[#1b1c1c] text-sm font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">view_carousel</span>
            <span>模板</span>
          </button>
          
          <button
            onClick={onToggleStylePanel}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium cursor-pointer ${
              isStylePanelOpen
                ? 'bg-[#006d33] text-white shadow-xs'
                : 'hover:bg-[#f6f3f2] text-[#1b1c1c]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">palette</span>
            <span>样式</span>
          </button>

          <button
            onClick={() => {
              onSaveTemplate();
              showToast('已将当前排版存为新模板！');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#f6f3f2] transition-colors text-[#1b1c1c] text-sm font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            <span>存为模板</span>
          </button>
        </div>

        {/* Right Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-6 py-2 rounded-lg bg-[#07C160] text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-[#07C160]/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? '已复制！' : '复制正文'}</span>
          </button>
        </div>
      </div>
    </>
  );
};