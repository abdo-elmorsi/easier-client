import React from "react";
import MainNav from "./MainNav";

const Layout = (props) => {
  return (
    <>
      <MainNav />
      <main className="dark:bg-gray-900 remain-height dark:text-gray-300">
        {props.children}
      </main>
    </>
  );
};

export default Layout;
