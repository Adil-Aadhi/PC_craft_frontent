import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";
import { createPortal } from "react-dom";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-xl w-[90%] max-w-[380px] p-5 md:p-6"
        >

          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-2 md:p-3 rounded-full">
              <FaSignOutAlt className="text-red-600 text-lg md:text-xl" />
            </div>
          </div>

          <h2 className="text-base md:text-lg font-bold text-center text-gray-800">
            Confirm Logout
          </h2>

          <p className="text-gray-600 text-center mt-2 text-sm md:text-base">
            Are you sure you want to logout?
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-1.5 md:py-2 rounded-lg border text-gray-700 hover:bg-gray-100 text-sm md:text-base transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-1.5 md:py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm md:text-base transition-colors"
            >
              Logout
            </button>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>,
    document.body
  );
}