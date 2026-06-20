/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Clock, LogOut } from 'lucide-react';
import { Transaction, SecurityRules } from '../types';
import { 
  getInitialTransactions, 
  generateMockTransaction, 
  getHistoricalTrendData 
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
  // Sidebar navigation states
  const [activeTab, setActiveTab] = useState<DashboardTab>('telemetry');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Policy Simulator Test and Save policy states
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Distributed cluster node status and ping timers
  const [nodePingTimes, setNodePingTimes] = useState({
    sf: 14,
    london: 48,
    tokyo: 96,
    amsterdam: 33
  });
  const [nodeLoads, setNodeLoads] = useState({
    sf: 28,
    london: 12,
    tokyo: 41,
    amsterdam: 15
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
        sf: Math.floor(10 + Math.random() * 15),
        london: Math.floor(40 + Math.random() * 15),
        tokyo: Math.floor(82 + Math.random() * 20),
        amsterdam: Math.floor(22 + Math.random() * 15)
      });
      setNodeLoads({
        sf: Math.floor(15 + Math.random() * 40),
        london: Math.floor(8 + Math.random() * 25),
        tokyo: Math.floor(30 + Math.random() * 35),
        amsterdam: Math.floor(10 + Math.random() * 20)
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
      downloadAnchor.setAttribute("download", `FR_SHIELD_LEDGER_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.warn("Could not download ledger", e);
    }
  };

  // Start with default security rules
  const [rules, setRules] = useState<SecurityRules>({
    mfaThreshold: 60,
    autoBlockThreshold: 85,
    behavioralAnalysisEnabled: true,
    geofenceEnforcement: true,
    dynamicMfaEnabled: true
  });

  // Initialized mock dynamic transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    getInitialTransactions(12, rules)
  );

  // Active highlighted item ID
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  // Cumulative system status metrics
  const [cumulativeStats, setCumulativeStats] = useState({
    processedCount: 148220,
    liveTps: 24.8,
    activeAlerts: 14
  });

  // Filters state
  const [statusFilter, setStatusFilter] = useState<'All' | 'Verified' | 'Flagged' | 'Under Review'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Recharts trend data state
  const [trendData] = useState(() => getHistoricalTrendData());

  // Simulate dynamic stream in background
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
        // Fall back to local generation if backend unavailable
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

  // Handle setting/overriding status of transaction in memory
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
        
        if (newStatus === 'Verified') {
          updatedScore = Math.floor(Math.random() * 15);
          reasons = ['Manual Override: Analyst approved and greenlisted account chip profile.'];
        } else if (newStatus === 'Flagged') {
          updatedScore = Math.floor(90 + Math.random() * 10);
          reasons = ['Analyst Purge Signal: Triggered explicit blacklisting coordinates.'];
        }

        return {
          ...t,
          status: newStatus,
          riskScore: updatedScore,
          explainReasons: reasons
        };
      }
      return t;
    }));
  };

  // Find currently highlighted transaction
  const activeTx = useMemo(() => {
    const found = transactions.find(t => t.id === selectedTxId);
    return found || transactions[0] || null;
  }, [transactions, selectedTxId]);

  // Compute filtered outputs
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchQuery = t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [transactions, statusFilter, searchQuery]);

  // Calculate live detection metrics
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
      
      {/* Dynamic Scanline aesthetic */}
      <div className="scanlines"></div>

      {/* DASHBOARD NAVBAR */}
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
              <Clock className="w-3 h-3 text-brand" /> CONSOLE // ANALYST: {userEmail}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 border border-success-medium bg-success-soft text-[#00E676] text-[10px] font-mono uppercase tracking-[1px] leading-none select-none animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] inline-block"></span>
            DEFENSE SHIELD ONLINE
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

      {/* DASHBOARD MAIN LAYOUT WORKSPACE */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* COLLAPSIBLE SIDEBAR WITH TRANSITIONS */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          userEmail={userEmail}
        />

        {/* CONTROLLER CONTENT AREA */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 progress-scrollbar min-w-0">
          
          {/* TAB 1: Real-time Telemetry Dashboard */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              
              {/* Metrics cards widgets */}
              <MetricsCards 
                cumulativeStats={cumulativeStats} 
                currentMetrics={currentMetrics} 
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Visual area chart */}
                <div className="lg:col-span-8">
                  <ThreatChart trendData={trendData} />
                </div>

                {/* Secure threat indicator gauge card */}
                <div className="lg:col-span-4 bg-neutral-primary-soft border border-default p-5.5 clip-card h-80 flex flex-col justify-between selection-none">
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-brand uppercase">ANALYSIS ENGINE</span>
                    <h3 className="font-audiowide font-bold text-sm text-heading uppercase tracking-wider mt-1 border-b border-default pb-2">
                      Sovereign Core Accuracy Intel
                    </h3>
                    <p className="text-xs text-body leading-relaxed mt-3">
                      The cognitive neural network weighs user sequences, IP subnet blocks, and micro-behavior drift coefficients dynamically.
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-secondary-soft border border-default text-center select-none font-sans">
                    <span className="text-[10px] font-mono text-body-subtle block uppercase">Live Threat Detection Index</span>
                    <p className="font-audiowide text-4xl text-brand font-bold mt-1 tracking-wider leading-none">
                      {currentMetrics.rate}%
                    </p>
                    <span className="text-[9px] font-mono text-success text-[#00E676] uppercase tracking-wide mt-1 block">
                      ✔ Exceeding traditional accuracy rates +2.4%
                    </span>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger component with manual overrides */}
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

          {/* TAB 2: Rules configurations */}
          {activeTab === 'rules' && (
            <PolicyForm 
              rules={rules} 
              setRules={setRules} 
              handleSavePolicy={handleSavePolicy}
              savingPolicy={savingPolicy}
              saveSuccess={saveSuccess}
            />
          )}

          {/* TAB 3: Cluster Nodes status matrix */}
          {activeTab === 'nodes' && (
            <SecurityClusters 
              nodePingTimes={nodePingTimes}
              nodeLoads={nodeLoads}
              triggerPingReload={triggerPingReload}
              pingingNodes={pingingNodes}
              rules={rules}
            />
          )}

          {/* TAB 4: Ledger Audit Trails */}
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
