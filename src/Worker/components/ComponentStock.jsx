import {
  FiCpu,
  FiLayers,
  FiHardDrive,
  FiMonitor,
  FiPackage,
} from "react-icons/fi";

/* -------- Dummy Stock Data -------- */
const STOCK_DATA = [
  {
    id: 1,
    name: "CPU",
    count: 2,
    icon: <FiCpu className="text-blue-500" />,
  },
  {
    id: 2,
    name: "RAM",
    count: 3,
    icon: <FiLayers className="text-purple-500" />,
  },
  {
    id: 3,
    name: "Storage",
    count: 5,
    icon: <FiHardDrive className="text-green-500" />,
  },
  {
    id: 4,
    name: "Monitor",
    count: 1,
    icon: <FiMonitor className="text-yellow-500" />,
  },
  {
    id: 5,
    name: "Accessories",
    count: 8,
    icon: <FiPackage className="text-indigo-500" />,
  },
];

export default function ComponentStock() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Component Stock
        </h2>
        <span className="text-sm text-gray-500">
          Available
        </span>
      </div>

      {/* Stock List */}
      <div className="space-y-3">
        {STOCK_DATA.map((item) => (
          <StockRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Stock Row ---------------- */

const StockRow = ({ item }) => {
  const lowStock = item.count <= 2;

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          {item.icon}
        </div>
        <span className="font-medium text-gray-700">
          {item.name}
        </span>
      </div>

      <div className="text-right">
        <p
          className={`font-semibold ${
            lowStock ? "text-red-600" : "text-green-600"
          }`}
        >
          {item.count}
        </p>
        <p className="text-xs text-gray-500">
          {lowStock ? "Low stock" : "In stock"}
        </p>
      </div>
    </div>
  );
};
