import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, CakeSlice, Loader2 } from "lucide-react";

const NewsletterPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  // Clear error message when user starts typing again
  useEffect(() => {
    if (status === "error") {
      setStatus("idle");
      setMessage("");
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        // Specifically handle the "Already subscribed" case from backend
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Server connection refused. Is your backend running on port 5000?");
      console.error("Fetch Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center px-6 selection:bg-[#C2A382] selection:text-[#FFFDF5]">
      <div className="max-w-md w-full bg-white border border-[#C2A382]/20 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-[#4A3728]/5 text-center transition-all duration-500 hover:border-[#C2A382]/40 relative overflow-hidden">
        
        {/* Background Decorative Flare */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C2A382]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

        {/* Boutique Icon */}
        <div className="inline-block bg-[#4A3728] p-5 rounded-[1.5rem] mb-8 shadow-xl shadow-[#4A3728]/10 relative z-10">
          <CakeSlice className="text-[#C2A382] animate-bounce" size={32} />
        </div>
        
        <div className="text-left relative z-10">
          <span className="text-[#C2A382] font-mono tracking-[0.3em] uppercase text-[10px] font-black block mb-2">
            Secret Ingredient Club
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3728] mb-4 italic leading-tight">
            Freshly Baked <span className="text-[#C2A382]">Updates</span>
          </h1>
          <p className="text-[#5F5248] text-sm mb-8 leading-relaxed font-medium opacity-80">
            Join our inner circle for exclusive recipes and boutique specials. We promise only sweet surprises in your inbox.
          </p>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-5 py-4 animate-in fade-in zoom-in duration-500 relative z-10">
            <div className="w-20 h-20 bg-[#C2A382]/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-[#4A3728]" size={48} />
            </div>
            <div className="space-y-1">
              <h2 className="text-[#4A3728] text-xl font-black uppercase tracking-tight">You're on the list!</h2>
              <p className="text-[#5F5248] text-sm font-medium">Check your inbox for your 10% discount code.</p>
            </div>
            <button 
              onClick={() => setStatus("idle")}
              className="text-[#4A3728] text-[10px] font-black uppercase tracking-widest mt-6 py-3 px-8 border-2 border-[#4A3728] rounded-full hover:bg-[#4A3728] hover:text-[#FFFDF5] transition-all active:scale-95"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative group z-10">
            <div className="flex flex-col gap-4 relative">
              <input 
                type="email" 
                required
                placeholder="YOURNAME@EMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#4A3728]/5 border rounded-2xl px-6 py-5 text-[#4A3728] placeholder:text-[#5F5248]/40 focus:outline-none text-xs font-bold tracking-widest transition-all shadow-sm ${
                  status === "error" ? "border-red-400" : "border-[#C2A382]/30 focus:border-[#4A3728]"
                }`}
              />
              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#4A3728] text-[#FFFDF5] font-black uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#C2A382] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-[10px] shadow-lg shadow-[#4A3728]/20"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    Join the Club
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {status === "error" && (
              <div className="flex items-center justify-center gap-2 mt-6 text-red-600 animate-in slide-in-from-top-2 duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                <p className="text-[10px] font-black uppercase tracking-wider">
                  {message}
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterPage;