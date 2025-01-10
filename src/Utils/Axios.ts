import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('users');
      const apiToken = token ? JSON.parse(token)['api_token'] : null;

      if (apiToken) {
        config.headers['Authorization'] = `Bearer ${apiToken}`;
      }

      return config;
    },
    (error) => {
      // Handle request errors
      return Promise.reject(error);
    }
  );

  return instance;
};

export { createAxiosInstance };
