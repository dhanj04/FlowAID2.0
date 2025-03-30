import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

const TermsOfService = () => {
  return (
    <Layout>
      <Head>
        <title>Terms of Service - FlowAID</title>
        <meta name="description" content="Terms of Service for FlowAID healthcare management system" />
      </Head>
      
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          </div>
          
          <div className="p-6 md:p-8 prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: March 30, 2025
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">1. Acceptance of Terms</h2>
            <p>
              Welcome to FlowAID. By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">2. Use License</h2>
            <p>
              Permission is granted to temporarily use FlowAID for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on FlowAID</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">3. Disclaimer</h2>
            <p>
              The materials on FlowAID are provided on an 'as is' basis. FlowAID makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">4. Limitations</h2>
            <p>
              In no event shall FlowAID or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FlowAID, even if FlowAID or a FlowAID authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on FlowAID could include technical, typographical, or photographic errors. FlowAID does not warrant that any of the materials on its website are accurate, complete or current. FlowAID may make changes to the materials contained on its website at any time without notice. However FlowAID does not make any commitment to update the materials.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">6. Links</h2>
            <p>
              FlowAID has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by FlowAID of the site. Use of any such linked website is at the user's own risk.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">7. Modifications</h2>
            <p>
              FlowAID may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
