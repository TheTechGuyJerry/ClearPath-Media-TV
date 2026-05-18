import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const programmesData = [
  {
    id: 'three-things',
    tag: 'Conversations',
    title: 'Three Things with Osita',
    desc: 'A structured conversation with leaders and thinkers on judgment, responsibility, and national choices.',
    about: 'Each episode, Osita Chidoka invites a prominent leader to discuss three specific events or decisions that defined their public service and the lessons they offer for future generations.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
    meta: { Cadence: 'Twice Monthly', Format: 'Video Conversation', Audience: 'Policy Makers, Executives' },
    link: '/programmes/three-things', linkText: 'Browse Episodes'
  },
  {
    id: 'daily-brief',
    tag: 'Briefings',
    title: 'Daily Brief with Annabel',
    desc: 'A weekday briefing that helps professionals interpret events without chasing headlines.',
    about: 'Annabel provides a high-level synthesis of economic data and policy shifts from across West Africa, delivered every morning for the busy professional.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj0sf1F6xFR6H3tbPIJPO_NYWyereW6LdnHUYz-S62krq0N-lI0KFfNNEMWcmcPVYBMQ487oKIJ5WTyDkMtu7VqlInld9PY0p_iGDAFpskRkHcarnEo0f98r8_Mp0IVtxc3Sk1YXbzQNmL1QtaWUWx7RCFWxaD1WLHSLnj7_XHTizqY8ztbb1R1WI8OXY9Hwdx0hkMrV9rLcSuXHEGAJcFN9xeAxubX7a-nYVdTEhDp99MUvwUxMnjs6BEXprW0Zoo980CBD029NM',
    meta: { Cadence: 'Weekdays', Format: 'Daily Briefing', Audience: 'Professionals, Investors' },
    link: '/briefing', linkText: "Watch Today's Brief"
  },
  {
    id: 'insights',
    tag: 'Explainers',
    title: 'Clearpath Insights',
    desc: 'Short explainers translating complex issues into clear, accessible understanding.',
    about: 'Designed for quick consumption, these visualizations break down legislative frameworks and market mechanics into their core elements.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeVLfCZOkjr_JQENUSHEqAjqhImldkoM6cBFtd6kJTkVvkqB1Wimrga4uO8bi_9o4q2GmcCqB1tZpqAGmQIDwPAH8F1lATsZJfeSCzrP22T0Mv2CtXzMkU1DGrd-n6wkR98R2pOU2-Bb8CoSuXOnxE-hNYap6qMwXPYvq3mXGh3sJTwEcq8rY7kMo7yUwcqwWZwNzxRmrh1F0qf5DlX7GX2ydgVgid5wF-DMmmYl5Ww1R3BtPERjhBA8yz74JaCGuiCimtXXaGFjk',
    meta: { Cadence: 'Ongoing', Format: '60–120s Explainers', Audience: 'General Public, Students' },
    link: '/explainers/insights', linkText: "Explore Explainers"
  },
  {
    id: 'regional',
    tag: 'Regional Analysis',
    title: 'Nigeria & Neighbours',
    desc: 'Expert-led analysis of West Africa’s political economy, security, and regional dynamics.',
    about: 'A deep dive into cross-border trade, ECOWAS policy, and the shared challenges of the Sahel and West African corridor.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCekczUBLCFB6lq5I2gvlelgOGUlV_PjHErwqwwMcbyquNLM3p2s3hLsEpXrbqkRoYQBYhcGd9W0Gv42Z-tw-fcs1D-3Pnkb-aqVlij1KZAXXZLK19n0OUxLDza_wwK1O0u4weRrbSyMJWpXqleBJJvnd2yQ9j8HM7If_hNItWtAsdE-Yb73QpBmhWz185CLsHeF-foKoFWQOBb9ZEdxcJWQz8BKTCZpVmMZgdYHIpuOaX59WMxlkYdcG-qxL6v9y0jaGF22k3Wbk',
    meta: { Cadence: 'Weekly / Bi-weekly', Format: 'Expert Analysis', Audience: 'Diplomats, Regional Trade' },
    link: '/programmes/regional', linkText: "View Regional Analysis"
  },
  {
    id: 'elections',
    tag: 'Elections',
    title: 'Election Matters',
    desc: 'Calm, evidence-led explanations of electoral systems, democratic norms, and reform debates.',
    about: 'Moving beyond horse-race politics to focus on the institutional integrity of the electoral process and democratic consolidation.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTFpfSZaJTgSWr90PENCkNKkxbwHIPO0OmFx4ixOb1ZH0QIicQXdmyljT6ATj5Ex_ezlkLUaPYaMxqBImwXQh8awDSGmFgs7Or3ImAj_9hKaHqXGMgcwzfSpVSnpMhbT8UFiGCemcd_9-G_yFeQrB2bWilSQkJ7IoDokDV6Nbw-PKrXpOAXlecaJIaKsZIISY2boe3c-l7DfVLnS3-ZlPZAPrM9UtISdm-dkUrZfUVV1Ske-MtAEwCww-vEz0ixhOcyDqOW12Ty7E',
    meta: { Cadence: 'Seasonal', Format: 'Deep-Dive Series', Audience: 'Civil Society, Voters' },
    link: '/programmes/election-matters', linkText: "Access Election Hub"
  },
  {
    id: 'mekaria',
    tag: 'Leadership',
    title: 'Mekaria Series',
    desc: 'Conversations exploring the intersection of culture, leadership, and public service.',
    about: 'In-depth interviews and discussions focused on the cultural frameworks that guide effective leadership in complex environments.',
    img: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1200&auto=format&fit=crop',
    meta: { Cadence: 'Monthly', Format: 'Video Conversation', Audience: 'General Public, Practitioners' },
    link: '/programmes/mekaria-series', linkText: "Browse Series"
  }
];

export default function Programmes() {
  return (
    <div className="w-full">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
        <section className="mb-unit-xl max-w-3xl">
          <h1 className="font-display-lg text-display-lg text-primary mb-unit-sm">Programmes</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Clearpath publishes a deliberately limited number of programmes. Each has a defined purpose, audience, and cadence.</p>
        </section>
      </div>
      
      <div className="sticky top-20 bg-background/95 backdrop-blur z-40 border-b border-outline-variant mb-unit-xl">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <ul className="flex space-x-unit-lg py-4 overflow-x-auto no-scrollbar">
            <li><button className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1 whitespace-nowrap">All Programmes</button></li>
            <li><button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors pb-1 whitespace-nowrap">Conversations</button></li>
            <li><button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors pb-1 whitespace-nowrap">Briefings</button></li>
            <li><button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors pb-1 whitespace-nowrap">Explainers</button></li>
            <li><button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors pb-1 whitespace-nowrap">Regional Analysis</button></li>
            <li><button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors pb-1 whitespace-nowrap">Elections</button></li>
            <li><button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors pb-1 whitespace-nowrap">Leadership</button></li>
          </ul>
        </div>
      </div>

      <div className="space-y-unit-xl pb-unit-xl">
        {programmesData.map(prog => (
          <section key={prog.id} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-b border-outline-variant pb-unit-xl">
            <div className="grid lg:grid-cols-12 gap-gutter mb-unit-lg">
              <div className="lg:col-span-8">
                <div className="mb-unit-md">
                  <span className="text-label-sm font-label-md uppercase tracking-wider text-primary mb-2 block">{prog.tag}</span>
                  <h2 className="font-display-lg text-headline-lg text-primary mb-unit-sm">{prog.title}</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-unit-md">{prog.desc}</p>
                </div>
                <div className="aspect-[16/9] bg-surface-container-highest flex items-center justify-center rounded-DEFAULT overflow-hidden relative group cursor-pointer border border-outline-variant mt-12">
                  <div className="absolute -top-10 left-0 text-label-sm font-label-md uppercase tracking-widest text-on-surface-variant">Latest Episode</div>
                  <img src={prog.img} alt={prog.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="w-10 h-10 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center">
                <div className="bg-surface-container-low p-unit-lg rounded-DEFAULT border border-outline-variant">
                  <h3 className="font-headline-md text-headline-md text-primary mb-4">About the Programme</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">{prog.about}</p>
                  <div className="space-y-4 border-t border-outline-variant pt-6">
                    {Object.entries(prog.meta).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="font-label-md text-on-surface-variant">{key}</span>
                        <span className="font-label-md text-primary font-semibold">{value as string}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={prog.link} className="mt-8 w-full bg-primary text-white font-label-md py-4 rounded-DEFAULT hover:bg-primary-fixed-variant transition-colors block text-center uppercase tracking-wide">
                    {prog.linkText}
                  </Link>
                  <button className="mt-4 w-full border border-primary text-primary font-label-md py-4 rounded-DEFAULT hover:bg-surface-container-high transition-colors uppercase tracking-wider">
                    View Library
                  </button>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
