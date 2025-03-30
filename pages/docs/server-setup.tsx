import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ServerSetup() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head>
        <title>Server Setup Guide - flowAID</title>
        <meta name="description" content="Instructions for setting up and running the flowAID backend server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Server Setup Guide</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              How to start the flowAID backend server
            </p>
          </div>
          <Link href="/login" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-600">
            Back to Login
          </Link>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-6 sm:px-0"
          >
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  "Could not connect to the server" error
                </h2>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    This error occurs when the frontend application cannot connect to the backend server.
                    The flowAID application requires both a frontend (Next.js) and a backend (Node.js Express) server to run properly.
                  </p>

                  <h3>Option 1: Start the server manually</h3>
                  <p>To start the backend server, follow these steps:</p>
                  
                  <ol>
                    <li>Open a new terminal window</li>
                    <li>Navigate to the project root directory</li>
                    <li>Run the following commands:</li>
                  </ol>

                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                    <code>
                      cd server{'\n'}
                      npm install  # Only needed first time{'\n'}
                      node index.js
                    </code>
                  </pre>

                  <p>
                    You should see output similar to:
                  </p>

                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                    <code>
                      Server running on port 5000{'\n'}
                      Environment: development
                    </code>
                  </pre>

                  <h3>Option 2: Use the development script</h3>
                  <p>
                    Alternatively, you can use the development script that starts both the frontend and backend:
                  </p>

                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                    <code>
                      npm run dev:full
                    </code>
                  </pre>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 my-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                          <strong>Note:</strong> Make sure you have installed all dependencies with <code>npm install</code> before starting the server.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3>Server Configuration</h3>
                  <p>
                    The server uses environment variables for configuration. These are set in the <code>.env</code> 
                    or <code>.env.local</code> file in the root directory. The essential variables are:
                  </p>

                  <ul>
                    <li><code>PORT</code> - The port the server runs on (default: 5000)</li>
                    <li><code>JWT_SECRET</code> - Secret key for JWT authentication</li>
                    <li><code>FIREBASE_*</code> - Firebase configuration variables</li>
                  </ul>

                  <h3>Troubleshooting</h3>
                  <p>If you're still having issues, check these common problems:</p>

                  <ol>
                    <li>
                      <strong>Port already in use</strong> - If port 5000 is already being used by another application,
                      you can change the port in the .env file.
                    </li>
                    <li>
                      <strong>Dependencies not installed</strong> - Make sure to run <code>npm install</code> in both the root
                      and the server directories.
                    </li>
                    <li>
                      <strong>Firebase configuration</strong> - The application is set up with demo Firebase credentials.
                      For production use, you should set up your own Firebase project.
                    </li>
                  </ol>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 my-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                          For more detailed troubleshooting or configuration options, refer to the README file in the project repository.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 