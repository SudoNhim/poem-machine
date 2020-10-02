import {
  IAnnotation,
  IDoc,
  IDocGraph,
  ISearchResults,
} from "../shared/IApiTypes";
import { IFocusState, IHoverState } from "./model";

export const SET_GRAPH = "SET_GRAPH";
export const SET_DOC = "SET_DOC";
export const SET_ANNOTATION = "SET_ANNOTATION";
export const SET_SEARCH = "SET_SEARCH";
export const SET_FOCUS = "SET_FOCUS";
export const SET_HOVER = "SET_HOVER";
export const SET_SCROLLED = "SET_SCROLLED";
export const SET_NAV_PANE_OPEN = "SET_NAV_PANE_OPEN";

interface SetGraphAction {
  type: typeof SET_GRAPH;
  payload: IDocGraph;
}

interface SetDocAction {
  type: typeof SET_DOC;
  payload: { id: string; doc: IDoc };
}

interface SetAnnotationAction {
  type: typeof SET_ANNOTATION;
  payload: { docId: string; annotation: IAnnotation };
}

interface SetSearchAction {
  type: typeof SET_SEARCH;
  payload: ISearchResults;
}

interface SetFocusAction {
  type: typeof SET_FOCUS;
  payload: IFocusState;
}

interface SetHoverAction {
  type: typeof SET_HOVER;
  payload: IHoverState;
}

interface SetScrolledAction {
  type: typeof SET_SCROLLED;
}

interface SetNavPaneOpenAction {
  type: typeof SET_NAV_PANE_OPEN;
  payload: boolean;
}

export type ActionTypes =
  | SetGraphAction
  | SetDocAction
  | SetAnnotationAction
  | SetSearchAction
  | SetFocusAction
  | SetHoverAction
  | SetScrolledAction
  | SetNavPaneOpenAction;

export function setGraph(graph: IDocGraph): SetGraphAction {
  return {
    type: SET_GRAPH,
    payload: graph,
  };
}

export function setDoc(id: string, doc: IDoc): SetDocAction {
  return {
    type: SET_DOC,
    payload: { id, doc },
  };
}

export function setAnnotation(
  docId: string,
  annotation: IAnnotation
): SetAnnotationAction {
  return {
    type: SET_ANNOTATION,
    payload: { docId, annotation },
  };
}

export function setSearch(searchResults: ISearchResults): SetSearchAction {
  return {
    type: SET_SEARCH,
    payload: searchResults,
  };
}

export function setFocus(focus: IFocusState): SetFocusAction {
  return {
    type: SET_FOCUS,
    payload: focus,
  };
}

export function setHover(hover: IHoverState): SetHoverAction {
  return {
    type: SET_HOVER,
    payload: hover,
  };
}

export function setNavPaneOpen(isOpen: boolean): SetNavPaneOpenAction {
  return {
    type: SET_NAV_PANE_OPEN,
    payload: isOpen,
  };
}

export function setScrolled(): SetScrolledAction {
  return {
    type: SET_SCROLLED,
  };
}
