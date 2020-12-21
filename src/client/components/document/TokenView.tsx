import { Token } from "cohen-db/schema";
import * as React from "react";

interface IProps {
  token: Token;
}

const TokenView: React.FunctionComponent<IProps> = (props) => {
  const tok = props.token;
  if (tok.kind === "text") {
    return <span>{tok.text}</span>;
  } else if (tok.kind === "link") {
    return <a href={tok.link}>{tok.text || tok.link}</a>;
  } else {
    return <span>{tok.reference}</span>;
  }
};

export default TokenView;
