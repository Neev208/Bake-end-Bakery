import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

    setIsLoading(true);
    try {
      const response = await fetch("https://bake-end-bakery-drnf.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName, 
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userToken", data.token);
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] p-6">
      <div className="bg-white w-full max-w-[440px] p-10 rounded-[3rem] border border-[#C2A382]/20 shadow-2xl">
        <h2 className="text-4xl font-serif font-bold text-[#4A3728] mb-8 italic text-center">
          Create <span className="text-[#C2A382]">Account.</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* COMMON INPUT CLASS: Added text-[#4A3728], font-semibold, and placeholder color fix */}
          <input 
            name="fullName" 
            placeholder="FULL NAME" 
            onChange={handleChange} 
            className="w-full p-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30 text-[#4A3728] font-semibold outline-none focus:border-[#4A3728] transition-all placeholder-[#4A3728]/40" 
            required 
          />
          
          <input 
            name="email" 
            type="email" 
            placeholder="EMAIL" 
            onChange={handleChange} 
            className="w-full p-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30 text-[#4A3728] font-semibold outline-none focus:border-[#4A3728] transition-all placeholder-[#4A3728]/40" 
            required 
          />
          
          <input 
            name="password" 
            type="password" 
            placeholder="PASSWORD" 
            onChange={handleChange} 
            className="w-full p-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30 text-[#4A3728] font-semibold outline-none focus:border-[#4A3728] transition-all placeholder-[#4A3728]/40" 
            required 
          />
          
          <input 
            name="confirmPassword" 
            type="password" 
            placeholder="CONFIRM PASSWORD" 
            onChange={handleChange} 
            className="w-full p-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30 text-[#4A3728] font-semibold outline-none focus:border-[#4A3728] transition-all placeholder-[#4A3728]/40" 
            required 
          />

          {error && (
            <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest pt-2">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-[#4A3728] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#C2A382] transition-all shadow-lg shadow-[#4A3728]/10 mt-4 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Join the Family"}
          </button>
        </form>

        <p className="text-center text-[10px] mt-8 font-black uppercase tracking-widest text-[#4A3728]/60">
          Already a member? <Link to="/login" className="text-[#C2A382] hover:text-[#4A3728] transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;