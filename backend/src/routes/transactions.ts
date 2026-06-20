import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { authMiddleware } from '../middleware/auth';
import { generateTransactionData, getCurrentTimeString, generateRiskFactors, computeRiskScore } from '../generators';

const router = Router();

router.use(authMiddleware);

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRules() {
  const db = getDb();
  const rules = db.prepare('SELECT * FROM security_rules ORDER BY id DESC LIMIT 1').get() as {
    mfaThreshold: number;
    autoBlockThreshold: number;
  };
  return rules || { mfaThreshold: 60, autoBlockThreshold: 85 };
}

// GET /api/transactions - list all transactions with optional filters
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const { status, search } = req.query;

  let sql = 'SELECT * FROM transactions WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'All') {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (search) {
    sql += ' AND (merchant LIKE ? OR id LIKE ? OR location LIKE ?)';
    const q = `%${search}%`;
    params.push(q, q, q);
  }

  sql += ' ORDER BY timestamp DESC LIMIT 50';

  const transactions = db.prepare(sql).all(...params) as any[];
  const parsed = transactions.map((t: any) => ({
    ...t,
    explainReasons: JSON.parse(t.explainReasons || '[]'),
    riskFactors: JSON.parse(t.riskFactors || '{"failedAttempts":0,"amountAnomaly":0,"geoAnomaly":0,"timeAnomaly":0,"deviceReputation":0}'),
  }));

  res.json(parsed);
});

// GET /api/transactions/latest - generate and return one new transaction
router.get('/latest', (_req: Request, res: Response) => {
  const db = getDb();
  const rules = getRules();
  const tx = generateTransactionData(rules.mfaThreshold, rules.autoBlockThreshold);

  db.prepare(`INSERT INTO transactions (id, amount, merchant, merchantCategory, status, riskScore, timestamp, location, cardType, deviceType, explainReasons, customerEmail, riskFactors)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    tx.id, tx.amount, tx.merchant, tx.merchantCategory, tx.status, tx.riskScore,
    tx.timestamp, tx.location, tx.cardType, tx.deviceType, tx.explainReasons, tx.customerEmail,
    tx.riskFactors
  );

  res.json({
    ...tx,
    explainReasons: JSON.parse(tx.explainReasons),
    riskFactors: JSON.parse(tx.riskFactors),
  });
});

// POST /api/transactions - create a new transaction
router.post('/', (req: Request, res: Response) => {
  const db = getDb();
  const { amount, merchant, merchantCategory, status, riskScore, location, cardType, deviceType, customerEmail } = req.body;
  const rules = getRules();
  const generated = generateTransactionData(rules.mfaThreshold, rules.autoBlockThreshold);
  const factors = generateRiskFactors();
  const computed = computeRiskScore(factors);

  const tx = {
    id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
    amount: amount || generated.amount,
    merchant: merchant || generated.merchant,
    merchantCategory: merchantCategory || generated.merchantCategory,
    status: status || 'Verified',
    riskScore: riskScore ?? computed.score,
    timestamp: getCurrentTimeString(),
    location: location || generated.location,
    cardType: cardType || generated.cardType,
    deviceType: deviceType || generated.deviceType,
    explainReasons: JSON.stringify(computed.reasons),
    riskFactors: JSON.stringify(factors),
    customerEmail: customerEmail || generated.customerEmail,
  };

  db.prepare(`INSERT INTO transactions (id, amount, merchant, merchantCategory, status, riskScore, timestamp, location, cardType, deviceType, explainReasons, customerEmail, riskFactors)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    tx.id, tx.amount, tx.merchant, tx.merchantCategory, tx.status, tx.riskScore,
    tx.timestamp, tx.location, tx.cardType, tx.deviceType, tx.explainReasons, tx.customerEmail,
    tx.riskFactors
  );

  res.status(201).json({ ...tx, explainReasons: computed.reasons, riskFactors: factors });
});

// POST /api/transactions/:id/override - override transaction status
router.post('/:id/override', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  const { status } = req.body;

  if (!['Verified', 'Flagged', 'Under Review', 'Attacked'].includes(status)) {
    res.status(400).json({ error: 'Invalid status value.' });
    return;
  }

  const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as any;
  if (!existing) {
    res.status(404).json({ error: 'Transaction not found.' });
    return;
  }

  let newScore = existing.riskScore;
  let reasons: string[] = JSON.parse(existing.explainReasons || '[]');
  let newFactors: string = existing.riskFactors;

  if (status === 'Verified') {
    newFactors = JSON.stringify({ failedAttempts: 0, amountAnomaly: 0, geoAnomaly: 0, timeAnomaly: 0, deviceReputation: 0 });
    newScore = 0;
    reasons = ['Manual Override: Administrator approved and whitelisted citizen payment profile.'];
  } else if (status === 'Flagged') {
    newFactors = JSON.stringify({ failedAttempts: 0.95, amountAnomaly: 0.90, geoAnomaly: 0.85, timeAnomaly: 0.80, deviceReputation: 0.90 });
    newScore = 100 * (0.30 * 0.95 + 0.25 * 0.90 + 0.20 * 0.85 + 0.15 * 0.80 + 0.10 * 0.90);
    newScore = Math.round(newScore);
    reasons = ['Administrator Purge: Payment terminal blacklisted and citizen account flagged for investigation.'];
  } else if (status === 'Attacked') {
    newFactors = JSON.stringify({ failedAttempts: 1.0, amountAnomaly: 1.0, geoAnomaly: 1.0, timeAnomaly: 1.0, deviceReputation: 1.0 });
    newScore = 100;
    reasons = [
      '🚨 CYBER ATTACK DETECTED: Central Breach — Terminal firmware compromised by unauthorized entity.',
      'Attack Pattern: Payment data exfiltration via compromised API gateway — all risk factors maxed.',
      'Immediate action required: Isolate affected terminal segment and rotate all cryptographic keys.',
    ];
  }

  db.prepare('UPDATE transactions SET status = ?, riskScore = ?, explainReasons = ?, riskFactors = ? WHERE id = ?')
    .run(status, newScore, JSON.stringify(reasons), newFactors, id);

  const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as any;
  res.json({
    ...updated,
    explainReasons: JSON.parse(updated.explainReasons),
    riskFactors: JSON.parse(updated.riskFactors),
  });
});

// GET /api/transactions/:id/explain - get explainability for a transaction
router.get('/:id/explain', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;

  const tx = db.prepare('SELECT explainReasons FROM transactions WHERE id = ?').get(id) as any;
  if (!tx) {
    res.status(404).json({ error: 'Transaction not found.' });
    return;
  }

  res.json({ reasons: JSON.parse(tx.explainReasons || '[]') });
});

export default router;
