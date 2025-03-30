import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarIcon, 
  UserIcon, 
  TagIcon, 
  ArrowLongRightIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
  featured?: boolean;
}

const Blog = () => {
  
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Revolutionizing Healthcare with AI-Powered Queue Management',
      excerpt: 'Learn how artificial intelligence is transforming patient flow and reducing wait times in modern healthcare facilities.',
      date: 'March 28, 2025',
      author: 'Dr. Sarah Johnson',
      category: 'AI Technology',
      imageUrl: '/images/blog/ai-healthcare.jpg',
      featured: true
    },
    {
      id: '2',
      title: 'Improving Patient Experience Through Efficient Resource Allocation',
      excerpt: 'Discover how smart resource allocation can dramatically improve patient satisfaction and operational efficiency.',
      date: 'March 25, 2025',
      author: 'Michael Chen',
      category: 'Patient Care',
      imageUrl: '/images/blog/patient-experience.jpg'
    },
    {
      id: '3',
      title: 'The Future of Predictive Analytics in Healthcare',
      excerpt: 'Explore how predictive analytics is helping healthcare providers anticipate patient needs and optimize care delivery.',
      date: 'March 20, 2025',
      author: 'Dr. Rachel Williams',
      category: 'Data Analytics',
      imageUrl: '/images/blog/predictive-analytics.jpg'
    },
    {
      id: '4',
      title: 'Case Study: Memorial Hospital Reduces Wait Times by 45%',
      excerpt: 'See how Memorial Hospital implemented FlowAID to dramatically reduce patient wait times and improve staff satisfaction.',
      date: 'March 15, 2025',
      author: 'James Rodriguez',
      category: 'Case Studies',
      imageUrl: '/images/blog/case-study.jpg'
    },
    {
      id: '5',
      title: 'Best Practices for Implementing Queue Management Systems',
      excerpt: 'A comprehensive guide to successfully implementing and optimizing queue management systems in healthcare settings.',
      date: 'March 10, 2025',
      author: 'Emily Parker',
      category: 'Implementation',
      imageUrl: '/images/blog/best-practices.jpg'
    },
    {
      id: '6',
      title: 'The Impact of Real-Time Data on Clinical Decision Making',
      excerpt: 'How access to real-time patient and resource data is transforming clinical decision making and improving outcomes.',
      date: 'March 5, 2025',
      author: 'Dr. Thomas Lee',
      category: 'Clinical Insights',
      imageUrl: '/images/blog/real-time-data.jpg'
    }
  ];

  const categories = [
    'All Categories',
    'AI Technology',
    'Patient Care',
    'Data Analytics',
    'Case Studies',
    'Implementation',
    'Clinical Insights'
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <Layout>
      <Head>
        <title>Blog - FlowAID</title>
        <meta name="description" content="Latest insights and updates from FlowAID healthcare management system" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Blog Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            FlowAID Blog
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Insights, updates, and best practices for healthcare queue management and AI-driven patient care
          </p>
        </div>

        {/* Search and Categories */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="relative w-full md:w-72 mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Search articles..."
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-3 py-1 text-sm rounded-full ${
                  index === 0
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 md:hidden"></div>
                {/* Placeholder for image - in a real app, use actual images */}
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">Featured Article Image</span>
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                  <span className="mx-2">•</span>
                  <span>{featuredPost.category}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{featuredPost.date}</span>
                  <span className="mx-2">•</span>
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>{featuredPost.author}</span>
                </div>
                <Link
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                >
                  Read Article <ArrowLongRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 relative">
                {/* Placeholder for image - in a real app, use actual images */}
                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">Article Image</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <TagIcon className="h-3 w-3 mr-1" />
                  <span>{post.category}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <UserIcon className="h-3 w-3 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <Link
                  href={`/blog/${post.id}`}
                  className="mt-4 inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium"
                >
                  Read More <ArrowLongRightIcon className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 md:p-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Stay Updated with FlowAID Insights
            </h2>
            <p className="text-blue-100 mb-6">
              Subscribe to our newsletter to receive the latest articles, case studies, and updates directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
              />
              <button
                type="button"
                className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-blue-200 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
