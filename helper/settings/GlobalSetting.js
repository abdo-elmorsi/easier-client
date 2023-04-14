import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "store/ThemeSlice";
import PropTypes from "prop-types"

const GlobalSetting = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isRender, setIsRender] = useState(true);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    if (router.locale === "ar") {
      document.documentElement.lang = "ar";
      document.body.dir = "rtl";
      document.body.style.fontFamily = `'Noto Sans Arabic', sans-serif`;
    } else {
      document.documentElement.lang = "en";
      document.body.dir = "ltr";
      document.body.style.fontFamily = `'Cairo', sans-serif`;
    }
    setIsRender(false)
  }, [router.locale]);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      dispatch(toggleTheme("dark"));
    } else {
      dispatch(toggleTheme("light"));
      document.documentElement.classList.remove("dark");
    }
    setIsRender(false)
  }, [theme]);

  return <>{!isRender && children}</>;
};
export default GlobalSetting;

GlobalSetting.propTypes = {
  children: PropTypes.object.isRequired
}