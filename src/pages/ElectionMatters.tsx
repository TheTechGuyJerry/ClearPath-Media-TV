import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ElectionMatters() {
  return (
    <div className="w-full">
      <section className="bg-surface-container-low py-unit-xl border-b border-outline-variant">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="max-w-[800px]">
            <nav className="mb-unit-md flex items-center gap-unit-xs">
              <Link to="/programmes" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary">Programmes</Link>
              <span className="font-label-sm text-label-sm text-outline">/</span>
              <span className="font-label-sm text-label-sm text-primary">Election Matters</span>
            </nav>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-unit-md">Election Matters</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Calm, evidence-led explanations of electoral systems, democratic norms, and reform debates.
            </p>
          </div>
        </div>
      </section>

      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-unit-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8">
            <div className="mb-unit-xl">
              <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-unit-lg border-b border-outline-variant pb-unit-xs inline-block">About The Series</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[720px] mb-unit-lg">
                A democracy integrity series explaining electoral systems, processes, and reforms calmly and non-partisanly. We dive into the mechanics of governance to empower citizens with the knowledge required to navigate and improve democratic institutions across the continent.
              </p>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0" 
                  title="Election Matters Featured" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-unit-lg border-b border-outline-variant pb-unit-sm">
                <h2 className="font-headline-md text-headline-md text-primary">Episode Library</h2>
                <div className="flex gap-unit-sm mb-unit-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Filter by:</span>
                  <span className="font-label-sm text-label-sm text-primary underline cursor-pointer">All Episodes</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-lg">
                {[
                  { tag: 'Kenya', date: 'Oct 12, 2024', title: 'The Logistics of Modern Counting', category: 'Electoral Systems', desc: 'An in-depth look at the technological infrastructure behind tallying centers and the verification of physical vs digital ballots.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTFpfSZaJTgSWr90PENCkNKkxbwHIPO0OmFx4ixOb1ZH0QIicQXdmyljT6ATj5Ex_ezlkLUaPYaMxqBImwXQh8awDSGmFgs7Or3ImAj_9hKaHqXGMgcwzfSpVSnpMhbT8UFiGCemcd_9-G_yFeQrB2bWilSQkJ7IoDokDV6Nbw-PKrXpOAXlecaJIaKsZIISY2boe3c-l7DfVLnS3-ZlPZAPrM9UtISdm-dkUrZfUVV1Ske-MtAEwCww-vEz0ixhOcyDqOW12Ty7E' },
                  { tag: 'Regional', date: 'Sep 28, 2024', title: 'Proportional vs Majoritarian', category: 'Reform Debates', desc: 'Breaking down why different voting systems produce different social outcomes and how reform can shift political incentives.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR0DiKM7Nss31W-CsD15aV1UXiRhXloAxeGzHhsicAqT89md0KzPa3ApVuiUb1ElTsuwdlCU00NE5u-yQWqXqy3EXhfISvfMdJfeZFQaPjw8uE_WRlNk2UhzUwmAPDNUzJFwt0kBMWdLAb2w2cN1kVVre0L2jNKNNLh38serGx4ppQ_SMpJu2HSLE9lAkINmHu59lZwKrs5zfb8uoTXobXDywm04de48h4fLAIp9Ij_sPxJyCPU-G-Vu_2d7NG4tlqOE5eRuSAmuE' },
                  { tag: 'Continental', date: 'Sep 15, 2024', title: 'Independence of the Commissions', category: 'Democratic Norms', desc: 'Exploring the institutional design of electoral management bodies and the legal safeguards that protect their neutrality.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOiqWipQWTtC2Tp_h-_ALqV1jXMRXb1D7Qx6zf9LIv04OTSMqJHGuRFFropzUBHzVHT0cVr0C_wnHz5pnuIhPBoXOM3pFLckaxu9gIR6TrXPxrpTLgRDToDWd8U2uTiZkVUrruQXaFlXF_TRQtWjKVChZ4nu0uHrtMQ3G-8LdG5JbSxELoWmIATse8oe1tuUjvkQtHrQqHgNrIQ_vP6hsem36iBqWy-FH4fMGWLMwF2pCeje77tY5JhzNlieJGryNsP8LyA_a3Wd4' },
                  { tag: 'Nigeria', date: 'Aug 30, 2024', title: 'Boundary Delimitation & Fairness', category: 'Electoral Systems', desc: 'How constituency borders are drawn and why it remains one of the most contested aspects of electoral law.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi0KhF72TMrA7_gBdBocXaEiUXw3Nj1vTPWt9YOvVX49tkJDrsXrUzPhcRI6saPWP27l06Qg1GjHQmU4ItFswGv48bPyOcK6ia2oI4DIUFRBm-ix7Ryp_yUpaWyBQcksbOM3RRlVXEXUsLHGjdBlFSGOyvxCsBRC_370uYOcWs3OwcyUhbpyNAbYsWMrCHByYA7r61jjicguaqsgDTMhGiTDJWC8TjdCY6zXFfOGq6HJzzaTHG4J-3eKjP4TWmVwHwPv5cUJgi1Os' }
                ].map((item, idx) => (
                  <div key={idx} className="group flex flex-col bg-surface border border-outline-variant overflow-hidden hover:shadow-sm transition-all duration-300">
                    <div className="aspect-video bg-surface-container relative overflow-hidden">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute bottom-unit-md right-unit-md bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="p-unit-lg flex flex-col flex-grow">
                      <div className="flex items-center gap-unit-sm mb-unit-xs">
                        <span className="px-unit-sm py-[2px] bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase rounded-[2px]">{item.tag}</span>
                        <span className="text-outline text-[12px]">•</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{item.date}</span>
                      </div>
                      <h3 className="font-headline-md text-[22px] leading-tight text-primary mb-unit-sm group-hover:text-primary-container transition-colors">{item.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-unit-lg flex-grow">{item.desc}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-tighter">{item.category}</span>
                        <button className="font-label-md text-label-md text-primary flex items-center gap-1 group/btn hover:underline">
                          Watch <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-unit-xl text-center">
                <button className="px-unit-lg py-unit-sm border border-outline text-on-surface-variant font-label-md hover:bg-surface-container-low transition-colors">Load More Episodes</button>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:pl-unit-lg lg:border-l border-outline-variant">
            <div className="sticky top-24 space-y-unit-xl">
              <div className="space-y-unit-lg">
                <h2 className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-outline-variant pb-unit-xs">Series Details</h2>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Cadence</span>
                  <p className="font-body-md text-body-md text-primary font-semibold">Seasonal</p>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Format</span>
                  <p className="font-body-md text-body-md text-primary font-semibold">Explainers and structured discussions</p>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Audience</span>
                  <p className="font-body-md text-body-md text-primary font-semibold">Civil society, journalists, serious citizens</p>
                </div>
              </div>

              <div className="space-y-unit-lg pt-unit-xl border-t border-outline-variant">
                <h2 className="font-label-md text-label-md text-primary uppercase tracking-widest border-b border-outline-variant pb-unit-xs">Key Contributors</h2>
                <div className="flex items-center gap-unit-md">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoRGCcctC9eAE6Lb_whu38gcpn9VJnw34ir1-ynPQJWvFk-d0bdxuPxjlNTE19C1hbfKIDcqYVYzCBbk7-EaiJLGA2yD5TFusUV9bKX084LS-x9C3zZWUvGEEKh74EXIFAgdUd8Id7RQiK2VABtWNNpRZNQ-vBple0VWnbfSoDNqUORpzh2Pw6XCMA80wlJeIsDFAbsUZv34ddg6kZn8EEjJfhyLmmvU8m1AoOqSnx8VDVhtwrOJ5JZrZJY9atRoCFbJMCdFuielA" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-primary">Dr. Marcus Adebayo</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Lead Policy Analyst</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary p-unit-lg rounded-xl text-white">
                <h3 className="font-headline-md text-[20px] mb-unit-sm">Support Our Research</h3>
                <p className="font-body-md text-body-md opacity-90 mb-unit-lg">
                  Election Matters is funded by audience contributions and independent grants. Help us keep it non-partisan.
                </p>
                <Link to="/partner" className="block text-center w-full py-unit-sm bg-white text-primary font-label-md text-label-md hover:bg-surface-bright transition-colors rounded-sm">
                  Partner With Us
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
