import axios from "axios";

const API_BASE_URL = "https://localhost:7088/api"; // Thay đổi URL theo API của bạn

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
