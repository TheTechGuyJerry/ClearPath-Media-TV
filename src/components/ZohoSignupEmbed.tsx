import React, { useState, useEffect } from 'react';
import { getDoc, doc, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ZohoSignupEmbed() {
  const [embedCode, setEmbedCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // 1. Check environment variable first
    const envEmbed = import.meta.env.VITE_ZOHO_ELECTION_SIGNUP_EMBED;
    if (envEmbed) {
      setEmbedCode(envEmbed);
      setLoading(false);
      return;
    }

    // 2. Fallback to Firestore siteSettings/primary
    async function fetchSettings() {
      try {
        const docRef = doc(db, 'siteSettings', 'primary');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.zohoElectionSignupEmbed) {
            setEmbedCode(data.zohoElectionSignupEmbed);
          }
        }
      } catch (err) {
        console.error('[ZohoSignupEmbed] Error loading embed settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Extra check for script element inside string to run scripts if needed
  useEffect(() => {
    if (!embedCode) return;
    // Inspect if we have scripts to run after element is mounted
    const wrapper = document.getElementById('zoho-embed-content-area');
    if (wrapper) {
      const scripts = wrapper.getElementsByTagName('script');
      Array.from(scripts).forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [embedCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = email.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setError('');

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
          setSubmitted(true);
          return;
        }
      } catch (checkErr) {
        console.info('Pre-subscribe verification bypassed due to lack of public read credentials.');
      }

      await addDoc(collection(db, 'newsletterSubscribers'), {
        email: emailLower,
        selectedBriefings: ['Election Matters'],
        status: 'active',
        source: 'election_matters_embedded_form',
        subscribedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving subscription:', err);
      setError(err instanceof Error ? err.message : 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
      <motion.div 
        className="bg-slate-900 border border-slate-800 text-white rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto font-sans shadow-lg relative overflow-hidden"
        initial={{ y: 150, scale: 0.85, opacity: 0 }}
        whileInView={{ y: 0, scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring",
          stiffness: 120,
          damping: 5,
          mass: 0.9,
          restDelta: 0.001
        }}
        whileHover={{ 
          y: -12,
          scale: 1.025,
          transition: { type: "spring", stiffness: 180, damping: 8, mass: 0.6 }
        }}
      >
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-4">
          <h3 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight leading-snug">
            Get ClearPath election intelligence in your inbox.
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Data-driven political risk, democratic analysis, and public governance insights sent straight to your email.
          </p>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"></div>
            </div>
          ) : embedCode ? (
            <div 
              id="zoho-embed-content-area"
              className="mt-6 text-left"
              dangerouslySetInnerHTML={{ __html: embedCode }}
            />
          ) : submitted ? (
            <div className="mt-6 border border-emerald-800/50 bg-emerald-950/25 rounded-lg p-8 max-w-md mx-auto flex flex-col items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
              <h4 className="text-md font-semibold text-white">Subscription Confirmed!</h4>
              <p className="text-xs text-slate-400 leading-relaxed text-center">
                You've successfully subscribed to the Election Matters newsletter briefing list.
              </p>
            </div>
          ) : (
            <div className="mt-6 w-full max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email Address Input Box with Floating Label */}
                <div className="relative text-left">
                  <input
                    type="email"
                    id="floating_email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitting}
                    placeholder=" "
                    className="block w-full px-4 pt-6 pb-2 bg-slate-950 border border-slate-800 text-white rounded text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-sans peer disabled:opacity-50"
                  />
                  <label
                    htmlFor="floating_email"
                    className="absolute text-xs text-slate-500 duration-300 transform -translate-y-3.5 scale-90 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-slate-500 peer-focus:scale-90 peer-focus:-translate-y-3.5 peer-focus:text-slate-300 pointer-events-none select-none font-sans"
                  >
                    Email address *
                  </label>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full py-4 bg-white text-slate-950 font-bold rounded text-xs hover:bg-slate-100 transition-colors uppercase tracking-wider font-sans flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                >
                  {submitting ? (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                  ) : (
                    'Subscribe to Election Matters'
                  )}
                </motion.button>
              </form>
              {error && (
                <p className="text-xs text-red-400 text-left mt-2.5 font-medium">{error}</p>
              )}
            </div>
          )}
        </div>
        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
      </motion.div>
    </div>
  );
}
