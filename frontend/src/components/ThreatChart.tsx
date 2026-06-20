/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ThreatChartPoint {
  time: string;
  processed: number;
  flagged: number;
  mfaPrompter: number;
  avgRiskScore: number;
}

interface ThreatChartProps {
  trendData: ThreatChartPoint[];
}

export default function ThreatChart({ trendData }: ThreatChartProps) {
  return (
    <div className="bg-neutral-primary-soft border border-default p-5.5 clip-card relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-default pb-3.5 mb-5 select-none">
        <div>
          <span className="font-mono text-[9px] tracking-[3px] text-brand uppercase block">Security Telemetry Analyzer</span>
          <h3 className="font-audiowide uppercase text-sm tracking-wider text-heading font-bold mt-0.5">
            Anomalic Surge vs Processed Packets
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-brand/30 border border-brand block"></span>
            <span className="text-body">Processed Envelopes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-danger/30 border border-danger block"></span>
            <span className="text-body">Flagged Attacks</span>
          </div>
        </div>
      </div>

      <div className="h-[210px] w-full font-sans text-[10px] text-body-subtle select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#54EAFD" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#54EAFD" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF1744" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#FF1744" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#14141E" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#5C5D72" 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#5C5D72" 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0A0A10', 
                borderColor: '#1E1E2C',
                color: '#EEEEF6',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="processed" 
              stroke="#54EAFD" 
              fillOpacity={1} 
              fill="url(#colorProcessed)" 
              strokeWidth={1.5}
              name="Processed (Total)"
            />
            <Area 
              type="monotone" 
              dataKey="flagged" 
              stroke="#FF1744" 
              fillOpacity={1} 
              fill="url(#colorFlagged)" 
              strokeWidth={1.5}
              name="Anomalies (Flagged)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
