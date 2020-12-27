import { TextFragment } from "cohen-db/schema";
import * as React from "react";

import TokenView from "../shared/TokenView";

interface IProps {
  fragment: TextFragment;
}

const TextFragmentEditor: React.FunctionComponent<IProps> = (props) => {
  return (
    <div>
      {props.fragment.tokens.map((tok, i) => (
        <TokenView token={tok} key={i} />
      ))}
    </div>
  );
};

export default TextFragmentEditor;
