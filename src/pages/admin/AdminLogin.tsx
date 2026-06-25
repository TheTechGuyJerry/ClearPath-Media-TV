import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { useNavigate } from 'react-router-dom';
import { Database } from 'lucide-react';

export default function AdminLogin() {
  const { user, isAdminUser, authError, setAuthError, loginWithGoogle, loginWithEmail, loading } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle Redirection on successful login
  useEffect(() => {
    if (user && isAdminUser) {
      const redirectPath = localStorage.getItem('admin_redirect_path') || '/admin';
      localStorage.removeItem('admin_redirect_path');
      navigate(redirectPath, { replace: true });
    }
  }, [user, isAdminUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter email and password.');
      return;
    }
    await loginWithEmail(email, password);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-outline-variant p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display font-semibold text-2xl text-primary mb-1">ClearPath Media</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold font-mono">CMS Administrator login</p>
        </div>

        {authError && (
          <div className="mb-6 bg-error/10 border-l-4 border-error p-4 text-xs font-semibold text-error rounded-sm flex items-start gap-2 text-left">
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="operator@clearpath.media" 
              className="w-full px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white hover:bg-primary-container font-semibold py-3 rounded text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>

        <div className="relative my-6 text-center border-b border-outline-variant pb-2">
          <span className="bg-white px-3 text-xs text-on-surface-variant font-semibold absolute -top-2 left-1/2 -translate-x-1/2 uppercase font-mono">OR</span>
        </div>

        <button 
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full border border-outline-variant hover:bg-surface-container-high font-semibold py-3 rounded text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Database className="w-4 h-4 text-primary" /> SIGN IN WITH GOOGLE
        </button>
      </div>
    </div>
  );
}
