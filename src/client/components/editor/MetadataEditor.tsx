import { Metadata } from "cohen-db/schema";
import * as React from "react";

interface IProps {
  metadata: Metadata;
}

const MetadataEditor: React.FunctionComponent<IProps> = (props) => {
  return <div>{props.metadata?.date}</div>;
};

export default MetadataEditor;
