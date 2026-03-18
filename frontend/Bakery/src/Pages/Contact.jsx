import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Clock, CheckCircle2, Loader2, Instagram, Facebook, User } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [status, setStatus] = useState('idle');
  const [responseMsg, setResponseMsg] = useState('');

  // Auto-fetch user details from login session
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setFormData(prev => ({
        ...prev,
        name: storedUser.name || '',
        email: storedUser.email || ''
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return setResponseMsg("Please login to send inquiries.");

    setStatus('loading');
    try {
      const response = await fetch("https://bake-end-bakery-drnf.vercel.app/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setResponseMsg("Sent! Our team at hellobakeend@gmail.com will reach out soon.");
        setFormData(prev => ({ ...prev, message: '' })); // Clear message only
      } else {
        setStatus('error');
        setResponseMsg(data.message || "Something went wrong.");
      }
    } catch (error) {
      setStatus('error');
      setResponseMsg("Connection error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#4A3728] p-6 md:p-12 pt-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* INFO COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-[#C2A382]/20 shadow-xl">
            <Mail className="text-[#C2A382] mb-6" size={32} />
            <h3 className="text-xl font-serif font-bold mb-3">Direct Line</h3>
            {/* DISPLAY UPDATED TO BOUTIQUE EMAIL */}
            <p className="text-[#5F5248] font-bold tracking-wide">hellobakeend@gmail.com</p>
          </div>

          <div className="bg-[#4A3728] p-10 rounded-[2.5rem] text-[#FFFDF5]">
            <Clock className="text-[#C2A382] mb-6" size={32} />
            <h3 className="text-xl font-serif font-bold mb-4">Baking Hours</h3>
            <p className="text-xs uppercase tracking-widest opacity-80 leading-loose">
              Mon - Fri: 09:00 - 20:00 <br />
              Sunday: Chef's Choice
            </p>
          </div>
        </div>

        {/* FORM COLUMN */}
        <motion.div className="lg:col-span-8 bg-white rounded-[3rem] p-8 md:p-16 border border-[#C2A382]/20 shadow-2xl relative">
          {status === 'success' ? (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              <CheckCircle2 size={64} className="text-[#C2A382] mx-auto mb-6" />
              <h2 className="text-3xl font-serif font-bold">Message Sent</h2>
              <p className="opacity-70 mt-4">{responseMsg}</p>
              <button onClick={() => setStatus('idle')} className="mt-8 text-[10px] font-black uppercase border-b border-[#4A3728]">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C2A382]">Concierge Inquiry</span>
                <div className="h-px w-full bg-[#C2A382]/20"></div>
              </div>

              {/* AUTO-FILLED INFO DISPLAY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
                <div className="px-6 py-4 bg-[#FFFDF5] border border-[#C2A382]/10 rounded-2xl">
                  <p className="text-[8px] font-black uppercase text-[#C2A382] mb-1">Sending As</p>
                  <p className="text-xs font-bold">{formData.name || 'Neev'}</p>
                </div>
                <div className="px-6 py-4 bg-[#FFFDF5] border border-[#C2A382]/10 rounded-2xl">
                  <p className="text-[8px] font-black uppercase text-[#C2A382] mb-1">Response Email</p>
                  <p className="text-xs font-bold">{formData.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#C2A382]">Subject</label>
                <select 
                  className="w-full bg-[#FFFDF5] border border-[#C2A382]/30 rounded-xl px-6 py-4 text-xs font-bold outline-none appearance-none"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option>General Inquiry</option>
                  <option>Custom Cake Order</option>
                  <option>Boutique Event</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#C2A382]">Message</label>
                <textarea
                  rows="5"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[#FFFDF5] border border-[#C2A382]/30 rounded-3xl px-8 py-6 text-xs font-bold outline-none focus:border-[#4A3728] transition-all"
                  placeholder="TELL US ABOUT YOUR REQUIREMENTS..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#4A3728] text-white py-6 rounded-full font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#C2A382] transition-all shadow-xl"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : "Send to hellobakeend@gmail.com"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;