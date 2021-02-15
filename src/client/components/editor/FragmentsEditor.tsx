import { Theme, makeStyles } from "@material-ui/core";
import { Fragment } from "cohen-db/schema";
import * as React from "react";

import FragmentView from "../shared/FragmentView";
import TextFragmentEditor from "./TextFragmentEditor";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    "&:focus": {
      outline: "0px solid transparent", // so as not to show border when focused
    },
  },
  root: {
    display: "inline",
    borderRadius: theme.shape.borderRadius,
    border: "1px solid lightgrey",
    cursor: "pointer",
    "&:hover": {
      borderColor: "orange",
    },
  },
  editing: {
    borderColor: "red",
  },
}));

interface IProps {
  tabIndex: number;
  fragments: Fragment[];
  onChange: (fragments: Fragment[]) => void;
}

const FragmentsEditor: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const [editIndex, setEditIndex] = React.useState(-1);

  const [isCaretMode, setIsCaretMode] = React.useState<boolean>(false);

  const fragRefs = props.fragments.map((_) =>
    React.createRef<HTMLDivElement>()
  );
  React.useEffect(() => {
    fragRefs[editIndex]?.current?.focus();
  }, [editIndex, isCaretMode]);

  const onKeyDownFragmentsMode = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (editIndex < 0 || editIndex >= props.fragments.length) return;

    switch (evt.key) {
      // Previous fragment
      case "ArrowLeft":
        if (editIndex > 0) setEditIndex(editIndex - 1);
        evt.preventDefault();
        return;

      // Previous line
      case "ArrowUp":
        let upIndex = editIndex;
        do upIndex--;
        while (
          upIndex > 0 &&
          props.fragments[upIndex - 1].kind !== "lineBreak"
        );
        setEditIndex(upIndex);
        evt.preventDefault();
        return;

      // Next line
      case "ArrowDown":
        let downIndex = editIndex;
        do downIndex++;
        while (
          downIndex < props.fragments.length &&
          props.fragments[downIndex - 1].kind !== "lineBreak"
        );
        setEditIndex(downIndex);
        evt.preventDefault();
        return;

      // Next fragment
      case "ArrowRight":
        if (editIndex < props.fragments.length - 1) setEditIndex(editIndex + 1);
        evt.preventDefault();
        return;

      // Delete current fragment
      case "Backspace":
      case "Delete":
        props.onChange(props.fragments.filter((_, i) => i !== editIndex));
        setEditIndex(editIndex - 1);
        evt.preventDefault();
        return;

      // Shift-Enter: insert line break before
      // Enter: enter caret mode
      case "Enter":
        if (evt.shiftKey) {
          props.onChange([
            ...props.fragments.slice(0, editIndex),
            { kind: "lineBreak" },
            ...props.fragments.slice(editIndex),
          ]);
          setEditIndex(editIndex + 1);
          evt.preventDefault();
        } else {
          if (props.fragments[editIndex].kind === "text") setIsCaretMode(true);
          evt.preventDefault();
        }
    }
  };

  const onKeyDownCaretMode = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (editIndex < 0 || editIndex >= props.fragments.length) return;

    switch (evt.key) {
      case "Enter":
      case "Escape":
        setIsCaretMode(false);
        evt.preventDefault();
    }
  };

  const fragments = props.fragments.map((frag, i) => {
    const isEditIndex = editIndex === i;
    const isCaretEditing = isEditIndex && isCaretMode;
    const classNames = isEditIndex
      ? `${classes.root} ${classes.editing}`
      : `${classes.root}`;
    if (frag.kind === "lineBreak") {
      return (
        <React.Fragment key={i}>
          <div
            ref={fragRefs[i]}
            className={classNames}
            onClick={() => setEditIndex(i)}
          >
            ⏎
          </div>
          <br />
        </React.Fragment>
      );
    } else {
      return isCaretEditing ? (
        <TextFragmentEditor fragment={frag} key={i} />
      ) : (
        <div
          ref={fragRefs[i]}
          className={classNames}
          key={i}
          onClick={() => setEditIndex(i)}
        >
          <FragmentView fragment={frag} interactive={false} annotations={[]} />
        </div>
      );
    }
  });
  return (
    <div
      className={classes.container}
      tabIndex={props.tabIndex}
      onKeyDown={isCaretMode ? onKeyDownCaretMode : onKeyDownFragmentsMode}
    >
      {fragments}
    </div>
  );
};

export default FragmentsEditor;
