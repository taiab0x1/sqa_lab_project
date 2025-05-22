import React from 'react';
import './equipment.css';
import { motion } from "framer-motion";

function Equipment() {
  const images = [
    {
      img: "https://s3.ap-south-1.amazonaws.com/www.beroni.in/farmease-app/categories/Tractors.jpg",
      title: "Tractors",
      description: "Modern tractors for efficient farming"
    },
    {
      img: "https://s3.ap-south-1.amazonaws.com/www.beroni.in/farmease-app/categories/Tillage_Equipment.jpg",
      title: "Tillage Equipment",
      description: "Efficient tools for soil preparation"
    },
    {
      img: "https://s3.ap-south-1.amazonaws.com/www.beroni.in/farmease-app/categories/Seeding_Equipment.jpg",
      title: "Seeding Equipments",
      description: "Advanced seeding solutions"
    },
    {
      img: "https://s3.ap-south-1.amazonaws.com/www.beroni.in/farmease-app/categories/Landscaping_Equipment.jpg",
      title: "Landscape Equipment",
      description: "Perfect tools for landscaping"
    },
    {
      img: "https://s3.ap-south-1.amazonaws.com/www.beroni.in/farmease-app/categories/Crop_Protection.jpg",
      title: "Crop Protection",
      description: "Protect your crops effectively"
    },
    {
      img: "https://s3.ap-south-1.amazonaws.com/www.beroni.in/farmease-app/categories/Harvest_Equipment.jpg",
      title: "Harvest Equipment",
      description: "Efficient harvesting tools"
    },
    {
      img: "https://s3.ap-south-1.amazonaws.com/www.beroni.in/farmease-app/categories/Post_Harvest.jpg",
      title: "Post Harvest",
      description: "Post-harvest processing equipment"
    },
    {
      img: "https://s3.ap-south-1.amazonaws.com/www.beroni.in/farmease-app/categories/Haulage.jpg",
      title: "Haulage",
      description: "Reliable haulage solutions"
    }
  ];
      
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Available Equipment
          </h2>
          <p className="text-xl text-gray-600">
            Browse our wide selection of farming equipment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={image.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group overflow-hidden rounded-xl shadow-lg"
            >
              <img 
                className="w-full h-64 object-cover transform group-hover:scale-110 
                         transition-transform duration-500"
                src={image.img} 
                alt={image.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {image.title}
                  </h3>
                  <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 
                              transition-opacity duration-300">
                    Click to explore
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Equipment;