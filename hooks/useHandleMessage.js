import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useErrorMessage = () => {
  const [messageType, setMessageType] = useState(null);
  const [message, setMessage] = useState(null);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    if (message) {
      switch (messageType) {
        case "success":
          toast.success(message, { theme: theme });
          break;
        case "warning":
          toast.warn(message, { theme: theme });
          break;
        default:
          toast.error(message, { theme: theme });
      }
      setMessage(null);
      setMessageType(null);
    }
  }, [message, messageType]);

  const handleMessage = (message = "Something went wrong!", type) => {
    if (message != "CanceledError") {
      setMessage(message);
      type && setMessageType(type);
    }
  };

  return handleMessage;
};

export default useErrorMessage;