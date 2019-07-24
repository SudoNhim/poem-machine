import { IDocGraph, IDoc, ISearchResults } from "../shared/IApiTypes";
import { IFocusState } from "./model";

export const SET_GRAPH = 'SET_GRAPH';
export const SET_DOC = 'SET_DOC';
export const SET_SEARCH = 'SET_SEARCH';
export const SET_FOCUS = 'SET_FOCUS';

interface SetGraphAction {
    type: typeof SET_GRAPH;
    payload: IDocGraph;
}

interface SetDocAction {
    type: typeof SET_DOC;
    payload: { id: string, doc: IDoc };
}

interface SetSearchAction {
    type: typeof SET_SEARCH;
    payload: ISearchResults;
}

interface SetFocusAction {
    type: typeof SET_FOCUS;
    payload: IFocusState;
}

export type ActionTypes = SetGraphAction | SetDocAction | SetSearchAction | SetFocusAction;

export function setGraph(graph: IDocGraph): SetGraphAction {
    return {
        type: SET_GRAPH,
        payload: graph
    };
}

export function setDoc(id: string, doc: IDoc): SetDocAction {
    return {
        type: SET_DOC,
        payload: { id, doc }
    };
}

export function setSearch(searchResults: ISearchResults): SetSearchAction {
    return {
        type: SET_SEARCH,
        payload: searchResults
    };
}

export function setFocus(focus: IFocusState): SetFocusAction {
    return {
        type: SET_FOCUS,
        payload: focus
    };
}