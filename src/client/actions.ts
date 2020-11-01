import { IAnnotation, IDocGraph } from "../shared/IApiTypes";
import { IFocusState, IHoverState, IUserState, SideBarOpen } from "./model";

export const SET_GRAPH = "SET_GRAPH";
export const SET_ANNOTATION = "SET_ANNOTATION";
export const SET_FOCUS = "SET_FOCUS";
export const SET_HOVER = "SET_HOVER";
export const SET_SCROLLED = "SET_SCROLLED";
export const SET_SIDEBAR_OPEN = "SET_SIDEBAR_OPEN";
export const SET_USER = "SET_USER";

interface SetGraphAction {
  type: typeof SET_GRAPH;
  payload: IDocGraph;
}

interface SetAnnotationAction {
  type: typeof SET_ANNOTATION;
  payload: { docId: string; annotation: IAnnotation };
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

interface SetSideBarOpenAction {
  type: typeof SET_SIDEBAR_OPEN;
  payload: SideBarOpen;
}

interface SetUserAction {
  type: typeof SET_USER;
  payload: IUserState;
}

export type ActionTypes =
  | SetGraphAction
  | SetAnnotationAction
  | SetFocusAction
  | SetHoverAction
  | SetScrolledAction
  | SetSideBarOpenAction
  | SetUserAction;

export function setGraph(graph: IDocGraph): SetGraphAction {
  return {
    type: SET_GRAPH,
    payload: graph,
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

export function setScrolled(): SetScrolledAction {
  return {
    type: SET_SCROLLED,
  };
}

export function setUser(user: IUserState): SetUserAction {
  return {
    type: SET_USER,
    payload: user,
  };
}
