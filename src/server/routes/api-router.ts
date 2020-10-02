import * as bodyParser from "body-parser";
import CanonData from "cohen-db";
import { Router } from "express";

import { IAnnotation, IDoc } from "../../shared/IApiTypes";
import { AnnotationsController } from "../controllers/annotations";
import { GraphController } from "../controllers/graph";
import { SearchController } from "../controllers/search";
import { GeneratePreview } from "../lib/generate-preview";

const jsonParser = bodyParser.json();

export function apiRouter() {
  const router = Router();
  const graphProvider = new GraphController();
  const annotationsProvider = new AnnotationsController();
  const searchController = new SearchController();

  router.get("/docs/get/:docId", async (req, res) => {
    const doc = CanonData[req.params.docId];

    if (doc == null) return res.sendStatus(404);

    const referrers = graphProvider.getReferrers(req.params.docId);
    const annotations = annotationsProvider.getAnnotations(req.params.docId);

    const out: IDoc = {
      file: doc,
      annotations,
    };

    if (doc.children)
      out.children = doc.children.map((id) => GeneratePreview({ docId: id }));

    if (referrers.length > 0)
      out.referrers = referrers.map((ref) => GeneratePreview(ref));

    res.json(out);
  });

  router.get("/docs/graph", async (req, res) => {
    res.json(graphProvider.getGraph());
  });

  router.get("/docs/search/:term", async (req, res) => {
    res.json(searchController.search(req.params.term));
  });

  router.post("/docs/set/:docId/annotations", jsonParser, async (req, res) => {
    const docId: string = req.params.docId;
    const annotation: IAnnotation = req.body.annotation;
    annotationsProvider.addAnnotation(docId, annotation);
    res.end();
  });

  router.get("/updates", async (req, res) => {
    res.json(annotationsProvider.getUpdates());
  });

  return router;
}
