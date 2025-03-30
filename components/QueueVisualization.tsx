import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { QueueAPI, FacilityAPI } from '../services/api';
import { ClockIcon, UserGroupIcon, BuildingOffice2Icon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const QueueVisualization: React.FC = () => {
  const [queueData, setQueueData] = useState<any[]>([]);
  const [facilityStats, setFacilityStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch queue data and set patients array
      const queue = await QueueAPI.getCurrent();
      // Make sure we handle null/undefined data properly
      setQueueData(queue?.patients || []);
      
      // Fetch facility statistics
      const stats = await FacilityAPI.getStats();
      setFacilityStats(stats || {});
      
      setError(null);
    } catch (err) {
      console.error('Error fetching visualization data:', err);
      setError('Failed to load visualization data');
      // Set empty arrays/objects to prevent rendering errors
      setQueueData([]);
      setFacilityStats({});
    } finally {
      setLoading(false);
    }
  };

  // Prepare wait time data for chart - with null checks
  const waitTimeData = {
    labels: queueData?.length ? queueData.map(patient => patient?.name?.split(' ')?.[1] || 'Unknown') : [],
    datasets: [
      {
        label: 'Current Wait Time',
        data: queueData?.length ? queueData.map(patient => patient?.currentWaitTime || 0) : [],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 3,
        tension: 0.4
      },
      {
        label: 'Predicted Wait Time',
        data: queueData?.length ? queueData.map(patient => patient?.predictedWaitTime || 0) : [],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointRadius: 3,
        tension: 0.4
      }
    ]
  };

  // Prepare department distribution data - with null checks
  const departmentData = {
    labels: queueData?.length 
      ? [...new Set(queueData.map(patient => patient?.department || 'Unknown'))]
      : [],
    datasets: [
      {
        label: 'Patients by Department',
        data: queueData?.length 
          ? [...new Set(queueData.map(patient => patient?.department || 'Unknown'))].map(
              dept => queueData.filter(patient => patient?.department === dept).length
            )
          : [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Prepare urgency level distribution data - with null checks
  const urgencyData = {
    labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
    datasets: [
      {
        label: 'Patients by Urgency Level',
        data: [1, 2, 3, 4, 5].map(level => 
          queueData?.filter(patient => patient?.urgencyLevel === level)?.length || 0
        ),
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',  // Level 1 - Low
          'rgba(14, 165, 233, 0.7)',  // Level 2
          'rgba(245, 158, 11, 0.7)',  // Level 3
          'rgba(249, 115, 22, 0.7)',  // Level 4
          'rgba(239, 68, 68, 0.7)'    // Level 5 - Critical
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Patient Wait Times',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Minutes'
        },
        min: 0
      }
    },
    maintainAspectRatio: false
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
    maintainAspectRatio: false
  };

  if (loading && !queueData.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading visualization data...</p>
        </div>
      </div>
    );
  }

  if (error && !queueData.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <UserGroupIcon className="h-10 w-10 text-blue-500 mr-3" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {queueData.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Patients in Queue</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center">
            <ClockIcon className="h-10 w-10 text-purple-500 mr-3" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {facilityStats?.averageWaitTime || 0} min
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Wait Time</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center">
            <BuildingOffice2Icon className="h-10 w-10 text-green-500 mr-3" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {facilityStats?.patientsCompletedToday || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Patients Completed Today</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center">
            <BuildingOffice2Icon className="h-10 w-10 text-red-500 mr-3" />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {facilityStats?.resourceUtilization?.percentage || 0}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Resource Utilization</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Wait Time Analysis</h3>
          <div className="h-80">
            <Line data={waitTimeData} options={lineOptions} />
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Distribution</h3>
          <div className="h-80">
            <Doughnut data={departmentData} options={doughnutOptions} />
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Patient Urgency Levels</h3>
          <div className="h-80">
            <Bar 
              data={urgencyData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: 'Number of Patients'
                    },
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Urgency Level'
                    }
                  }
                },
                maintainAspectRatio: false
              }} 
            />
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={fetchData}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
};

export default QueueVisualization; 