import { useEffect, useRef, useState } from "react";
import { FiCamera, FiLoader } from "react-icons/fi";
import { MdCheckCircle, MdError } from "react-icons/md";
import api from "../../../api/axios";
import { uploadImageToCloudinary } from "../../../utils/cloudinaryUpload";
import { useAuth } from "../../../context/AuthContext";
import { useWorkerPersonalInfo } from "../../context/workerProfileInfoContext";
import { createPortal } from "react-dom";

const ProfileImage = () => {
  const { user, loading: authLoading } = useAuth();
  const fileRef = useRef(null);
  const bannerRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { personalInfo } = useWorkerPersonalInfo();

  // ✅ fallback to localStorage
  const authUser = user || JSON.parse(localStorage.getItem("user"));

  const userId = authUser?.id;
  const role = authUser?.role;

  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [bannerStatus, setBannerStatus] = useState(null);
  const [imageFetched, setImageFetched] = useState(false);

  // ✅ Fetch image function
  const fetchImage = async () => {
    try {
      const res = await api.get("workers/profile-image/");
      setImage(res.data.profile_image);
    } catch (err) {
      console.error("Image fetch failed", err);
    }
  };

  const fetchBanner = async () => {
  try {
    const res = await api.get("workers/profile/banner-image/");
    setBanner(res.data.banner_image);
  } catch (err) {
    console.error("Banner fetch failed", err);
  }
};

  useEffect(() => {
    if (authLoading) return;
    if (!userId || role !== "worker") return;
    if (imageFetched) return;

    fetchImage();
    setImageFetched(true);
    fetchBanner()
  }, [authLoading, userId, role, imageFetched]);

  // Reset upload status after showing for 3 seconds
  useEffect(() => {
    if (uploadStatus) {
      const timer = setTimeout(() => {
        setUploadStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (bannerStatus) {
      const timer = setTimeout(() => {
        setBannerStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bannerStatus]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      return;
    }

    const preview = URL.createObjectURL(file);
    setImage(preview);
    setLoading(true);
    setUploadStatus(null);

    try {
      const { url, publicId } = await uploadImageToCloudinary(file);

      await api.patch("workers/profile-image/", {
        profile_image: url,
        profile_image_id: publicId,
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchImage();
      setUploadStatus('success');
    } catch (err) {
      console.error("Upload failed", err);
      setUploadStatus('error');
      await fetchImage();
    } finally {
      setLoading(false);
      URL.revokeObjectURL(preview);
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setBannerStatus('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setBannerStatus('error');
      return;
    }

    const preview = URL.createObjectURL(file);
    setBanner(preview);
    setBannerLoading(true);
    setBannerStatus(null);

    try {
      const { url, publicId } = await uploadImageToCloudinary(file);

      // You'll need to create this endpoint
      await api.patch("workers/profile/banner-image/", {
        banner_image: url,
        banner_image_id: publicId,
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      setBanner(url);
      setBannerStatus('success');
    } catch (err) {
      console.error("Banner upload failed", err);
      setBannerStatus('error');
      setBanner(null);
    } finally {
      setBannerLoading(false);
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Banner Section - YouTube Studio Style */}
      <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl overflow-hidden group">
        {/* Banner Image */}
        {banner ? (
          <img
            src={banner}
            alt="Banner"
            className={`w-full h-full object-cover transition-all duration-300 ${
              bannerLoading ? "opacity-50 blur-sm" : "group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
        )}

        {/* Banner Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Banner Loading */}
        {bannerLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin">
                <FiLoader size={32} className="text-white" />
              </div>
              <span className="text-white text-sm font-medium">Uploading banner...</span>
            </div>
          </div>
        )}

        {/* Banner Status */}
        {bannerStatus === 'success' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full shadow-lg animate-in slide-in-from-top">
            <MdCheckCircle size={18} />
            <span className="text-sm font-medium">Banner updated!</span>
          </div>
        )}

        {bannerStatus === 'error' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full shadow-lg animate-in slide-in-from-top">
            <MdError size={18} />
            <span className="text-sm font-medium">Upload failed</span>
          </div>
        )}

        {/* Edit Banner Button */}
        <button
          onClick={() => bannerRef.current.click()}
          disabled={bannerLoading}
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-black/90 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiCamera size={16} />
          <span className="text-sm font-medium">Edit banner</span>
        </button>

        <input
          ref={bannerRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleBannerChange}
        />
      </div>

      {/* Profile Section */}
      <div className="relative bg-white rounded-b-2xl shadow-lg border border-slate-100 -mt-20 pt-16 pb-8 px-8">
        {/* Profile Image - Overlapping Banner */}
        <div className="absolute -top-16 left-8">
          <div className="relative group/profile">
            {/* Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover/profile:opacity-20 blur-lg transition-opacity duration-300"></div>
            
            {/* Image Container */}
            <div className="relative w-32 h-32 ring-4 ring-white rounded-full shadow-2xl bg-white">
              <img
                src={image || "/default-avatar.png"}
                alt="Profile"
                onClick={() => image && setPreviewImage(image)}
                onError={(e) => (e.target.src = "/default-avatar.png")}
                className={`w-full h-full rounded-full object-cover transition-all duration-300 ${
                  loading ? "opacity-60 scale-95" : "group-hover/profile:scale-105"
                }`}
              />
              
              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full backdrop-blur-sm">
                  <div className="animate-spin">
                    <FiLoader size={24} className="text-white" />
                  </div>
                </div>
              )}
              
              {/* Status Overlays */}
              {uploadStatus === 'success' && (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/90 rounded-full backdrop-blur-sm">
                  <MdCheckCircle size={32} className="text-white" />
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-rose-500/90 rounded-full backdrop-blur-sm">
                  <MdError size={32} className="text-white" />
                </div>
              )}
              
              {/* Camera Button */}
              <button
                type="button"
                disabled={loading}
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 ring-3 ring-white"
              >
                <FiCamera size={16} />
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="ml-44 space-y-3">
          {personalInfo?.username && (
            <h2 className="text-3xl font-bold text-slate-800">
              {personalInfo.username}
            </h2>
          )}

          {personalInfo?.email && (
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <p className="text-sm font-medium">{personalInfo.email}</p>
            </div>
          )}
          
          {/* Status Messages */}
          {uploadStatus === 'success' && (
            <p className="text-sm text-emerald-600 font-medium animate-pulse">
              Profile photo updated successfully!
            </p>
          )}
          
          {uploadStatus === 'error' && (
            <p className="text-sm text-rose-600 font-medium">
              Upload failed. Please try again.
            </p>
          )}
          
          {/* Helper Text */}
          <p className="text-xs text-slate-400">
            Hover over banner or profile photo to edit • JPG, PNG up to 5MB (Profile) / 10MB (Banner)
          </p>
        </div>
      </div>




      {previewImage &&
          createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
              onClick={() => setPreviewImage(null)}
            >
              {/* Modal Card */}
              <div
                className="relative  rounded-2xl p-4 shadow-2xl"
                style={{
                  width: "min(90vw, 720px)",
                  height: "min(80vh, 480px)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-black text-white text-xl flex items-center justify-center shadow-lg hover:scale-110 transition"
                >
                  ✕
                </button>

                {/* Image */}
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>,
            document.body
          )}



    </div>
  );
};

export default ProfileImage;