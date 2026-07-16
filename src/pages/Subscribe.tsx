import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronDown, Mail, Check } from 'lucide-react';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import SEO from '../components/SEO';

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
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Federal Capital Territory (Abuja)', 'Others'
];

export default function Subscribe() {
  // Hero Form States
  const [emailA, setEmailA] = useState('');
  const [firstNameA, setFirstNameA] = useState('');
  const [surnameA, setSurnameA] = useState('');
  const [occupationA, setOccupationA] = useState('');
  const [stateA, setStateA] = useState('');
  const [customStateA, setCustomStateA] = useState('');
  const [consentA, setConsentA] = useState(true);
  const [stepA, setStepA] = useState(1);
  const [submittingA, setSubmittingA] = useState(false);
  const [submittedA, setSubmittedA] = useState(false);
  const [errorA, setErrorA] = useState('');

  // Final CTA Form States
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
  const [errorB, setErrorB] = useState('');

  // Scroll helper
  const scrollToTopForm = () => {
    const element = document.getElementById('hero-subscribe-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Submit Handler Generator
  const handleSubscribe = async (
    email: string,
    firstName: string,
    surname: string,
    occupation: string,
    stateOfOrigin: string,
    consent: boolean,
    setSubmitting: (val: boolean) => void,
    setSubmitted: (val: boolean) => void,
    setError: (val: string) => void
  ) => {
    const emailLower = email.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Consent is mandatory and always forced to true
    setSubmitting(true);
    setError('');

    try {
      // Check for existing subscriber safely
      try {
        const duplicateQuery = query(
          collection(db, 'newsletterSubscribers'),
          where('email', '==', emailLower),
          where('status', '==', 'active')
        );
        const dupSnap = await getDocs(duplicateQuery);
        if (!dupSnap.empty) {
          setSubmitted(true);
          return;
        }
      } catch (checkErr) {
        console.warn('Pre-subscribe duplicate check bypassed:', checkErr);
      }

      // Create new subscription record
      await addDoc(collection(db, 'newsletterSubscribers'), {
        email: emailLower,
        firstName: firstName.trim(),
        lastName: surname.trim(),
        fullName: `${firstName.trim()} ${surname.trim()}`.trim(),
        occupation: occupation || 'Not Specified',
        stateOfOrigin: stateOfOrigin || 'Not Specified',
        selectedBriefings: ['Daily Brief with Annabel', 'Election Matters', 'OsitaInsight'],
        status: 'active',
        source: 'subscribe_page_v2',
        privacyConsent: true,
        subscribedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Subscription Firestore Error:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'newsletterSubscribers');
      } catch (fmtErr) {
        setError(fmtErr instanceof Error ? fmtErr.message : String(fmtErr));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubscribe(
      emailA,
      firstNameA,
      surnameA,
      occupationA,
      stateA === 'Others' ? customStateA : stateA,
      consentA,
      setSubmittingA,
      setSubmittedA,
      setErrorA
    );
  };

  const handleFooterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubscribe(
      emailB,
      firstNameB,
      surnameB,
      occupationB,
      stateB === 'Others' ? customStateB : stateB,
      consentB,
      setSubmittingB,
      setSubmittedB,
      setErrorB
    );
  };

  // Step 1 Validation Helper
  const handleHeroContinue = () => {
    const emailLower = emailA.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setErrorA('Please enter a valid email address.');
      return;
    }
    setErrorA('');
    setStepA(2);
  };

  const handleFooterContinue = () => {
    const emailLower = emailB.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setErrorB('Please enter a valid email address.');
      return;
    }
    setErrorB('');
    setStepB(2);
  };

  return (
    <div className="w-full bg-white font-sans text-[#17181a] antialiased">
      <SEO 
        title="Subscribe to ClearPath Daily" 
        description="Subscribe to ClearPath Daily, a concise weekday intelligence briefing on Nigeria's politics, economy, governance and public policy." 
      />

      <main className="w-full">
        {/* HERO SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-[#faf9f5] to-white" id="subscribe">
          <div className="max-w-[1080px] mx-auto px-4">
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
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 mt-8 text-blue-600 font-semibold text-xs sm:text-sm tracking-wide">
                  <span className="flex items-center gap-1.5 text-blue-600"><Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> One email</span>
                  <span className="flex items-center gap-1.5 text-blue-600"><Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> Five minutes</span>
                  <span className="flex items-center gap-1.5 text-blue-600"><Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> Every weekday</span>
                </div>
              </div>

              {/* Right Column: Hero Form */}
              <div className="md:col-span-5 w-full max-w-[440px] md:max-w-none mx-auto" id="hero-subscribe-card">
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 sm:p-9 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.08)]">
                  {submittedA ? (
                    <div className="py-6 text-center flex flex-col items-center gap-4 animate-fade-in">
                      <CheckCircle2 className="w-12 h-12 text-[#17181a] stroke-[1.5]" />
                      <h2 className="text-[#17181a] font-serif text-xl sm:text-2xl font-normal">Subscription Confirmed</h2>
                      <p className="text-[#666b73] text-sm sm:text-base leading-relaxed">
                        Thank you for subscribing to ClearPath Daily. Your weekday morning briefings will begin shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleHeroSubmit} noValidate>
                      {/* Step 1 */}
                      {stepA === 1 && (
                        <div className="animate-fade-in text-left">
                          <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
                            <h2 className="text-blue-600 text-xl sm:text-2xl font-bold font-sans">Subscribe free</h2>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase whitespace-nowrap">Step 1 of 2</span>
                          </div>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                            Get verified facts, useful context and clear analysis directly in your inbox.
                          </p>

                          <div className="mb-6">
                            <label htmlFor="hero-email" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">Email address</label>
                            <input
                              id="hero-email"
                              type="email"
                              placeholder="you@example.com"
                              value={emailA}
                              onChange={(e) => setEmailA(e.target.value)}
                              className="w-full px-4 py-3 sm:py-3.5 border border-slate-300 rounded-xl text-slate-800 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all bg-white font-sans"
                              required
                            />
                            {errorA && <p className="text-xs text-red-600 font-semibold mt-2">{errorA}</p>}
                          </div>

                          <button
                            type="button"
                            onClick={handleHeroContinue}
                            className="w-full min-h-[48px] py-3.5 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl cursor-pointer transition-all duration-150 shadow-md shadow-blue-600/5 hover:shadow-lg hover:shadow-blue-600/10"
                          >
                            Continue
                          </button>
                          <p className="mt-4 text-center text-slate-400 text-[11px] sm:text-xs font-medium">
                            Free to join. Unsubscribe at any time.
                          </p>
                        </div>
                      )}

                      {/* Step 2 */}
                      {stepA === 2 && (
                        <div className="animate-fade-in text-left">
                          <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
                            <h2 className="text-blue-600 text-xl sm:text-2xl font-bold font-sans">Almost there</h2>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase whitespace-nowrap">Step 2 of 2</span>
                          </div>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                            A little about you helps us tailor ClearPath Daily to your interests.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label htmlFor="hero-first-name" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">First name</label>
                              <input
                                id="hero-first-name"
                                type="text"
                                placeholder="First name"
                                value={firstNameA}
                                onChange={(e) => setFirstNameA(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all bg-white font-sans"
                              />
                            </div>
                            <div>
                              <label htmlFor="hero-surname" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">Surname</label>
                              <input
                                id="hero-surname"
                                type="text"
                                placeholder="Surname"
                                value={surnameA}
                                onChange={(e) => setSurnameA(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all bg-white font-sans"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label htmlFor="hero-occupation" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">Occupation</label>
                            <div className="relative">
                              <select
                                id="hero-occupation"
                                value={occupationA}
                                onChange={(e) => setOccupationA(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all appearance-none pr-10 cursor-pointer shadow-xs font-sans"
                              >
                                <option value="" disabled>Select occupation</option>
                                {OCCUPATIONS.map((occ) => (
                                  <option key={occ} value={occ}>{occ}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          <div className="mb-6">
                            <label htmlFor="hero-state" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">State of residence</label>
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all appearance-none pr-10 cursor-pointer shadow-xs font-sans"
                              >
                                <option value="" disabled>Select state</option>
                                {STATES.map((st) => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {stateA === 'Others' && (
                              <div className="animate-fade-in">
                                <label htmlFor="hero-custom-state" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">Specify state of residence/country</label>
                                <input
                                  id="hero-custom-state"
                                  type="text"
                                  placeholder="Enter your residence or country"
                                  value={customStateA}
                                  onChange={(e) => setCustomStateA(e.target.value)}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all bg-white font-sans"
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
                              className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-blue-600 cursor-pointer"
                              required
                            />
                            <span className="font-medium text-slate-600">
                              I agree to receive ClearPath Daily and accept the{' '}
                              <Link to="/privacy-policy" className="text-blue-600 font-bold underline">Privacy Policy</Link>
                              {' '}and{' '}
                              <Link to="/terms-of-use" className="text-blue-600 font-bold underline">Terms of Use</Link>.
                            </span>
                          </label>

                          {errorA && <p className="text-xs text-red-600 font-semibold mb-4">{errorA}</p>}

                          <button
                            type="submit"
                            disabled={submittingA}
                            className="w-full min-h-[48px] py-3.5 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl cursor-pointer transition-all duration-150 disabled:opacity-50 shadow-md shadow-blue-600/5 hover:shadow-lg"
                          >
                            {submittingA ? 'Submitting...' : 'Subscribe Free'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setStepA(1)}
                            className="inline-block mt-4 text-slate-400 text-xs hover:text-blue-600 bg-none border-none p-0 cursor-pointer transition-colors font-bold font-sans"
                          >
                            &larr; Back
                          </button>
                        </div>
                      )}
                    </form>
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
            <div className="max-w-[680px] mb-12 text-left">
              <div className="flex items-center gap-2.5 mb-4 text-[#666b73] font-semibold text-xs tracking-[0.14em] uppercase">
                <span>Why subscribe</span>
                <span className="w-[26px] h-[1px] bg-[#17181a]"></span>
              </div>
              <h2 className="text-[#17181a] font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.18]">
                Because information is abundant. Clarity is rare.
              </h2>
              <p className="mt-4 text-[#666b73] text-base sm:text-lg leading-relaxed">
                ClearPath Daily helps you understand the developments shaping Nigeria without spending your morning sorting through rumours, headlines and noise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-11 text-left">
              <article className="pt-5 border-t border-[#17181a] flex flex-col">
                <span className="block mb-4 text-[#8a8f96] font-serif text-sm">01</span>
                <h3 className="text-[#17181a] text-base sm:text-[1.02rem] font-bold mb-2">The stories that matter</h3>
                <p className="text-[#666b73] text-sm leading-relaxed">
                  A focused selection of the most consequential political, economic and governance developments of the day.
                </p>
              </article>

              <article className="pt-5 border-t border-[#17181a] flex flex-col">
                <span className="block mb-4 text-[#8a8f96] font-serif text-sm">02</span>
                <h3 className="text-[#17181a] text-base sm:text-[1.02rem] font-bold mb-2">Context beyond headlines</h3>
                <p className="text-[#666b73] text-sm leading-relaxed">
                  The background, institutional forces and policy choices behind the news.
                </p>
              </article>

              <article className="pt-5 border-t border-[#17181a] flex flex-col">
                <span className="block mb-4 text-[#8a8f96] font-serif text-sm">03</span>
                <h3 className="text-[#17181a] text-base sm:text-[1.02rem] font-bold mb-2">A smarter five-minute read</h3>
                <p className="text-[#666b73] text-sm leading-relaxed">
                  Concise enough for a busy morning, substantial enough to improve your judgment.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* INSIDE EACH EDITION SECTION */}
        <section className="py-16 md:py-20 bg-white border-t border-[#e3e3e3]">
          <div className="max-w-[1080px] mx-auto px-4 text-left">
            <div className="max-w-[680px] mb-12">
              <div className="flex items-center gap-2.5 mb-4 text-[#666b73] font-semibold text-xs tracking-[0.14em] uppercase">
                <span>Inside each edition</span>
                <span className="w-[26px] h-[1px] bg-[#17181a]"></span>
              </div>
              <h2 className="text-[#17181a] font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.18]">
                One briefing. The full ClearPath view.
              </h2>
              <p className="mt-4 text-[#666b73] text-base sm:text-lg leading-relaxed">
                Every weekday, ClearPath brings you a carefully curated blend of news, analysis, and storytelling. Expect the Daily Brief and Election Matters to keep you informed, OsitaInsight to provide deeper perspective, In Focus stories that unpack the issues shaping our world, and feature reports that explore the trends, policies, and people driving change across Nigeria, Africa, and beyond.
              </p>
            </div>

            {/* Segment: Regular */}
            <h3 className="mt-11 mb-5 pt-5 border-t border-[#e3e3e3] text-[#17181a] text-[0.76rem] font-bold tracking-[0.1em] uppercase">
              Regular segments
            </h3>
            <div className="border-t border-[#e3e3e3]">
              <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 md:gap-6 py-5 border-b border-[#e3e3e3]">
                <small className="block pt-0.5 text-[#8a8f96] font-semibold tracking-wider uppercase text-xs">Every day</small>
                <div>
                  <h3 className="text-[#17181a] text-base sm:text-[1.08rem] font-bold">Daily Brief with Annabel</h3>
                  <p className="mt-1 text-[#666b73] text-sm sm:text-[0.94rem] leading-relaxed">The essential developments before your day begins, in Annabel's voice.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 md:gap-6 py-5 border-b border-[#e3e3e3]">
                <small className="block pt-0.5 text-[#8a8f96] font-semibold tracking-wider uppercase text-xs">Every day</small>
                <div>
                  <h3 className="text-[#17181a] text-base sm:text-[1.08rem] font-bold">Election Matters</h3>
                  <p className="mt-1 text-[#666b73] text-sm sm:text-[0.94rem] leading-relaxed">Political parties, campaigns, institutions and democratic accountability.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 md:gap-6 py-5 border-b border-[#e3e3e3]">
                <small className="block pt-0.5 text-[#8a8f96] font-semibold tracking-wider uppercase text-xs">Tue &amp; Thu</small>
                <div>
                  <h3 className="text-[#17181a] text-base sm:text-[1.08rem] font-bold">OsitaInsight</h3>
                  <p className="mt-1 text-[#666b73] text-sm sm:text-[0.94rem] leading-relaxed">Calm explanation of the systems shaping everyday life, twice a week.</p>
                </div>
              </div>
            </div>

            {/* Segment: In Focus */}
            <h3 className="mt-12 mb-5 pt-5 border-t border-[#e3e3e3] text-[#17181a] text-[0.76rem] font-bold tracking-[0.1em] uppercase">
              In Focus — two stories, every day
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5">
              <article className="flex flex-col text-left">
                <h4 className="text-[#17181a] font-serif font-normal text-lg sm:text-[1.18rem] leading-[1.32] mb-2.5">Fuel subsidy reform: what changed and what didn't</h4>
                <p className="text-[#666b73] text-sm leading-relaxed mb-3">A plain explainer of the latest policy adjustment and its immediate effect on pump prices and logistics costs.</p>
                <p className="text-[#666b73] text-sm leading-relaxed mb-4">
                  <strong className="text-[#17181a] font-semibold">Why it matters:</strong> Signals where subsidy savings are being redirected, and what to watch before the next review.
                </p>
                <button onClick={scrollToTopForm} className="self-start text-[#17181a] font-bold text-xs sm:text-[0.88rem] border-b border-[#17181a] pb-0.5 hover:opacity-75 transition-opacity cursor-pointer bg-transparent border-none p-0">
                  Read more &rarr;
                </button>
              </article>

              <article className="flex flex-col text-left">
                <h4 className="text-[#17181a] font-serif font-normal text-lg sm:text-[1.18rem] leading-[1.32] mb-2.5">State governors and the 2027 succession math</h4>
                <p className="text-[#666b73] text-sm leading-relaxed mb-3">An early look at the alliances forming ahead of the next election cycle.</p>
                <p className="text-[#666b73] text-sm leading-relaxed mb-4">
                  <strong className="text-[#17181a] font-semibold">Why it matters:</strong> These alignments explain policy choices already being made today.
                </p>
                <button onClick={scrollToTopForm} className="self-start text-[#17181a] font-bold text-xs sm:text-[0.88rem] border-b border-[#17181a] pb-0.5 hover:opacity-75 transition-opacity cursor-pointer bg-transparent border-none p-0">
                  Read more &rarr;
                </button>
              </article>
            </div>

            {/* Segment: Daily Feature */}
            <h3 className="mt-12 mb-5 pt-5 border-t border-[#e3e3e3] text-[#17181a] text-[0.76rem] font-bold tracking-[0.1em] uppercase">
              Daily Feature — rotates Monday to Friday
            </h3>
            <div className="border-t border-[#e3e3e3]">
              <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 md:gap-6 py-5 border-b border-[#e3e3e3]">
                <small className="block pt-0.5 text-[#8a8f96] font-semibold tracking-wider uppercase text-xs">Mon</small>
                <div>
                  <h3 className="text-[#17181a] text-base sm:text-[1.08rem] font-semibold">
                    <button onClick={scrollToTopForm} className="text-left text-[#17181a] hover:opacity-70 transition-opacity underline decoration-[#17181a] underline-offset-[3px] bg-transparent border-none p-0 font-bold cursor-pointer">
                      West Africa Monitor
                    </button>
                  </h3>
                  <p className="mt-1 text-[#666b73] text-sm sm:text-[0.94rem] leading-relaxed">A teaser from our regional desk, tracking shifts across West Africa.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 md:gap-6 py-5 border-b border-[#e3e3e3]">
                <small className="block pt-0.5 text-[#8a8f96] font-semibold tracking-wider uppercase text-xs">Tue</small>
                <div>
                  <h3 className="text-[#17181a] text-base sm:text-[1.08rem] font-semibold">
                    <button onClick={scrollToTopForm} className="text-left text-[#17181a] hover:opacity-70 transition-opacity underline decoration-[#17181a] underline-offset-[3px] bg-transparent border-none p-0 font-bold cursor-pointer">
                      State in Focus
                    </button>
                  </h3>
                  <p className="mt-1 text-[#666b73] text-sm sm:text-[0.94rem] leading-relaxed">A rotating spotlight on one Nigerian state's governance and development story.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 md:gap-6 py-5 border-b border-[#e3e3e3]">
                <small className="block pt-0.5 text-[#8a8f96] font-semibold tracking-wider uppercase text-xs">Wed</small>
                <div>
                  <h3 className="text-[#17181a] text-base sm:text-[1.08rem] font-semibold">
                    <button onClick={scrollToTopForm} className="text-left text-[#17181a] hover:opacity-70 transition-opacity underline decoration-[#17181a] underline-offset-[3px] bg-transparent border-none p-0 font-bold cursor-pointer">
                      LGA Brief
                    </button>
                  </h3>
                  <p className="mt-1 text-[#666b73] text-sm sm:text-[0.94rem] leading-relaxed">Grassroots reporting from Nigeria's local government areas.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 md:gap-6 py-5 border-b border-[#e3e3e3]">
                <small className="block pt-0.5 text-[#8a8f96] font-semibold tracking-wider uppercase text-xs">Thu</small>
                <div>
                  <h3 className="text-[#17181a] text-base sm:text-[1.08rem] font-semibold">
                    <button onClick={scrollToTopForm} className="text-left text-[#17181a] hover:opacity-70 transition-opacity underline decoration-[#17181a] underline-offset-[3px] bg-transparent border-none p-0 font-bold cursor-pointer">
                      Governance Brief
                    </button>
                  </h3>
                  <p className="mt-1 text-[#666b73] text-sm sm:text-[0.94rem] leading-relaxed">Policy execution and public-sector accountability, tracked closely.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 md:gap-6 py-5 border-b border-[#e3e3e3]">
                <small className="block pt-0.5 text-[#8a8f96] font-semibold tracking-wider uppercase text-xs">Fri</small>
                <div>
                  <h3 className="text-[#17181a] text-base sm:text-[1.08rem] font-semibold">
                    <button onClick={scrollToTopForm} className="text-left text-[#17181a] hover:opacity-70 transition-opacity underline decoration-[#17181a] underline-offset-[3px] bg-transparent border-none p-0 font-bold cursor-pointer">
                      BCCN News
                    </button>
                  </h3>
                  <p className="mt-1 text-[#666b73] text-sm sm:text-[0.94rem] leading-relaxed">Athena Perspectives on Benin, Chad, Cameroon and Niger.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDITORIAL PROMISE SECTION */}
        <section className="py-16 bg-white border-t border-[#e3e3e3]">
          <div className="max-w-[1080px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12 items-start text-left">
              <div>
                <div className="flex items-center gap-2.5 mb-4 text-[#666b73] font-semibold text-xs tracking-[0.14em] uppercase">
                  <span>Our editorial promise</span>
                  <span className="w-[26px] h-[1px] bg-[#17181a]"></span>
                </div>
                <h2 className="text-[#17181a] font-serif text-2xl sm:text-3xl font-normal leading-[1.2]">
                  Information should illuminate, not inflame.
                </h2>
              </div>

              <div className="flex flex-col gap-5 text-left md:mt-2">
                <div className="pb-4 border-b border-[#e3e3e3] text-[#666b73] text-sm sm:text-[0.96rem] leading-relaxed">
                  <strong className="text-[#17181a] font-semibold block sm:inline mr-1">Facts before opinion.</strong>
                  We separate what is known from what is assumed.
                </div>
                <div className="pb-4 border-b border-[#e3e3e3] text-[#666b73] text-sm sm:text-[0.96rem] leading-relaxed">
                  <strong className="text-[#17181a] font-semibold block sm:inline mr-1">Context before conclusions.</strong>
                  We explain the forces beneath the headline.
                </div>
                <div className="pb-4 border-b border-[#e3e3e3] text-[#666b73] text-sm sm:text-[0.96rem] leading-relaxed">
                  <strong className="text-[#17181a] font-semibold block sm:inline mr-1">Evidence before ideology.</strong>
                  We follow the facts even when they are inconvenient.
                </div>
                <div className="text-[#666b73] text-sm sm:text-[0.96rem] leading-relaxed">
                  <strong className="text-[#17181a] font-semibold block sm:inline mr-1">Clarity before noise.</strong>
                  We value understanding over outrage and speed.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-16 md:py-24 border-t border-slate-100 bg-gradient-to-b from-white to-[#faf9f5]">
          <div className="max-w-[1080px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
              
              {/* Left Column */}
              <div className="md:col-span-7 text-left">
                <div className="flex items-center gap-2.5 mb-5 text-[#666b73] font-semibold text-xs tracking-[0.14em] uppercase">
                  <span>Join ClearPath Daily</span>
                  <span className="w-[26px] h-[1px] bg-[#17181a]"></span>
                </div>
                <h2 className="text-[#17181a] font-serif text-3xl sm:text-4xl font-normal leading-[1.15]">
                  Understand Nigeria before the day begins.
                </h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 mt-6 text-blue-600 font-semibold text-xs sm:text-sm tracking-wide">
                  <span className="flex items-center gap-1.5 text-blue-600"><Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> One email</span>
                  <span className="flex items-center gap-1.5 text-blue-600"><Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> Five minutes</span>
                  <span className="flex items-center gap-1.5 text-blue-600"><Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> Every weekday</span>
                </div>
              </div>

              {/* Right Column: Final CTA Form */}
              <div className="md:col-span-5 w-full max-w-[440px] md:max-w-none mx-auto">
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 sm:p-9 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.08)]">
                  {submittedB ? (
                    <div className="py-6 text-center flex flex-col items-center gap-4 animate-fade-in">
                      <CheckCircle2 className="w-12 h-12 text-[#17181a] stroke-[1.5]" />
                      <h2 className="text-[#17181a] font-serif text-xl sm:text-2xl font-normal">Subscription Confirmed</h2>
                      <p className="text-[#666b73] text-sm sm:text-base leading-relaxed">
                        Thank you for subscribing to ClearPath Daily. Your weekday morning briefings will begin shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleFooterSubmit} noValidate>
                      {/* Step 1 */}
                      {stepB === 1 && (
                        <div className="animate-fade-in text-left">
                          <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
                            <h2 className="text-blue-600 text-xl sm:text-2xl font-bold font-sans">Subscribe free</h2>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase whitespace-nowrap">Step 1 of 2</span>
                          </div>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                            Join readers who prefer verified information, context and clear analysis.
                          </p>

                          <div className="mb-6">
                            <label htmlFor="footer-email" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">Email address</label>
                            <input
                              id="footer-email"
                              type="email"
                              placeholder="you@example.com"
                              value={emailB}
                              onChange={(e) => setEmailB(e.target.value)}
                              className="w-full px-4 py-3 sm:py-3.5 border border-slate-300 rounded-xl text-slate-800 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all bg-white font-sans"
                              required
                            />
                            {errorB && <p className="text-xs text-red-600 font-semibold mt-2">{errorB}</p>}
                          </div>

                          <button
                            type="button"
                            onClick={handleFooterContinue}
                            className="w-full min-h-[48px] py-3.5 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl cursor-pointer transition-all duration-150 shadow-md shadow-blue-600/5 hover:shadow-lg hover:shadow-blue-600/10"
                          >
                            Continue
                          </button>
                          <p className="mt-4 text-center text-slate-400 text-[11px] sm:text-xs font-medium">
                            Free to join. Unsubscribe at any time.
                          </p>
                        </div>
                      )}

                      {/* Step 2 */}
                      {stepB === 2 && (
                        <div className="animate-fade-in text-left">
                          <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
                            <h2 className="text-blue-600 text-xl sm:text-2xl font-bold font-sans">Almost there</h2>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase whitespace-nowrap">Step 2 of 2</span>
                          </div>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                            A little about you helps us tailor ClearPath Daily to your interests.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label htmlFor="footer-first-name" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">First name</label>
                              <input
                                id="footer-first-name"
                                type="text"
                                placeholder="First name"
                                value={firstNameB}
                                onChange={(e) => setFirstNameB(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all bg-white font-sans"
                              />
                            </div>
                            <div>
                              <label htmlFor="footer-surname" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">Surname</label>
                              <input
                                id="footer-surname"
                                type="text"
                                placeholder="Surname"
                                value={surnameB}
                                onChange={(e) => setSurnameB(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all bg-white font-sans"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label htmlFor="footer-occupation" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">Occupation</label>
                            <div className="relative">
                              <select
                                id="footer-occupation"
                                value={occupationB}
                                onChange={(e) => setOccupationB(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all appearance-none pr-10 cursor-pointer shadow-xs font-sans"
                              >
                                <option value="" disabled>Select occupation</option>
                                {OCCUPATIONS.map((occ) => (
                                  <option key={occ} value={occ}>{occ}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          <div className="mb-6">
                            <label htmlFor="footer-state" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">State of residence</label>
                            <div className="relative mb-3">
                              <select
                                id="footer-state"
                                value={stateB}
                                onChange={(e) => {
                                  setStateB(e.target.value);
                                  if (e.target.value !== 'Others') {
                                    setCustomStateB('');
                                  }
                                }}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all appearance-none pr-10 cursor-pointer shadow-xs font-sans"
                              >
                                <option value="" disabled>Select state</option>
                                {STATES.map((st) => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {stateB === 'Others' && (
                              <div className="animate-fade-in">
                                <label htmlFor="footer-custom-state" className="block mb-2 text-blue-600 text-xs sm:text-sm font-bold tracking-wide">Specify state of residence/country</label>
                                <input
                                  id="footer-custom-state"
                                  type="text"
                                  placeholder="Enter your residence or country"
                                  value={customStateB}
                                  onChange={(e) => setCustomStateB(e.target.value)}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all bg-white font-sans"
                                  required
                                />
                              </div>
                            )}
                          </div>

                          <label className="grid grid-cols-[16px_1fr] gap-3 items-start mt-1 mb-6 text-slate-500 text-xs leading-normal select-none cursor-pointer">
                            <input
                              type="checkbox"
                              checked={consentB}
                              onChange={(e) => setConsentB(e.target.checked)}
                              className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-blue-600 cursor-pointer"
                              required
                            />
                            <span className="font-medium text-slate-600">
                              I agree to receive ClearPath Daily and accept the{' '}
                              <Link to="/privacy-policy" className="text-blue-600 font-bold underline">Privacy Policy</Link>
                              {' '}and{' '}
                              <Link to="/terms-of-use" className="text-blue-600 font-bold underline">Terms of Use</Link>.
                            </span>
                          </label>

                          {errorB && <p className="text-xs text-red-600 font-semibold mb-4">{errorB}</p>}

                          <button
                            type="submit"
                            disabled={submittingB}
                            className="w-full min-h-[48px] py-3.5 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl cursor-pointer transition-all duration-150 disabled:opacity-50 shadow-md shadow-blue-600/5 hover:shadow-lg"
                          >
                            {submittingB ? 'Submitting...' : 'Subscribe Free'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setStepB(1)}
                            className="inline-block mt-4 text-slate-400 text-xs hover:text-blue-600 bg-none border-none p-0 cursor-pointer transition-colors font-bold font-sans"
                          >
                            &larr; Back
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
