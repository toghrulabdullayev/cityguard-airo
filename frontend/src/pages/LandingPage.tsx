/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Cpu, 
  Activity, 
  Code,
  Terminal, 
  Zap, 
  FileText 
} from 'lucide-react';
import { PROBLEM_STATS, CORE_FEATURES, COMPETING_VENDORS, generateMockTransaction } from '../utils/mockData';
import { SecurityRules, Transaction } from '../types';

interface LandingPageProps {
  onEnterTerminal: () => void;
}

export default function LandingPage({ onEnterTerminal }: LandingPageProps) {
  const [coreRules] = useState<SecurityRules>({
    mfaThreshold: 60,
    autoBlockThreshold: 85,
    behavioralAnalysisEnabled: true,
    geofenceEnforcement: true,
    dynamicMfaEnabled: true
  });

  const [probedTx, setProbedTx] = useState<Transaction | null>(null);
  const [probing, setProbing] = useState(false);

  const startProbe = () => {
    setProbing(true);
    setProbedTx(null);
    setTimeout(() => {
      const tx = generateMockTransaction(coreRules);
      setProbedTx(tx);
      setProbing(false);
    }, 850);
  };

  return (
    <div className="relative min-h-screen bg-[#04040A] text-[#7E7F94] overflow-x-hidden pt-4 pb-12 cyber-grid">
      {/* Decorative top ambient bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#54EAFD] to-transparent shadow-[0_0_12px_#54EAFD]"></div>
      
      {/* HEADER SECTION */}
      <header className="max-w-[1152px] mx-auto px-6 h-20 flex items-center justify-between border-b border-neutral-tertiary-medium">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm flex items-center justify-center border border-brand bg-brand-softer shadow-[0_0_8px_rgba(84,234,253,0.3)] select-none">
            <Shield className="w-5 h-5 text-brand" />
          </div>
          <div className="select-none">
            <span className="font-audiowide font-bold text-lg tracking-wider text-heading uppercase">
              City<span className="text-brand">Guard</span>
            </span>
            <div className="text-[10px] font-mono tracking-[4px] leading-none text-brand/60 uppercase">
              Security Terminal
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[13px] font-audiowide tracking-wider uppercase text-heading select-none">
          <a href="#stats" className="hover:text-brand transition-colors text-body-subtle hover:text-heading">Problem Grid</a>
          <a href="#features" className="hover:text-brand transition-colors text-body-subtle hover:text-heading">Anomaly Deck</a>
          <a href="#probe" className="hover:text-brand transition-colors text-body-subtle hover:text-heading">Live Probe</a>
          <a href="#comparison" className="hover:text-brand transition-colors text-body-subtle hover:text-heading">Benchmarking</a>
        </nav>

        <button 
          onClick={onEnterTerminal}
          className="relative inline-flex items-center justify-center border border-brand bg-brand-softer text-brand px-5 py-2 text-[12px] font-audiowide uppercase tracking-wider clip-btn glint-btn cursor-pointer select-none"
        >
          Access Terminal
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-[1152px] mx-auto px-6 pt-16 md:pt-24 pb-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-softer border border-brand-medium/40 text-brand text-[11px] font-mono uppercase tracking-[2px] mb-6 animate-pulse leading-none select-none">
          <span className="w-2 h-2 rounded-full bg-brand animate-ping inline-block"></span>
          Threat Monitor Active // Retaining System v2.4
        </div>

        <h1 className="font-audiowide font-bold text-4xl sm:text-5xl md:text-6xl tracking-wider text-heading uppercase max-w-4xl leading-[1.1] mb-6">
          Proactive <span className="text-brand animate-glitch">Zero-Trust</span> AI Fraud Prevention
        </h1>

        <p className="font-sans text-lg text-body max-w-2xl leading-relaxed mb-10 select-none">
          Terminate synthetic identity abuse, rapid account takeovers, and fraudulent transactions in under 42ms. 
          Driven by sequence behavior telemetry layers rather than obsolete static filters.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md select-none">
          <button 
            onClick={onEnterTerminal}
            className="w-full sm:w-auto px-8 py-4.5 bg-brand text-neutral-primary font-audiowide uppercase tracking-wider text-sm clip-btn glint-btn cursor-pointer text-center font-bold"
          >
            Launch Command Room
          </button>
          <a 
            href="#probe" 
            className="w-full sm:w-auto px-8 py-4.5 border border-default-strong bg-neutral-secondary-medium text-heading font-audiowide uppercase tracking-wider text-sm clip-btn hover:bg-neutral-tertiary-medium transition-all text-center flex items-center justify-center gap-2 font-bold"
          >
            Run Active Probe
          </a>
        </div>

        {/* Hero Decorative Graphics */}
        <div className="w-full max-w-3xl mt-16 p-px bg-gradient-to-r from-brand/5 via-brand/20 to-brand/5 border border-default clip-card relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none"></div>
          <div className="bg-neutral-primary-soft/90 p-4 font-mono text-[11px] text-left text-brand/80 select-none">
            <div className="flex items-center justify-between border-b border-default pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-danger inline-block"></span>
                <span className="text-heading font-bold uppercase font-audiowide tracking-wider">Gateway Telemetry // Feed</span>
              </div>
              <div className="text-[10px] text-body-subtle">PROBE SECURE // ADDR 0.0.0.0:3000</div>
            </div>
            <div className="space-y-1.5 opacity-90">
              <p className="text-body-subtle">[08:24:11] INITIALIZING DEEP LEARNING SEQUENCE EVALUATION...</p>
              <p className="text-[#00E676]">[08:24:12] PASS: Account 0x93FA: No temporal coordinates drift vector detected. (Risk Score: 11 / Green)</p>
              <p className="text-[#00E676]">[08:24:13] PASS: Account 0x11E8: Transferred $230.12 - baseline signature verified. (Risk Score: 04 / Green)</p>
              <p className="text-danger border-danger/30 font-bold">[08:24:14] WARN: Account 0x82AB: Location mismatch. Rapid travel from Detroit arcology to Orbital Platform Beta. Teleport check: FAIL.</p>
              <p className="text-danger font-bold">[08:24:14] HALT: Account 0x82AB BLOCK TRIGGERED. AI terminated socket before ledger checkout commit. (Risk score: 98 // Red)</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE STATS SECTION */}
      <section id="stats" className="max-w-[1152px] mx-auto px-6 py-24 border-t border-default-medium">
        <div className="text-center mb-16 select-none">
          <span className="font-mono text-[12px] tracking-[4px] uppercase text-brand">Vulnerabilities Grid</span>
          <h2 className="font-audiowide font-bold text-3xl md:text-4xl text-heading uppercase tracking-wider mt-2">
            The Cost of Obsolete Security
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-sm text-body">
            Legacy card and transaction processors utilize static point filters, creating massive windows for botnets and high false-positive rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROBLEM_STATS.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-neutral-primary-soft border border-default-medium p-8 clip-card relative group hover:border-brand-medium transition-all"
            >
              <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-body-subtle opacity-40 select-none">
                0{idx + 1} // SEC
              </div>
              <div className="font-audiowide font-bold text-4xl text-brand tracking-wider mb-2 select-none">
                {stat.value}
              </div>
              <h3 className="font-audiowide text-[13px] text-heading uppercase tracking-wider mb-3 select-none">
                {stat.label}
              </h3>
              <p className="text-xs text-body leading-relaxed select-none">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED FEATURES */}
      <section id="features" className="max-w-[1152px] mx-auto px-6 py-24 border-t border-default-medium bg-neutral-secondary-soft/30">
        <div className="text-center mb-16 select-none">
          <span className="font-mono text-[12px] tracking-[4px] uppercase text-brand">Cybernetic Shields</span>
          <h2 className="font-audiowide font-bold text-3xl md:text-4xl text-heading uppercase tracking-wider mt-2">
            AI Prevention Pipeline
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-sm text-body">
            We intercept cyberattacks at multiple layers across four specialized systems, operating in tandem at extreme speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 select-none">
          {CORE_FEATURES.map((feat) => (
            <div 
              key={feat.id}
              className="bg-neutral-primary-soft border border-default p-8 clip-card relative flex gap-5 hover:border-brand-soft hover:-translate-y-1 transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-sm border border-brand-medium/50 bg-brand-softer/50 flex items-center justify-center self-start">
                {feat.id === "anomaly" && <Activity className="w-5 h-5 text-brand" />}
                {feat.id === "behavioral" && <Cpu className="w-5 h-5 text-brand" />}
                {feat.id === "realtime" && <Zap className="w-5 h-5 text-brand" />}
                {feat.id === "explainable" && <FileText className="w-5 h-5 text-brand" />}
              </div>
              <div>
                <h3 className="font-audiowide text-[15px] text-heading uppercase tracking-wider mb-2 flex items-center gap-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-body leading-relaxed mb-4">
                  {feat.desc}
                </p>
                <div className="bg-neutral-secondary-medium/60 p-3 rounded-none border-l-2 border-brand font-mono text-[11px] text-body-subtle">
                  {feat.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE LIVE PROBE TERMINAL */}
      <section id="probe" className="max-w-[1152px] mx-auto px-6 py-24 border-t border-default-medium">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 select-none">
            <span className="font-mono text-[12px] tracking-[4px] uppercase text-brand">Live Telemetry Deck</span>
            <h2 className="font-audiowide font-bold text-3xl text-heading uppercase tracking-wider mt-2 mb-4">
              Inspect A Live Cyber Probe
            </h2>
            <p className="text-sm text-body leading-relaxed mb-6">
              Push an active transaction packet through our core AI evaluator. Watch it digest temporal geolocation drift, biometric handshake status, and network signatures to issue a real-time risk score in milliseconds.
            </p>

            <div className="space-y-4 border border-default p-4 bg-neutral-primary-soft clip-card">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase text-heading">CORE DETECTOR CONTROL MODULE:</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-2 border border-default bg-neutral-secondary-soft text-[11px]">
                  <span className="block text-body-subtle">MFA Trigger:</span>
                  <span className="text-heading font-bold font-audiowide">{coreRules.mfaThreshold} Risk</span>
                </div>
                <div className="p-2 border border-default bg-neutral-secondary-soft text-[11px]">
                  <span className="block text-body-subtle">Auto-Block:</span>
                  <span className="text-heading font-bold font-audiowide">{coreRules.autoBlockThreshold} Risk</span>
                </div>
              </div>
              <button
                onClick={startProbe}
                disabled={probing}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand text-neutral-primary font-audiowide text-[12px] uppercase tracking-wider clip-btn glint-btn cursor-pointer font-bold disabled:opacity-50"
              >
                {probing ? (
                  <>
                    <Terminal className="w-4 h-4 animate-spin text-[12px]" />
                    Crunching Node Signals...
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    Inject Security Probe
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-neutral-primary-soft border border-default p-6 clip-card min-h-[300px] flex flex-col justify-between font-mono text-xs text-body relative">
            <div className="absolute top-3 right-4 flex items-center gap-2 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-ping inline-block"></span>
              <span className="text-[10px] text-brand uppercase font-bold text-xs">A-NODE READINESS: OK</span>
            </div>

            <div>
              <div className="border-b border-default pb-2 mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand" />
                <span className="font-audiowide uppercase tracking-wider text-[12px] text-heading">Transaction Inspector Payload</span>
              </div>

              {!probedTx && !probing ? (
                <div className="h-44 flex flex-col items-center justify-center text-center text-body-subtle border border-dashed border-default-strong">
                  <Activity className="w-8 h-8 text-body-subtle/50 mb-3 animate-pulse" />
                  <p>Pending active threat intercept stimulus...</p>
                  <p className="text-[10px] font-mono mt-1">Press "Inject Security Probe" on the control module</p>
                </div>
              ) : probing ? (
                <div className="h-44 flex flex-col items-center justify-center text-center text-brand">
                  <Terminal className="w-8 h-8 text-brand animate-spin mb-3" />
                  <p className="animate-pulse">DECRYPTING CYBER PACKET HEADERS...</p>
                  <p className="text-[10px] text-body-subtle leading-loose">Evaluating behavior vectors against security grids</p>
                </div>
              ) : probedTx ? (
                <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 leading-none">
                    <p className="p-2 border border-default bg-neutral-secondary-soft">
                      <span className="block text-[9px] text-body-subtle mb-1">PACKET ID</span>
                      <span className="text-heading font-medium">{probedTx.id}</span>
                    </p>
                    <p className="p-2 border border-default bg-neutral-secondary-soft">
                      <span className="block text-[9px] text-body-subtle mb-1">AMOUNT (EUROD)</span>
                      <span className="text-heading font-medium">${probedTx.amount}</span>
                    </p>
                    <p className="p-2 border border-default bg-neutral-secondary-soft">
                      <span className="block text-[9px] text-body-subtle mb-1">MERCHANT SOURCE</span>
                      <span className="text-brand font-medium truncate block">{probedTx.merchant}</span>
                    </p>
                    <p className="p-2 border border-default bg-neutral-secondary-soft">
                      <span className="block text-[9px] text-body-subtle mb-1">LOCATION</span>
                      <span className="text-heading font-medium truncate block">{probedTx.location}</span>
                    </p>
                  </div>

                  <div className="p-3 border border-default bg-neutral-secondary-medium">
                    <div className="flex justify-between items-center mb-2 border-b border-default pb-1 leading-none">
                      <span className="text-[10px] text-body-subtle">RISK ASSESSMENT VALUE</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-body">Score:</span>
                        <span className={`font-audiowide font-bold text-sm ${
                          probedTx.riskScore >= coreRules.autoBlockThreshold ? 'text-danger' :
                          probedTx.riskScore >= coreRules.mfaThreshold ? 'text-warning' : 'text-[#00E676]'
                        }`}>
                          {probedTx.riskScore} / 100
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-default pb-1 mb-2 leading-none">
                      <span className="text-[10px] text-body-subtle">COGNITIVE VERDICT</span>
                      <span className={`font-audiowide text-[11px] px-2 py-0.5 rounded-none font-bold uppercase ${
                        probedTx.status === 'Flagged' ? 'bg-danger-soft text-danger border border-danger-medium' :
                        probedTx.status === 'Under Review' ? 'bg-warning-soft text-warning border border-warning-medium' :
                        'bg-success-soft text-[#00E676] border border-success-medium'
                      }`}>
                        {probedTx.status === 'Flagged' ? 'CRITICAL SIGNAL HALTED' :
                         probedTx.status === 'Under Review' ? 'REQUIRE DYNAMIC MFA' :
                         'VERIFIED & SECURED'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-body-subtle mb-1 uppercase text-heading font-bold font-audiowide">Anomaly Diagnostic Reason:</span>
                      <p className="text-[10.5px] leading-relaxed text-heading italic">
                        "{probedTx.explainReasons?.[0]}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-default pt-3 mt-4 flex items-center justify-between text-body-subtle text-[10px] select-none">
              <span className="flex items-center gap-1.5 uppercase font-mono">
                <Code className="w-3.5 h-3.5 text-brand" /> Express Response: 42ms Latency
              </span>
              <span>Threat Score Indexer v3</span>
            </div>
          </div>
        </div>
      </section>

      {/* BENCHMARKING COMPARISON */}
      <section id="comparison" className="max-w-[1152px] mx-auto px-6 py-24 border-t border-default-medium">
        <div className="text-center mb-16 select-none">
          <span className="font-mono text-[12px] tracking-[4px] uppercase text-brand">Sovereign Performance</span>
          <h2 className="font-audiowide font-bold text-3xl md:text-4xl text-heading uppercase tracking-wider mt-2">
            Industry Benchmarking
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-sm text-body">
            Compare our real-time behavioral posture telemetry against traditional rule models.
          </p>
        </div>

        <div className="overflow-x-auto bg-neutral-primary-soft border border-default clip-card shadow-lg">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-neutral-secondary-soft border-b border-default font-audiowide text-heading tracking-wider uppercase select-none">
                <th className="p-6">Protection Engine Class</th>
                <th className="p-6">Real-Time Action</th>
                <th className="p-6">Behavior Analysis</th>
                <th className="p-6">Adaptive ML Retraining</th>
                <th className="p-6 text-brand">False Positive Rate</th>
                <th className="p-6">Integration Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default">
              {COMPETING_VENDORS.map((vendor, index) => {
                const isUs = vendor.name.includes("CityGuard");
                return (
                  <tr 
                    key={index}
                    className={`transition-colors text-xs ${isUs ? 'bg-brand-softer/30 text-heading font-medium' : 'hover:bg-neutral-secondary-soft/40'}`}
                  >
                    <td className="p-6 font-mono font-bold flex items-center gap-2">
                      {isUs && <Shield className="w-4 h-4 text-brand inline" />}
                      {vendor.name}
                    </td>
                    <td className="p-6">
                      <span className={`px-2 py-0.5 font-mono text-[10px] ${
                        vendor.proactive === 'Yes (Real-time Block)' ? 'bg-brand/10 text-brand' :
                        vendor.proactive === 'No' ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'
                      }`}>
                        {vendor.proactive}
                      </span>
                    </td>
                    <td className="p-6 font-mono">{vendor.behavioral}</td>
                    <td className="p-6 font-mono">{vendor.learning}</td>
                    <td className={`p-6 font-mono font-bold ${isUs ? 'text-brand' : 'text-body'}`}>
                      {vendor.falsePositiveRate}
                    </td>
                    <td className="p-6 font-mono">{vendor.integration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* PERFORMANCE METRICS STRIP */}
      <section className="bg-neutral-secondary-soft border-t border-b border-default-medium py-10 select-none">
        <div className="max-w-[1152px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-audiowide text-brand text-2xl font-bold tracking-wider">0.92 precision</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-body-subtle mt-1">Sovereign precision score</div>
          </div>
          <div>
            <div className="font-audiowide text-brand text-2xl font-bold tracking-wider">0.85 recall</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-body-subtle mt-1">Incident capture performance</div>
          </div>
          <div>
            <div className="font-audiowide text-[#00E676] text-2xl font-bold tracking-wider">&lt; 42ms</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-body-subtle mt-1">Connection socket evaluation</div>
          </div>
          <div>
            <div className="font-audiowide text-brand text-2xl font-bold tracking-wider">~3.2%</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-body-subtle mt-1">False Positive Outlier Rate</div>
          </div>
        </div>
      </section>

      {/* CLOSING REGISTER CTA */}
      <section className="max-w-[1152px] mx-auto px-6 py-24 text-center select-none">
        <div className="max-w-2xl mx-auto border border-brand bg-brand-softer/10 p-12 clip-card shadow-[0_0_20px_rgba(84,234,253,0.05)] relative overflow-hidden">
          {/* Decorative scanner line */}
          <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-brand/20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-brand/20"></div>

          <Shield className="w-12 h-12 text-brand mx-auto mb-6" />
          <h2 className="font-audiowide font-bold text-3xl text-heading tracking-wider uppercase mb-4">
            Command Your Network Security
          </h2>
          <p className="font-sans text-sm text-body leading-relaxed mb-8">
            Stop reactive recovery fires. Connect your transaction and account telemetry pipelines today and instantly monitor abnormal behaviors in standard cyber dashboards.
          </p>
          <button 
            onClick={onEnterTerminal}
            className="px-8 py-4 bg-brand text-neutral-primary font-audiowide uppercase tracking-wider text-sm clip-btn glint-btn cursor-pointer inline-flex items-center gap-2 font-bold"
          >
            Enter Guard Room
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-[1152px] mx-auto px-6 pt-12 border-t border-default text-center text-xs text-body-subtle font-mono">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2026 CityGuard CyberLabs Inc. Sovereign Threat Intelligence Systems.</p>
          <div className="flex gap-6 uppercase text-[10px] tracking-wider font-audiowide">
            <a href="#stats" className="hover:text-brand transition-colors">Incident Logs</a>
            <a href="#features" className="hover:text-brand transition-colors">Telemetry Matrix</a>
            <span className="text-body-subtle/30">|</span>
            <span className="text-[#00E676]">SECURITY NODE // LIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
