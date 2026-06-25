import React, { useState, useEffect } from 'react';
import { Play, FileText, ArrowRight, Focus, HelpCircle } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Explainer, ExplainerItem } from '../types';
import { formatFirestoreDate, renderSafe } from '../utils/formatters';
import SEO from '../components/SEO';

const fallbackExplainers: Explainer[] = [
  {
    id: 'explaining-nigeria',
    title: 'Explaining Nigeria',
    slug: 'explaining-nigeria',
    tagline: 'Understanding structural institutions beyond individuals.',
    shortDescription: 'Establishing ClearPath as an authoritative interpreter of governance structures and federal dynamics.',
    fullDescription: 'Our framework details how exclusive list structures work, the boundaries of local authority, and the actual mechanics of state budgets.',
    coverageArea: 'Nigeria',
    topicFocus: ['federalism', 'institutions', 'legislation'],
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1xOuy3teqvz7a_E3Uf0JxXXeB7y-va4puR9WhlYOaMxZRra2hlgpd3Er58gCb15XLovnEFYIScjBj89lWXb5oFgkW2jNEObBh0ugl4GciFh2VrdXS3DZvdz0-rQzL-78nxsqThMacVb5RJQOMt6yhQuxiM831CmW0FzCtgODW5x7FDzy8VVJnZjYpwqN9umcCXTpDnTy3qn7djWGztFO2vXbMK1gPi0RXU1wYuVcl4S02-afhNpYxi3qrppr4siC1nHgEJeTecs border',
    thumbnailImage: '',
    status: 'active',
    isFeatured: true,
    sortOrder: 1,
    seoTitle: 'Explaining Nigeria',
    seoDescription: 'Understanding the state.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const fallbackExplainerItems: ExplainerItem[] = [
  {
    id: 'expl-item-1',
    explainerId: 'explaining-nigeria',
    title: 'The Architecture of Nigerian Federalism',
    slug: 'federalism-architecture',
    excerpt: 'A structural breakdown of the exclusive legislative list and how resource control defines power dynamics between tiers of government.',
    content: 'Details how exclusive structures work.',
    explainerType: 'text',
    youtubeUrl: '',
    youtubeVideoId: '',
    thumbnailUrl: '',
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1xOuy3teqvz7a_E3Uf0JxXXeB7y-va4puR9WhlYOaMxZRra2hlgpd3Er58gCb15XLovnEFYIScjBj89lWXb5oFgkW2jNEObBh0ugl4GciFh2VrdXS3DZvdz0-rQzL-78nxsqThMacVb5RJQOMt6yhQuxiM831CmW0FzCtgODW5x7FDzy8VVJnZjYpwqN9umcCXTpDnTy3qn7djWGztFO2vXbMK1gPi0RXU1wYuVcl4S02-afhNpYxi3qrppr4siC1nHgEJeTecs border',
    transcript: '',
    keyQuestions: 'What is exclusive list?',
    keyPoints: 'Resource control dynamics',
    sourceLinks: 'https://clearpath.media',
    relatedDocuments: [],
    topicTags: ['federalism', 'legislation'],
    coverageArea: 'Nigeria',
    status: 'published',
    isFeatured: true,
    publishedAt: '2026-10-24',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function Explainers() {
  const [explainers, setExplainers] = useState<Explainer[]>([]);
  const [items, setItems] = useState<ExplainerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active modal/playback state
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDynamicExplainers() {
      try {
        const exSnap = await getDocs(collection(db, 'explainers'));
        const activeEx = exSnap.docs
          .map(d => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              createdAtLabel: formatFirestoreDate(data.createdAt),
              updatedAtLabel: formatFirestoreDate(data.updatedAt)
            } as Explainer;
          })
          .filter(e => e.status === 'active');
        activeEx.sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        const itemSnap = await getDocs(collection(db, 'explainerItems'));
        const activeItems = itemSnap.docs
          .map(d => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              publishedAtLabel: formatFirestoreDate(data.publishedAt || data.createdAt),
              createdAtLabel: formatFirestoreDate(data.createdAt),
              updatedAtLabel: formatFirestoreDate(data.updatedAt)
            } as ExplainerItem;
          })
          .filter(i => i.status === 'published');

        if (activeEx.length > 0) {
          setExplainers(activeEx);
          setItems(activeItems);
        } else {
          setExplainers(fallbackExplainers);
          setItems(fallbackExplainerItems);
        }
      } catch (err) {
        console.error('Error fetching explainers: ', err);
        setExplainers(fallbackExplainers);
        setItems(fallbackExplainerItems);
      } finally {
        setLoading(false);
      }
    }
    loadDynamicExplainers();
  }, []);

  if (loading && explainers.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-primary">Loading evergreen library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SEO 
        title="Evergreen Explainers — ClearPath Media TV" 
        description="Foundational data-driven explainers on the democratic processes, civic structures, and federal mechanics shaping Nigeria and Africa." 
      />
      {activeVideoId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-sans animate-fade-in" onClick={() => setActiveVideoId(null)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="max-w-[800px] font-sans">
          <h1 className="font-display-lg text-display-lg text-primary mb-unit-md font-semibold font-display">Explainers Directory</h1>
          <p className="font-headline-md text-headline-md text-on-surface mb-unit-sm font-bold text-primary">ClearPath’s explanatory work is designed as long-term public intelligence.</p>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">Focus: systems, not headlines.</p>
        </div>
      </section>

      {explainers.map((ex, index) => {
        const isAlternate = index % 2 === 1;
        const matchedItems = items.filter(i => i.explainerId === ex.id);

        return (
          <section key={ex.id} className={`w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant last:border-0 font-sans ${isAlternate ? 'bg-surface-container-lowest/50' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-unit-xl">
              <div className="lg:col-span-4 space-y-unit-md">
                <span className="text-[10px] tracking-widest uppercase font-bold text-primary bg-secondary/30 px-2.5 py-0.5 rounded-sm">DYNAMIC EXPLORER</span>
                <h2 className="font-headline-lg text-display-md text-primary font-semibold mt-1 leading-snug">{ex.title}</h2>
                <p className="font-body-md text-on-surface-variant leading-relaxed">{ex.shortDescription}</p>
                
                {ex.fullDescription && (
                  <p className="text-sm border-l border-primary/20 pl-4 py-1 italic text-on-surface-variant leading-relaxed">
                    {ex.fullDescription}
                  </p>
                )}

                <div className="mb-unit-md text-sm">
                  <h4 className="font-label-md text-label-md text-primary uppercase font-bold flex items-center gap-1"><Focus className="w-4 h-4" /> Focus Coverage</h4>
                  <p className="font-body-md text-on-surface font-semibold mt-1">{ex.coverageArea || 'Nigeria'}</p>
                </div>

                {ex.topicFocus && ex.topicFocus.length > 0 && (
                  <div className="mb-unit-md text-sm">
                    <h4 className="font-label-md text-label-md text-primary uppercase font-bold mb-2">Subject Topics</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ex.topicFocus.map(topic => (
                        <span key={topic} className="bg-gray-100 text-primary font-semibold text-[11px] px-2 py-0.5 rounded uppercase">{topic}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-8 flex flex-col gap-unit-md pt-4 lg:pt-0">
                {matchedItems.map(item => (
                  <div key={item.id} className="bg-white border border-outline-variant p-unit-lg rounded-lg group flex flex-col md:flex-row gap-gutter transition-all hover:border-primary shadow-xs">
                    {item.featuredImage && (
                      <div className="w-full md:w-2/5 aspect-[16/9] bg-surface-container-high rounded relative overflow-hidden shrink-0">
                        <img src={item.featuredImage} alt={item.title} className="object-cover w-full h-full" />
                        {item.explainerType === 'video' && item.youtubeVideoId && (
                          <div 
                            onClick={() => setActiveVideoId(item.youtubeVideoId || '3H95x0BV9nA')}
                            className="absolute inset-0 flex items-center justify-center bg-black/25 cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-white fill-current ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-label-sm text-sm text-on-surface-variant font-semibold text-gray-500 font-mono italic">{item.publishedAtLabel || 'Continuous'}</span>
                          <span className="font-label-sm bg-blue-50 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">{item.explainerType}</span>
                        </div>
                        <h3 className="font-headline-md text-lg font-bold text-primary group-hover:text-primary-container leading-snug transition-colors mb-2">{item.title}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed line-clamp-3">{item.excerpt}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-[11px] text-gray-400 font-mono uppercase">{item.coverageArea || 'National Framework'}</span>
                        {item.explainerType === 'video' && item.youtubeVideoId ? (
                          <button 
                            onClick={() => setActiveVideoId(item.youtubeVideoId || '3H95x0BV9nA')}
                            className="inline-flex items-center font-bold text-xs text-primary hover:underline group/btn cursor-pointer"
                          >
                            WATCH VIDEO <Play className="w-3 h-3 ml-1" />
                          </button>
                        ) : (
                          <span className="inline-flex items-center font-bold text-xs text-primary group-hover:underline">
                            Reference File <FileText className="w-3.5 h-3.5 ml-1" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {matchedItems.length === 0 && (
                  <div className="p-10 text-center text-on-surface-variant bg-surface-container-low border border-outline-variant rounded italic">
                    No articles or videos have been published inside this explainer yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
