import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Custom404() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 5000);

    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
    
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 px-4">
      <Head>
        <title>Page Not Found | FlowAID Healthcare</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>
      
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto my-6" />
          <h2 className="text-3xl font-semibold text-white">Page Not Found</h2>
          <p className="mt-4 text-gray-300 max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <p className="mt-2 text-gray-400">
            Redirecting to home page in <span className="text-primary font-semibold">{countdown}</span> second{countdown !== 1 ? 's' : ''}...
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Go Home
          </Link>
        </motion.div>
        
        <motion.div
          className="mt-12 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p>Need help? <Link href="/contact" className="text-primary hover:underline cursor-pointer">Contact support</Link></p>
        </motion.div>
      </div>
    </div>
  );
}