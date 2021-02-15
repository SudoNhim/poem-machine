import { Theme, makeStyles } from "@material-ui/core";
import { TextFragment } from "cohen-db/schema";
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

  const ref = React.createRef<HTMLDivElement>();
  React.useEffect(() => {
    ref.current.focus();

    // set caret to end of element
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const handleChange = (evt: ContentEditableEvent) => {
    const tokens = textToTokens(evt.target.value);
    props.onChange({
      ...props.fragment,
      tokens,
    });
  };

  return (
    <ContentEditable
      className={classes.root}
      innerRef={ref}
      html={tokensToText(props.fragment.tokens)}
      onChange={handleChange}
    />
  );
};

export default TextFragmentEditor;
