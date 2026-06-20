/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Lock, User, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (email: string, token: string) => void;
  onBackToLanding: () => void;
}

export default function AuthPage({ onLoginSuccess, onBackToLanding }: AuthPageProps) {
  const [email, setEmail] = useState('analyst@cityguard.ai');
  const [password, setPassword] = useState('analyst123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user.email, data.token);
    } catch (err: any) {
      setError(err.message || 'CRITICAL_ERROR: AUTHENTICATION CREDENTIAL LAYERS CANNOT BE BLANK // TRY AGAIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen max-h-screen bg-[#04040A] text-[#7E7F94] flex flex-col items-center justify-center py-4 px-6 cyber-grid overflow-hidden">
      
      {/* Back button to landing */}
      <button 
        onClick={onBackToLanding}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-body-subtle hover:text-brand transition-colors cursor-pointer select-none"
      >
        <ArrowLeft className="w-4 h-4 text-brand" />
        Return to Portal
      </button>

      {/* Cyber ambient decoration */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#54EAFD] to-transparent shadow-[0_0_10px_#54EAFD]"></div>

      <div className="w-full max-w-md bg-neutral-primary-soft border border-default p-8 clip-card shadow-2xl relative">
        {/* Angle decorative elements */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand/40"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-brand/40"></div>

        {/* Brand visual header */}
        <div className="text-center mb-8 select-none">
          <div className="w-12 h-12 rounded-sm mx-auto flex items-center justify-center border border-brand bg-brand-softer shadow-[0_0_10px_rgba(84,234,253,0.3)] mb-4">
            <Shield className="w-6 h-6 text-brand" />
          </div>
          <h2 className="font-audiowide font-bold text-2xl tracking-wider text-heading uppercase">
            City Administrator
          </h2>
          <p className="text-xs font-mono uppercase tracking-[2px] text-brand/70 mt-1">
            Smart City Security Terminal
          </p>
        </div>

        {/* Security warning block */}
        <div className="mb-6 p-3 bg-danger-soft/40 border border-danger-medium text-danger text-[10.5px] font-mono leading-relaxed flex gap-2.5 select-none">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0" />
          <div>
            <span className="font-bold block uppercase">AUTHORIZED PERSONNEL ONLY</span>
            All activities in this terminal are logged, back-buffered, and subject to neural state validation protocol.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-danger-soft/80 border border-danger text-danger font-mono text-[11px] leading-relaxed select-none">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-audiowide uppercase tracking-wider text-heading mb-2">
              Analyst ID / Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-subtle">
                <User className="w-4 h-4 text-body" />
              </span>
              <input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@cityguard.ai"
                className="w-full pl-10 pr-4 py-3 bg-neutral-secondary-medium border border-default-medium text-heading text-[13px] font-mono placeholder-body-subtle/40 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all clip-btn"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-audiowide uppercase tracking-wider text-heading mb-2">
              Passcode Token
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-subtle">
                <Lock className="w-4 h-4 text-body" />
              </span>
              <input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-neutral-secondary-medium border border-default-medium text-heading text-[13px] font-mono placeholder-body-subtle/40 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all clip-btn"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-neutral-primary py-3 px-4 font-audiowide uppercase tracking-widest text-sm clip-btn glint-btn cursor-pointer inline-flex items-center justify-center gap-2 font-bold disabled:opacity-50"
          >
            {loading ? 'Initializing Core Lock...' : 'De-Encrypt Entry Code'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Cyber terminal footer details */}
      <div className="mt-8 text-center text-[10px] font-mono text-body-subtle uppercase space-y-1 select-none">
        <p>SYSTEM IP PROXY SHIFT: <span className="text-[#00E676]">VERIFIED CERTIFIED</span></p>
        <p>CRYPT-ENGINE CHIP STATUS: <span className="text-brand">NEURAL_AES_256_STABLE</span></p>
      </div>
    </div>
  );
}
