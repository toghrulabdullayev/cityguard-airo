export const MERCHANTS = [
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
  { name: 'Kusanagi Speedworks', category: 'Transit' },
];

const LOCATIONS = [
  'Night City (District 1)',
  'Night City (District 4)',
  'Orbital Station Beta',
  'Neo-Tokyo (Shiba-West)',
  'Badlands Ingress Gate',
  'Pacific Cyber-Hub',
  'Chicago Arcology-6',
  'Detroit Underground Network',
];

const DEVICE_TYPES = [
  'Neural Deck v4.2',
  'Holowrist Deck v1.8',
  'Retinal HUD Scanner',
  'Desktop HackStation',
  'Bio-Interface Link',
];

const CARD_TYPES = [
  'Quantum-Debit Card',
  'EuroDollar Cred-Chip',
  'Militech Premium Platinum',
  'NeoCrypto Net-Wallet',
  'Secured Proxy Chip',
];

const REASONS = [
  'Unusual geographic coordinate jump (Temporal teleportation anomaly)',
  'Transaction velocity limit exceeded (Multi-hit purchase spikes)',
  'Neural link biometric frequency mismatch',
  'Invoice category cost exceeds historic user thresholds by 400%',
  'Proxy signature routing detected (Evasion tunnel)',
  'Repeated failed authority chip handshake sequences',
  'Obsolete firmware signature utilized during authentication',
  'Micro-withdrawal sweep pattern observed prior to massive billing',
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
  'dexter_deshawn@fixers.nc',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getCurrentTimeString(): string {
  return new Date().toTimeString().split(' ')[0];
}

export function getRandomRiskScore() {
  const roll = Math.random();
  let score = 0;
  const reasons: string[] = [];

  if (roll < 0.70) {
    score = Math.floor(Math.random() * 30);
  } else if (roll < 0.88) {
    score = Math.floor(31 + Math.random() * 35);
    reasons.push(randomItem(REASONS));
  } else {
    score = Math.floor(66 + Math.random() * 35);
    reasons.push(randomItem(REASONS));
    if (Math.random() > 0.4) {
      let secondReason = randomItem(REASONS);
      while (secondReason === reasons[0]) {
        secondReason = randomItem(REASONS);
      }
      reasons.push(secondReason);
    }
  }

  return { score, reasons };
}

export function generateTransactionData(mfaThreshold: number, autoBlockThreshold: number) {
  const { score, reasons } = getRandomRiskScore();
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
    timestamp: getCurrentTimeString(),
    location: randomItem(LOCATIONS),
    cardType: randomItem(CARD_TYPES),
    deviceType: randomItem(DEVICE_TYPES),
    explainReasons: JSON.stringify(reasons.length > 0 ? reasons : ['No anomalous variables detected. Behavior matches baseline.']),
    customerEmail: randomItem(CUSTOMER_EMAILS),
  };
}
