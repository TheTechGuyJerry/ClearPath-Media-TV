import { Search, Play } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full">
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl md:py-[96px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-8 md:col-start-3 text-center">
            <h1 className="font-display-lg text-display-lg text-primary mb-unit-lg">Explaining power, policy, and society.</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[720px] mx-auto">
              Clearpath Media exists to demystify the complex systems that shape African public affairs. We translate intricate policy and institutional mechanics into accessible, high-fidelity analysis for a serious audience seeking clarity, not noise.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low border-y border-outline-variant py-unit-xl md:py-[80px]">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-4 flex flex-col justify-center">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-md">What Clearpath is Not</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Defining our boundaries is crucial to maintaining our focus on structural analysis over fleeting events.</p>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-unit-md">
              {[
                { title: 'A Newsroom', text: 'We do not chase the 24-hour news cycle or report on breaking events.' },
                { title: 'An Advocacy Group', text: 'We explain policies; we do not campaign for or against them.' },
                { title: 'A Personality Brand', text: 'Our work is centered on institutions and systems, not individuals or pundits.' }
              ].map(item => (
                <div key={item.title} className="bg-surface border border-outline-variant p-unit-lg rounded-DEFAULT">
                  <h3 className="font-headline-md text-headline-md text-primary mb-unit-xs text-xl">{item.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container px-margin-mobile md:px-margin-desktop py-unit-xl md:py-[96px] border-y border-outline-variant">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-unit-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-sm">Editorial Standards</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[600px] mx-auto">The principles that govern our interpretative journalism.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {[
              { title: 'Evidence-Led', text: 'Every explainer is rooted in verifiable data, official documents, and expert consensus. We prioritize primary sources over secondary commentary.' },
              { title: 'Non-Partisan', text: 'We analyze political systems, not political sides. Our focus is on the mechanics of policy, deliberately stripped of partisan framing.' },
              { title: 'Independence', text: 'Clearpath maintains strict editorial independence. While we collaborate with research entities, our interpretative output is solely controlled by our editorial board.' },
              { title: 'Corrections', text: 'When we err in facts or critical context, we correct the record transparently and promptly on the relevant platform.' }
            ].map(item => (
              <div key={item.title} className="bg-surface border border-outline-variant p-[32px] rounded-DEFAULT hover:bg-surface-container-low transition-colors duration-300">
                <div className="flex items-start gap-unit-md">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary mb-unit-xs text-2xl">{item.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl md:py-[120px]">
        <div className="border border-outline-variant rounded-DEFAULT p-unit-xl md:p-[64px] bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-surface-container-low to-transparent opacity-50 z-0 pointer-events-none"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-5 border-r border-outline-variant pr-gutter">
              <h2 className="font-headline-md text-headline-md text-primary mb-unit-sm">The Research Pipeline</h2>
              <h3 className="font-display-lg text-display-lg text-primary mb-unit-md text-4xl">Our Relationship with The Athena Centre</h3>
            </div>
            <div className="md:col-span-7 font-body-lg text-body-lg text-on-surface-variant space-y-unit-md">
              <p>Clearpath Media operates as the interpretative arm for complex policy research, maintaining a foundational partnership with The Athena Centre for Policy and Leadership.</p>
              <p>The Athena Centre produces dense, academic-grade research on institutional frameworks and socioeconomic policies. Clearpath Media translates this robust data into accessible briefings, explainers, and long-form visual journalism.</p>
              <p className="font-semibold text-primary mt-unit-lg">Research → Interpretation → Public Understanding</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
