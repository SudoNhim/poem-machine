import { IDocGraph, IDocReference } from "../../shared/IApiTypes";
import CanonData from 'cohen-db';
import { isArray } from 'util';

// Maintain pre-generated data about the document collection
// e.g. map of parents to children
export class GraphController {
  private graph: IDocGraph;
  private references: { [id: string]: IDocReference[] };

  constructor() {
    this.buildGraph();
    this.buildReferences();
  }

  public getGraph(): IDocGraph {
    return this.graph;
  }

  public getReferrers(id: string): IDocReference[] {
    return this.references[id];
  }

  private buildGraph() {
    this.graph = {
      db: {
        title: "Database root",
        kind: "root"
      }
    };

    for (var key in CanonData) {
      const doc = CanonData[key];
      this.graph[key] = {
        title: doc.title,
        kind: doc.kind
      };

      if (doc.children) this.graph[key].children = doc.children;
    }
  }

  private buildReferences() {
    this.references = {};
    
    for (var key in CanonData) {
      const refs: IDocReference[] = [];
      for (var otherKey in CanonData) {
        var otherDoc = CanonData[otherKey];
        var parts = otherDoc.content && otherDoc.content.content;
        if (isArray(parts)) {
          parts.forEach((part, i) => {
            if (part.reference === key)
              refs.push({
                docId: otherKey,
                section: i
              });
          });
        }
      }

      this.references[key] = refs;
    }
  }
}
