import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CheckEmailModal from './CheckEmailModal';

export default function SubscribeHover() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkEmailModalOpen, setCheckEmailModalOpen] = useState(false);
  const [continuationToken, setContinuationToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if user already subscribed or dismissed the hover card
    const isSubscribed = localStorage.getItem('clearpath_subscribed');
    const isDismissed = localStorage.getItem('clearpath_subscribe_dismissed');

    if (!isSubscribed && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); // 5 seconds of being on the site

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('clearpath_subscribe_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = email.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.status === 'already_subscribed') {
          setErrorMsg(data.message || 'This email address is already subscribed.');
        } else {
          setContinuationToken(data.token || '');
          setCheckEmailModalOpen(true);
          localStorage.setItem('clearpath_subscribed', 'true');
          setIsVisible(false);
        }
      } else {
        setErrorMsg(data.error || 'Failed to start subscription.');
      }
    } catch (err: any) {
      console.error('Error in SubscribeHover submit:', err);
      setErrorMsg('Error subscribing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CheckEmailModal
        isOpen={checkEmailModalOpen}
        onClose={() => setCheckEmailModalOpen(false)}
        email={email}
        continuationToken={continuationToken}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[90] w-full max-w-[380px] px-4 sm:px-0"
          >
            <div className="bg-[#001e40] text-white rounded-2xl p-6 shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-md">
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Dismiss subscription offer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ClearPath Daily</span>
              </div>

              <h4 className="font-serif text-xl font-normal text-white mb-2 leading-tight">
                Stay Ahead of Power & Policy
              </h4>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                Get Nigeria&apos;s definitive weekday morning policy briefing delivered free to your inbox before 7:00 AM.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-xs placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 transition-all"
                  />
                  {errorMsg && <p className="text-[11px] text-red-300 font-semibold mt-1">{errorMsg}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#001e40] font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Subscribe Free'}
                </button>
              </form>

              <p className="text-white/40 text-[10px] text-center mt-3">
                No spam. Unsubscribe anytime in 1 click.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
