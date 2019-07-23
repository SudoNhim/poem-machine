export interface IDocMeta {
    kind: string;
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
