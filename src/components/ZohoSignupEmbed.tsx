import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ZohoSignupEmbed() {
  const [embedCode, setEmbedCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto font-sans shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-4">
          <h3 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight leading-snug">
            Get Clearpath election intelligence in your inbox.
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
          ) : (
            <div className="mt-6 border border-dashed border-slate-800 rounded-lg p-6 bg-slate-950/50">
              <p className="text-xs font-mono text-slate-500">
                Zoho Campaigns signup form pending.
              </p>
            </div>
          )}
        </div>
        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
      </div>
    </div>
  );
}
