import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { connect } from "react-redux";

import { IDocGraph } from "../../../shared/ApiTypes";
import { IAppState } from "../../model";

const useStyles = makeStyles({
  input: {
    marginBottom: 10,
    marginTop: 10,
  },
  kind: {
    fontSize: 14,
    color: "lightGrey",
  },
});

interface IProps {
  graph: IDocGraph;
  disabled: boolean;
  value: string;
  onChange: (documentId: string) => void;
}

interface IDocumentOption {
  documentId: string;
  title: string;
  kind: string;
}

const DocumentChoiceInput: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();

  const onChange = (value: IDocumentOption | string) => {
    if (value === null) {
      props.onChange(null);
    } else if (typeof value === "string") {
      props.onChange(value);
    } else {
      props.onChange(value.documentId);
    }
  };

  const documentOptions: IDocumentOption[] = Object.keys(props.graph)
    .sort()
    .map((documentId) => ({
      title: props.graph[documentId].title,
      kind: props.graph[documentId].kind,
      documentId,
    }));

  const value: IDocumentOption | string =
    documentOptions.find((option) => option.documentId === props.value) ||
    props.value;

  return (
    <Autocomplete<IDocumentOption>
      value={value}
      onChange={(evt, newValue) => onChange(newValue)}
      options={documentOptions}
      getOptionSelected={(a, b) => a.documentId === (b?.documentId || b)}
      getOptionLabel={(opt) => opt.title}
      renderOption={(opt) => (
        <span>
          {opt.title}
          &nbsp;
          <span className={classes.kind}>{opt.kind}</span>
        </span>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          className={classes.input}
          size="small"
          fullWidth={true}
          label="Document, e.g. 'Suzanne'"
          variant="outlined"
          disabled={props.disabled}
        />
      )}
    />
  );
};

const mapStateToProps = (state: IAppState, ownProps) => ({
  graph: state.docs.graph,
  disabled: ownProps.disabled,
  value: ownProps.value,
  onChange: ownProps.onChange,
});

export default connect(mapStateToProps)(DocumentChoiceInput);
