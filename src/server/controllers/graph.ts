import { IDocGraph } from "../../shared/IApiTypes";
import CanonData from 'cohen-db';

// Maintain pre-generated data about the document collection
// e.g. map of parents to children
export class GraphController {
  private graph: IDocGraph;

  constructor() {
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

  public getGraph(): IDocGraph {
    return this.graph;
  }
}
