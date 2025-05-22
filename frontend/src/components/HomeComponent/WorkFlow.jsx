import React from 'react';
import videoPic from "../../image/videoPic.jpeg";
import { motion } from "framer-motion";

function WorkFlow() {
  const steps = [
    "Sign-up to the platform",
    "Post your ad for the off-season",
    "Provide equipment details",
    "Explore and filter lists of equipment",
    "Check an available time slot",
    "Chat with the owner and make a booking",
    "Stay updated by SMS"
  ];

  return (
    <section className="bg-green-600 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            How Green Farming Works?
          </h2>
          <p className="text-sm font-medium text-white opacity-90">
            Take a Look at our Platform Demo
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <ol className="space-y-3 text-white">
              {steps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-lg flex items-center gap-3"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-green-600 flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ol>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="w-full md:w-1/2"
          >
            <img
              src={videoPic}
              alt="Platform demo"
              className="rounded-lg shadow-xl w-full max-w-md mx-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default WorkFlow;