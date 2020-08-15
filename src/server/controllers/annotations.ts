import { IAnnotation } from "../../shared/IApiTypes";
import CanonData from 'cohen-db';

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotation[] {
    const file = CanonData[docId];

    if (!file.annotations)
      return [];

    return file.annotations.map(anno => ({
      canonRefs: [anno.anchor],
      text: anno.tokens.map(tok => tok.text).join("")
    }));
  }
}
