import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import ModelDashboard from '../components/ModelDashboard';

const ModelPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>AI Model | FlowAID Healthcare</title>
        <meta name="description" content="AI Model management and predictions for FlowAID Healthcare" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Model Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Train, monitor, and test the AI model that powers wait time predictions and resource allocation
          </p>
        </div>

        <ModelDashboard />
      </motion.div>
    </Layout>
  );
};

export default ModelPage;
