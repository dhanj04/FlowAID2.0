import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernCard from './ui/ModernCard';
import ModernButton from './ui/ModernButton';
import ModernBadge from './ui/ModernBadge';
import ModernAvatar from './ui/ModernAvatar';
import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  UserIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  name: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  waitTime: number;
  department: string;
  avatar?: string;
}

interface DashboardStats {
  patientsWaiting: number;
  avgWaitTime: number;
  completedToday: number;
  utilizationRate: number;
}

const ModernDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  
  // Sample data
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'John Smith',
      status: 'waiting',
      priority: 'medium',
      waitTime: 15,
      department: 'General',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      status: 'in_progress',
      priority: 'high',
      waitTime: 5,
      department: 'Cardiology',
    },
    {
      id: '3',
      name: 'Michael Brown',
      status: 'waiting',
      priority: 'emergency',
      waitTime: 2,
      department: 'Emergency',
    },
    {
      id: '4',
      name: 'Emily Davis',
      status: 'completed',
      priority: 'low',
      waitTime: 0,
      department: 'Pediatrics',
    },
    {
      id: '5',
      name: 'Robert Wilson',
      status: 'waiting',
      priority: 'medium',
      waitTime: 25,
      department: 'Orthopedics',
    },
  ]);
  
  const [stats, setStats] = useState<DashboardStats>({
    patientsWaiting: 3,
    avgWaitTime: 14,
    completedToday: 12,
    utilizationRate: 78,
  });
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleStatusChange = (patientId: string, newStatus: Patient['status']) => {
    setPatients(patients.map(p => 
      p.id === patientId ? { ...p, status: newStatus } : p
    ));
  };
  
  // Priority badge color mapping
  const priorityColors = {
    low: 'success',
    medium: 'primary',
    high: 'warning',
    emergency: 'danger',
  };
  
  // Status badge color mapping
  const statusColors = {
    waiting: 'warning',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'default',
  };
  
  // Status text mapping
  const statusText = {
    waiting: 'Waiting',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  
  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Healthcare Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor and manage patient flow in real-time</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <ModernButton
            variant="primary"
            icon={<ArrowPathIcon className="h-5 w-5" />}
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            Refresh
          </ModernButton>
          
          <ModernButton
            variant="gradient-cool"
            icon={<UserIcon className="h-5 w-5" />}
            onClick={() => setShowAddPatient(true)}
          >
            Add Patient
          </ModernButton>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ModernCard
          animate
          glass
          className="overflow-hidden"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 mr-4">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Patients Waiting</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.patientsWaiting}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 dark:text-success-400 font-medium">12% increase</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from yesterday</span>
          </div>
        </ModernCard>
        
        <ModernCard
          animate
          glass
          className="overflow-hidden"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300 mr-4">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Wait Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgWaitTime} min</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon className="h-4 w-4 text-danger-500 mr-1 transform rotate-180" />
            <span className="text-danger-600 dark:text-danger-400 font-medium">5% decrease</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last week</span>
          </div>
        </ModernCard>
        
        <ModernCard
          animate
          glass
          className="overflow-hidden"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300 mr-4">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedToday}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 dark:text-success-400 font-medium">8% increase</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from yesterday</span>
          </div>
        </ModernCard>
        
        <ModernCard
          animate
          glass
          className="overflow-hidden"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300 mr-4">
              <BoltIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilization Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.utilizationRate}%</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 dark:text-success-400 font-medium">3% increase</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last week</span>
          </div>
        </ModernCard>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {['queue', 'visualization', 'analytics', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'queue' && (
            <ModernCard className="overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Queue</h2>
                <div className="flex space-x-2">
                  <ModernBadge variant="primary" size="sm">{patients.filter(p => p.status === 'waiting').length} Waiting</ModernBadge>
                  <ModernBadge variant="secondary" size="sm">{patients.filter(p => p.status === 'in_progress').length} In Progress</ModernBadge>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wait Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ModernAvatar
                              src={patient.avatar}
                              alt={patient.name}
                              size="sm"
                              className="mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{patient.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">ID: {patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{patient.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ModernBadge 
                            variant={priorityColors[patient.priority] as any} 
                            size="sm"
                          >
                            {patient.priority.charAt(0).toUpperCase() + patient.priority.slice(1)}
                          </ModernBadge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {patient.waitTime > 0 ? `${patient.waitTime} min` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ModernBadge 
                            variant={statusColors[patient.status] as any} 
                            size="sm"
                          >
                            {statusText[patient.status]}
                          </ModernBadge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {patient.status === 'waiting' && (
                              <ModernButton
                                variant="primary"
                                size="xs"
                                onClick={() => handleStatusChange(patient.id, 'in_progress')}
                              >
                                Start
                              </ModernButton>
                            )}
                            {patient.status === 'in_progress' && (
                              <ModernButton
                                variant="success"
                                size="xs"
                                onClick={() => handleStatusChange(patient.id, 'completed')}
                              >
                                Complete
                              </ModernButton>
                            )}
                            {(patient.status === 'waiting' || patient.status === 'in_progress') && (
                              <ModernButton
                                variant="outline"
                                size="xs"
                                onClick={() => handleStatusChange(patient.id, 'cancelled')}
                              >
                                Cancel
                              </ModernButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModernCard>
          )}
          
          {activeTab === 'visualization' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Queue Visualization</h2>
                <ModernBadge variant="primary">Real-time</ModernBadge>
              </div>
              
              <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Queue visualization will be displayed here</p>
              </div>
            </ModernCard>
          )}
          
          {activeTab === 'analytics' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h2>
                <div>
                  <ModernButton variant="outline" size="sm">Export Data</ModernButton>
                </div>
              </div>
              
              <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Analytics charts will be displayed here</p>
              </div>
            </ModernCard>
          )}
          
          {activeTab === 'settings' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard Settings</h2>
                <div>
                  <ModernButton variant="primary" size="sm">Save Changes</ModernButton>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Notification Preferences</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Configure how you receive notifications about queue changes</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input id="email-notif" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                      <label htmlFor="email-notif" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">Email Notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input id="sms-notif" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                      <label htmlFor="sms-notif" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">SMS Notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input id="push-notif" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" checked />
                      <label htmlFor="push-notif" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">Push Notifications</label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Display Settings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Customize how information is displayed on your dashboard</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="refresh-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auto-refresh Rate</label>
                      <select id="refresh-rate" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <option>30 seconds</option>
                        <option>1 minute</option>
                        <option>5 minutes</option>
                        <option>Never</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="default-view" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default View</label>
                      <select id="default-view" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <option>Queue</option>
                        <option>Visualization</option>
                        <option>Analytics</option>
                      </select>
                    </div>
                  </div>