import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <div className="w-full min-h-[75vh] bg-background flex items-center justify-center p-6 text-center">
      <SEO title="Page Not Found — ClearPath Media" />

      <div className="max-w-lg bg-surface-bright border border-outline-variant p-8 md:p-12 rounded-2xl shadow-sm">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary block mb-2">
          ERROR 404 — PAGE NOT FOUND
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-on-surface mb-3">
          The requested page could not be found
        </h1>

        <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
          The publication or route you are looking for may have been moved or updated. You can return home or browse ClearPath Daily editions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-primary/90 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/clearpath-daily"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-container border border-outline-variant text-on-surface font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-surface-container-high transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>ClearPath Daily</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
