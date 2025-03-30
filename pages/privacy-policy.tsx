import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy - FlowAID</title>
        <meta name="description" content="Privacy Policy for FlowAID healthcare management system" />
      </Head>
      
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          </div>
          
          <div className="p-6 md:p-8 prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: March 30, 2025
            </p>
            
            <p className="mt-4">
              At FlowAID, we take your privacy seriously. This Privacy Policy describes how we collect, use, and disclose your personal information when you use our services, website, and applications.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">1. Information We Collect</h2>
            <p>
              We collect several types of information for various purposes to provide and improve our service to you:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>
                <strong>Personal Data:</strong> While using our service, we may ask you to provide certain personally identifiable information that can be used to contact or identify you, including but not limited to email address, first name, last name, phone number, and address.
              </li>
              <li>
                <strong>Usage Data:</strong> We may also collect information on how the service is accessed and used. This may include information such as your computer's Internet Protocol address, browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
              </li>
              <li>
                <strong>Healthcare Data:</strong> As a healthcare management system, we may collect health-related information that is protected under applicable healthcare privacy laws.
              </li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">2. Use of Data</h2>
            <p>
              FlowAID uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features of our service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">3. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">4. Data Retention</h2>
            <p>
              We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your personal data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">5. Your Data Protection Rights</h2>
            <p>
              You have certain data protection rights. These include:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>The right to access, update or to delete the information we have on you</li>
              <li>The right of rectification</li>
              <li>The right to object</li>
              <li>The right of restriction</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">6. Children's Privacy</h2>
            <p>
              Our service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>By email: privacy@flowaid.example.com</li>
              <li>By visiting the contact page on our website</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
