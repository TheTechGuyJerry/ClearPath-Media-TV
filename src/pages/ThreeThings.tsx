import { Play, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ThreeThings() {
  return (
    <div className="w-full">
      <header className="mb-unit-xl border-b border-outline-variant pb-unit-lg px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto pt-unit-xl">
        <div className="max-w-[800px]">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-unit-sm block">Program Series</span>
          <h1 className="font-display-lg text-display-lg text-primary mb-unit-sm">Three Things with Osita</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[720px]">
            A structured conversation with leaders and thinkers on judgment, responsibility, and national choices.
          </p>
        </div>
      </header>

      <section className="mb-unit-xl grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
        <div className="lg:col-span-8">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-outline-variant shadow-sm group">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0" alt="Studio" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-150">
                <Play className="w-10 h-10 fill-current ml-1" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-unit-lg bg-gradient-to-t from-primary/80 to-transparent">
              <span className="font-label-sm text-label-sm text-white bg-white/20 px-unit-sm py-unit-xs rounded backdrop-blur-md mb-2 inline-block">Latest Episode</span>
              <h2 className="font-headline-md text-headline-md text-white">The Price of Leadership: A Conversation with Dr. Amina J. Mohammed</h2>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-unit-lg">
          <div className="p-unit-lg bg-surface-container-low border border-outline-variant rounded">
            <h3 className="font-headline-md text-[20px] text-primary mb-unit-sm">About the Program</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-unit-md leading-relaxed">
              Three Things with Osita is built on the premise that clarity comes from focus. In each session, we strip away the noise of the news cycle to focus on the underlying architecture of leadership. We explore the consequences of choice and the weight of public responsibility in an era of rapid change.
            </p>
            <div className="space-y-unit-sm pt-unit-md border-t border-outline-variant">
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant">Cadence</span>
                <span className="font-label-md text-label-md text-primary">Twice monthly</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant">Format</span>
                <span className="font-label-md text-label-md text-primary">Long-form conversation</span>
              </div>
              <div className="flex flex-col pt-unit-xs">
                <span className="font-label-md text-label-md text-on-surface-variant mb-1">Target Audience</span>
                <div className="flex flex-wrap gap-unit-xs">
                  {['POLICYMAKERS', 'BUSINESS LEADERS', 'DIASPORA'].map(tag => (
                    <span key={tag} className="bg-surface-container-highest px-unit-sm py-1 text-[11px] font-semibold rounded-sm text-on-surface">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-unit-xl px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto pb-unit-xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-unit-lg gap-unit-md">
          <h3 className="font-headline-lg text-headline-md text-primary border-l-4 border-primary pl-unit-sm">Episode Library</h3>
          <div className="flex items-center gap-unit-sm w-full md:w-auto">
            <div className="relative flex-grow">
              <input type="text" placeholder="Search guests or topics..." className="w-full md:w-64 px-4 py-2 border border-outline focus:border-primary focus:ring-0 rounded-sm text-body-md bg-transparent" />
            </div>
            <button className="flex items-center gap-unit-xs px-unit-md py-2 border border-outline text-label-md rounded-sm hover:bg-surface-container-low transition-all">
              <Filter className="w-5 h-5" /> Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {[
            { date: 'Oct 24, 2023', topic: 'POLICY', title: 'The Future of Central Banking', guest: 'with Sanusi Lamido Sanusi', desc: 'An in-depth analysis of institutional independence, fiscal responsibility, and the hard choices facing African monetary policy in a globalized world.' },
            { date: 'Oct 10, 2023', topic: 'TECH', title: 'Innovation and Regulation', guest: 'with Bosun Tijani', desc: 'Discussing the tension between fostering a digital economy and the state\'s role in consumer protection and data sovereignty.' },
            { date: 'Sep 26, 2023', topic: 'CULTURE', title: 'Narratives of Identity', guest: 'with Chimamanda Ngozi Adichie', desc: 'A reflective session on how literature shapes national consciousness and the responsibility of the writer in a fractured political landscape.' },
            { date: 'Sep 12, 2023', topic: 'TRADE', title: 'AfCFTA and Economic Gravity', guest: 'with Wamkele Mene', desc: 'Exploring the logistics of continental integration and the political will required to turn borders into bridges for African prosperity.' },
            { date: 'Aug 29, 2023', topic: 'CLIMATE', title: 'The Green Transition', guest: 'with Bogolo Kenewendo', desc: 'Why the global climate agenda must account for Africa\'s development needs and the imperative of justice in environmental policy.' },
            { date: 'Aug 15, 2023', topic: 'LEGAL', title: 'The Constitution as a Living Document', guest: 'with Justice Albie Sachs', desc: 'A masterclass in law, humanity, and the difficult art of building a society based on dignity and the rule of law.' }
          ].map((item, idx) => (
            <article key={idx} className="group bg-surface-bright border border-outline-variant p-unit-lg flex flex-col hover:border-primary transition-colors duration-300">
              <div className="flex justify-between items-start mb-unit-sm">
                <span className="font-label-sm text-label-sm text-outline">{item.date}</span>
                <span className="bg-surface-container-low text-[10px] px-2 py-0.5 font-bold border border-outline-variant tracking-wider">{item.topic}</span>
              </div>
              <h4 className="font-headline-md text-[22px] text-primary mb-2 group-hover:text-primary-container transition-colors">{item.title}</h4>
              <p className="font-label-md text-label-md text-secondary mb-unit-md">{item.guest}</p>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-unit-lg flex-grow">{item.desc}</p>
              <button className="w-full bg-primary text-white py-unit-sm font-label-md text-label-md flex items-center justify-center gap-unit-sm hover:bg-primary-container transition-colors uppercase tracking-wide">
                WATCH EPISODE <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
