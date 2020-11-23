import { IDoc, IDocGraph } from "../shared/ApiTypes";
import { IFocusState, IHoverState, IUserState, SideBarOpen } from "./model";

export const SET_DOC = "SET_DOC";
export const SET_GRAPH = "SET_GRAPH";
export const SET_FOCUS = "SET_FOCUS";
export const SET_HOVER = "SET_HOVER";
export const SET_SCROLLED = "SET_SCROLLED";
export const SET_SIDEBAR_OPEN = "SET_SIDEBAR_OPEN";
export const SET_USER = "SET_USER";

interface SetDocAction {
  type: typeof SET_DOC;
  payload: { docId: string; doc: IDoc };
}

interface SetGraphAction {
  type: typeof SET_GRAPH;
  payload: IDocGraph;
}

interface SetFocusAction {
  type: typeof SET_FOCUS;
  payload: IFocusState;
}

interface SetHoverAction {
  type: typeof SET_HOVER;
  payload: IHoverState;
}

interface SetSideBarOpenAction {
  type: typeof SET_SIDEBAR_OPEN;
  payload: SideBarOpen;
}

interface SetUserAction {
  type: typeof SET_USER;
  payload: IUserState;
}

export type ActionTypes =
  | SetDocAction
  | SetGraphAction
  | SetFocusAction
  | SetHoverAction
  | SetSideBarOpenAction
  | SetUserAction;

export function setDoc(docId: string, doc: IDoc): SetDocAction {
  return {
    type: SET_DOC,
    payload: { docId, doc },
  };
}

export function setGraph(graph: IDocGraph): SetGraphAction {
  return {
    type: SET_GRAPH,
    payload: graph,
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

export function setSideBarOpen(state: SideBarOpen): SetSideBarOpenAction {
  return {
    type: SET_SIDEBAR_OPEN,
    payload: state,
  };
}

export function setUser(user: IUserState): SetUserAction {
  return {
    type: SET_USER,
    payload: user,
  };
}
