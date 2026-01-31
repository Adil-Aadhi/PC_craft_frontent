import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchAddresses,
  addAddressApi,
  updateAddressApi,
  setDefaultAddressApi,
  deleteAddressApi
} from "../api/addressApi";
import { toast } from "react-toastify";

const UserAddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Load all addresses
  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetchAddresses();
      setUserAddress(res.data);
    } catch (err) {
      console.error("Error loading addresses", err);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add new address (POST)
  const addAddress = async (data) => {
    try {
      await addAddressApi(data);
      toast.success("Address added successfully");
      loadAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address");
    }
  };

  // ✏️ Update existing address (PATCH)
  const updateAddress = async (id, data) => {
    try {
      await updateAddressApi(id, data);
      toast.success("Address updated successfully");
      loadAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update address");
    }
  };

  // ⭐ Set default address
  const setDefaultAddress = async (id) => {
    try {
      await setDefaultAddressApi(id);
      toast.success("Default address updated");
      loadAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default address");
    }
  };

  const deleteAddress = async (id)=>{
    try{
        await deleteAddressApi(id)
        toast.success("Address deleted");
      loadAddresses();
    }catch (err) {
      console.error(err);
      toast.error("Failed deleteaddress");
  }
}

  useEffect(() => {
    loadAddresses();
  }, []);

  return (
    <UserAddressContext.Provider
      value={{
        userAddress,
        loading,
        addAddress,
        updateAddress,
        setDefaultAddress,
        refetchAddress: loadAddresses,
        deleteAddress
      }}
    >
      {children}
    </UserAddressContext.Provider>
  );
};

export const useUserAddress = () => {
  const context = useContext(UserAddressContext);
  if (!context) {
    throw new Error("useUserAddress must be used inside AddressProvider");
  }
  return context;
};
