import axios from "auth/axiosInstance";

// update profile (Image)
export const updateImage = async (image) => {
  const response = await axios({
    method: "post",
    url: "users/upload",
    data: image,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
// update profile (profile)
export const updateProfile = async (user) => {
  const response = await axios({
    method: "put",
    url: "users",
    data: user,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
