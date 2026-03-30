import { useState, useEffect } from "react";
import LeftPanel from "./LeftPanel";
import CenterPreview from "./CenterPreview";
import RightCart from "./RightPanel";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComponents, fetchComponentById } from "./redux/components/componentSlice";
import { addComponent } from "./redux/components/selectedBuildSlice";
import { removeComponent, clearBuild } from "./redux/components/selectedBuildSlice";
import { useMemo, useCallback } from "react";
import PCBuilderLoader from "./PCBuilderLoader";
import ComponentModal from "./components/details modal/ComponentModal";
import { addBuildToCart } from "./redux/components/cartSlice";
import { updateBuild, clearEditingBuild, fetchCartItemById } from "./redux/components/cartSlice";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";
import { Bot } from "lucide-react";
import AiAssistantModal from "./components/Ai_assistant_modal";
import PCScene from "./components/3dModal/PCScene";

const BuildPC = () => {

  const navigate = useNavigate()
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [activeCategory, setActiveCategory] = useState("case");
  const dispatch = useDispatch();
  const build = useSelector((state) => state.build.selected);
  const componentsState = useSelector((state) => state.components);
  const error = componentsState.error;
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const aiInitialized = useRef(false)

  const cpu = componentsState.cpu;
  const motherboard = componentsState.motherboard;
  const ram = componentsState.ram;
  const gpu = componentsState.gpu;
  const psu = componentsState.psu;
  const storage = componentsState.storage;
  const pcCase = componentsState.case;
  const casefan = componentsState.casefan;
  const cooler = componentsState.cooler;



  const { loading: cartLoading, editingBuild } = useSelector((state) => state.cart);
  const hasPrefilled = useRef(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [buildName, setBuildName] = useState("My Custom PC");

  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const isAI = searchParams.get("ai");

  const mappedPrice =
    priceFilter === "budget"
      ? "lt20"
      : priceFilter === "mid"
        ? "20to50"
        : priceFilter === "high"
          ? "gt50"
          : "";

  useEffect(() => {
    if (editId) {
      dispatch(clearBuild());              // 🔥 clear old selections
      dispatch(fetchCartItemById(editId)); // 🔥 fetch build
    } else {
      dispatch(clearEditingBuild());
      // dispatch(clearBuild());              // new build mode
    }

    hasPrefilled.current = false;          // reset flag when editId changes
  }, [editId, dispatch]);

  const handleSaveBuild = async () => {
    const payload = {
      build_name: buildName || "My Custom PC",
      cpu: build.cpu?.id,
      motherboard: build.motherboard?.id,
      ram: build.ram?.id,
      gpu: build.gpu?.id,
      psu: build.psu?.id,
      cooler: build.cooler?.id,
      storage: build.storage?.id,
      case: build.case?.id,
      case_fan: build.casefan?.id,
    };

    let resultAction;

    if (editId) {
      resultAction = await dispatch(updateBuild({ id: editId, data: payload }));
    } else {
      resultAction = await dispatch(addBuildToCart(payload));
    }

    if (
      addBuildToCart.fulfilled.match(resultAction) ||
      updateBuild.fulfilled.match(resultAction)
    ) {
      dispatch(clearEditingBuild()); // exit edit mode
      navigate("/cart");
    }
  };

  const handleCloseBuilder = () => {
    if (editId) {
      setPendingNavigation("/");
      setShowExitModal(true);
    } else {
      navigate("/");
    }
  };

  const handleSaveAndExit = async () => {
    await handleSaveBuild(); // uses your existing save
  };

  const handleDontSave = () => {
    dispatch(clearEditingBuild());
    dispatch(clearBuild());
    setShowExitModal(false);
    if (pendingNavigation) navigate(pendingNavigation);
  };

  const handleResetBuild = () => {
    dispatch(clearBuild());
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  useEffect(() => {
    setPage(1);
  }, [activeCategory, debouncedSearch, mappedPrice]);

  useEffect(() => {
    dispatch(
      fetchComponents({
        category: activeCategory,
        search: debouncedSearch,
        price: mappedPrice,
        page,
      })
    );
  }, [activeCategory, debouncedSearch, mappedPrice, page, dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const componentData = useMemo(() => ({ cpu, motherboard, ram, gpu, psu, storage, case: pcCase, casefan, cooler, }), [cpu, motherboard, ram, gpu, psu, storage, pcCase, casefan, cooler]);
  const activeData = componentData[activeCategory];

  useEffect(() => {
    if (activeData?.items.length > 0) {
      hasLoadedOnceRef.current = true;
    }
  }, [activeData?.items.length]);

  const handleLoadMore = () => {
    const current = componentData[activeCategory];

    if (!current?.next) return;

    setPage(prev => prev + 1);
  };
  const hasLoadedOnceRef = useRef(false);

  const isInitialLoading =
    !hasLoadedOnceRef.current &&
    activeData?.loading &&
    activeData?.items.length === 0;

  const handleSelect = useCallback((category, item) => {
    dispatch(addComponent({ category, item }));
  }, [dispatch]);


  const handleRemove = useCallback((category) => {
    dispatch(removeComponent(category));
  }, [dispatch]);

  useEffect(() => {
    if (editingBuild && !hasPrefilled.current) {
      dispatch(clearBuild()); // safety clear

      const map = {
        cpu: editingBuild.cpu,
        motherboard: editingBuild.motherboard,
        ram: editingBuild.ram,
        gpu: editingBuild.gpu,
        psu: editingBuild.psu,
        cooler: editingBuild.cooler,
        storage: editingBuild.storage,
        case: editingBuild.case,
        casefan: editingBuild.case_fan,
      };

      Object.entries(map).forEach(([category, item]) => {
        if (item) {
          dispatch(addComponent({ category, item }));
        }
      });

      setBuildName(editingBuild.build_name || "My Custom PC");

      hasPrefilled.current = true; // prevent double run
    }
  }, [editingBuild, dispatch]);


  const aiComponents = {
    cpu: searchParams.get("cpu"),
    gpu: searchParams.get("gpu"),
    motherboard: searchParams.get("motherboard"),
    ram: searchParams.get("ram"),
    storage: searchParams.get("storage"),
    psu: searchParams.get("psu"),
    case: searchParams.get("case"),
    cooler: searchParams.get("cooler"),
    casefan: searchParams.get("casefan"),
  };

  useEffect(() => {

    const hasAIComponents = Object.values(aiComponents).some(Boolean)
    if (!hasAIComponents) return

    const categories = [
      "cpu",
      "gpu",
      "motherboard",
      "ram",
      "storage",
      "psu",
      "case",
      "cooler",
      "casefan"
    ]

    categories.forEach(category => {
      dispatch(fetchComponents({
        category,
        search: "",
        price: "",
        page: 1
      }))
    })

  }, [searchParams])

  useEffect(() => {

    if (aiInitialized.current) return

    const hasAIComponents = Object.values(aiComponents).some(Boolean)
    if (!hasAIComponents) return

    aiInitialized.current = true

    dispatch(clearBuild())

    Object.entries(aiComponents).forEach(([category, id]) => {

      if (!id) return

      const existing = componentData[category]?.items?.find(
        p => p.id === Number(id)
      )

      if (existing) {
        dispatch(addComponent({ category, item: existing }))
      } else {
        dispatch(fetchComponentById({ category, id }))
          .unwrap()
          .then((payload) => {
            dispatch(addComponent({ category, item: payload.item }))
          })
          .catch(console.error)
      }

    })

  }, [componentData])

  if (isInitialLoading) return <PCBuilderLoader />
  if (error) return <p className="text-red-500">{error}</p>;



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cyan-400">
          Build Your PC
        </h1>

        <div className="flex items-center gap-2">
          
          <button
            onClick={handleResetBuild}
            className="px-3 py-1.5 text-sm bg-red-600/80 hover:bg-red-600 rounded-lg text-white transition"
          >
            Reset Build
          </button>

          <button
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
            aria-label="Close"
            onClick={handleCloseBuilder}
          >
            <X size={20} />
          </button>

        </div>
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
            loading={componentData[activeCategory]?.loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            onLoadMore={handleLoadMore}
          />
        </div>

        {/* CENTER */}
        {/* <div className="col-span-6 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
          <CenterPreview build={build} />
        </div> */}
        <div className="col-span-6 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
          <PCScene  build={build}/>
        </div>

        {/* RIGHT */}
        <div className="col-span-3 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
          <RightCart build={build} onRemove={handleRemove} onSaveClick={() => setShowNameModal(true)} />
        </div>
      </div>

      <ComponentModal componentData={componentData} />
      {showNameModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4 text-white">
              Name Your Build
            </h2>

            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="My Custom PC"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white/50 mb-4 outline-none focus:border-cyan-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNameModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveBuild}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
              >
                {cartLoading ? "Saving..." : "Save Build"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md">

            <h2 className="text-lg font-semibold mb-2 text-white">
              Save changes?
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              You are editing a build. Do you want to save before leaving?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelExit}
                className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDontSave}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Don’t Save
              </button>

              <button
                onClick={handleSaveAndExit}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AI BOT ICON */}
      <button
        onClick={() => setShowAiModal(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/60 hover:scale-110 hover:-rotate-3 active:scale-95 transition-all duration-200 flex items-center justify-center"
        aria-label="Open AI assistant"
      >
        <Bot size={22} strokeWidth={1.75} />
      </button>

      {/* AI MODAL */}
      {showAiModal && (
        <AiAssistantModal onClose={() => setShowAiModal(false)} />
      )}
    </div>
  );
};

export default BuildPC;