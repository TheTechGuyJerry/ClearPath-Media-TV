import { Play, ArrowRight } from 'lucide-react';

export default function Insights() {
  return (
    <div className="w-full">
      <section className="px-margin-desktop max-w-container-max mx-auto py-unit-xl border-b border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-end">
          <div className="md:col-span-8">
            <span className="font-label-md text-label-md uppercase tracking-widest text-primary/60 mb-unit-sm block">Series Archive</span>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-unit-md">Clearpath Insights</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[720px] text-balance">
              Short explainers translating complex issues into clear, accessible understanding. Each episode focuses on one idea, decision, or system — explaining what matters and why, without jargon or polemics.
            </p>
          </div>
          <div className="md:col-span-4 flex md:justify-end pb-unit-xs">
            <button className="bg-primary text-white px-unit-lg py-unit-md font-label-md text-label-md flex items-center gap-unit-xs hover:bg-primary-container transition-colors rounded-sm uppercase">
              SUBSCRIBE TO SERIES
            </button>
          </div>
        </div>
      </section>

      <section className="sticky top-20 bg-background/95 backdrop-blur-sm z-40 border-b border-outline-variant">
        <div className="px-margin-desktop max-w-container-max mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-unit-md overflow-x-auto no-scrollbar">
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Filter by Topic:</span>
            <button className="bg-primary text-white px-unit-md py-unit-xs rounded-lg font-label-sm text-label-sm">All Explainers</button>
            {['Economy', 'Policy', 'Governance', 'Infrastructure'].map(cat => (
              <button key={cat} className="bg-surface-container-low text-on-surface-variant px-unit-md py-unit-xs rounded-lg font-label-sm text-label-sm hover:bg-surface-container-high transition-colors">{cat}</button>
            ))}
          </div>
          <div className="flex items-center gap-unit-md">
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden md:inline">Sort:</span>
            <select className="bg-transparent border-none font-label-sm text-label-sm text-primary focus:ring-0 cursor-pointer">
              <option>Latest</option>
              <option>Most Popular</option>
              <option>Longest</option>
            </select>
          </div>
        </div>
      </section>

      <section className="px-margin-desktop max-w-container-max mx-auto py-unit-xl">
        <div className="mb-unit-xl">
          <h2 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-unit-md border-b border-outline-variant pb-unit-xs">Featured Insight</h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0" 
              title="Clearpath Insights Featured" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-unit-lg border-b border-outline-variant pb-unit-sm">
          <h2 className="font-headline-md text-headline-md text-primary">All Explainers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-gutter gap-y-unit-xl">
          {[
            { tag: 'Economy', title: 'The Debt Ceiling Paradox', desc: 'Understanding why the legal limit on national borrowing remains a central point of political friction every fiscal year.', host: 'Amara Okafor', time: '1:45', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeVLfCZOkjr_JQENUSHEqAjqhImldkoM6cBFtd6kJTkVvkqB1Wimrga4uO8bi_9o4q2GmcCqB1tZpqAGmQIDwPAH8F1lATsZJfeSCzrP22T0Mv2CtXzMkU1DGrd-n6wkR98R2pOU2-Bb8CoSuXOnxE-hNYap6qMwXPYvq3mXGh3sJTwEcq8rY7kMo7yUwcqwWZwNzxRmrh1F0qf5DlX7GX2ydgVgid5wF-DMmmYl5Ww1R3BtPERjhBA8yz74JaCGuiCimtXXaGFjk' },
            { tag: 'Policy', title: 'Zoning Laws Explained', desc: 'How local land-use regulations dictate the future of affordable housing and urban development across the continent.', host: 'David Mwangi', time: '2:10', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqw9PDGaxgcqRtLgQXXwMAI1Zxoa2300oGit7JhPLB1RfKg66-9P3qGOJwivq-alSZB37qP6GBhHAYpg4uHOqhay8uG2cQYX63HU1NTFetafQVamJKUUZ0LywHIyLTHoQ9uNRfMyzj0myX0ts3KyZ489LCSrZleYCQ8dUqgrkhiRuPSrUsqvRUE4AbvOFZRyOI7Wegk41ZfajsXzwNQJi3BnRO1Uz4pto1h2It5-PWUZJZbdqtu-0vkl27IuAZNYo4rDawwgrE1cE' },
            { tag: 'Governance', title: 'Decentralized Power', desc: 'A 90-second primer on the transition from centralized authority to distributed local government councils.', host: 'Sarah Belo', time: '1:20', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFneMCV56wGqBey80VFsfe7QPOFpicL8RcHRHXzH2kWgXzRe5gatiUkAKmgNsqSefehGPpDzh40X3frb3N4KCi2QQsu45-KYZzG2oMFKKI4uvtUoY4IsgZg-9N7Rc-x95M48GFpo8C3sA9SSnFMAVjKBwNB77RHqUs4dMK9sO8Uzfxn9hNBUR-DKKboc_7_OlOg4qPYfcoQuEuHYX1RsSBOKxmcaMZykBycLRszHCTKVs9VopDNRxBe-jKplVFCF9CM_biQ-I-FfA' },
            { tag: 'Infrastructure', title: 'The Grid Modernization', desc: 'How aging energy grids are being retrofitted to handle a new era of renewable and decentralized power production.', host: 'Marcus Lin', time: '1:55', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxglOIhFUtzHKO2nqCjQS_9llnuxRsv6TJdrA0hkOAjHESCvozSJvfsqwBk2HkPWgP0UbAsmD3vDLOo9GhmDsBBXGcLx8aFBAFWcw0gez2DNFOSYuOuheglqQGgF6zWHdMM4oOnCgmY3yntrliSVa5d1OpUDWtAIg3pPODkz5riS9t-Jf_nmV9JxrPHuHQRXqj_V9umQNOgNkQulP7e00kkCs_k9-FbKc0pYBDzzwGc_vWJ6iJ0IxLH0BcWkHKPoURGD5SsxSACj0' },
            { tag: 'Policy', title: 'Trade Pact Nuances', desc: 'Deconstructing the newest regional trade agreements and what they actually mean for small-scale manufacturers.', host: 'Amara Okafor', time: '2:30', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5qkOKUYJSyUebT8c0txdbv1KJ-5cDR_S2TJ8_vBHVyys25_bITe6SCtPXkcnEbn5RrLqtT5-jzAaaQWUT6cG-hPWnWMGhtXjiiIBUS6mloWdJxpvyt12MoN6TqHsIJ9iF_FtFANa5kIrhsARcHVGloCURH4oxQTx3Y28k2lXet3MNIzvZrZ7Y3-RV_Vq1608Tp9ugo25EvLtLauRESkTQ6b5-21ctvdm7ycPkx7-gSgSyUS03w9gJK47UC8NBuRTUcVboEBLe4Jo' },
            { tag: 'Economy', title: 'The GDP Myth', desc: 'Why gross domestic product might be an incomplete metric for measuring national well-being in the 21st century.', host: 'David Mwangi', time: '1:15', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB61uBVy-gTFbdSiOjPw1FP3-QWYlBiRLKBrMyIRjQFKZnQf7OU79C_eCXjiqIrtqf9WsVBax8bnqc-MYZnFR28uzRSB0dhmbUZlzjTh6S5WDL_jRVzdSt-u6kTASCCTQYetvV24Irlg7R_iU19RZCOM_m-oi4Vxexb1B0qxgk9tIIJXZl2MLBqtFTvbm6yGh0rxIh0TqnrF7GdG5cUfuWJReI2_9uOT8k9NHTSfeEUu185U-xtzAW88VVYBnde4FzdEP_cDQoN2UA' }
          ].map((item, idx) => (
            <article key={idx} className="group">
              <div className="relative aspect-[16/9] bg-surface-container-high overflow-hidden rounded-lg mb-unit-md border border-outline-variant">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-unit-sm right-unit-sm bg-black/80 text-white font-label-sm text-label-sm px-unit-xs py-[2px] rounded">{item.time}</div>
              </div>
              <div className="flex flex-col gap-unit-xs">
                <div className="flex items-center gap-unit-sm mb-unit-xs">
                  <span className="bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm px-unit-sm py-[2px] rounded-lg">{item.tag}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary leading-tight group-hover:text-primary-container transition-colors">{item.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{item.desc}</p>
                <div className="mt-unit-sm flex items-center justify-between">
                  <div className="flex items-center gap-unit-sm">
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest"></div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Host: {item.host}</span>
                  </div>
                  <button className="text-primary font-label-md text-label-md flex items-center gap-unit-xs hover:underline uppercase">
                    Watch <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-unit-xl flex justify-center">
          <button className="border border-outline text-primary px-unit-xl py-unit-md font-label-md text-label-md hover:bg-surface-container-low transition-colors duration-150 uppercase tracking-widest rounded-sm">
            Load More Explainers
          </button>
        </div>
      </section>

      <section className="bg-surface-container-low py-unit-xl border-t border-outline-variant">
        <div className="px-margin-desktop max-w-container-max mx-auto text-center">
          <h2 className="font-headline-md text-headline-md text-primary mb-unit-sm">Never miss an insight.</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-unit-lg max-w-[500px] mx-auto">Get our weekly explainer briefing directly in your inbox every Monday morning.</p>
          <form className="flex flex-col md:flex-row gap-unit-sm max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-grow px-unit-md py-3 border border-outline-variant bg-background focus:outline-none focus:border-b-2 focus:border-primary transition-all rounded-sm" />
            <button className="bg-primary text-white px-unit-lg py-3 font-label-md text-label-md uppercase tracking-wide rounded-sm hover:bg-primary-container transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
