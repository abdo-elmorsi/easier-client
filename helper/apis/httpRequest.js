import axios from "axios";
import { signOut } from "next-auth/client";
import { toast } from "react-toastify";
import { removeCookie } from "utils/cookies";

// axios.defaults.baseURL = "http://localhost:3001/api";
axios.defaults.baseURL = "https://brave-jay-jacket.cyclic.app/api";

// Add a request interceptor
axios.interceptors.request.use(
    (config) =>
        // Do something before request is sent
        config,
    (error) =>
        // Do something with request error
        Promise.reject(error)
);

// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response?.status === 401) {
            toast.error("Your session has expired, please login again.");
            const time = setTimeout(() => {
                signOut();
                removeCookie("updated-image");
                clearTimeout(time);
            }, 2000);
        } else {
            toast.error(error.response.data.message);
        }
        return Promise.reject(error.response);
    }
);
export default axios;
