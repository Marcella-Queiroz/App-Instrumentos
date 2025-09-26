// api/src/app.js (ESM)
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import userRoutes from './routes/user.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// rota de saúde
app.get('/saude', (req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || 'dev',
    uptime: process.uptime(),
    now: new Date().toISOString(),
  });
});

// __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// servir uploads e rota de upload
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/upload', uploadRoutes);

// rotas principais
app.use('/auth', authRoutes);
app.use('/listings', listingRoutes);
app.use('/users', userRoutes);

export default app;
