import React, { Fragment } from "react";

const Layout = (props) => {
  return (
    <>
      <main>{props.children}</main>
    </>
  );
};

export default Layout;