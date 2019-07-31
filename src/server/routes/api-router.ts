import { Router } from 'express';
import { IDoc, IDocGraph, ISearchResults } from '../../shared/IApiTypes';
import { Db, FindOneOptions, ObjectID, FilterQuery } from 'mongodb';

export function apiRouter(db: Db) {
  const router = Router();
  const docs = db.collection("docs");

  router.get('/docs/get/:id', async (req, res) => {
    const id = req.params.id;
    const hit = await docs.findOne({ _id: new ObjectID(id) });
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
      const sid = id.toHexString();
      graph[sid] = {
        title: hit.title,
        kind: hit.kind,
        children: hit.children
      };
      if (graph[hit.kind]) {
        graph[hit.kind].children.push(sid);
      } else {
        graph[hit.kind] = {
          title: hit.kind,
          kind: "DynamicCollection",
          children: [sid]
        };
        graph.dynamicCollectionRoot.children.push(hit.kind);
      }
    });

    res.json(graph);
  });

  router.get('/docs/search/:term', async (req, res) => {
    const term = req.params.term;
    const filter: FilterQuery<any> = {
      text: {
        $regex: new RegExp(term, "i")
      }
    }
    const hits =  await docs.find(filter, {projection: {_id: true}}).toArray();
    const result: ISearchResults = {
      term,
      hits: hits.map(h => ({
        id: h._id,
        preview: `Preview for result for ${term} (not implemented)`
      }))
    };
    res.json(result);
  });

  return router;
}