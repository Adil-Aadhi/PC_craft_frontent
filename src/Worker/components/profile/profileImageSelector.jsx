import { useState } from "react";
import ProfileImage from "./profileImage";

const ProfileImageSection = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleUpload = (file) => {
    const preview = URL.createObjectURL(file);
    setProfileImage(preview);

    // API call here later
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Profile Image</h2>
      <ProfileImage image={profileImage} onUpload={handleUpload} />
    </div>
  );
};

export default ProfileImageSection;
