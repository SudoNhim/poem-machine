import { IAnnotation } from "../../shared/IApiTypes";

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotation[] {
      return [
          {
            canonRefs: ['s0'],
            text: 'Comment on section 0'
          },
          {
            canonRefs: ['s1', 's2'],
            text: 'Comment on sections 1 and 2'
          },
          {
            canonRefs: ['s0.l2'],
            text: 'Comment on section 0 line 2'
          },
          {
            canonRefs: ['s1.p0'],
            text: 'comment on section 1 paragraph 0'
          },
          {
            canonRefs: ['p0'],
            text: 'comment on paragraph 0'
          },
          {
            canonRefs: ['p1.l2'],
            text: 'comment on paragraph 1 line 2'
          },
          {
            canonRefs: ['p0.l1', 'p1.l2'],
            text: 'comment on paragraph 0 lines 1 and 2'
          },
          {
            canonRefs: ['l8'],
            text: 'comment on line 8'
          },
          {
            canonRefs: ['l11', 'l18'],
            text: 'comment on lines 11 and 18'
          }
      ]
  }
}
