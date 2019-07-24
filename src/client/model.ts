import { IDoc, IDocGraph, ISearchResults } from '../shared/IApiTypes';

export interface IDocState {
    graph: IDocGraph;
    cache: { [id: string]: IDoc };
}

export interface IFocusState {
    docId?: string;
    search?: boolean;
}

export interface IAppState {
    docs: IDocState;
    focus: IFocusState;
    search: ISearchResults;
}