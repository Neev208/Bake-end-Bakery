import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronRight } from "lucide-react";

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryMap = {
    bread: "Bread & Rolls",
    pastries: "Pastries & Sweets",
    savoury: "Savoury & Snack Items",
    cakes: "Cakes"
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const dbProducts = Array.isArray(response.data) ? response.data : response.data.products;
           
        const categoryName = categoryMap[id];
        const filtered = dbProducts.filter(item => item.cat === categoryName);
        
        setProducts(filtered);
      } catch (error) {
        console.error("❌ Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#4A3728] pt-32 pb-24 px-6 lg:px-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#C2A382] font-mono tracking-[0.3em] uppercase text-xs font-black mb-4 block">
            Artisanal Selection
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#4A3728] capitalize leading-none">
            {categoryMap[id]?.split(' & ')[0] || id} <span className="text-[#C2A382] italic font-light">{categoryMap[id]?.split(' & ')[1] ? `& ${categoryMap[id].split(' & ')[1]}` : 'Collection'}</span>
          </h1>
        </motion.div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#C2A382]/20 border-t-[#4A3728] rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          products.map((item) => (
            <Link to={`/product/${item._id || item.id}`} key={item._id || item.id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-[#C2A382]/10 hover:shadow-2xl hover:shadow-[#4A3728]/10 transition-all duration-500 cursor-pointer"
              >
                {/* Image Container */}
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={item.img.startsWith('http') ? item.img : `http://localhost:5000/uploads/${item.img}`} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-5 right-5 bg-[#4A3728] text-[#FFFDF5] px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                    {item.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-serif font-bold group-hover:text-[#C2A382] transition-colors duration-300">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-[#5F5248] text-sm mb-6 line-clamp-2 leading-relaxed opacity-80">
                    {item.desc || "Experience the perfect blend of tradition and taste with our artisanal creations."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-[#4A3728]/5">
                    <span className="text-[#C2A382] text-[10px] font-black uppercase tracking-widest">
                      View Details
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#4A3728]/5 flex items-center justify-center group-hover:bg-[#4A3728] group-hover:text-[#FFFDF5] transition-all duration-300">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-32 border-2 border-dashed border-[#C2A382]/20 rounded-[3rem]">
            <h2 className="text-2xl font-serif italic text-[#5F5248]">No artisanal items found in this category.</h2>
            <Link to="/products" className="mt-6 inline-block text-[#C2A382] font-black uppercase tracking-widest text-xs border-b-2 border-[#C2A382] pb-1">
              Back to Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;