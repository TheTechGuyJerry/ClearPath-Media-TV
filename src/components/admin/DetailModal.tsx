import React from 'react';
import { X } from 'lucide-react';

const formatFirebaseDate = (dateVal: any): string => {
  if (!dateVal) return 'Not available';
  if (typeof dateVal === 'string' && (dateVal.trim() === '' || dateVal.toLowerCase().includes('invalid'))) {
    return 'Not available';
  }
  
  if (dateVal && typeof dateVal.toDate === 'function') {
    try {
      const d = dateVal.toDate();
      if (d && !isNaN(d.getTime())) {
        return d.toLocaleDateString();
      }
    } catch (e) {}
  }

  if (dateVal && typeof dateVal.seconds === 'number') {
    try {
      return new Date(dateVal.seconds * 1000).toLocaleDateString();
    } catch (e) {}
  }

  if (dateVal && typeof dateVal._seconds === 'number') {
    try {
      return new Date(dateVal._seconds * 1000).toLocaleDateString();
    } catch (e) {}
  }

  try {
    const parsedDate = new Date(dateVal);
    if (parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.toString() !== 'Invalid Date') {
      return parsedDate.toLocaleDateString();
    }
  } catch (e) {}

  return 'Not available';
};

const getProspectName = (r: any) => r.fullName || r.name || r.prospectName || 'Not available';
const getCorporateEntity = (r: any) => r.organisation || r.organization || r.corporateEntity || 'Not available';
const getContact = (r: any) => {
  const email = r.workEmail || r.email || r.contact || '';
  return email.trim() !== '' ? email.trim() : 'Not available';
};
const getPartnershipInterest = (r: any) => r.partnershipInterest || r.partnershipType || r.interest || 'Not available';
const getKeyMessage = (r: any) => r.additionalInformation || r.message || r.keyMessage || 'Not available';
const getJobTitle = (r: any) => r.jobTitle || r.jobRole || r.role || r.jobTitleRole || r.designation || 'Not available';

interface DetailModalProps {
  type: 'partnerRequests' | 'subscribers' | 'contactMessages';
  data: any;
  onClose: () => void;
  onStatusUpdate: (collectionName: string, id: string, newStatus: string) => void;
}

export default function DetailModal({ type, data, onClose, onStatusUpdate }: DetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className="bg-white rounded-lg border border-outline-variant shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-primary text-white p-6 flex justify-between items-start">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">
              {type === 'partnerRequests' ? 'Partnership Request' :
               type === 'subscribers' ? 'Newsletter Subscriber' :
               'Contact Message'}
            </span>
            <h3 className="text-xl font-bold font-display mt-1">
              {type === 'partnerRequests' ? getProspectName(data) :
               type === 'subscribers' ? data.email :
               (data.fullName || 'Anonymous Message')}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-secondary-container transition-colors p-1 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-grow text-sm text-left">
          {type === 'partnerRequests' && (
            <>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Company/Organisation</h4>
                <p className="font-semibold text-primary">{getCorporateEntity(data)}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Job Title / Role</h4>
                <p className="font-semibold text-primary">{getJobTitle(data)}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Work Email Address</h4>
                <a href={`mailto:${getContact(data)}`} className="font-mono font-semibold text-primary hover:underline">{getContact(data)}</a>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Partnership Interest Category</h4>
                <p className="font-semibold text-primary">{getPartnershipInterest(data)}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Additional Information / Message</h4>
                <div className="bg-surface-container-low p-4 rounded border border-outline-variant font-normal text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                  {getKeyMessage(data)}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date Submitted</h4>
                <p className="font-mono text-gray-500">{formatFirebaseDate(data.submittedAt || data.createdAt)}</p>
              </div>
            </>
          )}

          {type === 'subscribers' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">First Name</h4>
                  <p className="font-semibold text-primary">{data.firstName || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Last Name</h4>
                  <p className="font-semibold text-primary">{data.lastName || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Subscriber Email</h4>
                <a href={`mailto:${data.email}`} className="font-mono font-semibold text-primary hover:underline">{data.email}</a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Events Alerts Opt-In</h4>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    data.eventsOptIn ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {data.eventsOptIn ? 'YES (Opted In)' : 'NO'}
                  </span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Privacy Consent</h4>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    data.privacyConsent ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {data.privacyConsent ? 'CONSENTED' : 'NO CONSENT'}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Preferences Categories</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.selectedBriefings && Array.isArray(data.selectedBriefings) && data.selectedBriefings.length > 0 ? (
                    data.selectedBriefings.map((b: string) => (
                      <span key={b} className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded uppercase">{b}</span>
                    ))
                  ) : (
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">None / General Weekly Brief</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Subscription Date</h4>
                <p className="font-mono text-gray-500">{formatFirebaseDate(data.subscribedAt || data.createdAt)}</p>
              </div>
            </>
          )}

          {type === 'contactMessages' && (
            <>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Sender Full Name</h4>
                <p className="font-semibold text-primary">{data.fullName || 'Anonymous'}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Contact Email</h4>
                <a href={`mailto:${data.email}`} className="font-mono font-semibold text-primary hover:underline">{data.email}</a>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Message Body</h4>
                <div className="bg-surface-container-low p-4 rounded border border-outline-variant font-normal text-on-surface-variant whitespace-pre-wrap leading-relaxed text-left">
                  {data.message}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date Received</h4>
                <p className="font-mono text-gray-500">{formatFirebaseDate(data.submittedAt || data.createdAt)}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="bg-surface-container-low p-6 border-t border-outline-variant flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto text-left">
            <span className="font-semibold text-on-surface-variant text-[10px] uppercase">Status:</span>
            <select 
              value={data.status || (type === 'subscribers' ? 'active' : 'new')}
              onChange={(e) => {
                const dbCollection = type === 'subscribers' ? 'newsletterSubscribers' : type;
                onStatusUpdate(dbCollection, data.id, e.target.value);
              }}
              className="bg-white border border-outline rounded px-2.5 py-1.5 focus:border-primary focus:ring-0 text-xs font-semibold uppercase text-primary"
            >
              {type === 'partnerRequests' && (
                <>
                  <option value="new">NEW</option>
                  <option value="pending">PENDING</option>
                  <option value="processed">PROCESSED</option>
                  <option value="archived">ARCHIVED</option>
                </>
              )}
              {type === 'subscribers' && (
                <>
                  <option value="active">ACTIVE</option>
                  <option value="paused">PAUSED</option>
                  <option value="unsubscribed">UNSUBSCRIBED</option>
                </>
              )}
              {type === 'contactMessages' && (
                <>
                  <option value="new">NEW</option>
                  <option value="read">READ</option>
                  <option value="flagged">FLAGGED</option>
                  <option value="replied">REPLIED</option>
                </>
              )}
            </select>
          </div>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-primary text-white font-bold px-4 py-2 rounded text-xs uppercase tracking-wider cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
export { getProspectName, getCorporateEntity, getContact, getPartnershipInterest, getKeyMessage };
