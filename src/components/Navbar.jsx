import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Zap, Menu, X, ShoppingCart, User,BellDot,MessageCircle,MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginRequiredToast from "./LoginRequiredToast";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ variant = "dark" }) => {
  const { handleLogout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate=useNavigate()

  const {user}=useAuth();

  const userRef = useRef(null);
  const closeTimeout = useRef(null);

  const textSub =variant === "light" ? "text-black/70" : "text-gray-300";
  const textSubHover =variant === "light" ? "hover:text-black/90" : "hover:text-white";
  const textMain =variant === "light" ? "text-black" : "text-white";

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

  const handleBuildClick = () => {

    if (!user) {
      toast(<LoginRequiredToast />, {
        autoClose: false, // stays until action
        closeOnClick: false,
        toastId: "login-required",
        draggable: false,
      });
      return;
    }

    navigate("/build");
  };

  const HandleMessageClick=()=>{
      if (!user) {
      toast(<LoginRequiredToast />, {
        autoClose: false, // stays until action
        closeOnClick: false,
        toastId: "login-required",
        draggable: false,
      });
      return;
    }

    navigate("/chat");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
        <nav className="flex justify-center pointer-events-auto">
          <motion.div
            animate={{
              maxWidth: scrolled ? "1100px" : "1320px",
              height: scrolled ? "62px" : "80px",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="
              relative w-full mx-4
              backdrop-blur-2xl
              border border-cyan-500/25
              rounded-2xl
              shadow-[0_0_50px_rgba(34,211,238,0.18)]
              overflow-hidden
            "
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            <motion.div
              animate={{ scale: scrolled ? 0.96 : 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-full px-6 flex items-center justify-between"
            >
              {/* LOGO */}
              <Link to="/" className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-40" />
                  <Zap className="relative w-8 h-8 text-cyan-400" />
                </div>
                <span className={`text-2xl font-bold ${textMain}`}>
                  PC<span className="text-cyan-400">craft</span>
                </span>
              </Link>

              {/* MENU */}
              {/* <div className={`hidden md:flex gap-8 ${textSub}`}>
                <a className={`${textSubHover}`}>Build</a>
                <a className={`${textSubHover}`}>Components</a>
                <a className={`${textSubHover}`}>Gallery</a>
                <a className={`${textSubHover}`}>Support</a>
              </div> */}

              {/* ACTIONS */}
              <div className="flex items-center gap-4">
                <button onClick={HandleMessageClick}>
                  <MessageSquare className={`w-5 h-5 ${textSub} ${textSubHover}`} />
                </button>
                <ShoppingCart className={`w-5 h-5 ${textSub} ${textSubHover}`} />
                <BellDot className={`w-5 h-5 ${textSub} ${textSubHover}`} />

                <div
                  ref={userRef}
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                  className="hidden sm:flex"
                  onClick={()=>navigate('user/profile')}
                >
                  <User className={`w-5 h-5 ${textSub} ${textSubHover} cursor-pointer`} />
                </div>

                <button className="hidden sm:block px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold"
                  onClick={handleBuildClick}>
                  Build Now
                </button>

                

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-white"
                >
                  {mobileOpen ? <X /> : <Menu />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </nav>
      </header>

      {/* AUTH POPOVER */}
      {authOpen && (
        <div
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
          style={{ top: menuPos.top, left: menuPos.left }}
          className="
            fixed z-[9999] w-40
            bg-gradient-to-br from-white/10 via-white/5 to-transparent
            backdrop-blur-2xl
            border border-cyan-400/30
            rounded-xl
            shadow-[0_20px_60px_rgba(34,211,238,0.25)]
            ring-1 ring-white/10
            overflow-hidden
          "
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {!user ? (
                <div className={`relative ${textMain}`}>
                  <Link to="/login" className="block px-4 py-3  hover:bg-cyan-500/15">
                    Login
                  </Link>
                  <Link to="/register" className="block px-4 py-3 hover:bg-cyan-500/15">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <>
                  <div className={`px-4 py-2 text-xs ${textSub}`}>
                    {user.email}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-1 hover:bg-red-500/20 text-red-400"
                  >
                    Logout
                  </button>
                </>
              )}
        </div>
      )}
    </>
  );
};

export default Navbar;