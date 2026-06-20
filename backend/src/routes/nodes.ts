import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

const NODES = [
  { nodeId: 'sf' as const, name: 'Node Alpha // California', region: 'San Francisco Ocean Tower', ip: '142.250.72.110' },
  { nodeId: 'london' as const, name: 'Node Beta // United Kingdom', region: 'Canary Wharf Crypt Hub', ip: '216.58.212.14' },
  { nodeId: 'tokyo' as const, name: 'Node Gamma // Japan Grid', region: 'Neo-Akihabara Server Arcology', ip: '172.217.161.4' },
  { nodeId: 'amsterdam' as const, name: 'Node Delta // Netherlands', region: 'Amsterdam Central Cyber Vault', ip: '172.217.17.110' },
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
