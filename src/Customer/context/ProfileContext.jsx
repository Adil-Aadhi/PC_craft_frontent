import { createContext,useContext,useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ProfileContext=createContext();

export const ProfileProvider=({children})=>{
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchProfile=async()=>{
        try{
            setLoading(true);
            const res=await api.get('users/profile/')
            setProfile(res.data)
        }
        catch(err){
            console.log('Error',err)
        }
        finally {
            setLoading(false);
        }
    }

    const UpdateProfileInfo=async(form)=>{
        try{
            const res = await api.patch('users/profile/',form)
            toast.success("Personal information updated");
            return true
        }
        catch(err){
            console.log("error",err)
            toast.error("Not updated,Try again");
            return false
        }
    }

     useEffect(() => {
        fetchProfile();
    }, []);

    return (
    <ProfileContext.Provider value={{ profile,fetchProfile,loading,UpdateProfileInfo }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used inside ProfileProvider");
    }
    return context;
    };