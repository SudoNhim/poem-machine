import { CanonFile } from "cohen-db/schema";

export interface IDocMeta {
    kind: string;
    title: string;
    children?: string[];
}

export interface IDocReference {
    docId: string;
    section?: number;
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
    preview: string;
}

export interface ISearchResults {
    term: string;
    hits: ISearchHit[];
}
