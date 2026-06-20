/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RiskFactors {
  failedAttempts: number;
  amountAnomaly: number;
  geoAnomaly: number;
  timeAnomaly: number;
  deviceReputation: number;
}

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  status: 'Verified' | 'Flagged' | 'Under Review';
  riskScore: number; // 0 to 100
  timestamp: string; // Formatted time e.g., "08:14:22"
  location: string;
  cardType: string;
  deviceType: string;
  explainReasons?: string[];
  riskFactors?: RiskFactors;
  customerEmail: string;
  merchantCategory: string;
}

export interface DashboardStats {
  fraudDetectionRate: number; // percentage
  transactionsProcessed: number; // count
  transactionsPerSec: number; // calculated live
  activeAlertsCount: number; // count
  activeUsersMonitored: number; // count
}

export interface SecurityRules {
  mfaThreshold: number; // e.g. 60
  autoBlockThreshold: number; // e.g. 85
  behavioralAnalysisEnabled: boolean;
  geofenceEnforcement: boolean;
  dynamicMfaEnabled: boolean;
}

export interface UserSession {
  token: string | null;
  email: string | null;
  role: string | null;
}
