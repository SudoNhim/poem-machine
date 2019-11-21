import { IDocGraph } from "../../shared/IApiTypes";
import CanonData from 'cohen-db';

// Maintain pre-generated data about the document collection
// e.g. map of parents to children
export class GraphController {
  private graph: IDocGraph;

  constructor() {
    this.graph = {
      dynamicCollectionRoot: {
        title: "root",
        kind: "DynamicCollectionRoot",
        children: []
      }
    };
    Object.keys(CanonData).forEach(key => {
      this.graph[key] = {
        title: CanonData[key].title,
        kind: 'notimplemented'
      };

      if (CanonData[key].children)
        this.graph[key].children = CanonData[key].children;
    });
  }

  public getGraph(): IDocGraph {
    return this.graph;
  }
}
