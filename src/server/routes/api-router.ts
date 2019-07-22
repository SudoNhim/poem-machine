import * as bodyParser from 'body-parser';
import { Router } from 'express';

export function apiRouter() {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/test', (req, res) => {
    res.json({ result: "Hello world" });
  });

  return router;
}