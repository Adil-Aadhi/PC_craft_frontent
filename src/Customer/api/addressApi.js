import api from "../../api/axios";

// GET all addresses
export const fetchAddresses = () =>
  api.get("/users/profile/user-address/");

export const addAddressApi = (data) =>
  api.post("/users/profile/user-address/",data);

// UPDATE address
export const updateAddressApi = (id, data) =>
  api.put(`/users/profile/user-address/${id}/`, data);

// SET default address
export const setDefaultAddressApi = (id) =>
  api.patch(`/users/profile/user-address/${id}/set-default/`);

export const deleteAddressApi = (id) =>
  api.delete(`/users/profile/user-address/${id}/`);
