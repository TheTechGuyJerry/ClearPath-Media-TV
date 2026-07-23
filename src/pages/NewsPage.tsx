import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Calendar, User, Share2, Clock, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import { PUBLICATIONS_DATA, NewsArticle } from '../data/news_articles';

export default function NewsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Find the current publication by slug
  const currentPublication = PUBLICATIONS_DATA[slug || ''] || PUBLICATIONS_DATA['clearpath-daily'];

  // Scroll to top when changing publication or selecting article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug, activeArticleId]);

  // Reset active article when publication changes
  useEffect(() => {
    setActiveArticleId(null);
  }, [slug]);

  const activeArticle = currentPublication.articles.find(a => a.id === activeArticleId);

  const handleShare = (article: NewsArticle) => {
    const url = `${window.location.origin}/news/${currentPublication.slug}?article=${article.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  // Parse custom markdown-like format into React elements
  const renderArticleContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl md:text-2xl font-bold font-sans text-on-surface mt-8 mb-4">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={index} className="text-lg md:text-xl font-bold font-sans text-[#001e40] mt-6 mb-3">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }

      return (
        <p key={index} className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed mb-6">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      <SEO 
        title={`${activeArticle ? activeArticle.title : currentPublication.title} | ClearPath News`}
        description={activeArticle ? activeArticle.excerpt : currentPublication.description}
      />

      <div className="bg-background min-h-screen py-10 md:py-16">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-on-surface-variant font-medium mb-8 sm:mb-10 bg-surface-container-low px-4 py-2 rounded-sm inline-flex">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-outline">News</span>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            {activeArticle ? (
              <>
                <button 
                  onClick={() => setActiveArticleId(null)} 
                  className="hover:text-primary transition-colors text-left"
                >
                  {currentPublication.title}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-outline" />
                <span className="text-primary truncate max-w-[180px] sm:max-w-[280px]">{activeArticle.title}</span>
              </>
            ) : (
              <span className="text-primary">{currentPublication.title}</span>
            )}
          </nav>

          {!activeArticle ? (
            /* Publication List View */
            <div className="animate-fade-in">
              
              {/* Brookings-style Header */}
              <div className="border-b border-outline-variant pb-10 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                  
                  {/* Left block - Title & Accent Line */}
                  <div className="lg:col-span-6 flex flex-col items-start">
                    {/* Thick orange/custom color accent bar */}
                    <div 
                      className="w-16 h-1.5 mb-4" 
                      style={{ backgroundColor: currentPublication.accentColor }}
                    />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans tracking-tight text-on-surface leading-tight">
                      {currentPublication.title}
                    </h1>
                  </div>

                  {/* Right block - Description paragraph */}
                  <div className="lg:col-span-6 lg:pt-2">
                    <p className="text-on-surface-variant font-sans text-sm sm:text-base md:text-lg leading-relaxed">
                      {currentPublication.description}
                    </p>
                  </div>

                </div>
              </div>

              {/* Brookings-style Article Grid / List */}
              <div className="space-y-12">
                {currentPublication.articles.map((article) => (
                  <article 
                    key={article.id} 
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 pb-10 border-b border-outline-variant/60 last:border-0 last:pb-0 items-start group"
                  >
                    
                    {/* Thumbnail Column (Left) */}
                    <div className="md:col-span-4 overflow-hidden rounded-sm bg-surface-container shadow-xs cursor-pointer" onClick={() => setActiveArticleId(article.id)}>
                      <div className="aspect-[16:10] w-full overflow-hidden">
                        <img 
                          src={article.coverImage} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Content Column (Right) */}
                    <div className="md:col-span-8 flex flex-col">
                      {/* Uppercase Category Tag */}
                      <span 
                        className="text-xs font-bold tracking-wider mb-2 uppercase"
                        style={{ color: currentPublication.accentColor }}
                      >
                        {article.category}
                      </span>

                      {/* Clickable Title */}
                      <h2 
                        onClick={() => setActiveArticleId(article.id)}
                        className="text-xl sm:text-2xl font-bold text-on-surface font-sans leading-snug cursor-pointer hover:opacity-85 transition-opacity mb-3"
                      >
                        {article.title}
                      </h2>

                      {/* Author & Date metadata */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mb-4 font-medium">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-outline/30 hidden sm:inline" />
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                      </div>

                      {/* Article Excerpt */}
                      <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mb-4">
                        {article.excerpt}
                      </p>

                      {/* Action Links */}
                      <div className="flex items-center gap-5 mt-1">
                        <button 
                          onClick={() => setActiveArticleId(article.id)}
                          className="text-primary hover:text-primary-container font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-1 group/btn cursor-pointer"
                        >
                          Read Article <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                        </button>
                        <button 
                          onClick={() => handleShare(article)}
                          className="text-on-surface-variant hover:text-primary font-semibold text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" /> Share
                        </button>
                      </div>
                    </div>

                  </article>
                ))}
              </div>

              {/* Sticky bottom sign up promo */}
              <div className="bg-[#faf9f5] border border-outline-variant/60 rounded-sm p-6 sm:p-10 mt-16 sm:mt-24 text-center max-w-3xl mx-auto">
                <Mail className="w-10 h-10 text-primary mx-auto mb-4 stroke-[1.5]" />
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-on-surface mb-2">Subscribe to ClearPath Daily</h3>
                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed mb-6 max-w-lg mx-auto">
                  Get high-impact weekday briefings on Nigeria's politics, governance, and public policy, delivered directly to your inbox before the noise begins.
                </p>
                <Link 
                  to="/subscribe" 
                  className="bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold tracking-wider uppercase px-6 py-3 rounded-sm inline-flex items-center justify-center transition-colors shadow-xs"
                >
                  Subscribe for Free
                </Link>
              </div>

            </div>
          ) : (
            /* Publication Reader View */
            <div className="animate-fade-in max-w-[800px] mx-auto">
              
              {/* Back to list button */}
              <button 
                onClick={() => setActiveArticleId(null)}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors mb-6 cursor-pointer bg-transparent border-none p-0"
              >
                <ArrowLeft className="w-4 h-4" /> Back to all articles
              </button>

              {/* Category Tag */}
              <span 
                className="text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 block"
                style={{ color: currentPublication.accentColor }}
              >
                {activeArticle.category}
              </span>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-on-surface mb-6 leading-tight">
                {activeArticle.title}
              </h1>

              {/* Article metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-outline-variant/60 mb-8">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-on-surface-variant font-medium">
                  <span className="flex items-center gap-1.5 text-on-surface">
                    <User className="w-4 h-4 text-outline" /> {activeArticle.author}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline/30" />
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-outline" /> {activeArticle.date}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline/30 hidden sm:inline" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-outline" /> 4 min read
                  </span>
                </div>

                {/* Share article button */}
                <button 
                  onClick={() => handleShare(activeArticle)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary-container transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" /> {shareCopied ? 'Link Copied!' : 'Share'}
                </button>
              </div>

              {/* Cover Image */}
              <div className="w-full aspect-[16:9] max-h-[480px] overflow-hidden rounded-sm shadow-xs mb-8">
                <img 
                  src={activeArticle.coverImage} 
                  alt={activeArticle.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-slate max-w-none mb-16">
                {renderArticleContent(activeArticle.content)}
              </div>

              {/* Bottom footer navigation within reading context */}
              <div className="border-t border-outline-variant pt-8 flex items-center justify-between">
                <button 
                  onClick={() => setActiveArticleId(null)}
                  className="text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  &larr; Back to articles
                </button>
                <Link 
                  to="/subscribe" 
                  className="text-sm font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  Subscribe to publications &rarr;
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
