import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, ShieldCheck, RefreshCw } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [timer, setTimer] = useState(0); // Timer state in seconds
  const navigate = useNavigate();

  // Handle the countdown logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "OTP sent successfully!" });
        setTimer(60); // Start 60-second cooldown
        
        // Optional: Auto-navigate after first successful send
        // setTimeout(() => navigate("/verify-otp", { state: { email } }), 2000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Connection failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] p-6">
      <div className="bg-white w-full max-w-[440px] p-10 rounded-[3rem] border border-[#C2A382]/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-[#C2A382]/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#C2A382]">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#4A3728] italic">Forgot Password</h2>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#C2A382] ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C2A382]/50" size={16} />
              <input 
                type="email" 
                placeholder="YOURNAME@EMAIL.COM" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30 text-[#4A3728] font-bold text-xs tracking-widest focus:outline-none focus:border-[#4A3728]" 
                required 
              />
            </div>
          </div>

          {message.text && (
            <div className={`text-[10px] text-center font-black uppercase tracking-wider py-3 rounded-xl ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading || timer > 0} 
            className="w-full bg-[#4A3728] text-[#FFFDF5] py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#C2A382] transition-all flex justify-center items-center disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        {/* Navigation Link if they already have an OTP */}
        <p className="text-center text-[10px] font-black uppercase tracking-widest mt-8 text-[#5F5248]">
          Already have a code?{" "}
          <span 
            onClick={() => navigate("/verify-otp", { state: { email } })}
            className="text-[#C2A382] cursor-pointer border-b border-[#C2A382]"
          >
            Verify Now
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;