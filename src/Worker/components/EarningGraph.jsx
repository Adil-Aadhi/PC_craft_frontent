import { FiDollarSign, FiTrendingUp } from "react-icons/fi";

export default function EarningsOverview({
  data,
  weeklyTotal,
  growth
}) {

  const maxAmount = Math.max(...(data?.map(d => d.amount) || [1]));

  return (
    <div className="bg-white rounded-xl shadow p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h2 className="text-lg font-semibold flex items-center">
          <FiDollarSign className="mr-2" />
          Earnings (Last 7 Days)
        </h2>

        <span className="flex items-center text-green-600 text-sm font-medium">
          <FiTrendingUp className="mr-1" />
          {growth?.toFixed(1)}%
        </span>

      </div>

      {/* Graph */}
      <div className="flex items-end justify-between h-40 gap-2">

        {!data || data.length === 0 ? (
          <p className="text-sm text-gray-500">
            No earnings data
          </p>
        ) : (
          data.map((item, index) => {

            const height = (item.amount / maxAmount) * 100;

            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1"
              >

                <div className="w-full  h-32 bg-gray-100 rounded-lg flex items-end">

                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                    style={{ height: `${height}%` }}
                    title={`₹${item.amount}`}
                  />

                </div>

                <span className="mt-2 text-xs text-gray-500">
                  {item.day}
                </span>

              </div>
            );

          })
        )}

      </div>

      {/* Footer */}
      <div className="mt-6">

        <p className="text-sm text-gray-500">
          Total (Last 7 Days)
        </p>

        <p className="text-2xl font-bold">
          ₹{weeklyTotal}
        </p>

      </div>

    </div>
  );
}