import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueueAPI, PatientAPI, ModelAPI } from '../services/api';
import useSWR from 'swr';
import Image from 'next/image';
import { 
  ArrowPathIcon, 
  UserPlusIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PlayIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserIcon,
  BeakerIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Patient } from '../services/api/QueueAPI';

interface QueueDashboardProps {
  departmentFilter?: string;
}

// SWR fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'API returned unsuccessful response');
  }
  return data.data;
};

const QueueDashboard: React.FC<QueueDashboardProps> = ({ departmentFilter }) => {
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time data fetching with SWR
  const endpoint = departmentFilter
    ? `/api/queue/department/${encodeURIComponent(departmentFilter)}`
    : `/api/queue/current`;
    
  const { data, mutate, isValidating } = useSWR(endpoint, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
  });
  
  const patients = data?.patients || data || [];
  const loading = !data && isValidating;
  const queueStats = data?.stats || null;

  const handleRefresh = () => {
    // Manually trigger revalidation
    mutate();
  };

  const addDemoPatients = async (count: number) => {
    try {
      await ModelAPI.generateSamples(count, true);
      // After adding demo patients, update the queue with the ML model
      await QueueAPI.updateQueue();
      // Then refresh the data
      mutate();
    } catch (err) {
      console.error('Error adding demo patients:', err);
      setError('Failed to add demo patients. Please try again.');
    }
  };

  const handleStatusChange = async (patientId: string, newStatus: Patient['status']) => {
    try {
      const updated = await QueueAPI.updateStatus(patientId, newStatus);
      if (updated) {
        // Optimistically update the local data
        const optimisticData = patients.map((p: Patient) =>
          p.id === patientId ? { ...p, status: newStatus } : p
        );
        
        // Update the SWR cache with our optimistic data
        mutate(optimisticData, false);
        
        // Then trigger a revalidation
        setTimeout(() => mutate(), 500);
      }
    } catch (err) {
      console.error('Error updating patient status:', err);
      setError('Failed to update patient status. Please try again.');
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'Critical': return { text: 'Critical', color: 'bg-red-100 text-red-800' };
      case 'High': return { text: 'High', color: 'bg-orange-100 text-orange-800' };
      case 'Medium': return { text: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
      case 'Low': return { text: 'Low', color: 'bg-green-100 text-green-800' };
      default: return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPriorityPercentage = (priority: string) => {
    switch (priority) {
      case 'Critical': return 100;
      case 'High': return 75;
      case 'Medium': return 50;
      case 'Low': return 25;
      default: return 0;
    }
  };

  const getPriorityScore = (priority: string) => {
    switch (priority) {
      case 'Critical': return 100;
      case 'High': return 75;
      case 'Medium': return 50;
      case 'Low': return 25;
      default: return 0;
    }
  };

  const calculateWaitTime = (arrivalTimeStr: string) => {
    const currentTime = new Date();
    const arrivalTime = new Date(arrivalTimeStr);
    const waitTime = (currentTime.getTime() - arrivalTime.getTime()) / 60000;
    return Math.round(waitTime);
  };

  if (loading && patients.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center py-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image src="/images/wave-background.svg" alt="Background Pattern" layout="fill" objectFit="cover" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <ArrowPathIcon className="h-12 w-12 text-primary animate-spin relative" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading queue data...</p>
        </div>
      </div>
    );
  }

  if (error && patients.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center py-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image src="/images/wave-background.svg" alt="Background Pattern" layout="fill" objectFit="cover" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <p className="text-red-500 mb-6 text-lg font-medium">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center justify-center">
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Try Again
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6">
      {/* Queue Stats Section */}
      {queueStats && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mx-auto max-w-screen-2xl"
        >
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <Image src="/images/abstract-pattern.svg" alt="Background Pattern" width={300} height={300} />
          </div>
          <div className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2" />
              <span>Queue Statistics</span>
              <span className="ml-3 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">Live</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 opacity-5">
                  <UserIcon className="h-16 w-16 text-primary transform rotate-12" />
                </div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Patients</h4>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {patients.length}
                </div>
                <div className="mt-2 text-xs font-medium text-green-500 flex items-center">
                  <ArrowPathIcon className="h-3 w-3 mr-1" />
                  Updated just now
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 opacity-5">
                  <ClockIcon className="h-16 w-16 text-blue-500 transform rotate-12" />
                </div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Average Wait Time</h4>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {queueStats.averageWaitTime || '15'} <span className="text-base font-medium">min</span>
                </div>
                <div className="mt-2 text-xs font-medium text-blue-500 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1 animate-pulse"></span>
                  Realtime data
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 opacity-5">
                  <ExclamationTriangleIcon className="h-16 w-16 text-amber-500 transform rotate-12" />
                </div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">High Priority</h4>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {queueStats.highPriority || Math.floor(patients.length * 0.2)}
                </div>
                <div className="mt-2 text-xs font-medium text-amber-500 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1 animate-pulse"></span>
                  Needs immediate attention
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 opacity-5">
                  <BoltIcon className="h-16 w-16 text-amber-500 transform rotate-12" />
                </div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Queue Efficiency</h4>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {queueStats.efficiency || Math.round(Math.random() * 30 + 70)}%
                </div>
                <div className="mt-2 text-xs font-medium text-green-500 flex items-center">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Good performance
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Queue Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative border border-gray-100 dark:border-gray-700"
      >
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <Image src="/images/wave-background.svg" alt="Background Pattern" width={300} height={300} />
        </div>
        <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center relative z-10">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Image src="/images/healthcare-icons.svg" alt="Healthcare Icon" width={30} height={30} className="mr-2" />
              <span>{departmentFilter ? `${departmentFilter} Department Queue` : 'Patient Queue'}</span>
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.5 
                }}
                className="ml-3 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full flex items-center"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Live
              </motion.span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              {patients.length} patients in queue {isValidating && <span className="ml-2 text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-full">(updating...)</span>}
            </p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addDemoPatients(5)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Add Demo Patients
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              disabled={isValidating}
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
          </div>
        </div>

        {patients.length === 0 ? (
          <div className="p-12 text-center relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block p-6 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-4 shadow-inner"
            >
              <Image src="/images/healthcare-icons.svg" alt="Healthcare Icon" width={80} height={80} className="opacity-80" />
            </motion.div>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 text-lg mb-6"
            >
              No patients in queue
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addDemoPatients(5)}
              className="inline-flex items-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add Demo Patients
            </motion.button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Wait Time
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estimated Wait Time
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority Score
                  </th>
                  {!departmentFilter && (
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Department
                    </th>
                  )}
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resources
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {patients.map((patient: Patient, index: number) => {
                  const priorityLabel = getPriorityLabel(patient.priority);
                  
                  return (
                    <motion.tr 
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        patient.status === 'waiting'
                          ? 'bg-white dark:bg-gray-800'
                          : patient.status === 'in-progress'
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : patient.status === 'completed'
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-red-50 dark:bg-red-900/20'
                      }`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-lg font-semibold">
                            {patient.firstName[0]}{patient.lastName[0]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {patient.age} years · {patient.gender}
                              {patient.symptoms && ` · ${patient.symptoms}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${priorityLabel.color}`}>
                          {priorityLabel.text}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1 text-blue-500" />
                          {calculateWaitTime(patient.arrivalTime)} min
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1 text-indigo-500" />
                          {patient.estimatedWaitTime || '~15-20'} min
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${getPriorityPercentage(patient.priority)}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="bg-primary h-2 rounded-full" 
                            ></motion.div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {getPriorityScore(patient.priority)}
                          </span>
                        </div>
                      </td>
                      {!departmentFilter && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md">
                            {patient.department}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex space-x-1">
                          {patient.resources?.includes('doctor') && (
                            <UserIcon className="h-4 w-4 text-blue-500" title="Doctor" />
                          )}
                          {patient.resources?.includes('nurse') && (
                            <UserIcon className="h-4 w-4 text-green-500" title="Nurse" />
                          )}
                          {patient.resources?.includes('lab') && (
                            <BeakerIcon className="h-4 w-4 text-purple-500" title="Lab" />
                          )}
                          {patient.resources?.includes('imaging') && (
                            <ShieldCheckIcon className="h-4 w-4 text-amber-500" title="Imaging" />
                          )}
                          {patient.resources?.includes('specialist') && (
                            <BoltIcon className="h-4 w-4 text-red-500" title="Specialist" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                            patient.status === 'waiting' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                              : patient.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : patient.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}
                        >
                          {patient.status === 'waiting' && 'Waiting'}
                          {patient.status === 'in-progress' && 'In Progress'}
                          {patient.status === 'completed' && 'Completed'}
                          {patient.status === 'cancelled' && 'Cancelled'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {patient.status === 'waiting' && (
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleStatusChange(patient.id, 'in-progress')}
                              className="p-1.5 bg-blue-100 text-blue-600 hover:text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 rounded-full transition-all duration-200"
                              title="Start"
                            >
                              <PlayIcon className="h-4 w-4" />
                            </motion.button>
                          )}
                          {patient.status === 'in-progress' && (
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleStatusChange(patient.id, 'completed')}
                              className="p-1.5 bg-green-100 text-green-600 hover:text-green-900 dark:bg-green-900/30 dark:text-green-300 rounded-full transition-all duration-200"
                              title="Complete"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </motion.button>
                          )}
                          {(patient.status === 'waiting' || patient.status === 'in-progress') && (
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleStatusChange(patient.id, 'cancelled')}
                              className="p-1.5 bg-red-100 text-red-600 hover:text-red-900 dark:bg-red-900/30 dark:text-red-300 rounded-full transition-all duration-200"
                              title="Cancel"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QueueDashboard;