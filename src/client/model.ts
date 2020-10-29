import { IDocGraph, IDocReference } from "../shared/IApiTypes";

export interface IDocState {
  graph: IDocGraph;
}

export interface IFocusState {
  docRef?: IDocReference;

  // Set to true when navigating to a new url using #fragment
  // Unset when render is finished and scrollIntoView is called
  waitingToScroll?: boolean;
}

export interface IHoverState {
  docParts?: string[];
}

export interface IUiState {
  // Always open on large screens, on smaller screens this toggles
  // the navigation pane
  navPaneOpen: boolean;
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
