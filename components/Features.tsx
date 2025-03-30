import React, { useRef } from 'react';
import { useIntersectionObserver } from '../hooks';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  UserGroupIcon, 
  CogIcon, 
  ChartBarIcon,
  DevicePhoneMobileIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="rounded-full bg-primary-50 dark:bg-primary-900/20 p-3 w-14 h-14 flex items-center justify-center mb-6">
        <div className="text-primary dark:text-primary-400 w-8 h-8">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
    </motion.div>
  );
};

export default function Features() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const features = [
    {
      icon: <ClockIcon className="w-full h-full" />,
      title: "Real-time Wait Time Prediction",
      description: "Our AI algorithm accurately predicts wait times based on current queue status, historical data, and patient complexity factors."
    },
    {
      icon: <UserGroupIcon className="w-full h-full" />,
      title: "Smart Queue Management",
      description: "Automatically prioritize patients based on urgency, appointment type, and resource availability to optimize patient flow."
    },
    {
      icon: <CogIcon className="w-full h-full" />,
      title: "Intelligent Resource Allocation",
      description: "Dynamically adjust staff assignments and room allocations to respond to changing demands throughout the day."
    },
    {
      icon: <ChartBarIcon className="w-full h-full" />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into patient flow patterns, peak hours, and bottlenecks with actionable recommendations."
    },
    {
      icon: <DevicePhoneMobileIcon className="w-full h-full" />,
      title: "Patient Mobile App",
      description: "Patients can check in remotely, receive real-time updates, and get accurate wait time notifications on their mobile devices."
    },
    {
      icon: <BellAlertIcon className="w-full h-full" />,
      title: "Smart Notifications",
      description: "Automated alerts for patients and staff to ensure smooth operations and improved communication throughout the visit process."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
            Key Features
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
            flowAID combines advanced AI with intuitive design to transform healthcare queue management
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>
      </div>
      
      {/* Bottom Wave Decoration */}
      <div className="w-full overflow-hidden mt-20">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-20 text-white dark:text-gray-800 fill-current"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
} 