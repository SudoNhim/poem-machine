import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { IDoc, IDocMeta } from "../../shared/ApiTypes";
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
  // Update focus
  const docPart = props.location.hash.substr(1).split("/")[0];
  React.useEffect(() => {
    props.setFocus({
      docId,
      docPart,
    });

    // Cleanup focus when unmount
    return () =>
      props.setFocus({
        docId: null,
        docPart: null,
      });
  }, [props.doc, docPart]);

  if (!props.docMeta) return <p>Document does not exist</p>;

  // Load the document if its not loaded
  const docId = props.match.params.docId || "db";
  const doc = props.doc;
  React.useEffect(() => {
    if (!doc) {
      (async () => {
        const loaded = await getDoc(docId);
        props.setDoc(docId, loaded);
      })();
    }
  }, [docId]);

  // Scroll to the hash fragment, if applicable
  React.useEffect(() => {
    if (doc && docPart && props.history.action === "PUSH")
      document
        .getElementById(docPart)
        .scrollIntoView({ behavior: "smooth", block: "center" });
  }, [doc]);

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
