import * as React from "react";
import { connect } from "react-redux";
import { IAppState } from "../../model";
import { Metadata } from "cohen-db/schema";

const css = require("./docviewer.css");

interface IProps {
  metadata: Metadata;
}

class MetadataView extends React.Component<IProps> {
  public render() {

    const rows: string[] = [];
    if (this.props.metadata.date)
      rows.push(`Date: ${this.props.metadata.date}`);
    if (this.props.metadata.location) {
      const loc = this.props.metadata.location;
      if (loc.country) rows.push(`Country: ${loc.country}`);
      if (loc.city) rows.push(`City: ${loc.city}`);
      if (loc.venue) rows.push(`Venue: ${loc.venue}`);
    }
    if (this.props.metadata.event)
      rows.push(`Event: ${this.props.metadata.event}`);

    return (
      <div>
        {rows.map((row, i) => (
          <div key={i}>
            {row}
          </div>
        ))}
      </div>
    );
  }
}

// currently not using redux connection
const mapStateToProps = (state: IAppState, ownProps: IProps) => ({
  metadata: ownProps.metadata
});

export default connect(mapStateToProps)(MetadataView);
