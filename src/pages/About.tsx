import React from 'react';
import SEO from '../components/SEO';
import { User, Shield, Info, ArrowUpRight } from 'lucide-react';

export default function About() {
  const principles = [
    {
      title: 'Explanation over reaction',
      desc: 'We decline the speed race of breaking news. We step back from instant commentary to build rigorous, patient, data-grounded explanations of societal processes and policies.'
    },
    {
      title: 'Judgment over neutrality',
      desc: 'We believe active explanation requires selecting facts and offering professional, evidence-driven evaluation rather than hiding behind passive neutrality or false equivalences.'
    },
    {
      title: 'Selection over exhaustiveness',
      desc: 'Instead of overwhelming audiences with excessive, undigested data, we curatively extract key insights and patterns to deliver high-signal, zero-noise public intelligence.'
    },
    {
      title: 'Systems over personalities',
      desc: 'We prioritize structural analysis of public institutions, constitutional powers, and economic frameworks over the surface focus on partisan conflicts and political personalities.'
    },
    {
      title: 'Longevity over virality',
      desc: 'We construct editorial assets meant to be revisited, referenced, and trusted months and years down the line, rather than chasing algorithmic amplification.'
    }
  ];

  const team = [
    {
      name: 'Annabel Orji',
      title: 'Presenter, Daily Brief with Annabel',
      role: 'Daily Briefing Host',
      bio: 'Annabel Orji hosts ClearPath Media’s signature weekday briefing series, delivering calm, highly structured overviews of primary policy developments, geopolitical, and economic updates.',
      tag: 'DAILY BREIFINGS'
    },
    {
      name: 'Osita Chidoka',
      title: 'Host, OsitaInsight',
      role: 'Governance Commentator',
      bio: 'Osita Chidoka deconstructs governance, electoral frameworks, public sector performance, and institutions of accountability, drawing from decades of public leadership.',
      tag: 'GOVERNANCE'
    },
    {
      name: 'ClearPath Elections Desk',
      title: 'Election Intelligence',
      role: 'Data Analysis Desk',
      bio: 'Our dedicated elections desk coordinates voting analytics, electoral boundary insights, legal framework updates, and structural audits of Nigeria’s democratic processes.',
      tag: 'ELECTION INTELLIGENCE'
    }
  ];

  return (
    <div className="w-full">
      <SEO 
        title="About ClearPath — Institutional Intelligence" 
        description="ClearPath Media TV is Nigeria's election intelligence platform — delivering data-driven, public-intellectual analysis of politics, governance, and democratic processes." 
      />

      {/* Hero Mandate Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl md:py-[100px] border-b border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-8 md:col-start-3 text-center flex flex-col gap-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-slate-100 self-center px-3 py-1 rounded">
              Institutional Mandate
            </span>
            <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-primary font-bold font-display tracking-tight leading-none text-slate-900">
              Intelligence, <br className="hidden sm:block"/>not advocacy.
            </h1>
            <p className="font-body-lg text-lg md:text-xl text-on-surface-variant max-w-[760px] mx-auto leading-relaxed text-slate-700">
              ClearPath Media TV is Nigeria's election intelligence platform — delivering data-driven analysis of politics, governance, and democratic processes. We represent a public-intellectual platform focused on Nigeria and West Africa, constructing high-signal explainers and public briefings for serious audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Five Editorial Principles Section */}
      <section className="bg-slate-950 text-white border-y border-slate-900 py-16 md:py-[100px]">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center md:text-left mb-12 border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 block mb-2">OPERATING ETHOS</span>
              <h2 className="text-3xl md:text-4.5xl font-bold font-display tracking-tight text-white">
                The Five Editorial Principles
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              How ClearPath approaches public-intellectual journalism to build lasting public trust.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {principles.map((pr, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col gap-4 hover:border-slate-700 transition-colors">
                <span className="text-3xl font-bold font-mono text-slate-600 block">
                  0{idx + 1}
                </span>
                <h3 className="text-lg font-bold font-display text-white leading-tight">
                  {pr.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pr.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Presenters & Contributors Cards Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-[100px] border-b border-outline-variant">
        <div className="mb-12 text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Team & Presenters</span>
          <h2 className="text-3xl font-bold text-slate-900 font-display tracking-tight">
            Hosts and Editorial Contributors
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The serious voices translating policy, elections, and national governance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {team.map((person, idx) => (
            <div key={idx} className="bg-white border border-slate-200/85 hover:border-slate-300 rounded-xl p-6 md:p-8 flex flex-col justify-between transition-all shadow-xs group relative overflow-hidden">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded font-mono tracking-wider">
                    {person.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <User className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-primary transition-colors">
                    {person.name}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500 block mt-1">
                    {person.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2 p-4 bg-slate-50 border border-slate-100 rounded-lg font-sans">
                  {person.bio}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">{person.role}</span>
                <span className="text-primary font-bold flex items-center gap-1 group-hover:underline">
                  ClearPath Profile <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnerships Section (What and Why) */}
      <section className="bg-slate-50 py-16 md:py-[100px]">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="lg:col-span-12 max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Academic Partnership</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-slate-900 mb-6">
                Bridging Academic Investigation & Public Context
              </h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  ClearPath Media operates as the interpretative engine for primary policy research, maintaining a foundational collaboration with <strong>The Athena Centre for Policy and Leadership</strong>.
                </p>
                <p>
                  While researchers and policy institutes build academic reports on institutional designs, ClearPath Media translates these findings into high-scannability briefings, daily podcasts, and structured YouTube libraries. This pipeline guarantees public understanding is built on verifiable truth rather than hearsay or emotional reaction.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-8 pt-6 border-t border-slate-100 text-xs text-primary font-mono font-bold uppercase tracking-wider">
                <span>Research</span>
                <span className="text-slate-400">→</span>
                <span>Interpretation</span>
                <span className="text-slate-400">→</span>
                <span>Public Understanding</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
