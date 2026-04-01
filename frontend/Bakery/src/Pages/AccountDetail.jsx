import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, ShieldCheck, 
  Save, Loader2, AlertCircle, CheckCircle2, Edit3
} from "lucide-react";

// FIXED: Component name now matches your filename "AccountDetail"
const AccountDetail = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!storedUser?._id) { navigate("/login"); return; }

      try {
        const response = await fetch(`https://bake-end-bakery-drnf.vercel.app/api/user/profile/${storedUser._id}`);
        const data = await response.json();
        if (response.ok) {
          setUser({ name: data.name, email: data.email });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setPageLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));

    try {
      const response = await fetch("https://bake-end-bakery-drnf.vercel.app/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: storedUser._id, name: user.name }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Name updated successfully!" });
        localStorage.setItem("userInfo", JSON.stringify({ ...storedUser, name: user.name }));
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update name." });
    } finally {
      setNameLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMessage({ type: "error", text: "New passwords do not match." });
    }
    setSubmitLoading(true);
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const response = await fetch("https://bake-end-bakery-drnf.vercel.app/api/user/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: storedUser._id,
          newPassword: passwords.newPassword
        }),
      });
      if (response.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setPasswords({ newPassword: "", confirmPassword: "" });
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.message });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]"><Loader2 className="animate-spin text-[#C2A382]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#FFFDF5] pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-serif font-bold text-[#4A3728] italic">Account Detail</h1>
          <p className="text-[#5F5248] text-sm mt-2 opacity-70">Manage your identity and security</p>
        </div>

        <div className="grid gap-8">
          {/* SECTION: IDENTITY */}
          <div className="bg-white rounded-[2rem] p-8 border border-[#C2A382]/20 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#C2A382]/10 p-2 rounded-lg text-[#C2A382]"><User size={20} /></div>
              <h2 className="text-xl font-serif font-bold text-[#4A3728]">Account Identity</h2>
            </div>
            
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-[#C2A382] ml-4">Full Name</label>
                <div className="flex items-center gap-3 bg-[#FFFDF5] px-4 py-4 rounded-xl border border-[#C2A382]/30 focus-within:border-[#4A3728] transition-all">
                  <Edit3 size={18} className="text-[#C2A382]/60" />
                  <input 
                    type="text" 
                    value={user.name} 
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    className="bg-transparent w-full outline-none text-[#4A3728] font-semibold text-base" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-[#C2A382] ml-4">Email Address (Permanent)</label>
                <div className="flex items-center gap-3 bg-[#4A3728]/5 px-4 py-4 rounded-xl border border-transparent">
                  <Mail size={18} className="text-[#4A3728]/30" />
                  <input 
                    type="email" 
                    readOnly 
                    value={user.email} 
                    className="bg-transparent w-full outline-none text-[#4A3728] font-semibold text-base opacity-50 cursor-not-allowed" 
                  />
                </div>
              </div>

              <button type="submit" disabled={nameLoading} className="text-[11px] font-black text-[#C2A382] hover:text-[#4A3728] flex items-center gap-2 transition-colors uppercase tracking-[0.2em] ml-4">
                {nameLoading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save Identity Changes
              </button>
            </form>
          </div>

          {/* SECTION: SECURITY */}
          <div className="bg-white rounded-[2rem] p-8 border border-[#C2A382]/20 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#4A3728] p-2 rounded-lg text-[#FFFDF5]"><ShieldCheck size={20} /></div>
              <h2 className="text-xl font-serif font-bold text-[#4A3728]">Security Overrides</h2>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] uppercase font-black tracking-widest text-[#C2A382] ml-4">New Password</label>
                   <input 
                    name="newPassword" 
                    type="password" 
                    required 
                    value={passwords.newPassword} 
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
                    placeholder="••••••••" 
                    className="bg-[#FFFDF5] px-5 py-4 rounded-xl border border-[#C2A382]/30 text-[#4A3728] font-semibold text-base focus:border-[#4A3728] outline-none transition-all placeholder-[#5F5248]/40" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] uppercase font-black tracking-widest text-[#C2A382] ml-4">Confirm Password</label>
                   <input 
                    name="confirmPassword" 
                    type="password" 
                    required 
                    value={passwords.confirmPassword} 
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} 
                    placeholder="••••••••" 
                    className="bg-[#FFFDF5] px-5 py-4 rounded-xl border border-[#C2A382]/30 text-[#4A3728] font-semibold text-base focus:border-[#4A3728] outline-none transition-all placeholder-[#5F5248]/40" 
                  />
                </div>
              </div>

              {message.text && (
                <div className={`flex items-center gap-2 p-4 rounded-xl text-[10px] font-black uppercase tracking-wider ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </div>
              )}

              <button type="submit" disabled={submitLoading} className="w-full bg-[#4A3728] text-[#FFFDF5] py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#C2A382] transition-all disabled:opacity-50 shadow-lg shadow-[#4A3728]/10">
                {submitLoading ? <Loader2 className="animate-spin" size={18} /> : "Update Credentials"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// FIXED: Exporting the correct component name
export default AccountDetail;