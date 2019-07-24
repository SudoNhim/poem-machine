import * as React from 'react';
import { connect } from 'react-redux';
import { IDocGraph } from '../../shared/IApiTypes';
import { IAppState } from '../model';
import NavTreeNode from './NavTreeNode';

interface IProps {
    graph: IDocGraph;
}

const NavTree: React.FunctionComponent<IProps> = (props) =>  (
    <div>
        {(props.graph.dynamicCollectionRoot.children || []).map((id, index) =>
            <NavTreeNode id={id} key={index} />)}
    </div>
);

const mapStateToProps = (state: IAppState): IProps => ({
    graph: state.docs.graph
});

export default connect(mapStateToProps, {})(NavTree);