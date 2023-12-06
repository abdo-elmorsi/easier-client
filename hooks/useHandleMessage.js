import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const useErrorMessage = () => {
  const [message, setMessage] = useState(null);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    if (message?.message) {
      switch (message.type) {
        case "success":
          toast.success(message.message, { theme });
          break;
        case "warning":
          toast.warn(message.message, { theme });
          break;
        default:
          toast.error(message.message, { theme });
      }
      setMessage(null);
    }
  }, [message, theme]);

  const handleMessage = async (
    error,
    type = "error",
    callback = null
  ) => {
    const message = error?.response?.data?.message || "An error has occurred";
    const status = error?.response?.status || 500;
    if (axios.isCancel(error)) {
      return;
    }
    if (status === 401) {
      await signOut();
      Cookies.remove('user-token');
    }
    setMessage({ message, type });
    if (callback && typeof callback === "function") {
      callback();
    }
  };

  return handleMessage;
};

export default useErrorMessage;