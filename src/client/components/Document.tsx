import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { IDoc, IDocMeta } from "../../shared/IApiTypes";
import { setDoc, setFocus } from "../actions";
import { getDoc } from "../api";
import { IAppState } from "../model";
import DocViewer from "./document/DocViewer";

interface IMatchParams {
  docId?: string;
}

interface IProps extends RouteComponentProps<IMatchParams> {
  docMeta: IDocMeta;
  doc: IDoc;
  setDoc: typeof setDoc;
  setFocus: typeof setFocus;
}

const Document: React.FunctionComponent<IProps> = (props) => {
  if (!props.docMeta) return <p>Document does not exist</p>;

  // Load the document
  const docId = props.match.params.docId || "db";
  const doc = props.doc;
  React.useEffect(() => {
    console.log("doc", doc);
    if (!doc) {
      (async () => {
        const loaded = await getDoc(docId);
        console.log("set", loaded);
        props.setDoc(docId, loaded);
      })();
    }
  }, [docId]);

  // Take focus from the hash fragment of the url, e.g. #s1.p1.l3
  const docPart = props.location.hash.substr(1);

  // Scroll to the hash fragment, if applicable
  React.useEffect(() => {
    if (doc && docPart && props.history.action === "PUSH")
      document.getElementById(docPart).scrollIntoView({ behavior: "smooth" });
  }, [doc]);

  // Set any loaded annotations
  React.useEffect(() => {
    if (doc) {
      const annos = doc.annotations || [];
      if (!!docPart) {
        const focusAnnos = annos.filter((anno) => anno.anchor === docPart);
        if (focusAnnos.length === 0)
          focusAnnos.push({
            anchor: docPart,
            snippet: `No annotations on ${docPart} yet`,
            annotations: [],
          });
        props.setFocus({
          docId,
          docPart,
        });
      } else {
        props.setFocus({
          docId,
          docPart: null,
        });
      }
    }
  }, [doc, docPart]);

  if (!doc) return <p>Loading...</p>;
  else
    return (
      <div>
        <DocViewer
          id={docId}
          docMeta={props.docMeta}
          doc={doc}
          focusPart={docPart}
        />
      </div>
    );
};

const mapStateToProps = (
  state: IAppState,
  ownProps: RouteComponentProps<IMatchParams>
) => ({
  docMeta: state.docs.graph[ownProps.match.params.docId || "db"],
  doc: state.docs.cache[ownProps.match.params.docId || "db"] || null,
});

export default connect(mapStateToProps, { setDoc, setFocus })(Document);
