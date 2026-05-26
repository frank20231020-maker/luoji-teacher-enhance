import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import optimizeRouter from './routes/optimize.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

const frontendOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const devOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = [...new Set([...frontendOrigins, ...devOrigins])];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || frontendOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.status(200).type('application/json; charset=utf-8').json({ status: 'ok' });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: process.env.OPENAI_MODEL || 'gpt-5-5' });
});

app.use('/api', optimizeRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`罗辑老师增强服务已启动: http://0.0.0.0:${PORT}`);
});
