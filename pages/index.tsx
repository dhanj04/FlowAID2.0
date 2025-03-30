import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ModernBadge from '../components/ui/ModernBadge';
import ModernButton from '../components/ui/ModernButton';
import ModernCard from '../components/ui/ModernCard';
import { 
  ClockIcon, 
  ChartBarIcon, 
  UsersIcon, 
  ShieldCheckIcon,
  BoltIcon,
  SparklesIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Head>
        <title>FlowAID - Healthcare Queue Optimization</title>
        <meta name="description" content="AI-powered healthcare queue optimization system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main className="w-full">

        {/* Hero Section with Modern UI */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20"
              style={{ opacity: 0.9 }}
            />
            
            {/* Animated background shapes */}
            <motion.div 
              className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary-200/30 dark:bg-primary-500/10 blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 15,
                ease: 'easeInOut',
              }}
            />
            
            <motion.div 
              className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-secondary-200/30 dark:bg-secondary-500/10 blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: 'easeInOut',
              }}
            />
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('/images/geometric-pattern.svg')] bg-repeat opacity-5 dark:opacity-10" />
          </div>
          
          {/* Hero Content */}
          <div className="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <ModernBadge className="mb-6" variant="primary" size="md">
                  AI-Powered Healthcare Queue Management
                </ModernBadge>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <span>Intelligent </span>
                <span className="text-gradient-cool">Patient Flow</span>
                <span> Management</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Revolutionize your healthcare facility with AI-driven queue optimization, 
                reducing wait times by up to 60% while improving patient satisfaction and 
                resource utilization.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <ModernButton 
                  variant="gradient-cool" 
                  size="lg" 
                  rounded="lg"
                  href="/signup"
                >
                  Get Started
                </ModernButton>
                
                <ModernButton 
                  variant="outline" 
                  size="lg" 
                  rounded="lg"
                  href="/dashboard"
                >
                  View Dashboard
                </ModernButton>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <img 
                src="/images/healthcare-queue-3d.svg" 
                alt="Healthcare Queue Visualization" 
                className="w-full h-auto max-w-lg mx-auto"
              />
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</span>
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </section>
        
        {/* Features Section with Modern UI */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <ModernBadge variant="secondary" size="md" className="mb-4">
                Key Features
              </ModernBadge>
              <h2 className="text-4xl font-bold mb-4">Transforming Healthcare Operations</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our comprehensive platform provides everything you need to optimize patient flow 
                and resource allocation in your healthcare facility.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <ModernCard 
                className="h-full" 
                hoverEffect 
                animate
              >
                <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-6 inline-block">
                  <BoltIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered Queue Optimization</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our advanced algorithms predict patient flow and optimize resource allocation in real-time.
                </p>
              </ModernCard>
              
              {/* Feature 2 */}
              <ModernCard 
                className="h-full" 
                hoverEffect 
                animate
              >
                <div className="p-4 rounded-full bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 mb-6 inline-block">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Real-time Analytics Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor key metrics and performance indicators with intuitive visualizations and reports.
                </p>
              </ModernCard>
              
              {/* Feature 3 */}
              <ModernCard 
                className="h-full" 
                hoverEffect 
                animate
              >
                <div className="p-4 rounded-full bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 mb-6 inline-block">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Patient-Centric Experience</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Improve patient satisfaction with accurate wait time estimates and digital queue management.
                </p>
              </ModernCard>
              
              {/* Feature 4 */}
              <ModernCard 
                className="h-full" 
                hoverEffect 
                animate
              >
                <div className="p-4 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 mb-6 inline-block">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Seamless Integration</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Easily integrates with your existing healthcare systems and electronic health records.
                </p>
              </ModernCard>
              
              {/* Feature 5 - Analytics */}
              <ModernCard 
                className="h-full" 
                hoverEffect 
                animate
              >
                <div className="p-4 rounded-full bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 mb-6 inline-block">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Reduced Wait Times</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Decrease patient wait times by up to 60% with intelligent scheduling and prioritization.
                </p>
              </ModernCard>
              
              {/* Feature 6 */}
              <ModernCard 
                className="h-full" 
                hoverEffect 
                animate
              >
                <div className="p-4 rounded-full bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 mb-6 inline-block">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Patient-Centric Experience</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Improve patient satisfaction with accurate wait time estimates and digital queue management.
                </p>
              </ModernCard>
              
              {/* Feature 7 */}
              <ModernCard 
                className="h-full" 
                hoverEffect 
                animate
              >
                <div className="p-4 rounded-full bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 mb-6 inline-block">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Resource Allocation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Optimize staff and facility resources based on real-time demand and historical patterns.
                </p>
              </ModernCard>
              
              {/* Feature 8 */}
              <ModernCard 
                className="h-full" 
                hoverEffect 
                animate
              >
                <div className="p-4 rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 mb-6 inline-block">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Compliant</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  HIPAA-compliant platform with enterprise-grade security for patient data protection.
                </p>
              </ModernCard>
              
              {/* Feature 9 */}
              <ModernCard 
                className="h-full" 
                hoverEffect 
                animate
              >
                <div className="p-4 rounded-full bg-danger-100 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 mb-6 inline-block">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">ML Model Training</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Continuously improving algorithms that adapt to your facility's unique patterns.
                </p>
              </ModernCard>
            </div>
          </div>
        </section>
        
        {/* Stats Section with Modern UI */}
        <section className="py-20 relative overflow-hidden">
          {/* Background with wave pattern */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-secondary-600/5 dark:from-primary-900/20 dark:to-secondary-900/20" />
            <img 
              src="/images/wave-pattern.svg" 
              alt="" 
              className="absolute bottom-0 left-0 w-full opacity-10 dark:opacity-5"
              aria-hidden="true"
            />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <ModernBadge variant="primary" size="md" className="mb-4">
                Impact
              </ModernBadge>
              <h2 className="text-4xl font-bold mb-4">Real Results for Healthcare Facilities</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our platform delivers measurable improvements in efficiency, patient satisfaction, and resource utilization.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Stat 1 */}
              <ModernCard 
                className="text-center" 
                glass 
                animate
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">60%</div>
                <div className="text-gray-600 dark:text-gray-300">Wait Time Reduction</div>
              </ModernCard>
              
              {/* Stat 2 */}
              <ModernCard 
                className="text-center" 
                glass 
                animate
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400">
                    <ChartBarIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">42%</div>
                <div className="text-gray-600 dark:text-gray-300">Efficiency Increase</div>
              </ModernCard>
              
              {/* Stat 3 */}
              <ModernCard 
                className="text-center" 
                glass 
                animate
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-success-600 dark:text-success-400 mb-2">94%</div>
                <div className="text-gray-600 dark:text-gray-300">Patient Satisfaction</div>
              </ModernCard>
              
              {/* Stat 4 */}
              <ModernCard 
                className="text-center" 
                glass 
                animate
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400">
                    <UserGroupIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-accent-600 dark:text-accent-400 mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-300">Facilities Using FlowAID</div>
              </ModernCard>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}