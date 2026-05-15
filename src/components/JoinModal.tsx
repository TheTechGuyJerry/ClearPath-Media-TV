import { X } from 'lucide-react';
import { useEffect } from 'react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile bg-black/40 backdrop-blur-[2px]">
      <div className="bg-surface-bright w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative border border-outline-variant rounded-lg flex flex-col md:flex-row">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-2 z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="hidden md:block md:w-5/12 relative min-h-full">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu1ibmzeT82oErQmuUL6wzv978s4_8eD86E9f-PYdnFDB5hvEyhvBEtop36_H8CGLZcho2ttARJdkmZAkGpMp1NOdXbE595Avigovk3g13pYQSSRkA0H0R83xmPszxXdh_T4l-0OM4lFCv6eVn_Y__yAyENruNaLzS6XadM2O2VvuyAKnj-5ElGzsEzcROJL3--RsQW3aJVcukm7ODqXEpR67iDCHufAK7493qfM-0mGq2KrK_yn8_nb9Zzyz24zBRdDFX7nMd3Ag" 
            alt="Workspace" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-primary/20"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="text-headline-md font-headline-md mb-2">Authority in every word.</div>
            <div className="text-body-md font-body-md opacity-90">Deep dives into the mechanics of power and the nuances of African policy.</div>
          </div>
        </div>

        <div className="w-full md:w-7/12 p-unit-lg md:p-unit-xl flex flex-col justify-center">
          <div className="mb-unit-lg">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-sm">Join the Conversation</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Get clear, authoritative analysis delivered to your inbox. No fluff, just the policy and power dynamics that matter.
            </p>
          </div>

          <section>
            <h3 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-unit-md">Weekly Newsletter</h3>
            <form className="flex flex-col sm:flex-row gap-unit-sm">
              <input type="email" placeholder="Email address" className="flex-grow px-unit-md py-3 bg-surface-container-low border border-outline-variant focus:border-primary-container focus:ring-0 text-body-md transition-all outline-none" />
              <button type="submit" className="bg-primary-container text-white px-unit-lg py-3 font-label-md text-label-md hover:bg-primary transition-all duration-150 uppercase tracking-wide">
                  Subscribe
              </button>
            </form>
            
            <div className="mt-unit-md space-y-unit-sm">
              <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-unit-xs">Choose your briefings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-unit-sm gap-x-gutter">
                {['Three Things with Osita', 'Daily Brief with Annabel', 'Clearpath Insights', 'Nigeria & Neighbours', 'Election Matters', 'Mekaria Series'].map(briefing => (
                  <label key={briefing} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" defaultChecked={briefing.includes('Osita') || briefing.includes('Annabel')} className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-0 cursor-pointer" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">{briefing}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <div className="flex items-center gap-unit-md my-unit-md">
            <div className="h-[1px] flex-grow bg-outline-variant"></div>
            <span className="font-label-sm text-label-sm text-outline uppercase">or reach out</span>
            <div className="h-[1px] flex-grow bg-outline-variant"></div>
          </div>

          <section>
            <form className="space-y-unit-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-unit-md">
                <div className="space-y-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Full Name</label>
                  <input type="text" className="w-full px-unit-md py-2 bg-transparent border-b border-outline focus:border-primary transition-colors outline-none text-body-md" />
                </div>
                <div className="space-y-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Email</label>
                  <input type="email" className="w-full px-unit-md py-2 bg-transparent border-b border-outline focus:border-primary transition-colors outline-none text-body-md" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Message</label>
                <textarea rows={2} className="w-full px-unit-md py-2 bg-transparent border-b border-outline focus:border-primary transition-colors outline-none text-body-md resize-none"></textarea>
              </div>
              <button type="button" className="w-full border border-primary text-primary py-3 font-label-md text-label-md hover:bg-surface-container-low transition-all duration-150 uppercase tracking-wide">
                  Send Message
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
