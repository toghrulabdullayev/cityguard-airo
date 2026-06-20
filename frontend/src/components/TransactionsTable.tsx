/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Terminal, 
  Search, 
  ShieldAlert, 
  Cpu, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Transaction, SecurityRules } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  selectedTxId: string | null;
  setSelectedTxId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: 'All' | 'Verified' | 'Flagged' | 'Under Review';
  setStatusFilter: (f: 'All' | 'Verified' | 'Flagged' | 'Under Review') => void;
  rules: SecurityRules;
  activeTx: Transaction | null;
  handleOverrideStatus: (txId: string, newStatus: Transaction['status']) => void;
}

export default function TransactionsTable({
  transactions,
  filteredTransactions,
  selectedTxId,
  setSelectedTxId,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  rules,
  activeTx,
  handleOverrideStatus
}: TransactionsTableProps) {
  const [showAllReasons, setShowAllReasons] = React.useState(false);

  React.useEffect(() => {
    setShowAllReasons(false);
  }, [activeTx?.id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* RECENT TRANSACTIONS LEDGER (8 COLS) */}
      <div className="lg:col-span-8 bg-neutral-primary-soft border border-default p-5.5 clip-card flex flex-col justify-between min-h-[500px]">
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-default pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand" />
              <div>
                <h3 className="font-audiowide uppercase text-sm text-heading tracking-wider font-bold">
                  Telemetry Ledger Stream
                </h3>
                <p className="text-[10px] font-mono text-body-subtle uppercase mt-0.5">
                  Updated live // Real-time packet polling active
                </p>
              </div>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-body-subtle" />
                <input 
                  type="text" 
                  placeholder="Search Node / Merchant..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-neutral-secondary-medium border border-default-medium text-heading text-[11px] font-mono outline-none focus:border-brand w-44"
                />
              </div>

              {/* Filter Selector */}
              <div className="flex items-center gap-1 bg-neutral-secondary-medium p-1 border border-default-medium select-none">
                {(['All', 'Verified', 'Under Review', 'Flagged'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-2.5 py-1 text-[10px] font-mono uppercase transition-all tracking-wide cursor-pointer ${
                      statusFilter === tab 
                        ? 'bg-neutral-tertiary-medium text-brand font-bold' 
                        : 'text-body hover:text-heading hover:bg-neutral-tertiary/20'
                    }`}
                  >
                    {tab === 'Under Review' ? 'MFA' : tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LEDGER TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs min-w-[650px]">
              <thead>
                <tr className="bg-neutral-secondary-soft text-body-subtle uppercase font-mono text-[10px] tracking-wider border-b border-default">
                  <th className="p-3">Packet ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Merchant Target</th>
                  <th className="p-3 text-right">Invoice Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Location</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default font-mono">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-body-subtle">
                      <ShieldAlert className="w-8 h-8 text-body-subtle/40 mx-auto mb-3 animate-pulse" />
                      No transaction packets found matching the query.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isSelected = tx.id === selectedTxId;
                    
                    // Contextual highlight color classes
                    let scoreColorClass = 'text-[#00E676]';
                    let badgeClass = 'bg-success-soft text-[#00E676] border-success-medium';
                    
                    if (tx.riskScore >= rules.autoBlockThreshold) {
                      scoreColorClass = 'text-danger font-bold';
                      badgeClass = 'bg-danger-soft text-danger border-danger-medium';
                    } else if (tx.riskScore >= rules.mfaThreshold) {
                      scoreColorClass = 'text-warning font-bold';
                      badgeClass = 'bg-warning-soft text-warning border-warning-medium';
                    }

                    return (
                      <tr
                        key={tx.id}
                        onClick={() => setSelectedTxId(tx.id)}
                        className={`cursor-pointer transition-colors text-[11px] hover:bg-neutral-secondary-soft/50 ${
                          isSelected ? 'bg-neutral-secondary-medium border-l-2 border-brand font-medium' : ''
                        }`}
                      >
                        <td className="p-3 font-semibold text-heading">{tx.id}</td>
                        <td className="p-3 text-body-subtle">{tx.timestamp}</td>
                        <td className="p-3 text-heading flex items-center gap-1.5 max-w-[150px] truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand/30 inline-block"></span>
                          {tx.merchant}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`px-1.5 py-0.5 rounded-sm bg-neutral-secondary-soft ${scoreColorClass}`}>
                            {tx.riskScore}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 text-[9px] uppercase border font-bold ${badgeClass}`}>
                            {tx.status === 'Under Review' ? 'MFA Pending' : tx.status}
                          </span>
                        </td>
                        <td className="p-3 text-body-subtle truncate max-w-[130px]">{tx.location}</td>
                        <td className="p-3 text-right text-heading font-medium">${tx.amount.toFixed(2)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-body-subtle font-mono border-t border-default pt-3.5 mt-3.5">
          <span>Showing {filteredTransactions.length} of {transactions.length} buffered streams</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#00E676] rounded-full animate-ping text-[10px]"></span>
            Autopilot: Generates 1 stream loop / 3.8s
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: CORE SEC DIAGNOSTICS & ACTIONS (4 COLS) */}
      <div className="lg:col-span-4 flex flex-col justify-between bg-neutral-primary-soft border border-default p-6 clip-card lg:sticky lg:top-6 self-start shadow-lg relative min-h-[500px]">
        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-brand/20"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-brand/20"></div>

        {/* Content area */}
        <div>
          <div className="border-b border-default pb-4.5 mb-5 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand" />
            <div>
              <h3 className="font-audiowide uppercase text-xs tracking-wider text-heading font-bold">
                Security Core Diagnostics
              </h3>
              <p className="text-[9px] font-mono text-body-subtle uppercase mt-0.5">
                Explainable AI Diagnostics Block
              </p>
            </div>
          </div>

          {activeTx ? (
            <div className="space-y-5 font-mono text-xs">
              {/* Ledger node address block */}
              <div className="p-3.5 bg-neutral-secondary-medium/90 border border-default-medium">
                <span className="text-[9px] text-[#54EAFD] uppercase block tracking-wider font-bold mb-1">
                  ANALYST OVERVIEW
                </span>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-[11px] leading-tight mt-1.5">
                  <div>
                    <span className="block text-[8.5px] text-body-subtle">ENVELOPE NO</span>
                    <span className="text-heading font-bold text-[12px]">{activeTx.id}</span>
                  </div>
                  <div>
                    <span className="block text-[8.5px] text-body-subtle">RISK SCORE:</span>
                    <span className={`text-[12px] font-audiowide font-bold ${
                      activeTx.riskScore >= rules.autoBlockThreshold ? 'text-danger' :
                      activeTx.riskScore >= rules.mfaThreshold ? 'text-warning' : 'text-[#00E676]'
                    }`}>
                      {activeTx.riskScore} / 100
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8.5px] text-body-subtle">VAL (EUROD)</span>
                    <span className="text-heading font-bold">${activeTx.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-[8.5px] text-body-subtle">TIME CHIP</span>
                    <span className="text-heading">{activeTx.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Customer Identity Card */}
              <div className="space-y-2 text-[11px]">
                <span className="text-[9px] text-[rgba(84,234,253,0.6)] uppercase block tracking-wider font-bold">
                  COGNITIVE POSTURE FIELDS
                </span>
                <div className="space-y-1.5 leading-relaxed bg-neutral-secondary-soft/50 p-3 border border-default text-body">
                  <p className="flex justify-between">
                    <span>Customer Email:</span>
                    <span className="text-heading font-medium truncate block max-w-[140px]">{activeTx.customerEmail}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Device Model:</span>
                    <span className="text-heading font-medium truncate block max-w-[140px]">{activeTx.deviceType}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Settlement Class:</span>
                    <span className="text-[#00E676]">{activeTx.cardType}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Geo Coordinate:</span>
                    <span className="text-heading truncate block max-w-[140px]">{activeTx.location}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Category Node:</span>
                    <span className="text-heading">{activeTx.merchantCategory}</span>
                  </p>
                </div>
              </div>

              {/* AI Explain reasons */}
              <div className="space-y-2">
                <span className="text-[9px] text-danger-strong uppercase block tracking-wider font-bold">
                  EXPLAINABLE REASONS FOR SHIELD COGNITION
                </span>
                <div className="p-3.5 bg-neutral-secondary-medium/60 border border-default border-l-2 border-brand">
                  {activeTx.explainReasons && activeTx.explainReasons.length > 0 ? (
                    <div>
                      <ul className="space-y-2 text-[11px] text-heading leading-relaxed list-disc pl-3">
                        {activeTx.explainReasons.slice(0, showAllReasons ? activeTx.explainReasons.length : 1).map((reason, rIdx) => (
                          <li key={rIdx} className="italic text-heading">
                            "{reason}"
                          </li>
                        ))}
                      </ul>
                      {activeTx.explainReasons.length > 1 && (
                        <div className="mt-2.5 pt-2 border-t border-default/40 flex justify-end">
                          <button
                            onClick={() => setShowAllReasons(!showAllReasons)}
                            className="text-[9px] font-mono uppercase bg-neutral-primary px-2.5 py-1 border border-default-strong hover:text-brand hover:border-brand-medium text-heading transition-all cursor-pointer select-none font-bold"
                          >
                            {showAllReasons ? 'Truncate Details ▲' : `Review All Details (${activeTx.explainReasons.length}) ▼`}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-body-subtle italic"> No anomalic variances reported for this transaction vector envelope.</p>
                  )}
                </div>
              </div>

              {/* Live Biometric Posture Metric */}
              <div className="space-y-1.5 p-3.5 bg-neutral-secondary-soft border border-default">
                <div className="flex justify-between text-[10px] text-body-subtle uppercase leading-none mb-1.5">
                  <span>Neural Posture Stability:</span>
                  <span className={activeTx.riskScore > 65 ? 'text-danger' : 'text-[#00E676]'}>
                    {Math.max(12, 100 - activeTx.riskScore)}% Confidence
                  </span>
                </div>
                <div className="w-full bg-neutral-tertiary-medium h-2">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      activeTx.riskScore >= rules.autoBlockThreshold ? 'bg-danger' :
                      activeTx.riskScore >= rules.mfaThreshold ? 'bg-warning' : 'bg-[#00E676]'
                    }`}
                    style={{ width: `${Math.max(12, 100 - activeTx.riskScore)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center text-body-subtle">
              <Cpu className="w-8 h-8 text-body-subtle/50 mb-3 animate-pulse" />
              <p>Awaiting signature packet...</p>
            </div>
          )}
        </div>

        {/* COMMAND VERDICT OVERRIDES */}
        <div className="border-t border-default pt-5 mt-6 space-y-3.5">
          <span className="text-[9px] text-body-subtle font-mono uppercase block tracking-wider leading-none">
            MANUAL ANALYST COMMAND BRIDGE
          </span>
          
          <div className="grid grid-cols-2 gap-3.5 text-xs font-audiowide">
            {/* Override Approve */}
            <button
              disabled={!activeTx || activeTx.status === 'Verified'}
              onClick={() => activeTx && handleOverrideStatus(activeTx.id, 'Verified')}
              className="px-3.5 py-3 border border-[#00C060] bg-[#001A10] hover:bg-[#002E1B] text-[#00E676] tracking-wider uppercase clip-btn inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              Settle / Pass
            </button>

            {/* Override Revoke */}
            <button
              disabled={!activeTx || activeTx.status === 'Flagged'}
              onClick={() => activeTx && handleOverrideStatus(activeTx.id, 'Flagged')}
              className="px-3.5 py-3 border border-danger bg-danger-soft hover:bg-danger-medium text-danger tracking-wider uppercase clip-btn inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              Revoke / Ban
            </button>
          </div>

          <div className="p-2.5 bg-neutral-secondary-soft text-[10px] text-body-subtle font-mono leading-relaxed border-l-2 border-danger-strong select-none">
            WARNING: Overriding coordinates publishes audit key signatures permanently to the ledger vault.
          </div>
        </div>
      </div>
    </div>
  );
}
