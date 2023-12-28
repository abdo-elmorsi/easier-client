// import axios from "auth/axiosInstance";
import axios from "axios";

// userLogin (login)
export const userLogin = async (data) => {
  const response = await axios({
    method: "POST",
    url: `/api/users/signIn`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// loginVerify (VerifyCode)
export const loginVerify = async (data) => {
  const response = await axios({
    method: "POST",
    url: `/api/users/verify`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};




// update profile (Password)
export const updatePassword = async (data) => {
  const response = await axios({
    method: "put",
    url: "/api/users/update-password",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// change profile (Password)
export const changePassword = async (data) => {
  const response = await axios({
    method: "put",
    url: "/api/users/change-password",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// send email
export const forgetPassword = async (email) => {
  const response = await axios({
    method: "post",
    url: "/api/users/forget-password",
    data: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
