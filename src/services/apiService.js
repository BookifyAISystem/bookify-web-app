import axios from "axios";

// const API_BASE_URL = "http://113.173.53.171:5002/api";
const API_BASE_URL = "https://localhost:7088/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
