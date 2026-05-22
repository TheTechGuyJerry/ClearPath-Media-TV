import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full flex-grow flex flex-col">
      <section className="relative w-full min-h-[80vh] flex items-center border-b border-outline-variant overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <iframe 
            src="https://www.youtube.com/embed/3H95x0BV9nA?autoplay=1&mute=1&controls=0&loop=1&playlist=3H95x0BV9nA&start=14&end=21&playsinline=1&rel=0&modestbranding=1&disablekb=1" 
            title="Background Video"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] opacity-90"
            frameBorder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>

        <div className="relative w-full px-margin-mobile md:px-margin-desktop py-unit-xl md:py-24 max-w-container-max mx-auto z-10">
          <div className="max-w-3xl flex flex-col gap-unit-md">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg text-white">
              Clear context for public life.
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mt-unit-sm">
              Clearpath Media is a public-intellectual platform explaining power, policy, elections, and society in Africa — calmly, clearly, and with evidence.
            </p>
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
            <div className="aspect-video bg-surface-container-high rounded-xl border border-outline-variant relative overflow-hidden group">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/3H95x0BV9nA?rel=0" 
                title="Today's Briefing" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-unit-md mt-unit-sm">
              <button className="w-full sm:w-auto bg-primary text-white font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-container transition-colors">
                Watch today's brief
              </button>
              <Link to="/briefing" className="w-full sm:w-auto border border-outline text-on-surface font-label-md text-label-md px-6 py-3 rounded hover:bg-surface-container transition-colors text-center">
                View all briefings
              </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md max-w-4xl">
          {[
            { title: 'Osita Insights', subtitle: 'Weekly Analysis', desc: 'A structured conversation with leaders and thinkers on judgment, responsibility, and national choices.', link: '/programmes/three-things' },
            { title: 'Daily Brief with Annabel', subtitle: 'Daily Overview', desc: 'A weekday briefing that helps professionals interpret events without chasing headlines.', link: '/briefing' }
          ].map(prog => (
            <div key={prog.title} className="bg-surface border border-outline-variant rounded p-unit-lg flex flex-col">
              <h3 className="font-headline-md text-headline-md text-primary mb-unit-xs">{prog.title}</h3>
              <span className="font-label-sm text-on-surface-variant mb-unit-sm block">{prog.subtitle}</span>
              <p className="font-body-md text-on-surface-variant flex-grow mb-unit-md">{prog.desc}</p>
              <Link to={prog.link} className="text-primary font-label-md border border-primary px-4 py-2 rounded self-start hover:bg-primary/5 transition-colors uppercase tracking-wider text-xs font-bold">View Library</Link>
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
            <Link to="/explainers" className="bg-primary text-white font-label-md px-6 py-3 rounded hover:bg-primary-container transition-colors mt-auto">Explore</Link>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-unit-xl flex flex-col items-center text-center">
            <h3 className="font-headline-md text-headline-md text-primary mb-unit-sm">Explaining Africa</h3>
            <p className="font-body-md text-on-surface-variant mb-unit-md text-balance">Broad structural analysis of continental trends, regional bodies, and geopolitical positioning.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-unit-lg">
              {['AfCFTA', 'AU', 'Security'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm">{tag}</span>
              ))}
            </div>
            <Link to="/explainers" className="bg-primary text-white font-label-md px-6 py-3 rounded hover:bg-primary-container transition-colors mt-auto">Explore</Link>
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
        <Link to="/partner" className="inline-block bg-primary text-white font-label-md text-label-md px-8 py-4 rounded hover:bg-primary-container transition-colors text-lg">
          Partner with Clearpath
        </Link>
      </section>
    </div>
  );
}
