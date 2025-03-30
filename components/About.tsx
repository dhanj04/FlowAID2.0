import React from 'react';
import { useIntersectionObserver } from '../hooks';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  const { ref: sectionRef, isVisible: isSectionVisible } = useIntersectionObserver();

  const technologies = [
    "Machine Learning", 
    "Neural Networks", 
    "Python", 
    "TensorFlow", 
    "React",
    "Node.js",
    "Azure ML",
    "Healthcare APIs",
    "FHIR Integration",
    "HL7",
    "HIPAA Compliant",
    "Real-time Analytics"
  ];

  const coreValues = [
    {
      title: "Patient-Centered",
      description: "We place patients at the center of everything we do, ensuring our solutions reduce frustration, anxiety, and waiting times."
    },
    {
      title: "Data-Driven Innovation",
      description: "We leverage cutting-edge machine learning and data science to continuously improve healthcare queue management."
    },
    {
      title: "Healthcare Expertise",
      description: "Our team combines deep healthcare domain knowledge with technical expertise to solve real-world clinical challenges."
    },
    {
      title: "Measurable Impact",
      description: "We focus on delivering solutions with quantifiable improvements in operational efficiency and patient satisfaction."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      } 
    }
  };

  return (
    <section 
      id="about" 
      ref={sectionRef as React.RefObject<HTMLElement>} 
      className="py-24 bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
            About flowAID
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
            Transforming healthcare experiences through intelligent queue optimization
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isSectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-xl h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
              </div>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  flowAID was founded in 2020 with a clear mission: to eliminate the frustration of long wait times in healthcare settings through intelligent queue optimization.
                </p>
                <p>
                  We've assembled a team of healthcare professionals, data scientists, and software engineers who understand the challenges faced by both patients and providers in busy healthcare environments.
                </p>
                <p>
                  Our AI-powered platform analyzes multiple factors to predict wait times, optimize staff allocation, and provide real-time updates to patients – reducing stress and improving satisfaction for everyone involved.
                </p>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Our Technology</h4>
                <motion.div 
                  className="flex flex-wrap gap-2" 
                  variants={containerVariants}
                  initial="hidden"
                  animate={isSectionVisible ? "visible" : "hidden"}
                >
                  {technologies.map((tech, index) => (
                    <motion.span 
                      key={index}
                      variants={itemVariants}
                      className="px-4 py-2 bg-white dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isSectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-xl h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Values</h3>
              </div>
              
              <div className="space-y-8">
                {coreValues.map((value, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                    className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary before:to-secondary"
                  >
                    <span className="absolute left-0 top-0 w-2 h-2 rounded-full bg-primary transform -translate-x-1/2"></span>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{value.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-8 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Join Leading Healthcare Providers</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                flowAID is trusted by hospitals, clinics, and healthcare systems across the country. Our solution has been implemented in over 120 healthcare facilities, helping them serve patients more efficiently.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-primary mb-1">94%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Patient satisfaction</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-primary mb-1">31%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Wait time reduction</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-primary mb-1">120+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Facilities using flowAID</div>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/images/healthcare-team.jpg" 
                alt="Healthcare team using flowAID" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80";
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}