import { toast } from 'react-toastify'
import api from '../../api/axios'
import { useState } from 'react'
import {useAuth} from "../../context/AuthContext"
import { useProfile } from '../context/ProfileContext'

const useSecurity = () => {
  const { handleLogout } = useAuth();
  const {fetchProfile}=useProfile()

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null)

  const changePassword = async (
    old_password,
    new_password,
    confirm_password
  ) => {
    setLoading(true);
    setError(null);

    // frontend validation
    if (new_password !== confirm_password) {
      setError("Password and confirm password must be same");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/users/profile/change_password/", {
        old_password,
        new_password,
        confirm_password,
      });

      toast.success(
        "Password changed successfully"
      );

      setTimeout(() => {
        handleLogout();
      }, 1200);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Failed to change password";

      setError(msg);
    //   toast.error(msg);
    } finally {
      setLoading(false);
    }

  };
   const sendOtpToEmail =async (email)=>{
    setLoading(true)
    setError(null)
    setSuccess(null)
    try{
      const res=await api.post('users/profile/change_email/',{
        email
      })
      setSuccess(res.data.message)
      return true
    }catch(err){
      setError(err.response?.data?.error || "Something went wrong")
      return false
    }
    finally {
      setLoading(false)
    }
  }
  const verifyOtp = async (email, otp) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await api.post("/users/profile/change_email/verify_email/", {
        email,
        otp,
      })

      setSuccess(res.data?.message || "Email verified successfully")
      return true
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Invalid or expired OTP"

      setError(msg)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateEmail = async (newEmail) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await api.post("/users/profile/change_email/update_email/", {
        email: newEmail,
      })

      setSuccess(res.data?.message || "Email updated successfully")
      toast.success("Email is changed Succesfully")
      fetchProfile()
      return true
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to update email"
      )
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    changePassword,
    loading,
    error,
    sendOtpToEmail,
    success,
    verifyOtp,
    updateEmail
  };
};

export default useSecurity