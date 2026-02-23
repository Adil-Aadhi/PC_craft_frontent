
export const SpecGrid = ({ children }) => (
  <div className="grid grid-cols-2 gap-4 text-sm">
    {children}
  </div>
);

export const SpecItem = ({ label, value }) => (
  <div className="bg-zinc-800 p-3 rounded-lg">
    <p className="text-zinc-400 text-xs">{label}</p>
    <p className="font-medium text-white">{value}</p>
  </div>
);