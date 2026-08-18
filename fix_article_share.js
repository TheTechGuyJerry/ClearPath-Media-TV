import fs from 'fs';

let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

const target = `            <button className="w-9 h-9 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </button>`;

const imports = `import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, Printer, BookmarkPlus, ArrowRight, Copy, Check, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';`;

content = content.replace("import { ArrowLeft, Clock, Share2, Printer, BookmarkPlus, ArrowRight } from 'lucide-react';", imports);

const statesTarget = `  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ClearPathDailyArticle | null>(null);`;

const statesReplacement = `  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ClearPathDailyArticle | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };`;

content = content.replace(statesTarget, statesReplacement);

const shareDropdown = `            <div className="relative">
              <button 
                onClick={() => setIsShareOpen(!isShareOpen)}
                className="w-9 h-9 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" 
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {isShareOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-bright rounded-xl shadow-lg border border-outline-variant py-2 z-50">
                  <a href={\`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(currentUrl)}\`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                    <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                  </a>
                  <a href={\`https://twitter.com/intent/tweet?url=\${encodeURIComponent(currentUrl)}&text=\${encodeURIComponent(article?.title || '')}\`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                    <Twitter className="w-4 h-4 text-sky-500" /> Twitter
                  </a>
                  <a href={\`https://www.linkedin.com/shareArticle?mini=true&url=\${encodeURIComponent(currentUrl)}&title=\${encodeURIComponent(article?.title || '')}\`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                    <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
                  </a>
                  <a href={\`mailto:?subject=\${encodeURIComponent(article?.title || '')}&body=\${encodeURIComponent(currentUrl)}\`} className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                    <Mail className="w-4 h-4 text-slate-500" /> Email
                  </a>
                  <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors border-t border-outline-variant mt-1 pt-3">
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />} 
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>`;

content = content.replace(target, shareDropdown);

fs.writeFileSync('src/pages/ArticlePage.tsx', content);
console.log("Fixed ArticlePage share.");
