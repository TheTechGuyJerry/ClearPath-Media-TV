import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full flex-grow flex flex-col">
      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl md:py-24 max-w-container-max mx-auto border-b border-outline-variant">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-5 flex flex-col gap-unit-md">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg text-primary max-w-xl">
              Clear context for public life.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mt-unit-sm">
              Clearpath Media is a public-intellectual platform explaining power, policy, elections, and society in Africa — calmly, clearly, and with evidence.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2">
              We produce briefings, explainers, and long-form conversations for people who want understanding, not noise.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-unit-md mt-unit-lg">
              <button className="w-full sm:w-auto bg-primary text-white font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-fixed-variant transition-colors">
                Watch the latest
              </button>
              <button className="w-full sm:w-auto border border-outline text-on-surface font-label-md text-label-md px-6 py-3 rounded hover:bg-surface-container transition-colors">
                Get the Daily Brief
              </button>
            </div>
          </div>
          <div className="lg:col-span-7 mt-unit-xl lg:mt-0">
            <div className="aspect-[16/9] bg-surface-container-high rounded-xl border border-outline-variant relative overflow-hidden group cursor-pointer">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjOjy5opH1OpGXsYnUzXqH-fQCC5f1fD1FOuZmQqVFTnQwJ3KDhj4pVMjqLKTE3L8089S-tjHPeZEUnfEVp5UeNybcdzqdD9RG3DmstL7KK6yy6yErEQ4emPDXpp46cswfWApsDrNvaxrvGa9nlVm413lLgPKA1vs3clXBOzdN9dnYQPlQ6rQ7N5plTKyH33Jd2zolBDxyJx327umDiSZFhlS8Bysvv1R5AV2ESBCrhCaigPR3xNW3C4YlG-2lwG1uzPxJ7bWtzH0"
                alt="Studio" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
            </div>
            <div className="mt-unit-sm flex justify-between items-start">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Featured Media</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Today's Briefing</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            A calm, structured explanation of what matters today — and why.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
          <div className="flex flex-col gap-unit-md">
            <div className="aspect-[16/9] bg-surface-container-high rounded-xl border border-outline-variant relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center bg-surface-variant text-on-surface-variant font-label-md">
                [YouTube Video Embed Placeholder]
              </div>
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-unit-md mt-unit-sm">
              <button className="w-full sm:w-auto bg-primary text-white font-label-md text-label-md px-6 py-3 rounded hover:bg-on-primary-fixed-variant transition-colors">
                Watch today's brief
              </button>
              <button className="w-full sm:w-auto border border-outline text-on-surface font-label-md text-label-md px-6 py-3 rounded hover:bg-surface-container transition-colors">
                View all briefings
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-unit-md">
            {[
              { title: 'What happened', text: 'The core events and facts established, stripped of sensationalism.' },
              { title: 'Why it matters', text: 'The context, structural implications, and underlying dynamics driving the story.' },
              { title: 'What to watch', text: 'Key indicators and future developments to monitor as the situation evolves.' }
            ].map(item => (
              <div key={item.title} className="bg-surface border border-outline-variant rounded p-unit-lg hover:bg-surface-container-low transition-colors duration-300">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-sm">{item.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg flex flex-col md:flex-row md:items-end justify-between gap-unit-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Latest from Clearpath</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              A curated selection of our most recent work across briefings, explainers, and programmes.
            </p>
          </div>
          <Link to="/programmes" className="font-label-md text-label-md text-surface-tint hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-md">
          {[
            { tag: 'Briefing', title: 'Understanding the week in Nigerian politics', desc: 'A breakdown of legislative maneuvers and executive actions shaping the political landscape this week.', date: 'Today', action: 'Watch' },
            { tag: 'Explainer', title: 'What election reform really means', desc: 'Examining the structural proposals and their potential impact on electoral integrity and representation.', date: 'Yesterday', action: 'Read' },
            { tag: 'Analysis', title: 'Nigeria’s regional security outlook', desc: 'Assessing border policies, transnational challenges, and the shifting dynamics of West African security.', date: 'Oct 12', action: 'Read' },
            { tag: 'Conversation', title: 'How power works across African institutions', desc: 'A long-form dialogue on institutional capacity, historical legacies, and modern governance.', date: 'Oct 10', action: 'Watch' }
          ].map(item => (
            <div key={item.title} className="bg-surface border border-outline-variant rounded overflow-hidden flex flex-col hover:bg-surface-container-low transition-colors duration-300 group">
              <div className="aspect-[16/9] bg-surface-container-high relative"></div>
              <div className="p-unit-md flex flex-col flex-grow">
                <span className="font-label-sm text-label-sm text-surface-tint uppercase tracking-wider mb-unit-xs block">{item.tag}</span>
                <h3 className="font-body-lg text-body-lg font-semibold text-on-surface mb-unit-sm group-hover:text-surface-tint transition-colors line-clamp-2">{item.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow line-clamp-3 mb-unit-md">
                  {item.desc}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-tertiary-container">{item.date}</span>
                  <button className="text-primary font-label-sm hover:underline">{item.action}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant bg-surface-container-low">
        <div className="mb-unit-lg">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Our Programmes</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Clearpath publishes a limited set of programmes, each designed to serve a specific institutional purpose.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-unit-md">
          {[
            { title: 'Three Things with Osita', subtitle: 'Weekly Analysis', desc: 'Deep dives into three critical issues shaping the week, offering clarity and context.' },
            { title: 'Daily Brief with Annabel', subtitle: 'Daily Overview', desc: 'A concise, structured explanation of what matters today and why it matters.' },
            { title: 'Clearpath Insights', subtitle: 'Periodic Research', desc: 'Comprehensive research papers and data-driven analysis on key policy areas.' },
            { title: 'Nigeria & Neighbours', subtitle: 'Monthly Feature', desc: 'Exploring regional dynamics, economic ties, and diplomatic relations in West Africa.' },
            { title: 'Election Matters', subtitle: 'Seasonal Series', desc: 'Evidence-led coverage and contextual analysis of electoral processes and outcomes.' },
            { title: 'Mekaria Series', subtitle: 'Long-form Conversation', desc: 'In-depth discussions with thinkers, policymakers, and leaders shaping society.' }
          ].map(prog => (
            <div key={prog.title} className="bg-surface border border-outline-variant rounded p-unit-lg flex flex-col">
              <h3 className="font-headline-md text-headline-md text-primary mb-unit-xs">{prog.title}</h3>
              <span className="font-label-sm text-on-surface-variant mb-unit-sm block">{prog.subtitle}</span>
              <p className="font-body-md text-on-surface-variant flex-grow mb-unit-md">{prog.desc}</p>
              <button className="text-primary font-label-md border border-primary px-4 py-2 rounded self-start hover:bg-primary/5 transition-colors">View Library</button>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg flex flex-col md:flex-row justify-between items-end gap-unit-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Explainers</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Clearpath builds long-term explanatory assets designed to be revisited, cited, and trusted.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
          <div className="bg-surface border border-outline-variant rounded p-unit-xl flex flex-col items-center text-center">
            <h3 className="font-headline-md text-headline-md text-primary mb-unit-sm">Explaining Nigeria</h3>
            <p className="font-body-md text-on-surface-variant mb-unit-md text-balance">Foundational context on the systems, institutions, and dynamics that drive the nation.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-unit-lg">
              {['Constitution', 'Economy', 'Federalism'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm">{tag}</span>
              ))}
            </div>
            <Link to="/explainers" className="bg-primary text-white font-label-md px-6 py-3 rounded hover:bg-primary-fixed-variant transition-colors mt-auto">Explore</Link>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-unit-xl flex flex-col items-center text-center">
            <h3 className="font-headline-md text-headline-md text-primary mb-unit-sm">Explaining Africa</h3>
            <p className="font-body-md text-on-surface-variant mb-unit-md text-balance">Broad structural analysis of continental trends, regional bodies, and geopolitical positioning.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-unit-lg">
              {['AfCFTA', 'AU', 'Security'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm">{tag}</span>
              ))}
            </div>
            <Link to="/explainers" className="bg-primary text-white font-label-md px-6 py-3 rounded hover:bg-primary-fixed-variant transition-colors mt-auto">Explore</Link>
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg text-center max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-md">Why Clearpath</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-unit-sm">
            Clearpath exists because serious ideas often fail to reach wider publics — not because they are weak, but because they are poorly explained.
          </p>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            We sit between journalism and academia, where public understanding is formed.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-md">
          {['Evidence-led, not partisan', 'Calm, not performative', 'Selective, not exhaustive', 'Built for longevity, not virality'].map(text => (
            <div key={text} className="bg-surface-container-low p-unit-lg rounded border border-outline-variant/50 text-center flex items-center justify-center">
              <h4 className="font-headline-md text-lg font-bold text-on-surface">{text}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-md">Partner with Clearpath</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-unit-lg">
          Clearpath works with institutions that value trust, clarity, and public understanding.
        </p>
        <Link to="/partner" className="inline-block bg-primary text-white font-label-md text-label-md px-8 py-4 rounded hover:bg-primary-fixed-variant transition-colors text-lg">
          Partner with Clearpath
        </Link>
      </section>
    </div>
  );
}
