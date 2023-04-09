import axios from "auth/axiosInstance";

// update profile (profile)
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
