import React, { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import SEO from '../components/SEO';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export default function ElectionMattersWeekly() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPubs = async () => {
      try {
        let snap;
        try {
          const q = query(collection(db, 'electionMattersWeekly'), orderBy('publishedAt', 'desc'));
          snap = await getDocs(q);
        } catch {
          snap = await getDocs(collection(db, 'electionMattersWeekly'));
        }
        const pubs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        pubs.sort((a: any, b: any) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
        setPublications(pubs);
      } catch (err) {
        console.error('Error fetching publications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPubs();
  }, []);

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title="Election Matters Weekly — ClearPath"
        description="Weekly updates and publications on election matters."
      />
      {/* Header Banner */}
      <div className="bg-[#1e1b4b] text-indigo-100 border-b border-indigo-900 py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex items-center gap-4">
          <div className="p-3 bg-indigo-900 rounded-xl hidden sm:block">
            <FileText className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif mb-3 tracking-tight">
              Election Matters Weekly
            </h1>
            <p className="text-base sm:text-lg text-indigo-200 max-w-3xl leading-relaxed font-medium">
              Weekly publications tracking critical election developments, statutory deadlines, and procedural updates.
            </p>
          </div>
        </div>
      </div>
      
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-8">
        {loading ? (
          <div className="py-20 text-center">
             <p className="text-primary font-mono text-sm uppercase tracking-wider">Loading Publications...</p>
          </div>
        ) : publications.length === 0 ? (
           <div className="py-20 text-center bg-surface-bright rounded-2xl border border-outline-variant shadow-sm">
             <FileText className="w-12 h-12 text-outline mx-auto mb-4" />
             <h3 className="text-xl font-bold text-on-surface mb-2">No Publications Yet</h3>
             <p className="text-on-surface-variant max-w-md mx-auto">Election Matters Weekly publications will appear here once published.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub) => (
              <div key={pub.id} className="bg-surface-bright border border-outline-variant rounded-xl p-6 flex flex-col hover:border-primary/50 transition-colors shadow-sm">
                 <div className="mb-4">
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider mb-2 block">
                      {pub.publishedAt}
                    </span>
                    <h3 className="text-xl font-bold font-serif leading-snug text-on-surface mb-2">
                      {pub.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant line-clamp-3">
                      {pub.description}
                    </p>
                 </div>
                 <div className="mt-auto pt-4 border-t border-outline-variant/50">
                    <a 
                      href={pub.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors w-full justify-center"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                 </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
