import React, { useState, useRef, useEffect } from 'react';
import { Share2, Check, Copy, Twitter, Linkedin, Facebook, Mail, MessageCircle } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  variant?: 'button' | 'icon' | 'compact' | 'pill';
  className?: string;
  showMenu?: boolean;
}

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => fallbackCopy(text, resolve));
    } else {
      fallbackCopy(text, resolve);
    }
  });
}

function fallbackCopy(text: string, resolve: (val: boolean) => void) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    resolve(successful);
  } catch (e) {
    resolve(false);
  }
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title = 'ClearPath Daily',
  text = '',
  variant = 'compact',
  className = '',
  showMenu = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure full URL
  const fullUrl = url.startsWith('http')
    ? url
    : typeof window !== 'undefined'
      ? `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`
      : url;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If native share is supported and user is on mobile/tablet, invoke native share if desired
    if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url: fullUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    const success = await copyToClipboard(fullUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: 'X (Twitter)',
      icon: <Twitter className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-3.5 h-3.5 text-blue-600" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-3.5 h-3.5 text-blue-700" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: <Mail className="w-3.5 h-3.5 text-slate-600" />,
      href: `mailto:?subject=${encodedTitle}&body=Read this on ClearPath Daily: ${encodedUrl}`,
    },
  ];

  return (
    <div ref={containerRef} className="relative inline-flex items-center text-left">
      {variant === 'button' ? (
        <div className="inline-flex items-center rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 shadow-2xs transition-colors overflow-hidden">
          <button
            type="button"
            onClick={handleQuickCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
              copied
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                : 'text-on-surface hover:text-primary'
            } ${className}`}
            title="Click to copy shareable link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-75 duration-200" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-primary" />
                <span>Share</span>
              </>
            )}
          </button>
          {showMenu && (
            <button
              type="button"
              onClick={handleToggleMenu}
              className="px-2 py-1.5 border-l border-outline-variant/40 hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer"
              title="More sharing options"
              aria-label="More sharing options"
            >
              <span className="text-[10px] leading-none">▼</span>
            </button>
          )}
        </div>
      ) : variant === 'pill' ? (
        <button
          type="button"
          onClick={handleQuickCopy}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-semibold rounded-full border transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/60 text-on-surface-variant hover:text-primary'
          } ${className}`}
          title="Copy shareable link"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3 h-3 text-primary" />
              <span>Share Link</span>
            </>
          )}
        </button>
      ) : variant === 'icon' ? (
        <button
          type="button"
          onClick={handleQuickCopy}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600'
              : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/60 text-on-surface-variant hover:text-primary'
          } ${className}`}
          title={copied ? 'Link Copied!' : 'Copy shareable link'}
          aria-label="Share Link"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
        </button>
      ) : (
        /* compact text button */
        <button
          type="button"
          onClick={handleQuickCopy}
          className={`inline-flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${
            copied
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-on-surface-variant hover:text-primary'
          } ${className}`}
          title="Copy shareable link"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3 h-3 text-primary" />
              <span>Share</span>
            </>
          )}
        </button>
      )}

      {/* Share Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface-bright rounded-xl shadow-xl border border-outline-variant py-2 z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/40 mb-1">
            Share this content
          </div>

          <button
            type="button"
            onClick={async (e) => {
              await handleQuickCopy(e);
              setMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-surface-container text-on-surface font-semibold transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-primary" />
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <div className="my-1 border-t border-outline-variant/30" />

          {shareLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-surface-container text-on-surface transition-colors font-medium"
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
