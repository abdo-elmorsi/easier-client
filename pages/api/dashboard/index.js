import axios from "axios";
import config from "config/config";
import { getHeaders, handleErrorResponse } from "helper/apis/helpers";

const API_URL = config.apiGateway.API_URL_PRODUCTION;

export default async (req, res) => {
  try {
    if (req.method === "GET") {
      await handleGetCount(req, res);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while processing the request." });
  }
};

// get all
const handleGetCount = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/count`, {
      params: req.query,
      ...getHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};