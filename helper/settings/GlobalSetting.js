import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "store/ThemeSlice";
import axios from "../apis/httpRequest";
import { useSession } from "next-auth/client";

const GlobalSetting = ({ children }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);
    const [user] = useSession();

    useEffect(() => {
        // get user data from local storage
        // const userInfo = secureLocalStorage.getItem('User');

        // set config for any axios request
        // axios.defaults.baseURL = `https://brave-jay-jacket.cyclic.app/api`;
        axios.defaults.headers.common.Authorization = `Bearer ${user?.user?.token}`;

        // check if any user info in local storage to auto log user
        // if (userInfo?.role === 'admin') {
        //   dispatch(UserAuthAction.setRole('admin'));
        // } else if (userInfo?.role === 'client' && userInfo?.isAgent === true) {
        //   dispatch(UserAuthAction.setRole('agent'));
        // } else if (userInfo?.isClient === true) {
        //   dispatch(UserAuthAction.setRole('client'));
        // }

        // access any 401 request with axios to route user to login
        // axios.interceptors.response.use(
        //   function (response) {
        //     return response;
        //   },
        //   function (error) {
        //     if (error.response?.status === 401) {
        //       // secureLocalStorage.removeItem("User");
        //       router.push("/login");
        //       toast.error("Your session has expired, please login again");
        //     }
        //     return Promise.reject(error.response);
        //   }
        // );
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
        } else {
            dispatch(toggleTheme("dark"));
            document.documentElement.classList.add("dark");
        }
    }, [theme]);

    return <>{children}</>;
};

export default GlobalSetting;
