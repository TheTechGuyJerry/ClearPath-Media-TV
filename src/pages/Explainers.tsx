import { Play, FileText, ArrowRight, Focus } from 'lucide-react';

export default function Explainers() {
  return (
    <div className="w-full">
      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="max-w-[800px]">
          <h1 className="font-display-lg text-display-lg text-primary mb-unit-md">Explainers</h1>
          <p className="font-headline-md text-headline-md text-on-surface mb-unit-sm">Clearpath’s explanatory work is designed as long-term public intelligence.</p>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-unit-md">Focus: systems, not headlines.</p>
          <p className="font-body-md text-body-md text-on-surface-variant italic">This page should feel like an evergreen knowledge library. It should combine written explanations, topic summaries, and YouTube embedded videos.</p>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-unit-xl">
          <div className="lg:col-span-4">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-md">Explaining Nigeria</h2>
            <p className="font-body-md text-on-surface mb-unit-md">Establish Clearpath as an authoritative interpreter of Nigerian governance beyond personalities and election cycles.</p>
            
            <div className="mb-unit-md">
              <h4 className="font-label-md text-label-md text-primary uppercase mb-2">What We Cover</h4>
              <ul className="list-disc list-inside text-on-surface-variant space-y-1">
                <li>Federal system</li>
                <li>States</li>
                <li>Local government systems</li>
              </ul>
            </div>
            
            <div className="mb-unit-md">
              <h4 className="font-label-md text-label-md text-primary uppercase mb-2">Key Products</h4>
              <ul className="list-disc list-inside text-on-surface-variant space-y-1">
                <li>Annual State Reviews</li>
                <li>Thematic LGA explainers</li>
                <li>Comparative insights across states</li>
              </ul>
            </div>
            
            <div className="mb-unit-lg p-4 bg-surface-container rounded">
              <h4 className="font-label-md text-label-md text-primary uppercase mb-2">Editorial Principles</h4>
              <ul className="list-disc list-inside text-on-surface-variant text-sm space-y-1">
                <li>No rankings or scorecards</li>
                <li>No partisan tone</li>
                <li>Interpretation over judgment</li>
              </ul>
            </div>
            
            <button className="w-full bg-primary text-white font-label-md text-label-md py-4 rounded hover:bg-surface-tint transition-colors">Explore Explaining Nigeria</button>
          </div>
          
          <div className="lg:col-span-8 flex flex-col gap-unit-md">
            {[
              { type: 'Written explainer', tag: 'Federal system', title: 'The Architecture of Nigerian Federalism', desc: 'A structural breakdown of the exclusive legislative list and how resource control defines power dynamics between tiers of government.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1xOuy3teqvz7a_E3Uf0JxXXeB7y-va4puR9WhlYOaMxZRra2hlgpd3Er58gCb15XLovnEFYIScjBj89lWXb5oFgkW2jNEObBh0ugl4GciFh2VrdXS3DZvdz0-rQzL-78nxsqThMacVb5RJQOMt6yhQuxiM831CmW0FzCtgODW5x7FDzy8VVJnZjYpwqN9umcCXTpDnTy3qn7djWGztFO2vXbMK1gPi0RXU1wYuVcl4S02-afhNpYxi3qrppr4siC1nHgEJeTecs', action: 'Read more', icon: <ArrowRight className="w-4 h-4 ml-1" /> },
              { type: 'Video explainer', tag: 'Local government systems', title: 'The Case for Local Government Autonomy', desc: 'Exploring the supreme court ruling and the constitutional hurdles to functional local governance in Nigeria.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJEJ-XzUJpmNkQrXIdZDvgA6hIAbYMuln8MyC3A8rRzfBCqk0ALvJR0hPpKRONljw0wdiTqJGdMMleOtmuJtRwcUFXj_0a_4k-2aHV17tL8ZdfD6FyPbkhDKlYoL8HoUAi17IWXylWrc72xYSBQTQh_rC6JAB2yzHwPG6n1yMXv6Y1EjLYUM5V2qdDo-4Ucx5Z3R4rZcf5uJy5EeImosm1KqwSLtqmncPTfCrHqVlrKUfbiEY2IMtSiVq8vCqdwGK9mZht_XIs4lg', action: 'Watch video', isVideo: true, icon: <Play className="w-4 h-4 ml-1" /> },
              { type: 'Report summary', tag: 'States', title: '2023 Annual State Reviews', desc: 'A comprehensive digest of governance performance across all 36 states, focusing on fiscal sustainability and policy execution.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNKSTe017KwF4P5tDrfPbgUDFKdtbE0uX2CL4fe-GGzUZFgW2Kj7l_yhAFWN9KtcdYZeCtL6IrwUf7qgeJvB3WDo96DaS6teP4-dYR7PZERUdB5BQsSmE0XE2fbZt96Tb8aNpGN_kLOU8V1bBtB620uHO0cDp9aysehKGWjUZ26n52xtGLOmkKGUm-1oq1ySJxEAGbfi1G4wiP-jBPTemlTbpgo0FiF6qxlhAZ7m7MTqPJNhf8LEM48dn_AbHBKVU59GTG3BzWpzU', action: 'Read summary', icon: <FileText className="w-4 h-4 ml-1" /> }
            ].map(item => (
              <div key={item.title} className="bg-surface-container-lowest border border-outline-variant p-unit-lg rounded-lg group flex flex-col md:flex-row gap-gutter">
                <div className="w-full md:w-2/5 aspect-[16/9] bg-surface-container-high rounded relative overflow-hidden">
                  <img src={item.img} alt={item.title} className="object-cover w-full h-full" />
                  {item.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">{item.tag}</span>
                    <span className="font-label-sm text-label-sm text-primary italic">{item.type}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2 line-clamp-2">{item.title}</h3>
                  <p className="font-body-md text-on-surface-variant mb-unit-md line-clamp-2">{item.desc}</p>
                  <div className="mt-auto">
                    <button className="inline-flex items-center font-label-md text-label-md text-primary hover:underline group/btn">
                      {item.action} {item.icon}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto bg-surface-container-low border-y border-outline-variant">
        <div className="mb-gutter">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-sm">Explaining Africa</h2>
          <p className="font-body-md text-on-surface-variant max-w-[720px] mb-unit-lg">Address the structural gap in understanding African countries as systems. Our framework explores:</p>
          <div className="flex flex-wrap gap-x-gutter gap-y-2 mb-unit-xl">
            {['How power works', 'Economic structure', 'Institutions', 'Society and identity', 'Myths vs realities', 'Future trajectories'].map(topic => (
              <span key={topic} className="text-label-md font-label-md text-primary">• {topic}</span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {[
            { country: 'Nigeria', title: 'The Giant\'s Mechanics', desc: 'A deep dive into the complex web of ethnic identity, oil-based economics, and federal structures.' },
            { country: 'Ghana', title: 'The Cedi and Sovereign Debt', desc: 'An examination of domestic debt restructuring programs and structural macroeconomic vulnerabilities.' },
            { country: 'Côte d’Ivoire', title: 'Agricultural Engines', desc: 'Analyzing the cocoa-driven economy and the political dynamics of the post-conflict era.' },
            { country: 'Kenya', title: 'Devolution a Decade Later', desc: 'Assessing the 2010 constitutional mandate, county government performance, and revenue allocation.' },
            { country: 'Rwanda', title: 'State-Led Models', desc: 'Analyzing the efficiency and limitations of highly centralized administrative structures.' },
            { country: 'South Africa', title: 'Post-Apartheid Institutions', desc: 'Navigating the complexities of constitutional power, labor dynamics, and state capacity.' }
          ].map(item => (
            <div key={item.country} className="bg-surface-container-lowest border border-outline-variant p-unit-lg rounded-lg hover:shadow-sm transition-shadow group flex flex-col h-full">
              <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">{item.country}</h4>
              <h3 className="font-headline-md text-headline-md text-primary mb-2">{item.title}</h3>
              <p className="font-body-md text-on-surface-variant mb-unit-lg flex-grow">{item.desc}</p>
              <div className="pt-unit-md border-t border-outline-variant mt-auto">
                <button className="font-label-md text-label-md text-primary group-hover:underline flex items-center gap-2">
                  Explore <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
