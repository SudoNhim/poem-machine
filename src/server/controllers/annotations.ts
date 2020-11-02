import CanonData from "cohen-db";

import { IAnnotationsGroup } from "../../shared/IApiTypes";
import { DeserializeDocRef } from "../../shared/util";
import { GenerateSnippet } from "../lib/generate-preview";

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotationsGroup[] {
    const file = CanonData[docId];
    const dbAnnotations = file.annotations || [];
    const cnvAnnotations: IAnnotationsGroup[] = dbAnnotations.map((grp) => ({
      anchor: grp.anchor,
      snippet: GenerateSnippet(DeserializeDocRef(`${docId}#${grp.anchor}`)),
      annotations: grp.annotations.map((anno) => ({
        ...anno,
      })),
    }));
    return cnvAnnotations;
  }
}
