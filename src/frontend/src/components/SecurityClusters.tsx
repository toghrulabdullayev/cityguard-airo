import React from 'react';
import { RefreshCw, Terminal } from 'lucide-react';
import { SecurityRules } from '../types';

interface SecurityClustersProps {
  nodePingTimes: Record<string, number>;
  nodeLoads: Record<string, number>;
  triggerPingReload: () => void;
  pingingNodes: boolean;
  rules: SecurityRules;
}

export default function SecurityClusters({
  nodePingTimes,
  nodeLoads,
  triggerPingReload,
  pingingNodes,
  rules
}: SecurityClustersProps) {
  const [logs, setLogs] = React.useState<Array<{ text: string; color?: string; time: string }>>([
    { text: `[OK] Synchronized gate thresholds (MFA: ${rules.mfaThreshold}, Auto-Block: ${rules.autoBlockThreshold}) across Baku Central, Sumqayit, Ganja, Khazar`, color: 'text-[#00E676]', time: '02:54:10' },
    { text: '[INFO] Geo-location mismatch evaluation layer: ACTIVE', time: '02:54:11' },
    { text: '[INFO] Citizen behavioral pattern matcher: ONLINE, polling rate 24.8 Hz', time: '02:54:11' },
    { text: '[CONNECT] Municipal payment proxy interface verified with TLS 1.3', color: 'text-brand', time: '02:54:12' },
    { text: '[OK] Ledger integrity checked - 0 discrepancies found', color: 'text-[#00E676]', time: '02:54:13' }
  ]);

  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const daemonMessages = [
      { text: '[OK] Healthcheck packet passed from Baku Central Smart Grid.', color: 'text-[#00E676]' },
      { text: '[WARN] Impossible travel detected on Citizen 0xEF91 - payment rejected.', color: 'text-warning' },
      { text: '[INFO] Initializing ephemeral dynamic key challenge for parking payment.', color: 'text-brand' },
      { text: '[OK] Secure credential cert hash verified for transit kiosk.', color: 'text-[#00E676]' },
      { text: '[INFO] Rebalancing cluster node weights for peak hour traffic.', color: 'text-body' },
      { text: '[SECURE] AI engine completed sub-second threat scan across all terminals.', color: 'text-[#00E676]' },
      { text: '[OK] Payment ledger blocks synchronized on distributed city clusters.', color: 'text-brand' }
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomMsg = daemonMessages[Math.floor(Math.random() * daemonMessages.length)];
      setLogs(prev => [
        { text: `${randomMsg.text}`, color: randomMsg.color, time: timeStr },
        ...prev
      ].slice(0, 100));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { id: 'baku-central', name: 'Baku Central Smart Grid', region: 'Downtown Data Center', ping: nodePingTimes['baku-central'] || 14, load: nodeLoads['baku-central'] || 28, ip: '10.0.1.10' },
    { id: 'sumqayit', name: 'Sumqayit Industrial Sector', region: 'Western Utility Hub', ping: nodePingTimes['sumqayit'] || 48, load: nodeLoads['sumqayit'] || 12, ip: '10.0.2.20' },
    { id: 'ganja', name: 'Ganja Transit Authority', region: 'Western Regional Node', ping: nodePingTimes['ganja'] || 96, load: nodeLoads['ganja'] || 41, ip: '10.0.3.30' },
    { id: 'khazar', name: 'Khazar Coastal District', region: 'Maritime Infrastructure Zone', ping: nodePingTimes['khazar'] || 33, load: nodeLoads['khazar'] || 15, ip: '10.0.4.40' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div className="border-b border-default pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4 select-none">
        <div>
          <span className="font-mono text-xs tracking-[4px] uppercase text-brand">MUNICIPAL CLUSTERS</span>
          <h2 className="font-audiowide font-bold text-2xl text-heading uppercase tracking-wider mt-1">
            City Infrastructure Status
          </h2>
          <p className="text-sm text-body mt-2 leading-relaxed">
            Monitor processing workload, latency, and health status of defensive AI clusters across all smart city districts.
          </p>
        </div>
        
        <button
          onClick={triggerPingReload}
          disabled={pingingNodes}
          className="px-4.5 py-2.5 bg-neutral-secondary-medium border border-default hover:bg-neutral-tertiary-medium text-[11px] font-audiowide uppercase tracking-wider text-heading inline-flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${pingingNodes ? 'animate-spin' : ''}`} />
          {pingingNodes ? 'PINGING NODES...' : 'Refresh Nodes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="bg-neutral-primary-soft border border-default p-5 clip-card relative overflow-hidden space-y-4 hover:border-brand-medium/40 transition-all">
            
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[9px] font-mono text-[#00E676] font-bold select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] inline-block animate-ping"></span>
              ACTIVE / SECURE
            </div>

            <div className="space-y-1 select-none">
              <span className="text-[10px] font-mono text-brand font-bold uppercase tracking-widest">{node.name}</span>
              <h4 className="font-audiowide text-[13px] text-heading uppercase tracking-wide leading-none">{node.region}</h4>
              <p className="text-[9.5px] font-mono text-body-subtle uppercase leading-none mt-1">NODE IP: {node.ip}</p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="space-y-1 select-none">
                <div className="flex justify-between text-[10px] font-mono text-body-subtle uppercase leading-none">
                  <span>Processing Workload:</span>
                  <span className="text-heading font-bold">{node.load}% Capacity</span>
                </div>
                <div className="w-full bg-neutral-secondary-soft h-1.5">
                  <div 
                    className="bg-brand h-full transition-all duration-500" 
                    style={{ width: `${node.load}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono bg-neutral-secondary-soft p-2.5 border border-default-medium select-none">
                <span>Cluster Ping Latency:</span>
                <span className={`font-bold ${node.ping < 30 ? 'text-[#00E676]' : node.ping < 65 ? 'text-warning' : 'text-danger-strong'}`}>
                  {node.ping}ms {(node.ping < 42) ? '⚡ OPTIMAL' : '✓ STABLE'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-primary-soft border border-default p-5 clip-card space-y-3">
        <div className="flex items-center justify-between border-b border-default pb-2 select-none">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand animate-pulse" />
            <span className="text-[10px] font-audiowide uppercase text-heading tracking-wider">Active Threat Evaluator Log</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[9px] font-mono uppercase bg-neutral-secondary-medium px-2.5 py-1 border border-default-medium hover:text-brand hover:border-brand-medium text-heading transition-all cursor-pointer select-none font-bold"
          >
            {expanded ? 'Collapse ▲' : `View All Logs (${logs.length}) ▼`}
          </button>
        </div>
        <div className={`font-mono text-[10px] text-body-subtle space-y-1 bg-black/40 p-4 border border-default-strong leading-normal custom-scrollbar overflow-y-auto transition-all duration-300 ${expanded ? 'max-h-80' : 'max-h-28'}`}>
          {logs.slice(0, expanded ? logs.length : 4).map((log, index) => (
            <p key={index} className="flex gap-2">
              <span className="text-body-subtle/50 select-none">[{log.time}]</span>
              <span className={log.color || 'text-body-subtle'}>{log.text}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
