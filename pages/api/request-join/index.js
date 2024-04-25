import axios from "axios";
import config from "config/config";
import { getHeaders, handleErrorResponse } from "helper/apis/helpers";

const API_URL = config.apiGateway.API_URL_PRODUCTION;

export default async (req, res) => {
  try {
    if (req.method === "GET") {

      await handleGetRequest(req, res);

    } else if (req.method === "POST") {
      await handlePostRequest(req, res);
    } else if (req.method === "DELETE") {
      await handleDeleteRequest(req, res);
    } else if (req.method === "PUT") {
      await handlePutRequest(req, res);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while processing the request." });
  }
};

// get all
const handleGetRequest = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/request-join`, {
      params: req.query,
      ...getHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};


// create one
const handlePostRequest = async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/request-join`, req.body, getHeaders(req));
    res.status(response.status).json(response.data);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

// delete one
const handleDeleteRequest = async (req, res) => {
  const id = req.query.id;
  try {
    const response = await axios.delete(`${API_URL}/request-join/${id}`, getHeaders(req));
    res.status(response.status).json(response.data);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

// update one
const handlePutRequest = async (req, res) => {
  const id = req.query.id;
  try {
    const response = await axios.put(`${API_URL}/request-join/${id}`, req.body, getHeaders(req));
    res.status(response.status).json(response.data);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};