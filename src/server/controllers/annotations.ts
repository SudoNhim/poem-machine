import { IAnnotation } from "../../shared/IApiTypes";
import CanonData from 'cohen-db';

const liveUpdates: {[docId: string]: IAnnotation[]} = {};

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotation[] {
    const file = CanonData[docId];
    const dbAnnotations: IAnnotation[] = (file.annotations || []);
    const liveAnnotations = liveUpdates[docId] || [];
    return [...dbAnnotations, ...liveAnnotations];
  }

  public addAnnotation(docId: string, annotation: IAnnotation) {
    liveUpdates[docId] = [
      ...(liveUpdates[docId] || []),
      annotation
    ];
  }

  public getUpdates(): {[docId: string]: IAnnotation[]} {
    return liveUpdates;
  }
}
