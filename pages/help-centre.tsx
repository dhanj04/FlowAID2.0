import React, { useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { 
  QuestionMarkCircleIcon, 
  SearchIcon, 
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

const HelpCentre = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});

  const faqCategories = [
    { id: 'all', name: 'All Questions' },
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'queue', name: 'Queue Management' },
    { id: 'model', name: 'AI Model' },
    { id: 'account', name: 'Account' },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'How do I add a new patient to the queue?',
      answer: 'You can add a new patient to the queue by clicking the "Add Patient" button on the Queue Dashboard. Fill in the required information in the form and click "Submit" to add the patient to the queue.'
    },
    {
      question: 'How does the wait time prediction work?',
      answer: 'Our AI model analyzes historical data, current queue status, staff availability, and patient priority to estimate wait times. The model is continuously learning and improving its predictions based on actual outcomes.'
    },
    {
      question: 'Can I customize the dashboard view?',
      answer: 'Yes, you can customize the dashboard by clicking on the settings icon in the top right corner of the dashboard. From there, you can choose which widgets to display and rearrange them according to your preferences.'
    },
    {
      question: 'How do I train the AI model?',
      answer: 'You can train the AI model by navigating to the AI Model page and clicking on the "Train Model" button. The training process uses your facility\'s historical data to improve the model\'s predictions.'
    },
    {
      question: 'What do the different patient priorities mean?',
      answer: 'Patient priorities are categorized as Low, Medium, High, and Critical. These priorities are used to determine the order in which patients are seen. Critical patients are given the highest priority, followed by High, Medium, and Low priority patients.'
    },
    {
      question: 'How can I reset my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you a link to reset your password.'
    },
    {
      question: 'Can I export queue data for analysis?',
      answer: 'Yes, you can export queue data by navigating to the Queue Analytics page and clicking on the "Export Data" button. You can choose to export the data in CSV or Excel format.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take data security very seriously. All data is encrypted both in transit and at rest. We comply with all relevant data protection regulations. For more information, please see our Privacy Policy.'
    },
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Head>
        <title>Help Centre - FlowAID</title>
        <meta name="description" content="Get help with FlowAID healthcare management system" />
      </Head>
      
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl mb-10 overflow-hidden">
          <div className="px-6 py-12 md:py-20 md:px-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">How can we help you?</h1>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Find answers to common questions about FlowAID or contact our support team for assistance.
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Documentation</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Comprehensive guides and documentation for all FlowAID features
                </p>
                <Link href="/documentation" className="text-blue-600 dark:text-blue-400 font-medium inline-flex items-center mt-2 hover:underline">
                  Browse Documentation
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                <VideoCameraIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Video Tutorials</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Watch step-by-step tutorials to master FlowAID features
                </p>
                <Link href="/tutorials" className="text-purple-600 dark:text-purple-400 font-medium inline-flex items-center mt-2 hover:underline">
                  Watch Tutorials
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                <UserGroupIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Community Support</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Connect with other FlowAID users and share knowledge
                </p>
                <Link href="/community" className="text-green-600 dark:text-green-400 font-medium inline-flex items-center mt-2 hover:underline">
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center mb-6">
            <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          
          <div className="flex flex-wrap mb-6 gap-2">
            {faqCategories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  {expandedFaqs[index] ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                
                {expandedFaqs[index] && (
                  <div className="p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
            
            {filteredFaqs.length === 0 && (
              <div className="text-center p-6">
                <p className="text-gray-600 dark:text-gray-400">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-teal-700 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="p-8 md:w-2/3">
              <div className="flex items-center mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white mr-2" />
                <h2 className="text-2xl font-bold text-white">Still need help?</h2>
              </div>
              <p className="text-green-100 mb-6">
                Our support team is here to help. Reach out to us with any questions or concerns.
              </p>
              <Link href="/contact" className="inline-block px-6 py-3 bg-white text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors">
                Contact Support
              </Link>
            </div>
            <div className="md:w-1/3 bg-white dark:bg-gray-800 p-8 flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Business Hours</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Monday - Friday<br />
                9:00 AM - 6:00 PM EST
              </p>
              <div className="mt-4 text-center">
                <p className="text-gray-500 dark:text-gray-400">Average Response Time</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">Under 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCentre;
