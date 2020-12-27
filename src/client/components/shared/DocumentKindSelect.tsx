import { MenuItem, Select, makeStyles } from "@material-ui/core";
import React from "react";

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

type DocumentKind =
  | "symbol"
  | "group"
  | "song"
  | "live"
  | "album"
  | "tour"
  | "interview"
  | "other";

const kinds: DocumentKind[] = [
  "symbol",
  "group",
  "song",
  "live",
  "album",
  "tour",
  "interview",
  "other",
];

interface IProps {
  value: DocumentKind;
  onChange: (value: DocumentKind) => void;
}

const DocumentKindSelect: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();
  return (
    <Select
      value={props.value}
      onChange={(evt) => props.onChange(evt.target.value as DocumentKind)}
    >
      {kinds.map((kind, i) => (
        <MenuItem value={kind} key={i}>{`${kind
          .substr(0, 1)
          .toUpperCase()}${kind.substr(1)}`}</MenuItem>
      ))}
    </Select>
  );
};

export default DocumentKindSelect;
