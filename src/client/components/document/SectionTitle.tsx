import { TextFragment } from "cohen-db/schema";
import * as React from "react";

import TokenView from "../shared/TokenView";

interface IProps {
  title: TextFragment;
}

const SectionTitle: React.FunctionComponent<IProps> = (props) => {
  return (
    <div>
      {props.title.tokens.map((tok, i) => (
        <TokenView token={tok} key={i} />
      ))}
    </div>
  );
};

export default SectionTitle;
