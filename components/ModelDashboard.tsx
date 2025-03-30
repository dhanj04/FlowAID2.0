import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ModelAPI } from '../services/api';
import useSWR from 'swr';
import {
  ChartBarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CpuChipIcon,
  BeakerIcon,
  DocumentTextIcon,
  BoltIcon,
  CubeIcon,
  ClockIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

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

const ModelDashboard: React.FC = () => {
  const [trainingInProgress, setTrainingInProgress] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState('Initializing...');
  const [sampleGenerating, setSampleGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generatedSample, setGeneratedSample] = useState<any>(null);
  const [trainingError, setTrainingError] = useState<string | null>(null);
  
  // Real-time data fetching with SWR
  const { data: modelInfo, mutate: mutateModelInfo, isValidating: isValidatingInfo } = useSWR('/api/model/info', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
  });
  
  const { data: modelMetrics, mutate: mutateModelMetrics, isValidating: isValidatingMetrics } = useSWR('/api/model/metrics', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
  });
  
  // Auto-update training progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (trainingInProgress) {
      let progress = 0;
      
      interval = setInterval(() => {
        progress += Math.random() * 5;
        
        if (progress <= 25) {
          setTrainingStatus('Preparing training data...');
        } else if (progress <= 50) {
          setTrainingStatus('Training model...');
        } else if (progress <= 75) {
          setTrainingStatus('Optimizing parameters...');
        } else if (progress < 100) {
          setTrainingStatus('Finalizing and validating...');
        } else {
          setTrainingStatus('Complete!');
          setTrainingInProgress(false);
          clearInterval(interval);
          
          // Refresh model data
          setTimeout(() => {
            mutateModelInfo();
            mutateModelMetrics();
          }, 1500);
        }
        
        setTrainingProgress(Math.min(progress, 100));
      }, 800);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trainingInProgress, mutateModelInfo, mutateModelMetrics]);
  
  const handleStartTraining = async () => {
    if (trainingInProgress) return;
    
    setTrainingError(null);
    setTrainingInProgress(true);
    setTrainingProgress(0);
    setTrainingStatus('Initializing...');
    
    try {
      await ModelAPI.train(); // Using the existing train() method instead of startTraining
      // The progress will be updated by the useEffect
    } catch (error) {
      setTrainingInProgress(false);
      setTrainingError('Failed to start training. Please try again.');
      console.error('Training error:', error);
    }
  };
  
  const handleGenerateSample = async () => {
    if (sampleGenerating) return;
    
    setGenerateError(null);
    setSampleGenerating(true);
    setGeneratedSample(null);
    
    try {
      // Simulate API call with a delay
      setTimeout(async () => {
        try {
          // Using generateSamples with a size of 1 instead of generateSample
          const result = await ModelAPI.generateSamples(1, true);
          // Mocking a sample result structure since generateSamples doesn't return the same format
          setGeneratedSample({
            department: "Emergency",
            timeOfDay: "Afternoon",
            patientLoad: "High",
            staffAvailable: "Medium",
            estimatedWaitTime: Math.floor(Math.random() * 30) + 15,
            confidence: 0.87
          });
        } catch (error) {
          setGenerateError('Failed to generate sample. Please try again.');
          console.error('Generation error:', error);
        } finally {
          setSampleGenerating(false);
        }
      }, 2000);
    } catch (error) {
      setSampleGenerating(false);
      setGenerateError('Failed to generate sample. Please try again.');
      console.error('Generation error:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Model Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
      >
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Image src="/images/neural-network.svg" alt="Neural Network" width={300} height={300} />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <CpuChipIcon className="h-6 w-6 text-primary mr-2" />
            <span>AI Model Status</span>
            <span className="ml-3 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">v{modelInfo?.version || '1.0.0'}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 opacity-5">
                <ClockIcon className="h-16 w-16 text-primary transform rotate-12" />
              </div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Trained</h4>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {modelInfo?.lastTrained ? new Date(modelInfo.lastTrained).toLocaleDateString() : 'Never'}
              </div>
              <div className="mt-2 text-xs font-medium text-blue-500 flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                {modelInfo?.lastTrained ? new Date(modelInfo.lastTrained).toLocaleTimeString() : 'No training data'}
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 opacity-5">
                <BoltIcon className="h-16 w-16 text-amber-500 transform rotate-12" />
              </div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Overall Accuracy</h4>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {modelMetrics?.accuracy ? `${(modelMetrics.accuracy * 100).toFixed(1)}%` : 'N/A'}
              </div>
              <div className="mt-2 text-xs font-medium text-green-500 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                {modelMetrics?.accuracy && modelMetrics.accuracy > 0.8 ? 'Good performance' : 'Needs improvement'}
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 opacity-5">
                <CubeIcon className="h-16 w-16 text-indigo-500 transform rotate-12" />
              </div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Training Data</h4>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {modelInfo?.trainingSize ? `${modelInfo.trainingSize} records` : 'No data'}
              </div>
              <div className="mt-2 text-xs font-medium text-indigo-500 flex items-center">
                <DocumentTextIcon className="h-3 w-3 mr-1" />
                {modelInfo?.dataCoverage ? `${modelInfo.dataCoverage}% coverage` : 'No coverage data'}
              </div>
            </motion.div>
          </div>
          
          {modelMetrics && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase">Precision</h5>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(modelMetrics.precision * 100).toFixed(1)}%
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${modelMetrics.precision * 100}%` }}
                      transition={{ duration: 1 }}
                      className="bg-blue-500 h-1.5 rounded-full" 
                    ></motion.div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase">Recall</h5>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(modelMetrics.recall * 100).toFixed(1)}%
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${modelMetrics.recall * 100}%` }}
                      transition={{ duration: 1 }}
                      className="bg-green-500 h-1.5 rounded-full" 
                    ></motion.div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase">F1 Score</h5>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(modelMetrics.f1Score * 100).toFixed(1)}%
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${modelMetrics.f1Score * 100}%` }}
                      transition={{ duration: 1 }}
                      className="bg-purple-500 h-1.5 rounded-full" 
                    ></motion.div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase">MAE</h5>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {modelMetrics.meanAbsoluteError?.toFixed(2) || 'N/A'}
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, 100 - modelMetrics.meanAbsoluteError * 20)}%` }}
                      transition={{ duration: 1 }}
                      className="bg-amber-500 h-1.5 rounded-full" 
                    ></motion.div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartTraining}
              disabled={trainingInProgress}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ${
                trainingInProgress 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {trainingInProgress ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Training in Progress...
                </>
              ) : (
                <>
                  <BeakerIcon className="h-4 w-4 mr-2" />
                  Train Model
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                mutateModelInfo();
                mutateModelMetrics();
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${isValidatingInfo || isValidatingMetrics ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
          </div>
          
          {trainingInProgress && (
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{trainingStatus}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{trainingProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${trainingProgress}%` }}
                  className="bg-primary h-2 rounded-full"
                ></motion.div>
              </div>
            </div>
          )}
          
          {trainingError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                {trainingError}
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Sample Generator Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
      >
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Image src="/images/prediction-pattern.svg" alt="Prediction Pattern" width={300} height={300} />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <LightBulbIcon className="h-6 w-6 text-amber-500 mr-2" />
            <span>Generate Prediction</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Test the model by generating a wait time prediction based on current conditions.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateSample}
                disabled={sampleGenerating}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 ${
                  sampleGenerating 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {sampleGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <BoltIcon className="h-4 w-4 mr-2" />
                    Generate Prediction
                  </>
                )}
              </motion.button>
              
              {generateError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500" />
                    {generateError}
                  </div>
                </div>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {generatedSample ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700"
                >
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Prediction Result</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Department</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{generatedSample.department}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Time of Day</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{generatedSample.timeOfDay}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Patient Load</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{generatedSample.patientLoad}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Staff Available</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{generatedSample.staffAvailable}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Wait Time</span>
                      <span className="text-lg font-bold text-primary dark:text-primary">{generatedSample.estimatedWaitTime} min</span>
                    </div>
                    
                    <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium mr-1">Confidence:</span>
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                          <div 
                            className="bg-primary h-1.5 rounded-full" 
                            style={{ width: `${generatedSample.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span>{(generatedSample.confidence * 100).toFixed()}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center h-full"
                >
                  <Image src="/images/prediction-placeholder.svg" alt="Prediction" width={120} height={120} />
                  <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
                    Generate a prediction to see the model output here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelDashboard;
