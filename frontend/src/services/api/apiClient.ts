import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request lifecycle console logs
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[apiClient] Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Global response intercepts
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: any) => {
    console.error('[apiClient] Error response received:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
