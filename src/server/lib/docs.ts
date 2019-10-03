import { IDocGraph, IDoc, IDocMeta } from "../../shared/IApiTypes";
import { DbDoc } from "./models";

// Maintain pre-generated data about the document collection
// e.g. map of parents to children
export class DocsWrapper {
  private graph: IDocGraph;
  private localStore: { [id: string]: DbDoc };

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

  public getGraph(): IDocGraph {
    return this.graph;
  }

  public getDoc(id: string): IDoc {
    if (!this.graph[id]) return null;

    // These docs don't actually exist
    if (this.graph[id].kind === "DynamicCollection")
      return {
        text: this.graph[id].title + " collection"
      } as IDoc;

    const dbDoc = this.localStore[id];
    const apiDoc: IDoc = {
      text: dbDoc.text,
      description: dbDoc.description,
      links: ["deprecated"]
    };

    return apiDoc;
  }
}
