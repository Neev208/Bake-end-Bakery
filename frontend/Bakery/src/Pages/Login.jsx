import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://bake-end-bakery-drnf.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        window.dispatchEvent(new Event("authChange"));
        navigate("/"); 
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] p-6 selection:bg-[#C2A382] selection:text-[#FFFDF5]">
      <div className="bg-white w-full max-w-[440px] p-10 md:p-12 rounded-[3rem] border border-[#C2A382]/20 shadow-2xl shadow-[#4A3728]/5 relative overflow-hidden">
        
        {/* Decorative Element */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#C2A382]/5 rounded-full blur-3xl -ml-16 -mt-16"></div>
        
        <div className="text-center mb-10">
          <span className="text-[#C2A382] uppercase tracking-[0.4em] text-[10px] font-black block mb-4">
            Member Access
          </span>
          <h2 className="text-4xl font-serif font-bold text-[#4A3728] mb-2 italic">
            Welcome <span className="text-[#C2A382]">Back.</span>
          </h2>
          <p className="text-[#5F5248] text-xs font-bold tracking-widest opacity-60 uppercase">
            Sign in to your bakery account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#C2A382] ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C2A382]/50" size={18} />
              <input 
                name="email" 
                type="email" 
                placeholder="email@example.com" 
                onChange={handleChange} 
                value={formData.email}
                /* UPDATED: Increased text size to text-base, normalized tracking, and set bold dark text */
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30 text-[#4A3728] font-semibold text-base placeholder-[#5F5248]/40 focus:outline-none focus:border-[#4A3728] transition-all" 
                required 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#C2A382] ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C2A382]/50" size={18} />
              <input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                onChange={handleChange} 
                value={formData.password}
                /* UPDATED: Increased text size to text-base and ensured strong visibility */
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30 text-[#4A3728] font-semibold text-base placeholder-[#5F5248]/40 focus:outline-none focus:border-[#4A3728] transition-all" 
                required 
              />
            </div>
          </div>

          <div className="flex justify-end pr-2">
            <Link 
              to="/forgot-password" 
              className="text-[10px] font-black uppercase tracking-widest text-[#C2A382] hover:text-[#4A3728] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <div className="text-red-600 text-[10px] text-center font-black uppercase tracking-wider bg-red-50 py-3 rounded-xl border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-[#4A3728] text-[#FFFDF5] py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] transition-all mt-4 flex justify-center items-center shadow-xl shadow-[#4A3728]/20 hover:bg-[#C2A382] disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Unlock Bakery"}
          </button>
        </form>

        <p className="text-center text-[10px] font-black uppercase tracking-widest mt-10 text-[#5F5248]">
          New here?{" "}
          <Link to="/register" className="text-[#C2A382] hover:text-[#4A3728] transition-colors border-b border-[#C2A382]">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;