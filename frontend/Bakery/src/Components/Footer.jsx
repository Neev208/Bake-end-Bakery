import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CakeSlice, Instagram, Facebook, Twitter, 
  Mail, Phone, MapPin, Send, CheckCircle2, Loader2,
  Zap, Flame, Wheat, Truck
} from "lucide-react";

const Footer = () => {
  // --- NEWSLETTER LOGIC ---
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setStatusMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setStatusMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setStatusMessage("Server connection refused.");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (status === "error") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  return (
    <footer className="bg-[#4A3728] pt-12 pb-6 text-[#FFFDF5]/70">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. Newsletter Card */}
        <div className="relative -translate-y-16 bg-[#FFFDF5] rounded-[2.5rem] p-6 md:p-10 border border-[#C2A382]/20 shadow-2xl mb-[-2rem]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <span className="text-[#C2A382] font-mono tracking-[0.2em] uppercase text-[10px] font-black">Newsletter</span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#4A3728] italic tracking-tight mt-1">
                Freshly Baked Updates
              </h3>
              <p className="text-[#5F5248] text-xs mt-1 font-medium opacity-80">
                Join our club for exclusive recipes and boutique specials.
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
              <div className={`flex w-full lg:w-auto bg-[#4A3728]/5 border rounded-full p-1.5 transition-all ${
                status === "error" ? "border-red-500" : "border-[#C2A382]/30 focus-within:border-[#4A3728]"
              }`}>
                {status === "success" ? (
                  <div className="flex items-center gap-2 px-6 py-2 text-[#4A3728] text-xs font-black animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 size={16} className="text-[#C2A382]" /> Welcome to the family!
                  </div>
                ) : (
                  <>
                    <input 
                      type="email" 
                      required
                      placeholder="yourname@email.com"
                      value={email}
                      onChange={handleEmailChange}
                      className="bg-transparent border-none outline-none px-5 py-2 text-[#4A3728] w-full lg:w-64 placeholder:text-[#5F5248]/50 text-xs font-bold tracking-wider uppercase"
                    />
                    <button 
                      type="submit"
                      disabled={status === "loading"}
                      className="bg-[#4A3728] text-[#FFFDF5] px-6 py-2.5 rounded-full font-black flex items-center justify-center gap-2 hover:bg-[#C2A382] transition-all shrink-0 text-[10px] uppercase tracking-widest disabled:opacity-50 min-w-[120px]"
                    >
                      {status === "loading" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          Subscribe <Send size={14} />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
              {status === "error" && (
                <p className="text-red-600 text-[10px] mt-2 ml-4 font-bold uppercase tracking-tighter">
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* 2. Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mt-4 items-start">
          
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#C2A382] p-2.5 rounded-xl shadow-lg shadow-[#C2A382]/20 text-[#4A3728]">
                <CakeSlice size={24} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#FFFDF5] tracking-tight">Bake-end</h2>
            </div>
            <p className="text-xs leading-relaxed max-w-xs font-medium text-[#FFFDF5]/80">
              Crafting edible art in Anand. Every crumb tells a story of passion, precision, and the finest local ingredients.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 rounded-full border border-[#C2A382]/20 text-[#C2A382] hover:bg-[#C2A382] hover:text-[#4A3728] transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2 lg:ml-auto">
            <h4 className="text-[#C2A382] font-black mb-6 text-[10px] uppercase tracking-[0.3em]">Menu</h4>
            <ul className="space-y-3.5 text-xs font-bold tracking-wide">
              {['Home', 'Products', 'Story', 'Planner'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-[#FFFDF5]/70 hover:text-[#C2A382] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 lg:ml-auto">
            <h4 className="text-[#C2A382] font-black mb-6 text-[10px] uppercase tracking-[0.3em]">The Boutique</h4>
            <div className="space-y-4 text-xs font-medium text-[#FFFDF5]/70">
              <div className="flex gap-4 items-start">
                <MapPin className="text-[#C2A382] shrink-0" size={18} />
                <span className="leading-normal">123 Pastry Lane, Anand,<br />Gujarat 388001</span>
              </div>
              <div className="flex gap-4 items-center">
                <Phone className="text-[#C2A382] shrink-0" size={16} />
                <a href="tel:+919876543210" className="hover:text-[#C2A382] transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex gap-4 items-center">
                <Mail className="text-[#C2A382] shrink-0" size={16} />
                <a href="mailto:hellobakeend@gmail.com" className="hover:text-[#C2A382] transition-colors font-serif italic">hellobakeend@gmail.com</a>
              </div>
            </div>
          </div>  

          {/* UNIQUE SECTION: The Bake-end Pipeline */}
          <div className="lg:col-span-3">
            <h4 className="text-[#C2A382] font-black mb-6 text-[10px] uppercase tracking-[0.3em]">The Pipeline</h4>
            <div className="relative space-y-5 pl-5">
              {/* Vertical Line Connector */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-[#C2A382] via-[#C2A382]/40 to-transparent" />
              
              {[
                { title: "Sourcing", desc: "Local organic grains", icon: Wheat },
                { title: "Proofing", desc: "48h cold fermentation", icon: Zap },
                { title: "Firing", desc: "Stone-deck artisan ovens", icon: Flame },
                { title: "Serving", desc: "Fresh batch every 6am", icon: Truck }
              ].map((step, i) => (
                <div key={i} className="group relative flex items-start gap-3">
                  {/* Status Dot */}
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#4A3728] border-2 border-[#C2A382] shadow-[0_0_8px_rgba(194,163,130,0.4)] transition-transform group-hover:scale-125" />
                  
                  <step.icon size={14} className="mt-0.5 text-[#C2A382] opacity-80" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFDF5]">
                      {step.title}
                    </span>
                    <span className="text-[10px] font-serif italic text-[#FFFDF5]/40 leading-tight">
                      {step.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#C2A382]/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C2A382] font-black text-center md:text-left">
            © 2026 Bake-end Bakery • Handcrafted with love
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.25em] text-[#FFFDF5]/40 font-bold">
            <Link to="/privacy" className="hover:text-[#C2A382] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#C2A382] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;