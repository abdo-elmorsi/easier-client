import React from "react";
import Sidebar from "./Sidebar";
import PropTypes from "prop-types"

const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="remain-height flex bg-gray-100 text-black antialiased dark:bg-gray-700 dark:text-white">
      <Sidebar />
      {children}
    </div>
  );
};
LayoutWithSidebar.propTypes = {
  children: PropTypes.node.isRequired,
}
export default LayoutWithSidebar;
