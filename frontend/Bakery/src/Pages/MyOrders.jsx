import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userId = user?._id || "guest";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`https://bake-end-bakery-drnf.vercel.app/api/orders/user/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  if (loading) return <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center font-serif italic text-[#C2A382]">Retrieving your history...</div>;

  if (orders.length === 0) return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center p-6 text-center">
      <ShoppingBag size={60} className="text-[#C2A382] mb-6 opacity-40" />
      <h2 className="text-3xl font-serif font-bold text-[#4A3728]">No orders yet</h2>
      <p className="text-[#C2A382] uppercase tracking-widest text-[10px] font-black mt-2">Your oven is waiting for its first batch.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF5] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-serif font-bold mb-12 text-[#4A3728]">
          Order <span className="text-[#C2A382] italic font-light">History.</span>
        </h1>

        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={order._id} 
              className="bg-white border border-[#C2A382]/20 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all border-l-[12px] border-l-[#4A3728]"
            >
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C2A382]">Order ID: #{order._id.slice(-6)}</p>
                  <h3 className="text-sm font-black text-[#4A3728] mt-1 italic">
                    Placed on {new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-[#F3F0E9] px-4 py-2 rounded-full h-fit w-fit">
                  {order.status === 'Pending' ? <Clock size={14} className="text-[#C2A382]" /> : <CheckCircle2 size={14} className="text-green-600" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4A3728]">{order.status}</span>
                </div>
              </div>

              <div className="space-y-6 border-t border-[#4A3728]/5 pt-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {/* FIXED: Changed item.image to item.img to match your database */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F3F0E9] flex-shrink-0 border border-[#C2A382]/10">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.target.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=150&auto=format&fit=crop'; 
                          }} 
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm font-bold text-[#4A3728] uppercase tracking-tight">{item.name}</p>
                        <p className="text-[10px] font-black text-[#C2A382] uppercase">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-black text-sm text-[#4A3728]">₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-end pt-6 border-t border-[#4A3728]/10">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#C2A382]">Payment Method</p>
                  <p className="text-[10px] font-bold text-[#4A3728] uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#C2A382]">Total Paid</p>
                  <p className="text-3xl font-serif font-bold text-[#C2A382]">₹{order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;