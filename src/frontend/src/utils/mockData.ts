import { Transaction, SecurityRules, RiskFactors } from '../types';

export const COMPETING_VENDORS = [
  {
    name: 'Static Rule-Based Filters',
    proactive: 'No',
    behavioral: 'No',
    learning: 'No',
    falsePositiveRate: '12% - 18%',
    integration: 'Months',
    scalability: 'Low'
  },
  {
    name: 'Legacy Vendor A',
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
    value: '$24B+',
    label: 'Annual Smart City Payment Fraud',
    desc: 'Digital payment touchpoints in urban infrastructure have expanded attack surfaces for credential abuse and card skimming.'
  },
  {
    value: '18.7s',
    label: 'Average Detection Delay',
    desc: 'Legacy systems process payment batches retrospectively, logging incidents long after funds are drained.'
  },
  {
    value: '15%',
    label: 'High False Positive Rate',
    desc: 'Legitimate citizens are incorrectly blocked at parking meters, transit gates, and municipal portals, eroding public trust.'
  }
];

export const CORE_FEATURES = [
  {
    id: 'anomaly',
    title: 'Anomaly Detection Engine',
    desc: 'Real-time sequence-model analysis scanning citizen payment patterns against historical behavior baselines.',
    detail: 'Detects location anomalies, impossible travel between payment terminals, and temporal pattern deviations across the entire smart city grid.'
  },
  {
    id: 'behavioral',
    title: 'Citizen Behavior Profiling',
    desc: 'Maintains rolling citizen telemetry profiles to evaluate typical usage hours, preferred payment points, and spending patterns.',
    detail: 'Learns device posture variations, regular transit routes, and standard payment categories for each city resident.'
  },
  {
    id: 'realtime',
    title: 'Sub-Second Risk Scoring',
    desc: 'Assigns a risk score to every payment event within 42 milliseconds, enabling instant blocking at the terminal level.',
    detail: 'Directly halts suspicious transactions at the municipal payment gateway before funds are transferred or services are granted.'
  },
  {
    id: 'explainable',
    title: 'Explainable AI Audit Logs',
    desc: 'No black box. Every anomalous score publishes audit trail mapping directly to specific behavioral deviations.',
    detail: 'Enables city administrators to justify actions to citizens with clear, human-readable reason blocks for compliance and transparency.'
  }
];

const MERCHANTS = [
  { name: 'City Parking Meter #A7', category: 'Parking' },
  { name: 'Metro Transit Kiosk #B12', category: 'Transit' },
  { name: 'Public Wi-Fi Hotspot #D4', category: 'Telecom' },
  { name: 'Municipal Tax Portal', category: 'Government' },
  { name: 'Smart ATM District #3', category: 'Banking' },
  { name: 'EV Charger Station #C9', category: 'Utility' },
  { name: 'City Pool Entry Gate', category: 'Recreation' },
  { name: 'Public Library Late Fee', category: 'Government' },
  { name: 'Waste Collection IoT Node', category: 'Utility' },
  { name: 'Street Lighting Grid Kiosk', category: 'Utility' },
  { name: 'School Fee Payment Portal', category: 'Education' },
  { name: 'City Market Vendor Stall #5', category: 'Commerce' },
  { name: 'Police Citation Payment', category: 'Government' },
];

const LOCATIONS = [
  'Downtown Smart Grid Zone A',
  'Riverside Transit Hub',
  'Central Park IoT Corridor',
  'East Gate Municipal Complex',
  'Suburban Utility Sector 7',
  'Harbor Port Authority',
  'North District School Cluster',
  'Airport Transportation Node',
];

const DEVICE_TYPES = [
  'City Pay Kiosk v3.2',
  'Smart Parking Terminal',
  'Contactless Transit Reader',
  'Municipal Portal Web App',
  'ATM Biometric Interface',
  'EV Charger Payment Pad',
];

const CARD_TYPES = [
  'CityPass Smart Card',
  'Metro Transit Token',
  'Citizen ID Pay Chip',
  'Municipal Mobile Wallet',
  'Digital Resident Credential',
  'EV-Charge Prepaid Key',
];

const REASONS = [
  'Abnormal vehicle dwell time at parking meter (exceeded max session)',
  'Same transit card scanned at two stations within impossible timeframe',
  'Multiple failed PIN attempts at public Wi-Fi payment portal',
  'Utility bill amount exceeds historic citizen average by 400%',
  'Concurrent access to municipal account from non-contiguous districts',
  'Repeated micro-payments to parking meters in different zones (skimming pattern)',
  'Unauthorized firmware downgrade detected on payment terminal',
  'Circular payment pattern: credits flowing through accounts in closed loop',
];

const CUSTOMER_EMAILS = [
  'resident_nikolai@citynet.baku',
  'citizen_ayla@smart.baku.az',
  'tech_rustam@baku-grid.az',
  'urban_leyla@city.payments',
  'resident_elvin@smartcity.az',
  'commuter_farid@metro.baku',
  'citizen_zarina@municipal.az',
  'tech_elnur@baku-wifi.az',
  'resident_narmin@smart.pay',
  'urban_kenan@cityportal.az',
];

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function randomFactor(): number {
  const roll = Math.random();
  if (roll < 0.70) {
    return parseFloat((Math.random() * 0.3).toFixed(2));
  } else if (roll < 0.88) {
    return parseFloat((0.3 + Math.random() * 0.4).toFixed(2));
  } else {
    return parseFloat((0.7 + Math.random() * 0.3).toFixed(2));
  }
}

export function generateRiskFactors(): RiskFactors {
  return {
    failedAttempts: randomFactor(),
    amountAnomaly: randomFactor(),
    geoAnomaly: randomFactor(),
    timeAnomaly: randomFactor(),
    deviceReputation: randomFactor(),
  };
}

export function computeRiskScore(factors: RiskFactors): { score: number; reasons: string[] } {
  const score = Math.round(
    100 * (0.30 * factors.failedAttempts + 0.25 * factors.amountAnomaly + 0.20 * factors.geoAnomaly + 0.15 * factors.timeAnomaly + 0.10 * factors.deviceReputation)
  );

  const reasons: string[] = [];

  if (factors.failedAttempts > 0.7) {
    reasons.push('Elevated failed payment attempts detected (possible credential stuffing or card testing)');
  } else if (factors.failedAttempts > 0.4) {
    reasons.push('Above-normal failed payment attempts recorded at this terminal');
  }

  if (factors.amountAnomaly > 0.7) {
    reasons.push('Transaction amount significantly exceeds citizen historic payment baseline');
  } else if (factors.amountAnomaly > 0.4) {
    reasons.push('Payment amount deviates from typical spending pattern for this citizen');
  }

  if (factors.geoAnomaly > 0.7) {
    reasons.push('Impossible travel detected: card used in non-contiguous city districts within short timeframe');
  } else if (factors.geoAnomaly > 0.4) {
    reasons.push('Geographic anomaly: payment originating from unusual sector');
  }

  if (factors.timeAnomaly > 0.7) {
    reasons.push('Time-based anomaly: transaction initiated outside citizen typical activity window');
  } else if (factors.timeAnomaly > 0.4) {
    reasons.push('Unusual time-of-day pattern detected for this payment type');
  }

  if (factors.deviceReputation > 0.7) {
    reasons.push('Unrecognized payment terminal fingerprint (possible device tampering)');
  } else if (factors.deviceReputation > 0.4) {
    reasons.push('Payment device reputation score below baseline threshold');
  }

  if (reasons.length === 0) {
    reasons.push('No anomalous variables detected. Behavior matches baseline.');
  }

  return { score, reasons };
}

export function getCurrentTimeString(): string {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
}

export function generateMockTransaction(rules: SecurityRules): Transaction {
  const factors = generateRiskFactors();
  const { score, reasons } = computeRiskScore(factors);
  const merch = randomItem(MERCHANTS);

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
    riskFactors: factors,
    timestamp: getCurrentTimeString(),
    location: randomItem(LOCATIONS),
    cardType: randomItem(CARD_TYPES),
    deviceType: randomItem(DEVICE_TYPES),
    explainReasons: reasons,
    customerEmail: randomItem(CUSTOMER_EMAILS),
  };
}

export function getInitialTransactions(count: number, rules: SecurityRules): Transaction[] {
  const list: Transaction[] = [];
  const baseTime = new Date();

  for (let i = 0; i < count; i++) {
    const tx = generateMockTransaction(rules);

    const staggerMin = i * 2 + Math.floor(Math.random() * 3);
    const staggerSec = Math.floor(Math.random() * 60);
    const time = new Date(baseTime.getTime() - (staggerMin * 60 * 1000 + staggerSec * 1000));
    tx.timestamp = time.toTimeString().split(' ')[0];

    list.push(tx);
  }

  return list.sort((a,b) => b.timestamp.localeCompare(a.timestamp));
}

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
      avgRiskScore: Math.floor(15 + Math.random() * 15),
    };
  });
}
