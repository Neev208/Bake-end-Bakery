import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  User, 
  Cake, 
  LogOut,
  Settings,
  ClipboardList // Added for My Orders icon
} from "lucide-react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userInfo, setUserInfo] = useState(null);

  const userRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Check Login Status Logic
  const checkLogin = () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(user);
  };

  useEffect(() => {
    checkLogin();
    window.addEventListener("storage", checkLogin);
    window.addEventListener("authChange", checkLogin);
    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("authChange", checkLogin);
    };
  }, []);

  // 2. Handle Scroll Logic
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20); 
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Click Outside User Menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. Cart Count Logic
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cartUpdate", updateCount);
    return () => {
        window.removeEventListener("storage", updateCount);
        window.removeEventListener("cartUpdate", updateCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    setUserOpen(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const getInitials = (user) => {
    if (!user) return "U";
    const name = user.fullName || user.name || user.username || "User";
    return name.charAt(0).toUpperCase();
  };

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/products" },
    { name: "Custom Cake", link: "/custom-cake-builder" }, 
    { name: "Story", link: "/story" },
    { name: "Planner", link: "/planner" },
    { name: "Contact", link: "/contact" }
  ];

  return (
    <>
      <nav 
        className={`fixed w-full z-[100] transition-all duration-500 ${
          scrolled ? "top-2 md:top-4" : "top-0"
        }`}
      >
        <div className={`mx-auto transition-all duration-500 px-4 md:px-6 ${
          scrolled 
            ? "max-w-[95%] md:max-w-6xl bg-[#4A3728]/95 backdrop-blur-xl rounded-full border border-[#C2A382]/30 py-3 shadow-2xl" 
            : "max-w-full bg-transparent py-4 md:py-6"
        }`}>
          <div className="flex justify-between items-center relative">
            
            {/* LEFT: LOGO SECTION */}
            <div className="flex items-center gap-2 md:gap-4 z-20">
              <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                <div className="relative overflow-hidden w-8 h-8 md:w-10 md:h-10 bg-[#C2A382] rounded-lg md:rounded-xl flex items-center justify-center text-[#4A3728] shadow-lg shadow-[#C2A382]/30">
                  <motion.div
                    animate={{ rotate: scrolled ? 360 : 0 }}
                    transition={{ duration: 0.8, ease: "anticipate" }}
                  >
                    <Cake size={18} className="md:w-5 md:h-5" fill="currentColor" />
                  </motion.div>
                </div>
                <div className="flex flex-col">
                  <span className={`font-serif text-lg md:text-xl font-bold tracking-tight leading-none transition-colors ${
                    scrolled ? "text-[#FFFDF5]" : "text-[#4A3728]"
                  }`}>
                    Bake-end Bakery
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: DESKTOP NAVIGATION */}
            <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 items-center rounded-full px-1.5 py-1 border transition-all ${
              scrolled 
              ? "bg-white/5 border-white/10" 
              : "bg-[#4A3728]/5 border-[#4A3728]/10 shadow-sm"
            }`}>
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className={`px-4 py-1.5 text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all relative group rounded-full ${
                    scrolled ? "text-white/70 hover:text-white" : "text-[#5F5248] hover:text-[#4A3728]"
                  }`}
                >
                  {item.name}
                  {location.pathname === item.link && (
                    <motion.div 
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        scrolled ? "bg-white/10" : "bg-[#C2A382]/20"
                      }`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* RIGHT: UTILITIES */}
            <div className="flex items-center justify-end gap-2 md:gap-3 z-20">
              
              <Link to="/cart">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all group ${
                      scrolled ? "border-white/10 bg-white/5" : "border-[#4A3728]/10 bg-white shadow-sm"
                    }`}
                  >
                    <ShoppingBag size={18} className={scrolled ? "text-[#FFFDF5]" : "text-[#4A3728]"} />
                    <AnimatePresence>
                      {cartCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          key={cartCount}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-[#C2A382] text-[#4A3728] text-[10px] font-black flex items-center justify-center rounded-full shadow-md"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
              </Link>

              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all overflow-hidden ${
                    scrolled ? "border-white/10 bg-white/5" : "border-[#4A3728]/10 bg-white shadow-sm"
                  }`}
                >
                  {userInfo ? (
                    <div className="w-full h-full bg-[#C2A382] flex items-center justify-center text-[#4A3728] font-black text-sm">
                      {getInitials(userInfo)}
                    </div>
                  ) : (
                    <User size={18} className={scrolled ? "text-[#FFFDF5]" : "text-[#4A3728]"} />
                  )}
                </button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-[#FFFDF5] border border-[#C2A382]/20 rounded-2xl shadow-2xl p-1.5 z-[110]"
                    >
                      {userInfo ? (
                        <>
                          <div className="px-4 py-3 border-b border-[#4A3728]/5 mb-1">
                            <p className="text-[10px] font-black uppercase text-[#C2A382]">Member</p>
                            <p className="text-sm font-bold text-[#4A3728] truncate">{userInfo.fullName || userInfo.name || userInfo.username}</p>
                          </div>
                          
                          {/* Account Detail */}
                          <Link 
                            to="/account" 
                            onClick={() => setUserOpen(false)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#4A3728] hover:bg-[#C2A382]/10 rounded-xl transition-all"
                          >
                            <Settings size={14} className="text-[#C2A382]" /> Account Detail
                          </Link>

                          {/* My Orders Link */}
                          <Link 
                            to="/my-orders" 
                            onClick={() => setUserOpen(false)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#4A3728] hover:bg-[#C2A382]/10 rounded-xl transition-all"
                          >
                            <ClipboardList size={14} className="text-[#C2A382]" /> My Orders
                          </Link>

                          <button 
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
                          >
                            <LogOut size={14} /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#4A3728] hover:bg-[#C2A382]/10 rounded-xl transition-all">Login</Link>
                          <Link to="/register" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#4A3728] hover:bg-[#C2A382]/5 rounded-xl transition-all">Register</Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setIsOpen(true)}
                className={`md:hidden p-2 rounded-full transition-colors ${
                   scrolled ? 'text-[#FFFDF5] hover:bg-white/10' : 'text-[#4A3728] hover:bg-[#4A3728]/5'
                }`}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] md:hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-[#4A3728]/40 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="absolute right-0 top-0 bottom-0 w-full sm:w-80 bg-[#FFFDF5] p-6 flex flex-col shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="font-serif text-2xl font-bold text-[#4A3728] flex items-center gap-2">
                    <Cake size={20} className="text-[#C2A382]" fill="currentColor" />
                    Bake-end
                  </span>
                  <button onClick={() => setIsOpen(false)} className="p-2 border border-[#4A3728]/10 rounded-full text-[#4A3728]">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-6">
                  {navLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.link}
                      onClick={() => setIsOpen(false)}
                      className="text-3xl font-serif font-bold text-[#4A3728] hover:text-[#C2A382] transition-all"
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Mobile My Orders Link */}
                  {userInfo && (
                    <Link
                      to="/my-orders"
                      onClick={() => setIsOpen(false)}
                      className="text-3xl font-serif font-bold text-[#C2A382] hover:text-[#4A3728] transition-all"
                    >
                      My Orders
                    </Link>
                  )}

                  {userInfo && (
                    <Link
                      to="/account"
                      onClick={() => setIsOpen(false)}
                      className="text-3xl font-serif font-bold text-[#C2A382] hover:text-[#4A3728] transition-all"
                    >
                      My Account
                    </Link>
                  )}
                </div>

                <div className="mt-auto pt-8 border-t border-[#4A3728]/10">
                  <Link 
                    to="/products" 
                    onClick={() => setIsOpen(false)} 
                    className="w-full py-4 bg-[#4A3728] text-[#FFFDF5] font-black uppercase tracking-widest text-xs rounded-xl text-center block shadow-lg"
                  >
                    Explore Products
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;