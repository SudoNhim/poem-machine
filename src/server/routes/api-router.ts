import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { ITestApiResult } from '../../shared/ITestApiResult';

export function apiRouter() {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/test', (req, res) => {
    const result: ITestApiResult = { result: "Hello world" };
    res.json(result);
  });

  return router;
}