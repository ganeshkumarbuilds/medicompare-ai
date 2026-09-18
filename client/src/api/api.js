import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    timeout: 30000,
});

api.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("userToken") ||
        localStorage.getItem("adminToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;