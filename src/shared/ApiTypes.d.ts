import { CanonFile, Fragment, Reference, Token } from "cohen-db/schema";

import { IUserAction } from "./UserActions";

export interface IDocMeta {
  kind: string;
  title: string;
  children?: string[];
}

export interface IDoc {
  file: CanonFile;

  children?: IDocReferencePreview[];

  // List of previews of docs that have links to this one
  referrers?: IDocReferencePreview[];
}

export interface IDocGraph {
  [id: string]: IDocMeta;
  db: IDocMeta;
}

export interface IDocReferencePreview {
  docRef: Reference;
  preview: Fragment[];
}

export interface IChatMessage {
  user: string;
  tokens: Token[];
}

export interface ISearchResults {
  term: string;

  // All search hits down to the line. Can be used for highlighting results in documents
  hits: Reference[];

  // A list of aggregated previews by docid/section
  previews: IDocReferencePreview[];
}

export interface IAppStatistics {
  documentsCount: number;
  stubsCount: number;
  usersCount: number;
  annotationsCount: number;
  chatMessagesCount: number;
}

interface IAppUpdateBase {
  time: string;
}

export interface IUserActionUpdate extends IAppUpdateBase {
  kind: "userAction";
  user: string;
  action: IUserAction;
}

export interface IChatUpdate extends IAppUpdateBase {
  kind: "chat";
  count: number;
}

export interface IDeploymentUpdate extends IAppUpdateBase {
  kind: "deployment";
}

export type IAppUpdate = IUserActionUpdate | IChatUpdate | IDeploymentUpdate;
