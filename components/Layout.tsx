import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'FlowAID Healthcare',
  description = 'Optimizing patient flow and healthcare resource allocation'
}) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/images/healthcare-icons.svg" alt="Logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">FlowAID</span>
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className={`text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${router.pathname === '/dashboard' ? 'text-primary' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/model" 
                className={`text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${router.pathname === '/model' ? 'text-primary' : ''}`}
              >
                AI Model
              </Link>
              <Link 
                href="/dashboard/patient/appointments" 
                className={`text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${router.pathname.includes('/appointments') ? 'text-primary' : ''}`}
              >
                Appointments
              </Link>
              <Link 
                href="/profile" 
                className={`text-gray-700 dark:text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${router.pathname === '/profile' ? 'text-primary' : ''}`}
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} FlowAID Healthcare. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
