import { IDoc, IDocGraph, ISearchResults, IDocReference } from '../shared/IApiTypes';

export interface IDocState {
    graph: IDocGraph;
    cache: { [id: string]: IDoc };
}

export interface IFocusState {
    docRef?: IDocReference;
    search?: boolean;

    // Set to true when navigating to a new url using #fragment
    // Unset when render is finished and scrollIntoView is called
    waitingToScroll?: boolean;
}

export interface IAppState {
    docs: IDocState;
    focus: IFocusState;
    search: ISearchResults;
}