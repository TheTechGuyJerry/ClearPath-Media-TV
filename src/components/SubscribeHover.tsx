import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SubscribeHover() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    // Mark as dismissed for 24 hours (or just track in local storage)
    localStorage.setItem('clearpath_subscribe_dismissed', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    // Simulate API registration with high fidelity
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      localStorage.setItem('clearpath_subscribed', 'true');
      
      // Auto-close after a success show of 2.5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[380px] z-50 bg-[#001e40] text-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.36)] border border-white/10 rounded-sm"
          id="subscribe-hover-container"
        >
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors p-1"
            aria-label="Dismiss subscription offer"
            id="subscribe-hover-close"
          >
            <X className="w-4 h-4" />
          </button>

          {!isSuccess ? (
            <div id="subscribe-hover-content">
              <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-widest text-[#a7c8ff] block mb-2">
                Weekly Newsletter
              </span>
              <h4 className="font-headline-md text-headline-md text-white font-semibold leading-snug mb-2">
                Subscribe to Daily Brief
              </h4>
              <p className="font-body-md text-sm text-white/80 mb-4 leading-relaxed">
                Get clear, authoritative public policy analysis delivered straight to your inbox. No fluff, just the power dynamics that matter.
              </p>

              <form onSubmit={handleSubmit} className="space-y-2" id="subscribe-hover-form">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:border-white focus:outline-none transition-colors rounded-sm"
                    id="subscribe-hover-email-input"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white text-[#001e40] px-4 py-2 font-label-sm text-xs font-bold uppercase tracking-wider hover:bg-slate-100 disabled:opacity-50 transition-all rounded-sm flex items-center justify-center min-w-[90px]"
                    id="subscribe-hover-submit-button"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-[#001e40]/30 border-t-[#001e40] rounded-full animate-spin"></div>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-6"
              id="subscribe-hover-success"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 border border-white/20">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="font-headline-md text-headline-md text-white font-semibold mb-2">
                You're in!
              </h4>
              <p className="font-body-md text-sm text-white/80 leading-relaxed">
                Thank you for subscribing. Welcome to Clearpath Media.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
