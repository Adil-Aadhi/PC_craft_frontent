import axios from "axios";

let isLoggingOut = false;

/* ============================
   API INSTANCES
============================ */
const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "http://localhost:8000/api/",
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

    // 🛑 Avoid infinite loops
    if (isLoggingOut || originalRequest?._retry) {
      return Promise.reject(error);
    }

    // 🚫 Never run auth logic for login/register
    if (isPublicEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }

    // 🔴 If refresh endpoint itself fails → logout
    if (originalRequest?.url?.includes("auth/refresh")) {
      isLoggingOut = true;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 🔄 Only retry on 401 Unauthorized
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const res = await refreshApi.post("auth/refresh/");
        const newAccess = res.data.access;

        // 💾 Save new token
        localStorage.setItem("accessToken", newAccess);

        // 🔁 Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        isLoggingOut = true;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // ❌ Other errors (400, 403, 404, 500)
    return Promise.reject(error);
  }
);

export default api;
