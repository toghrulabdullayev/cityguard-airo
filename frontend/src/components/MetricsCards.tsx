import React from 'react';
import { TrendingUp, Database, ShieldAlert, Activity } from 'lucide-react';

interface MetricsCardsProps {
  currentMetrics: {
    rate: number;
    alertsCount: number;
  };
  cumulativeStats: {
    processedCount: number;
    liveTps: number;
    activeAlerts: number;
  };
}

export default function MetricsCards({ currentMetrics, cumulativeStats }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-neutral-primary-soft border border-default p-4.5 clip-card shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-body-subtle">Detection Rate</span>
          <TrendingUp className="w-4 h-4 text-brand" />
        </div>
        <div className="font-audiowide text-2xl font-bold text-heading">
          {currentMetrics.rate}%
        </div>
        <p className="text-[10px] font-mono text-brand/80 mt-1 flex items-center gap-1 leading-none uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block pulse-led"></span>
          AI Precision Model
        </p>
      </div>

      <div className="bg-neutral-primary-soft border border-default p-4.5 clip-card shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-body-subtle">Payments Processed</span>
          <Database className="w-4 h-4 text-brand" />
        </div>
        <div className="font-audiowide text-2xl font-bold text-heading">
          {cumulativeStats.processedCount.toLocaleString()}
        </div>
        <p className="text-[10px] font-mono text-body-subtle mt-1 flex items-center gap-1 leading-none uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] inline-block"></span>
          Live sync active
        </p>
      </div>

      <div className="bg-neutral-primary-soft border border-default p-4.5 clip-card shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-body-subtle">Active Alerts</span>
          <ShieldAlert className="w-4 h-4 text-danger-strong" />
        </div>
        <div className="font-audiowide text-2xl font-bold text-danger-strong">
          {cumulativeStats.activeAlerts}
        </div>
        <p className="text-[10px] font-mono text-danger mt-1 flex items-center gap-1 leading-none uppercase animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block"></span>
          Require admin review
        </p>
      </div>

      <div className="bg-neutral-primary-soft border border-default p-4.5 clip-card shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-body-subtle">Evaluations / Sec</span>
          <Activity className="w-4 h-4 text-brand" />
        </div>
        <div className="font-audiowide text-2xl font-bold text-[#00E676]">
          {cumulativeStats.liveTps} Hz
        </div>
        <p className="text-[10px] font-mono text-body-subtle mt-1 flex items-center gap-1 leading-none uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] inline-block"></span>
          Sub-42ms latency
        </p>
      </div>
    </div>
  );
}
