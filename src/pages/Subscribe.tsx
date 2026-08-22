import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import CheckEmailModal from '../components/CheckEmailModal';
import { getPublishedProgrammeVideos } from '../services/publicContentService';
import { ProgrammeVideo } from '../types';

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

export default function Subscribe() {
  const [searchParams] = useSearchParams();

  // YouTube videos state
  const [latestVideos, setLatestVideos] = useState<ProgrammeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);

  // Continuation Token handling state
  const [tokenValidating, setTokenValidating] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [continuationToken, setContinuationToken] = useState<string>('');

  // Check Email Popup Modal State
  const [checkEmailOpen, setCheckEmailOpen] = useState(false);
  const [activeModalEmail, setActiveModalEmail] = useState('');

  // Hero Form States
  const [emailA, setEmailA] = useState(searchParams.get('email') || '');
  const [firstNameA, setFirstNameA] = useState('');
  const [surnameA, setSurnameA] = useState('');
  const [occupationA, setOccupationA] = useState('');
  const [stateA, setStateA] = useState('');
  const [customStateA, setCustomStateA] = useState('');
  const [consentA, setConsentA] = useState(true);
  const [stepA, setStepA] = useState(1);
  const [submittingA, setSubmittingA] = useState(false);
  const [submittedA, setSubmittedA] = useState(false);
  const [completionMessageA, setCompletionMessageA] = useState('');
  const [errorA, setErrorA] = useState('');

  // Footer Form States
  const [emailB, setEmailB] = useState('');
  const [firstNameB, setFirstNameB] = useState('');
  const [surnameB, setSurnameB] = useState('');
  const [occupationB, setOccupationB] = useState('');
  const [stateB, setStateB] = useState('');
  const [customStateB, setCustomStateB] = useState('');
  const [consentB, setConsentB] = useState(true);
  const [stepB, setStepB] = useState(1);
  const [submittingB, setSubmittingB] = useState(false);
  const [submittedB, setSubmittedB] = useState(false);
  const [completionMessageB, setCompletionMessageB] = useState('');
  const [errorB, setErrorB] = useState('');

  // Fetch published videos for preview strip
  useEffect(() => {
    async function fetchVideos() {
      try {
        const videos = await getPublishedProgrammeVideos();
        setLatestVideos(videos.slice(0, 2));
      } catch (err) {
        console.error('Error fetching videos in Subscribe page:', err);
      } finally {
        setVideosLoading(false);
      }
    }
    fetchVideos();
  }, []);

  // Handle Continuation Token from URL Search Params (?token=... or ?continue=...)
  useEffect(() => {
    const rawToken = searchParams.get('token') || searchParams.get('continue');
    if (rawToken) {
      const cleanTok = rawToken.trim();
      setTokenValidating(true);
      setTokenError(null);

      fetch('/api/continue-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: cleanTok }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.email) {
            setContinuationToken(cleanTok);
            setEmailA(data.email);
            setEmailB(data.email);
            setStepA(2);
            setStepB(2);

            // Scroll to form card
            const heroCard = document.getElementById('hero-subscribe-card');
            if (heroCard) {
              heroCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            setTokenError(data.error || 'This subscription continuation link is invalid or expired.');
          }
        })
        .catch((err) => {
          console.error('Error validating token:', err);
          setTokenError('Unable to verify subscription continuation link. Please try entering your email below.');
        })
        .finally(() => {
          setTokenValidating(false);
        });
    }
  }, [searchParams]);

  // Step 1: Start Subscription (Hero form)
  const handleHeroStartSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = emailA.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setErrorA('Please enter a valid email address.');
      return;
    }

    setSubmittingA(true);
    setErrorA('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.status === 'already_subscribed') {
          setErrorA(data.message || 'This email address is already subscribed.');
        } else {
          setActiveModalEmail(emailLower);
          if (data.token) {
            setContinuationToken(data.token);
          }
          setCheckEmailOpen(true);
        }
      } else {
        setErrorA(data.error || 'Failed to start subscription. Please try again.');
      }
    } catch (err: any) {
      console.error('Subscribe API error:', err);
      setErrorA(err.message || 'Network error starting subscription.');
    } finally {
      setSubmittingA(false);
    }
  };

  // Step 2: Complete Subscription (Hero form)
  const handleHeroCompleteSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstNameA.trim() || !surnameA.trim()) {
      setErrorA('Please enter your First Name and Surname.');
      return;
    }
    if (!occupationA) {
      setErrorA('Please select your Occupation.');
      return;
    }
    if (!stateA) {
      setErrorA('Please select your State of residence.');
      return;
    }
    if (stateA === 'Others' && !customStateA.trim()) {
      setErrorA('Please specify your state of residence or country.');
      return;
    }
    if (!consentA) {
      setErrorA('You must accept the terms to complete subscription.');
      return;
    }

    setSubmittingA(true);
    setErrorA('');

    try {
      const res = await fetch('/api/complete-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: continuationToken,
          firstName: firstNameA.trim(),
          surname: surnameA.trim(),
          occupation: occupationA,
          stateOfOrigin: stateA === 'Others' ? customStateA.trim() : stateA,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmittedA(true);
        setCompletionMessageA(data.message || 'Your subscription has been completed successfully. A confirmation email has been sent to you.');
      } else {
        setErrorA(data.error || 'Failed to complete subscription. Please try again.');
      }
    } catch (err: any) {
      console.error('Complete Subscription API error:', err);
      setErrorA(err.message || 'Network error completing subscription.');
    } finally {
      setSubmittingA(false);
    }
  };

  // Step 1: Start Subscription (Footer form)
  const handleFooterStartSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = emailB.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setErrorB('Please enter a valid email address.');
      return;
    }

    setSubmittingB(true);
    setErrorB('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.status === 'already_subscribed') {
          setErrorB(data.message || 'This email address is already subscribed.');
        } else {
          setActiveModalEmail(emailLower);
          if (data.token) {
            setContinuationToken(data.token);
          }
          setCheckEmailOpen(true);
        }
      } else {
        setErrorB(data.error || 'Failed to start subscription. Please try again.');
      }
    } catch (err: any) {
      console.error('Subscribe API error:', err);
      setErrorB(err.message || 'Network error starting subscription.');
    } finally {
      setSubmittingB(false);
    }
  };

  // Step 2: Complete Subscription (Footer form)
  const handleFooterCompleteSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstNameB.trim() || !surnameB.trim()) {
      setErrorB('Please enter your First Name and Surname.');
      return;
    }
    if (!occupationB) {
      setErrorB('Please select your Occupation.');
      return;
    }
    if (!stateB) {
      setErrorB('Please select your State of residence.');
      return;
    }
    if (stateB === 'Others' && !customStateB.trim()) {
      setErrorB('Please specify your state of residence or country.');
      return;
    }
    if (!consentB) {
      setErrorB('You must accept the terms to complete subscription.');
      return;
    }

    setSubmittingB(true);
    setErrorB('');

    try {
      const res = await fetch('/api/complete-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: continuationToken,
          firstName: firstNameB.trim(),
          surname: surnameB.trim(),
          occupation: occupationB,
          stateOfOrigin: stateB === 'Others' ? customStateB.trim() : stateB,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmittedB(true);
        setCompletionMessageB(data.message || 'Your subscription has been completed successfully. A confirmation email has been sent to you.');
      } else {
        setErrorB(data.error || 'Failed to complete subscription. Please try again.');
      }
    } catch (err: any) {
      console.error('Complete Subscription API error:', err);
      setErrorB(err.message || 'Network error completing subscription.');
    } finally {
      setSubmittingB(false);
    }
  };

  return (
    <div className="w-full bg-white font-sans text-[#17181a] antialiased">
      <SEO 
        title="Subscribe to ClearPath Daily" 
        description="Subscribe to ClearPath Daily, a concise weekday intelligence briefing on Nigeria's politics, economy, governance and public policy." 
      />

      {/* Check Email Modal */}
      <CheckEmailModal 
        isOpen={checkEmailOpen}
        onClose={() => setCheckEmailOpen(false)}
        email={activeModalEmail}
        continuationToken={continuationToken}
      />

      <main className="w-full">
        {/* HERO SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-[#faf9f5] to-white" id="subscribe">
          <div className="max-w-[1080px] mx-auto px-4">

            {/* Token Validation Feedback */}
            {tokenValidating && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-[#001e40] rounded-xl flex items-center gap-3 text-sm font-semibold max-w-xl mx-auto">
                <Loader2 className="w-5 h-5 text-[#001e40] animate-spin shrink-0" />
                <span>Verifying your subscription continuation link...</span>
              </div>
            )}

            {tokenError && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center gap-3 text-sm font-semibold max-w-xl mx-auto">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{tokenError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
              
              {/* Left Column */}
              <div className="md:col-span-7 text-left">
                <div className="flex items-center gap-2.5 mb-5 text-[#666b73] font-semibold text-xs tracking-[0.14em] uppercase">
                  <span>ClearPath Daily</span>
                  <span className="w-[26px] h-[1px] bg-[#17181a]"></span>
                </div>
                <h1 className="text-[#17181a] font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.12] tracking-tight">
                  Start every morning with clarity.
                </h1>
                <p className="max-w-[580px] mt-6 text-[#666b73] text-base sm:text-lg leading-relaxed">
                  Stay ahead with <strong className="text-[#17181a] font-semibold">ClearPath Daily</strong> — a concise weekday briefing on Nigeria's politics, economy, governance and public policy, delivered before the noise begins.
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 mt-8 text-[#001e40] font-semibold text-xs sm:text-sm tracking-wide">
                  <span className="flex items-center gap-1.5 text-[#001e40]"><Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> One email</span>
                  <span className="flex items-center gap-1.5 text-[#001e40]"><Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> Five minutes</span>
                  <span className="flex items-center gap-1.5 text-[#001e40]"><Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> Every weekday</span>
                </div>
              </div>

              {/* Right Column: Hero Form Card */}
              <div className="md:col-span-5 w-full max-w-[440px] md:max-w-none mx-auto" id="hero-subscribe-card">
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 sm:p-9 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.08)]">
                  {submittedA ? (
                    <div className="py-6 text-center flex flex-col items-center gap-4 animate-fade-in">
                      <CheckCircle2 className="w-12 h-12 text-[#10b981] stroke-[1.5]" />
                      <h2 className="text-[#17181a] font-serif text-xl sm:text-2xl font-normal">Subscription Completed</h2>
                      <p className="text-[#666b73] text-sm sm:text-base leading-relaxed">
                        {completionMessageA || 'Your subscription has been completed successfully. A confirmation email has been sent to you.'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Step 1: Enter Email */}
                      {stepA === 1 && (
                        <form onSubmit={handleHeroStartSubscription} noValidate className="animate-fade-in text-left">
                          <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
                            <h2 className="text-[#001e40] text-xl sm:text-2xl font-bold font-sans">Subscribe free</h2>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase whitespace-nowrap">Step 1 of 2</span>
                          </div>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                            Get verified facts, useful context and clear analysis directly in your inbox.
                          </p>

                          <div className="mb-6">
                            <label htmlFor="hero-email" className="block mb-2 text-[#001e40] text-xs sm:text-sm font-bold tracking-wide">Email address</label>
                            <input
                              id="hero-email"
                              type="email"
                              placeholder="you@example.com"
                              value={emailA}
                              onChange={(e) => setEmailA(e.target.value)}
                              className="w-full px-4 py-3 sm:py-3.5 border border-slate-300 rounded-xl text-slate-800 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001e40]/10 focus:border-[#001e40] transition-all bg-white font-sans"
                              required
                            />
                            {errorA && <p className="text-xs text-red-600 font-semibold mt-2">{errorA}</p>}
                          </div>

                          <button
                            type="submit"
                            disabled={submittingA}
                            className="w-full min-h-[48px] py-3.5 flex items-center justify-center bg-[#001e40] hover:bg-[#00142b] text-white text-sm font-bold rounded-2xl cursor-pointer transition-all duration-150 shadow-md shadow-[#001e40]/5 hover:shadow-lg hover:shadow-[#001e40]/10 disabled:opacity-50"
                          >
                            {submittingA ? 'Sending Email...' : 'Subscribe'}
                          </button>
                          <p className="mt-4 text-center text-slate-400 text-[11px] sm:text-xs font-medium">
                            Free to join. Unsubscribe at any time.
                          </p>
                        </form>
                      )}

                      {/* Step 2: Subscriber Information */}
                      {stepA === 2 && (
                        <form onSubmit={handleHeroCompleteSubscription} noValidate className="animate-fade-in text-left">
                          <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
                            <h2 className="text-[#001e40] text-xl sm:text-2xl font-bold font-sans">Subscriber Details</h2>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase whitespace-nowrap">Step 2 of 2</span>
                          </div>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                            Please complete your subscriber information to finish setting up your account.
                          </p>

                          {/* Email pre-filled and locked */}
                          <div className="mb-4">
                            <label className="block mb-1.5 text-[#001e40] text-xs font-bold tracking-wide">Connected Email</label>
                            <input
                              type="email"
                              value={emailA}
                              disabled
                              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium cursor-not-allowed"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label htmlFor="hero-first-name" className="block mb-2 text-[#001e40] text-xs sm:text-sm font-bold tracking-wide">First name *</label>
                              <input
                                id="hero-first-name"
                                type="text"
                                placeholder="First name"
                                value={firstNameA}
                                onChange={(e) => setFirstNameA(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001e40]/10 focus:border-[#001e40] transition-all bg-white font-sans"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="hero-surname" className="block mb-2 text-[#001e40] text-xs sm:text-sm font-bold tracking-wide">Surname *</label>
                              <input
                                id="hero-surname"
                                type="text"
                                placeholder="Surname"
                                value={surnameA}
                                onChange={(e) => setSurnameA(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001e40]/10 focus:border-[#001e40] transition-all bg-white font-sans"
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label htmlFor="hero-occupation" className="block mb-2 text-[#001e40] text-xs sm:text-sm font-bold tracking-wide">Occupation *</label>
                            <div className="relative">
                              <select
                                id="hero-occupation"
                                value={occupationA}
                                onChange={(e) => setOccupationA(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#001e40]/10 focus:border-[#001e40] transition-all appearance-none pr-10 cursor-pointer shadow-xs font-sans"
                                required
                              >
                                <option value="" disabled>Select occupation *</option>
                                {OCCUPATIONS.map((occ) => (
                                  <option key={occ} value={occ}>{occ}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          <div className="mb-6">
                            <label htmlFor="hero-state" className="block mb-2 text-[#001e40] text-xs sm:text-sm font-bold tracking-wide">State of residence *</label>
                            <div className="relative mb-3">
                              <select
                                id="hero-state"
                                value={stateA}
                                onChange={(e) => {
                                  setStateA(e.target.value);
                                  if (e.target.value !== 'Others') {
                                    setCustomStateA('');
                                  }
                                }}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#001e40]/10 focus:border-[#001e40] transition-all appearance-none pr-10 cursor-pointer shadow-xs font-sans"
                                required
                              >
                                <option value="" disabled>Select state *</option>
                                {STATES.map((st) => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {stateA === 'Others' && (
                              <div className="animate-fade-in">
                                <label htmlFor="hero-custom-state" className="block mb-2 text-[#001e40] text-xs sm:text-sm font-bold tracking-wide">Specify state of residence/country *</label>
                                <input
                                  id="hero-custom-state"
                                  type="text"
                                  placeholder="Enter your residence or country"
                                  value={customStateA}
                                  onChange={(e) => setCustomStateA(e.target.value)}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001e40]/10 focus:border-[#001e40] transition-all bg-white font-sans"
                                  required
                                />
                              </div>
                            )}
                          </div>

                          <label className="grid grid-cols-[16px_1fr] gap-3 items-start mt-1 mb-6 text-slate-500 text-xs leading-normal select-none cursor-pointer">
                            <input
                              type="checkbox"
                              checked={consentA}
                              onChange={(e) => setConsentA(e.target.checked)}
                              className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-[#001e40] cursor-pointer"
                              required
                            />
                            <span className="font-medium text-slate-600">
                              I agree to receive ClearPath Daily and accept the{' '}
                              <Link to="/privacy-policy" className="text-[#001e40] font-bold underline">Privacy Policy</Link>
                              {' '}and{' '}
                              <Link to="/terms-of-use" className="text-[#001e40] font-bold underline">Terms of Use</Link>.
                            </span>
                          </label>

                          {errorA && <p className="text-xs text-red-600 font-semibold mb-4">{errorA}</p>}

                          <button
                            type="submit"
                            disabled={submittingA}
                            className="w-full min-h-[48px] py-3.5 flex items-center justify-center bg-[#001e40] hover:bg-[#00142b] text-white text-sm font-bold rounded-2xl cursor-pointer transition-all duration-150 disabled:opacity-50 shadow-md shadow-[#001e40]/5 hover:shadow-lg"
                          >
                            {submittingA ? 'Completing Subscription...' : 'Complete Subscription'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-t border-b border-[#e3e3e3] py-5.5 bg-[#ffffff]" aria-label="ClearPath Daily benefits">
          <div className="max-w-[1080px] mx-auto px-4 flex flex-col md:flex-row justify-center items-stretch text-center text-[#666b73] text-xs sm:text-sm gap-y-3 md:gap-y-0">
            <div className="px-5 py-1.5 md:py-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#e3e3e3] last:border-0 flex-1">
              <span><strong className="text-[#17181a] font-semibold">Verified information</strong> — checked before it reaches your inbox</span>
            </div>
            <div className="px-5 py-1.5 md:py-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#e3e3e3] last:border-0 flex-1">
              <span><strong className="text-[#17181a] font-semibold">Clear context</strong> — understand why it matters</span>
            </div>
            <div className="px-5 py-1.5 md:py-0 flex items-center justify-center last:border-0 flex-1">
              <span><strong className="text-[#17181a] font-semibold">No partisan noise</strong> — independent analysis</span>
            </div>
          </div>
        </section>

        {/* WHY SUBSCRIBE SECTION */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1080px] mx-auto px-4">
            <div className="text-center max-w-[640px] mx-auto mb-12">
              <h2 className="text-[#17181a] font-serif text-2xl sm:text-3xl font-normal tracking-tight mb-4">
                Why decision-makers read ClearPath Daily
              </h2>
              <p className="text-[#666b73] text-sm sm:text-base leading-relaxed">
                We filter out the viral outrage to deliver rigorous policy analysis, institutional tracking, and economic insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-[#faf9f5] border border-slate-200/60 rounded-2xl p-6 sm:p-7">
                <div className="text-xs font-mono font-bold text-[#001e40] uppercase tracking-wider mb-3">01 / Rigour</div>
                <h3 className="text-[#17181a] font-serif text-lg font-bold mb-2">Policy Over Politics</h3>
                <p className="text-[#666b73] text-xs sm:text-sm leading-relaxed">
                  We focus on lawmaking, regulatory shifts, fiscal decisions and institutional reform rather than political theater.
                </p>
              </div>

              <div className="bg-[#faf9f5] border border-slate-200/60 rounded-2xl p-6 sm:p-7">
                <div className="text-xs font-mono font-bold text-[#001e40] uppercase tracking-wider mb-3">02 / Efficiency</div>
                <h3 className="text-[#17181a] font-serif text-lg font-bold mb-2">5-Minute Digest</h3>
                <p className="text-[#666b73] text-xs sm:text-sm leading-relaxed">
                  Structured specifically for busy executives, policymakers, and civic leaders who need high signal density quickly.
                </p>
              </div>

              <div className="bg-[#faf9f5] border border-slate-200/60 rounded-2xl p-6 sm:p-7">
                <div className="text-xs font-mono font-bold text-[#001e40] uppercase tracking-wider mb-3">03 / Independence</div>
                <h3 className="text-[#17181a] font-serif text-lg font-bold mb-2">Non-Partisan Analysis</h3>
                <p className="text-[#666b73] text-xs sm:text-sm leading-relaxed">
                  ClearPath Media is privately funded and editorially independent, committed strictly to constitutional facts and public interest.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="py-16 md:py-20 bg-[#faf9f5] border-t border-slate-200/60">
          <div className="max-w-[1080px] mx-auto px-4 text-center">
            <div className="max-w-[560px] mx-auto">
              <h2 className="text-[#17181a] font-serif text-2xl sm:text-3xl font-normal mb-4">
                Join thousands of informed readers today
              </h2>
              <p className="text-[#666b73] text-sm sm:text-base leading-relaxed mb-8">
                Subscribe free to receive tomorrow morning&apos;s briefing directly in your inbox.
              </p>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-left">
                {submittedB ? (
                  <div className="py-4 text-center flex flex-col items-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
                    <h3 className="text-lg font-serif text-[#17181a]">Subscription Completed</h3>
                    <p className="text-xs sm:text-sm text-[#666b73]">{completionMessageB}</p>
                  </div>
                ) : (
                  <div>
                    {stepB === 1 && (
                      <form onSubmit={handleFooterStartSubscription} noValidate className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-[#001e40] mb-2">Email address</label>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={emailB}
                            onChange={(e) => setEmailB(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]/10 focus:border-[#001e40] bg-white"
                            required
                          />
                          {errorB && <p className="text-xs text-red-600 font-semibold mt-1">{errorB}</p>}
                        </div>
                        <button
                          type="submit"
                          disabled={submittingB}
                          className="w-full py-3.5 bg-[#001e40] hover:bg-[#00142b] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {submittingB ? 'Sending Email...' : 'Subscribe'}
                        </button>
                      </form>
                    )}

                    {stepB === 2 && (
                      <form onSubmit={handleFooterCompleteSubscription} noValidate className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-[#001e40] mb-1">Connected Email</label>
                          <input
                            type="email"
                            value={emailB}
                            disabled
                            className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium cursor-not-allowed"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-[#001e40] mb-1">First name *</label>
                            <input
                              type="text"
                              value={firstNameB}
                              onChange={(e) => setFirstNameB(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#001e40] mb-1">Surname *</label>
                            <input
                              type="text"
                              value={surnameB}
                              onChange={(e) => setSurnameB(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#001e40] mb-1">Occupation *</label>
                          <select
                            value={occupationB}
                            onChange={(e) => setOccupationB(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                            required
                          >
                            <option value="" disabled>Select occupation *</option>
                            {OCCUPATIONS.map((occ) => (
                              <option key={occ} value={occ}>{occ}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#001e40] mb-1">State of residence *</label>
                          <select
                            value={stateB}
                            onChange={(e) => {
                              setStateB(e.target.value);
                              if (e.target.value !== 'Others') setCustomStateB('');
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                            required
                          >
                            <option value="" disabled>Select state *</option>
                            {STATES.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                        {stateB === 'Others' && (
                          <div className="animate-fade-in">
                            <label className="block text-xs font-bold text-[#001e40] mb-1">Specify state of residence/country *</label>
                            <input
                              type="text"
                              placeholder="Enter your residence or country"
                              value={customStateB}
                              onChange={(e) => setCustomStateB(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                              required
                            />
                          </div>
                        )}

                        <label className="grid grid-cols-[16px_1fr] gap-2.5 items-start my-3 text-slate-500 text-xs leading-normal select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consentB}
                            onChange={(e) => setConsentB(e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-[#001e40] cursor-pointer"
                            required
                          />
                          <span className="font-medium text-slate-600">
                            I agree to receive ClearPath Daily and accept the{' '}
                            <Link to="/privacy-policy" className="text-[#001e40] font-bold underline">Privacy Policy</Link>
                            {' '}and{' '}
                            <Link to="/terms-of-use" className="text-[#001e40] font-bold underline">Terms of Use</Link>.
                          </span>
                        </label>

                        {errorB && <p className="text-xs text-red-600 font-semibold">{errorB}</p>}

                        <button
                          type="submit"
                          disabled={submittingB}
                          className="w-full py-3.5 bg-[#001e40] hover:bg-[#00142b] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {submittingB ? 'Completing...' : 'Complete Subscription'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
