import React from "react";
import MainNav from "./MainNav";
import PropTypes from "prop-types"

const Layout = ({ children }) => {
  return (
    <>
      <MainNav />
      <main className="remain-height bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
        {children}
      </main>
    </>
  );
};


Layout.propTypes = {
  children: PropTypes.object.isRequired,
}
export default Layout;
