const MENU = [
  { id: "personal", label: "Personal Info" },
  { id: "new", label: "Personal Info" },
  { id: "neow", label: "Personal Info" },
];

const ProfileTabs = ({ active, setActive }) => {
  return (
    <div className="
      flex gap-2 p-2
      bg-white/60 backdrop-blur-md
      border border-white/30
      rounded-xl shadow-sm
    ">
      {MENU.map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`
            flex-1 px-4 py-2 rounded-lg text-sm font-medium
            transition-all
            ${active === item.id
              ? "bg-black text-white shadow"
              : "text-gray-700 hover:bg-white/70"}
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
