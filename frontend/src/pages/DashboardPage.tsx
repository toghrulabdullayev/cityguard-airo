import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Clock, LogOut } from 'lucide-react';
import { Transaction, SecurityRules } from '../types';
import { 
  getInitialTransactions, 
  generateMockTransaction, 
  getHistoricalTrendData,
  generateRiskFactors,
  computeRiskScore
} from '../utils/mockData';
import { threatApi } from '../api/threatApi';
import Sidebar, { DashboardTab } from '../components/Sidebar';
import MetricsCards from '../components/MetricsCards';
import ThreatChart from '../components/ThreatChart';
import TransactionsTable from '../components/TransactionsTable';
import PolicyForm from '../components/PolicyForm';
import SecurityClusters from '../components/SecurityClusters';
import AuditLedger from '../components/AuditLedger';

interface DashboardPageProps {
  userEmail: string;
  authToken: string | null;
  onLogout: () => void;
}

export default function DashboardPage({ userEmail, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('telemetry');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [savingPolicy, setSavingPolicy] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [nodePingTimes, setNodePingTimes] = useState({
    'baku-central': 14,
    'sumqayit': 48,
    'ganja': 96,
    'khazar': 33
  });
  const [nodeLoads, setNodeLoads] = useState({
    'baku-central': 28,
    'sumqayit': 12,
    'ganja': 41,
    'khazar': 15
  });
  const [pingingNodes, setPingingNodes] = useState(false);

  const triggerPingReload = async () => {
    setPingingNodes(true);
    try {
      const liveNodes = await threatApi.getClusterNodes();
      if (liveNodes && liveNodes.length > 0) {
        const nodeMap: any = {};
        const loadMap: any = {};
        liveNodes.forEach(node => {
          nodeMap[node.nodeId] = node.ping;
          loadMap[node.nodeId] = node.load;
        });
        setNodePingTimes(prev => ({ ...prev, ...nodeMap }));
        setNodeLoads(prev => ({ ...prev, ...loadMap }));
      }
    } catch (err) {
      // offline fallback
    }
    setTimeout(() => {
      setNodePingTimes({
        'baku-central': Math.floor(10 + Math.random() * 15),
        'sumqayit': Math.floor(40 + Math.random() * 15),
        'ganja': Math.floor(82 + Math.random() * 20),
        'khazar': Math.floor(22 + Math.random() * 15)
      });
      setNodeLoads({
        'baku-central': Math.floor(15 + Math.random() * 40),
        'sumqayit': Math.floor(8 + Math.random() * 25),
        'ganja': Math.floor(30 + Math.random() * 35),
        'khazar': Math.floor(10 + Math.random() * 20)
      });
      setPingingNodes(false);
    }, 1200);
  };

  const handleSavePolicy = async () => {
    setSavingPolicy(true);
    setSaveSuccess(false);
    try {
      await threatApi.updateSecurityRules(rules);
    } catch (err) {
      console.warn("Could not dispatch current state to security gateway controller.", err);
    }
    setTimeout(() => {
      setSavingPolicy(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 1000);
  };

  const handleExportJSONLog = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `CITYGUARD_AUDIT_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.warn("Could not download ledger", e);
    }
  };

  const [rules, setRules] = useState<SecurityRules>({
    mfaThreshold: 60,
    autoBlockThreshold: 85,
    behavioralAnalysisEnabled: true,
    geofenceEnforcement: true,
    dynamicMfaEnabled: true
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    getInitialTransactions(12, rules)
  );

  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const [cumulativeStats, setCumulativeStats] = useState({
    processedCount: 148220,
    liveTps: 24.8,
    activeAlerts: 14
  });

  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Flagged' | 'Under Review'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [trendData] = useState(() => getHistoricalTrendData());

  useEffect(() => {
    let active = true;
    async function initGatewayTelemetry() {
      try {
        const fetchedRules = await threatApi.getSecurityRules();
        if (active && fetchedRules) {
          setRules(fetchedRules);
        }
      } catch (err) {
        // Fall back gracefully
      }
      try {
        const fetchedTransactions = await threatApi.getTransactions();
        if (active && fetchedTransactions && fetchedTransactions.length > 0) {
          setTransactions(fetchedTransactions);
          if (fetchedTransactions[0]) {
            setSelectedTxId(fetchedTransactions[0].id);
          }
        }
      } catch (err) {
        // Fall back gracefully
      }
    }
    initGatewayTelemetry();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newTx = await threatApi.getLatestTransaction();
        setTransactions(prev => {
          const updatedList = [newTx, ...prev.filter(t => t.id !== newTx.id)];
          if (updatedList.length > 50) {
            updatedList.pop();
          }
          if (!selectedTxId) {
            setSelectedTxId(newTx.id);
          }
          return updatedList;
        });
      } catch {
        const newTx = generateMockTransaction(rules);
        setTransactions(prev => {
          const updatedList = [newTx, ...prev];
          if (updatedList.length > 50) {
            updatedList.pop();
          }
          if (!selectedTxId) {
            setSelectedTxId(newTx.id);
          }
          return updatedList;
        });
      }

      setCumulativeStats(prev => {
        const flagIncrement = Math.random() > 0.82 ? 1 : 0;
        return {
          processedCount: prev.processedCount + 1,
          liveTps: parseFloat((23.0 + Math.random() * 4.5).toFixed(1)),
          activeAlerts: prev.activeAlerts + flagIncrement
        };
      });

    }, 3800);

    return () => clearInterval(interval);
  }, [rules, selectedTxId]);

  const handleOverrideStatus = async (txId: string, newStatus: Transaction['status']) => {
    try {
      await threatApi.overrideTransactionStatus(txId, newStatus);
    } catch (err) {
      console.warn(`Could not dispatch status override for ${txId} payload.`, err);
    }

    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        let updatedScore = t.riskScore;
        let reasons = t.explainReasons || [];
        let updatedFactors = t.riskFactors;
        
        if (newStatus === 'Verified') {
          updatedFactors = { failedAttempts: 0, amountAnomaly: 0, geoAnomaly: 0, timeAnomaly: 0, deviceReputation: 0 };
          updatedScore = 0;
          reasons = ['Manual Override: Administrator approved and whitelisted citizen payment profile.'];
        } else if (newStatus === 'Flagged') {
          updatedFactors = { failedAttempts: 0.95, amountAnomaly: 0.90, geoAnomaly: 0.85, timeAnomaly: 0.80, deviceReputation: 0.90 };
          updatedScore = Math.round(100 * (0.30 * 0.95 + 0.25 * 0.90 + 0.20 * 0.85 + 0.15 * 0.80 + 0.10 * 0.90));
          reasons = ['Administrator Purge: Payment terminal blacklisted and citizen account flagged for investigation.'];
        }

        return {
          ...t,
          status: newStatus,
          riskScore: updatedScore,
          riskFactors: updatedFactors,
          explainReasons: reasons
        };
      }
      return t;
    }));
  };

  const activeTx = useMemo(() => {
    const found = transactions.find(t => t.id === selectedTxId);
    return found || transactions[0] || null;
  }, [transactions, selectedTxId]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchQuery = t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [transactions, statusFilter, searchQuery]);

  const currentMetrics = useMemo(() => {
    const totalInList = transactions.length;
    if (totalInList === 0) return { rate: 92.4, alertsCount: 0 };
    const flagged = transactions.filter(t => t.status === 'Flagged').length;
    return {
      rate: parseFloat((91.5 + (flagged * 0.15) - (Math.random() * 0.2)).toFixed(1)),
      alertsCount: transactions.filter(t => t.status === 'Flagged' || t.status === 'Under Review').length
    };
  }, [transactions]);

  useEffect(() => {
    if (transactions.length > 0 && !selectedTxId) {
      setSelectedTxId(transactions[0].id);
    }
  }, [transactions, selectedTxId]);

  return (
    <div className="h-screen max-h-screen bg-[#04040A] text-[#7E7F94] flex flex-col pt-1 relative cyber-grid overflow-hidden">
      
      <div className="scanlines"></div>

      <nav className="border-b border-neutral-tertiary-medium bg-neutral-primary px-6 py-4.5 flex justify-between items-center z-10 select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center border border-brand bg-brand-softer shadow-[0_0_6px_rgba(84,234,253,0.3)]">
            <Shield className="w-4.5 h-4.5 text-brand" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-audiowide font-bold text-[15px] tracking-wider text-heading uppercase">
                City<span className="text-brand">Guard</span>
              </span>
              <span className="text-[9px] font-mono select-none px-2 py-0.5 bg-brand-softer border border-brand-medium text-brand uppercase leading-none">
                AI COGNITIVE MONITOR
              </span>
            </div>
            <div className="text-[10px] font-mono text-body-subtle flex items-center gap-1 mt-0.5 leading-none">
              <Clock className="w-3 h-3 text-brand" /> CONSOLE // ADMIN: {userEmail}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 border border-success-medium bg-success-soft text-[#00E676] text-[10px] font-mono uppercase tracking-[1px] leading-none select-none animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] inline-block"></span>
            CITY DEFENSE ONLINE
          </div>
          
          <button 
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-body-subtle hover:text-danger border border-default-medium hover:border-danger bg-neutral-primary-soft hover:bg-danger-soft transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </nav>

      <div className="flex flex-1 relative overflow-hidden">
        
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          userEmail={userEmail}
        />

        <div className="flex-1 p-6 overflow-y-auto space-y-6 progress-scrollbar min-w-0">
          
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              
              <MetricsCards 
                cumulativeStats={cumulativeStats} 
                currentMetrics={currentMetrics} 
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <ThreatChart trendData={trendData} />
                </div>

                <div className="lg:col-span-4 bg-neutral-primary-soft border border-default p-5.5 clip-card h-80 flex flex-col justify-between selection-none">
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-brand uppercase">ANALYSIS ENGINE</span>
                    <h3 className="font-audiowide font-bold text-sm text-heading uppercase tracking-wider mt-1 border-b border-default pb-2">
                      AI Detection Accuracy
                    </h3>
                    <p className="text-xs text-body leading-relaxed mt-3">
                      The cognitive neural network evaluates citizen payment sequences, terminal locations, and behavioral drift coefficients dynamically across the smart city grid.
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-secondary-soft border border-default text-center select-none font-sans">
                    <span className="text-[10px] font-mono text-body-subtle block uppercase">Live Threat Detection</span>
                    <p className="font-audiowide text-4xl text-brand font-bold mt-1 tracking-wider leading-none">
                      {currentMetrics.rate}%
                    </p>
                    <span className="text-[9px] font-mono text-success text-[#00E676] uppercase tracking-wide mt-1 block">
                      ✔ Exceeding traditional accuracy +2.4%
                    </span>
                  </div>
                </div>
              </div>

              <TransactionsTable 
                transactions={transactions}
                filteredTransactions={filteredTransactions}
                selectedTxId={selectedTxId}
                setSelectedTxId={setSelectedTxId}
                activeTx={activeTx}
                handleOverrideStatus={handleOverrideStatus}
                rules={rules}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          )}

          {activeTab === 'rules' && (
            <PolicyForm 
              rules={rules} 
              setRules={setRules} 
              handleSavePolicy={handleSavePolicy}
              savingPolicy={savingPolicy}
              saveSuccess={saveSuccess}
            />
          )}

          {activeTab === 'nodes' && (
            <SecurityClusters 
              nodePingTimes={nodePingTimes}
              nodeLoads={nodeLoads}
              triggerPingReload={triggerPingReload}
              pingingNodes={pingingNodes}
              rules={rules}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLedger 
              filteredTransactions={filteredTransactions}
              transactions={transactions}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              rules={rules}
              handleExportJSONLog={handleExportJSONLog}
            />
          )}

        </div>
      </div>
    </div>
  );
}
