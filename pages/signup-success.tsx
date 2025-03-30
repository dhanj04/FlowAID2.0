import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SignupSuccess() {
  const router = useRouter();
  const { email } = router.query;
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (email && typeof email === 'string') {
      setUserEmail(decodeURIComponent(email));
    }
  }, [email]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen font-['Product_Sans', 'sans-serif']">
      <Head>
        <title>Account Created - flowAID</title>
        <meta name="description" content="Your flowAID account has been created" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Product+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden md:max-w-2xl m-4 transition-all duration-300 hover:shadow-xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4"
              >
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Account Created!</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                Thank you for signing up with flowAID
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    We've sent a confirmation email to <strong>{userEmail || 'your email address'}</strong>. 
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Once your email is verified, you can sign in to access your account.
              </p>
              
              <Link href="/login" className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors duration-300">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
