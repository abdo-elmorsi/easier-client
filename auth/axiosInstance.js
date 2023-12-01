import axios from "axios";
import { CancelToken } from "axios";
import config from "config/config";
import { getSession, signOut } from "next-auth/react";

let cancelTokenSources = {};

const axiosInstance = axios.create({
  baseURL: config.apiGateway.API_URL_PRODUCTION,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.user?.token}`;
  }
  // Create a cancel token source for each unique request URL
  const requestUrl = config.url;
  if (cancelTokenSources[requestUrl]) {
    cancelTokenSources[requestUrl].cancel("Request cancelled due to new request");
  }
  cancelTokenSources[requestUrl] = CancelToken.source();
  config.cancelToken = cancelTokenSources[requestUrl].token;
  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (axios.isCancel(error)) {
      // toast.warning("Request was canceled.");
      return Promise.reject({ data: { message: error.name } });
    } else if (error.response?.status === 401) {
      signOut();
      // toast.error("Your session has expired, please login again");
    } else {
      return Promise.reject(error.response);
    }
  }
);

// Export the function to cancel requests with a specific URL
export const cancelRequestWithUrl = (url) => {
  if (cancelTokenSources[url]) {
    cancelTokenSources[url].cancel("Request cancelled externally");
  }
};

export default axiosInstance;
