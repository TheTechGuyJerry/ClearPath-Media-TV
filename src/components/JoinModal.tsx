import { X, Youtube, Podcast, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import CheckEmailModal from './CheckEmailModal';

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
  const [checkEmailModalOpen, setCheckEmailModalOpen] = useState(false);
  const [modalContinuationToken, setModalContinuationToken] = useState('');

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

  if (!isOpen) return null;

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = newsEmail.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setNewsError('Please enter a valid email address.');
      return;
    }

    setNewsSubmitting(true);
    setNewsError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.status === 'already_subscribed') {
          setNewsError(data.message || 'This email address is already subscribed.');
        } else {
          setModalContinuationToken(data.token || '');
          setCheckEmailModalOpen(true);
          setNewsSubmitted(true);
        }
      } else {
        setNewsError(data.error || 'Subscription failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Error starting subscription:', err);
      setNewsError(err.message || 'Subscription failed. Please try again.');
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
    <>
      <CheckEmailModal
        isOpen={checkEmailModalOpen}
        onClose={() => {
          setCheckEmailModalOpen(false);
          onClose();
        }}
        email={newsEmail}
        continuationToken={modalContinuationToken}
      />

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
              <h3 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-unit-md">ClearPath Daily Newsletter</h3>
              {newsSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>We have sent you an email to continue your subscription. Please check your Inbox.</span>
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
                      className="flex-grow px-unit-md py-3 bg-surface-container-low border border-outline-variant focus:border-primary-container focus:ring-0 text-body-md transition-all outline-none rounded-md" 
                    />
                    <button 
                      type="submit" 
                      disabled={newsSubmitting}
                      className="bg-primary-container text-white px-unit-lg py-3 font-label-md text-label-md hover:bg-primary transition-all duration-150 uppercase tracking-wide disabled:opacity-50 min-w-[120px] flex items-center justify-center cursor-pointer rounded-md"
                    >
                      {newsSubmitting ? '...' : 'Subscribe'}
                    </button>
                  </form>
                  {newsError && (
                    <p className="text-xs text-error mt-2 font-semibold">{newsError}</p>
                  )}
                </>
              )}
            </section>

            <hr className="my-unit-lg border-outline-variant" />

            <section>
              <h3 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-unit-sm">Watch & Listen</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-unit-md">
                Follow our multimedia channels for interview series, roundtables, and audio briefings.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-unit-md">
                <a 
                  href="https://www.youtube.com/@ClearPathMediaTV" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-unit-sm py-3 px-unit-md bg-surface-container-low border border-outline-variant hover:border-error transition-colors font-label-md text-label-md text-on-surface cursor-pointer rounded-md"
                >
                  <Youtube className="w-5 h-5 text-error" />
                  <span>ClearPath TV</span>
                </a>
                
                <a 
                  href="https://www.youtube.com/@ClearPathMediaTV" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-unit-sm py-3 px-unit-md bg-surface-container-low border border-outline-variant hover:border-primary transition-colors font-label-md text-label-md text-on-surface cursor-pointer rounded-md"
                >
                  <Podcast className="w-5 h-5 text-primary" />
                  <span>Podcasts</span>
                </a>
              </div>
            </section>

            <hr className="my-unit-lg border-outline-variant" />

            <section>
              <h3 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-unit-sm">Reach Out</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-unit-md">
                Have a tip, policy inquiry, or interest in partnering? Send us a message directly.
              </p>

              {contactSuccess ? (
                <div className="bg-surface-container-low border border-outline-variant text-primary p-4 rounded-lg flex items-center gap-3 text-body-md">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Thank you for reaching out! We have received your message.</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-unit-sm">
                  <div className="flex flex-col sm:flex-row gap-unit-sm">
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="flex-1 px-unit-md py-2.5 bg-surface-container-low border border-outline-variant focus:border-primary-container focus:ring-0 text-body-md transition-all outline-none rounded-md" 
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="Your Email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="flex-1 px-unit-md py-2.5 bg-surface-container-low border border-outline-variant focus:border-primary-container focus:ring-0 text-body-md transition-all outline-none rounded-md" 
                    />
                  </div>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Your message or inquiry..." 
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full px-unit-md py-2.5 bg-surface-container-low border border-outline-variant focus:border-primary-container focus:ring-0 text-body-md transition-all outline-none resize-none rounded-md" 
                  />
                  {contactError && (
                    <p className="text-xs text-error font-semibold">{contactError}</p>
                  )}
                  <button 
                    type="submit" 
                    disabled={contactSubmitting}
                    className="self-end bg-primary text-white px-unit-lg py-2.5 font-label-md text-label-md hover:bg-primary/90 transition-all duration-150 uppercase tracking-wide disabled:opacity-50 cursor-pointer rounded-md"
                  >
                    {contactSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
