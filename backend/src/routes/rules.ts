import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/rules - get current security rules
router.get('/', (_req: Request, res: Response) => {
  const db = getDb();
  const rules = db.prepare('SELECT * FROM security_rules ORDER BY id DESC LIMIT 1').get() as any;

  if (!rules) {
    res.json({
      mfaThreshold: 60,
      autoBlockThreshold: 85,
      behavioralAnalysisEnabled: true,
      geofenceEnforcement: true,
      dynamicMfaEnabled: true,
    });
    return;
  }

  res.json({
    mfaThreshold: rules.mfaThreshold,
    autoBlockThreshold: rules.autoBlockThreshold,
    behavioralAnalysisEnabled: Boolean(rules.behavioralAnalysisEnabled),
    geofenceEnforcement: Boolean(rules.geofenceEnforcement),
    dynamicMfaEnabled: Boolean(rules.dynamicMfaEnabled),
  });
});

// POST /api/rules - update security rules
router.post('/', (req: Request, res: Response) => {
  const db = getDb();
  const { mfaThreshold, autoBlockThreshold, behavioralAnalysisEnabled, geofenceEnforcement, dynamicMfaEnabled } = req.body;

  db.prepare(`UPDATE security_rules SET
    mfaThreshold = ?,
    autoBlockThreshold = ?,
    behavioralAnalysisEnabled = ?,
    geofenceEnforcement = ?,
    dynamicMfaEnabled = ?
    WHERE id = (SELECT id FROM security_rules ORDER BY id DESC LIMIT 1)`
  ).run(
    mfaThreshold ?? 60,
    autoBlockThreshold ?? 85,
    behavioralAnalysisEnabled ? 1 : 0,
    geofenceEnforcement ? 1 : 0,
    dynamicMfaEnabled ? 1 : 0,
  );

  const updated = db.prepare('SELECT * FROM security_rules ORDER BY id DESC LIMIT 1').get() as any;
  res.json({
    mfaThreshold: updated.mfaThreshold,
    autoBlockThreshold: updated.autoBlockThreshold,
    behavioralAnalysisEnabled: Boolean(updated.behavioralAnalysisEnabled),
    geofenceEnforcement: Boolean(updated.geofenceEnforcement),
    dynamicMfaEnabled: Boolean(updated.dynamicMfaEnabled),
  });
});

export default router;
