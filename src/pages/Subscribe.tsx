import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Podcast, CheckCircle2, Mail, Send, ShieldCheck } from 'lucide-react';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { adjustNameFormatting } from '../utils/formatters';

export default function Subscribe() {
  // Newsletter States
  const [newsEmail, setNewsEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [eventsOptIn, setEventsOptIn] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  
  const [newsSubmitting, setNewsSubmitting] = useState(false);
  const [newsSubmitted, setNewsSubmitted] = useState(false);
  const [newsError, setNewsError] = useState('');

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = newsEmail.toLowerCase().trim();
    
    if (!emailLower || !emailLower.includes('@')) {
      setNewsError('Please enter a valid email address.');
      return;
    }

    if (!privacyConsent) {
      setNewsError('You must read and consent to the Privacy Policy to subscribe.');
      return;
    }

    setNewsSubmitting(true);
    setNewsError('');

    try {
      // Check duplicate
      try {
        const duplicateQuery = query(
          collection(db, 'newsletterSubscribers'),
          where('email', '==', emailLower),
          where('status', '==', 'active')
        );
        const dupSnap = await getDocs(duplicateQuery);
        if (!dupSnap.empty) {
          setNewsSubmitted(true);
          return;
        }
      } catch (checkErr) {
        console.log('Pre-subscribe verification bypassed.');
      }

      // Add to firestore
      await addDoc(collection(db, 'newsletterSubscribers'), {
        email: emailLower,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        eventsOptIn,
        privacyConsent,
        selectedBriefings: ['General Weekly Brief'],
        status: 'active',
        source: 'subscribe_page',
        subscribedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setNewsSubmitted(true);
    } catch (err) {
      console.error('Error saving subscription:', err);
      setNewsError(err instanceof Error ? err.message : 'Subscription failed. Please try again.');
    } finally {
      setNewsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullNameValue = contactName.trim();
    const emailValue = contactEmail.toLowerCase().trim();
    const msgValue = contactMsg.trim();

    if (!fullNameValue || !emailValue || !msgValue) {
      setContactError('Please fill out all contact fields');
      return;
    }

    setContactSubmitting(true);
    setContactError('');

    try {
      await addDoc(collection(db, 'contactMessages'), {
        fullName: fullNameValue,
        email: emailValue,
        message: msgValue,
        source: 'subscribe_page_reach_out',
        status: 'new',
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setContactSuccess(true);
    } catch (err) {
      console.error('Error sending message:', err);
      setContactError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-[#fcf9f8] min-h-[90vh] flex items-center justify-center px-margin-mobile md:px-margin-desktop font-sans text-on-surface">
      <div className="bg-white w-full max-w-5xl shadow-xl border border-outline-variant/60 rounded-xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Branding & Contact Panel */}
        <div className="w-full md:w-5/12 bg-primary text-white p-8 md:p-12 flex flex-col justify-between relative">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-block hover:opacity-95 transition-opacity">
              <span className="font-display font-bold text-xl tracking-wider text-white">CLEARPATH MEDIA</span>
            </Link>
            
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-2xl text-white leading-tight">
                Authority in every word.
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Deep dives into the mechanics of power, nuanced analyses of policy, and the societal forces shaping West Africa and the globe.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-10 border-t border-white/10 mt-10">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/60 mb-4 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Direct inquiry
            </h4>
            
            {contactSuccess ? (
              <div className="bg-white/10 border border-white/20 text-white p-4 rounded text-xs leading-relaxed flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Message received. We will respond shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <input 
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-white/40 rounded px-3 py-2 text-xs text-white placeholder-white/50 outline-none transition-all"
                />
                <input 
                  type="email"
                  required
                  placeholder="Your Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-white/40 rounded px-3 py-2 text-xs text-white placeholder-white/50 outline-none transition-all"
                />
                <textarea 
                  required
                  rows={2}
                  placeholder="Your message..."
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 focus:border-white/40 rounded px-3 py-2 text-xs text-white placeholder-white/50 outline-none resize-none transition-all"
                ></textarea>
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full bg-white hover:bg-white/95 text-primary text-xs font-bold py-2.5 rounded shadow-sm hover:translate-y-[-1px] active:translate-y-0 transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{contactSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
                {contactError && (
                  <p className="text-[10px] text-red-300 font-semibold mt-1">{contactError}</p>
                )}
              </form>
            )}
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-8 flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-4">
              <a href="https://www.youtube.com/@ClearPathMediaTV" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube</span>
              </a>
              <a href="https://www.youtube.com/@ClearPathMediaTV" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                <Podcast className="w-3.5 h-3.5 text-purple-400" />
                <span>Podcast</span>
              </a>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Editorial Desk</span>
          </div>
        </div>

        {/* Right Form Panel (Newsletter Sign Up) */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
          
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-primary mb-3 leading-tight tracking-tight">
              Get clear, objective analysis of the moments shaping global and regional policy.
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Stay ahead with <strong className="text-primary">ClearPath Daily</strong>. Get high-impact briefings, policy breakdowns, and geopolitical risk analysis delivered straight to your inbox every morning. Free, independent, and trusted by global leaders, analysts, and citizens alike.
            </p>
          </div>

          {newsSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-lg text-sm font-semibold flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-emerald-900 mb-1">Subscription Confirmed</h3>
                <p className="font-normal text-emerald-800">
                  Thank you for subscribing! Your first morning briefing is on the way. We are delighted to have you with us.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-5">
              
              {/* Email Address (required) */}
              <div className="space-y-1.5 text-left">
                <label className="block text-sm font-semibold text-primary">
                  Email Address <span className="text-error font-normal">(required)</span>
                </label>
                <input 
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  className="w-full bg-white border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded px-4 py-3 text-sm outline-none transition-all"
                />
              </div>

              {/* Names row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-sm font-semibold text-primary">
                    First Name
                  </label>
                  <input 
                    type="text"
                    placeholder="Your First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded px-4 py-3 text-sm outline-none transition-all"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-sm font-semibold text-primary">
                    Last Name
                  </label>
                  <input 
                    type="text"
                    placeholder="Your Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded px-4 py-3 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Checkbox: Events */}
              <div className="flex items-start gap-3 text-left">
                <input 
                  type="checkbox"
                  id="eventsOptIn"
                  checked={eventsOptIn}
                  onChange={(e) => setEventsOptIn(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-outline text-primary focus:ring-0 cursor-pointer mt-0.5"
                />
                <label htmlFor="eventsOptIn" className="text-xs text-on-surface-variant leading-relaxed select-none cursor-pointer">
                  <strong className="text-primary font-semibold">Events:</strong> Alert me about ClearPath Media events, livestreams, Spaces and more.
                </label>
              </div>

              {/* Checkbox: Privacy Notice (required) */}
              <div className="flex items-start gap-3 text-left">
                <input 
                  type="checkbox"
                  id="privacyConsent"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-outline text-primary focus:ring-0 cursor-pointer mt-0.5"
                />
                <label htmlFor="privacyConsent" className="text-xs text-on-surface-variant leading-relaxed select-none cursor-pointer">
                  <strong className="text-primary font-semibold">Consent <span className="text-error font-normal">(required)</span>:</strong> I have read, understand, and consent to the{' '}
                  <Link to="/privacy-policy" className="text-primary font-semibold underline hover:text-primary-container">Privacy Policy</Link>{' '}
                  and{' '}
                  <Link to="/terms-of-use" className="text-primary font-semibold underline hover:text-primary-container">Terms of Use</Link>, including the secure processing of my personal data to manage my newsletter delivery.
                </label>
              </div>

              {/* News error display */}
              {newsError && (
                <div className="bg-red-50 border border-red-200 text-error p-3.5 rounded text-xs font-semibold">
                  {newsError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={newsSubmitting}
                className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 px-6 font-bold rounded-lg shadow-md hover:translate-y-[-1px] active:translate-y-0 uppercase tracking-wider transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {newsSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign Up Now</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
