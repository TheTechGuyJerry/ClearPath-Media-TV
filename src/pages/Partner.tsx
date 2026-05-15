import { Megaphone, FileText, BookOpen, MessageSquare } from 'lucide-react';

export default function Partner() {
  return (
    <div className="w-full">
      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-unit-xl">
        <section className="max-w-[720px] mx-auto text-center mb-unit-xl md:mb-[96px]">
          <h1 className="font-display-lg text-display-lg text-primary mb-unit-md">Partner With Us</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-unit-lg">
            Align your organization with rigorous, policy-focused journalism. We build long-term partnerships based on credibility, depth, and a shared commitment to elevating African public affairs discourse.
          </p>
        </section>

        <section className="mb-unit-xl md:mb-[96px]">
          <h2 className="font-headline-md text-headline-md text-primary mb-gutter border-b border-outline-variant pb-unit-xs">Partnership Avenues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {[
              { icon: Megaphone, title: 'Programme Sponsorship', desc: 'Sponsor our flagship investigative or analytical programmes. Gain visibility among key decision-makers and policy influencers through strategic placement and acknowledged support.' },
              { icon: FileText, title: 'Explanatory Verticals', desc: 'Underwrite specific explanatory content verticals (e.g., Energy Transition, Trade Policy). Associate your brand with in-depth, accessible analysis of complex topics.' },
              { icon: BookOpen, title: 'Special Series', desc: 'Collaborate on time-bound, deep-dive special report series addressing pressing continental or regional issues, bringing critical insights to our engaged readership.' },
              { icon: MessageSquare, title: 'Intellectual Events', desc: 'Partner on high-level roundtables, webinars, or live briefings. Facilitate crucial conversations between policymakers, industry leaders, and our editorial team.' }
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-surface-container-lowest border border-outline-variant rounded p-unit-lg hover:bg-surface-container-low transition-colors duration-200">
                  <div className="mb-unit-md text-primary">
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-unit-sm">{item.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-unit-md">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-[720px] mx-auto bg-surface-container p-gutter rounded border border-outline-variant mb-unit-xl md:mb-[96px] text-center">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-unit-sm">Editorial Transparency</h3>
          <p className="font-body-md text-body-md text-on-surface">
            Clearpath Media maintains strict editorial independence. While we value our partners, sponsorship does not influence our rigorous editorial process or dictate coverage. All supported content is clearly labelled to ensure transparency with our audience.
          </p>
        </section>

        <section className="max-w-[720px] mx-auto">
          <h2 className="font-headline-md text-headline-md text-primary mb-unit-md text-center">Initiate a Conversation</h2>
          <p className="font-body-md text-body-md text-on-surface-variant text-center mb-gutter">Please provide your details below, and our partnerships team will be in touch shortly.</p>
          
          <form className="space-y-unit-md" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="e.g. Jane Doe" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="email">Work Email</label>
                <input type="email" id="email" placeholder="jane@organization.com" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="organisation">Organisation</label>
                <input type="text" id="organisation" placeholder="Organisation Name" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="role">Job Title / Role</label>
                <input type="text" id="role" placeholder="e.g. Director of Communications" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2" />
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="interest">Partnership Interest</label>
              <select id="interest" defaultValue="" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2">
                <option value="" disabled>Select an option</option>
                <option value="programme">Programme Sponsorship</option>
                <option value="vertical">Explanatory Verticals</option>
                <option value="series">Special Series</option>
                <option value="events">Intellectual Events</option>
                <option value="other">Other / General Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="message">Additional Information (Optional)</label>
              <textarea id="message" rows={4} placeholder="Tell us briefly about your goals..." className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2"></textarea>
            </div>
            <div className="text-right pt-unit-sm">
              <button type="submit" className="bg-primary text-white font-label-md text-label-md px-unit-lg py-3 rounded hover:bg-primary-container transition-colors tracking-wide uppercase">Submit Inquiry</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
