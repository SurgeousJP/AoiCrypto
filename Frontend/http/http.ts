// axiosInstance.ts
import axios from "axios";

const http = axios.create({
  baseURL: "https://aoicryptoapi-production.up.railway.app", // Replace with your actual base URL
  timeout: 10000, // Optional: Set the timeout for requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

export default http;
