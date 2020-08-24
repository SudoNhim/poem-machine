import { IAnnotation } from "../../shared/IApiTypes";
import CanonData from 'cohen-db';

const liveUpdates: {[docId: string]: IAnnotation[]} = {};

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotation[] {
    const file = CanonData[docId];
    const dbAnnotations = (file.annotations || []).map(anno => ({
      canonRefs: [anno.anchor],
      text: anno.tokens.map(tok => tok.text).join("")
    }));
    const liveAnnotations = liveUpdates[docId] || [];
    return [...dbAnnotations, ...liveAnnotations];
  }

  public addAnnotation(docId: string, annotation: IAnnotation) {
    liveUpdates[docId] = [
      ...(liveUpdates[docId] || []),
      annotation
    ];
  }
}
