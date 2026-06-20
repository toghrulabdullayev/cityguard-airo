import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/historical-trends - get historical trend data for charts
router.get('/', (_req: Request, res: Response) => {
  const timeBuckets = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'ACTIVE'];
  const data = timeBuckets.map(bucket => {
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

  res.json(data);
});

export default router;
