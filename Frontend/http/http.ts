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
    if (error.response && error.response.status === 404) {
      console.warn("404 Not Found:", {
        url: error.config.url,
        data: error.response.data,
      });
      // Resolve the promise with a custom message or default object
      return Promise.resolve({
        status: 404,
        data: null, // or a default structure you prefer
        message: "Resource not found",
      });
    }

    console.error("Response Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default http;
