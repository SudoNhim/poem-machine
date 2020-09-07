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

    annotations?: IAnnotation[];

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

export interface IAnnotationTokenText {
    kind: "text";
    text: string;
}

export interface IAnnotationTokenLink {
    kind: "link";
    text: string;
    link: string;
}

export interface IAnnotationTokenDocRef {
    kind: "docref";
    docRef: string;
}

export interface IAnnotation {
    anchor: string;
    tokens: (IAnnotationTokenText | IAnnotationTokenLink | IAnnotationTokenDocRef)[];
}

export interface ISearchResults {
    term: string;

    // All search hits down to the line. Can be used for highlighting results in documents
    hits: IDocReference[];

    // A list of aggregated previews by docid/section
    previews: IDocReferencePreview[]
}
