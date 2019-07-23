import axios from 'axios';
import { ITestApiResult } from '../../shared/ITestApiResult';

export function getTestApiResult() {
    return axios.get('/api/test').then(res => res.data as ITestApiResult);
}