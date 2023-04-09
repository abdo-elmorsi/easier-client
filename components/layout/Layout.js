import React from "react";
import MainNav from "./MainNav";

const Layout = (props) => {
  return (
    <>
      <MainNav />
      <main className="remain-height bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
        {props.children}
      </main>
    </>
  );
};

export default Layout;
