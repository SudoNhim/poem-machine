import { string } from "prop-types";

export enum DocKind {
    // Documents from the database
    Album = 1,
    Song,
    Prologue,

    // Documents constructed by the server
    DynamicCollection, // e.g. "Songs", "Albums"
    DynamicCollectionRoot // collection of dynamic collections
}

export interface IDocMeta {
    kind: DocKind;
    title: string;
    children?: string[];
}

export interface IDoc {
    text?: string;
    date?: string;
    source?: string;
    authors?: string[];
    links?: string[];
}

export interface IDocGraph {
    [id: string]: IDocMeta;
    dynamicCollectionRoot: IDocMeta;
}

export interface ISearchHit {
    id: string;
    preview: string;
}

export interface ISearchResults {
    hits: ISearchHit[];
}
