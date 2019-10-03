import { Router } from "express";
import { DbWrapper } from "../lib/database";

export async function apiRouter(db: DbWrapper) {
  const router = Router();

  router.get("/docs/get/:id", async (req, res) => {
    const id = req.params.id;
    const doc = db.getDocs().getDoc(id);

    if (doc == null) return res.sendStatus(404);
    else return res.json(doc);
  });

  router.get("/docs/graph", async (req, res) => {
    res.json(db.getDocs().getGraph());
  });

  router.get("/docs/search/:term", async (req, res) => {
    res.json(db.getSearch().search(req.params.term));
  });

  return router;
}
