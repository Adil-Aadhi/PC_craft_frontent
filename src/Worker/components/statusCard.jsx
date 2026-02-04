import {
  FiDollarSign,
  FiCheckCircle,
  FiStar,
  FiTrendingUp
} from "react-icons/fi";

/* ---------------- TOTAL EARNINGS ---------------- */
export const TotalEarningsCard = () => (
  <div className="border border-blue-100 bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <FiDollarSign className="text-blue-500" />
      </div>
      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
        +12.5%
      </span>
    </div>
    <p className="text-sm text-gray-600">Total Earnings</p>
    <p className="text-2xl font-bold">$12,480</p>
    <p className="text-xs text-gray-500 flex items-center mt-2">
      <FiTrendingUp className="mr-1" /> from last month
    </p>
  </div>
);

/* ---------------- COMPLETED WORK ---------------- */
export const CompletedWorkCard = () => (
  <div className="border border-purple-100 bg-gradient-to-br from-purple-50 to-white rounded-2xl p-5">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <FiCheckCircle className="text-purple-500" />
      </div>
    </div>
    <p className="text-sm text-gray-600">Completed Builds</p>
    <p className="text-2xl font-bold">42</p>
    <p className="text-xs text-gray-500 mt-2">98% satisfaction</p>
  </div>
);

/* ---------------- CLIENT RATING ---------------- */
export const ClientRatingCard = () => (
  <div className="border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-5">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <FiStar className="text-yellow-500" />
      </div>
    </div>
    <p className="text-sm text-gray-600">Client Rating</p>
    <p className="text-2xl font-bold">4.8 / 5</p>
    <p className="text-xs text-gray-500 mt-2">47 reviews</p>
  </div>
);
