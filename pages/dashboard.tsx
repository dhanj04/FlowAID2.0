import React, { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QueueDashboard from '../components/QueueDashboard';
import QueueVisualization from '../components/QueueVisualization';
import AddPatientForm from '../components/AddPatientForm';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import {
  ChartBarIcon,
  QueueListIcon,
  BuildingOffice2Icon,
  Cog6ToothIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
  UsersIcon,
  UserPlusIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { PatientAPI, FacilityAPI, ModelAPI } from '../services/api';
import ModelDashboard from '../components/ModelDashboard';
import Layout from '../components/Layout';

// Facility Settings Component
const FacilitySettings: React.FC = () => {
  const [resources, setResources] = useState({
    doctors: 0,
    nurses: 0,
    rooms: 0
  });

  const [departmentLoads, setDepartmentLoads] = useState({
    General: 0,
    Emergency: 0,
    Pediatrics: 0,
    Cardiology: 0,
    Orthopedics: 0
  });
  const [processingTimes, setProcessingTimes] = useState({
    General: 0,
    Emergency: 0,
    Pediatrics: 0,
    Cardiology: 0,
    Orthopedics: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFacilityState();
  }, []);

  const fetchFacilityState = async () => {
    setIsLoading(true);
    try {
      const facilityState = await FacilityAPI.getState();
      
      setResources({
        doctors: facilityState.resources?.doctors || 0,
        nurses: facilityState.resources?.nurses || 0,
        rooms: facilityState.resources?.rooms || 0
      });
      
      const defaultDepartmentLoads = {
        General: 0,
        Emergency: 0,
        Pediatrics: 0,
        Cardiology: 0,
        Orthopedics: 0
      };
      
      if (facilityState.departmentLoads) {
        setDepartmentLoads({
          ...defaultDepartmentLoads,
          ...facilityState.departmentLoads
        });
      }
      
      const defaultProcessingTimes = {
        General: 0,
        Emergency: 0,
        Pediatrics: 0,
        Cardiology: 0,
        Orthopedics: 0
      };
      
      if (facilityState.averageProcessingTimes) {
        setProcessingTimes({
          ...defaultProcessingTimes,
          ...facilityState.averageProcessingTimes
        });
      }
    } catch (error) {
      console.error('Error fetching facility state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceChange = (resource: keyof typeof resources, value: number) => {
    setResources(prev => ({
      ...prev,
      [resource]: value
    }));
  };

  const handleDepartmentLoadChange = (department: keyof typeof departmentLoads, value: number) => {
    setDepartmentLoads(prev => ({
      ...prev,
      [department]: value
    }));
  };

  const handleProcessingTimeChange = (department: keyof typeof processingTimes, value: number) => {
    setProcessingTimes(prev => ({
      ...prev,
      [department]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await FacilityAPI.updateState({
        resources,
        departmentLoads,
        averageProcessingTimes: processingTimes
      });
      alert('Facility settings saved successfully!');
    } catch (error) {
      console.error('Error saving facility settings:', error);
      alert('Error saving facility settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Facility Settings</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Configure resources and department parameters to optimize queue management
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resource Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Doctors
                </label>
                <input
                  type="number"
                  min="0"
                  value={resources.doctors}
                  onChange={(e) => handleResourceChange('doctors', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nurses
                </label>
                <input
                  type="number"
                  min="0"
                  value={resources.nurses}
                  onChange={(e) => handleResourceChange('nurses', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={resources.rooms}
                  onChange={(e) => handleResourceChange('rooms', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Department Load Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(departmentLoads).map((department) => (
                <div key={department}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {department}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={departmentLoads[department as keyof typeof departmentLoads]}
                    onChange={(e) => handleDepartmentLoadChange(
                      department as keyof typeof departmentLoads,
                      parseFloat(e.target.value) || 0
                    )}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Average Processing Times (minutes)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(processingTimes).map((department) => (
                <div key={department}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {department}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={processingTimes[department as keyof typeof processingTimes]}
                    onChange={(e) => handleProcessingTimeChange(
                      department as keyof typeof processingTimes,
                      parseInt(e.target.value) || 0
                    )}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Model Management Component
const ModelManagement: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    setIsLoading(true);
    try {
      const info = await ModelAPI.getInfo();
      setModelInfo(info);
    } catch (error) {
      console.error('Error fetching model info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      await ModelAPI.train();
      await fetchModelInfo();
      alert('Model training completed successfully!');
    } catch (error) {
      console.error('Error training model:', error);
      alert('Error training model. Please try again.');
    } finally {
      setIsTraining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Model Management</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Configure and train the AI model that powers wait time predictions
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Model Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Version</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{modelInfo?.version || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Trained</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {modelInfo?.lastTrained 
                    ? new Date(modelInfo.lastTrained).toLocaleDateString() 
                    : 'Never'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {modelInfo?.accuracy 
                    ? `${(modelInfo.accuracy * 100).toFixed(1)}%` 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleTrainModel}
              disabled={isTraining}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTraining ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Training...
                </>
              ) : (
                <>
                  <BeakerIcon className="h-5 w-5 mr-2" />
                  Train Model
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface QueueDashboardProps {
  departmentFilter?: string;
}

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>(undefined);

  const departments = [
    'General',
    'Emergency',
    'Pediatrics',
    'Cardiology',
    'Orthopedics'
  ];

  const tabOptions = [
    { name: 'Queue', icon: UsersIcon },
    { name: 'Analytics', icon: ChartBarIcon },
    { name: 'Facility', icon: Cog6ToothIcon },
    { name: 'Model', icon: BeakerIcon }
  ];
  
  const departmentOptions = [
    { name: 'All Departments', value: null },
    { name: 'General', value: 'General' },
    { name: 'Emergency', value: 'Emergency' },
    { name: 'Pediatrics', value: 'Pediatrics' },
    { name: 'Cardiology', value: 'Cardiology' },
    { name: 'Orthopedics', value: 'Orthopedics' }
  ];

  const handleAddPatientSuccess = () => {
    setIsAddingPatient(false);
    if (selectedTab === 0) {
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Queue Management Dashboard | FlowAID</title>
        <meta name="description" content="AI-powered healthcare queue optimization platform dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="pt-24 pb-16">
        {/* Use Modern Dashboard Component */}
        <ModernDashboard />
        
        {/* Original Dashboard Content (commented out for reference) */}
        {/*
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Healthcare Queue Management</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Optimize patient flow and reduce wait times with AI-powered queue management
              </p>
            </div>
            <button
              onClick={() => setIsAddingPatient(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Patient
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden sticky top-24"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-4 bg-primary text-white dark:bg-primary">
                  <h2 className="font-medium">Dashboard</h2>
                </div>

                <div className="p-1">
                  <button
                    className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                      selectedTab === 0
                        ? 'bg-primary/10 text-primary dark:text-primary'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedTab(0)}
                  >
                    <ChartBarIcon className="h-5 w-5" />
                    <span>Overview</span>
                  </button>

                  <button
                    className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                      selectedTab === 1
                        ? 'bg-primary/10 text-primary dark:text-primary'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedTab(1)}
                  >
                    <QueueListIcon className="h-5 w-5" />
                    <span>Queue</span>
                  </button>

                  <button
                    className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                      selectedTab === 3
                        ? 'bg-primary/10 text-primary dark:text-primary'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedTab(3)}
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    <span>Facility</span>
                  </button>

                  <button
                    className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                      selectedTab === 4
                        ? 'bg-primary/10 text-primary dark:text-primary'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedTab(4)}
                  >
                    <BeakerIcon className="h-5 w-5" />
                    <span>AI Model</span>
                  </button>

                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4">
                    Departments
                  </div>

                  {departments.map((department, index) => (
                    <button
                      key={department}
                      className={`w-full text-left p-3 rounded-md flex items-center space-x-2 ${
                        selectedDepartment === department
                          ? 'bg-primary/10 text-primary dark:text-primary'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedDepartment(department);
                        setSelectedTab(2);
                      }}
                    >
                      <BuildingOffice2Icon className="h-5 w-5" />
                      <span>{department}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-10">
              <div className="space-y-8">
                {/* Overview Panel */}
                {selectedTab === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Queue Analytics</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Real-time analysis and wait time predictions powered by machine learning
                      </p>
                    </div>

                    <QueueVisualization />
                  </motion.div>
                )}

                {/* Queue Panel */}
                {selectedTab === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Patient Queue Management</h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Manage and optimize the flow of patients through your healthcare facility
                      </p>
                    </div>

                    <div className="mb-4 flex justify-between items-center">
                      <div>
                        <label htmlFor="departmentFilter" className="sr-only">
                          Filter by Department
                        </label>
                        <select
                          id="departmentFilter"
                          value={departmentFilter || ''}
                          onChange={(e) => setDepartmentFilter(e.target.value || undefined)}
                          className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        >
                          {departmentOptions.map((option) => (
                            <option key={option.name} value={option.value || ''}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setDepartmentFilter(undefined)}
                        className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary"
                      >
                        Reset Filter
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                      <QueueDashboard departmentFilter={departmentFilter} />
                    </div>
                  </motion.div>
                )}

                {/* Department Panel */}
                {selectedTab === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedDepartment} Department
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Manage patient queue and resources specific to the {selectedDepartment} department
                      </p>
                    </div>

                    <QueueDashboard departmentFilter={selectedDepartment || undefined} />
                  </motion.div>
                )}

                {/* Facility Tab */}
                {selectedTab === 3 && (
                  <FacilitySettings />
                )}

                {/* Model Tab */}
                {selectedTab === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <ModelDashboard />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add Patient Modal */}
      <AnimatePresence>
        {isAddingPatient && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <button
                onClick={() => setIsAddingPatient(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 z-10"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <AddPatientForm
                onAddPatient={handleAddPatientSuccess}
                onCancel={() => setIsAddingPatient(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;