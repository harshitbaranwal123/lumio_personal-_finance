import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";


function Navbar() {
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="nav-container">
          {/* LEFT - LOGO */}
          <Link to="/dashboard" className="nav-logo" aria-label="Go to dashboard">
            <div className="nav-brandMark" aria-hidden="true">
              <svg viewBox="0 0 48 48" className="nav-brandSvg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#3b82f6" />
                    <stop offset="0.5" stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="21" fill="rgba(255,255,255,0.03)" />
                <path
                  d="M16 26.5c2.2-6.2 5.9-9.7 8-10 2.1-.3 5.2 1.9 7 7.7"
                  stroke="url(#brandGrad)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M14.5 18.5c3.3-3.7 7.2-5.8 10.1-5.6 3.2.2 6.2 2.2 8.2 5.9"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="24" r="4" fill="url(#brandGrad)" />
              </svg>
              <span className="nav-brandGlow" />
            </div>
            <div className="nav-brandText">LUMIO</div>
          </Link>

          {/* RIGHT - DESKTOP */}
          <div className="nav-right hidden md:flex">
            {user && (
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="nav-userPill"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="nav-avatar" aria-hidden="true">
                    <span>{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="nav-userName">{user.name}</span>
                </motion.div>

                <motion.button
                  onClick={logout}
                  className="nav-logout-btn"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* RIGHT - MOBILE MENU BUTTON */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-mobile-toggle md:hidden"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && user && (
          <motion.div
            className="fixed inset-0 top-[70px] bg-black/40 backdrop-blur-md md:hidden z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="p-4 bg-gradient-to-b from-slate-900/70 to-slate-950/70 border-b border-white/10"
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nav-mobileUser">
                <div className="nav-avatar nav-avatar-lg" aria-hidden="true">
                  <span>{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="nav-mobileUserName">{user.name}</p>
                  <p className="nav-mobileUserEmail">{user.email}</p>
                </div>
              </div>

              <motion.button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full btn btn-danger"
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;

