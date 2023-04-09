import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "store/ThemeSlice";

const GlobalSetting = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    // get user data from local storage
    // const userInfo = secureLocalStorage.getItem('User');
    
    // check if any user info in local storage to auto log user
    // if (userInfo?.role === 'admin') {
    //   dispatch(UserAuthAction.setRole('admin'));
    // } else if (userInfo?.role === 'client' && userInfo?.isAgent === true) {
    //   dispatch(UserAuthAction.setRole('agent'));
    // } else if (userInfo?.isClient === true) {
    //   dispatch(UserAuthAction.setRole('client'));
    // }
  }, []);

  useEffect(() => {
    if (router.locale === "ar") {
      document.documentElement.lang = "ar";
      document.body.dir = "rtl";
      document.body.style.fontFamily = `'Noto Sans Arabic', sans-serif`;
    } else if (router.locale === "en") {
      document.documentElement.lang = "en";
      document.body.dir = "ltr";
      document.body.style.fontFamily = `'Cairo', sans-serif`;
    }
  }, [router.locale]);

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      dispatch(toggleTheme("light"));
      document.documentElement.classList.remove("dark");
    } else if (localStorage.getItem("theme") === "dark") {
      dispatch(toggleTheme("dark"));
      document.documentElement.classList.add("dark");
    } else {
      dispatch(toggleTheme("dark"));
    }
  }, [theme]);

  return <>{children}</>;
};

export default GlobalSetting;
