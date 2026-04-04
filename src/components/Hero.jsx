import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import PCModel from "./PCModel";
import LoginRequiredToast from "./LoginRequiredToast";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SECTIONS = [
  {
    badge: "Premium Custom PC Builder",
    heading: "Build Your Ultimate Gaming PC",
    body: "Hand-picked components, zero bottlenecks, expert cable management and guaranteed peak performance.",
  },
  {
    badge: "Top-Tier Components",
    heading: "Only the Best Parts Make the Cut",
    body: "We source exclusively from Intel, AMD, NVIDIA, Corsair, and more.",
  },
  {
    badge: "Expert Assembly",
    heading: "Assembled by Technicians, Not Robots",
    body: "Professionally cable-managed and stress-tested by our engineers.",
  },
  {
    badge: "Warranty & Delivery",
    heading: "Protected, Delivered Anywhere",
    body: "3-year warranty and PAN-India delivery with insurance.",
  },
];

const TIMELINE = [
  { progress: 0.00, section: 0, textSide: "left" },
  { progress: 0.25, section: 1, textSide: "right" },
  { progress: 0.50, section: 2, textSide: "left" },
  { progress: 0.75, section: 3, textSide: "left" },
];

function TextPanel({ section, side }) {
  const isRight = side === "right";
  const initialX = isRight ? 80 : -80;

  return (
    <motion.div
      key={section.heading}
      initial={{ opacity: 0, x: initialX, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -initialX, filter: "blur(10px)" }}
      transition={{ duration: 0.7 }}
      className={`absolute top-0 h-full flex flex-col justify-center px-16 w-[45%]
      ${isRight ? "right-0" : "left-0"}`}
    >
      <div className="text-cyan-400 text-sm mb-4">{section.badge}</div>
      <h1 className="text-5xl font-bold leading-tight">{section.heading}</h1>
      <p className="mt-4 text-gray-400 max-w-md">{section.body}</p>
    </motion.div>
  );
}

const KEYFRAMES = `
  @keyframes orb-drift-1 {
    0%   { transform: translate(0px,   0px) scale(1);    }
    33%  { transform: translate(40px, -30px) scale(1.08); }
    66%  { transform: translate(-20px, 20px) scale(0.95); }
    100% { transform: translate(0px,   0px) scale(1);    }
  }
  @keyframes orb-drift-2 {
    0%   { transform: translate(0px,   0px) scale(1);    }
    40%  { transform: translate(-50px, 30px) scale(1.12); }
    75%  { transform: translate(25px, -15px) scale(0.92); }
    100% { transform: translate(0px,   0px) scale(1);    }
  }
  @keyframes orb-drift-3 {
    0%   { transform: translate(0px,  0px) scale(1);   }
    50%  { transform: translate(30px, 40px) scale(1.06); }
    100% { transform: translate(0px,  0px) scale(1);   }
  }

  @keyframes grid-pulse {
    0%, 100% { opacity: 0.035; }
    50%       { opacity: 0.07;  }
  }
  @keyframes flicker {
    0%, 100% { opacity: 1;    }
    92%       { opacity: 1;    }
    93%       { opacity: 0.65; }
    94%       { opacity: 1;    }
    96%       { opacity: 0.8;  }
    97%       { opacity: 1;    }
  }
  @keyframes neon-border-spin {
    0%   { background-position: 0% 50%;   }
    100% { background-position: 300% 50%; }
  }
  @keyframes btn-glow-pulse {
    0%, 100% { box-shadow: 0 0 10px 2px rgba(34,211,238,0.4),  0 0 28px 5px rgba(34,211,238,0.12); }
    50%       { box-shadow: 0 0 20px 4px rgba(34,211,238,0.65), 0 0 50px 10px rgba(34,211,238,0.22); }
  }
  @keyframes cta-enter {
    0%   { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(8px); }
    100% { opacity: 1; transform: translateY(0px)  scale(1);    filter: blur(0px); }
  }
`;

export default function Hero() {
  const containerRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [activeSection, setActiveSection] = useState(0);
  const [textSide, setTextSide] = useState("left");
  const [showCTA, setShowCTA] = useState(false);
  const [hideText, setHideText] = useState(false);
  const ctaTimerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const navigate=useNavigate()
  const {user}=useAuth();

  // ── all useTransform calls hoisted here (Rules of Hooks) ──
  const pillLeft        = useTransform(scrollYProgress, [0, 1], ["0px", "98px"]);
  const trackFillWidth  = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const counterOpacity  = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      scrollProgressRef.current = v;
      let current = TIMELINE[0];
      for (let i = 0; i < TIMELINE.length; i++) {
        if (v >= TIMELINE[i].progress) current = TIMELINE[i];
      }
      setActiveSection(current.section);
      setTextSide(current.textSide);

      if (v >= 0.8) {
        // start 5s timer only once
        if (!ctaTimerRef.current) {
          ctaTimerRef.current = setTimeout(() => {
            setHideText(true);
            setShowCTA(true);
          }, 1000);
        }
      } else {
        // scrolled back up — cancel timer, reset everything
        if (ctaTimerRef.current) {
          clearTimeout(ctaTimerRef.current);
          ctaTimerRef.current = null;
        }
        setShowCTA(false);
        setHideText(false);
      }
    });
    return () => {
      unsubscribe();
      if (ctaTimerRef.current) clearTimeout(ctaTimerRef.current);
    };
  }, [scrollYProgress]);

  const section = SECTIONS[activeSection];

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

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${TIMELINE.length * 100}vh` }}
      >
        <div
          className="sticky top-0 h-screen text-white overflow-hidden"
          style={{ background: "#05080f" }}
        >

          {/* ── LAYER 0: dot grid — dots only, no lines ── */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(34,211,238,0.12) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            animation: "grid-pulse 7s ease-in-out infinite",
            zIndex: 0,
          }} />

          {/* ── LAYER 0b: perspective floor grid ── */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "52%",
            backgroundImage: `
              repeating-linear-gradient(to bottom, transparent, transparent 58px, rgba(34,211,238,0.07) 58.5px, transparent 59px),
              repeating-linear-gradient(to right,  transparent, transparent 58px, rgba(34,211,238,0.04) 58.5px, transparent 59px)
            `,
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            transform: "perspective(480px) rotateX(38deg)",
            transformOrigin: "bottom center",
            zIndex: 0,
          }} />

          {/* ── LAYER 1: drifting neon orbs ── */}

          {/* Cyan — top-right */}
          <div style={{
            position: "absolute", top: "-10%", right: "5%",
            width: "55vw", height: "55vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(34,211,238,0.07) 45%, transparent 70%)",
            filter: "blur(55px)",
            animation: "orb-drift-1 18s ease-in-out infinite",
            zIndex: 1,
          }} />

          {/* Green — bottom-left */}
          <div style={{
            position: "absolute", bottom: "-15%", left: "-5%",
            width: "50vw", height: "50vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(52,211,153,0.18) 0%, rgba(52,211,153,0.05) 45%, transparent 70%)",
            filter: "blur(65px)",
            animation: "orb-drift-2 22s ease-in-out infinite",
            zIndex: 1,
          }} />

          {/* Indigo — center-left */}
          <div style={{
            position: "absolute", top: "30%", left: "8%",
            width: "35vw", height: "35vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.04) 50%, transparent 70%)",
            filter: "blur(50px)",
            animation: "orb-drift-3 14s ease-in-out infinite",
            zIndex: 1,
          }} />

          {/* ── LAYER 2: floor neon puddle ── */}
          <div style={{
            position: "absolute", bottom: "-60px", left: "50%",
            transform: "translateX(-50%)",
            width: "80%", height: "300px",
            background: "radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.24) 0%, rgba(34,211,238,0.08) 35%, transparent 65%)",
            filter: "blur(28px)",
            zIndex: 2,
          }} />
          <div style={{
            position: "absolute", bottom: "-40px", right: "16%",
            width: "36%", height: "200px",
            background: "radial-gradient(ellipse at 50% 100%, rgba(52,211,153,0.16) 0%, rgba(52,211,153,0.05) 50%, transparent 70%)",
            filter: "blur(36px)",
            zIndex: 2,
          }} />

          {/* ── LAYER 3: sharp neon edge lines ── */}



          {/* top horizontal line */}
          <div style={{
            position: "absolute", top: "8%", left: "50%",
            transform: "translateX(-50%)",
            width: "40%", height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 30%, rgba(99,102,241,0.7) 50%, rgba(99,102,241,0.4) 70%, transparent 100%)",
            boxShadow: "0 0 10px 2px rgba(99,102,241,0.3)",
            animation: "flicker 13s ease-in-out infinite 4s",
            zIndex: 3,
          }} />







          {/* ── LAYER 5: radial vignette ── */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(5,8,15,0.82) 100%)",
            pointerEvents: "none",
            zIndex: 5,
          }} />

          {/* ── 3D CANVAS ── */}
          <div className="absolute inset-0" style={{ zIndex: 6 }}>
            <PCModel scrollProgress={scrollProgressRef} />
          </div>

          {/* ── GLASSMORPHIC PANEL — frosted blur behind text ── */}
          <AnimatePresence>
          {!hideText && (
          <motion.div
            animate={{
              left:  textSide === "left"  ? "0%"  : "auto",
              right: textSide === "right" ? "0%"  : "auto",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              width: "48%",
              backdropFilter: "blur(28px) saturate(140%) brightness(0.75)",
              WebkitBackdropFilter: "blur(28px) saturate(140%) brightness(0.75)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(34,211,238,0.03) 50%, rgba(5,8,15,0.18) 100%)",
              borderRight: textSide === "left"  ? "0.5px solid rgba(34,211,238,0.08)" : "none",
              borderLeft:  textSide === "right" ? "0.5px solid rgba(34,211,238,0.08)" : "none",
              maskImage: textSide === "left"
                ? "linear-gradient(90deg, rgba(0,0,0,1) 55%, rgba(0,0,0,0.5) 78%, transparent 100%)"
                : "linear-gradient(270deg, rgba(0,0,0,1) 55%, rgba(0,0,0,0.5) 78%, transparent 100%)",
              WebkitMaskImage: textSide === "left"
                ? "linear-gradient(90deg, rgba(0,0,0,1) 55%, rgba(0,0,0,0.5) 78%, transparent 100%)"
                : "linear-gradient(270deg, rgba(0,0,0,1) 55%, rgba(0,0,0,0.5) 78%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 7,
            }}
          />
          )}
          </AnimatePresence>

          {/* ── TEXT ── */}
          <AnimatePresence>
            {!hideText && (
              <motion.div
                key="text-layer"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative h-full w-full"
                style={{ zIndex: 10 }}
              >
                <AnimatePresence mode="wait">
                  <TextPanel section={section} side={textSide} />
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── NEON CTA BUTTON ── */}
          <AnimatePresence>
            {showCTA && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 24, scale: 0.94, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)" }}
                exit={{    opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  bottom: "10%",
                  left: "45%",
                  transform: "translateX(-50%)",
                  zIndex: 20,
                }}
              >
                {/* spinning neon border wrapper */}
                <div style={{
                  padding: "2px",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #22d3ee, #34d399, #818cf8, #22d3ee, #34d399)",
                  backgroundSize: "300% 300%",
                  animation: "neon-border-spin 3s linear infinite",
                }}>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 40px",
                      borderRadius: "999px",
                      border: "none",
                      background: "#05080f",
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "600",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      animation: "btn-glow-pulse 2.4s ease-in-out infinite",
                      whiteSpace: "nowrap",
                    }}
                    onClick={handleBuildClick}
                  >
                    {/* lightning bolt icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M9.5 1L3 9h5.5L6.5 15L13 7H7.5L9.5 1Z"
                        fill="url(#bolt-grad)" stroke="url(#bolt-grad)" strokeWidth="0.4" strokeLinejoin="round"/>
                      <defs>
                        <linearGradient id="bolt-grad" x1="3" y1="1" x2="13" y2="15" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#22d3ee"/>
                          <stop offset="100%" stopColor="#34d399"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    Build Now
                    {/* arrow */}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: "2px" }}>
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* ── SCROLL PROGRESS INDICATOR ── */}
          <AnimatePresence>
            {!showCTA && (
              <motion.div
                key="scroll-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  bottom: "28px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* section label */}
                <motion.div style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(34,211,238,0.55)",
                  fontWeight: "500",
                  opacity: counterOpacity,
                }}>
                  {String(activeSection + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}
                </motion.div>

                {/* track + pill row */}
                <div style={{
                  position: "relative",
                  width: "120px",
                  height: "2px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.06)",
                }}>
                  {/* dim fill behind pill */}
                  <motion.div style={{
                    position: "absolute",
                    left: 0, top: 0, bottom: 0,
                    borderRadius: "999px",
                    background: "linear-gradient(90deg, rgba(34,211,238,0.3) 0%, rgba(52,211,153,0.15) 100%)",
                    width: trackFillWidth,
                  }} />

                  {/* glowing capsule */}
                  <motion.div style={{
                    position: "absolute",
                    top: "50%",
                    translateY: "-50%",
                    width: "22px",
                    height: "4px",
                    borderRadius: "999px",
                    background: "linear-gradient(90deg, #22d3ee 0%, #34d399 100%)",
                    boxShadow: "0 0 8px 2px rgba(34,211,238,0.8), 0 0 18px 5px rgba(34,211,238,0.3)",
                    left: pillLeft,
                  }} />

                  {/* tick marks for each section */}
                  {TIMELINE.map((t, i) => (
                    <div key={i} style={{
                      position: "absolute",
                      top: "50%",
                      left: `${t.progress * 100}%`,
                      transform: "translate(-50%, -50%)",
                      width: i === 0 ? "0px" : "3px",
                      height: "3px",
                      borderRadius: "50%",
                      background: activeSection >= i
                        ? "rgba(34,211,238,0.8)"
                        : "rgba(255,255,255,0.2)",
                      transition: "background 0.3s ease",
                    }} />
                  ))}
                </div>

                {/* scroll hint — only at very start */}
                <motion.div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)",
                    opacity: scrollHintOpacity,
                  }}
                >
                  scroll
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}