import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { IDoc, IDocMeta } from "../../shared/IApiTypes";
import { setFocus } from "../actions";
import { getDoc } from "../api";
import { IAppState } from "../model";
import Annotator from "./annotator/Annotator";
import DocViewer from "./docviewer/DocViewer";

interface IMatchParams {
  docId?: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
  docMeta: IDocMeta;
  setFocus: typeof setFocus;
}

const docCache: { [id: string]: IDoc } = {};

const Document: React.FunctionComponent<IProps> = (props) => {
  if (!props.docMeta) return <p>Document does not exist</p>;

  // Load the document
  const docId = props.match.params.docId || "db";
  const [, setLoadDoc] = React.useState<IDoc>(null);
  const doc = docCache[docId];
  React.useEffect(() => {
    if (!doc) {
      (async () => {
        const loaded = await getDoc(docId);
        docCache[docId] = loaded;
        setLoadDoc(loaded);
      })();
    }
  }, [docId]);

  // Take focus from the hash fragment of the url, e.g. #s1.p1.l3
  const focusPart = props.location.hash.substr(1);

  // Scroll to the hash fragment, if applicable
  React.useEffect(() => {
    if (doc && focusPart && props.history.action === "PUSH")
      document.getElementById(focusPart).scrollIntoView({ behavior: "smooth" });
  }, [doc]);

  // Set any loaded annotations
  React.useEffect(() => {
    if (doc) {
      const annos = doc.annotations || [];
      if (!!focusPart) {
        const focusAnnos = annos.filter((anno) => anno.anchor === focusPart);
        if (focusAnnos.length === 0)
          focusAnnos.push({
            anchor: focusPart,
            snippet: `No annotations on ${focusPart} yet`,
            annotations: [],
          });
        props.setFocus({
          annotations: focusAnnos,
        });
      } else {
        props.setFocus({
          annotations: annos,
        });
      }
    }
  }, [doc, focusPart]);

  if (!doc) return <p>Loading...</p>;
  else
    return (
      <div>
        <DocViewer
          id={docId}
          docMeta={props.docMeta}
          doc={doc}
          focusPart={focusPart}
        />
        <Annotator />
      </div>
    );
};

const mapStateToProps = (
  state: IAppState,
  ownProps: RouteComponentProps<IMatchParams>
) => ({
  docMeta: state.docs.graph[ownProps.match.params.docId || "db"],
});

export default connect(mapStateToProps, { setFocus })(Document);
