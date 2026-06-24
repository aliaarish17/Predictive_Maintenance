// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const getHistory = (params) => api.get("/history", { params });
export const predictRUL = (data) => api.post("/predict/rul", data);
export const predictFailure = (data) => api.post("/predict/failure", data);

export default api;