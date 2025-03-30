import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import axios from 'axios';

export default function Diagnosis() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [commonSymptoms, setCommonSymptoms] = useState([
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea',
    'Dizziness', 'Shortness of breath', 'Chest pain', 'Abdominal pain',
    'Joint pain', 'Muscle aches', 'Sore throat', 'Runny nose',
    'Rash', 'Vomiting', 'Diarrhea', 'Back pain', 'Loss of appetite',
    'Chills', 'Sweating'
  ]);

  useEffect(() => {
    // Check if user is authenticated
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userJson || !token) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userJson);
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSymptomClick = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      // Remove symptom if already selected
      const updatedSymptoms = symptoms
        .split(', ')
        .filter(s => s !== symptom && s !== '')
        .join(', ');
      setSymptoms(updatedSymptoms);
    } else {
      // Add symptom if not already selected
      const prefix = symptoms ? ', ' : '';
      setSymptoms(symptoms + prefix + symptom);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setDiagnosisResult(null);

    // Validate form
    if (!symptoms) {
      setError('Please enter at least one symptom');
      setIsSubmitting(false);
      return;
    }

    try {
      // In a real app, this would be an API call to the ML model
      // For now, we'll simulate an API call with mock data
      const response = await axios.post('http://localhost:5000/api/diagnosis', {
        symptoms,
        duration,
        additionalInfo
      });
      
      // For demo purposes, we'll use mock data
      const mockDiagnosis = {
        possibleConditions: [
          {
            name: 'Common Cold',
            probability: 0.85,
            description: 'A viral infectious disease of the upper respiratory tract that primarily affects the nose.',
            recommendations: [
              'Rest and drink plenty of fluids',
              'Over-the-counter pain relievers like acetaminophen',
              'Saline nasal spray to relieve congestion',
              'Consult a doctor if symptoms worsen or persist beyond 10 days'
            ]
          },
          {
            name: 'Seasonal Allergies',
            probability: 0.65,
            description: 'An allergic reaction to pollen or other substances in the environment that typically occurs during specific seasons.',
            recommendations: [
              'Over-the-counter antihistamines',
              'Avoid known allergens when possible',
              'Use air purifiers indoors',
              'Consult with an allergist for long-term management'
            ]
          },
          {
            name: 'Sinusitis',
            probability: 0.45,
            description: 'Inflammation of the sinuses, which are air-filled cavities in the skull.',
            recommendations: [
              'Nasal decongestants and pain relievers',
              'Warm compresses on the face',
              'Saline nasal irrigation',
              'See a doctor if symptoms last more than 10 days or are severe'
            ]
          }
        ],
        disclaimer: 'This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation and treatment.'
      };
      
      setDiagnosisResult(mockDiagnosis);
    } catch (error) {
      console.error('Error getting diagnosis:', error);
      setError('Failed to get diagnosis. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-['Product_Sans', 'sans-serif']">
      <Head>
        <title>AI Diagnosis - flowAID</title>
        <meta name="description" content="Get an AI-powered preliminary diagnosis" />
      </Head>

      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">AI Symptom Checker</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Diagnosis Form */}
            <div className="md:col-span-2">
              {!diagnosisResult ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Describe Your Symptoms</h2>
                  
                  {error && (
                    <div className="p-4 mb-6 rounded-md bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Symptoms *
                      </label>
                      <textarea
                        id="symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={3}
                        placeholder="Describe your symptoms here"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      ></textarea>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Common symptoms:</p>
                        <div className="flex flex-wrap gap-2">
                          {commonSymptoms.map((symptom) => (
                            <button
                              key={symptom}
                              type="button"
                              onClick={() => handleSymptomClick(symptom)}
                              className={`px-3 py-1 text-sm rounded-full ${symptoms.includes(symptom) ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                            >
                              {symptom}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration
                      </label>
                      <select
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select duration</option>
                        <option value="Less than a day">Less than a day</option>
                        <option value="1-3 days">1-3 days</option>
                        <option value="3-7 days">3-7 days</option>
                        <option value="1-2 weeks">1-2 weeks</option>
                        <option value="2-4 weeks">2-4 weeks</option>
                        <option value="More than a month">More than a month</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        id="additionalInfo"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        rows={3}
                        placeholder="Any other relevant information (e.g., medical history, allergies, medications)"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      ></textarea>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Symptoms...
                          </span>
                        ) : 'Get Diagnosis'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Diagnosis Results</h2>
                    <button
                      onClick={() => setDiagnosisResult(null)}
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                    >
                      Start New Diagnosis
                    </button>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md mb-6">
                    <p className="text-yellow-800 dark:text-yellow-100 text-sm">
                      <strong>Disclaimer:</strong> {diagnosisResult.disclaimer}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Possible Conditions</h3>
                      
                      {diagnosisResult.possibleConditions.map((condition: any, index: number) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">{condition.name}</h4>
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full mr-2">
                                <div 
                                  className="h-full bg-blue-600 rounded-full" 
                                  style={{ width: `${condition.probability * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {Math.round(condition.probability * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{condition.description}</p>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations:</h5>
                            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                              {condition.recommendations.map((rec: string, i: number) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Next Steps</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Based on your symptoms, we recommend the following next steps:
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <a
                          href="/dashboard/patient/appointments"
                          className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Book an Appointment
                        </a>
                        
                        <button
                          onClick={() => window.print()}
                          className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Print Results
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">How It Works</h3>
                <ol className="space-y-3 text-blue-700 dark:text-blue-300 list-decimal pl-5">
                  <li>Enter your symptoms and any relevant information</li>
                  <li>Our AI analyzes your input using advanced machine learning</li>
                  <li>Receive a list of possible conditions and recommendations</li>
                  <li>Book an appointment with a specialist if needed</li>
                </ol>
                <p className="mt-4 text-sm text-blue-700 dark:text-blue-300">
                  Our AI model is trained on millions of medical cases and continuously updated with the latest medical research.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Important Note</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  This tool provides preliminary information only and is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md">
                  <p className="text-red-800 dark:text-red-100 text-sm font-medium">
                    If you are experiencing a medical emergency, call your local emergency services immediately or go to the nearest emergency room.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
