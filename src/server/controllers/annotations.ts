import CanonData from "cohen-db";

import { IAnnotation } from "../../shared/IApiTypes";
import { DeserializeDocRef } from "../../shared/util";
import { GenerateSnippet } from "../lib/generate-preview";

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotation[] {
    const file = CanonData[docId];
    const dbAnnotations = file.annotations || [];
    const cnvAnnotations: IAnnotation[] = dbAnnotations.map((anno) => ({
      ...anno,
      snippet: GenerateSnippet(DeserializeDocRef(`${docId}#${anno.anchor}`)),
    }));
    return cnvAnnotations;
  }
}
