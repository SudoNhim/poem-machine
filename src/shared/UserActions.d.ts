import { CanonFile, Reference, Token } from "cohen-db/schema";

// Any kind of update that creates a change in the docs DB
export type IUserAction =
  | IAddAnnotationUpdate
  | IEditAnnotationUpdate
  | IDeleteAnnotationUpdate
  | IAddDocumentUpdate
  | IEditDocumentUpdate
  | IDeleteDocumentUpdate;

interface IUserActionBase {
  documentId: string;
}

interface IAnnotationUpdateBase extends IUserActionBase {
  anchor: Reference;
}

export interface IAddAnnotationUpdate extends IAnnotationUpdateBase {
  kind: "addAnnotation";
  tokens: Token[];
}

export interface IEditAnnotationUpdate extends IAnnotationUpdateBase {
  kind: "editAnnotation";
  annotationId: string;
  tokens: Token[];
}

export interface IDeleteAnnotationUpdate extends IAnnotationUpdateBase {
  kind: "deleteAnnotation";
  annotationId: string;
}

export interface IAddDocumentUpdate extends IUserActionBase {
  kind: "addDocument";
  file: CanonFile;
}

export interface IEditDocumentUpdate extends IUserActionBase {
  kind: "editDocument";
  file: CanonFile;
}

export interface IDeleteDocumentUpdate extends IUserActionBase {
  kind: "deleteDocument";
}
