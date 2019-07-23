import * as React from 'react';
import { getTestApiResult } from '../api/test-api';
import { ITestApiResult } from '../../shared/ITestApiResult';

interface IState {
    testResult: ITestApiResult;
}

export class Main extends React.Component<any, IState> {
    public render() {
        if (this.state && this.state.testResult)
            return <p>Result: {this.state.testResult.result}</p>
        else
            return <p>Loading...</p>
    }

    public async componentDidMount() {
        const testResult = await getTestApiResult();
        this.setState({ testResult });
    }
}