import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Menu,
  X,
  ShoppingCart,
  User,
  BellDot,
  MessageSquare,
  BoxIcon,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginRequiredToast from "./LoginRequiredToast";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "../Admin/components/AdminLogoutModal";

const Navbar = ({ variant = "dark" }) => {
  const { handleLogout, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const userRef = useRef(null);
  const closeTimeout = useRef(null);

  const textSub = variant === "light" ? "text-black/70" : "text-gray-300";
  const textSubHover = variant === "light" ? "hover:text-black/90" : "hover:text-white";
  const textMain = variant === "light" ? "text-black" : "text-white";

  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const openMenu = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);

    if (userRef.current) {
      const rect = userRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 10,
        left: rect.right - 160,
      });
    }

    setAuthOpen(true);
  };

  const closeMenu = () => {
    closeTimeout.current = setTimeout(() => {
      setAuthOpen(false);
    }, 150);
  };

  const requireAuth = (callback) => {
    if (!user) {
      toast(<LoginRequiredToast />, {
        autoClose: false,
        closeOnClick: false,
        toastId: "login-required",
        draggable: false,
      });
      return false;
    }

    callback();
    return true;
  };

  const handleBuildClick = () => {
    requireAuth(() => navigate("/build"));
  };

  const HandleMessageClick = () => {
    requireAuth(() => navigate("/chat"));
  };

  const HandleCartClick = () => {
    requireAuth(() => navigate("/cart"));
  };

  const handleMobileItemClick = (action) => {
    setMobileOpen(false);
    action();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const mobileMenuItems = user
    ? [
        {
          label: "Messages",
          icon: MessageSquare,
          action: () => navigate("/chat"),
        },
        {
          label: "Cart",
          icon: ShoppingCart,
          action: () => navigate("/cart"),
        },
        {
          label: "Notifications",
          icon: BellDot,
          action: () => navigate("/user/notifications"),
        },
        {
          label: "Orders",
          icon: BoxIcon,
          action: () => navigate("/user/orders"),
        },
        {
          label: "Profile",
          icon: User,
          action: () => navigate("/user/profile"),
        },
        {
          label: "Logout",
          icon: LogOut,
          danger: true,
          action: () => setLogoutOpen(true),
        },
      ]
    : [
        {
          label: "Messages",
          icon: MessageSquare,
          action: HandleMessageClick,
        },
        {
          label: "Cart",
          icon: ShoppingCart,
          action: HandleCartClick,
        },
        {
          label: "Notifications",
          icon: BellDot,
          action: () => navigate("/user/notifications"),
        },
        {
          label: "Orders",
          icon: BoxIcon,
          action: () => navigate("/user/orders"),
        },
        {
          label: "Login",
          icon: LogIn,
          action: () => navigate("/login"),
        },
        {
          label: "Sign Up",
          icon: UserPlus,
          action: () => navigate("/register"),
        },
      ];

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
        <nav className="flex justify-center pointer-events-auto">
          <motion.div
            animate={{
              maxWidth: scrolled ? "1100px" : "1320px",
              height: scrolled ? "62px" : "80px",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full mx-4 backdrop-blur-2xl border border-cyan-500/25 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.18)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            <motion.div
              animate={{ scale: scrolled ? 0.96 : 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-full px-4 sm:px-6 flex items-center justify-between gap-3"
            >
              <Link to="/" className="flex items-center gap-3 cursor-pointer min-w-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-40" />
                  <Zap className="relative w-8 h-8 text-cyan-400" />
                </div>
                <span className={`text-xl sm:text-2xl font-bold ${textMain} truncate`}>
                  PC<span className="text-cyan-400">craft</span>
                </span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-4">
                <button className="hidden sm:block" onClick={HandleMessageClick}>
                  <MessageSquare className={`w-5 h-5 ${textSub} ${textSubHover}`} />
                </button>
                <button className="hidden sm:block" onClick={HandleCartClick}>
                  <ShoppingCart className={`w-5 h-5 ${textSub} ${textSubHover}`} />
                </button>
                <button className="hidden sm:block" onClick={() => navigate("/user/notifications")}>
                  <BellDot className={`w-5 h-5 ${textSub} ${textSubHover}`} />
                </button>
                <button className="hidden md:block" onClick={() => navigate("/user/orders")}>
                  <BoxIcon className={`w-5 h-5 ${textSub} ${textSubHover}`} />
                </button>

                <div className="flex items-center gap-1.5 sm:hidden">
                  <button
                    onClick={HandleMessageClick}
                    className={`flex h-9 w-9 items-center justify-center rounded-2xl border transition ${variant === "light" ? "border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100" : "border-white/10 bg-white/10 text-slate-100 hover:bg-white/15"}`}
                    aria-label="Messages"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={HandleCartClick}
                    className={`flex h-9 w-9 items-center justify-center rounded-2xl border transition ${variant === "light" ? "border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100" : "border-white/10 bg-white/10 text-slate-100 hover:bg-white/15"}`}
                    aria-label="Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleBuildClick}
                    className="flex h-9 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-2.5 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.22)]"
                    aria-label="Build now"
                  >
                    Build Now
                  </button>
                </div>

                <div
                  ref={userRef}
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                  className="hidden sm:flex"
                  onClick={() => navigate("user/profile")}
                >
                  <User className={`w-5 h-5 ${textSub} ${textSubHover} cursor-pointer`} />
                </div>

                <button
                  className="hidden sm:block px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold"
                  onClick={handleBuildClick}
                >
                  Build Now
                </button>

                <button
                  onClick={() => setMobileOpen((prev) => !prev)}
                  className={`md:hidden ${variant === "light" ? "text-slate-900" : "text-white"}`}
                  aria-label="Open mobile menu"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? <X /> : <Menu />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-[2px] md:hidden"
              aria-label="Close mobile menu"
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-4 right-4 top-24 z-[80] rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(8,47,73,0.85))] p-3 shadow-[0_30px_80px_rgba(8,145,178,0.22)] backdrop-blur-2xl ring-1 ring-white/10 md:hidden"
            >
              <div className="mb-3 flex items-center justify-between px-2 pt-1">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/70">Quick Menu</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Navigation</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-slate-100"
                  aria-label="Close mobile menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {mobileMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleMobileItemClick(item.action)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        item.danger
                          ? "border-red-400/20 bg-red-500/10 text-red-300 hover:bg-red-500/15"
                          : "border-white/10 bg-white/8 text-slate-100 hover:bg-white/12"
                      }`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.danger ? "bg-red-500/15" : "bg-cyan-400/10 text-cyan-200"}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {authOpen && (
        <div
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
          style={{ top: menuPos.top, left: menuPos.left }}
          className="fixed z-[9999] w-40 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-cyan-400/30 rounded-xl shadow-[0_20px_60px_rgba(34,211,238,0.25)] ring-1 ring-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {!user ? (
            <div className={`relative ${textMain}`}>
              <Link to="/login" className="block px-4 py-3 hover:bg-cyan-500/15">
                Login
              </Link>
              <Link to="/register" className="block px-4 py-3 hover:bg-cyan-500/15">
                Sign Up
              </Link>
            </div>
          ) : (
            <>
              <div className={`px-4 py-2 text-xs ${textSub}`}>{user.email}</div>

              <button
                onClick={() => setLogoutOpen(true)}
                className="w-full text-left px-4 py-1 hover:bg-red-500/20 text-red-400"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      <LogoutModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;
