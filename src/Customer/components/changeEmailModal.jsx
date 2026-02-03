import { useState } from "react"
import useSecurity from "../hooks/securityHook"

const ChangeEmailModal = ({ isOpen, onClose, onOtpSent }) => {
  const [email, setEmail] = useState("")
  const { sendOtpToEmail, loading, error, success } = useSecurity()

  if (!isOpen) return null

  const handleSendOtp = async () => {
    if (!email) return alert("Enter email")

    const ok = await sendOtpToEmail(email)
    if (ok) {
      onOtpSent(email)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Change Email
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            We’ll send an OTP to verify your email address
          </p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          />
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm
                       hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2 text-sm text-white
                       hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangeEmailModal
