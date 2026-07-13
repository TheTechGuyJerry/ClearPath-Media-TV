import React, { useEffect } from 'react';
import { Shield, Globe, Key, AlertCircle, Mail, ArrowUp } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="py-12 md:py-20 bg-background min-h-[90vh] text-left font-sans text-on-surface">
      <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Header Hero Section */}
        <div className="border-b border-outline-variant pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded mb-4">
            <Shield className="w-3.5 h-3.5" />
            Privacy & Data Protection
          </div>
          <h1 className="font-display-lg text-display-lg text-primary leading-tight font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-on-surface-variant max-w-3xl text-lg leading-relaxed">
            At ClearPath Media, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information.
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
              1. General Information
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              ClearPath Media ("ClearPath," "we," "us," or "our") operates the website located at <span className="font-mono text-primary font-medium">clearpathmedia.ng</span> and related subdomains, platforms, mobile layouts, and email newsletter distribution lists.
            </p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Our services are intended for research, public affairs briefing, policy analysis, and informational media purposes. This Privacy Policy describes how we collect, use, store, transfer, and protect your information when you subscribe to our newsletters, submit inquiry forms, or browse our website.
            </p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              These notices align with international digital trust frameworks, including the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and applicable regional compliance regimes.
            </p>
          </section>

          {/* Core Privacy Content */}
          <section className="space-y-6">
            <h2 className="font-headline-md text-headline-md text-primary pb-2 border-b border-outline-variant/40 flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-primary" />
              2. Data Collection and Usage
            </h2>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-base">A. Information We Collect</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">We collect only the information necessary to provide high-quality policy briefings, video alerts, and industry events announcements. This includes:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant text-sm">
                <li><strong className="text-on-surface">Identity Data:</strong> First name, last name, and complete title where provided.</li>
                <li><strong className="text-on-surface">Contact Data:</strong> Valid email address and telephone contact numbers.</li>
                <li><strong className="text-on-surface">Subscription Preferences:</strong> Information regarding briefings and newsletters you actively request.</li>
                <li><strong className="text-on-surface">Usage Data:</strong> Information about how you use our website, video playback metrics, and interactions with our newsletters (e.g., email opens and click-through parameters via anonymized tags).</li>
                <li><strong className="text-on-surface">Technical Data:</strong> IP address, device types, browser metadata, operating system platform, and approximate geographical location derived from network attributes.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-base">B. How We Use Your Data</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">We process your data based on your explicit consent, contractual necessity, or our legitimate interest to deliver premium editorial products:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant text-sm">
                <li>To dispatch requested daily briefings, weekly columns, and podcast updates.</li>
                <li>To notify you about upcoming live events, webinars, roundtable briefings, and special guest panels.</li>
                <li>To analyze user behavior and engagement parameters so we can optimize our video rendering, load times, and narrative layout structures.</li>
                <li>To manage administrative processes, address inquiries, prevent fraudulent activity, and enforce site security.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-base">C. International Transfers & Consent</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                ClearPath's platforms, cloud assets, and server resources are managed globally, with central databases hosted within the United States. If you reside outside of the United States, your personal data will be transferred to, stored in, and processed within United States facilities.
              </p>
              <p className="mt-2 font-semibold text-on-surface bg-surface-container-low p-4 border-l-4 border-primary rounded-r text-sm">
                By submitting your email and personal details, you explicitly consent to this transfer, storage, and processing, recognizing that privacy and data laws in other jurisdictions may differ from those of your country of residence.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-base">D. Data Retention & Third Parties</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                We retain your information as long as you maintain an active subscription or as required to meet historical record-keeping and compliance standards. We never sell, lease, or distribute your email or personal information to third-party brokers or advertisers. 
              </p>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                We share details only with highly compliant, secure processors essential to our core operations, such as Google Cloud (Firebase infrastructure), standard analytics engines (Google Analytics 4), and authorized automated delivery partners.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-primary text-base">E. Your Legal Rights</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Under global data frameworks, you possess complete control over your subscription profile. You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant text-sm">
                <li><strong className="text-on-surface">Access & Correct:</strong> Review what details we store and request instant corrections.</li>
                <li><strong className="text-on-surface">Opt-Out & Erasure:</strong> Click the "Unsubscribe" tag at the footer of any newsletter or contact our privacy desk to request complete removal of your records.</li>
                <li><strong className="text-on-surface">Restrict Processing:</strong> Restrict certain tracking or analytic cookies while maintaining standard delivery access.</li>
              </ul>
            </div>
          </section>

          {/* Cookie Notice */}
          <section className="space-y-4">
            <h2 className="font-headline-md text-headline-md text-primary pb-2 border-b border-outline-variant/40 flex items-center gap-2.5">
              <Key className="w-5 h-5 text-primary" />
              3. Cookie Notice
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Our website uses standard cookie files to personalize your browsing experience and analyze site metrics.
            </p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              We utilize **Functional Cookies** (to remember your theme, preferences, and session state) and **Analytical Cookies** (specifically Google Analytics 4, to assess traffic levels, aggregate geographical viewership, and track feature popularity).
            </p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              You can configure your browser settings to reject cookies if you wish. Rejecting cookies will not prevent you from subscribing to or reading our newsletter briefings, though some interactive elements may experience slower loading parameters.
            </p>
          </section>

          {/* Contact widget */}
          <div className="bg-surface-container-low p-6 rounded border border-outline-variant/50 max-w-xl">
            <h4 className="text-sm font-bold uppercase text-primary mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4.5 h-4.5 text-primary" />
              Privacy Officer Contacts
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              For any privacy inquiries, data access requests, or compliance concerns, please reach out directly to our dedicated team.
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
