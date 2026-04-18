import { Users, ShoppingCart, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";

export default function StatsSection({ stats }) {

  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    workers: 0,
    orders: 0
  });

  useEffect(() => {

    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {

      currentStep++;

      if (currentStep >= steps) {
        setAnimatedStats({
          users: stats.users,
          workers: stats.workers,
          orders: stats.orders
        });
        clearInterval(timer);
        return;
      }

      setAnimatedStats({
        users: Math.floor((stats.users / steps) * currentStep),
        workers: Math.floor((stats.workers / steps) * currentStep),
        orders: Math.floor((stats.orders / steps) * currentStep)
      });

    }, interval);

    return () => clearInterval(timer);

  }, [stats]);



  const statCards = [
    {
      icon: <Users className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Users",
      titleDesktop: "Total Users",
      value: animatedStats.users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-500"
    },
    {
      icon: <UserCheck className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Workers",
      titleDesktop: "Total Workers",
      value: animatedStats.workers,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-500"
    },
    {
      icon: <ShoppingCart className="w-4 h-4 md:w-6 md:h-6" />,
      title: "Orders",
      titleDesktop: "Total Orders",
      value: animatedStats.orders,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">

      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}

    </div>
  );
}



function StatCard({ icon, title, titleDesktop, value, bgColor, iconColor, borderColor }) {

  return (
    <div className={`bg-white rounded-xl md:rounded-2xl shadow-lg p-2 md:p-6 border-l-2 md:border-l-4 ${borderColor} hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-center md:justify-start`}>

      <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-center md:text-left">

        <div className={`${bgColor} p-1.5 md:p-3 rounded-lg md:rounded-xl`}>
          <div className={iconColor}>{icon}</div>
        </div>

        <div>
          <p className="text-gray-500 text-[9px] sm:text-xs md:text-sm font-medium">
            <span className="md:hidden">{title}</span>
            <span className="hidden md:inline">{titleDesktop}</span>
          </p>
          <h3 className="text-sm sm:text-base md:text-3xl font-bold text-gray-800">
            {value.toLocaleString()}
          </h3>
        </div>

      </div>

    </div>
  );
}