import CanonData from "cohen-db";

import { IAnnotation } from "../../shared/IApiTypes";
import { DeserializeDocRef } from "../../shared/util";
import { GenerateSnippet } from "../lib/generate-preview";

const liveUpdates: { [docId: string]: IAnnotation[] } = {};

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotation[] {
    const file = CanonData[docId];
    const dbAnnotations = file.annotations || [];
    const cnvAnnotations: IAnnotation[] = dbAnnotations.map((anno) => ({
      ...anno,
      snippet: GenerateSnippet(DeserializeDocRef(`${docId}#${anno.anchor}`)),
    }));
    const liveAnnotations = liveUpdates[docId] || [];
    return [...cnvAnnotations, ...liveAnnotations];
  }

  public addAnnotation(docId: string, annotation: IAnnotation) {
    liveUpdates[docId] = [...(liveUpdates[docId] || []), annotation];
  }

  public getUpdates(): { [docId: string]: IAnnotation[] } {
    return liveUpdates;
  }
}
