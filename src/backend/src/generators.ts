export const MERCHANTS = [
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

export interface RiskFactors {
  failedAttempts: number;
  amountAnomaly: number;
  geoAnomaly: number;
  timeAnomaly: number;
  deviceReputation: number;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getCurrentTimeString(): string {
  return new Date().toTimeString().split(' ')[0];
}

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

export function generateTransactionData(mfaThreshold: number, autoBlockThreshold: number) {
  const factors = generateRiskFactors();
  const { score, reasons } = computeRiskScore(factors);
  const merch = randomItem(MERCHANTS);

  let status: string = 'Verified';
  if (score >= autoBlockThreshold) {
    status = 'Flagged';
  } else if (score >= mfaThreshold) {
    status = 'Under Review';
  }

  return {
    id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
    amount: parseFloat((Math.random() * 1500 + 10).toFixed(2)),
    merchant: merch.name,
    merchantCategory: merch.category,
    status,
    riskScore: score,
    riskFactors: JSON.stringify(factors),
    timestamp: getCurrentTimeString(),
    location: randomItem(LOCATIONS),
    cardType: randomItem(CARD_TYPES),
    deviceType: randomItem(DEVICE_TYPES),
    explainReasons: JSON.stringify(reasons),
    customerEmail: randomItem(CUSTOMER_EMAILS),
  };
}
