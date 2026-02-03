import { FiShield, FiLock, FiMail, FiKey } from "react-icons/fi";
import useSecurity from "../hooks/securityHook";
import ChangePasswordModal from "./ChangePasswordModal";
import { useState } from "react";
import ChangeEmailModal from "./changeEmailModal";
import VerifyOtpModal from "./verifyOtpModal";

const SecurityCard = () => {

  const { changePassword, loading, error } = useSecurity();
  const [openChangePass, setOpenChangePass] = useState(false);
  const [openChangeEmail,setOpenChangeEmail]=useState(false)
  const [openVerifyOtp, setOpenVerifyOtp] = useState(false)
  const [emailForOtp, setEmailForOtp] = useState("")

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <FiShield className="text-slate-700" />
        Security
      </h2>

      {/* Items */}
      <div className="space-y-4">
        <SecurityItem
          icon={<FiKey />}
          title="Change Password"
          description="Update your account password"
          onClick={() => setOpenChangePass(true)}
        />

        <SecurityItem
          icon={<FiMail />}
          title="Change Email"
          description="Update your login email address"
          onClick={()=>setOpenChangeEmail(true)}
        />

        <SecurityItem
          icon={<FiLock />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security"
          disabled
        />
      </div>
        {openChangePass && (
        <ChangePasswordModal
          onClose={() => setOpenChangePass(false)}
          onSubmit={changePassword}
          loading={loading}
          error={error}
        />
      )}
      {openChangeEmail && (
      <ChangeEmailModal
        isOpen={openChangeEmail}
        onClose={() => setOpenChangeEmail(false)}
        onOtpSent={(email) => {
          setEmailForOtp(email)
          setOpenChangeEmail(false)
          setOpenVerifyOtp(true)
        }}
      />
    )}
    {openVerifyOtp && (
        <VerifyOtpModal
          isOpen={openVerifyOtp}
          email={emailForOtp}
          onClose={() => setOpenVerifyOtp(false)}
        />
      )}
    </div>
  );
};

const SecurityItem = ({ icon, title, description, onClick,disabled = false, }) => {
  return (
     <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between p-4 rounded-xl border
        transition
        ${
          disabled
            ? "bg-slate-50 opacity-60 cursor-not-allowed"
            : "bg-white hover:bg-slate-50"
        }
      `}
    >
      <div className="flex items-center gap-4 text-left">
        <div className="p-3 rounded-lg bg-slate-900 text-white">
          {icon}
        </div>

        <div>
          <p className="font-medium text-slate-800">{title}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {disabled && (
        <span className="text-xs font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
          Coming soon
        </span>
      )}
    </button>
  );
};

export default SecurityCard;
