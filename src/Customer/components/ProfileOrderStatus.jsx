import { FiBarChart2, FiClock, FiPackage, FiCheckCircle, FiXCircle } from "react-icons/fi";

const OrderStatusCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <FiBarChart2 /> Order Status
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Pending */}
        <div className="rounded-xl border bg-slate-50 p-4 text-center">
          <FiClock className="mx-auto text-yellow-500 mb-2" size={22} />
          <p className="text-2xl font-bold text-slate-800">0</p>
          <p className="text-sm text-slate-500">Pending</p>
        </div>

        {/* Processing */}
        <div className="rounded-xl border bg-slate-50 p-4 text-center">
          <FiPackage className="mx-auto text-blue-500 mb-2" size={22} />
          <p className="text-2xl font-bold text-slate-800">0</p>
          <p className="text-sm text-slate-500">Processing</p>
        </div>

        {/* Completed */}
        <div className="rounded-xl border bg-slate-50 p-4 text-center">
          <FiCheckCircle className="mx-auto text-green-500 mb-2" size={22} />
          <p className="text-2xl font-bold text-slate-800">0</p>
          <p className="text-sm text-slate-500">Completed</p>
        </div>

        {/* Cancelled */}
        <div className="rounded-xl border bg-slate-50 p-4 text-center">
          <FiXCircle className="mx-auto text-red-500 mb-2" size={22} />
          <p className="text-2xl font-bold text-slate-800">0</p>
          <p className="text-sm text-slate-500">Cancelled</p>
        </div>

      </div>

      <p className="text-sm text-slate-500 mt-4">
        Your order history and detailed tracking will appear here.
      </p>
    </div>
  );
};

export default OrderStatusCard;
