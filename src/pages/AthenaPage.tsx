import { useEffect } from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';

export default function AthenaPage() {
  const athenaUrl = 'https://athenacentre.org';

  useEffect(() => {
    // Automatically redirect visitor to the official Athena website
    window.location.href = athenaUrl;
  }, []);

  return (
    <div className="w-full min-h-[70vh] bg-background font-sans flex items-center justify-center p-6">
      <SEO
        title="Athena Centre Research — External Official Portal"
        description="Redirecting to the official Athena Centre for Policy & Leadership website."
      />

      <div className="max-w-md w-full bg-surface-bright border border-outline-variant p-8 rounded-2xl shadow-lg text-center space-y-6">
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
          <BookOpen className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-xl font-bold font-serif text-on-surface mb-2">
            Redirecting to Athena Centre
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            All research, complete policy papers, and publications are published directly on the official Athena Centre portal.
          </p>
        </div>

        <a
          href={athenaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-800 transition-colors shadow-sm"
        >
          <span>Visit official Athena website</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
