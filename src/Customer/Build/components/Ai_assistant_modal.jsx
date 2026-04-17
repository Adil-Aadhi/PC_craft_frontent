import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { aiApi } from "../../../api/axios";
import { 
  X, 
  Send, 
  Cpu, 
  Zap, 
  HardDrive, 
  Monitor, 
  DollarSign,
  RefreshCw,
  Info,
  AlertCircle,
  ChevronRight,
  Sparkles,
  MemoryStick,
  Fan,
  Box,
  Plug,
  CircuitBoard
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AiAssistantModal = ({ onClose }) => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const askAI = async () => {
    if (!question.trim()) return;
    try {
      setLoading(true);
      const res = await aiApi.post("chat", { question });
      setResponse(res.data.result);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const handleClear = () => {
    setResponse(null);
    setQuestion("");
    setLoading(false);
  };

  // Normalize: smart_build wraps data inside response.result
  // build returns data directly on response
  const isBuild = response?.type === "build" || response?.type === "smart_build";
  const buildData = response?.type === "smart_build" ? response?.result : response;
  const build = buildData?.build;
  const aiExplanation = buildData?.ai_explanation;

  const totalPrice = build
    ? Object.values(build).reduce((total, item) => {
        return total + (item?.price || 0);
      }, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/20 shadow-[0_0_40px_rgba(0,255,255,0.07),0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl max-h-[90vh]"
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                AI PC Assistant
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full font-normal">
                  Beta
                </span>
              </h2>
              <p className="text-sm text-gray-400">Ask me anything about PC builds, components, or gaming rigs</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-300 backdrop-blur-sm transition hover:bg-white/20 active:scale-95">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* Input */}
          <div className="relative mb-6">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Example: Build gaming PC under ₹1,00,000 or Best GPU for video editing"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-24 text-white placeholder-gray-500 backdrop-blur-md transition-all duration-200 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
            <button
              onClick={askAI}
              disabled={loading || !question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all duration-200"
            >
              {loading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /><span>Thinking...</span></>
              ) : (
                <><Send className="w-4 h-4" /><span>Ask</span></>
              )}
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 rounded bg-white/10 w-3/4"></div>
              <div className="h-4 rounded bg-white/10 w-1/2"></div>
              <div className="h-4 rounded bg-white/10 w-2/3"></div>
            </div>
          )}

          {/* Error */}
          {response?.error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{response.error}</p>
            </div>
          )}

          {/* Chat Response */}
          {response?.type === "chat" && !loading && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-gray-300 leading-relaxed">{response.answer}</div>
              </div>
            </div>
          )}

          {/* GPU Recommendations */}
          {response?.type === "gpu" && response.results && !loading && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-5 h-5 text-purple-400" />
                <h3 className="text-purple-400 font-semibold">GPU Recommendations</h3>
              </div>
              <div className="grid gap-3">
                {response.results.map((gpu, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-200 hover:border-purple-500/30 hover:bg-white/8 hover:shadow-[0_0_12px_rgba(168,85,247,0.12)]">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">{gpu.name}</h4>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Recommended</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />₹{gpu.price?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Monitor className="w-4 h-4" />{gpu.memory}GB</span>
                      <span className="flex items-center gap-1"><Cpu className="w-4 h-4" />{gpu.chipset}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CPU Recommendation */}
          {response?.type === "cpu" && response.results && !loading && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-blue-400" />
                <h3 className="text-blue-400 font-semibold">CPU Recommendation</h3>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-200 hover:border-blue-500/30 hover:shadow-[0_0_12px_rgba(59,130,246,0.12)]">
                <h4 className="text-white font-medium mb-3">{response.results.name}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-white/5 bg-white/5 p-2">
                    <p className="text-gray-500">Price</p>
                    <p className="text-white font-medium">₹{response.results.price?.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/5 p-2">
                    <p className="text-gray-500">Cores</p>
                    <p className="text-white font-medium">{response.results.cores}</p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/5 p-2 col-span-2">
                    <p className="text-gray-500">Socket</p>
                    <p className="text-white font-medium">{response.results.socket}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PC Build — handles both "build" and "smart_build" */}
          {isBuild && build && !loading && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-amber-400 font-semibold">Complete PC Build</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-400">Scroll to see all components ↓</p>
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1 backdrop-blur-md">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-sm text-amber-400 font-semibold">₹{totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700">
                  {Object.entries({
                    cpu: "CPU",
                    gpu: "GPU",
                    motherboard: "Motherboard",
                    ram: "RAM",
                    storage: "Storage",
                    psu: "Power Supply",
                    case: "Case",
                    cooler: "Cooler",
                    case_fans: "Case Fans"
                  }).map(([key, label]) =>
                    build[key] ? (
                      <div key={key} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all duration-200 hover:border-cyan-500/20 hover:bg-white/8 hover:shadow-[0_0_10px_rgba(0,255,255,0.07)]">
                        <div className="rounded-lg border border-white/10 bg-white/10 p-1.5">
                          {key === "cpu"        && <Cpu className="w-4 h-4 text-blue-400" />}
                          {key === "gpu"        && <Monitor className="w-4 h-4 text-purple-400" />}
                          {key === "motherboard"&& <CircuitBoard className="w-4 h-4 text-indigo-400" />}
                          {key === "ram"        && <MemoryStick className="w-4 h-4 text-green-400" />}
                          {key === "storage"    && <HardDrive className="w-4 h-4 text-yellow-400" />}
                          {key === "psu"        && <Plug className="w-4 h-4 text-orange-400" />}
                          {key === "case"       && <Box className="w-4 h-4 text-gray-400" />}
                          {key === "cooler"     && <Fan className="w-4 h-4 text-cyan-400" />}
                          {key === "case_fans"  && <Fan className="w-4 h-4 text-pink-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">{label}</p>
                          <p className="text-sm text-white">{build[key].name}</p>
                          <p className="text-xs text-gray-400">₹{build[key].price?.toLocaleString()}</p>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>

                {/* AI Explanation */}
                {aiExplanation && (
                  <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                    <p className="text-xs text-gray-400 italic leading-relaxed">{aiExplanation}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Suggestions */}
          {!response && !loading && (
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Best GPU for ₹50,000",
                  "Ryzen 5 vs Intel i5",
                  "PC build under ₹2,00,000",
                  "Best CPU for ₹40,000"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(suggestion)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 backdrop-blur-md transition-all duration-200 hover:border-cyan-500/30 hover:bg-white/10 hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-lg">
          <p className="text-xs text-gray-500">Powered by advanced AI • PC component recommendations</p>
          <div className="flex gap-2">
            {response && !loading && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm transition hover:bg-white/15 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                Clear
              </button>
            )}
            {/* Show "Build This PC" for both build types */}
            {isBuild && build && (
              <button
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all duration-200"
                onClick={() => {
                  navigate(
                    `/build?ai=true&cpu=${build.cpu?.id}&gpu=${build.gpu?.id}&motherboard=${build.motherboard?.id}&ram=${build.ram?.id}&storage=${build.storage?.id}&psu=${build.psu?.id}&case=${build.case?.id}&cooler=${build.cooler?.id}&casefan=${build.case_fans?.id}`
                  );
                  onClose();
                }}
              >
                <Zap className="w-4 h-4" />
                Build This PC
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm transition hover:bg-white/15 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AiAssistantModal;
