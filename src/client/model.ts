import { IDoc, IDocGraph } from "../shared/ApiTypes";

export interface IDocCache {
  [docId: string]: IDoc;
}

export interface IDocState {
  graph: IDocGraph;
  cache: IDocCache;
}

export interface IFocusState {
  docId: string;
  docPart: string;
}

export interface IHoverState {
  docPart: string;
}

export enum SideBarOpen {
  left = "LEFT",
  right = "RIGHT",
  none = "NONE",
}

export interface IUiState {
  // Always open on large screens, on smaller screens this toggles
  // the navigation pane
  sideBarOpen: SideBarOpen;
}

export interface IUserState {
  username?: string;
}

export interface IAppState {
  docs: IDocState;
  focus: IFocusState;
  hover: IHoverState;
  ui: IUiState;
  user: IUserState;
}
