import axios from "axios";

let isLoggingOut = false;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/* ============================
   API INSTANCES
============================ */
const api = axios.create({
  baseURL: "http://localhost/api/", 
  // baseURL: "http://127.0.0.1:8000/api/", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "http://localhost/api/",
  // baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true,
});

/* ============================
   PUBLIC ENDPOINTS
============================ */
const PUBLIC_ENDPOINTS = [
  "auth/login",
  "auth/register",
  "auth/refresh",
  "auth/google",
];

const isPublicEndpoint = (url = "") =>
  PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));

/* ============================
   REQUEST INTERCEPTOR
============================ */
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // ✅ Attach token ONLY for protected routes
    if (accessToken && !isPublicEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
============================ */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // 🛑 Stop everything if logout already triggered
    if (isLoggingOut) {
      return Promise.reject(error);
    }

    // 🚫 Public endpoints never refresh
    if (isPublicEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // 🔄 Only handle 401
    if (error.response?.status === 401 && !originalRequest._retry) {

      // ⏳ If refresh already running → wait
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshApi.post("auth/refresh/");
        const newAccess = res.data.access;

        // 💾 Save token
        localStorage.setItem("accessToken", newAccess);
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        // 🔓 Release queued requests
        processQueue(null, newAccess);

        // 🔁 Retry original
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);

        isLoggingOut = true;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default api;
