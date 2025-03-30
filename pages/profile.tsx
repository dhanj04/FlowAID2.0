import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../components/Layout';
import { PencilSquareIcon, ShieldCheckIcon, BellIcon, CogIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    medicalHistory: '',
    allergies: '',
    medications: ''
  });

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
      
      // Set form data with user info
      if (userData.profile) {
        setFormData({
          firstName: userData.profile.firstName || '',
          lastName: userData.profile.lastName || '',
          email: userData.email || '',
          phone: userData.profile.phone || '',
          address: userData.profile.address || '',
          city: userData.profile.city || '',
          state: userData.profile.state || '',
          zipCode: userData.profile.zipCode || '',
          medicalHistory: userData.profile.medicalHistory || '',
          allergies: userData.profile.allergies || '',
          medications: userData.profile.medications || ''
        });
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user data in localStorage
    if (user) {
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          medicalHistory: formData.medicalHistory,
          allergies: formData.allergies,
          medications: formData.medications
        },
        email: formData.email
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      
      // Show success message
      alert('Profile updated successfully!');
    }
  };
  
  const profileImageUrl = user?.profile?.profileImage || '/images/default-avatar.svg';

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>My Profile | FlowAID Healthcare</title>
        <meta name="description" content="Manage your healthcare profile and preferences" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Manage your personal information and healthcare preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-primary to-secondary">
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white">
                      <Image 
                        src={profileImageUrl}
                        alt="Profile"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-20 pb-6 px-6 text-center">
                  <h2 className="text-2xl font-bold mb-1">{user?.profile?.firstName} {user?.profile?.lastName}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
                  
                  <div className="flex justify-center space-x-2 mb-6">
                    <Badge variant="primary" size="md" rounded>Patient</Badge>
                    {user?.profile?.isVerified && (
                      <Badge variant="success" size="md" rounded>Verified</Badge>
                    )}
                  </div>
                  
                  {!editMode && (
                    <Button 
                      variant="outline" 
                      size="md" 
                      onClick={() => setEditMode(true)}
                      className="flex items-center justify-center mx-auto"
                    >
                      <PencilSquareIcon className="h-5 w-5 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                  <h3 className="font-semibold text-lg mb-3">Quick Access</h3>
                  <div className="space-y-2">
                    <a 
                      href="/dashboard/patient/appointments" 
                      className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <BellIcon className="h-5 w-5 text-primary mr-3" />
                      <span>My Appointments</span>
                    </a>
                    <a 
                      href="/dashboard/patient/records" 
                      className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ChartBarIcon className="h-5 w-5 text-primary mr-3" />
                      <span>Health Records</span>
                    </a>
                    <a 
                      href="/settings" 
                      className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <CogIcon className="h-5 w-5 text-primary mr-3" />
                      <span>Settings</span>
                    </a>
                    <a 
                      href="/privacy" 
                      className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ShieldCheckIcon className="h-5 w-5 text-primary mr-3" />
                      <span>Privacy & Security</span>
                    </a>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {editMode ? 'Edit Profile Information' : 'Profile Information'}
                  </h2>
                  {editMode && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {editMode ? (
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                        <Input
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                        <Input
                          label="Email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <Input
                          label="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <Input
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="md:col-span-2"
                        />
                        <Input
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                          />
                          <Input
                            label="Zip Code"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Medical History
                            </label>
                            <textarea
                              name="medicalHistory"
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                              value={formData.medicalHistory}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Allergies
                            </label>
                            <textarea
                              name="allergies"
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                              value={formData.allergies}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Current Medications
                            </label>
                            <textarea
                              name="medications"
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                              value={formData.medications}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mb-8">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {user?.profile?.firstName} {user?.profile?.lastName}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                          <p className="mt-1 text-gray-900 dark:text-white">{user?.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {user?.profile?.phone || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</h3>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {user?.createdAt 
                              ? new Date(user.createdAt).toLocaleDateString() 
                              : 'Unknown'}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {user?.profile?.address 
                              ? `${user.profile.address}, ${user.profile.city || ''} ${user.profile.state || ''} ${user.profile.zipCode || ''}` 
                              : 'No address specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Medical History</h4>
                            <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
                              {user?.profile?.medicalHistory || 'No medical history recorded'}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Allergies</h4>
                            <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
                              {user?.profile?.allergies || 'No allergies recorded'}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Medications</h4>
                            <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-line">
                              {user?.profile?.medications || 'No medications recorded'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ProfilePage;
