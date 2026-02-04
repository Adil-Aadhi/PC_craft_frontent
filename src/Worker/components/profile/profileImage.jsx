import { useRef } from "react";
import { FiCamera } from "react-icons/fi";

const ProfileImage = ({ image, onUpload }) => {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="relative w-32 h-32">
      {/* Profile Image */}
      <img
        src={image || "/default-avatar.png"}
        alt="Profile"
        className="w-full h-full rounded-full object-cover border"
      />

      {/* Upload Button */}
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full"
      >
        <FiCamera size={14} />
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileImage;
