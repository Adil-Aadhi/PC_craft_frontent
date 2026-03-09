import api from "../../api/axios";

export const updateOrderStatus = async (orderId, statusValue) => {
  try {
    await api.post(`orders/${orderId}/update-status/`, {
      status: statusValue,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};