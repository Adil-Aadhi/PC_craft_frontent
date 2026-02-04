import { FiDollarSign, FiTrendingUp } from "react-icons/fi";

/* -------- Dummy Earnings Data -------- */
const EARNINGS_DATA = [
  { day: "Mon", amount: 120 },
  { day: "Tue", amount: 180 },
  { day: "Wed", amount: 90 },
  { day: "Thu", amount: 220 },
  { day: "Fri", amount: 160 },
  { day: "Sat", amount: 260 },
  { day: "Sun", amount: 300 },
];

export default function EarningsOverview() {
  const maxAmount = Math.max(...EARNINGS_DATA.map(d => d.amount));

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <FiDollarSign className="mr-2" />
          Earnings Overview
        </h2>
        <span className="flex items-center text-green-600 text-sm font-medium">
          <FiTrendingUp className="mr-1" />
          +12.5%
        </span>
      </div>

      {/* Graph */}
      <div className="flex items-end justify-between h-40 gap-2">
        {EARNINGS_DATA.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Bar */}
              <div className="w-full bg-gray-100 rounded-lg flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg transition-all hover:opacity-90"
                  style={{ height: `${height}%` }}
                  title={`$${item.amount}`}
                />
              </div>

              {/* Label */}
              <span className="mt-2 text-xs text-gray-500">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold">$1,330</p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Withdraw
        </button>
      </div>
    </div>
  );
}
