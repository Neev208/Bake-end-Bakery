import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Heart } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || "BK-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  // Redirect to home if someone tries to access success page directly without a session
  useEffect(() => {
    if (!location.state) {
      const timeout = setTimeout(() => navigate('/'), 5000);
      return () => clearTimeout(timeout);
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl border border-[#C2A382]/20 p-12 text-center relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#C2A382] via-[#4A3728] to-[#C2A382]" />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-green-50 p-6 rounded-full">
            <CheckCircle size={80} className="text-green-500" />
          </div>
        </motion.div>

        <h1 className="text-5xl font-serif font-bold text-[#4A3728] mb-4">
          Order <span className="text-[#C2A382] italic">Confirmed!</span>
        </h1>
        
        <p className="text-[#C2A382] uppercase tracking-[0.3em] text-[10px] font-black mb-8">
          Your delights are being prepared with love.
        </p>

        <div className="bg-[#FFFDF5] rounded-2xl p-6 mb-10 border border-[#4A3728]/5 inline-block w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase text-[#C2A382]">Order Reference</span>
            <span className="font-mono font-bold text-[#4A3728]">{orderId}</span>
          </div>
          <p className="text-xs text-[#4A3728]/60 text-left">
            A confirmation email has been sent to your inbox. We'll notify you once your package leaves our boutique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to="/products" 
            className="flex items-center justify-center gap-2 bg-[#4A3728] text-[#FFFDF5] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#C2A382] transition-all"
          >
            <Package size={16} /> Continue Shopping
          </Link>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 border-2 border-[#4A3728] text-[#4A3728] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#4A3728] hover:text-[#FFFDF5] transition-all"
          >
            Go to Home <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-[#C2A382]">
          <Heart size={14} fill="#C2A382" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Thank you for choosing Bake-end Bakery</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;