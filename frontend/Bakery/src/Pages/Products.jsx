import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Star, ChevronRight } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  // Using a reliable Unsplash image as a global fallback
  const RELIABLE_PLACEHOLDER = "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=800&q=80";

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (activeCategory !== "All") {
      result = result.filter((p) => 
        p.cat?.toString().toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.cat?.toLowerCase().includes(query)
      );
    }
    setFilteredProducts(result);
  }, [activeCategory, searchQuery, products]);

  const categories = ["All", "Bread & Rolls", "Cakes", "Pastries & Sweets", "Savoury & Snack Items"];

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#4A3728] pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[#C2A382] font-mono tracking-[0.3em] uppercase text-xs font-black mb-4 block">
            The Bakery Boutique
          </span>
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-10 leading-none">
            Our <span className="text-[#C2A382] italic font-light">Collection.</span>
          </h1>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                  ? "bg-[#4A3728] text-[#FFFDF5] border-[#4A3728]" 
                  : "bg-white text-[#5F5248] border-[#C2A382]/20 hover:border-[#C2A382] shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2A382]" size={18} />
            <input
              type="text"
              placeholder="SEARCH ARTISAN TREATS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#C2A382]/20 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#4A3728] transition-all text-xs font-bold tracking-widest shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-[#4A3728]/5 h-[400px] rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group cursor-pointer bg-white border border-[#C2A382]/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-[#4A3728]/10 transition-all duration-500"
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img
                      src={product.img?.startsWith('http') ? product.img : `${API_URL}/uploads/${product.img}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      onError={(e) => {
                        e.target.onerror = null; // Prevents infinite loops
                        e.target.src = RELIABLE_PLACEHOLDER;
                      }}
                    />
                    <div className="absolute top-5 right-5 bg-[#4A3728] text-[#FFFDF5] px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                      {product.price}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <span className="text-[#C2A382] text-[10px] uppercase tracking-[0.2em] font-black">{product.cat}</span>
                    <h3 className="text-2xl font-serif font-bold mt-2 mb-4 group-hover:text-[#C2A382] transition-colors line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between pt-4 border-t border-[#4A3728]/5">
                      <div className="flex items-center gap-1.5 text-[#C2A382]">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs text-[#5F5248] font-bold">4.9</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#4A3728]/5 flex items-center justify-center group-hover:bg-[#4A3728] group-hover:text-[#FFFDF5] transition-all duration-300">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;