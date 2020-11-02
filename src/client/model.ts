import {
  IAnnotation,
  IAnnotationsGroup,
  IDocGraph,
  IDocReference,
} from "../shared/IApiTypes";

export interface IDocState {
  graph: IDocGraph;
}

export interface IFocusState {
  docRef?: IDocReference;

  // Set to true when navigating to a new url using #fragment
  // Unset when render is finished and scrollIntoView is called
  waitingToScroll?: boolean;

  annotations: IAnnotationsGroup[];
}

export interface IHoverState {
  docParts?: string[];
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
