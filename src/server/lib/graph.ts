import { IDocGraph } from "../../shared/IApiTypes";
import { DbDoc } from "./models";

// Maintain pre-generated data about the document collection
// e.g. map of parents to children
export class GraphGenerator {
  private graph: IDocGraph;

  constructor(corpus: { [id: string]: DbDoc }) {
    this.graph = {
      dynamicCollectionRoot: {
        title: "root",
        kind: "DynamicCollectionRoot",
        children: []
      }
    };
    Object.keys(corpus).forEach(id => {
      const doc = corpus[id];
      this.graph[id] = {
        title: doc.title,
        kind: doc.kind,
        children: doc.children
      };
      if (this.graph[doc.kind]) {
        this.graph[doc.kind].children.push(id);
      } else {
        this.graph[doc.kind] = {
          title: doc.kind,
          kind: "DynamicCollection",
          children: [id]
        };
        this.graph.dynamicCollectionRoot.children.push(doc.kind);
      }
    });
  }
}
