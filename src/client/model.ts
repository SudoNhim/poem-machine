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

export interface IUserState {
  username?: string;
}

export interface IAppState {
  docs: IDocState;
  focus: IFocusState;
  hover: IHoverState;
  user: IUserState;
}
