import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';

interface RichContentRendererProps {
  content?: string | null;
  className?: string;
  fallbackText?: string;
}

/**
 * Sanitizes and renders rich text generated from the CMS (Quill editor HTML, Markdown, or plain text).
 * Prevents container overflow, wraps long text/words, and formats media and typography cleanly.
 */
export function RichContentRenderer({
  content,
  className = '',
  fallbackText = 'No content available.'
}: RichContentRendererProps) {
  if (!content || !content.trim()) {
    return (
      <p className="text-on-surface-variant italic text-sm md:text-base">
        {fallbackText}
      </p>
    );
  }

  // Safe DOMPurify config that supports standard rich HTML + embeds
  const cleanHtml = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe', 'video', 'source', 'figure', 'figcaption', 'u', 's', 'span'],
    ADD_ATTR: [
      'allow',
      'allowfullscreen',
      'frameborder',
      'scrolling',
      'target',
      'rel',
      'class',
      'style',
      'src',
      'alt',
      'width',
      'height',
      'controls'
    ]
  });

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  const baseProseClasses = `
    rich-content-container
    w-full max-w-full min-w-0
    break-words [word-break:break-word] [overflow-wrap:anywhere]
    text-on-surface text-base md:text-lg leading-relaxed font-normal
    [&_p]:mb-5 [&_p]:leading-[1.75] [&_p]:text-on-surface/90
    [&_h1]:font-serif [&_h1]:font-black [&_h1]:text-3xl md:[&_h1]:text-4xl [&_h1]:text-on-surface [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:leading-tight
    [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:text-on-surface [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:leading-snug
    [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:text-on-surface [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:leading-snug
    [&_h4]:font-sans [&_h4]:font-bold [&_h4]:text-lg [&_h4]:text-on-surface [&_h4]:mt-5 [&_h4]:mb-2
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
    [&_li]:text-on-surface/90 [&_li]:leading-relaxed
    [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-surface-container-low [&_blockquote]:px-5 [&_blockquote]:py-3.5 [&_blockquote]:rounded-r-xl [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-on-surface
    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium hover:[&_a]:text-primary-container
    [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-6 [&_img]:border [&_img]:border-outline-variant/60 [&_img]:shadow-xs
    [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-6 [&_iframe]:border [&_iframe]:border-outline-variant/60
    [&_table]:w-full [&_table]:max-w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:border [&_table]:border-outline-variant [&_table]:text-sm
    [&_th]:bg-surface-container-high [&_th]:p-3 [&_th]:border [&_th]:border-outline-variant [&_th]:text-left [&_th]:font-bold
    [&_td]:p-3 [&_td]:border [&_td]:border-outline-variant/60
    [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-sm [&_pre]:font-mono
    [&_code]:bg-surface-container-high [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-sm [&_code]:text-primary
    [&_.ql-align-center]:text-center
    [&_.ql-align-right]:text-right
    [&_.ql-align-justify]:text-justify
    [&_.ql-size-small]:text-sm
    [&_.ql-size-large]:text-xl md:[&_.ql-size-large]:text-2xl [&_.ql-size-large]:font-serif
    [&_.ql-size-huge]:text-2xl md:[&_.ql-size-huge]:text-3xl [&_.ql-size-huge]:font-serif [&_.ql-size-huge]:font-bold
    ${className}
  `;

  if (isHtml) {
    return (
      <div
        className={baseProseClasses}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  }

  // Fallback for markdown or plain text
  return (
    <div className={baseProseClasses}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{cleanHtml}</ReactMarkdown>
    </div>
  );
}

export default RichContentRenderer;
