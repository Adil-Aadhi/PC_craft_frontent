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
      icon: <Users size={24} />,
      title: "Total Users",
      value: animatedStats.users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-500"
    },
    {
      icon: <UserCheck size={24} />,
      title: "Total Workers",
      value: animatedStats.workers,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-500"
    },
    {
      icon: <ShoppingCart size={24} />,
      title: "Total Orders",
      value: animatedStats.orders,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-500"
    }
  ];



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}

    </div>
  );
}



function StatCard({ icon, title, value, bgColor, iconColor, borderColor }) {

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${borderColor} hover:shadow-xl transition-all duration-300`}>

      <div className="flex items-center gap-4">

        <div className={`${bgColor} p-3 rounded-xl`}>
          <div className={iconColor}>{icon}</div>
        </div>

        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">
            {value.toLocaleString()}
          </h3>
        </div>

      </div>

    </div>
  );
}