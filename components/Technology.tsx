import React from 'react';
import { useIntersectionObserver } from '../hooks';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Technology() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const techSteps = [
    {
      title: "Data Collection & Processing",
      description: "Our system collects real-time data from multiple sources including check-ins, patient status, historical trends, and staff availability. This data is processed and normalized to create a comprehensive operational view.",
      icon: "/icons/data-processing.svg"
    },
    {
      title: "ML Model Training",
      description: "We utilize a combination of supervised learning and reinforcement learning techniques to train models that learn from historical patterns and continuously improve over time.",
      icon: "/icons/ml-model.svg"
    },
    {
      title: "Predictive Analytics",
      description: "Our algorithm analyzes multiple variables to predict patient flow bottlenecks, optimal resource allocation, and accurate wait times with over 95% accuracy.",
      icon: "/icons/predictive-analytics.svg"
    },
    {
      title: "Queue Optimization",
      description: "Using advanced mathematical models, our system dynamically reorders queues based on urgency, appointment type, resource availability, and predicted total visit duration.",
      icon: "/icons/queue-optimization.svg"
    }
  ];

  const algorithmFeatures = [
    "Multi-factor patient classification",
    "Dynamic priority assignment",
    "Resource constraint modeling",
    "Real-time waiting time prediction",
    "Bottleneck identification",
    "Staff allocation optimization",
    "Anomaly detection"
  ];

  return (
    <section id="technology" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
            Our Technology
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
            Powered by advanced machine learning algorithms and real-time data processing
          </p>
        </motion.div>

        {/* ML Technology Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pr-10"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Our Machine Learning Approach
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              flowAID employs a sophisticated machine learning model that combines multiple algorithmic approaches to optimize healthcare queues and significantly reduce patient waiting times.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our proprietary queue optimization model analyzes historical data patterns, real-time facility loads, staff availability, procedure types, and patient-specific factors to create an intelligent queueing system that dynamically adjusts to changing conditions.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                Algorithm Features:
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {algorithmFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl h-full">
              <div className="p-1 bg-gradient-to-r from-primary to-secondary">
                <div className="bg-white dark:bg-gray-900 p-5 h-full">
                  <div className="flex space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg mb-4 overflow-hidden">
                    <div className="flex items-center justify-center h-full">
                      <code className="text-green-400 text-xs md:text-sm font-mono p-4 overflow-auto max-h-full w-full">
                        <div className="text-blue-400">class QueueOptimizer:</div>
                        <div className="pl-4 text-gray-400"># ML-based patient queue optimization</div>
                        <div className="pl-4">def <span className="text-yellow-300">__init__</span>(self, parameters):</div>
                        <div className="pl-8">self.model = self.<span className="text-yellow-300">load_model</span>()</div>
                        <div className="pl-8">self.parameters = parameters</div>
                        <br/>
                        <div className="pl-4">def <span className="text-yellow-300">predict_wait_time</span>(self, patient_data):</div>
                        <div className="pl-8">features = self.<span className="text-yellow-300">extract_features</span>(patient_data)</div>
                        <div className="pl-8">return self.model.predict(features)</div>
                        <br/>
                        <div className="pl-4">def <span className="text-yellow-300">optimize_queue</span>(self, current_queue, resources):</div>
                        <div className="pl-8">priorities = self.<span className="text-yellow-300">calculate_priorities</span>(current_queue)</div>
                        <div className="pl-8">return self.<span className="text-yellow-300">reorder_queue</span>(priorities, resources)</div>
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Process Steps */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-10 text-center">
          How Our Technology Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 mb-6 relative">
                {/* Placeholder for actual icons */}
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -right-4 -top-4 w-8 h-8 bg-primary rounded-full text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 