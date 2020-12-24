import { Divider, Theme, makeStyles } from "@material-ui/core";
import { Content, MainContent, SectionalContent } from "cohen-db/schema";
import * as React from "react";

import FragmentView from "./FragmentView";
import SectionTitle from "./SectionTitle";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
}));

interface IProps {
  content: Content;
}

const ContentView: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  if (props.content.kind === "multipart") {
    const sections: SectionalContent[] = props.content.content;
    return (
      <div>
        {props.content.content.map((section, i) => (
          <div id={`${section.id}:`} key={i}>
            <SectionTitle title={section.title} />
            {section.fragments.map((frag, i) => (
              <FragmentView
                fragment={frag}
                previous={section.fragments[i - 1]}
                sectionId={section.id}
                interactive={true}
                key={i}
              />
            ))}
            {i < sections.length - 1 && <Divider className={classes.divider} />}
          </div>
        ))}
      </div>
    );
  } else {
    const mainContent: MainContent = props.content.content;
    return (
      <div className={classes.root}>
        {mainContent.fragments.map((frag, i) => (
          <FragmentView
            fragment={frag}
            previous={mainContent.fragments[i - 1]}
            interactive={true}
            key={i}
          />
        ))}
      </div>
    );
  }
};

export default ContentView;
