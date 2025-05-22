import React from 'react';
import { motion } from "framer-motion";

function Service() {
  const services = [
    {
      title: "Equipment Rental",
      description: "Access modern farming equipment without heavy investment",
      icon: "🚜"
    },
    {
      title: "Technical Support",
      description: "24/7 expert assistance for equipment operation",
      icon: "🔧"
    },
    {
      title: "Flexible Booking",
      description: "Daily, weekly, and monthly rental options available",
      icon: "📅"
    },
    {
      title: "Insurance Coverage",
      description: "Complete protection for your rental period",
      icon: "🛡️"
    }
  ];

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Our Services
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive solutions for modern farming needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg 
                       transition-shadow duration-300"
            >
              <div className="text-3xl mb-3">{service.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Service;