import { Router } from 'express';
import { IDoc, IDocGraph, ISearchResults } from '../../shared/IApiTypes';
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

function generatePreview(doc: IDoc, hit: lunr.Index.Result): string {
  // build sorted list of all substring matches
  const metadata = hit.matchData.metadata;
  const textmatches: number[][] = [];
  (Object.values(metadata)).forEach(v => {
    if (v && v.text && v.text.position) {
        v.text.position.forEach((m: number[]) => {
        textmatches.push([m[0], m[0] + m[1]]);
      });
    }
  });
  textmatches.sort((m1, m2) => (m1[0] - m2[0]));
  
  // build list of all incidences of newline chars
  const textchars = (doc.text || "").split("");
  const newlineposarr: number[] = [0];
  textchars.forEach((c, i) => {
    if (c === '\n') newlineposarr.push(i);
  });
  newlineposarr.push(textchars.length);

  // A set of text content ensures we don't add repeated lines
  // e.g. a song may repeat the same line many times
  const lineContents: Set<string> = new Set();

  // build list of whole lines that contain matches
  type LineMatches = { i: number, start: number, end: number, matches: number[][] }[];
  const lines: LineMatches = [];
  for (var i=0; i<newlineposarr.length-1; i++) {
    const start = newlineposarr[i];
    const end = newlineposarr[i+1];
    const matches: number[][] = textmatches.filter(m =>
      (m[1] > start && m[0] < end));
    if (matches.length) {
      const str = doc.text.substring(start, end)
        .toLowerCase()
        .replace(/\W/g, '');

      // ensure no dupes
      if (!lineContents.has(str)) {
        lineContents.add(str);
        lines.push({ i, start, end, matches });
      }
    }
  }

  const parts: LineMatches = [];
  for (var i=0; i<lines.length; i++) {
    const a = lines[i];
    const b = lines.length > i ? lines[i+1] : null;
    parts.push(a);
    if (b) {
      if (b.i - a.i > 1) parts.push(null); // null -> '...' separator
    }
  }

  let result = "";
  parts.forEach(part => {
    if (part === null) result = result + "...\n";
    else result = result + doc.text.substring(part.start, part.end) + "\n";
  })

  return result;
}

export async function apiRouter(db: Db) {
  const router = Router();
  const docs = db.collection("docs");
  const cache = await buildCache(docs);

  router.get('/docs/get/:id', async (req, res) => {
    const id = req.params.id;
    if (cache.graph[id].kind === "DynamicCollection") {
      const doc: IDoc = {
        text: cache.graph[id].title + " collection"
      }

      return res.json(doc);
    }

    const opts: FindOneOptions = { projection: { _id: true } };
    const referrersFut = docs.find({ links: new ObjectID(id) }, opts).toArray();
    const hitFut = docs.findOne({ _id: new ObjectID(id) });
    const [referrers, hit] = await Promise.all([referrersFut, hitFut]);

    if (!hit)
      res.sendStatus(404);
    else {
      const doc: IDoc = {
        text: hit.text,
        description: hit.description,
        date: hit.date,
        source: hit.source,
        links: hit.links,
        authors: hit.writers,
        referrers: referrers.map(d => d._id)
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
    const hitdocs = await Promise.all(hits.map(h => docs.findOne({ _id: new ObjectID(h.ref) })))
    const result: ISearchResults = {
      term,
      hits: hits.map((h, i) => ({
        id: h.ref,
        preview: generatePreview(hitdocs[i], h)
      }))
    };
    res.json(result);
  });

  return router;
}