import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldAlert, 
  Terminal, 
  XCircle, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { SecurityRules } from '../types';

interface PolicyFormProps {
  rules: SecurityRules;
  setRules: React.Dispatch<React.SetStateAction<SecurityRules>>;
  handleSavePolicy: () => void;
  savingPolicy: boolean;
  saveSuccess: boolean;
}

export default function PolicyForm({
  rules,
  setRules,
  handleSavePolicy,
  savingPolicy,
  saveSuccess
}: PolicyFormProps) {
  const [simScore, setSimScore] = useState(45);

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div className="border-b border-default pb-4">
        <span className="font-mono text-xs tracking-[4px] uppercase text-brand">SMART CITY SECURITY POLICIES</span>
        <h2 className="font-audiowide font-bold text-2xl text-heading uppercase tracking-wider mt-1">
          Threat Classification Thresholds
        </h2>
        <p className="text-sm text-body mt-2 leading-relaxed">
          Modify risk classification constraints across all municipal payment nodes instantly. Fine-tune AI triggers and test evaluations in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-neutral-primary-soft border border-default p-5.5 clip-card space-y-4">
          <div className="flex items-center gap-2 border-b border-default pb-3 mb-2">
            <Sliders className="w-5 h-5 text-brand" />
            <span className="font-audiowide text-[13px] tracking-wider uppercase text-heading">MFA Request Threshold</span>
          </div>
          <p className="text-xs text-body leading-relaxed">
            Payments exceeding this risk coefficient trigger a mandatory dynamic MFA handshake at the terminal before processing continues.
          </p>
          <div className="p-4 bg-neutral-secondary-medium/40 border border-default space-y-3">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-heading">MFA BARRIER FLOOR</span>
              <span className="text-brand font-audiowide">{rules.mfaThreshold} Risk Score</span>
            </div>
            <input 
              type="range"
              min="20"
              max="80"
              value={rules.mfaThreshold}
              onChange={(e) => setRules(prev => ({ ...prev, mfaThreshold: parseInt(e.target.value) }))}
              className="w-full h-1.5 bg-neutral-tertiary rounded-none outline-none appearance-none cursor-pointer accent-brand"
            />
            <div className="text-[10px] text-body-subtle leading-normal font-mono uppercase">
              Recommended: 55-65 Range
            </div>
          </div>
        </div>

        <div className="bg-neutral-primary-soft border border-default p-5.5 clip-card space-y-4">
          <div className="flex items-center gap-2 border-b border-default pb-3 mb-2">
            <ShieldAlert className="w-5 h-5 text-danger" />
            <span className="font-audiowide text-[13px] tracking-wider uppercase text-heading">Auto-Block Terminate</span>
          </div>
          <p className="text-xs text-body leading-relaxed">
            Payments exceeding this coefficient are instantly halted at the terminal socket layer and the citizen account is flagged for investigation.
          </p>
          <div className="p-4 bg-neutral-secondary-medium/40 border border-default space-y-3">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-heading">IMMEDIATE BLOCK THRESHOLD</span>
              <span className="text-danger font-audiowide">{rules.autoBlockThreshold} Risk Score</span>
            </div>
            <input 
              type="range"
              min="50"
              max="95"
              value={rules.autoBlockThreshold}
              onChange={(e) => setRules(prev => ({ ...prev, autoBlockThreshold: parseInt(e.target.value) }))}
              className="w-full h-1.5 bg-neutral-tertiary rounded-none outline-none appearance-none cursor-pointer accent-danger"
            />
            <div className="text-[10px] text-body-subtle leading-normal font-mono uppercase">
              Recommended: 80-90 Range
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-primary-soft border border-default p-6 clip-card">
        <h3 className="font-audiowide text-[12px] uppercase tracking-wider text-heading mb-4 border-b border-default pb-2 select-none">
          Operational Rule Flags
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
          <label className="flex items-start gap-3 cursor-pointer p-3 bg-neutral-secondary-soft/50 border border-default hover:bg-neutral-secondary-medium/40 transition-colors">
            <input 
              type="checkbox"
              checked={rules.behavioralAnalysisEnabled}
              onChange={(e) => setRules(prev => ({ ...prev, behavioralAnalysisEnabled: e.target.checked }))}
              className="mt-0.5 rounded-none border-default bg-neutral-secondary-medium checked:bg-brand text-brand w-4 h-4 cursor-pointer"
            />
            <div>
              <span className="block text-heading font-audiowide font-normal tracking-wide uppercase text-[11px]">Citizen Profiler</span>
              <span className="text-[9.5px] text-body-subtle mt-1 block">Inspect payment sequences rather than static fields.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 bg-neutral-secondary-soft/50 border border-default hover:bg-neutral-secondary-medium/40 transition-colors">
            <input 
              type="checkbox"
              checked={rules.geofenceEnforcement}
              onChange={(e) => setRules(prev => ({ ...prev, geofenceEnforcement: e.target.checked }))}
              className="mt-0.5 rounded-none border-default bg-neutral-secondary-medium checked:bg-brand text-brand w-4 h-4 cursor-pointer"
            />
            <div>
              <span className="block text-heading font-audiowide font-normal tracking-wide uppercase text-[11px]">Geo-Fence Drift</span>
              <span className="text-[9.5px] text-body-subtle mt-1 block">Verify impossible travel between payment locations.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 bg-neutral-secondary-soft/50 border border-default hover:bg-neutral-secondary-medium/40 transition-colors">
            <input 
              type="checkbox"
              checked={rules.dynamicMfaEnabled}
              onChange={(e) => setRules(prev => ({ ...prev, dynamicMfaEnabled: e.target.checked }))}
              className="mt-0.5 rounded-none border-default bg-neutral-secondary-medium checked:bg-brand text-brand w-4 h-4 cursor-pointer"
            />
            <div>
              <span className="block text-heading font-audiowide font-normal tracking-wide uppercase text-[11px]">Dynamic MFA</span>
              <span className="text-[9.5px] text-body-subtle mt-1 block">Enable session keys dynamically tied to MFA channels.</span>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-neutral-primary-soft border border-default p-6 clip-card space-y-4">
        <div className="flex items-center justify-between border-b border-default pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand" />
            <span className="font-audiowide text-[13px] tracking-wider uppercase text-heading">Policy Verdict Tester</span>
          </div>
          <span className="text-[9px] font-mono text-body-subtle uppercase">LOCAL EVALUATION SANDBOX</span>
        </div>
        <p className="text-xs text-body select-none">
          Simulate a payment risk score and see how your customized thresholds evaluate the transaction against city-wide gate configurations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="flex justify-between text-xs font-mono text-body select-none">
              <span>SIMULATED RISK SCORE:</span>
              <span className="text-heading font-bold">{simScore} / 100</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={simScore}
              onChange={(e) => setSimScore(parseInt(e.target.value))}
              className="w-full h-1.5 bg-neutral-tertiary rounded-none outline-none appearance-none cursor-pointer accent-brand"
            />
            <div className="flex justify-between text-[9px] font-mono text-body-subtle uppercase select-none">
              <span>0 (Safe Payment)</span>
              <span>100 (Immediate Threat)</span>
            </div>
          </div>

          <div className="md:col-span-5 bg-neutral-secondary-soft p-4 border border-default text-center space-y-2 select-none">
            <span className="text-[9.5px] font-mono text-body-subtle uppercase block">EVALUATOR DECISION</span>
            <div className="font-audiowide text-lg font-bold uppercase tracking-wider">
              {simScore >= rules.autoBlockThreshold ? (
                <span className="text-danger flex items-center justify-center gap-1.5 animate-pulse">
                  <XCircle className="w-5 h-5" /> TERMINATE / BLOCK
                </span>
              ) : simScore >= rules.mfaThreshold ? (
                <span className="text-warning flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-5 h-5" /> REQUIRE MFA
                </span>
              ) : (
                <span className="text-[#00E676] flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" /> ALLOW / CLEAR
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-body leading-tight">
              {simScore >= rules.autoBlockThreshold ? `Payment blocked — score meets Auto-Block threshold of ${rules.autoBlockThreshold}.` :
               simScore >= rules.mfaThreshold ? `MFA challenge triggered — score between ${rules.mfaThreshold} and ${rules.autoBlockThreshold}.` :
               `Payment cleared — score under MFA floor of ${rules.mfaThreshold}.`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button 
          onClick={handleSavePolicy}
          disabled={savingPolicy}
          className="px-6 py-3 bg-brand text-neutral-primary font-audiowide uppercase tracking-wider text-xs clip-btn cursor-pointer font-bold flex items-center gap-2 hover:bg-brand-medium transition-all shadow-md active:scale-98 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${savingPolicy ? 'animate-spin' : ''}`} />
          {savingPolicy ? 'PUBLISHING RULES...' : 'Publish City Rules'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 border border-[#00C060] bg-[#00180F] text-[#00E676] font-mono text-xs uppercase tracking-wider animate-pulse text-center leading-none select-none">
          ✔ Rules updated successfully across Baku Central, Sumqayit, Ganja, and Khazar district clusters.
        </div>
      )}
    </div>
  );
}
