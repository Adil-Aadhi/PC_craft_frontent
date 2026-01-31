import { uploadImageToCloudinary } from "../../utils/cloudinaryUpload";
import {updateProfileImage,deleteProfileImage} from "../../services/profileService";
import { useState } from "react";
import { useProfile } from "../context/ProfileContext";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import LoadingSpinner from "../context/LoadingSpinner";

const ProfileAvatarCard = () => {
  const { profile, fetchProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed !", {
        style: {
            background: "#ef4444",
            color: "#fff",
        }});
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB", {
        style: {
            background: "#ef4444",
            color: "#fff",
        }});
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ upload to cloudinary
      const { url, publicId } = await uploadImageToCloudinary(file);

      // 2️⃣ save to backend
      await updateProfileImage(url, publicId);
      toast.success("Profile image updated");
      // 3️⃣ refresh profile everywhere
      await fetchProfile();
    } catch (err) {
      toast.error("Image upload failed", {
        style: {
            background: "#ef4444",
            color: "#fff",
        }});
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {

    try {
      setLoading(true);
      await deleteProfileImage();
      toast.success("Profile image removed");
      await fetchProfile();
    } catch (err) {
      toast.error("Delete failed", {
        style: {
            background: "#ef4444",
            color: "#fff",
        }});
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const getInitial = () => {
  if (profile?.full_name) return profile.full_name.charAt(0).toUpperCase();
  if (profile?.user?.username) return profile.user.username.charAt(0).toUpperCase();
  return "?";
};

  return (
    <div className="flex flex-col items-center justify-center text-center p-6">
      <div className="relative">
            {profile?.profile_image ? (
                <img
                src={profile.profile_image}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                />
            ) : (
                <div
                className="
                    w-36 h-36
                    rounded-full
                    flex items-center justify-center
                    bg-gradient-to-br from-blue-500 to-indigo-600
                    text-white
                    text-5xl font-bold
                    shadow-md
                    border-4 border-white
                "
                >
                {getInitial()}
                </div>
            )}
            </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-800">
        {profile?.user?.username}
      </h2>

      <p className="text-sm text-slate-800 mt-1 mb-3">
        {profile?.user?.email}
      </p>

      <label className="cursor-pointer">
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleUpload}
          disabled={loading}
        />
        <span className="px-5 py-2 rounded-lg bg-blue-600 text-white flex justify-center min-w-[140px]">
          {loading ? <LoadingSpinner/> : "Change Photo"}
        </span>
      </label>
      <p className="text-sm text-slate-500 mt-2">
        PNG or JPG up to 2MB
      </p>

      {profile?.profile_image && (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="mt-3 text-sm text-red-500"
        >
          Remove Photo
        </button>
      )}
       <ConfirmModal
        isOpen={showConfirm}
        title="Remove profile photo?"
        message="This action cannot be undone."
        confirmText="Remove"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={loading}
      />
    </div>
  );
};

export default ProfileAvatarCard;
