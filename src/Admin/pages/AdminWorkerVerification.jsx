import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Mail, Briefcase, Clock, DollarSign,ChevronRight,Eye,Users} from "lucide-react";
import api from "../../api/axios";
import { WorkerKYCModalVerification } from "../components/AdminKycVerificationModal";

export default function WorkerVerification() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const fetchWorkers = async () => {
    try {
      const res = await api.get("admin/workers/pending/");
      setWorkers(res.data);
    } catch (error) {
      console.error("Failed to fetch workers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const approveWorker = async (id, status) => {
    try {
      await api.patch(`admin/workers/${id}/kyc-update/`, {
        kyc_status: status,
      });
      setWorkers(workers.filter((w) => w.id !== id));
      setSelectedWorker(null);
    } catch (error) {
      console.error("Failed to update worker KYC", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading workers...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 md:p-6">
      <div className="ms-0 me-0 md:ms-3 md:me-3">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0"
          >

            {/* Left Side - Title */}
            <div>
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Worker Verification
              </h1>

              <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
                Review and verify pending KYC submissions
              </p>
            </div>

            {/* Bigger Card */}
              <div className="bg-white shadow-lg rounded-xl px-4 md:px-6 py-3 md:py-4 flex items-center space-x-3 md:space-x-4 border w-full md:w-auto">

                <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                  <Users className="w-5 h-5 md:w-7 md:h-7 text-blue-600" />
                </div>

                <div>
                  <p className="text-xs md:text-sm text-gray-500">Pending Workers</p>

                  <p className="text-xl md:text-2xl font-bold text-gray-800">
                    {workers.length}
                  </p>
                </div>
              </div>

          </motion.div>

        {workers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-12 text-center"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 md:w-12 md:h-12 text-green-500" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">All Caught Up!</h3>
            <p className="text-sm md:text-base text-gray-600">No pending workers to verify at the moment.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence>
              {workers.map((worker, index) => (
                <motion.div
                  key={worker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg">
                          {worker.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm md:text-base text-gray-800">{worker.username}</h3>
                          <p className="text-xs md:text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {worker.email}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
                        worker.kyc_status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : worker.kyc_status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {worker.kyc_status}
                      </span>
                    </div>

                    <div className="space-y-1 md:space-y-2 mb-4">
                      <p className="text-xs md:text-sm text-gray-600 flex items-center">
                        <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Skills:</span> 
                        <span className="ml-1 truncate">{worker.skills}</span>
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 flex items-center">
                        <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Experience:</span> 
                        <span className="ml-1">{worker.experience_years} years</span>
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 flex items-center">
                        <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Hourly Rate:</span> 
                        <span className="ml-1">${worker.hourly_rate}</span>
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedWorker(worker)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-1.5 md:py-2 px-4 rounded-lg md:rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-xs md:text-sm"
                    >
                      <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>View KYC Details</span>
                      <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <WorkerKYCModalVerification
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onApprove={approveWorker}
        />
      </div>
    </div>
  );
}