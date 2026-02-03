import { FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState,useEffect } from "react";
import ProfileInfoCard from "../components/ProfileInfoCard";
import BillingAddressCard from "../components/ProfileBillingAddress";
import OrderStatusCard from "../components/ProfileOrderStatus";
import SecurityCard from "../components/ProfileSecurityCard";
import SessionsCard from "../components/ProfileSessionCard";
import DangerZoneCard from "../components/ProfileDangerZone";
import PleaseLogin from "../components/ProfileNoUserLogin";
import ProfileAvatarCard from "../components/ProfileAvatar";
import { useAuth } from "../../context/AuthContext";
import ProfileMenu from "../components/ProfileMenu";

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

  const [activeSection, setActiveSection] = useState("avatar");
  const {handleLogout}=useAuth()

  if (!storedUser) {
    return <PleaseLogin />;
  }

  useEffect(() => {
  const sections = Array.from(document.querySelectorAll("section[id]"));

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top
        );

      if (visibleSections.length > 0) {
        setActiveSection(visibleSections[0].target.id);
      }
    },
    {
      rootMargin: "-30% 0px -50% 0px",
    }
  );

  sections.forEach((sec) => observer.observe(sec));

  return () => observer.disconnect();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/90 via-white to-blue-50/70 p-6">

    {/* ================= COMMON HEADER (OUTSIDE GRID) ================= */}
    
    <div className="max-w-7xl mx-auto mt-20 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal information and security
          </p>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-red-500 opacity-60"
          onClick={handleLogout}
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>

    {/* ================= GRID (MENU + CONTENT) ================= */}
    <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">

      {/* LEFT MENU */}
      <aside className="col-span-3 hidden lg:block">
        <ProfileMenu active={activeSection} />
      </aside>

      {/* RIGHT CONTENT */}
      <main className="col-span-12 lg:col-span-9 space-y-8">

        <section id="avatar" className="scroll-mt-28 py-14">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -2 }}
          >
            <ProfileAvatarCard />
          </motion.div>
        </section>

        <section id="profile" className="scroll-mt-24 py-10">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -2 }}
          >
            <ProfileInfoCard />
          </motion.div>
        </section>

        <section id="address" className="scroll-mt-24 py-10">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <BillingAddressCard />
          </motion.div>
        </section>

        <section id="orders" className="scroll-mt-24 py-10">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -2 }}
          >
            <OrderStatusCard />
          </motion.div>
        </section>

        <section id="security" className="scroll-mt-24 py-10">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <SecurityCard />
          </motion.div>
        </section>

        <section id="sessions" className="scroll-mt-24 py-10">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -2 }}
          >
            <SessionsCard />
          </motion.div>
        </section>

        <section id="danger" className="scroll-mt-24 py-10">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -2 }}
          >
            <DangerZoneCard />
          </motion.div>
        </section>

      </main>
    </div>
  </div>
  );
};

export default ProfilePage;
