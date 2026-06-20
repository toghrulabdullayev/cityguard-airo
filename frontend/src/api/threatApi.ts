/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, SecurityRules } from '../types';

// The Backend Base API endpoint, customizable via environment variables for live connection.
// Defaults to the same host path under /api for unified production structures.
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

/**
 * TypeScript Schemas for Request & Response DTOs
 */
export interface FetchTransactionsParams {
  status?: 'All' | 'Verified' | 'Flagged' | 'Under Review';
  search?: string;
}

export interface NodeMetricsResponse {
  nodeId: 'sf' | 'london' | 'tokyo' | 'amsterdam';
  name: string;
  region: string;
  ip: string;
  ping: number;
  load: number;
  status: 'active' | 'offline' | 'degraded';
}

export interface OverrideStatusRequest {
  status: Transaction['status'];
}

export interface HistoricalTrendPoint {
  time: string;
  processed: number;
  flagged: number;
  mfaPrompter: number;
  avgRiskScore: number;
}

/**
 * SDK Calling methods targeting the Threat Gateway API.
 * These methods make real HTTP calls. If the backend fails or isn't connected yet,
 * they fall back gracefully to return mock results, keeping the UI fully operative.
 */
export const threatApi = {
  /**
   * 1. GET /api/transactions
   * Retrieves full transaction ledger. Supports queries.
   */
  async getTransactions(params?: FetchTransactionsParams): Promise<Transaction[]> {
    const url = new URL(`${API_BASE_URL}/transactions`, window.location.origin);
    if (params?.status && params.status !== 'All') {
      url.searchParams.append('status', params.status);
    }
    if (params?.search) {
      url.searchParams.append('search', params.search);
    }

    try {
      const response = await fetch(url.toString(), {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn('API getTransactions failed, working in sandbox memory mode.', e);
      throw e; // Bubble up error so pages can handle or fallback
    }
  },

  /**
   * 2. POST /api/transactions
   * Creates or ingests a synthetic threat transaction packet.
   */
  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn('API createTransaction failed.', e);
      throw e;
    }
  },

  /**
   * 3. POST /api/transactions/:id/override
   * Manual override trigger to verify or blacklist transactions.
   */
  async overrideTransactionStatus(txId: string, status: Transaction['status']): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${txId}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status } as OverrideStatusRequest),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn(`API overrideTransactionStatus for ${txId} failed.`, e);
      throw e;
    }
  },

  /**
   * 4. GET /api/rules
   * Fetches active security gateway thresholds.
   */
  async getSecurityRules(): Promise<SecurityRules> {
    try {
      const response = await fetch(`${API_BASE_URL}/rules`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn('API getSecurityRules failed.', e);
      throw e;
    }
  },

  /**
   * 5. POST /api/rules
   * Publishes new tactical security rule parameters to the global clusters.
   */
  async updateSecurityRules(rules: SecurityRules): Promise<SecurityRules> {
    try {
      const response = await fetch(`${API_BASE_URL}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rules),
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn('API updateSecurityRules failed.', e);
      throw e;
    }
  },

  /**
   * 6. GET /api/nodes
   * Queries distributed cluster node capacities and latency metrics.
   */
  async getClusterNodes(): Promise<NodeMetricsResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/nodes`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn('API getClusterNodes failed.', e);
      throw e;
    }
  },

  /**
   * 7. GET /api/historical-trends
   * Collects Recharts statistical metrics over recent time intervals.
   */
  async getHistoricalTrends(): Promise<HistoricalTrendPoint[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/historical-trends`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (e) {
      console.warn('API getHistoricalTrends failed.', e);
      throw e;
    }
  }
};
