import { useState } from "react";
import LeftPanel from "./LeftPanel";
import CenterPreview from "./CenterPreview";
import RightCart from "./RightPanel";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";


const componentData = {
  cpu: [
    { id: 1, name: "Ryzen 5 5600X", price: 15000 },
    { id: 2, name: "Intel i5 12400F", price: 17000 },
  ],
  ram: [
    { id: 3, name: "16GB DDR4 3200MHz", price: 6000 },
    { id: 4, name: "32GB DDR4 3600MHz", price: 11000 },
  ],
};



const BuildPC = () => {
    const navigate=useNavigate()
  const [activeCategory, setActiveCategory] = useState("cpu");
  const [build, setBuild] = useState({});

  const handleSelect = (category, item) => {
    setBuild((prev) => ({
      ...prev,
      [category]: item,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-8 text-white">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-cyan-400">
                Build Your PC
            </h1>

            <button
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
                aria-label="Close"
                onClick={()=>navigate('/')}
            >
                <X size={20} />
            </button>
        </div>
      

      <div className="grid grid-cols-12 gap-3">
        {/* LEFT */}
        <div className="col-span-3 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
          <LeftPanel
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            componentData={componentData}
            build={build}
            onSelect={handleSelect}
          />
        </div>

        {/* CENTER */}
        <div className="col-span-6 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
          <CenterPreview build={build} />
        </div>

        {/* RIGHT */}
        <div className="col-span-3 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
          <RightCart build={build} />
        </div>
      </div>
    </div>
  );
};

export default BuildPC;
