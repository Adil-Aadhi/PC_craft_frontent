import { useState, useRef } from "react"
import useSecurity from "../hooks/securityHook"

const VerifyOtpModal = ({ isOpen, email, onClose }) => {
  const [otp, setOtp] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [step, setStep] = useState("otp")
  const { verifyOtp, loading, error, success, updateEmail } = useSecurity()

  const otpRefs = useRef([])

  if (!isOpen) return null

  /* =========================
     OTP HANDLERS
  ========================= */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const otpArray = otp.padEnd(6, "").split("")
    otpArray[index] = value
    const newOtp = otpArray.join("").trim()

    setOtp(newOtp)

    if (value && index < 5) {
      otpRefs.current[index + 1].focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus()
    }
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pasted)) return

    setOtp(pasted)
    otpRefs.current[Math.min(pasted.length, 5)].focus()
  }

  /* =========================
     ACTIONS
  ========================= */
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return alert("Enter full OTP")
    const ok = await verifyOtp(email, otp)
    if (ok) setStep("newEmail")
  }

  const handleUpdateEmail = async () => {
    if (!newEmail) return alert("Enter new email")
    const ok = await updateEmail(newEmail)
    if (ok) setTimeout(onClose, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl">

        {/* OTP STEP */}
        {step === "otp" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Verify OTP
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter the 6-digit code sent to <b>{email}</b>
            </p>

            {/* OTP BOXES */}
            <div
              className="flex justify-between gap-2 mb-4"
              onPaste={handleOtpPaste}
            >
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={otp[index] || ""}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  onKeyDown={(e) =>
                    handleOtpKeyDown(e, index)
                  }
                  className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg font-semibold
                             focus:outline-none focus:ring-2 focus:ring-black"
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-2">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 mb-2">{success}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="rounded-lg bg-black px-5 py-2 text-sm text-white
                           hover:bg-gray-900 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </>
        )}

        {/* NEW EMAIL STEP */}
        {step === "newEmail" && (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Enter New Email
            </h2>

            <input
              type="email"
              placeholder="you@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mb-3 w-full rounded-lg border px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-black"
            />

            {error && (
              <p className="text-sm text-red-500 mb-2">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 mb-2">{success}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateEmail}
                disabled={loading}
                className="rounded-lg bg-black px-5 py-2 text-sm text-white
                           hover:bg-gray-900 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyOtpModal
