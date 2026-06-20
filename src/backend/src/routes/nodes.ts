import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

const NODES = [
  { nodeId: 'baku-central' as const, name: 'Baku Central Smart Grid', region: 'Downtown Data Center', ip: '10.0.1.10' },
  { nodeId: 'sumqayit' as const, name: 'Sumqayit Industrial Sector', region: 'Western Utility Hub', ip: '10.0.2.20' },
  { nodeId: 'ganja' as const, name: 'Ganja Transit Authority', region: 'Western Regional Node', ip: '10.0.3.30' },
  { nodeId: 'khazar' as const, name: 'Khazar Coastal District', region: 'Maritime Infrastructure Zone', ip: '10.0.4.40' },
];

// GET /api/nodes - get cluster node metrics
router.get('/', (_req: Request, res: Response) => {
  const nodes = NODES.map(node => ({
    ...node,
    ping: Math.floor(10 + Math.random() * 90),
    load: Math.floor(10 + Math.random() * 60),
    status: 'active' as const,
  }));

  res.json(nodes);
});

export default router;
