import { Theme, makeStyles } from "@material-ui/core";
import { TextFragment } from "cohen-db/schema";
import { htmlToText } from "html-to-text";
import * as React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { textToTokens, tokensToText } from "../../util";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "inline-block",
    borderRadius: theme.shape.borderRadius,
    border: "3px solid red",
  },
}));

interface IProps {
  fragment: TextFragment;
  onChange: (value: TextFragment) => void;
}

const TextFragmentEditor: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  // Nasty! There seems to be a bug in using the ref with the
  // ContentEditable component, so get the element manually for now
  //const ref = React.createRef<HTMLDivElement>();
  React.useEffect(() => {
    //ref.current.focus();
    const elem = document.getElementById("text-fragment-editor");

    // set caret to end of element
    const range = document.createRange();
    range.selectNodeContents(elem);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const handleChange = (evt: ContentEditableEvent) => {
    const html = evt.target.value;
    props.onChange({
      ...props.fragment,
      tokens: textToTokens(htmlToText(html)),
    });
  };

  const html = tokensToText(props.fragment.tokens)
    .replace("&", "&amp;")
    .replace("<", "&lt;")
    .replace(">", "&gt;");

  return (
    <ContentEditable
      id="text-fragment-editor"
      className={classes.root}
      // innerRef={ref}
      html={html}
      onChange={handleChange}
    />
  );
};

export default TextFragmentEditor;
