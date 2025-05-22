import React from 'react';
import people from "../../image/people.svg";
import people1 from "../../image/people1.svg";
import { FaChartPie } from 'react-icons/fa';
import { motion } from 'framer-motion';

function State() {
  const stats = [
    {
      icon: <img src={people1} alt="Users" className="h-16 w-16" />,
      number: "1,567,890",
      label: "Latest number of acquired customers"
    },
    {
      icon: <img src={people} alt="Satisfaction" className="h-16 w-16" />,
      number: "4 out of 5",
      label: "Customers are satisfied with our services"
    },
    {
      icon: <FaChartPie className="text-green-600 text-5xl" />,
      number: "16% of Crop value",
      label: "Average Equipment Investments"
    }
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4">{stat.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{stat.number}</h3>
              <p className="text-gray-600 max-w-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default State;