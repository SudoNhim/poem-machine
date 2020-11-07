import { CanonFile, Text } from "cohen-db/schema";

export interface IDocMeta {
  kind: string;
  title: string;
  children?: string[];
}

export interface IDocReference {
  docId: string;

  // Section is applicable only in a multipart document
  section?: number;

  // Location in canonical text
  paragraph?: number;
  line?: number;

  // One or more pairs of [start, length]
  substrings?: number[][];
}

export interface IDoc {
  file: CanonFile;

  children?: IDocReferencePreview[];

  // List of previews of docs that have links to this one
  referrers?: IDocReferencePreview[];

  annotations: IAnnotationsGroup[];

  // Annotations, discussion thread....
}

export interface IDocGraph {
  [id: string]: IDocMeta;
  db: IDocMeta;
}

export interface IDocReferencePreview {
  docRef: IDocReference;
  preview: Text;
}

export interface IContentTokenText {
  kind: "text";
  text: string;
}

export interface IContentTokenLink {
  kind: "link";
  text: string;
  link: string;
}

export interface IContentTokenDocRef {
  kind: "docref";
  docRef: string;
}

export type IContentToken =
  | IContentTokenText
  | IContentTokenLink
  | IContentTokenDocRef;

export interface IAnnotation {
  user: string;
  indexByUser: number; // -1 for new, positive for existing
  content: IContentToken[];
}

export interface IChatMessage {
  user: string;
  content: IContentToken[];
}

export interface IAnnotationsGroup {
  anchor: string;
  annotations: IAnnotation[];
}

export interface ISearchResults {
  term: string;

  // All search hits down to the line. Can be used for highlighting results in documents
  hits: IDocReference[];

  // A list of aggregated previews by docid/section
  previews: IDocReferencePreview[];
}
