import { IAnnotationsGroup } from "../../shared/ApiTypes";
import docsDb from "../database";

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotationsGroup[] {
    const file = docsDb[docId];
    const dbAnnotations = file.annotations || [];
    return dbAnnotations;
  }
}
