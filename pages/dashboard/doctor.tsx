import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function DoctorDashboard() {
  // Mock data for today's appointments
  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      time: '09:00 AM',
      reason: 'Annual checkup',
      status: 'checked-in',
      waitTime: '5 min'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      time: '10:30 AM',
      reason: 'Follow-up',
      status: 'scheduled',
      waitTime: '-'
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      time: '11:15 AM',
      reason: 'Prescription refill',
      status: 'scheduled',
      waitTime: '-'
    },
    {
      id: 4,
      patientName: 'Emily Davis',
      time: '01:00 PM',
      reason: 'Lab results review',
      status: 'scheduled',
      waitTime: '-'
    },
    {
      id: 5,
      patientName: 'Michael Wilson',
      time: '02:30 PM',
      reason: 'New patient consultation',
      status: 'scheduled',
      waitTime: '-'
    }
  ]);

  // Mock data for recent patients
  const [recentPatients, setRecentPatients] = useState([
    {
      id: 101,
      name: 'John Doe',
      age: 45,
      lastVisit: '2023-07-28',
      condition: 'Hypertension',
      nextAppointment: '2023-08-15'
    },
    {
      id: 102,
      name: 'Jane Smith',
      age: 38,
      lastVisit: '2023-07-25',
      condition: 'Diabetes Type 2',
      nextAppointment: '2023-08-10'
    },
    {
      id: 103,
      name: 'Robert Johnson',
      age: 62,
      lastVisit: '2023-07-20',
      condition: 'Arthritis',
      nextAppointment: '2023-08-03'
    }
  ]);

  // Mock data for pending tasks
  const [pendingTasks, setPendingTasks] = useState([
    {
      id: 201,
      type: 'Prescription Renewal',
      patient: 'Sarah Thompson',
      dueDate: '2023-08-02',
      priority: 'high'
    },
    {
      id: 202,
      type: 'Lab Results Review',
      patient: 'David Miller',
      dueDate: '2023-08-03',
      priority: 'medium'
    },
    {
      id: 203,
      type: 'Medical Record Update',
      patient: 'Lisa Anderson',
      dueDate: '2023-08-05',
      priority: 'low'
    },
    {
      id: 204,
      type: 'Referral Letter',
      patient: 'James Wilson',
      dueDate: '2023-08-01',
      priority: 'high'
    }
  ]);

  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'checked-in':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Head>
        <title>Doctor Dashboard - flowAID</title>
        <meta name="description" content="Doctor dashboard for flowAID healthcare platform" />
      </Head>

      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                Doctor Dashboard
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/profile/doctor" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                View Profile
              </Link>
              <Link href="/schedule" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Manage Schedule
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Today's Appointments */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg lg:col-span-2">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Today's Appointments</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Your schedule for today.</p>
                </div>
                <Link href="/appointments/schedule" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  View full schedule
                </Link>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                {todayAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Patient
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Reason
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Wait Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {todayAppointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {appointment.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {appointment.patientName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {appointment.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {appointment.waitTime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/patients/${appointment.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                                View
                              </Link>
                              <Link href={`/appointments/${appointment.id}/start`} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                Start
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-4 py-5 sm:px-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No appointments scheduled for today.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Patients</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Patients you've seen recently.</p>
                </div>
                <Link href="/patients" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  View all patients
                </Link>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                {recentPatients.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentPatients.map((patient) => (
                      <li key={patient.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Link href={`/patients/${patient.id}`} className="block">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{patient.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Age: {patient.age} | {patient.condition}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="text-sm text-gray-900 dark:text-white">Last visit: {patient.lastVisit}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Next: {patient.nextAppointment}</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-5 sm:px-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No recent patients.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pending Tasks</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Tasks that require your attention.</p>
                </div>
                <Link href="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  View all tasks
                </Link>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                {pendingTasks.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {pendingTasks.map((task) => (
                      <li key={task.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{task.type}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Patient: {task.patient}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm text-gray-900 dark:text-white">Due: {task.dueDate}</p>
                            <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(task.priority)}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Link href={`/tasks/${task.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            Complete Task →
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-5 sm:px-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No pending tasks.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Stats</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Your activity overview.</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Patients Seen Today
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                          3
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Appointments This Week
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                          24
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Pending Referrals
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                          7
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Avg. Patient Satisfaction
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                          4.8/5
                        </dd>
                      </dl>
                    </div>
                  </div>
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