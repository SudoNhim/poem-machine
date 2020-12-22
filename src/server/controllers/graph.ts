import { Reference } from "cohen-db/schema";

import { IDocGraph } from "../../shared/ApiTypes";
import docsDb from "../database";

// Maintain pre-generated data about the document collection
// e.g. map of parents to children
export class GraphController {
  private graph: IDocGraph;
  private references: { [id: string]: Reference[] };

  constructor() {
    this.buildGraph();
    this.buildReferences();
  }

  public getGraph(): IDocGraph {
    return this.graph;
  }

  public getReferrers(id: string): Reference[] {
    return this.references[id];
  }

  private buildGraph() {
    this.graph = {
      db: {
        title: "Database root",
        kind: "root",
      },
    };

    for (var key in docsDb) {
      const doc = docsDb[key];
      this.graph[key] = {
        title: doc.title,
        kind: doc.kind,
      };

      if (doc.children) this.graph[key].children = doc.children;
    }
  }

  private buildReferences() {
    this.references = {};

    // Add all doc section references
    for (var key in docsDb) {
      const refs: Reference[] = [];
      for (var otherKey in docsDb) {
        var otherDoc = docsDb[otherKey];
        if (otherDoc.content && otherDoc.content.kind === "multipart") {
          for (const section of otherDoc.content.content) {
            for (const token of section.title.tokens) {
              if (
                token.kind === "reference" &&
                token.reference.documentId === key
              ) {
                refs.push({
                  kind: "section",
                  documentId: otherKey,
                  sectionId: section.id,
                });
              }
            }
          }
        }
      }

      this.references[key] = refs;
    }

    // Add all annotation references
    for (var key in docsDb) {
      const annotations = docsDb[key].annotations || [];
      for (var annoGroup of annotations) {
        for (var anno of annoGroup.annotations) {
          for (var tok of anno.content) {
            if (tok.kind === "docref")
              this.references[tok.docRef] = [
                ...this.references[tok.docRef],
                annoGroup.anchor,
              ];
          }
        }
      }
    }
  }
}
