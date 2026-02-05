import ProfileImage from "./profileImage";
import PersonalInfo from "./profilePersonalInformation";

const ProfileOverview = () => {
  return (
    <div className="bg-white/60 backdrop-blur-md border rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Profile Overview
        </h2>
        <div className="mt-2 h-px bg-slate-200" />
      </div>

      <div className="flex flex-col gap-8">
        <ProfileImage />
        <div className="w-full">
          <PersonalInfo />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;

