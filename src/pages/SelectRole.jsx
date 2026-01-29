import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Wrench, 
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Star
} from "lucide-react";

const SelectRole = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mt-20">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Join Our Platform
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Choose how you want to experience our services. Each role offers unique benefits 
            and features tailored to your needs.
          </p>
        </header>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Customer Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200">
              {/* Icon & Badge */}
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                  Most Popular
                </span>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Register as Customer
              </h3>
              <p className="text-slate-600 mb-6">
                  Customize your dream PC by selecting every component your way. 
                  Control performance, budget, and upgrades with a smooth end-to-end experience.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700">Verified professionals</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700">Real-time tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700">Rating & reviews</span>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => navigate("/register/user")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                Get Started as Customer
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Worker Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-orange-200">
              {/* Icon & Badge */}
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Wrench className="w-8 h-8 text-orange-600" />
                </div>
                <span className="px-3 py-1 bg-orange-50 text-orange-700 text-sm font-semibold rounded-full">
                  Earn More
                </span>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Register as Worker
              </h3>
              <p className="text-slate-600 mb-6">
                Provide PC building and customization services to real customers. 
                Accept build requests, assemble systems, manage orders, and earn securely
                through the platform.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700">Secure payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700">Flexible schedule</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700">Build your portfolio</span>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => navigate("/register/worker")}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                Start Working Today
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-slate-500">
          <p className="text-sm">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;