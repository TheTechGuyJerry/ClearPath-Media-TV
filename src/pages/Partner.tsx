import { Megaphone, FileText, BookOpen, MessageSquare, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';

export default function Partner() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [role, setRole] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !organisation.trim() || !interest) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'partnerRequests'), {
        fullName: name.trim(),
        workEmail: email.toLowerCase().trim(),
        organisation: organisation.trim(),
        jobTitle: role.trim(),
        partnershipInterest: interest,
        additionalInformation: message.trim(),
        status: "new",
        source: "partner_form",
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting partner request:', err);
      alert('Failed to submit partner request. Please try again: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <SEO 
        title="Partner with ClearPath — Institutional Collaboration" 
        description="Collaborate with ClearPath Media to build robust, evidence-backed public explanations of national risk, policy changes, and institutional dynamics." 
      />
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
            ClearPath Media maintains strict editorial independence. While we value our partners, sponsorship does not influence our rigorous editorial process or dictate coverage. All supported content is clearly labelled to ensure transparency with our audience.
          </p>
        </section>

        <section className="max-w-[720px] mx-auto">
          {submitted ? (
            <div className="bg-surface border border-primary/50 text-center p-unit-xl rounded-lg shadow-sm flex flex-col items-center gap-unit-md">
              <CheckCircle2 className="w-16 h-16 text-primary animate-bounce animate-duration-1000" />
              <h2 className="font-headline-lg text-headline-lg text-primary">Inquiry Submitted Successfully</h2>
              <p className="font-body-lg text-on-surface-variant max-w-md">Thank you for reaching out. A representative from our partnerships team will review your request and get in touch with you shortly.</p>
            </div>
          ) : (
            <>
              <h2 className="font-headline-md text-headline-md text-primary mb-unit-md text-center">Initiate a Conversation</h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-center mb-gutter">Please provide your details below, and our partnerships team will be in touch shortly.</p>
              
              <form className="space-y-unit-md" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="name">Full Name <span className="text-primary">*</span></label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jane Doe" 
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2" 
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="email">Work Email <span className="text-primary">*</span></label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@organization.com" 
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="organisation">Organisation <span className="text-primary">*</span></label>
                    <input 
                      type="text" 
                      id="organisation" 
                      required
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      placeholder="Organisation Name" 
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2" 
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="role">Job Title / Role</label>
                    <input 
                      type="text" 
                      id="role" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Director of Communications" 
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit-xs" htmlFor="interest">Partnership Interest <span className="text-primary">*</span></label>
                  <select 
                    id="interest" 
                    required
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2"
                  >
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
                  <textarea 
                    id="message" 
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us briefly about your goals..." 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 focus:border-b-2"
                  ></textarea>
                </div>
                <div className="text-right pt-unit-sm">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full md:w-auto bg-primary text-white font-label-md text-label-md px-8 py-3 rounded hover:bg-primary-container transition-colors tracking-wide uppercase disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
