import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, User, Mail } from "lucide-react";

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
          name: formData.fullName, // Corrected key to match backend
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
        <h2 className="text-4xl font-serif font-bold text-[#4A3728] mb-6 italic text-center">Create <span className="text-[#C2A382]">Account.</span></h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" placeholder="FULL NAME" onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30" required />
          <input name="email" type="email" placeholder="EMAIL" onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30" required />
          <input name="password" type="password" placeholder="PASSWORD" onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30" required />
          <input name="confirmPassword" type="password" placeholder="CONFIRM" onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#FFFDF5] border border-[#C2A382]/30" required />
          {error && <p className="text-red-500 text-xs text-center font-bold uppercase">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-[#4A3728] text-white py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#C2A382] transition-all">
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Join the Family"}
          </button>
        </form>
        <p className="text-center text-[10px] mt-6 font-black uppercase">Already a member? <Link to="/login" className="text-[#C2A382]">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Register;