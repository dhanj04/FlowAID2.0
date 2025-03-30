import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Use native IntersectionObserver instead of the hook for better performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Key benefits to display
  const benefits = [
    "Reduce patient wait times by up to 60%",
    "Optimize staff allocation efficiency",
    "Improve patient satisfaction scores",
    "Real-time queue management and insights"
  ];

  return (
    <section 
      id="hero" 
      ref={sectionRef}
      className="min-h-screen w-full flex justify-center items-center relative overflow-hidden"
    >
      {/* Background gradient and elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 z-0">
        {/* Animated background elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-green-400/10 dark:bg-green-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
        
        {/* Modern SVG patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/images/geometric-pattern.svg" 
            alt="" 
            className="absolute w-full h-full object-cover opacity-10 dark:opacity-5" 
            aria-hidden="true"
          />
        </div>
        
        {/* Wave pattern at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
          <img 
            src="/images/wave-pattern.svg" 
            alt="" 
            className="w-full absolute bottom-0 left-0" 
            aria-hidden="true"
          />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center z-10">
        <motion.div 
          className="w-full md:w-1/2 md:pr-12 mb-12 md:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 font-medium text-sm">
              AI-Powered Healthcare Queue Management
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Patient Flow</span> Management
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            flowAID uses advanced AI algorithms to optimize patient queues, reduce wait times, and improve healthcare facility efficiency.
          </motion.p>
          
          {/* Benefits List */}
          <motion.div 
            className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                className="flex items-center p-3 rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2 mr-3 flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Button 
              href="/signup" 
              variant="gradient" 
              size="lg"
              rounded="full"
              className="shadow-xl shadow-primary/20 dark:shadow-primary/10"
            >
              Get Started Now
            </Button>
            <Button 
              href="/demo" 
              variant="outline" 
              size="lg"
              rounded="full"
              className="backdrop-blur-sm border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-800/30"
            >
              Request Demo
            </Button>
          </motion.div>

          <motion.div 
            className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">Trusted by leading healthcare providers:</p>
            <div className="flex flex-wrap gap-8 mt-4 grayscale opacity-70">
              <div className="h-8">
                <div className="h-full w-auto font-bold text-gray-400">MAYO CLINIC</div>
              </div>
              <div className="h-8">
                <div className="h-full w-auto font-bold text-gray-400">CLEVELAND CLINIC</div>
              </div>
              <div className="h-8">
                <div className="h-full w-auto font-bold text-gray-400">JOHNS HOPKINS</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative">
            <motion.div 
              className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-lg z-0"
              animate={isVisible ? { 
                rotate: [0, 10, 0], 
                x: [0, 10, 0],
                y: [0, -10, 0],
              } : {}}
              transition={{ 
                repeat: Infinity, 
                duration: 10,
                ease: "easeInOut"
              }}
            />
            
            <motion.div 
              className="absolute -bottom-8 -right-8 w-40 h-40 bg-green-100 dark:bg-green-900/20 rounded-full z-0"
              animate={isVisible ? { 
                rotate: [0, -10, 0], 
                x: [0, -15, 0],
                y: [0, 15, 0],
              } : {}}
              transition={{ 
                repeat: Infinity, 
                duration: 12,
                ease: "easeInOut"
              }}
            />
            
            {/* Dashboard Preview */}
            <div className="relative z-10 bg-gradient-to-br from-blue-500 to-green-600 rounded-2xl shadow-2xl overflow-hidden p-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-green-600 h-8 flex items-center justify-between px-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-white font-medium">flowAID Dashboard</div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                  </div>
                </div>
                <div className="p-5 bg-white dark:bg-gray-900">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">Hospital Queue Dashboard</div>
                        <div className="text-sm px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">Live</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Current Wait</div>
                          <div className="text-2xl font-bold text-primary">14 min</div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Patients</div>
                          <div className="text-2xl font-bold text-primary">23</div>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Efficiency</div>
                          <div className="text-2xl font-bold text-green-600">92%</div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Queue Status</div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full" style={{width: '60%'}}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded shadow-sm">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 mr-3"></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">Patient #{item}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">General Checkup</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-primary dark:text-blue-400">~8 min</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Wave bottom decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="w-full h-20 fill-current text-white dark:text-gray-900" preserveAspectRatio="none" viewBox="0 0 1440 74">
          <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z"></path>
        </svg>
      </div>
    </section>
  );
}