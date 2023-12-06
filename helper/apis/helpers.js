// handle error response
export const handleErrorResponse = (error, res) => {
  const errorMessage = error.response?.data?.message || "An error occurred while fetching data.";
  if (error.response?.status === 401) {
    res.setHeader('Set-Cookie', 'user-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'); // Clear the user token cookie
    res.status(401).json({ message: 'Unauthorized. Please log in again.' });
  } else {
    res.status(error.response?.status || 500).json({ message: errorMessage });
  }
};

// helpers
export const getHeaders = (req) => {
  const token = req.cookies["user-token"];
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};
