import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

  return (
    <div className="py-12 md:py-20 bg-[#fcf9f8] min-h-[90vh] flex items-center justify-center px-margin-mobile md:px-margin-desktop font-sans text-on-surface">
      <div className="bg-white w-full max-w-2xl shadow-xl border border-outline-variant/60 rounded-xl p-8 md:p-12">
        
        <div className="mb-8 text-center md:text-left">
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
                onChange={(e) => setNewsEmail && setPrivacyConsent(e.target.checked)}
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
  );
}
