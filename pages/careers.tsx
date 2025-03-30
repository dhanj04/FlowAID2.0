import React, { useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon, 
  ChevronRightIcon,
  BuildingOfficeIcon,
  CodeBracketIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  datePosted: string;
  description: string;
}

const Careers = () => {
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  const jobListings: JobListing[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      datePosted: 'March 25, 2025',
      description: 'Design and build advanced applications for our healthcare management platform. Work with React, Next.js, and Node.js to develop new features and maintain existing ones.'
    },
    {
      id: '2',
      title: 'AI/ML Engineer',
      department: 'Data Science',
      location: 'San Francisco, CA',
      type: 'Full-time',
      datePosted: 'March 20, 2025',
      description: 'Develop and optimize machine learning models for patient wait time prediction and resource allocation. Experience with Python, TensorFlow, and healthcare data analytics required.'
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      datePosted: 'March 18, 2025',
      description: 'Create intuitive and accessible user experiences for healthcare professionals. Work closely with product managers and engineers to deliver beautiful, functional interfaces.'
    },
    {
      id: '4',
      title: 'Healthcare Solutions Consultant',
      department: 'Sales',
      location: 'New York, NY',
      type: 'Full-time',
      datePosted: 'March 15, 2025',
      description: 'Engage with healthcare organizations to understand their needs and demonstrate how FlowAID can solve their challenges. Prior experience in healthcare technology sales preferred.'
    },
    {
      id: '5',
      title: 'Product Manager - Clinical Systems',
      department: 'Product',
      location: 'Chicago, IL',
      type: 'Full-time',
      datePosted: 'March 12, 2025',
      description: 'Lead the development of new clinical workflow features. Define product requirements, conduct user research, and work closely with engineering and design teams.'
    },
    {
      id: '6',
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      datePosted: 'March 10, 2025',
      description: 'Ensure customer satisfaction and drive adoption of FlowAID solutions. Onboard new clients, provide training, and serve as the voice of the customer internally.'
    },
    {
      id: '7',
      title: 'Healthcare Data Analyst',
      department: 'Data Science',
      location: 'Boston, MA',
      type: 'Full-time',
      datePosted: 'March 8, 2025',
      description: 'Analyze healthcare data to identify trends and opportunities for improvement. Create reports and dashboards to help customers optimize their operations.'
    },
    {
      id: '8',
      title: 'Technical Support Engineer',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Part-time',
      datePosted: 'March 5, 2025',
      description: 'Provide technical support to FlowAID users. Troubleshoot issues, document solutions, and work with engineering to resolve complex problems.'
    }
  ];

  const departments = ['All', 'Engineering', 'Data Science', 'Design', 'Product', 'Sales', 'Customer Success'];
  const locations = ['All', 'Remote', 'San Francisco, CA', 'New York, NY', 'Chicago, IL', 'Boston, MA'];

  const filteredJobs = jobListings.filter(job => 
    (departmentFilter === 'All' || job.department === departmentFilter) &&
    (locationFilter === 'All' || job.location === locationFilter)
  );

  return (
    <Layout>
      <Head>
        <title>Careers - FlowAID</title>
        <meta name="description" content="Join FlowAID and help transform healthcare with AI-powered solutions" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 mix-blend-multiply"></div>
          <div className="relative bg-cover bg-center h-96" style={{ backgroundImage: 'url(/images/careers-hero.jpg)' }}>
            <div className="h-full flex flex-col justify-center max-w-2xl px-8 md:px-12">
              <h1 className="text-4xl font-bold text-white mb-4">Join Our Mission</h1>
              <p className="text-xl text-blue-100 mb-6">
                Help us transform healthcare operations with AI-powered solutions
              </p>
              <div>
                <a 
                  href="#openings" 
                  className="inline-block px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  View Open Positions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Why Join Us */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Join FlowAID?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 inline-flex rounded-full mb-4">
                <LightBulbIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Innovative Technology
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Work on cutting-edge AI and machine learning solutions that make a real difference in healthcare.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 inline-flex rounded-full mb-4">
                <HeartIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Meaningful Impact
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our solutions help healthcare facilities improve patient experience and save valuable clinical time.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 inline-flex rounded-full mb-4">
                <BuildingOfficeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Flexible Work Environment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Remote-first culture with flexible hours and the tools you need to do your best work from anywhere.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 inline-flex rounded-full mb-4">
                <CodeBracketIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Growth & Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Continuous learning opportunities, conference stipends, and a culture that values professional development.
              </p>
            </div>
          </div>
        </div>

        {/* Job Openings */}
        <div id="openings" className="scroll-mt-20 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Open Positions
          </h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Job Listings */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6"
                >
                  <div className="md:flex md:justify-between md:items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <Link
                      href={`/careers/${job.id}`}
                      className="mt-2 md:mt-0 inline-flex items-center text-primary hover:text-primary-dark font-medium"
                    >
                      View Details <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {job.department}
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {job.type}
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400">Posted: {job.datePosted}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                No job openings match your current filters. Please try different criteria.
              </p>
            </div>
          )}
        </div>

        {/* Application Process */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-green-600 to-teal-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Our Application Process</h2>
          </div>
          
          <div className="p-6">
            <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 text-green-600 dark:text-green-400">
                  1
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Apply Online</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Submit your application through our careers page. We review all applications and will contact qualified candidates for the next steps.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 text-green-600 dark:text-green-400">
                  2
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Initial Interview</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A video call with a team member to discuss your experience, skills, and interest in FlowAID. This is also your chance to ask questions about the role and company.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 text-green-600 dark:text-green-400">
                  3
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Skills Assessment</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Depending on the role, you may be asked to complete a take-home assignment or technical interview to demonstrate your relevant skills.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 text-green-600 dark:text-green-400">
                  4
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Team Interview</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Meet with multiple team members to discuss your experience in more depth and learn about the day-to-day responsibilities of the role.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 text-green-600 dark:text-green-400">
                  5
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Offer & Onboarding</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Successful candidates will receive an offer. Once accepted, our onboarding team will help you get set up for success at FlowAID.
                </p>
              </li>
            </ol>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-center px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Don't See a Perfect Fit?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;
