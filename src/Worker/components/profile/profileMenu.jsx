const MENU = [
  { id: "personal", label: "Personal Info" },
  { id: "work", label: "Profesional Info" },
  { id: "payment", label: "UPI" },
  { id: "security", label: "Security" },
];

const ProfileTabs = ({ active, setActive }) => {
  return (
    <div className="
      flex gap-1 p-2
      bg-white/70 backdrop-blur-md
      border border-gray-200/60
      rounded-2xl shadow-lg shadow-black/5
    ">
      {MENU.map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`
            relative flex-1 px-8 py-3 rounded-xl text-sm font-medium
            transition-all duration-300
            overflow-hidden group
            ${
              active === item.id
                ? "text-black"
                : "text-gray-500 hover:text-gray-900"
            }
          `}
        >
          {/* Background effect */}
          <span className={`
            absolute inset-0 rounded-xl transition-all duration-300
            ${active === item.id 
              ? "bg-gradient-to-b from-gray-100 to-gray-50" 
              : "opacity-0 group-hover:opacity-100 bg-gray-100/50"
            }
          `} />
          
          {/* Content */}
          <span className="relative flex items-center justify-center gap-2">
            {item.label}
          </span>

          {/* Underline animation */}
          <span className={`
            absolute bottom-2 left-1/2 -translate-x-1/2
            h-0.5 bg-black rounded-full
            transition-all duration-300
            ${active === item.id ? "w-8" : "w-0"}
          `} />
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
