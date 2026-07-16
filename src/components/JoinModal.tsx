import { X, Youtube, Podcast, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { adjustNameFormatting } from '../utils/formatters';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  // Newsletter Subscribe Form States
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSubmitting, setNewsSubmitting] = useState(false);
  const [newsSubmitted, setNewsSubmitted] = useState(false);
  const [newsError, setNewsError] = useState('');

  // Dynamic program checklists
  const [activeProgrammes, setActiveProgrammes] = useState<string[]>([]);
  const [checkedBriefings, setCheckedBriefings] = useState<{ [key: string]: boolean }>({});

  // Contact/Reach Out Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Restores / Resets state variables when open/closes
  useEffect(() => {
    if (!isOpen) {
      setNewsEmail('');
      setNewsSubmitted(false);
      setNewsError('');
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setContactSuccess(false);
      setContactError('');
    }
  }, [isOpen]);

  // Load active programmes dynamically
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const progSnap = await getDocs(collection(db, 'programmes'));
        const rawProgs = progSnap.docs
          .map(d => d.data() as any)
          .filter(p => p.status === 'active')
          .map(p => adjustNameFormatting(p.title || '').trim())
          .filter(Boolean);
        
        const activeProgs = Array.from(new Set(rawProgs));
        
        const finalProgs = activeProgs.length > 0 ? activeProgs : [
          'OsitaInsight', 'Daily Brief with Annabel', 'ClearPath Insights', 
          'Nigeria & Neighbours', 'Election Matters', 'Mekaria Series'
        ];

        const deduplicatedProgs = Array.from(new Set(finalProgs));

        setActiveProgrammes(deduplicatedProgs);

        const initialChecked: { [key: string]: boolean } = {};
        deduplicatedProgs.forEach(title => {
          initialChecked[title] = title.includes('Osita') || title.includes('Annabel');
        });
        setCheckedBriefings(initialChecked);
      } catch (err) {
        console.error('Error fetching programmes for subscribe list:', err);
        const fallbacks = [
          'OsitaInsight', 'Daily Brief with Annabel', 'ClearPath Insights', 
          'Nigeria & Neighbours', 'Election Matters', 'Mekaria Series'
        ];
        setActiveProgrammes(fallbacks);
        const initialChecked: { [key: string]: boolean } = {};
        fallbacks.forEach(title => {
          initialChecked[title] = title.includes('Osita') || title.includes('Annabel');
        });
        setCheckedBriefings(initialChecked);
      }
    };
    if (isOpen) {
      fetchProgrammes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (title: string, checked: boolean) => {
    setCheckedBriefings(prev => ({
      ...prev,
      [title]: checked
    }));
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = newsEmail.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setNewsError('Please enter a valid email address.');
      return;
    }

    setNewsSubmitting(true);
    setNewsError('');
    
    // Gather array of checked program names
    const selectedBriefings = Object.keys(checkedBriefings).filter(key => checkedBriefings[key]);

    try {
      // Prevent duplicate active subscribers
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
        // Log gently and proceed directly with document creation if read fails (unauthenticated fallback)
        console.log('Pre-subscribe verification bypassed due to lack of public read credentials.');
      }

      await addDoc(collection(db, 'newsletterSubscribers'), {
        email: emailLower,
        selectedBriefings,
        status: 'active',
        source: 'subscribe_modal',
        privacyConsent: true,
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
        source: 'subscribe_modal_reach_out',
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile bg-black/40 backdrop-blur-[2px]">
      <div className="bg-surface-bright w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative border border-outline-variant rounded-lg flex flex-col md:flex-row">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-2 z-10" aria-label="Close modal">
          <X className="w-6 h-6" />
        </button>

        <div className="hidden md:block md:w-5/12 relative min-h-full">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu1ibmzeT82oErQmuUL6wzv978s4_8eD86E9f-PYdnFDB5hvEyhvBEtop36_H8CGLZcho2ttARJdkmZAkGpMp1NOdXbE595Avigovk3g13pYQSSRkA0H0R83xmPszxXdh_T4l-0OM4lFCv6eVn_Y__yAyENruNaLzS6XadM2O2VvuyAKnj-5ElGzsEzcROJL3--RsQW3aJVcukm7ODqXEpR67iDCHufAK7493qfM-0mGq2KrK_yn8_nb9Zzyz24zBRdDFX7nMd3Ag" 
            alt="Workspace img" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-primary/20"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="text-headline-md font-headline-md mb-2">Authority in every word.</div>
            <div className="text-body-md font-body-md opacity-90">Deep dives into the mechanics of power and the nuances of African policy.</div>
          </div>
        </div>

        <div className="w-full md:w-7/12 p-unit-lg md:p-unit-xl flex flex-col justify-center animate-fade-in">
          <div className="mb-unit-lg">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-sm">Join the Conversation</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Get clear, authoritative analysis delivered to your inbox. No fluff, just the policy and power dynamics that matter.
            </p>
          </div>

          <section>
            <h3 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-unit-md">Weekly Newsletter</h3>
            {newsSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-sm flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>You have successfully subscribed! Thank you for joining our briefings.</span>
              </div>
            ) : (
              <>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-unit-sm">
                  <input 
                    type="email" 
                    required
                    placeholder="Email address" 
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    className="flex-grow px-unit-md py-3 bg-surface-container-low border border-outline-variant focus:border-primary-container focus:ring-0 text-body-md transition-all outline-none" 
                  />
                  <button 
                    type="submit" 
                    disabled={newsSubmitting}
                    className="bg-primary-container text-white px-unit-lg py-3 font-label-md text-label-md hover:bg-primary transition-all duration-150 uppercase tracking-wide disabled:opacity-50 min-w-[120px] flex items-center justify-center cursor-pointer"
                  >
                    {newsSubmitting ? '...' : 'Subscribe'}
                  </button>
                </form>
                {newsError && (
                  <p className="text-xs text-error mt-1 font-semibold">{newsError}</p>
                )}
              </>
            )}
            
            <div className="mt-unit-md space-y-unit-sm">
              <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-unit-xs">Choose your briefings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-unit-sm gap-x-gutter">
                {activeProgrammes.map(briefing => (
                  <label key={briefing} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={!!checkedBriefings[briefing]} 
                      onChange={(e) => handleCheckboxChange(briefing, e.target.checked)}
                      className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-0 cursor-pointer" 
                    />
                    <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">{briefing}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <div className="flex items-center gap-unit-md my-unit-md">
            <div className="h-[1px] flex-grow bg-outline-variant"></div>
            <span className="font-label-sm text-label-sm text-outline uppercase font-mono tracking-wider">or reach out</span>
            <div className="h-[1px] flex-grow bg-outline-variant"></div>
          </div>

          <section>
            {contactSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-sm flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Message sent successfully! We will be in touch shortly.</span>
              </div>
            ) : (
              <>
                <form onSubmit={handleContactSubmit} className="space-y-unit-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-unit-md">
                    <div className="space-y-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-unit-md py-2 bg-transparent border-b border-outline focus:border-primary transition-colors outline-none text-body-md" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">Email *</label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-unit-md py-2 bg-transparent border-b border-outline focus:border-primary transition-colors outline-none text-body-md" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Message *</label>
                    <textarea 
                      rows={2} 
                      required
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full px-unit-md py-2 bg-transparent border-b border-outline focus:border-primary transition-colors outline-none text-body-md resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={contactSubmitting}
                    className="w-full border border-primary text-primary py-3 font-label-md text-label-md hover:bg-primary hover:text-white transition-all duration-150 uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {contactSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
                {contactError && (
                  <p className="text-xs text-error mt-1 font-semibold">{contactError}</p>
                )}
              </>
            )}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-unit-sm mt-6 pt-4 border-t border-outline-variant text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
            <div className="flex items-center gap-4">
              <a href="https://www.youtube.com/@ClearPathMediaTV" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Youtube className="w-4 h-4 text-[#ff0000]" /> 
                <span className="underline decoration-primary/30 hover:decoration-primary">YouTube</span>
              </a>
              <a href="https://www.youtube.com/@ClearPathMediaTV" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Podcast className="w-4 h-4 text-purple-600" /> 
                <span className="underline decoration-primary/30 hover:decoration-primary">Podcasts</span>
              </a>
              <a href="https://x.com/ClearPathMediaTV" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <svg className="w-4 h-4 text-slate-800 dark:text-slate-100 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="underline decoration-primary/30 hover:decoration-primary">X</span>
              </a>
            </div>
            <div className="text-outline font-bold text-[10px] tracking-widest">
              CLEARPATH EDITORIAL GROUP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
