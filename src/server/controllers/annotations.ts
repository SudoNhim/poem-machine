import { AnnotationsGroup } from "cohen-db/schema";

import { IAnnotationsGroup } from "../../shared/IApiTypes";
import docsDb from "../database";

export class AnnotationsController {
  private convertAnnotationsGroup(group: AnnotationsGroup): IAnnotationsGroup {
    const countByUser: { [user: string]: number } = {};
    return {
      ...group,
      annotations: group.annotations.map((anno) => {
        if (!countByUser[anno.user]) countByUser[anno.user] = 0;
        return {
          ...anno,
          indexByUser: countByUser[anno.user]++,
        };
      }),
    };
  }

  public getAnnotations(docId: string): IAnnotationsGroup[] {
    const file = docsDb[docId];
    const dbAnnotations = file.annotations || [];
    const cnvAnnotations: IAnnotationsGroup[] = dbAnnotations.map(
      this.convertAnnotationsGroup
    );
    return cnvAnnotations;
  }
}
