import * as React from 'react';
import { IDocGraph } from '../../shared/IApiTypes';
import NavTreeNode from './NavTreeNode';

interface IProps {
    graph: IDocGraph;
}

const NavTree: React.FunctionComponent<IProps> = (props) =>  (
    <div className="navtree">
        {(props.graph.dynamicCollectionRoot.children || []).map((id, index) =>
            <NavTreeNode id={id} graph={props.graph} key={index} />)}
    </div>
);

export default NavTree;