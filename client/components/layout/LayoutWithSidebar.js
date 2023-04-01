import React from "react";
import MainNav from "./MainNav";
import Sidebar from "./Sidebar";

const LayoutWithSidebar = ({ children }) => {
  return (
    <>
      <MainNav />
      <main className="remain-height flex bg-white text-black antialiased dark:bg-gray-700 dark:text-white">
        <Sidebar />
        {children}
      </main>
    </>
  );
};

export default LayoutWithSidebar;
