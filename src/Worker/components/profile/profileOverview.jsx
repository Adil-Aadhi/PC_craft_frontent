import { useState } from "react";
import ProfileImage from "./profileImage";
import PersonalInfo from "./profilePersonalInformation";

const ProfileOverview = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleUpload = (file) => {
    const preview = URL.createObjectURL(file);
    setProfileImage(preview);

    // TODO: API call later
  };

  return (
    <div
      className="
        bg-white/60 backdrop-blur-md
        border border-white/30
        rounded-2xl shadow-lg
        p-6
      "
    >
      <h2 className="text-lg font-semibold mb-6 text-center">
        Profile Overview
      </h2>

      <div className="flex flex-col items-center gap-8">

        {/* Profile Image (centered) */}
        <ProfileImage
          image={profileImage}
          onUpload={handleUpload}
        />

        {/* Personal Info (below image) */}
        <div className="w-full">
          <PersonalInfo />
        </div>

      </div>
    </div>
  );
};

export default ProfileOverview;
