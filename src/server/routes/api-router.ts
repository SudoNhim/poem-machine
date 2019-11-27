import { Router } from "express";
import { GraphController } from '../controllers/graph';
import { SearchController } from '../controllers/search';
import CanonData from 'cohen-db';
import { IDoc } from '../../shared/IApiTypes';
import { GeneratePreview } from '../lib/generate-preview';

export function apiRouter() {
  const router = Router();
  const graphProvider = new GraphController();
  const searchController = new SearchController();

  router.get("/docs/get/:docId", async (req, res) => {
    const doc = CanonData[req.params.docId];

    if (doc == null) return res.sendStatus(404);

    const referrers = graphProvider.getReferrers(req.params.docId);

    const out: IDoc = {
      file: doc
    };

    if (referrers.length > 0)
      out.referrers = referrers.map(ref => GeneratePreview(ref));

    res.json(out);
  });

  router.get("/docs/graph", async (req, res) => {
    res.json(graphProvider.getGraph());
  });

  router.get("/docs/search/:term", async (req, res) => {
    res.json(searchController.search(req.params.term));
  });

  return router;
}
