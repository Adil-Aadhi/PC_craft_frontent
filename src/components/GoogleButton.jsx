import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

const GoogleAuthButton = ({ role, trigger = false, mode = "login" }) => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await axios.post(
        "http://localhost:8000/api/auth/google/",
        {
          access_token: tokenResponse.access_token,
          role: role,
        },
        { withCredentials: true }
      );
      console.log(tokenResponse)
      
      setAccessToken(res.data.access);
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ ROLE-BASED NAVIGATION (WORKS)
      if (res.data.user.role === "worker") {
        navigate("/worker/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },
    onError: () => alert("Google login failed"),
  });

  // 🔥 LOGIN MODE → auto-trigger after role selection
  useEffect(() => {
    if (mode === "login" && trigger && role) {
      login();
    }
  }, [mode, trigger, role, login]);

  // 🔥 LOGIN PAGE → invisible
  if (mode === "login") return null;

  // 🔥 REGISTER PAGE → visible button
  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-slate-100 transition mb-5"
    >
      <FcGoogle size={22} />
      <span className="font-medium text-slate-700">
        Continue with Google
      </span>
    </button>
  );
};

export default GoogleAuthButton;
