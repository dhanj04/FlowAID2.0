import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../utils/supabaseClient';

export default function Signup() {
  const router = useRouter();
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Patient specific fields
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    // Doctor specific fields
    specialty: '',
    licenseNumber: '',
    experience: '',
    education: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step < (userType === 'doctor' ? 3 : 2)) {
      // Validate current step before proceeding
      if (step === 1) {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          setError('Please fill in all required fields');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
      }
      setStep(step + 1);
    } else {
      // Final validation before submission
      if (userType === 'patient' && (!formData.dateOfBirth || !formData.gender || !formData.phone)) {
        setError('Please fill in all required fields');
        return;
      }
      if (userType === 'doctor' && (!formData.specialty || !formData.licenseNumber || !formData.phone)) {
        setError('Please fill in all required fields');
        return;
      }

      try {
        setIsSubmitting(true);
        // Prepare user data for registration
        const userData = {
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          role: userType,
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          ...(userType === 'doctor' && {
            specialty: formData.specialty.trim(),
            licenseNumber: formData.licenseNumber.trim(),
            experience: formData.experience,
            education: formData.education.trim()
          })
        };

        console.log('Submitting registration data:', userData);

        // First, check if Supabase is configured properly
        if (!supabase) {
          throw new Error('Supabase client is not initialized properly');
        }

        try {
          // Register with Supabase
          const { data, error } = await supabase.auth.signUp({
            email: formData.email.trim(),
            password: formData.password,
            options: {
              data: userData
            }
          });
          
          if (error) {
            throw error;
          }
          
          if (data.user) {
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              name: userData.name,
              role: userType
            }));
            
            // If email confirmation is required, show a message
            if (data.session === null) {
              router.push('/signup-success?email=' + encodeURIComponent(formData.email));
            } else {
              // Otherwise, redirect to appropriate dashboard
              router.push(`/dashboard/${userType}`);
            }
          } else {
            throw new Error('Registration failed. Please try again.');
          }
        } catch (supabaseError: any) {
          console.error('Supabase registration error:', supabaseError);
          
          // If Supabase fails, fall back to the API route
          console.log('Falling back to API route for registration');
          
          // Add email and password to userData for the API route
          const apiUserData = {
            ...userData,
            email: formData.email.trim(),
            password: formData.password
          };
          
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiUserData)
          });
          
          const responseData = await response.json();
          
          if (!response.ok) {
            throw new Error(responseData.message || 'Registration failed');
          }
          
          // Store token and user info
          if (responseData.token) {
            localStorage.setItem('token', responseData.token);
            if (responseData.user) {
              localStorage.setItem('user', JSON.stringify(responseData.user));
            }
            // Redirect to appropriate dashboard
            router.push(`/dashboard/${userType}`);
          } else {
            throw new Error('Registration successful but no token received');
          }
        }
      } catch (err: any) {
        console.error('Registration error in component:', err);
        let errorMessage = 'Failed to create account. Please try again.';
        
        if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Pass user type as a custom parameter
            user_type: userType || 'patient'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // The redirect will happen automatically
    } catch (err: any) {
      console.error('Google sign-up error:', err);
      setError(err.message || 'Failed to sign up with Google');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setUserType(null);
    }
    setError('');
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen font-['Product_Sans', 'sans-serif']">
      <Head>
        <title>Sign Up - flowAID</title>
        <meta name="description" content="Create your flowAID account" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Product+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden md:max-w-2xl m-4 transition-all duration-300 hover:shadow-xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create Account</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">Join flowAID today</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
              >
                {error}
              </motion.div>
            )}

            {!userType ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200">I want to register as:</h2>
                <div className="grid grid-cols-2 gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center justify-center p-8 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                    onClick={() => setUserType('patient')}
                  >
                    <img 
                      src="/images/patient-icon.svg" 
                      alt="Patient" 
                      className="w-16 h-16 mb-3 text-blue-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png';
                      }}
                    />
                    <span className="mt-2 text-lg font-medium text-gray-800 dark:text-white">Patient</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center justify-center p-8 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                    onClick={() => setUserType('doctor')}
                  >
                    <img 
                      src="/images/doctor-icon.svg" 
                      alt="Doctor" 
                      className="w-16 h-16 mb-3 text-green-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://cdn-icons-png.flaticon.com/512/3774/3774131.png';
                      }}
                    />
                    <span className="mt-2 text-lg font-medium text-gray-800 dark:text-white">Doctor</span>
                  </motion.button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button 
                      type="button" 
                      onClick={handleGoogleSignUp}
                      className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                      disabled={isSubmitting}
                    >
                      <img 
                        src="/images/google-icon.svg" 
                        alt="Google" 
                        className="w-5 h-5 mr-2 text-gray-600 dark:text-white"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://cdn-icons-png.flaticon.com/512/281/281764.png';
                        }}
                      />
                      Sign up with Google
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    {userType === 'patient' ? 'Patient Registration' : 'Doctor Registration'} - Step {step} of {userType === 'doctor' ? 3 : 2}
                  </h2>
                  {step === 1 && (
                    <button 
                      type="button" 
                      onClick={() => setUserType(null)}
                      className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400"
                    >
                      Change
                    </button>
                  )}
                </div>
                
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {step === 2 && userType === 'patient' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Date of Birth
                        </label>
                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          required
                          value={formData.gender}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {step === 2 && userType === 'doctor' && (
                  <>
                    <div>
                      <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Specialty
                      </label>
                      <input
                        id="specialty"
                        name="specialty"
                        type="text"
                        required
                        value={formData.specialty}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        License Number
                      </label>
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        required
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Years of Experience
                      </label>
                      <input
                        id="experience"
                        name="experience"
                        type="number"
                        required
                        value={formData.experience}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {step === 3 && userType === 'doctor' && (
                  <>
                    <div>
                      <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Education & Qualifications
                      </label>
                      <textarea
                        id="education"
                        name="education"
                        rows={4}
                        required
                        value={formData.education}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-between space-x-4">
                  {(step > 1 || userType) && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                      disabled={isSubmitting}
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      step < (userType === 'doctor' ? 3 : 2) ? 'Next' : 'Create Account'
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}