import axios from 'axios';
import * as api from '../shared/apiTypes';

export async function getDocument(id: string): Promise<api.IDoc> {
    const response = await axios.get(`/api/docs/get/${id}`);
    return response.data as api.IDoc;
}

export async function getGraph(): Promise<api.IDocGraph> {
    const response = await axios.get(`/api/docs/graph`);
    return response.data as api.IDocGraph;
}

export async function getSearchResults(term: string): Promise<api.ISearchResults> {
    const response = await axios.get(`/api/docs/search/${term}`);
    return response.data as api.ISearchResults;
}
