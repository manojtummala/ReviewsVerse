import axios from "axios";

const api = axios.create({
  baseURL: "http://reviewverse-backend-env.eba-4swh2taf.us-east-2.elasticbeanstalk.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
