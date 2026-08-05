import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import subscribeHandler from './api/subscribe.js';
import continueSubscriptionHandler from './api/continue-subscription.js';
import completeSubscriptionHandler from './api/complete-subscription.js';
import resendEmailHandler from './api/resend-email.js';
import trackHandler from './api/track.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.all('/api/track', (req, res) => trackHandler(req, res));
  app.all('/api/subscribe', (req, res) => subscribeHandler(req, res));
  app.all('/api/continue-subscription', (req, res) => continueSubscriptionHandler(req, res));
  app.all('/api/complete-subscription', (req, res) => completeSubscriptionHandler(req, res));
  app.all('/api/resend-email', (req, res) => resendEmailHandler(req, res));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ClearPath full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
