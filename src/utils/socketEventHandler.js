// import toast from "react-hot-toast";

// export const handleSocketEvent = (
//   data,
//   { setOrders, setUser, navigate }
// ) => {
//   switch (data.type) {
//     case "order_status_update":
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === data.payload.order_id
//             ? { ...order, status: data.payload.status }
//             : order
//         )
//       );
//       toast.success(`Order ${data.payload.status}`);
//       break;

//     case "worker_assigned":
//       toast.success("You have been assigned a new order");
//       break;

//     case "kyc_verified":
//       toast.success("KYC Verified 🎉");
//       setUser((prev) => ({ ...prev, is_verified: true }));
//       navigate("/worker/dashboard");
//       break;

//     default:
//       console.log("Unhandled socket event:", data);
//   }
// };
