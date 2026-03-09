import { DollarSign, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function RevenueCard({ revenue }) {
  const [animatedRevenue, setAnimatedRevenue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = revenue;
    const duration = 1500;
    const stepTime = 20;
    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedRevenue(Math.floor(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, [revenue]);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-xl px-10 py-10 text-white relative overflow-hidden">

      {/* background circles */}
      <div className="absolute top-0 right-0 w-52 h-52 bg-white/10 rounded-full -translate-y-24 translate-x-24"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>

      <div className="relative z-10 flex flex-col items-center text-center">

        {/* icon */}
        <div className="bg-white/20 p-4 rounded-xl mb-4 backdrop-blur-sm">
          <DollarSign size={32} />
        </div>

        {/* title */}
        <p className="text-indigo-200 text-sm tracking-wide uppercase">
          Total Platform Revenue
        </p>

        {/* main revenue */}
        <h2 className="text-6xl font-bold mt-3 tracking-tight">
          ₹{animatedRevenue.toLocaleString()}
        </h2>

        {/* divider */}
        <div className="w-full max-w-lg border-t border-white/20 my-6"></div>

        {/* bottom stats */}
        <div className="flex items-center justify-center gap-12 text-sm">

          <div className="text-center">
            <p className="text-indigo-200 text-xs">Daily Avg</p>
            <p className="font-semibold text-lg">
              ₹{Math.floor(revenue / 30).toLocaleString()}
            </p>
          </div>

          <div className="text-center flex flex-col items-center">
            <Calendar size={16} className="mb-1 text-indigo-200"/>
            <p className="text-xs text-indigo-200">Last 30 Days</p>
          </div>

          <div className="text-center">
            <p className="text-indigo-200 text-xs">Updated</p>
            <p className="font-semibold">Today</p>
          </div>

        </div>

      </div>
    </div>
  );
}