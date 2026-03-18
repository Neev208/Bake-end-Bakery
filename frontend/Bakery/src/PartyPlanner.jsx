import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, PartyPopper, Briefcase, Coffee, ArrowRight, 
  ShoppingBag, CheckCircle2, Info, Calculator 
} from "lucide-react";
import toast from "react-hot-toast"; 
import { productData } from "./data";

const PartyPlanner = () => {
  const [guests, setGuests] = useState(10);
  const [eventType, setEventType] = useState("birthday");
  const [recommendation, setRecommendation] = useState(null);

  // --- LOGIC: Intelligent Recommendation Engine ---
  const calculateNeeds = () => {
    let recs = [];
    let usedIds = new Set(); 

    const findProduct = (category, filterFn = () => true) => {
      const item = productData.find(p => p.cat === category && !usedIds.has(p._id) && filterFn(p));
      if (item) usedIds.add(item._id);
      return item;
    };

    if (eventType === "birthday") {
      const cakeNeededKg = (guests * 0.120); 
      const cake = findProduct("Cakes");
      if (cake) {
        const finalWeight = Math.max(0.5, Math.min(5, Math.ceil(cakeNeededKg * 2) / 2));
        recs.push({
          type: "Centerpiece",
          item: cake,
          qty: 1,
          weight: finalWeight,
          note: `A ${finalWeight}kg artisanal cake is perfect for ${guests} guests.`
        });
      }
    }

    if (eventType === "meeting") {
      const pastry = findProduct("Pastries & Sweets", p => p.name.includes("Croissant") || p.name.includes("Filo"));
      if (pastry) {
        recs.push({
          type: "Morning Fuel",
          item: pastry,
          qty: Math.ceil(guests * 1.2),
          note: "Light, flaky selections to energize your morning strategy session."
        });
      }
    }

    if (eventType === "tea") {
      const savory = findProduct("Savoury & Snack Items");
      const sweet = findProduct("Pastries & Sweets");
      if (savory) recs.push({ type: "Savory", item: savory, qty: guests, note: "One savory delicate per guest." });
      if (sweet) recs.push({ type: "Sweet", item: sweet, qty: guests, note: "Boutique patisserie selection." });
    }

    setRecommendation(recs);
  };

  // --- FIXED PRICE CALCULATION LOGIC ---
  const addToCart = (rec) => {
    // 1. Extract raw number (e.g., "₹550" -> 550)
    const rawPrice = parseInt(rec.item.price.replace(/[^0-9]/g, '')) || 0;
    
    // 2. Calculate Total based on Weight OR Quantity (not both)
    // If it's a cake with weight, price is usually per kg.
    // If it's a pastry, price is per unit.
    let totalCalculatedPrice = 0;
    if (rec.weight) {
        totalCalculatedPrice = rawPrice * rec.weight;
    } else {
        totalCalculatedPrice = rawPrice * rec.qty;
    }

    const uniqueId = Date.now();
    const newItem = {
        ...rec.item,
        cartId: uniqueId,
        quantity: rec.qty,
        selectedWeight: rec.weight ? `${rec.weight}kg` : null,
        // Ensure the price stored in cart reflects the TOTAL for the selection
        price: `₹${totalCalculatedPrice.toLocaleString()}`, 
        unitPrice: rawPrice
    };
    
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("cart", JSON.stringify([...existingCart, newItem]));
    window.dispatchEvent(new Event("storage"));

    toast.success(`Added ${rec.qty}x ${rec.item.name} to bag`, {
        style: { background: '#4A3728', color: '#FFFDF5', borderRadius: '12px', fontSize: '12px' },
    });
  };

  const estimatedTotal = useMemo(() => {
    if (!recommendation) return 0;
    return recommendation.reduce((acc, rec) => {
      const price = parseInt(rec.item.price.replace(/[^0-9]/g, '')) || 0;
      const sub = rec.weight ? (price * rec.weight) : (price * rec.qty);
      return acc + sub;
    }, 0);
  }, [recommendation]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#4A3728] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-[#C2A382] font-mono tracking-[0.3em] uppercase text-[10px] font-black block mb-4">Portion Concierge</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">Plan Your <span className="text-[#C2A382] italic font-light font-serif">Event.</span></h1>
            <p className="max-w-xl mx-auto text-[#5F5248] text-lg opacity-80 leading-relaxed">Let us curate the perfect quantities for your boutique gathering.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: INPUT PANEL */}
            <div className="lg:col-span-5 bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#C2A382]/20 shadow-2xl shadow-[#4A3728]/5 sticky top-32">
                <div className="space-y-10">
                    <div>
                        <div className="flex justify-between items-end mb-6">
                            <label className="text-[#C2A382] font-black uppercase tracking-[0.2em] text-[10px]">Guest Count</label>
                            <span className="text-4xl font-serif text-[#4A3728]">{guests}</span>
                        </div>
                        <input 
                            type="range" min="2" max="60" value={guests} 
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-[#4A3728]/10 rounded-lg appearance-none cursor-pointer accent-[#4A3728]"
                        />
                    </div>

                    <div>
                        <label className="block text-[#C2A382] font-black uppercase tracking-[0.2em] text-[10px] mb-6">Event Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                              { id: "birthday", label: "Party", icon: PartyPopper },
                              { id: "meeting", label: "Work", icon: Briefcase },
                              { id: "tea", label: "Social", icon: Coffee }
                            ].map((type) => (
                              <button 
                                  key={type.id}
                                  onClick={() => setEventType(type.id)}
                                  className={`py-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                                      eventType === type.id 
                                      ? "bg-[#4A3728] text-[#FFFDF5] border-[#4A3728] shadow-lg" 
                                      : "bg-white border-[#C2A382]/20 text-[#4A3728] hover:border-[#C2A382]"
                                  }`}
                              >
                                  <type.icon size={18} />
                                  <span className="text-[9px] font-black uppercase tracking-widest">{type.label}</span>
                              </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={calculateNeeds} className="w-full bg-[#4A3728] text-[#FFFDF5] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#C2A382] transition-all flex items-center justify-center gap-3">
                        Generate Proposal <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* RIGHT: RECOMMENDATIONS */}
            <div className="lg:col-span-7 space-y-6">
                <AnimatePresence mode="wait">
                    {!recommendation ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[400px] flex flex-col items-center justify-center text-[#5F5248]/40 border-2 border-dashed border-[#C2A382]/20 rounded-[3rem] p-16 text-center">
                            <Users size={48} className="opacity-20 mb-4" />
                            <p className="text-sm font-serif italic italic">Adjust parameters to reveal recommendations.</p>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            {/* Summary Bar */}
                            <div className="flex items-center justify-between px-8 py-5 bg-[#4A3728] rounded-[2rem] text-white shadow-xl">
                                <div className="flex items-center gap-3">
                                    <Calculator size={18} className="text-[#C2A382]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Proposal Subtotal</span>
                                </div>
                                <span className="text-2xl font-serif">₹{estimatedTotal.toLocaleString()}</span>
                            </div>

                            {recommendation.map((rec, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={index}
                                    className="bg-white border border-[#C2A382]/10 p-5 rounded-[2.5rem] flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-all"
                                >
                                    <img src={rec.item.img} className="w-full sm:w-32 h-32 rounded-3xl object-cover" alt={rec.item.name} />
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <span className="text-[#C2A382] text-[9px] font-black uppercase tracking-[0.2em]">{rec.type}</span>
                                            <h3 className="font-serif font-bold text-2xl text-[#4A3728] mb-1">{rec.item.name}</h3>
                                            <p className="text-xs text-[#5F5248] opacity-70 mb-4 italic leading-relaxed">"{rec.note}"</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-[#C2A382]/5">
                                            <span className="text-[10px] font-black text-[#4A3728] uppercase">
                                                Qty: <span className="text-[#C2A382]">{rec.qty} {rec.weight ? `(${rec.weight}kg)` : 'Units'}</span>
                                            </span>
                                            <button onClick={() => addToCart(rec)} className="flex items-center gap-2 px-6 py-3 bg-[#4A3728] text-[#FFFDF5] rounded-xl hover:bg-[#C2A382] transition-all">
                                                <span className="text-[10px] font-black uppercase tracking-widest">Add to Bag</span>
                                                <ShoppingBag size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PartyPlanner;