import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SunIcon, 
  MoonIcon, 
  UserCircleIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import ModernButton from './ui/ModernButton';
import ModernBadge from './ui/ModernBadge';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, active, className = '' }) => {
  return (
    <Link href={href}>
      <motion.a
        className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${active 
          ? 'text-primary-600 dark:text-primary-400' 
          : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
        {active && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 dark:bg-primary-400 rounded-full"
            layoutId="navbar-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.a>
    </Link>
  );
};

const ModernNavbar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Check dark mode preference
    if (typeof window !== 'undefined') {
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Add scroll listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };
  
  // Sample notifications
  const notifications = [
    { id: 1, text: 'Your appointment has been confirmed', time: '10 minutes ago', read: false },
    { id: 2, text: 'New message from Dr. Johnson', time: '1 hour ago', read: false },
    { id: 3, text: 'Reminder: Follow-up appointment tomorrow', time: '3 hours ago', read: true }
  ];

  return (
    <nav className={`navbar-modern fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-md' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/">
              <motion.a
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-10 w-10 relative">
                  <img src="/flowaid-logo.svg" alt="flowAID Logo" className="h-full w-full" />
                </div>
                <span className="ml-2 text-2xl font-bold text-gradient">
                  flowAID
                </span>
              </motion.a>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              <NavLink href="/" active={router.pathname === '/'}>
                Home
              </NavLink>
              <NavLink href="/dashboard" active={router.pathname === '/dashboard'}>
                Dashboard
              </NavLink>
              <NavLink href="/model" active={router.pathname === '/model'}>
                AI Model
              </NavLink>
              <NavLink href="/about" active={router.pathname === '/about'}>
                About
              </NavLink>
              <NavLink href="/contact" active={router.pathname === '/contact'}>
                Contact
              </NavLink>
            </div>
          </div>
          
          {/* Right side navigation items */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </motion.button>
            
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <BellIcon className="h-5 w-5" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-gray-800"></span>
                    )}
                  </motion.button>
                  
                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                            <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Mark all as read</button>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                              {notifications.map((notification) => (
                                <div key={notification.id} className={`p-4 ${!notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                                  <div className="flex">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {notification.text}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {notification.time}
                                      </p>
                                    </div>
                                    {!notification.read && (
                                      <div>
                                        <ModernBadge variant="primary" size="xs">New</ModernBadge>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              No notifications
                            </div>
                          )}
                        </div>
                        <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                          <Link href="/notifications">