import React from 'react';
import { 
  Activity, 
  Sliders, 
  Globe, 
  Database, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  Server,
} from 'lucide-react';

export type DashboardTab = 'telemetry' | 'rules' | 'nodes' | 'audit';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  userEmail: string;
}

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  isCollapsed, 
  setIsCollapsed,
  userEmail
}: SidebarProps) {
  
  const menuItems = [
    {
      id: 'telemetry' as DashboardTab,
      label: 'Payment Telemetry',
      desc: 'Real-time payment flow',
      icon: Activity,
    },
    {
      id: 'rules' as DashboardTab,
      label: 'Security Policies',
      desc: 'MFA & block thresholds',
      icon: Sliders,
    },
    {
      id: 'nodes' as DashboardTab,
      label: 'City Clusters',
      desc: 'Municipal node status',
      icon: Globe,
    },
    {
      id: 'audit' as DashboardTab,
      label: 'Audit Ledger',
      desc: 'Immutable payment logs',
      icon: Database,
    }
  ];

  return (
    <div 
      className={`relative flex flex-col border-r border-neutral-tertiary-medium bg-neutral-primary/90 h-[calc(100vh-77px)] transition-all duration-300 z-25 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 -right-3 w-6 h-6 rounded-full border border-neutral-tertiary-medium bg-neutral-primary hover:bg-neutral-secondary-soft flex items-center justify-center text-brand cursor-pointer shadow-md shadow-black/80 z-30 group transition-all"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        )}
      </button>

      <div className="flex-1 py-6 flex flex-col justify-between overflow-y-auto overflow-x-hidden pt-8">
        <div className="space-y-6">
          {!isCollapsed && (
            <div className="px-5 mb-4">
              <span className="text-[10px] font-mono tracking-[4px] text-body-subtle uppercase">
                COGNITIVE NAVIGATION
              </span>
            </div>
          )}
          
          <nav className="space-y-1.5 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-3 transition-all duration-150 relative text-left group clip-btn cursor-pointer ${
                    isActive 
                      ? 'bg-brand/10 text-brand border-l-2 border-brand' 
                      : 'text-body-subtle hover:bg-neutral-secondary-soft/50 hover:text-heading'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex-shrink-0">
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-brand' : 'text-[#7E7F94] group-hover:text-brand'}`} />
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[12.5px] font-audiowide uppercase tracking-wider leading-none ${isActive ? 'text-heading font-medium' : 'text-body'}`}>
                        {item.label}
                      </span>
                      <span className="text-[9.5px] font-mono text-body-subtle truncate mt-0.5 group-hover:text-body leading-none">
                        {item.desc}
                      </span>
                    </div>
                  )}

                  {isActive && !isCollapsed && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-3 select-none">
          {isCollapsed ? (
            <div className="flex justify-center p-2 text-danger-strong" title="System Security Advisory: Elevated Risk">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
          ) : (
            <div className="p-4 bg-danger-soft/10 border border-danger-strong/30 clip-card space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-danger animate-pulse" />
                <span className="text-[10px] font-audiowide text-danger uppercase tracking-wider">
                  Threat Advisory
                </span>
              </div>
              <p className="text-[9px] font-mono text-body-subtle leading-relaxed">
                Smart city payment grid evaluating anomaly sequences at +44% volume over 30-day baseline.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-tertiary-medium p-4.5 bg-neutral-primary/50 select-none">
        {isCollapsed ? (
          <div className="flex justify-center">
            <Server className="w-5 h-5 text-brand/60" title={`Secure Server - Role: City Administrator`} />
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[8px] font-mono text-body-subtle">
              <span>SEC ENGINE:</span>
              <span className="text-[#00E676] font-bold">STABLE</span>
            </div>
            <div className="text-[10px] font-mono text-heading truncate uppercase tracking-tight">
              {userEmail.split('@')[0]}@cityguard
            </div>
            <div className="text-[8px] font-mono text-body-subtle/80 uppercase">
              Role: City Administrator
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
