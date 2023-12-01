import axios from "axios";
// get all
export const getAll = async (params) => {
  const response = await axios({
    method: "GET",
    url: "/api/users",
    params,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// get one
export const getOne = async (id) => {
  const response = await axios({
    method: "GET",
    url: `/api/users?id=${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// create one
export const createOne = async (data) => {
  const response = await axios({
    method: "POST",
    url: '/api/users',
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

// delete one
export const deleteOne = async (id) => {
  const response = await axios({
    method: "DELETE",
    url: `/api/users?id=${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// update one
export const updateOne = async (data, id) => {
  const response = await axios({
    method: "PUT",
    url: `/api/users?id=${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};






// ================================================================
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
// update profile (Password)
export const updatePassword = async (data) => {
  const response = await axios({
    method: "put",
    url: "users/password",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
