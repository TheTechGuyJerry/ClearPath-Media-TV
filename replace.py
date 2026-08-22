import sys
with open('src/pages/ThreeThings.tsx', 'r') as f:
    content = f.read()

start_marker = "const OCCUPATIONS = ["
end_marker = "const fallbackProgramGrid: ProgrammeVideo[] = ["

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

replacement = """function CompactSubscribeForm({ 
  title, 
  subtitle, 
  disclaimer, 
  buttonText,
  buttonContext
}: { 
  title: string; 
  subtitle: string; 
  disclaimer: string; 
  buttonText: string;
  buttonContext?: string;
}) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Check Email Modal States
  const [checkEmailOpen, setCheckEmailOpen] = useState(false);
  const [activeModalEmail, setActiveModalEmail] = useState('');
  const [continuationToken, setContinuationToken] = useState('');

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = email.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.status === 'already_subscribed') {
          setError(data.message || 'This email address is already subscribed.');
        } else {
          setActiveModalEmail(emailLower);
          if (data.token) {
            setContinuationToken(data.token);
          }
          setCheckEmailOpen(true);
          setEmail('');
        }
      } else {
        setError(data.error || 'Failed to start subscription. Please try again.');
      }
    } catch (err: any) {
      console.error('Subscribe API error:', err);
      setError(err.message || 'Network error starting subscription.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mt-6 mb-6 p-6 bg-surface-container-low border border-outline-variant rounded-lg font-sans text-left">
        <form onSubmit={handleStep1}>
          <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
          <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">{subtitle}</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address" 
              required
              className="flex-grow px-4 py-3 border border-outline-variant rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-white"
            />
            <button 
              type="submit" 
              disabled={submitting}
              className="whitespace-nowrap px-6 py-3 bg-primary text-white rounded font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Sending...' : buttonText}
            </button>
          </div>
          {error && <p className="text-xs text-red-600 font-semibold mt-2">{error}</p>}
          <p className="text-xs text-outline mt-3 font-medium">{disclaimer}</p>
        </form>
      </div>

      <CheckEmailModal 
        isOpen={checkEmailOpen}
        onClose={() => setCheckEmailOpen(false)}
        email={activeModalEmail}
        continuationToken={continuationToken}
      />
    </>
  );
}

"""

new_content = content[:start_idx] + replacement + content[end_idx:]

with open('src/pages/ThreeThings.tsx', 'w') as f:
    f.write(new_content)

