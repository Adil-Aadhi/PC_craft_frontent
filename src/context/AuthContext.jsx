import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { requestFCMToken, onMessageListener } from "../../src/utils/firebase"
import NotificationToast from "../Worker/components/NotificationToast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken")
  );

  const navigate = useNavigate()

  const register = async (role, formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(`auth/register/${role}/`, formData);

      const { access, user } = res.data;

      localStorage.setItem("accessToken", access);
      setAccessToken(access);
      setUser(user);
      toast(
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-white">
            Account created
          </div>
          <div className="text-sm text-white/70 mt-0.5">
            Your account has been created successfully
          </div>
        </div>
      );

      return user // success response
    } catch (err) {
      let msg = "Registration failed";
      const data = err.response?.data;
      if (data) {
        if (typeof data === "string") {
          msg = data;
        } else if (data.detail) {
          msg = data.detail;
        } else {
          // DRF field errors → convert to string
          msg = Object.values(data)
            .flat()
            .join(" ");
        }
      }

      setError(msg);
      toast(
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-white">
            Something went wrong
          </div>
          <div className="text-sm text-white/70 mt-0.5">
            {msg}, Please try again.
          </div>
        </div>
      );
      throw msg;
      // pass error to UI
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('auth/login/', formData, {
        withCredentials: true,
      })
      const { access, user } = res.data;

      localStorage.setItem("accessToken", access)
      setAccessToken(access);
      setUser(user);

      const role = res.data.user.role

      if (role == "user") {
        navigate("/")
      }
      else if (role == "worker") {
        navigate("/worker/dashboard")
      }
      else {
        navigate("/admin/dashboard")
      }

      return res.data;
    }
    catch (err) {
      const msg =
        err.response?.data?.detail || "Login failed";
      setError(msg);
      throw msg;
    }
    finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    let backendLoggedOut = true;

    try {
      await api.post(
        "auth/logout/",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      backendLoggedOut = false;
      console.warn("Backend logout failed, forcing client logout");
    }

    // ALWAYS clear frontend auth
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("user");
    setUser(null);

    toast(
      <div className="flex flex-col">
        <div className="text-sm font-semibold text-white">
          Logged out
        </div>
        <div className="text-sm text-red-300 mt-0.5">
          You’ve been signed out successfully
        </div>
      </div>
    );



    navigate("/login");
  };

  const fetchUser = async () => {
    if (!accessToken) {
      setAuthLoading(false);
      return;
    }

    try {
      const res = await api.get("users/auth/me/");
      setUser(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem("accessToken");
      setAccessToken(null);
    }
    finally {
      setAuthLoading(false);   // 🔥 important
    }
  };

  useEffect(() => {
    fetchUser();
  }, [accessToken]);

  useEffect(() => {
    if (!user) return;

    const initFCM = async () => {
      const token = await requestFCMToken();

      if (token) {
        await api.post("/notifications/save-token/", {
          fcm_token: token,
        });
      }
    };

    initFCM();

    const unsubscribe = onMessageListener((payload) => {
      console.log("Notification received:", payload);

      const title = payload?.notification?.title;
      const body = payload?.notification?.body;

      if (title && body) {
        toast(<NotificationToast title={title} body={body} />, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    });

    return () => unsubscribe?.();
  }, [user]);


  return (
    <AuthContext.Provider value={{ accessToken, register, login, loading, error, handleLogout, setAccessToken, user, authLoading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
