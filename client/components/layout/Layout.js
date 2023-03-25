import React from "react";
import MainNav from "./MainNav";

const Layout = (props) => {
  return (
    <>
      <MainNav />
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
