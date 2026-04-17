import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LeftPanel from "./LeftPanel";
import RightCart from "./RightPanel";
import { Bot, ChevronUp, Package2, ShoppingCart, Wrench, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComponents, fetchComponentById } from "./redux/components/componentSlice";
import { addComponent, removeComponent, clearBuild } from "./redux/components/selectedBuildSlice";
import PCBuilderLoader from "./PCBuilderLoader";
import ComponentModal from "./components/details modal/ComponentModal";
import {
  addBuildToCart,
  updateBuild,
  clearEditingBuild,
  fetchCartItemById,
} from "./redux/components/cartSlice";
import AiAssistantModal from "./components/Ai_assistant_modal";
import PCScene from "./components/3dModal/PCScene";

const BuildPC = () => {
  const navigate = useNavigate();
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
  const aiInitialized = useRef(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  const [showPartsModal, setShowPartsModal] = useState(false);
  const [showCartSheet, setShowCartSheet] = useState(false);
  const [cartExpanded, setCartExpanded] = useState(false);

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

  const mappedPrice =
    priceFilter === "budget"
      ? "lt20"
      : priceFilter === "mid"
        ? "20to50"
        : priceFilter === "high"
          ? "gt50"
          : "";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setShowPartsModal(false);
      setShowCartSheet(false);
      setCartExpanded(false);
    }
  }, [isMobile]);

  // Body overflow lock removed — overlays are glassmorphic/transparent so
  // the 3D scene remains visible behind them on mobile.

  useEffect(() => {
    if (editId) {
      dispatch(clearBuild());
      dispatch(fetchCartItemById(editId));
    } else {
      dispatch(clearEditingBuild());
    }

    hasPrefilled.current = false;
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
      dispatch(clearEditingBuild());
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
    await handleSaveBuild();
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

  const componentData = useMemo(
    () => ({
      cpu,
      motherboard,
      ram,
      gpu,
      psu,
      storage,
      case: pcCase,
      casefan,
      cooler,
    }),
    [cpu, motherboard, ram, gpu, psu, storage, pcCase, casefan, cooler]
  );

  const activeData = componentData[activeCategory];
  const hasLoadedOnceRef = useRef(false);

  useEffect(() => {
    if (activeData?.items.length > 0) {
      hasLoadedOnceRef.current = true;
    }
  }, [activeData?.items.length]);

  const handleLoadMore = () => {
    const current = componentData[activeCategory];
    if (!current?.next) return;
    setPage((prev) => prev + 1);
  };

  const isInitialLoading =
    !hasLoadedOnceRef.current && activeData?.loading && activeData?.items.length === 0;

  const handleSelect = useCallback(
    (category, item) => {
      dispatch(addComponent({ category, item }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (category) => {
      dispatch(removeComponent(category));
    },
    [dispatch]
  );

  useEffect(() => {
    if (editingBuild && !hasPrefilled.current) {
      dispatch(clearBuild());

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
      hasPrefilled.current = true;
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
    const hasAIComponents = Object.values(aiComponents).some(Boolean);
    if (!hasAIComponents) return;

    const categories = [
      "cpu",
      "gpu",
      "motherboard",
      "ram",
      "storage",
      "psu",
      "case",
      "cooler",
      "casefan",
    ];

    categories.forEach((category) => {
      dispatch(
        fetchComponents({
          category,
          search: "",
          price: "",
          page: 1,
        })
      );
    });
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (aiInitialized.current) return;

    const hasAIComponents = Object.values(aiComponents).some(Boolean);
    if (!hasAIComponents) return;

    aiInitialized.current = true;
    dispatch(clearBuild());

    Object.entries(aiComponents).forEach(([category, id]) => {
      if (!id) return;

      const existing = componentData[category]?.items?.find((p) => p.id === Number(id));

      if (existing) {
        dispatch(addComponent({ category, item: existing }));
      } else {
        dispatch(fetchComponentById({ category, id }))
          .unwrap()
          .then((payload) => {
            dispatch(addComponent({ category, item: payload.item }));
          })
          .catch(console.error);
      }
    });
  }, [componentData, aiComponents, dispatch]);

  if (isInitialLoading) return <PCBuilderLoader />;
  if (error) return <p className="text-red-500">{error}</p>;

  const renderLeftPanel = () => (
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
  );

  const renderRightCart = () => (
    <RightCart
      build={build}
      onRemove={handleRemove}
      onSaveClick={() => setShowNameModal(true)}
    />
  );

  return (
    <div
      className={
        isMobile
          ? "h-screen overflow-hidden bg-black text-white"
          : "min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-8 text-white"
      }
    >
      {isMobile ? (
        <div className="relative h-screen w-full overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <PCScene build={build} sceneHeight="100vh" />
          </div>

          {/* ── Mobile: top-center glassmorphic floating controls ── */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
            {/* Header row – title left, reset+close right */}
            <div className="pointer-events-auto flex items-start justify-between gap-3 bg-gradient-to-b from-black/75 via-black/25 to-transparent px-4 pb-8 pt-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-300/70">
                  Mobile Builder
                </p>
                <h1 className="mt-2 text-2xl font-bold text-white">Build Your PC</h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetBuild}
                  className="rounded-2xl border border-red-400/25 bg-red-500/15 px-3 py-2 text-xs font-medium text-red-100 backdrop-blur-xl"
                >
                  Reset
                </button>
                <button
                  className="rounded-2xl border border-white/10 bg-white/10 p-2 text-gray-100 backdrop-blur-xl"
                  aria-label="Close"
                  onClick={handleCloseBuilder}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Floating action pill – top-center, glassmorphic */}
            <div className="pointer-events-auto mx-auto flex w-fit items-center gap-2 rounded-[28px] border border-white/10 bg-white/5 px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <button
                onClick={() => setShowPartsModal(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500/90 to-blue-500/90 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition-transform active:scale-95"
              >
                <Wrench className="h-4 w-4" />
                Select Parts
              </button>
              <button
                onClick={() => {
                  setShowCartSheet(true);
                  setCartExpanded(false);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500/90 to-cyan-500/90 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showPartsModal && (
              <>
                {/* Semi-transparent backdrop — 3D scene stays visible */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowPartsModal(false)}
                  className="absolute inset-0 z-30 bg-black/20 backdrop-blur-[2px]"
                />
                {/* Glassmorphic panel — slides from LEFT with fade */}
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 z-40 flex w-[88%] max-w-sm flex-col border-r border-white/10 bg-zinc-900/30 shadow-[4px_0_40px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-300/60">
                        Component Picker
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-white">Select Parts</h2>
                    </div>
                    <button
                      onClick={() => setShowPartsModal(false)}
                      className="rounded-2xl border border-white/10 bg-white/10 p-2 text-white"
                      aria-label="Close component selector"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-3">{renderLeftPanel()}</div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCartSheet && (
              <>
                {/* Light backdrop — 3D scene stays visible */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCartSheet(false)}
                  className="absolute inset-0 z-30 bg-black/15 backdrop-blur-[2px]"
                />
                {/* Glassmorphic cart sheet — slides from bottom with fade */}
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`absolute inset-x-0 bottom-0 z-40 overflow-hidden rounded-t-[32px] border border-white/10 bg-zinc-900/30 shadow-[0_-20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
                    cartExpanded ? "h-[90vh]" : "h-[38vh]"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <button
                      onClick={() => setCartExpanded((prev) => !prev)}
                      className="flex items-center gap-2 text-sm font-medium text-cyan-200"
                    >
                      <span className="mx-auto block h-1.5 w-12 rounded-full bg-white/20" />
                      <ChevronUp
                        className={`h-4 w-4 transition ${cartExpanded ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs text-slate-300">
                        <Package2 className="h-3.5 w-3.5" />
                        Build Summary
                      </span>
                      <button
                        onClick={() => setShowCartSheet(false)}
                        className="rounded-2xl border border-white/10 bg-white/10 p-2 text-white"
                        aria-label="Close cart"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="h-[calc(100%-4.25rem)] overflow-y-auto p-3">{renderRightCart()}</div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-cyan-400">Build Your PC</h1>

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
            <div className="col-span-3 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
              {renderLeftPanel()}
            </div>

            <div className="col-span-6 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
              <PCScene build={build} />
            </div>

            <div className="col-span-3 bg-gray-900/70 rounded-2xl border border-cyan-500/10">
              {renderRightCart()}
            </div>
          </div>
        </>
      )}

      <ComponentModal componentData={componentData} />

      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Name Your Build</h2>

            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="My Custom PC"
              className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white/50 outline-none focus:border-cyan-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNameModal(false)}
                className="rounded-lg bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveBuild}
                className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-700"
              >
                {cartLoading ? "Saving..." : "Save Build"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Save changes?</h2>

            <p className="mb-4 text-sm text-gray-400">
              You are editing a build. Do you want to save before leaving?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelExit}
                className="rounded-lg bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDontSave}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Don�t Save
              </button>

              <button
                onClick={handleSaveAndExit}
                className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-700"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowAiModal(true)}
        className={`fixed z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-rotate-3 hover:scale-110 hover:shadow-indigo-500/60 active:scale-95 ${
          isMobile ? "bottom-6 left-6" : "bottom-6 right-6"
        }`}
        aria-label="Open AI assistant"
      >
        <Bot size={22} strokeWidth={1.75} />
      </button>

      {showAiModal && <AiAssistantModal onClose={() => setShowAiModal(false)} />}
    </div>
  );
};

export default BuildPC;
