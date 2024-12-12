// axiosInstance.ts
import axios from "axios";

const http = axios.create({
  baseURL: "https://aoicryptoapi-production.up.railway.app", // Replace with your actual base URL
  timeout: 10000, // Optional: Set the timeout for requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Add a request interceptor
http.interceptors.request.use(
  (config) => {
    console.log("Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
    return config; // Must return config or a Promise that resolves to config
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
http.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response; // Must return the response or a Promise that resolves to it
  },
  (error) => {
    console.error("Response Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default http;
