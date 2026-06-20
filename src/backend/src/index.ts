import express from 'express';
import cors from 'cors';
import { getDb, closeDb } from './db';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import rulesRoutes from './routes/rules';
import nodesRoutes from './routes/nodes';
import trendsRoutes from './routes/trends';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
getDb();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/nodes', nodesRoutes);
app.use('/api/historical-trends', trendsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`CityGuard backend running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  closeDb();
  server.close();
  process.exit(0);
});

export default app;
