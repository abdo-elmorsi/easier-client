import axios from "axios";
// get all
export const getAll = async (params) => {
  const response = await axios({
    method: "GET",
    url: "/api/actions/rental",
    params,
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
    url: '/api/actions/rental',
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    }
  });
  return response.data;
};