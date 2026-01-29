import { FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";

import ProfileInfoCard from "../components/ProfileInfoCard";
import BillingAddressCard from "../components/ProfileBillingAddress";
import OrderStatusCard from "../components/ProfileOrderStatus";
import SecurityCard from "../components/ProfileSecurityCard";
import SessionsCard from "../components/ProfileSessionCard";
import DangerZoneCard from "../components/ProfileDangerZone";
import PleaseLogin from "../components/ProfileNoUserLogin";

/* ---------------- ANIMATION VARIANTS ---------------- */

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    return <PleaseLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 via-white to-blue-50/70 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ---------------- HEADER ---------------- */}
        <div className="flex items-center justify-between mt-20">
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-slate-900">
              My Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your personal information and security
            </p>
          </div>

          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-red-500 opacity-60 cursor-not-allowed"
          >
            <FiLogOut /> Logout
          </button>
        </div>

        {/* ---------------- CARDS (SCROLL ANIMATION) ---------------- */}

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{ y: -2 }}
        >
          <ProfileInfoCard />
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{ y: -2 }}
        >
          <BillingAddressCard />
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{ y: -2 }}
        >
          <OrderStatusCard />
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{ y: -2 }}
        >
          <SecurityCard />
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{ y: -2 }}
        >
          <SessionsCard />
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          whileHover={{ y: -2 }}
        >
          <DangerZoneCard />
        </motion.div>

      </div>
    </div>
  );
};

export default ProfilePage;
