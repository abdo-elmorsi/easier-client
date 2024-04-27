import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTheme } from "store/ThemeSlice";
import PropTypes from "prop-types"

const GlobalSetting = ({ children }) => {
  const dispatch = useDispatch();
  const [isRender, setIsRender] = useState(true);



  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      dispatch(toggleTheme("dark"));
    } else {
      dispatch(toggleTheme("light"));
    }
    setIsRender(false)
  }, []);

  return <>{!isRender && children}</>;
};
export default GlobalSetting;

GlobalSetting.propTypes = {
  children: PropTypes.node.isRequired
}