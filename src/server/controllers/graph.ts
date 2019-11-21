import { IDocGraph } from "../../shared/IApiTypes";
import CanonData from 'cohen-db';

// Maintain pre-generated data about the document collection
// e.g. map of parents to children
// Note that child IDs in the graph are computed to their full form,
// so e.g. the child 'song' of 'db' is stored as 'db/song'
export class GraphController {
  private graph: IDocGraph;

  constructor() {
    this.graph = {
      db: {
        title: "Database root",
        kind: "root"
      }
    };

    // Add the children of a node, add their metadata, then recurse
    const addRecursive = (id: string) => {
      if (!CanonData[id].children) return;

      this.graph[id].children = CanonData[id].children
        .map(childId => `${id}/${childId}`);

      for (var childId of this.graph[id].children) {
        this.graph[childId] = {
          title: CanonData[childId].title,
          kind: 'canonfile'
        };

        addRecursive(childId);
      }
    };

    addRecursive('db');
  }

  public getGraph(): IDocGraph {
    return this.graph;
  }
}
