import * as React from 'react';

const css = require('./all.css');

interface IProps {
    expanded: boolean;
    canExpand: boolean;
    onClick: () => void;
}

const ExpandButton: React.FunctionComponent<IProps> = (props) =>  (
            <span 
                onClick={() => props.onClick()}
                className={css.expandbutton}
            >
                {props.canExpand ?
                    props.expanded ? "[-]" : "[+]"
                    : "[ ]"}
            </span>
);

export default ExpandButton;