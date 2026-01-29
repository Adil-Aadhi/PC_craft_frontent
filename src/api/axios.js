import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* ============================
   REQUEST INTERCEPTOR
   Attach access token
============================ */
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // 🚫 Do NOT attach token to auth endpoints
    if (
      accessToken &&
      !config.url.includes("auth/login") &&
      !config.url.includes("auth/refresh")
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   RESPONSE INTERCEPTOR
   Handle 401 → Refresh token
============================ */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔴 DO NOT retry refresh endpoint itself
    if (originalRequest.url.includes("auth/refresh")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("auth/refresh/");
        const newAccess = res.data.access;

        localStorage.setItem("accessToken", newAccess);

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (refreshError) {
        // ❌ refresh failed → logout
        console.log("REFRESH FAILED", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default api;
