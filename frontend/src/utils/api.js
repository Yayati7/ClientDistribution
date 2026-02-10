import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API + "/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  
  console.log("API Request:", {
    method: req.method,
    url: req.url,
    baseURL: req.baseURL,
    fullURL: req.baseURL + req.url,
    headers: req.headers
  });
  
  return req;
});

API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default API;