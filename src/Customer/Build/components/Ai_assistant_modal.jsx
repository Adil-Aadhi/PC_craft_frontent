import { useState } from "react";
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
  Cpu as CpuIcon,
  Gpu as GpuIcon,
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

  const navigate=useNavigate()

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const totalPrice = response?.build
  ? Object.values(response.build).reduce((total, item) => {
      return total + (item?.price || 0);
    }, 0)
  : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
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
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Input Area */}
          <div className="relative mb-6">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Example: Build gaming PC under ₹1,00,000 or Best GPU for video editing"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pr-24 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            />
            <button
              onClick={askAI}
              disabled={loading || !question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all duration-200"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask</span>
                </>
              )}
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              <div className="h-4 bg-gray-800 rounded w-2/3"></div>
            </div>
          )}

          {/* Error Message */}
          {response?.error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{response.error}</p>
            </div>
          )}

          {/* Chat Response */}
          {response?.type === "chat" && !loading && (
            <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-gray-300 leading-relaxed">
                  {response.answer}
                </div>
              </div>
            </div>
          )}

          {/* GPU Recommendations */}
          {response?.type === "gpu" && response.results && !loading && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <GpuIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-purple-400 font-semibold">GPU Recommendations</h3>
              </div>
              <div className="grid gap-3">
                {response.results.map((gpu, i) => (
                  <div key={i} className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">{gpu.name}</h4>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        Recommended
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{gpu.price}
                      </span>
                      <span className="flex items-center gap-1">
                        <Monitor className="w-4 h-4" />
                        {gpu.memory}GB
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-4 h-4" />
                        {gpu.chipset}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CPU Recommendations */}
          {response?.type === "cpu" && response.results && !loading && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <CpuIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-blue-400 font-semibold">CPU Recommendation</h3>
              </div>
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-200">
                <h4 className="text-white font-medium mb-3">{response.results.name}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <p className="text-gray-500">Price</p>
                    <p className="text-white font-medium">₹{response.results.price}</p>
                  </div>
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <p className="text-gray-500">Cores</p>
                    <p className="text-white font-medium">{response.results.cores}</p>
                  </div>
                  <div className="p-2 bg-gray-800 rounded-lg col-span-2">
                    <p className="text-gray-500">Socket</p>
                    <p className="text-white font-medium">{response.results.socket}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PC Build */}
          {response?.type === "build" && response.build && !loading && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-amber-400 font-semibold">Complete PC Build</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-400">
                    Scroll to see all components ↓
                  </p>

                  <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-sm text-amber-400 font-semibold">
                      ₹{totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* Components Grid */}
                <div className="grid gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700">
                  {Object.entries({
                    cpu: 'CPU',
                    gpu: 'GPU',
                    motherboard: 'Motherboard',
                    ram: 'RAM',
                    storage: 'Storage',
                    psu: 'Power Supply',
                    case: 'Case',
                    cooler: 'Cooler',
                    case_fans: 'Case Fans'
                  }).map(([key, label]) => (
                    response.build[key] && (
                      <div key={key} className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 flex items-start gap-3 hover:bg-gray-800/50 transition-all duration-200">
                        <div className="p-1.5 bg-gray-700 rounded-lg">
                          {key === 'cpu' && <CpuIcon className="w-4 h-4 text-blue-400" />}
                          {key === 'gpu' && <GpuIcon className="w-4 h-4 text-purple-400" />}
                          {key === 'motherboard' && <CircuitBoard className="w-4 h-4 text-indigo-400" />}
                          {key === 'ram' && <MemoryStick className="w-4 h-4 text-green-400" />}
                          {key === 'storage' && <HardDrive className="w-4 h-4 text-yellow-400" />}
                          {key === 'psu' && <Plug className="w-4 h-4 text-orange-400" />}
                          {key === 'case' && <Box className="w-4 h-4 text-gray-400" />}
                          {key === 'cooler' && <Fan className="w-4 h-4 text-cyan-400" />}
                          {key === 'case_fans' && <Fan className="w-4 h-4 text-pink-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">{label}</p>
                          <p className="text-sm text-white">{response.build[key].name}</p>
                          <p className="text-xs text-gray-400">
                            ₹{response.build[key].price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* AI Explanation */}
                {response.ai_explanation && (
                  <div className="mt-4 p-3 bg-gray-800/20 border border-gray-700 rounded-lg">
                    <p className="text-xs text-gray-400 italic leading-relaxed">
                      {response.ai_explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Suggestions (shown when no response) */}
          {!response && !loading && (
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Best GPU for ₹50,000",
                  "Ryzen 5 vs Intel i5",
                  "PC build under ₹2,00,000",
                  "Budget gaming PC"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(suggestion)}
                    className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400 hover:text-white transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-gray-900/50">
          <p className="text-xs text-gray-500">
            Powered by advanced AI • PC component recommendations
          </p>
          <div className="flex gap-2">
            {response?.type === "build" && response.build && (
              <button
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-all duration-200"
                onClick={() => {
                      const build = response.build

                      navigate(
                        `/build?ai=true&cpu=${build.cpu?.id}&gpu=${build.gpu?.id}&motherboard=${build.motherboard?.id}&ram=${build.ram?.id}&storage=${build.storage?.id}&psu=${build.psu?.id}&case=${build.case?.id}&cooler=${build.cooler?.id}&casefan=${build.case_fans?.id}`
                      )

                      onClose()
                    }}
              >
                <Zap className="w-4 h-4" />
                Build This PC
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm font-medium transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantModal;