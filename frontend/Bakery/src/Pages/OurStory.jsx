import React from "react";
import { motion } from "framer-motion";
import { Thermometer, Globe, Heart, Zap } from "lucide-react";

const DevelopmentStory = () => {
  const milestones = [
    {
      year: "2021",
      title: "The First Batch",
      desc: "Started in a small home kitchen with a single sourdough starter named 'The Source'.",
      icon: <Heart className="text-[#C2A382]" size={24} />
    },
    {
      year: "2023",
      title: "Precision Engineering",
      desc: "Developed custom IoT sensors to monitor fermentation humidity and temperature 24/7.",
      icon: <Thermometer className="text-[#4A3728]" size={24} />
    },
    {
      year: "2025",
      title: "Digital Expansion",
      desc: "Launched our first full-stack MERN platform, bringing artisan goods to the global digital market.",
      icon: <Globe className="text-[#C2A382]" size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#4A3728] pt-24 pb-16 px-4 md:pt-40 md:pb-24 md:px-6 overflow-hidden">
      
      {/* --- VISIONARY HERO --- */}
      <section className="max-w-7xl mx-auto text-center mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-[#C2A382] font-mono tracking-[0.3em] uppercase text-xs md:text-sm font-black">
            Our Genesis
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold mt-4 md:mt-6 leading-tight">
            Born in <span className="italic font-light text-[#C2A382]">Flour</span> <br /> 
            Refined in <span className="text-transparent relative" style={{ WebkitTextStroke: '1.5px #4A3728' }}>
              Code
            </span>
          </h1>
        </motion.div>
      </section>

      {/* --- THE DEVELOPMENT NARRATIVE --- */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 md:mb-40">
        
        {/* Image Card with Champagne Border */}
        <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border-8 border-[#C2A382]/10 order-2 lg:order-1 shadow-2xl shadow-[#4A3728]/10">
          <img 
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200" 
            alt="Artisan hands with dough" 
            className="w-full h-full object-cover grayscale-[20%] sepia-[20%] hover:sepia-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/20 via-transparent to-transparent" />
        </div>

        {/* Text Content */}
        <div className="space-y-10 md:space-y-12 order-1 lg:order-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 md:mb-6 text-[#4A3728] border-l-4 border-[#C2A382] pl-6 transition-colors">
              The Problem
            </h2>
            <p className="text-[#5F5248] text-base md:text-lg leading-relaxed font-medium">
              We noticed that traditional bakeries often struggled with consistency, while industrial bakeries lacked soul. Our founder, a computer engineer with a passion for pastry, saw a solution in the intersection of these two worlds.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="group"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 md:mb-6 text-[#4A3728] border-l-4 border-[#C2A382] pl-6 transition-colors">
              The Development
            </h2>
            <p className="text-[#5F5248] text-base md:text-lg leading-relaxed font-medium">
              Developing Bake-end Delights wasn't just about baking; it was about building a "Bakery-as-a-Platform." We utilized the MERN stack to create a seamless bridge between our kitchen and our customers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- MILESTONE TIMELINE --- */}
      <section className="max-w-7xl mx-auto px-2 md:px-4 mb-24 md:mb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {milestones.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} 
              viewport={{ once: true }}
              className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-[#C2A382]/20 hover:border-[#C2A382] transition-all group shadow-sm hover:shadow-xl"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#4A3728]/5 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-[#C2A382] transition-all">
                {React.cloneElement(item.icon, { 
                  className: "transition-colors group-hover:text-white" 
                })}
              </div>
              <span className="text-[#C2A382] font-mono text-xs md:text-sm block mb-1 font-black">
                {item.year}
              </span>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#4A3728]">
                {item.title}
              </h3>
              <p className="text-[#5F5248] text-sm md:text-base leading-relaxed opacity-80">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- THE TECH STACK STRIP --- */}
      <section className="max-w-5xl mx-auto py-12 md:py-20 px-4 bg-[#4A3728] rounded-[2rem] md:rounded-[3rem] border border-[#C2A382]/30 text-center shadow-2xl">
        <h3 className="text-sm md:text-xl font-mono uppercase tracking-[0.5em] mb-8 md:mb-10 text-[#C2A382] opacity-80 font-bold">
          Powered By
        </h3>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:gap-12 items-center">
            <span className="text-lg md:text-2xl font-bold italic text-white/40 hover:text-[#C2A382] transition-colors cursor-default">MongoDB</span>
            <span className="text-lg md:text-2xl font-bold italic text-white/40 hover:text-[#C2A382] transition-colors cursor-default">Express</span>
            <span className="text-lg md:text-2xl font-bold italic underline decoration-[#C2A382] text-[#FFFDF5]">React</span>
            <span className="text-lg md:text-2xl font-bold italic text-white/40 hover:text-[#C2A382] transition-colors cursor-default">Node.js</span>
        </div>
      </section>

    </div>
  );
};

export default DevelopmentStory;