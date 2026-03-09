import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const WorkerProfessionalDetails = () => {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  const [form, setForm] = useState({
    description: "",
    skills: "",
    experience_years: "",
    hourly_rate: "",
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await api.get("/workers/profile/worker-details/");
        setData(res.data);

        setForm({
          description: res.data.description || "",
          skills: res.data.skills || "",
          experience_years: res.data.experience_years || "",
          hourly_rate: res.data.hourly_rate || "",
        });
      } catch (err) {
        console.error("Failed to load worker details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...form,
        experience_years: Number(form.experience_years),
        hourly_rate: Number(form.hourly_rate),
      };

      const res = await api.patch(
        "/workers/profile/worker-details/",
        payload
      );

      setData(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update worker details", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
        <p className="text-sm text-gray-500 animate-pulse">
          Loading professional details...
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-8"
      >
        <h3 className="text-xl font-semibold text-gray-800">
          Professional Details
        </h3>

        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      </motion.div>

      <AnimatePresence mode="wait">
        {editMode ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short professional bio..."
                className="md:col-span-2 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g. Cable management, BIOS tuning"
                className="border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                name="experience_years"
                value={form.experience_years}
                onChange={handleChange}
                placeholder="Years of experience"
                type="number"
                className="border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                name="hourly_rate"
                value={form.hourly_rate}
                onChange={handleChange}
                placeholder="Hourly rate"
                type="number"
                className="border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* About */}
            <motion.div variants={itemVariants} className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">About</p>
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.description?.trim()
                    ? data.description
                    : "No description provided."}
                </p>
              </div>
            </motion.div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <InfoCard label="Skills" value={data.skills} />
              <InfoCard
                label="Experience"
                value={
                  data.experience_years
                    ? `${data.experience_years} years`
                    : "—"
                }
              />
              <InfoCard
                label="Hourly Rate"
                value={
                  data.hourly_rate ? `₹${data.hourly_rate}/hr` : "—"
                }
              />
            </div>

            {/* Edit Button */}
            <div className="mt-6 flex justify-end">
              <button
                disabled={user.kyc_status === "pending"}
                className={`text-sm font-medium ${
                  user.kyc_status === "pending"
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-700"
                }`}
                onClick={() => setEditMode(true)}
              >
                Edit Details
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KYC Banner */}
      {user?.kyc_status === "pending" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-xs text-yellow-700"
        >
          KYC verification pending. Details can't be edited until verification is complete.
        </motion.div>
      )}
    </motion.div>
  );
};

const InfoCard = ({ label, value }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
  >
    <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
      {label}
    </p>
    <p className="text-base font-semibold text-gray-800 break-words">
      {value || "—"}
    </p>
  </motion.div>
);

export default WorkerProfessionalDetails;