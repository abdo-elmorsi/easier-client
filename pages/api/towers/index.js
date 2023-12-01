import axios from "axios";
import config from "config/config";

const API_URL = config.apiGateway.API_URL_PRODUCTION;

export default async (req, res) => {
  try {
    if (req.method === "GET") {
      if (req.query.id) {
        await handleGetOneRequest(req, res);
      } else {
        await handleGetRequest(req, res);
      }
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

const getHeaders = (req) => {
  const token = req.cookies["user-token"];
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// get all
const handleGetRequest = async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/towers`, {
      params: req.query,
      ...getHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred while fetching data.";
    res.status(error.response?.status || 500).json({ message: errorMessage });
  }
};

// get one
const handleGetOneRequest = async (req, res) => {
  const id = req.query.id;
  try {
    const response = await axios.get(`${API_URL}/towers/${id}`, getHeaders(req));
    res.status(response.status).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred while fetching the tower.";
    res.status(error.response?.status || 500).json({ message: errorMessage });
  }
};

// create one
const handlePostRequest = async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/towers`, req.body, getHeaders(req));
    res.status(response.status).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred while creating the tower.";
    res.status(error.response?.status || 500).json({ message: errorMessage });
  }
};

// delete one
const handleDeleteRequest = async (req, res) => {
  const id = req.query.id;
  try {
    const response = await axios.delete(`${API_URL}/towers/${id}`, getHeaders(req));
    res.status(response.status).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred while deleting the tower.";
    res.status(error.response?.status || 500).json({ message: errorMessage });
  }
};

// update one
const handlePutRequest = async (req, res) => {
  const id = req.query.id;
  try {
    const response = await axios.put(`${API_URL}/towers/${id}`, req.body, getHeaders(req));
    res.status(response.status).json(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred while updating the user.";
    res.status(error.response?.status || 500).json({ message: errorMessage });
  }
};