import { IContentToken } from "./ApiTypes";

// Any kind of update that creates a change in the docs DB
export type IUserAction =
  | IAddAnnotationUpdate
  | IEditAnnotationUpdate
  | IDeleteAnnotationUpdate;

interface IUserActionBase {
  documentId: string;
}

interface IAnnotationUpdateBase extends IUserActionBase {
  anchor: string;
}

export interface IAddAnnotationUpdate extends IAnnotationUpdateBase {
  kind: "addAnnotation";
  content: IContentToken[];
}

export interface IEditAnnotationUpdate extends IAnnotationUpdateBase {
  kind: "editAnnotation";
  annotationId: string;
  content: IContentToken[];
}

export interface IDeleteAnnotationUpdate extends IAnnotationUpdateBase {
  kind: "deleteAnnotation";
  annotationId: string;
}
