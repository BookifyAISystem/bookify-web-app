import axios from "axios";

const API_BASE_URL = "https://bookifyapi.azurewebsites.net/api/v1";
// const API_BASE_URL = "https://localhost:7088/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
