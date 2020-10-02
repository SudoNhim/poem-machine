import * as React from "react";
import { connect } from "react-redux";
import { ISearchResults } from "../../shared/IApiTypes";
import { IAppState } from "../model";
import { Link } from "react-router-dom";
import NavTreeNode from "./NavTreeNode";
import ExpandButton from "./ExpandButton";

const css = require("./all.css");

interface IProps {
  search: ISearchResults;
  hasFocus: boolean;
}

interface IState {
  expanded: boolean;
}

class SearchTree extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  private toggleExpand() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  public render() {
    var ids = this.props.search.previews
      ? this.props.search.previews.map((p) => p.docRef.docId)
      : [];
    ids = ids.filter(
      (id, i) => ids.find((id2, i2) => id === id2 && i2 < i) === undefined
    );

    const children = this.state.expanded ? ids : [];

    const childEls = children.map((id, index) => (
      <NavTreeNode id={id} key={index} />
    ));

    const doclinkEl = (
      <Link to={`/search/${this.props.search.term}`}>
        <span className={css.navtreenode_doclink}>
          {this.props.search.term
            ? "Search: " + this.props.search.term
            : "No search..."}
        </span>
      </Link>
    );

    const titleClasses = [css.navtreenode_title];
    if (this.props.hasFocus) titleClasses.push(css.navtreenode_title_focus);

    return (
      <div className={css.navtreenode}>
        <div className={titleClasses.join(" ")}>
          <ExpandButton
            expanded={this.state.expanded}
            canExpand={this.props.search.hits.length > 0}
            onClick={() => this.toggleExpand()}
          />
          {doclinkEl}
        </div>
        <div className={css.navtreenode_content}>{childEls}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  search: state.search,
  hasFocus: state.focus.search,
});

export default connect(mapStateToProps, {})(SearchTree);
