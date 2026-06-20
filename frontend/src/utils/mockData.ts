/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, SecurityRules } from '../types';

export const COMPETING_VENDORS = [
  {
    name: 'Standard Rule-Based Filters',
    proactive: 'No',
    behavioral: 'No',
    learning: 'No',
    falsePositiveRate: '12% - 18%',
    integration: 'Months',
    scalability: 'Low'
  },
  {
    name: 'Legacy Fraud Vendor A',
    proactive: 'Partial',
    behavioral: 'No',
    learning: 'No',
    falsePositiveRate: '8% - 10%',
    integration: '6 weeks',
    scalability: 'Medium'
  },
  {
    name: 'CityGuard Security Terminal',
    proactive: 'Yes (Real-time Block)',
    behavioral: 'Yes (Sequence logs)',
    learning: 'Yes (Continuous retraining)',
    falsePositiveRate: '~3% (Ultra-low)',
    integration: 'Days (Microservices)',
    scalability: 'High (Cloud native)'
  }
];

export const PROBLEM_STATS = [
  {
    value: "$48B+",
    label: "Annual Global Fraud Losses",
    desc: "Digital payment volumes have expanded vector surfaces for deep-fake and credential abuse."
  },
  {
    value: "14.2s",
    label: "Legacy Reaction Time",
    desc: "Legacy systems process batches retrospectively, logging incidents long after values have settled."
  },
  {
    value: "15%",
    label: "High False Positives",
    desc: "Legitimate customers are flagged and locked, reducing digital transaction conversion and overall platform loyalty."
  }
];

export const CORE_FEATURES = [
  {
    id: "anomaly",
    title: "Anomaly Deck",
    desc: "Fast sequence-model analysis scanning real-time coordinates against historical movement bounds.",
    detail: "Scans location deviation, IP routing, proxy evasions, and temporal patterns concurrently."
  },
  {
    id: "behavioral",
    title: "Neural Behavioral Profiling",
    desc: "Maintains rolling user telemetry profile layers to evaluate click velocity and neural deck signatures.",
    detail: "Learns device posture variations, regular time blocks, and standard payload categories."
  },
  {
    id: "realtime",
    title: "Nano-Second Risk Scoring",
    desc: "Determines risk score of every packet within 42 milliseconds, triggering automatic blocks.",
    detail: "Directly terminates connections at the API gateway before credit lines or ledger entries commit."
  },
  {
    id: "explainable",
    title: "Explainable AI Logs",
    desc: "No black box. Every anomalous score publishes audit points mapping directly to behavioral deviances.",
    detail: "Enables operational compliance agents to justify actions to customers with clear, human-readable reason blocks."
  }
];

const MERCHANTS = [
  { name: 'Militech Armory', category: 'Hardware' },
  { name: 'Arasaka Plaza Hotel', category: 'Luxury Lodging' },
  { name: 'Neo-Net Cybernetics', category: 'Cybernetics' },
  { name: 'NightMarket Holo-Gear', category: 'Entertainment' },
  { name: 'Synth-Coffee Lab', category: 'Entertainment' },
  { name: 'Aoki BioTech Lab', category: 'Biotech' },
  { name: 'Nexus Cloud Nodes', category: 'Data Nodes' },
  { name: 'V-Holo Telecoms', category: 'Data Nodes' },
  { name: 'Terminal 5 Hydrogen Fuel', category: 'Transit' },
  { name: 'Matrix Netrunner Lounge', category: 'Entertainment' },
  { name: 'Orbit-Link Hyperloop', category: 'Transit' },
  { name: 'Kenji Noodle Automat', category: 'Entertainment' },
  { name: 'Kusanagi Speedworks', category: 'Transit' }
];

const LOCATIONS = [
  'Night City (District 1)',
  'Night City (District 4)',
  'Orbital Station Beta',
  'Neo-Tokyo (Shiba-West)',
  'Badlands Ingress Gate',
  'Pacific Cyber-Hub',
  'Chicago Arcology-6',
  'Detroit Underground Network'
];

const DEVICE_TYPES = [
  'Neural Deck v4.2',
  'Holowrist Deck v1.8',
  'Retinal HUD Scanner',
  'Desktop HackStation',
  'Bio-Interface Link'
];

const CARD_TYPES = [
  'Quantum-Debit Card',
  'EuroDollar Cred-Chip',
  'Militech Premium Platinum',
  'NeoCrypto Net-Wallet',
  'Secured Proxy Chip'
];

const REASONS = [
  'Unusual geographic coordinate jump (Temporal teleportation anomaly)',
  'Transaction velocity limit exceeded (Multi-hit purchase spikes)',
  'Neural link biometric frequency mismatch',
  'Invoice category cost exceeds historic user thresholds by 400%',
  'Proxy signature routing detected (Evasion tunnel)',
  'Repeated failed authority chip handshake sequences',
  'Obsolete firmware signature utilized during authentication',
  'Micro-withdrawal sweep pattern observed prior to massive billing'
];

const CUSTOMER_EMAILS = [
  'v_netrunner@nightcity.io',
  'panam_b@badlands.net',
  'silverhand.johnny@samurai.com',
  'mox_judy@lizzies.cyber',
  'jackie_w@heywood.pub',
  't-bug@cyberspace.org',
  'rogue_afterlife@queen.night',
  'goro_takemura@arasaka.corp',
  'maiko_maeda@clouds.cyber',
  'dexter_deshawn@fixers.nc'
];

// Generates a random element from an array
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate a random score with custom distribution (higher probability of low scores)
export function getRandomRiskScore(): { score: number; reasons: string[] } {
  const roll = Math.random();
  let score = 0;
  const reasons: string[] = [];

  if (roll < 0.70) {
    // Low risk transaction (0-30)
    score = Math.floor(Math.random() * 30);
  } else if (roll < 0.88) {
    // Medium risk transaction (31-65)
    score = Math.floor(31 + Math.random() * 35);
    reasons.push(randomItem(REASONS));
  } else {
    // High risk transaction (66-100)
    score = Math.floor(66 + Math.random() * 35);
    reasons.push(randomItem(REASONS));
    if (Math.random() > 0.4) {
      // Add second reason for high validity
      let secondReason = randomItem(REASONS);
      while (secondReason === reasons[0]) {
        secondReason = randomItem(REASONS);
      }
      reasons.push(secondReason);
    }
  }

  return { score, reasons };
}

// Generate structured formatted time string
export function getCurrentTimeString(): string {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
}

// Single mock transaction generator adapting to current dynamic dashboard thresholds
export function generateMockTransaction(rules: SecurityRules): Transaction {
  const { score, reasons } = getRandomRiskScore();
  const merch = randomItem(MERCHANTS);
  
  // Decide state based on risk score and the rules adjusted by the analyst
  let status: Transaction['status'] = 'Verified';
  if (score >= rules.autoBlockThreshold) {
    status = 'Flagged';
  } else if (score >= rules.mfaThreshold) {
    status = 'Under Review';
  }

  return {
    id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
    amount: parseFloat((Math.random() * 1500 + 10).toFixed(2)),
    merchant: merch.name,
    merchantCategory: merch.category,
    status,
    riskScore: score,
    timestamp: getCurrentTimeString(),
    location: randomItem(LOCATIONS),
    cardType: randomItem(CARD_TYPES),
    deviceType: randomItem(DEVICE_TYPES),
    explainReasons: reasons.length > 0 ? reasons : ['No anomalous variables detected. Behavior matches baseline.'],
    customerEmail: randomItem(CUSTOMER_EMAILS)
  };
}

// Generate starting items
export function getInitialTransactions(count: number, rules: SecurityRules): Transaction[] {
  const list: Transaction[] = [];
  const baseTime = new Date();
  
  for (let i = 0; i < count; i++) {
    const tx = generateMockTransaction(rules);
    
    // Stagger timestamp backwards
    const staggerMin = i * 2 + Math.floor(Math.random() * 3);
    const staggerSec = Math.floor(Math.random() * 60);
    const time = new Date(baseTime.getTime() - (staggerMin * 60 * 1000 + staggerSec * 1000));
    tx.timestamp = time.toTimeString().split(' ')[0];
    
    list.push(tx);
  }
  
  // Sort descending by timestamp (newest first)
  return list.sort((a,b) => b.timestamp.localeCompare(a.timestamp));
}

// Generate initial historical charts data
export function getHistoricalTrendData() {
  const timeBuckets = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'ACTIVE'];
  return timeBuckets.map(bucket => {
    const totalProcessed = Math.floor(4000 + Math.random() * 2000);
    const anomalousTriggered = Math.floor(totalProcessed * (0.015 + Math.random() * 0.025));
    return {
      time: bucket,
      processed: totalProcessed,
      flagged: anomalousTriggered,
      mfaPrompter: Math.floor(anomalousTriggered * 1.5),
      avgRiskScore: Math.floor(15 + Math.random() * 15)
    };
  });
}
