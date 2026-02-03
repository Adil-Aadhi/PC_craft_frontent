import { createContext, useContext, useState } from "react";
import api from "../api/axios";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem("accessToken")
      );

  const navigate=useNavigate()

  const register = async (role, formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(`auth/register/${role}/`, formData);

      const { access, user } = res.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("user", JSON.stringify(user));
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
      const msg =
      err.response?.data?.error ||
      err.response?.data?.detail ||
      "Registration failed";

        setError(msg);
        toast(
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-white">
                Something went wrong
              </div>
              <div className="text-sm text-white/70 mt-0.5">
                Your account couldn’t be created. Please try again.
              </div>
            </div>
          );
      throw msg;
       // pass error to UI
    } finally {
      setLoading(false);
    }
  };

  const login= async(formData)=>{

    setLoading(true);
    setError(null);

    try{
      const res=await api.post('auth/login/',formData,{
        withCredentials: true,
      })
      const { access, user } = res.data;

      localStorage.setItem("accessToken",access)
      setAccessToken(access);
      localStorage.setItem("user", JSON.stringify(user));

      const role=res.data.user.role

      if (role=="user"){
        navigate("/")
      }
      else{
        navigate("/worker/dashboard")
      }

      return res.data;
    }
    catch(err){
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
  localStorage.removeItem("user");

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


  return (
    <AuthContext.Provider value={{accessToken, register, login, loading, error,handleLogout,setAccessToken  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
