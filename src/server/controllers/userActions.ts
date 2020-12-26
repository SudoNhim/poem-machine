import { Annotation, CanonFile, Reference, Token } from "cohen-db/schema";

import { IUserAction } from "../../shared/UserActions";
import { DocRefEquals } from "../../shared/util";
import docsDb from "../database";
import { DocUpdate } from "../models/DocUpdate";

export class UserActionsController {
  public async apply(user: string, action: IUserAction) {
    const update = new DocUpdate({
      time: new Date(),
      user,
      action,
      file: this.runAction(user, action),
    });

    await update.save();
    docsDb[action.documentId] = update.file;
  }

  private runAction(user: string, action: IUserAction): CanonFile {
    // To & from JSON for a deep copy
    const doc = JSON.parse(
      JSON.stringify(docsDb[action.documentId])
    ) as CanonFile;
    doc.version++;

    switch (action.kind) {
      case "addAnnotation":
        return this.addAnnotation(doc, user, action.anchor, action.tokens);
      case "editAnnotation":
        return this.editAnnotation(
          doc,
          user,
          action.anchor,
          action.annotationId,
          action.tokens
        );
      case "deleteAnnotation":
        return this.deleteAnnotation(
          doc,
          user,
          action.anchor,
          action.annotationId
        );
      default:
        throw new Error("Unrecognized user action");
    }
  }

  private addAnnotation(
    doc: CanonFile,
    user: string,
    anchor: Reference,
    tokens: Token[]
  ): CanonFile {
    // If there's no group for this annotation, create one
    if (!doc.annotations.find((grp) => DocRefEquals(grp.anchor, anchor))) {
      doc.annotations.push({
        anchor,
        annotations: [],
      });
    }

    // Determine the id of the new annotation - one higher than exists
    const grp = doc.annotations.find((grp) => DocRefEquals(grp.anchor, anchor));
    let id = 0;
    for (var anno of grp.annotations) {
      id = Math.max(id, parseInt(anno.id));
    }

    id += 1;

    const newAnno: Annotation = {
      id: `${id}`,
      user,
      tokens,
    };
    grp.annotations.push(newAnno);

    return doc;
  }

  private editAnnotation(
    doc: CanonFile,
    user: string,
    anchor: Reference,
    annotationId: string,
    content: Token[]
  ): CanonFile {
    const grp = doc.annotations.find((grp) => DocRefEquals(grp.anchor, anchor));
    const index = grp.annotations.findIndex((anno) => anno.id === annotationId);

    // Ensure that the user has permission to edit this annotation.
    this.authCheck(user, grp.annotations[index].user);

    grp.annotations[index].tokens = content;

    return doc;
  }

  private deleteAnnotation(
    doc: CanonFile,
    user: string,
    anchor: Reference,
    annoId: string
  ): CanonFile {
    const grp = doc.annotations.find((grp) => DocRefEquals(grp.anchor, anchor));

    // Ensure that the user has permission to delete this annotation
    const anno = grp.annotations.find((anno) => anno.id === annoId);
    this.authCheck(user, anno.user);

    grp.annotations = grp.annotations.filter((anno) => anno.id !== annoId);

    // If the group now has no annotations, remove the group
    if (grp.annotations.length === 0) {
      doc.annotations = doc.annotations.filter((grp) =>
        DocRefEquals(grp.anchor, anchor)
      );
    }

    return doc;
  }

  private authCheck(user: string, owner: string) {
    if (user !== "sudonhim" && owner !== "anonymous") {
      if (user !== owner) {
        throw new Error(
          `User ${user} does not have authorization to edit content owned by ${owner}`
        );
      }
    }
  }
}
