import React, { useState } from "react";
import PropTypes from "prop-types"

export default function Tabs({ tabsData }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="m-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <div className="flex gap-3 border-b dark:border-gray-500 ">
        {tabsData.map((tab, idx) => {
          return (
            <button
              key={idx}
              className={`default-desktop-nav flex items-center gap-1 capitalize ${idx === activeTabIndex
                ? "active-desktop-nav"
                : "hover-desktop-nav"
                }`}
              onClick={() => setActiveTabIndex(idx)}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>
      <div className="py-4">{tabsData[activeTabIndex].content}</div>
    </div>
  );
}
Tabs.propTypes = {
  tabsData: PropTypes.array.isRequired,
}