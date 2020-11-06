import { IAnnotationsGroup } from "../../shared/IApiTypes";
import docsDb from "../database";

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotationsGroup[] {
    const file = docsDb[docId];
    const dbAnnotations = file.annotations || [];
    const cnvAnnotations: IAnnotationsGroup[] = dbAnnotations.map((grp) => ({
      anchor: grp.anchor,
      annotations: grp.annotations.map((anno) => ({
        ...anno,
      })),
    }));
    return cnvAnnotations;
  }
}
