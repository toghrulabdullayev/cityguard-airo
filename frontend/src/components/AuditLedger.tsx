/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Download, Search, ShieldAlert, X, Cpu, User, Globe, CreditCard, DollarSign } from 'lucide-react';
import { Transaction, SecurityRules } from '../types';

interface AuditLedgerProps {
  filteredTransactions: Transaction[];
  transactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: 'All' | 'Verified' | 'Flagged' | 'Under Review';
  setStatusFilter: (f: 'All' | 'Verified' | 'Flagged' | 'Under Review') => void;
  rules: SecurityRules;
  handleExportJSONLog: () => void;
}

export default function AuditLedger({
  filteredTransactions,
  transactions,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  rules,
  handleExportJSONLog
}: AuditLedgerProps) {
  const [detailedTx, setDetailedTx] = React.useState<Transaction | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-default pb-4">
        <div>
          <span className="font-mono text-xs tracking-[4px] uppercase text-brand">IMMUTABLE LOGS</span>
          <h2 className="font-audiowide font-bold text-2xl text-heading uppercase tracking-wider mt-1">
            Telemetry Ledger Audit Vault
          </h2>
          <p className="text-sm text-body mt-2 leading-relaxed">
            View, search, and extract full transaction logs permanently stored in memory context. Click on items to review secure network payloads.
          </p>
        </div>

        <div className="flex gap-3 select-none">
          <button 
            onClick={handleExportJSONLog}
            className="px-5 py-3 border border-brand bg-brand-softer text-brand hover:bg-brand hover:text-neutral-primary font-audiowide uppercase text-xs tracking-wider clip-btn cursor-pointer transition-all flex items-center gap-2 shadow-md shadow-brand/10 font-bold"
          >
            <Download className="w-4 h-4" />
            Download JSON Audit
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS IN AUDIT */}
      <div className="bg-neutral-primary-soft border border-default p-4 clip-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-body-subtle" />
          <input 
            type="text" 
            placeholder="Search ID, Merchant, or Location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2.5 w-full bg-neutral-secondary-medium border border-default-medium text-heading text-[12px] font-mono outline-none focus:border-brand"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-secondary-medium p-1 border border-default-medium w-full md:w-auto overflow-x-auto select-none">
          {(['All', 'Verified', 'Under Review', 'Flagged'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 md:flex-none text-center px-4.5 py-1.5 text-[10.5px] font-mono uppercase transition-all tracking-wide cursor-pointer ${
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

      {/* HIGH RES EXPANDED DATATABLE */}
      <div className="bg-neutral-primary-soft border border-default clip-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs min-w-[800px]">
            <thead>
              <tr className="bg-neutral-secondary-soft text-body-subtle uppercase font-mono text-[10.5px] tracking-wider border-b border-default select-none">
                <th className="p-4">Packet ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Merchant Source</th>
                <th className="p-4">Card Type</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Anomaly Verdict</th>
                <th className="p-4">Geo Location</th>
                <th className="p-4 text-right">Sum Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default font-mono">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-16 text-center text-body-subtle">
                    <ShieldAlert className="w-10 h-10 text-body-subtle/30 mx-auto mb-4 animate-pulse" />
                    No ledger recordings matched the query criteria. Try clearing search filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
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
                      onClick={() => setDetailedTx(tx)}
                      className="hover:bg-neutral-secondary-strong/60 transition-colors text-xs cursor-pointer select-none border-b border-default last:border-0"
                    >
                      <td className="p-4 text-heading font-bold">{tx.id}</td>
                      <td className="p-4 text-body-subtle">{tx.timestamp}</td>
                      <td className="p-4 text-heading font-medium">{tx.merchant}</td>
                      <td className="p-4 text-body-subtle uppercase text-[10px]">{tx.cardType} ({tx.deviceType})</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-sm bg-neutral-secondary-soft/80 border border-default font-audiowide font-bold ${scoreColorClass}`}>
                          {tx.riskScore}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 text-[9px] uppercase border font-bold ${badgeClass}`}>
                          {tx.status === 'Under Review' ? 'MFA Challenge' : tx.status === 'Verified' ? 'SATELLITE CLEAR' : 'HALTED'}
                        </span>
                      </td>
                      <td className="p-4 text-body-subtle">{tx.location}</td>
                      <td className="p-4 text-right text-heading font-medium font-audiowide">${tx.amount.toFixed(2)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-secondary-soft/50 text-[10.5px] font-mono text-body-subtle border-t border-default select-none">
          <span>Buffered Cache: {filteredTransactions.length} records published to view (Click row to inspect payload details)</span>
          <div className="flex gap-2.5">
            <span className="text-[#00E676]">● LIVE SYNC STABLE</span>
            <span>MD5 checksum: sha256_verified</span>
          </div>
        </div>
      </div>

      {/* IMMUTABLE LEDGER DETAILS OVERLAY MODAL */}
      {detailedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setDetailedTx(null)}
          ></div>

          {/* Modal Container */}
          <div 
            className="w-full max-w-lg bg-neutral-primary border border-default-strong p-6 relative shadow-2xl z-10 clip-card select-none"
            style={{ clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)' }}
            role="dialog"
            aria-modal="true"
          >
            {/* Corner highlights */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand/30"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-brand/30"></div>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-default pb-3.5 mb-5">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand animate-pulse" />
                <span className="font-audiowide text-sm text-heading uppercase tracking-wider">
                  Audit Telemetry Payload
                </span>
              </div>
              <button 
                onClick={() => setDetailedTx(null)}
                className="text-body-subtle hover:text-brand transition-colors cursor-pointer"
                aria-label="Close payload details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 font-mono text-xs text-body">
              {/* Token Core ID row */}
              <div className="p-3 bg-neutral-secondary-soft border border-default flex justify-between items-center">
                <span className="text-[10px] text-body-subtle uppercase">Packet Hash Reference</span>
                <span className="text-brand font-bold uppercase">{detailedTx.id}</span>
              </div>

              {/* Grid properties */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3 bg-black/30 border border-default flex flex-col justify-between">
                  <span className="text-[9px] text-body-subtle uppercase">Hazard Index Range</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`font-audiowide text-lg font-bold ${
                      detailedTx.riskScore >= rules.autoBlockThreshold ? 'text-danger' : 
                      detailedTx.riskScore >= rules.mfaThreshold ? 'text-warning' : 'text-[#00E676]'
                    }`}>
                      {detailedTx.riskScore} // 100
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-black/30 border border-default flex flex-col justify-between">
                  <span className="text-[9px] text-body-subtle uppercase">Automated Verdict</span>
                  <span className={`inline-block py-0.5 text-[9px] uppercase font-bold mt-1 ${
                    detailedTx.status === 'Verified' ? 'text-[#00E676]' :
                    detailedTx.status === 'Under Review' ? 'text-warning font-bold' : 'text-danger font-bold'
                  }`}>
                    {detailedTx.status === 'Under Review' ? 'MFA REQUIRED' : detailedTx.status === 'Verified' ? 'SATELLITE CLEAR' : 'BLOCK HALTED'}
                  </span>
                </div>
              </div>

              <div className="border border-default bg-neutral-primary-soft/40 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-default pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand" />
                    <span className="text-[10px] text-heading uppercase">Client Entity ID</span>
                  </div>
                  <span className="text-right text-heading text-[11px] font-medium">{detailedTx.customerEmail}</span>
                </div>

                <div className="flex items-center justify-between border-b border-default pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-brand" />
                    <span className="text-[10px] text-heading uppercase">Geolocation Node</span>
                  </div>
                  <span className="text-right text-heading text-[11px] font-medium">{detailedTx.location}</span>
                </div>

                <div className="flex items-center justify-between border-b border-default pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-brand" />
                    <span className="text-[10px] text-heading uppercase">Device & Card Protocol</span>
                  </div>
                  <span className="text-right text-heading text-[11px] font-medium uppercase">{detailedTx.cardType} ({detailedTx.deviceType})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#00E676]" />
                    <span className="text-[10px] text-heading uppercase font-bold">Sum Invoice Charge</span>
                  </div>
                  <span className="text-right text-[#00E676] text-sm font-audiowide font-bold">${detailedTx.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Anomaly explain reasons */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-body-subtle uppercase tracking-wider block">Cognitive Logic & Anomaly Indicators</span>
                <div className="p-3.5 bg-neutral-secondary-medium/60 border border-default border-l-2 border-brand text-[11px] leading-relaxed text-heading italic">
                  {detailedTx.explainReasons && detailedTx.explainReasons.length > 0 ? (
                    <ul className="space-y-1.5 list-disc pl-3">
                      {detailedTx.explainReasons.map((reason, rIdx) => (
                        <li key={rIdx}>"{reason}"</li>
                      ))}
                    </ul>
                  ) : (
                    "No anomalous variances reported for this transaction vector envelope."
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-default pt-4 mt-6 flex justify-end">
              <button 
                onClick={() => setDetailedTx(null)}
                className="px-5 py-2.5 bg-brand text-neutral-primary font-audiowide uppercase text-xs tracking-wider clip-btn cursor-pointer font-bold duration-150 transition-all hover:bg-brand-strong"
                style={{ clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' }}
              >
                Close Payload Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
