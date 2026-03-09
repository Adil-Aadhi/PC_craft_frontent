import WorkerDashboardLayout from "../layout/workerDashboardLayout";
import RecentProjects from "../components/RecentWork";
import EarningsOverview from "../components/EarningGraph";
import QuickActions from "../components/QuickActions";
import TotalEarningsCard from "../components/TotalEarningsCard";
import CompletedWorkCard from "../components/CompletedWorkCard";
import ClientRatingCard from "../components/ClientRatingCard";

import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../../api/axios";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(getGreeting());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting());
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  useEffect(() => {
    api.get("/workers/dashboard/")
      .then((res) => {
        setDashboardData(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-8 px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {greeting}, {user?.full_name?.split(" ")[0] || "Worker"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
          </div>

          <div className="flex gap-2 mt-4 sm:mt-0">
            <StatusPill label="KYC Status" value={user?.kyc_status} />
            <StatusPill
              label="Member since"
              value={new Date(
                user?.date_joined || Date.now()
              ).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            />
          </div>
        </div>

        <div className="mt-4 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      </motion.div>

     <WorkerDashboardLayout
        StatusCards={
          <motion.div
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full items-stretch"
          >
            <motion.div variants={item} className="h-full">
              <TotalEarningsCard earnings={dashboardData?.total_earnings}
                                componentTotal={dashboardData?.component_total}
                                serviceTotal={dashboardData?.service_total}
                                trend={dashboardData?.earnings_trend}
                                previousEarnings={dashboardData?.previous_month_earnings} />
            </motion.div>

            <motion.div variants={item} className="h-full">
              <CompletedWorkCard completedJobs={dashboardData?.completed_jobs}
                                inProgress={dashboardData?.in_progress_jobs}
                                cancelled={dashboardData?.cancelled_jobs}
                                totalJobs={dashboardData?.total_jobs} />
            </motion.div>

            <motion.div variants={item} className="h-full">
              <ClientRatingCard  rating={dashboardData?.rating}
                                totalReviews={dashboardData?.total_reviews}
                                ratingCounts={dashboardData?.rating_counts} />
            </motion.div>
          </motion.div>
        }
        RecentProject={
          <DashboardCard title="Recent Projects" variants={item}>
            <RecentProjects projects={dashboardData?.recent_projects || []} />
          </DashboardCard>
        }
         QuickActions={
          <motion.div variants={item}>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <QuickActions />
            </div>
          </motion.div>
        }
      
        EarningsOverview={
          <DashboardCard title="Earnings Overview" variants={item}>
            <EarningsOverview data={dashboardData?.earnings_graph || []}
                              weeklyTotal={dashboardData?.weekly_earnings}
                              growth={dashboardData?.earnings_growth} />
          </DashboardCard>
        }
       
      />
    </motion.div>
  );
}

/* 🔹 Reusable Components */

const DashboardCard = ({ title, children, variants }) => (
  <motion.div variants={variants}>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  </motion.div>
);

const StatusPill = ({ label, value }) => (
  <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 text-xs">
    <span className="text-gray-500">{label}: </span>
    <span className="font-semibold text-gray-700 capitalize">{value}</span>
  </div>
);