import * as React from "react";

const css = require("./all.css");

export const Header: React.FunctionComponent = () => (
  <div className={css.header}>
    <div className={css.header_title}>The Poem Machine</div>
    <div className={css.header_menu}>[=]</div>
  </div>
);
