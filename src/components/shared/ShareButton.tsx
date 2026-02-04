'use client';

import { useState } from 'react';

import { log } from '@/lib/utils/logger';

type ShareButtonProps = {
  title: string;
  text?: string;
  url?: string;
};

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text: text || title,
      url: url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          log.error('Error sharing:', error);

          await fallbackCopyToClipboard(shareData.url);
        }
      }
    } else {
      await fallbackCopyToClipboard(shareData.url);
    }
  };

  const fallbackCopyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);

      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      log.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="border-border hover:bg-background-neutral-subtle-hovered text-text font-weight-medium rounded-radius-medium relative flex items-center justify-center gap-100 border px-150 py-100 text-sm transition-colors"
    >
      <span className="material-symbols-outlined text-icon text-[20px]">share</span>
      {showCopied && (
        <span className="bg-background-neutral-bold text-text-inverse rounded-radius-small absolute -top-100 left-1/2 -translate-x-1/2 px-100 py-50 text-xs whitespace-nowrap">
          Link copied!
        </span>
      )}
    </button>
  );
}
