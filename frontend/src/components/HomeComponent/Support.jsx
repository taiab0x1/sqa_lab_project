import React from 'react';
import { motion } from 'framer-motion';
import vector11 from "../../image/vector11.svg";
import vector22 from "../../image/vector22.svg";
import vector33 from "../../image/vector33.svg";

function Support() {
  const supportItems = [
    {
      icon: vector11,
      title: "24×7 Support",
      description: "We're just one call away"
    },
    {
      icon: vector22,
      title: "Secure Transactions",
      description: "Safe and reliable payments"
    },
    {
      icon: vector33,
      title: "Quality Assurance",
      description: "Verified equipment only"
    }
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {supportItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg 
                       transition-shadow duration-300 w-full md:w-72"
            >
              <img 
                src={item.icon} 
                alt={item.title} 
                className="h-10 w-10 mx-auto mb-4" 
              />
              <h3 className="text-lg font-semibold text-center mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Support;