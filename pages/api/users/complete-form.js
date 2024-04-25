import axios from "axios";
import config from "config/config";
import { getHeaders, handleErrorResponse } from "helper/apis/helpers";

const API_URL = config.apiGateway.API_URL_PRODUCTION;

export default async (req, res) => {
  try {
    return await handleCompleteForm(req, res);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while processing the request." });
  }
};

// complete-form
const handleCompleteForm = async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/users/complete-form`, req.body, getHeaders(req));
    res.status(response.status).json(response.data);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};