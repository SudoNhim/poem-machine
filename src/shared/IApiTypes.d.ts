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

    // List of docids of docs that have links to this one
    referrers?: IDocReference[];

    // Annotations, discussion thread....
}

export interface IDocGraph {
    [id: string]: IDocMeta;
    db: IDocMeta;
}

export interface ISearchHit {
    id: string;
    preview: Text;
}

export interface ISearchResults {
    term: string;
    hits: ISearchHit[];
}
