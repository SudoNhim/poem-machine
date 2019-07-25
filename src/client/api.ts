import axios from 'axios';
import { IDoc, IDocGraph, ISearchResults } from '../shared/IApiTypes';

export async function getDoc(id: string): Promise<IDoc> {
    const response = await axios.get(`/api/docs/get/${id}`);
    return response.data as IDoc;
}

export async function getGraph(): Promise<IDocGraph> {
    const response = await axios.get(`/api/docs/graph`);
    return response.data as IDocGraph;
}

export async function getSearchResults(term: string): Promise<ISearchResults> {
    if (term.length < 3)
        return null;

    const response = await axios.get(`/api/docs/search/${term}`);
    return response.data as ISearchResults;
}
