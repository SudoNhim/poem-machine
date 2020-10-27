import * as React from "react";
import ScrollMemory from "react-router-scroll-memory";

const css = require("../all.css");

const ContentContainer: React.FunctionComponent = (props) => (
  <div id="viewpane" className={css.viewpane}>
    <ScrollMemory elementID="viewpane" />
    {props.children}
  </div>
);

export default ContentContainer;
