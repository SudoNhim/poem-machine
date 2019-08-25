import { Router } from 'express';
import { IDoc, IDocGraph, IDocMeta, ISearchResults } from '../../shared/IApiTypes';
import { Db, FindOneOptions, ObjectID, Collection } from 'mongodb';
import * as lunr from 'lunr';

const buildCache = async (docs: Collection<any>) => {
  const opts: FindOneOptions = {
    projection: {
      _id: true,
      title: true,
      text: true,
      children: true,
      kind: true
    }
  };
  const hits = await docs.find({}, opts).toArray();
  const searchIndex = lunr(function () {
    this.ref("id");
    this.field("title");
    this.field("text");

    this.metadataWhitelist = ['position'];

    hits.forEach(hit => {
      this.add({
        id: hit._id,
        title: hit.title,
        text: hit.text,
      });
    });
  });

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

  return { graph, searchIndex };
}

export async function apiRouter(db: Db) {
  const router = Router();
  const docs = db.collection("docs");
  const cache = await buildCache(docs);

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
    res.json(cache.graph);
  });

  router.get('/docs/search/:term', async (req, res) => {
    const term = req.params.term;
    const hits = cache.searchIndex.search(term);

    const result: ISearchResults = {
      term,
      hits: hits.map(h => ({
        id: h.ref,
        preview: `Preview for result for ${term} (not implemented)`
      }))
    };
    res.json(result);
  });

  return router;
}