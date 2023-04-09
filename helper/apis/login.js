import axios from "auth/axiosInstance";

// userLogin (login)
export const userLogin = async (data) => {
  const response = await axios({
    method: "post",
    url: "users/signIn",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
