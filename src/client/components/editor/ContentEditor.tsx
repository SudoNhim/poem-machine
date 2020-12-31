import { Content } from "cohen-db/schema";
import * as React from "react";

interface IProps {
  useMultipart: boolean;
  content: Content | null;
  onChange: (value: Content | null) => void;
}

const ContentEditor: React.FunctionComponent<IProps> = (props) => {
  return <div>{JSON.stringify(props)}</div>;
};

export default ContentEditor;
