import axios from "axios";
// get totals
export const getTotals = async (params) => {
  const response = await axios({
    method: "GET",
    url: "/api/dashboard",
    params,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};