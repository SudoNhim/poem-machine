import axios from "axios";

import {
  IAnnotation,
  IDoc,
  IDocGraph,
  ISearchResults,
} from "../shared/IApiTypes";

export async function getDoc(id: string): Promise<IDoc> {
  const response = await axios.get(`/api/docs/get/${id}`);
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

export async function setAnnotation(
  docId: string,
  annotation: IAnnotation
): Promise<void> {
  await axios.post(`/api/docs/set/${docId}/annotations`, { annotation });
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

export async function getUser(): Promise<{ username: string }> {
  const response = await axios.get(`/api/user`);
  return response.data.user;
}
