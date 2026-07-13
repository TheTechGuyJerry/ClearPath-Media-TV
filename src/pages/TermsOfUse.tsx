import React, { useEffect } from 'react';
import { FileText, Globe, AlertCircle, Mail, ArrowUp } from 'lucide-react';

export default function TermsOfUse() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="py-12 md:py-20 bg-background min-h-[90vh] text-left font-sans text-on-surface">
      <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Header Hero Section */}
        <div className="border-b border-outline-variant pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded mb-4">
            <FileText className="w-3.5 h-3.5" />
            Platform & Distribution Terms
          </div>
          <h1 className="font-display-lg text-display-lg text-primary leading-tight font-bold mb-4">
            Terms of Use
          </h1>
          <p className="text-on-surface-variant max-w-3xl text-lg leading-relaxed">
            These terms govern your access to and use of ClearPath Media's website, daily briefings, research content, and analysis services.
          </p>
          <div className="text-xs text-outline font-mono mt-4">
            LAST UPDATED: JULY 10, 2026
          </div>
        </div>

        {/* Content Section */}
        <main className="space-y-12">
          
          {/* General Information */}
          <section className="space-y-4">
            <h2 className="font-headline-md text-headline-md text-primary pb-2 border-b border-outline-variant/40 flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-primary" />
              1. General Agreement
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              ClearPath Media ("ClearPath," "we," "us," or "our") operates the website located at <span className="font-mono text-primary font-medium">clearpathmedia.ng</span> and related subdomains, platforms, mobile layouts, and email newsletter distribution lists.
            </p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              By accessing our platform, receiving our automated Daily Briefings, subscribing to our lists, or interacting with our analysts, you agree to be bound by these Terms of Use and our associated Privacy Policy.
            </p>
          </section>

          {/* Core Terms of Use Content */}
          <section className="space-y-6">
            <h2 className="font-headline-md text-headline-md text-primary pb-2 border-b border-outline-variant/40 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-primary" />
              2. Terms & Intellectual Property
            </h2>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-base">A. Intellectual Property & Copyright</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                All content distributed via ClearPath Media — including daily briefings, texts, videos, graphics, audio, analyses, infographics, logos, and layout configurations — is protected by copyright, trademark, and proprietary property rights.
              </p>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                You may view, print, or download individual articles or briefings strictly for your own personal, non-commercial educational use. You are prohibited from republishing, selling, or distributing our written content or utilizing our videos in external corporate programs without prior written consent from ClearPath Media.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-base">B. Professional Opinion Disclaimer</h3>
              <p className="font-semibold text-on-surface bg-surface-container bg-amber-50/40 p-4 border rounded-sm text-sm">
                All analyses, policy commentaries, economic forecasts, or statements expressed within ClearPath's videos, panels, and briefings reflect professional opinions. None of the distributed media or texts constitutes financial, investment, legal, or formal policy advisory. Any reliance on the analysis is taken strictly at your own individual risk.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-base">C. Limitation of Liability</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Under no circumstances shall ClearPath Media, its founders, chief analysts, directors, or content partners be held liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use this platform, or any errors or omissions present in our editorial content.
              </p>
            </div>
          </section>

          {/* Contact widget */}
          <div className="bg-surface-container-low p-6 rounded border border-outline-variant/50 max-w-xl">
            <h4 className="text-sm font-bold uppercase text-primary mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4.5 h-4.5 text-primary" />
              Compliance Desk Contacts
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              For any licensing queries, republishing permissions, or terms clarification, please contact our compliance desk directly.
            </p>
            <a 
              href="mailto:compliance@clearpathmedia.ng" 
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              <Mail className="w-4 h-4" />
              compliance@clearpathmedia.ng
            </a>
          </div>

          {/* Back to top */}
          <div className="flex justify-end pt-6 border-t border-outline-variant/20">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Back to Top
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
