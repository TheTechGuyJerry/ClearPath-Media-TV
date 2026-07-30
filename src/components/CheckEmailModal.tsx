import React, { useState, useEffect } from 'react';
import { Mail, X, RefreshCw, CheckCircle } from 'lucide-react';

interface CheckEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  continuationToken?: string;
}

export default function CheckEmailModal({ isOpen, onClose, email, continuationToken }: CheckEmailModalProps) {
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setResendStatus(null);
    setResendError(null);

    try {
      const res = await fetch('/api/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: continuationToken }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResendStatus('A new continuation email has been sent!');
        setCooldown(60);
      } else {
        setResendError(data.error || 'Failed to resend email.');
        if (data.remainingSeconds) {
          setCooldown(data.remainingSeconds);
        }
      }
    } catch (err: any) {
      setResendError(err.message || 'Error communicating with server.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-left font-sans"
        role="dialog"
        aria-modal="true"
        aria-labelledby="check-email-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#001e40] p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#001e40]/10 flex items-center justify-center text-[#001e40]">
            <Mail className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#666b73]">ClearPath Media</div>
            <h3 id="check-email-title" className="text-xl sm:text-2xl font-serif text-[#001e40] font-normal leading-tight">
              Check Your Email
            </h3>
          </div>
        </div>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
          We have sent you an email to continue your subscription. Please check your Inbox. If you cannot find the email, check your Spam or Junk folder and move the message to your Inbox. Click the button in the email to continue and complete your subscription.
        </p>

        {email && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-700 font-medium mb-5 flex items-center justify-between">
            <span className="truncate">Sent to: <strong className="text-[#001e40]">{email}</strong></span>
          </div>
        )}

        {resendStatus && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resendStatus}</span>
          </div>
        )}

        {resendError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
            {resendError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full sm:w-auto text-xs font-bold text-[#001e40] hover:text-[#00142b] disabled:text-slate-400 flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>{cooldown > 0 ? `Resend in ${cooldown}s` : resending ? 'Resending...' : 'Resend Email'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-w-[120px] bg-[#001e40] hover:bg-[#00142b] text-white text-sm font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-[#001e40]/10 cursor-pointer text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
