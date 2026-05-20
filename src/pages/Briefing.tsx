import { Play, ArrowRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Briefing() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
      <header className="mb-unit-xl border-b border-outline-variant pb-unit-lg">
        <h1 className="font-display-lg text-display-lg text-primary mb-unit-sm">Daily Brief with Annabel</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[720px]">A weekday briefing that helps professionals interpret events without chasing headlines.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-unit-xl">
          <section className="bg-surface-container-low p-unit-lg rounded-lg border border-outline-variant shadow-sm">
            <div className="flex items-center gap-unit-sm mb-unit-md">
              <span className="bg-primary text-white font-label-sm text-label-sm px-unit-sm py-unit-xs rounded-sm tracking-wide">LATEST BRIEFING</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm uppercase">October 24, 2024</span>
            </div>
            
            <div className="relative aspect-video w-full mb-unit-lg overflow-hidden rounded-lg group">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/3H95x0BV9nA?rel=0" 
                title="Daily Brief with Annabel" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-lg">
              <div>
                <h3 className="font-label-md text-label-md text-primary uppercase mb-unit-xs">What happened</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">The central bank announced a 50bps rate hike following higher-than-expected inflation data in the logistics sector.</p>
              </div>
              <div>
                <h3 className="font-label-md text-label-md text-primary uppercase mb-unit-xs">Why it matters</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">This marks a hawkish shift that could dampen private sector credit growth during the critical Q4 trade window.</p>
              </div>
              <div>
                <h3 className="font-label-md text-label-md text-primary uppercase mb-unit-xs">What to watch next</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Secondary bond market yields and the upcoming manufacturing PMI reports for cross-sector contagion.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-unit-lg gap-unit-md">
              <h2 className="font-headline-md text-headline-md text-primary">Briefing Archive</h2>
              <div className="flex flex-col sm:flex-row items-center gap-unit-sm w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                  <input type="text" placeholder="Search briefings..." className="w-full sm:w-64 px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded-sm text-body-md bg-transparent" />
                </div>
                <div className="flex gap-unit-sm w-full sm:w-auto">
                  <select className="flex-1 sm:flex-none px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded-sm text-body-md bg-transparent focus:outline-none">
                    <option value="">All Topics</option>
                    <option value="policy">Policy</option>
                    <option value="economy">Economy</option>
                    <option value="tech">Tech</option>
                    <option value="trade">Trade</option>
                  </select>
                  <input type="date" className="flex-1 sm:flex-none px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded-sm text-body-md bg-transparent focus:outline-none text-on-surface-variant" />
                </div>
              </div>
            </div>
            
            <div className="space-y-unit-md">
              {[
                { date: 'Oct 23, 2024', title: 'Resource Diplomacy in the Sahel', desc: 'Analyzing the new lithium mining agreements and their impact on regional security partnerships.', tags: ['POLICY', 'MINING'] },
                { date: 'Oct 22, 2024', title: 'Digital Infrastructure Expansion', desc: 'Submarine cable investments and the competitive landscape for pan-African cloud providers.', tags: ['TECH', 'ECONOMY'] },
                { date: 'Oct 21, 2024', title: 'The Port Congestion Crisis', desc: 'Supply chain bottlenecks at regional hubs and the implications for seasonal inflation.', tags: ['TRADE', 'LOGISTICS'] },
              ].map(item => (
                <div key={item.title} className="flex flex-col md:flex-row gap-unit-md p-unit-md border border-outline-variant hover:bg-surface-container-high transition-all cursor-pointer group">
                  <div className="md:w-32 flex-shrink-0">
                    <span className="font-label-md text-label-md text-on-surface-variant">{item.date}</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-headline-md text-headline-md !text-lg text-on-surface group-hover:text-primary transition-colors mb-unit-xs">{item.title}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-unit-sm">{item.desc}</p>
                    <div className="flex gap-unit-xs mb-unit-md">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-surface-container-highest px-unit-sm py-unit-xs text-[10px] font-bold uppercase rounded-sm tracking-widest text-on-surface-variant">{tag}</span>
                      ))}
                    </div>
                    <button className="flex items-center gap-unit-xs font-label-md text-label-md text-primary uppercase hover:underline">
                      Watch Episode <Play className="w-3 h-3 ml-1 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-unit-lg">
          <div className="bg-white border border-outline-variant p-unit-lg rounded-lg">
            <h2 className="font-label-md text-label-md text-primary uppercase mb-unit-lg border-b border-outline-variant pb-unit-xs">Program Details</h2>
            <div className="space-y-unit-md">
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Cadence</span>
                <span className="font-body-md text-body-md font-semibold text-primary">Weekdays</span>
              </div>
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Format</span>
                <span className="font-body-md text-body-md font-semibold text-primary">5–7 minute briefing</span>
              </div>
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Target Audience</span>
                <ul className="list-disc list-inside font-body-md text-body-md text-on-surface-variant space-y-1">
                  <li>Professionals</li>
                  <li>Executives</li>
                  <li>Policy practitioners</li>
                </ul>
              </div>
            </div>
            <button className="w-full mt-unit-xl bg-primary text-white py-unit-md font-label-md text-label-md rounded-sm hover:bg-primary-container transition-all flex items-center justify-center gap-unit-sm">
              <Bell className="w-4 h-4" /> SET REMINDER
            </button>
          </div>

          <div className="p-unit-lg border border-outline-variant bg-surface-container-low rounded-lg">
            <div className="flex items-center gap-unit-md mb-unit-md">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-outline-variant">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvWqyfhT7JZ9U45Vk0xO3FMc92FU3k_fkcwsXKloBp2OLo_UEwflG6OQEXBjqAkdkQpbEOBamF4zJl_iMXdACZ8wO6PsSEGzSh3rTzLZojcx23xur-qSsfeiFwfYUNVOOBcK6Ni8IzSSn5r-rU5q6MPmEsKUYJm6uMS-86ETnpaDMLT7Lay6s_BuHPExGrsudQhUA63QtykEVYwXVn2Lw_lwU06qa7BvsDt0PAQXIa7i-xG-JCEIv1TH3CDVPx9AYBEvtiQ-lFjEM" alt="Host" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md !text-lg">Annabel K.</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Policy Lead & Host</p>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant italic">
              "My goal is to distill the complexity of policy into actionable intelligence for those leading the continent's key sectors."
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-unit-xl bg-primary text-white p-unit-xl rounded-lg text-center relative overflow-hidden">
        <div className="relative z-10 max-w-[600px] mx-auto">
          <h2 className="font-headline-lg text-headline-lg mb-unit-md">Subscribe to the Daily Brief</h2>
          <p className="font-body-md text-body-md text-white/80 mb-unit-lg">Receive the daily executive summary and watch links directly in your inbox at 7:00 AM WAT every weekday morning.</p>
          <form className="flex flex-col sm:flex-row gap-unit-sm items-stretch">
            <input type="email" placeholder="Email address" className="flex-grow bg-white/10 border border-white/20 text-white placeholder-white/50 px-6 py-3 rounded-sm focus:outline-none focus:border-white/60 focus:ring-0" />
            <button type="submit" className="bg-white text-primary px-8 py-3 font-label-md text-label-md rounded-sm hover:bg-surface-bright transition-all shrink-0">JOIN 12,000+ PROS</button>
          </form>
          <p className="mt-unit-md text-[10px] uppercase tracking-widest opacity-60">NO SPAM. JUST THE BRIEFING. UNSUBSCRIBE ANYTIME.</p>
        </div>
      </section>
    </div>
  );
}
