import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ChevronDown, Check, ShieldCheck } from 'lucide-react';
import CheckEmailModal from '../CheckEmailModal';

interface SubscriptionSectionProps {
  title?: string;
  description?: string;
}

const OCCUPATIONS = [
  'Business Executive',
  'Public Servant',
  'Student',
  'Academic',
  'Journalist',
  'Politician',
  'Development Professional',
  'Entrepreneur',
  'Civil Society',
  'Other'
];

const STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Abuja (FCT)', 'Others'
];

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  title = 'Start every morning with clarity',
  description = 'Subscribe to ClearPath Daily — a concise weekday briefing on Nigeria’s politics, economy, governance and public policy, delivered before the noise begins.'
}) => {
  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [stateOfOrigin, setStateOfOrigin] = useState('');
  const [customState, setCustomState] = useState('');
  const [consent, setConsent] = useState(true);

  // Flow State
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [error, setError] = useState('');
  const [continuationToken, setContinuationToken] = useState('');

  // Modal State
  const [checkEmailOpen, setCheckEmailOpen] = useState(false);
  const [activeModalEmail, setActiveModalEmail] = useState('');

  // Step 1: Start Subscription via API
  const handleStartSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = email.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.status === 'already_subscribed') {
          setError(data.message || 'This email address is already subscribed.');
        } else {
          setActiveModalEmail(emailLower);
          if (data.token) {
            setContinuationToken(data.token);
          }
          setCheckEmailOpen(true);
        }
      } else {
        setError(data.error || 'Failed to start subscription. Please try again.');
      }
    } catch (err: any) {
      console.error('[SubscriptionSection] Error starting subscription:', err);
      setError(err.message || 'Network error starting subscription.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Complete Subscription via API
  const handleCompleteSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !surname.trim()) {
      setError('Please enter your First Name and Surname.');
      return;
    }
    if (!occupation) {
      setError('Please select your Occupation.');
      return;
    }
    if (!stateOfOrigin) {
      setError('Please select your State of residence.');
      return;
    }
    if (stateOfOrigin === 'Others' && !customState.trim()) {
      setError('Please specify your state of residence or country.');
      return;
    }
    if (!consent) {
      setError('You must accept the terms to complete subscription.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/complete-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: continuationToken,
          firstName: firstName.trim(),
          surname: surname.trim(),
          occupation,
          stateOfOrigin: stateOfOrigin === 'Others' ? customState.trim() : stateOfOrigin,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setCompletionMessage(data.message || 'Your subscription has been completed successfully. A confirmation email has been sent to you.');
      } else {
        setError(data.error || 'Failed to complete subscription. Please try again.');
      }
    } catch (err: any) {
      console.error('[SubscriptionSection] Error completing subscription:', err);
      setError(err.message || 'Network error completing subscription.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="my-16 bg-gradient-to-b from-[#faf9f5] to-white dark:from-surface-container-high dark:to-surface-container border-y border-slate-200/80 dark:border-outline-variant py-14 px-margin-mobile md:px-margin-desktop shadow-sm relative overflow-hidden text-left w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
      {/* Check Email Verification Modal */}
      <CheckEmailModal
        isOpen={checkEmailOpen}
        onClose={() => setCheckEmailOpen(false)}
        email={activeModalEmail}
        continuationToken={continuationToken}
      />

      <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Brief Overview & Trust Factors */}
        <div className="md:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#001e40]/10 dark:bg-primary/10 text-[#001e40] dark:text-primary rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            <Mail className="w-3.5 h-3.5" />
            <span>ClearPath Daily Briefing</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#17181a] dark:text-on-surface leading-tight tracking-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-[#666b73] dark:text-on-surface-variant leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[#001e40] dark:text-primary font-semibold text-xs sm:text-sm">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> One email</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Five minutes</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Every weekday</span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-outline-variant/40 flex items-center gap-2 text-xs text-slate-500 dark:text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Non-partisan, verified intelligence directly in your inbox.</span>
          </div>
        </div>

        {/* Right Column: Interactive Subscription Form Card */}
        <div className="md:col-span-6 bg-white dark:bg-surface-bright border border-slate-200 dark:border-outline-variant/70 rounded-2xl p-6 sm:p-8 shadow-md" id="article-subscribe-card">
          {submitted ? (
            <div className="py-6 text-center flex flex-col items-center gap-4 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 stroke-[1.5]" />
              <h3 className="text-[#17181a] dark:text-on-surface font-serif text-xl sm:text-2xl font-bold">
                Subscription Completed
              </h3>
              <p className="text-[#666b73] dark:text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                {completionMessage || 'Your subscription has been completed successfully. A confirmation email has been sent to you.'}
              </p>
            </div>
          ) : (
            <div>
              {/* Step 1: Start Subscription (Email Entry) */}
              {step === 1 && (
                <form onSubmit={handleStartSubscription} noValidate className="space-y-4">
                  <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 dark:border-outline-variant/50 pb-3 mb-4">
                    <h3 className="text-[#001e40] dark:text-on-surface text-lg sm:text-xl font-bold font-sans">
                      Subscribe Free
                    </h3>
                    <span className="text-[10px] sm:text-xs text-slate-400 dark:text-on-surface-variant font-mono font-semibold tracking-wider uppercase">
                      Step 1 of 2
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-4">
                    Get verified facts, useful context and clear policy analysis directly in your inbox.
                  </p>

                  <div>
                    <label htmlFor="sub-email-input" className="block mb-1.5 text-[#001e40] dark:text-on-surface text-xs font-bold tracking-wide">
                      Email address *
                    </label>
                    <input
                      id="sub-email-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-outline-variant rounded-xl text-slate-800 dark:text-on-surface text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001e40]/20 dark:focus:ring-primary/20 focus:border-[#001e40] dark:focus:border-primary transition-all bg-white dark:bg-surface-container-low font-sans"
                      required
                    />
                    {error && (
                      <div className="mt-2 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-[46px] py-3 px-6 flex items-center justify-center bg-[#001e40] hover:bg-[#00142b] dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-on-primary text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-150 shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Sending Link...' : 'Subscribe'}
                  </button>

                  <p className="text-center text-slate-400 dark:text-on-surface-variant/80 text-[11px] font-medium pt-1">
                    Free to join. Unsubscribe at any time.
                  </p>
                </form>
              )}

              {/* Step 2: Complete Subscription Details */}
              {step === 2 && (
                <form onSubmit={handleCompleteSubscription} noValidate className="space-y-4">
                  <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 dark:border-outline-variant/50 pb-3 mb-4">
                    <h3 className="text-[#001e40] dark:text-on-surface text-lg sm:text-xl font-bold font-sans">
                      Subscriber Details
                    </h3>
                    <span className="text-[10px] sm:text-xs text-slate-400 dark:text-on-surface-variant font-mono font-semibold tracking-wider uppercase">
                      Step 2 of 2
                    </span>
                  </div>

                  {/* Email pre-filled and locked */}
                  <div>
                    <label className="block mb-1 text-[#001e40] dark:text-on-surface text-xs font-bold tracking-wide">
                      Connected Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-3.5 py-2 bg-slate-100 dark:bg-surface-container border border-slate-200 dark:border-outline-variant rounded-xl text-slate-600 dark:text-on-surface-variant text-xs font-medium cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="sub-first-name" className="block mb-1 text-[#001e40] dark:text-on-surface text-xs font-bold tracking-wide">
                        First name *
                      </label>
                      <input
                        id="sub-first-name"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-outline-variant rounded-xl text-slate-800 dark:text-on-surface text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001e40]/20 bg-white dark:bg-surface-container-low"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="sub-surname" className="block mb-1 text-[#001e40] dark:text-on-surface text-xs font-bold tracking-wide">
                        Surname *
                      </label>
                      <input
                        id="sub-surname"
                        type="text"
                        placeholder="Surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-outline-variant rounded-xl text-slate-800 dark:text-on-surface text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001e40]/20 bg-white dark:bg-surface-container-low"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sub-occupation" className="block mb-1 text-[#001e40] dark:text-on-surface text-xs font-bold tracking-wide">
                      Occupation *
                    </label>
                    <div className="relative">
                      <select
                        id="sub-occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-outline-variant rounded-xl text-slate-800 dark:text-on-surface text-xs bg-white dark:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-[#001e40]/20 appearance-none pr-9 cursor-pointer"
                        required
                      >
                        <option value="" disabled>Select occupation *</option>
                        {OCCUPATIONS.map((occ) => (
                          <option key={occ} value={occ}>{occ}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sub-state" className="block mb-1 text-[#001e40] dark:text-on-surface text-xs font-bold tracking-wide">
                      State of residence *
                    </label>
                    <div className="relative mb-2">
                      <select
                        id="sub-state"
                        value={stateOfOrigin}
                        onChange={(e) => {
                          setStateOfOrigin(e.target.value);
                          if (e.target.value !== 'Others') setCustomState('');
                        }}
                        className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-outline-variant rounded-xl text-slate-800 dark:text-on-surface text-xs bg-white dark:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-[#001e40]/20 appearance-none pr-9 cursor-pointer"
                        required
                      >
                        <option value="" disabled>Select state *</option>
                        {STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {stateOfOrigin === 'Others' && (
                      <div className="mt-2">
                        <label htmlFor="sub-custom-state" className="block mb-1 text-[#001e40] dark:text-on-surface text-xs font-bold tracking-wide">
                          Specify state or country *
                        </label>
                        <input
                          id="sub-custom-state"
                          type="text"
                          placeholder="Enter your residence or country"
                          value={customState}
                          onChange={(e) => setCustomState(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-outline-variant rounded-xl text-slate-800 dark:text-on-surface text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001e40]/20 bg-white dark:bg-surface-container-low"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <label className="flex items-start gap-2.5 my-3 text-slate-600 dark:text-on-surface-variant text-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-[#001e40] cursor-pointer shrink-0"
                      required
                    />
                    <span className="leading-snug">
                      I agree to receive ClearPath Daily and accept the{' '}
                      <Link to="/privacy-policy" className="text-[#001e40] dark:text-primary font-bold underline">
                        Privacy Policy
                      </Link>
                      {' '}and{' '}
                      <Link to="/terms-of-use" className="text-[#001e40] dark:text-primary font-bold underline">
                        Terms of Use
                      </Link>.
                    </span>
                  </label>

                  {error && (
                    <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-[46px] py-3 px-6 flex items-center justify-center bg-[#001e40] hover:bg-[#00142b] dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-on-primary text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-150 shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Completing Subscription...' : 'Complete Subscription'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
