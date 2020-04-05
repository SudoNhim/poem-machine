import { IAnnotation } from "../../shared/IApiTypes";

export class AnnotationsController {
  public getAnnotations(docId: string): IAnnotation[] {
      return [
          {
            canonRefs: ['s1'],
            text: 'Comment on section 1'
          },
          {
            canonRefs: ['s1', 's2'],
            text: 'Comment on sections 1 and 2'
          },
          {
            canonRefs: ['s2.l2'],
            text: 'Comment on section 2 line 2'
          },
          {
            canonRefs: ['s1.p1'],
            text: 'comment on section 1 paragraph 1'
          },
          {
            canonRefs: ['p1'],
            text: 'comment on paragraph 1'
          },
          {
            canonRefs: ['p2.l4'],
            text: 'comment on paragraph 2 line 4'
          },
          {
            canonRefs: ['p2.l2', 'p2.l3'],
            text: 'comment on paragraph 2 lines 2 and 3'
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
