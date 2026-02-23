import { useState,useEffect } from "react";
import LeftPanel from "./LeftPanel";
import CenterPreview from "./CenterPreview";
import RightCart from "./RightPanel";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { fetchComponents } from "./redux/components/componentSlice";
import { addComponent } from "./redux/components/selectedBuildSlice";
import { removeComponent } from "./redux/components/selectedBuildSlice";
import { useMemo,useCallback  } from "react";
import PCBuilderLoader from "./PCBuilderLoader";
import ComponentModal from "./components/details modal/ComponentModal";

const BuildPC = () => { 

  const navigate=useNavigate()
  const [activeCategory, setActiveCategory] = useState("cpu");
  const dispatch = useDispatch();
  const build = useSelector((state) => state.build.selected);
  const {cpu,motherboard,ram,gpu,psu,storage,case: pcCase,casefan,cooler,loading,error,} = useSelector((state) => state.components);
  const isInitialLoading =loading && cpu.length === 0 && motherboard.length === 0 && ram.length === 0 && gpu.length === 0 && psu.length === 0 && storage.length === 0 && pcCase.length === 0 && casefan.length === 0 && cooler.length === 0;

  useEffect(() => {
      const map = {cpu,motherboard,ram,gpu,psu,storage,case: pcCase,casefan,cooler,};
      if (map[activeCategory]?.length === 0) {
        dispatch(fetchComponents(activeCategory));
      }
    }, [activeCategory, dispatch]);

  const componentData = useMemo(() => ({cpu,motherboard,ram,gpu,psu,storage,case: pcCase,casefan,cooler,}), [cpu, motherboard, ram, gpu, psu, storage, pcCase, casefan, cooler]);

  const handleSelect = useCallback((category, item) => {
      dispatch(addComponent({ category, item }));
    }, [dispatch]);


  const handleRemove = useCallback((category) => {
        dispatch(removeComponent(category));
      }, [dispatch]);

  if (isInitialLoading) return <PCBuilderLoader/>
  if (error) return <p className="text-red-500">{error}</p>;

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
            loading={loading}
          />
        </div>

        {/* CENTER */}
        <div className="col-span-6 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
          <CenterPreview build={build} />
        </div>

        {/* RIGHT */}
        <div className="col-span-3 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
          <RightCart build={build} onRemove={handleRemove} />
        </div>
      </div>

      <ComponentModal componentData={componentData} />
    </div>
  );
};

export default BuildPC;
