import React from "react";
// import MainNav from "./MainNav";
import Sidebar from "./Sidebar";
import PropTypes from "prop-types";

const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="flex antialiased text-black bg-gray-100 remain-height dark:bg-gray-700 dark:text-white">
      <div style={{ height: "calc(100% - 64px)" }} className="fixed left-0 z-[100] top-16">
        <Sidebar />
      </div>
      <div className="flex-1 p-2 ml-16 overflow-hidden md:ml-64 sm:p-8 dark:bg-gray-700 dark:text-white">
        {children}
      </div>
    </div>
  );
};

export default LayoutWithSidebar;
LayoutWithSidebar.propTypes = {
  children: PropTypes.node.isRequired,
};
