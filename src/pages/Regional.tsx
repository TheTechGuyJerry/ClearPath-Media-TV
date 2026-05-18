import { Play, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Regional() {
  return (
    <div className="w-full">
      <header className="mb-unit-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-unit-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-unit-lg border-b border-outline-variant pb-unit-lg">
          <div className="max-w-[720px]">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-unit-sm block">Programme Series</span>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-unit-md">Nigeria &amp; Neighbours</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">Expert-led analysis of West Africa’s political economy, security, and regional dynamics.</p>
          </div>
          <div className="flex flex-wrap gap-unit-sm">
            <button className="bg-primary text-on-primary px-unit-lg py-unit-sm font-label-md text-label-md hover:bg-primary-container transition-colors rounded-sm tracking-wide">Subscribe to Series</button>
            <button className="border border-outline text-primary px-unit-lg py-unit-sm font-label-md text-label-md hover:bg-surface-container-low transition-colors rounded-sm tracking-wide">Share</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-unit-xl">
        <div className="lg:col-span-8 space-y-unit-xl">
          <section>
            <div className="relative overflow-hidden rounded-lg">
              <div className="aspect-video w-full bg-surface-container-highest relative">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0" 
                  title="Nigeria & Neighbours Featured" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-unit-lg border-b border-outline-variant pb-unit-xs inline-block">Focus Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-lg">
              <div className="p-unit-lg bg-surface-container-low border border-outline-variant hover:bg-white transition-colors group">
                <span className="material-symbols-outlined text-primary mb-unit-md scale-125 block">hub</span>
                <h4 className="font-headline-md text-headline-md text-primary mb-unit-sm">Second-order effects</h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Analyzing how domestic policy shifts in Abuja ripple through the markets of Cotonou, Niamey, and Yaoundé.</p>
                <a href="#" className="mt-unit-md inline-flex items-center gap-unit-sm font-label-md text-label-md text-primary group-hover:underline">Explore Archive <ArrowRight className="w-4 h-4 ml-1" /></a>
              </div>
              <div className="p-unit-lg bg-surface-container-low border border-outline-variant hover:bg-white transition-colors group">
                <span className="material-symbols-outlined text-primary mb-unit-md scale-125 block">public</span>
                <h4 className="font-headline-md text-headline-md text-primary mb-unit-sm">Cross-border dynamics</h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Mapping the movement of capital, goods, and people across the porous boundaries of the Lake Chad Basin.</p>
                <a href="#" className="mt-unit-md inline-flex items-center gap-unit-sm font-label-md text-label-md text-primary group-hover:underline">View Map Data <ArrowRight className="w-4 h-4 ml-1" /></a>
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-unit-lg">
              <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-outline-variant pb-unit-xs">Analysis Archive</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-unit-lg">
              {[
                { tag1: 'Nigeria / Niger', tag2: 'Trade Policy', title: 'The Cost of Containment: Trade Realities at the Northern Border', desc: 'An investigation into the informal economy sustaining border communities despite official closures and security cordons.', author: 'Fola Akinnola', initials: 'FA', date: 'Oct 24, 2023', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDee0w6o8VrsC1s8Sz4kneE26vjYU0fVv9ETeFSfIS3NOFH-l9C_ZoDfL7cPkCe6_ZvtJdNxrY_z-ZqjvRIEPzPtU_VyDnMfjjebyRhUgwzXSlqIpp6JyySZpqKNWxM3YkW4Qow-_t4BxcSEKZbF-9H-x-qWNF-nCMnAdlwppEbgao8FryBUtFQY1UGqKJazwdtMBt2DAy5gxeMNGaivN_Ffjmqz0QsyIbuhf6AIrCD3Mz2p-l_huWx6NlKrG0Zv8WFC_KZbt1zV2s' },
                { tag1: 'Regional', tag2: 'Currency', title: 'Naira Devaluation and its Ripple Effects in the CFA Zone', desc: 'How current monetary policy shifts in Abuja are impacting purchasing power and trade balances for neighbors in the Franc Zone.', author: 'Dr. David Mensah', initials: 'DM', date: 'Oct 17, 2023', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa8vUnccKXs8ZCSSVElB0GVVL5nutO4-umb9F1DwRCp6ySGq25stqGs7GAaGI22gNo07ZYmdtlttkimkrSrRA4kNYvd0o93uzdjBdaM3dU7uj16QdLJelJzp1eJGX6TovkN28L7C89G9icfqcnSKX7PtEMw1ZHsmPgQ_FirJobDrZv9-vbHKHVxPYgMg3SO6dFeE2g9qHAUFkk50CD6uu3IbP5w2v12l0R38o5qzbqHjDWGXPy3etgCxqkBgb_JhSixtl8E6IzKaM' }
              ].map((item, idx) => (
                <div key={idx} className="group flex flex-col md:flex-row gap-unit-lg border-b border-outline-variant pb-unit-lg hover:bg-surface-container-lowest transition-colors p-unit-sm -mx-unit-sm">
                  <div className="md:w-1/3 aspect-[4/3] bg-surface-container-highest overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap gap-unit-xs mb-unit-sm">
                        <span className="bg-surface-container-high text-on-surface-variant px-unit-sm py-unit-xs text-[10px] uppercase font-bold tracking-tighter rounded-sm">{item.tag1}</span>
                        <span className="bg-surface-container-high text-on-surface-variant px-unit-sm py-unit-xs text-[10px] uppercase font-bold tracking-tighter rounded-sm">{item.tag2}</span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-primary mb-unit-sm group-hover:text-surface-tint transition-colors">{item.title}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{item.desc}</p>
                    </div>
                    <div className="mt-unit-md flex items-center justify-between">
                      <div className="flex items-center gap-unit-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[10px] font-bold">{item.initials}</div>
                        <div className="text-label-sm text-label-sm">
                          <p className="text-primary font-bold">{item.author}</p>
                          <p className="text-on-surface-variant opacity-70">{item.date}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-unit-xs font-label-md text-label-md text-primary uppercase group-hover:underline">
                        Watch Episode <Play className="w-3 h-3 ml-1 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-unit-lg">
          <div className="p-unit-lg bg-surface-container border border-outline-variant">
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-unit-lg">Series Intelligence</h3>
            <div className="space-y-unit-md">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-unit-xs">Cadence</p>
                <p className="font-body-md text-body-md text-primary font-semibold">Weekly / Bi-weekly</p>
              </div>
              <div className="border-t border-outline-variant pt-unit-md">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-unit-xs">Format</p>
                <p className="font-body-md text-body-md text-primary font-semibold">Expert-led analysis</p>
              </div>
              <div className="border-t border-outline-variant pt-unit-md">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-unit-xs">Audience</p>
                <ul className="font-body-md text-body-md text-primary space-y-2 mt-2">
                  {['Policymakers', 'Diplomats', 'Business leaders', 'Analysts'].map(aud => (
                    <li key={aud} className="flex items-center gap-unit-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span> {aud}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-unit-lg bg-primary text-on-primary rounded-xl">
            <h4 className="font-headline-md text-headline-md mb-unit-sm text-white">Briefing Notes</h4>
            <p className="font-body-md text-body-md text-on-primary/80 mb-unit-lg leading-relaxed">Get the executive summary of every Nigeria & Neighbours episode delivered directly to your inbox before it airs.</p>
            <div className="space-y-unit-sm">
              <input type="email" placeholder="Email address" className="w-full bg-white/10 border border-white/20 px-unit-md py-3 text-on-primary placeholder:text-on-primary/40 focus:outline-none focus:border-white/50 rounded-sm" />
              <button className="w-full bg-white text-primary font-label-md text-label-md py-3 hover:bg-surface-bright transition-colors rounded-sm uppercase tracking-wide">Join the Network</button>
            </div>
          </div>

          <div>
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-unit-md">Related Series</h3>
            <div className="space-y-unit-sm">
              <a href="#" className="block p-unit-md border border-outline-variant hover:border-primary transition-colors rounded-sm">
                <p className="font-label-sm text-label-sm text-surface-tint mb-1">Energy Outlook</p>
                <p className="font-body-md text-body-md text-primary font-bold">The Great African Gas Pipeline</p>
              </a>
              <a href="#" className="block p-unit-md border border-outline-variant hover:border-primary transition-colors rounded-sm">
                <p className="font-label-sm text-label-sm text-surface-tint mb-1">Policy Deep-Dive</p>
                <p className="font-body-md text-body-md text-primary font-bold">AfCFTA: Year Three Review</p>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
