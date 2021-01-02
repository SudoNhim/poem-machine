import { Content, MainContent, SectionalContent } from "cohen-db/schema";
import * as React from "react";

import FragmentsEditor from "./FragmentsEditor";
import SectionTitleEditor from "./SectionTitleEditor";

interface IProps {
  useMultipart: boolean;
  content: Content | null;
  onChange: (value: Content | null) => void;
}

const emptySectionalContent: SectionalContent = {
  id: "",
  title: { kind: "text", tokens: [] },
  fragments: [],
};

const emptyMainContent: MainContent = {
  fragments: [],
};

const ContentEditor: React.FunctionComponent<IProps> = (props) => {
  const content: Content =
    props.content ||
    (props.useMultipart
      ? { kind: "multipart", content: [emptySectionalContent] }
      : { kind: "simple", content: emptyMainContent });

  if (content.kind === "simple") {
    return <FragmentsEditor fragments={content.content.fragments} />;
  } else {
    return (
      <React.Fragment>
        {content.content.map((section, i) => (
          <React.Fragment key={i}>
            <SectionTitleEditor value={section.title} />
            <FragmentsEditor fragments={section.fragments} />
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }
};

export default ContentEditor;
