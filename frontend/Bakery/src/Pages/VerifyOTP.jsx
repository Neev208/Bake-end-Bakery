import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck, Lock, Hash } from "lucide-react";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({ otp: "", newPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://bake-end-bakery-drnf.vercel.app/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...formData }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Password reset successful!" });
        setTimeout(() => navigate("/login"), 2000);
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
          <div className="bg-[#4A3728] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#4A3728] italic">Final Step</h2>
          <p className="text-[#5F5248] text-[10px] font-black tracking-widest uppercase opacity-60">
            Verify OTP for {email}
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#C2A382] ml-4">6-Digit OTP</label>
            <div className="relative">
              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C2A382]/50" size={16} />
              <input 
                type="text" 
                placeholder="000000" 
                maxLength="6"
                value={formData.otp}
                onChange={(e) => setFormData({...formData, otp: e.target.value})}
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30 text-[#4A3728] font-bold text-lg tracking-[0.5em] focus:outline-none focus:border-[#4A3728]" 
                required 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#C2A382] ml-4">New Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C2A382]/50" size={16} />
              <input 
                type="password" 
                placeholder="NEW SECRET" 
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
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
            disabled={isLoading} 
            className="w-full bg-[#4A3728] text-[#FFFDF5] py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#C2A382] transition-all flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;