import { Router } from 'express';
import { IDoc, IDocGraph, ISearchResults } from '../../shared/IApiTypes';
import { Db, FindOneOptions, ObjectID } from 'mongodb';

export function apiRouter(db: Db) {
  const router = Router();
  const docs = db.collection("docs");

  router.get('/docs/get/:id', async (req, res) => {
    const id = req.params.id;
    const hit = await docs.findOne({ _id: id });
    if (!hit)
      res.sendStatus(404);
    else {
      const doc: IDoc = {
        text: hit.text,
        date: hit.date,
        source: hit.source,
        authors: hit.writers,
        links: hit.links
      }
      res.json(doc);
    }
  });

  router.get('/docs/graph', async (req, res) => {
    const opts: FindOneOptions = {
      projection: {
        _id: true,
        title: true,
        kind: true,
        children: true
      }
    };
    const hits = await docs.find({}, opts).toArray();
    const graph: IDocGraph = {
      dynamicCollectionRoot: {
        title: "root",
        kind: "DynamicCollectionRoot",
        children: []
      }
    };
    hits.forEach(hit => {
      const id: ObjectID = hit._id;
      graph[id.toHexString()] = {
        title: hit.title,
        kind: hit.kind,
        children: hit.children
      };
    })


    res.json(graph);
  });

  router.get('/docs/search/:term', (req, res) => {
    const term = req.params.term;
    const result: ISearchResults = {
      term,
      hits: [
        {
          id: "003",
          preview: `Sample highlight for term ${term} hit on ID 003`
        },
        {
          id: "005",
          preview: `Sample highlight for term ${term} hit on ID 005`
        }
      ]
    };
    res.json(result);
  });

  return router;
}