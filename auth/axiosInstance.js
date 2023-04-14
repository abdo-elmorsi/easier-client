import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  // baseURL: "https://brave-jay-jacket.cyclic.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // if (error.response?.status === 401) {
    //   signOut();
    //   toast.error("Your session has expired, please login again");
    // }
    return Promise.reject(error.response);
  }
);

export default axiosInstance;
