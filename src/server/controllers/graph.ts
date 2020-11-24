import { isArray } from "util";

import {
  IAnnotationsGroup,
  IContentTokenDocRef,
  IDocGraph,
  IDocReference,
} from "../../shared/ApiTypes";
import { DeserializeDocRef } from "../../shared/util";
import docsDb from "../database";

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
      const refs: IDocReference[] = [];
      for (var otherKey in docsDb) {
        var otherDoc = docsDb[otherKey];
        var parts = otherDoc.content && otherDoc.content.content;
        if (isArray(parts)) {
          parts.forEach((part, i) => {
            if (part.reference === key && part.content)
              // Don't add refs for empty parts
              refs.push({
                docId: otherKey,
                section: i + 1,
              });
          });
        }
      }

      this.references[key] = refs;
    }

    // Add all annotation references
    for (var key in docsDb) {
      const annotations = docsDb[key].annotations || [];
      for (var annoGroup of annotations as IAnnotationsGroup[]) {
        for (var anno of annoGroup.annotations) {
          for (var tok of anno.content) {
            var ref = (tok as IContentTokenDocRef).docRef;
            if (ref)
              this.references[ref] = [
                ...this.references[ref],
                DeserializeDocRef(`${key}#${annoGroup.anchor}`),
              ];
          }
        }
      }
    }
  }
}
