import { IDoc, IDocGraph, ISearchResults, IDocReference } from '../shared/IApiTypes';

export interface IDocState {
    graph: IDocGraph;
    cache: { [id: string]: IDoc };
}

export interface IFocusState {
    docRef?: IDocReference;
    search?: boolean;
}

export interface IAppState {
    docs: IDocState;
    focus: IFocusState;
    search: ISearchResults;
}