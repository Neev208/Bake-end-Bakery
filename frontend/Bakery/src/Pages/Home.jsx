import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaPlus, FaCircle, FaStar, FaVolumeUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- Internal ASMR Button Component (Fixes the missing reference) ---
const AsmrButton = ({ soundUrl }) => (
  <button className="bg-[#C2A382] p-2 rounded-full text-white hover:bg-[#4A3728] transition-colors shadow-lg">
    <FaVolumeUp size={12} />
  </button>
);

const categories = [
  { 
    id: "01", 
    name: "Artisan Breads", 
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200",
    path: "/category/bread",
    color: "#FFFDF5" 
  },
  { 
    id: "02", 
    name: "Signature Cakes", 
    img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1200",
    path: "/category/cakes",
    color: "#F3F0E9" 
  },
  { 
    id: "03", 
    name: "Fine Pastries", 
    img: "https://plus.unsplash.com/premium_photo-1667806845059-51fa9165bda1?w=600&auto=format&fit=crop",
    path: "/category/pastries",
    color: "#E5E1DA" 
  },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        // FIX: Changed .slice(4, 8) to .slice(0, 8). 
        // If you only have a few items, .slice(4, 8) results in an empty list!
        setProducts(res.data.slice(0, 8)); 
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    if (!price) return "0";
    return typeof price === 'string' ? price.replace(/[^0-9.]/g, '') : price;
  };

  return (
    <main className="min-h-screen transition-colors duration-1000" 
          style={{ backgroundColor: activeTab.color }}>
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex flex-col justify-center px-6 lg:px-20 overflow-hidden pt-20">
        <div className="z-10 relative">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="text-[#C2A382] uppercase tracking-[0.5em] text-[10px] font-black mb-8 block">
            Premium Small Batch 
          </motion.span>
          
          <div className="flex flex-col lg:flex-row lg:items-center gap-16">
            <div className="flex-1 space-y-4">
              {categories.map((cat) => (
                <motion.h1 key={cat.id} 
                  onMouseEnter={() => setActiveTab(cat)} 
                  onClick={() => navigate(cat.path)}
                  className={`text-5xl md:text-7xl lg:text-[110px] font-serif font-bold cursor-pointer leading-[0.85] transition-all duration-700 ${
                    activeTab.id === cat.id ? 'text-[#4A3728] translate-x-6' : 'text-[#4A3728]/10 hover:text-[#4A3728]/30'
                  }`}>
                  {cat.name}.
                </motion.h1>
              ))}
            </div>
            
            <div className="hidden lg:block w-[380px] h-[520px] relative rounded-full overflow-hidden border-8 border-white shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img key={activeTab.img} src={activeTab.img} 
                  initial={{ opacity: 0, scale: 1.2 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  transition={{ duration: 1, ease: "anticipate" }} 
                  className="w-full h-full object-cover" />
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 right-20 opacity-[0.03] pointer-events-none select-none">
            <span className="text-[15vw] font-serif italic text-[#4A3728]">Products</span>
        </div>
      </section>

      {/* 2. BEST SELLERS SECTION */}
      <section className="py-32 px-6 lg:px-20 bg-white border-y border-[#C2A382]/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center gap-3 mb-4">
              <FaCircle className="text-[#C2A382] text-[6px]" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#C2A382] font-black">House Favorites</span>
            </motion.div>
            <h2 className="text-5xl lg:text-7xl font-serif font-bold text-[#4A3728]">Popular <span className="text-[#C2A382] italic font-light">Items.</span></h2>
          </div>
          
          <button 
            onClick={() => navigate('/products')} 
            className="hidden md:flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase font-black text-[#4A3728] hover:text-[#C2A382] transition-all border-b-2 border-[#4A3728] pb-1"
          >
            View Collection <FaArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {loading ? (
             [...Array(4)].map((_, i) => (
               <div key={i} className="aspect-[4/5] bg-[#4A3728]/5 rounded-[2.5rem] animate-pulse" />
             ))
          ) : (
            products.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#FFFDF5] border border-[#C2A382]/20 mb-6 shadow-sm group-hover:shadow-2xl group-hover:shadow-[#4A3728]/10 transition-all duration-500">
                  <div className="absolute top-5 right-5 z-20 flex flex-col gap-2 items-end">
                    <div className="bg-[#4A3728] text-[#FFFDF5] text-[10px] font-black px-4 py-2 rounded-full shadow-lg">
                      ₹{formatPrice(item.price)}
                    </div>
                    {item.sound && <AsmrButton soundUrl={item.sound} />}
                  </div>

                  <img 
                    onClick={() => navigate(`/product/${item._id}`)}
                    src={item.img?.startsWith('http') ? item.img : `${API_URL}${item.img}`} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000"; }}
                  />
                  
                  <div 
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="absolute inset-0 bg-[#4A3728]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-14 h-14 rounded-full bg-white text-[#4A3728] flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl">
                      <FaPlus />
                    </div>
                  </div>
                </div>
                
                <div className="px-2 space-y-2" onClick={() => navigate(`/product/${item._id}`)}>
                  <h3 className="text-xl font-serif font-bold text-[#4A3728] group-hover:text-[#C2A382] transition-colors truncate">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#C2A382] text-[10px] gap-1">
                      {[...Array(5)].map((_, i) => <FaStar key={i} fill="currentColor" />)}
                    </div>
                    <span className="text-[9px] text-[#5F5248] uppercase tracking-widest font-black opacity-60">Artisanal</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="py-40 px-6 bg-[#FFFDF5] flex flex-col items-center justify-center text-center">
         <motion.div 
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate('/custom-cake-builder')}
            className="cursor-pointer group border-2 border-[#C2A382]/20 p-16 md:p-28 rounded-[4rem] hover:border-[#4A3728] transition-all duration-700 bg-white shadow-2xl shadow-[#4A3728]/5 max-w-4xl w-full"
         >
            <span className="text-[#C2A382] text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">Interactive Experience</span>
            <h2 className="text-5xl md:text-8xl font-serif font-bold text-[#4A3728]/20 group-hover:text-[#4A3728] transition-all duration-700 mb-8 italic">
              Atelier <span className="group-hover:text-[#C2A382]">Designer.</span>
            </h2>
            <p className="text-[#4A3728] group-hover:text-[#5F5248] text-[10px] md:text-xs uppercase tracking-[0.5em] font-black transition-colors">
              Enter the Boutique Studio
            </p>
            <div className="mt-10 h-[2px] w-16 bg-[#C2A382]/30 mx-auto group-hover:w-32 group-hover:bg-[#4A3728] transition-all duration-700" />
         </motion.div>
      </section>
    </main>
  );
};

export default Home;