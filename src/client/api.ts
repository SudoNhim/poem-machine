import axios from "axios";

import {
  IAppStatistics,
  IAppUpdate,
  IDoc,
  IDocGraph,
  ISearchResults,
} from "../shared/ApiTypes";
import { IUserAction } from "../shared/UserActions";

export async function getDoc(id: string): Promise<IDoc> {
  const response = await axios.get(
    `/api/docs/get/${id}?timestamp=${Date.now()}`
  );
  return response.data as IDoc;
}

export async function getGraph(): Promise<IDocGraph> {
  const response = await axios.get(`/api/docs/graph`);
  return response.data as IDocGraph;
}

export async function getSearchResults(term: string): Promise<ISearchResults> {
  if (term.length < 3) return null;

  const response = await axios.get(`/api/docs/search/${term}`);
  return response.data as ISearchResults;
}

export async function postUserAction(
  action: IUserAction
): Promise<{ error?: string }> {
  return await axios.post(`/api/docs/post`, {
    action,
  });
}

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  try {
    await axios.post(`/api/login`, null, {
      params: { username, password },
    });
    return true;
  } catch {
    return false;
  }
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const response = await axios.post(`/api/register`, {
    username,
    email,
    password,
  });
  if (response.data.error) throw response.data.error;
}

export async function getUser(): Promise<{ username: string }> {
  const response = await axios.get(`/api/user`);
  return response.data.user;
}

export async function getStatistics(): Promise<IAppStatistics> {
  const response = await axios.get(`/api/statistics`);
  return response.data;
}

export async function getFeed(): Promise<IAppUpdate[]> {
  const response = await axios.get(`/api/feed`);
  return response.data;
}
