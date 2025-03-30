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

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

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
    <nav className="bg-white dark:bg-gray-800 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  flowAID
                </span>
              </motion.div>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {/* Main navigation links */}
              {user ? (
                <>
                  <NavLink href="/dashboard" active={router.pathname === '/dashboard'}>
                    Dashboard
                  </NavLink>
                  <NavLink href="/model" active={router.pathname === '/model'}>
                    AI Model
                  </NavLink>
                  <NavLink 
                    href="/dashboard/patient/appointments" 
                    active={router.pathname.includes('/appointments')}
                  >
                    Appointments
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink href="/" active={router.pathname === '/'}>
                    Home
                  </NavLink>
                  <NavLink href="/features" active={router.pathname === '/features'}>
                    Features
                  </NavLink>
                  <NavLink href="/about" active={router.pathname === '/about'}>
                    About
                  </NavLink>
                  {/* Resources Dropdown */}
                  <div className="relative inline-block">
                    <button
                      onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                      className="flex items-center text-base font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light focus:outline-none"
                    >
                      Resources
                      <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {resourcesDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                        <Link href="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                          Blog
                        </Link>
                        <Link href="/help-centre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                          Help Centre
                        </Link>
                        <Link href="/careers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                          Careers
                        </Link>
                        <Link href="/terms-of-service" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                          Terms of Service
                        </Link>
                        <Link href="/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                          Privacy Policy
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Notifications"
                  >
                    <div className="relative">
                      <BellIcon className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div 
                                key={notification.id}
                                className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                  notification.read ? '' : 'bg-blue-50 dark:bg-blue-900/10'
                                }`}
                              >
                                <p className="text-sm text-gray-800 dark:text-gray-200">{notification.text}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center">
                              <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                          <button className="text-xs text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary w-full text-center">
                            Mark all as read
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* User menu */}
                <div className="relative ml-3">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                      {user?.name || 'User'}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                      >
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Your Profile
                        </Link>
                        <Link 
                          href="/settings" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Settings
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light px-3 py-2 text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {user ? (
                // Mobile authenticated navigation
                <>
                  <MobileNavLink href="/dashboard" active={router.pathname === '/dashboard'}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink href="/model" active={router.pathname === '/model'}>
                    AI Model
                  </MobileNavLink>
                  <MobileNavLink 
                    href="/dashboard/patient/appointments" 
                    active={router.pathname.includes('/appointments')}
                  >
                    Appointments
                  </MobileNavLink>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-500 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                // Mobile non-authenticated navigation
                <>
                  <MobileNavLink href="/" active={router.pathname === '/'}>
                    Home
                  </MobileNavLink>
                  <MobileNavLink href="/features" active={router.pathname === '/features'}>
                    Features
                  </MobileNavLink>
                  <MobileNavLink href="/about" active={router.pathname === '/about'}>
                    About
                  </MobileNavLink>
                  
                  {/* Resources Section in Mobile Menu */}
                  <div className="px-3 py-2">
                    <button
                      onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                      className="flex items-center w-full justify-between text-base font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light focus:outline-none"
                    >
                      <span>Resources</span>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {resourcesDropdownOpen && (
                      <div className="mt-2 pl-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700">
                        <Link href="/blog" className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                          Blog
                        </Link>
                        <Link href="/help-centre" className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                          Help Centre
                        </Link>
                        <Link href="/careers" className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                          Careers
                        </Link>
                        <Link href="/terms-of-service" className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                          Terms of Service
                        </Link>
                        <Link href="/privacy-policy" className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
                          Privacy Policy
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/login"
                      className="px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="px-3 py-2 rounded-md text-base font-medium bg-primary hover:bg-primary-dark text-white transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Helper component for desktop nav links
const NavLink = ({ 
  href, 
  active, 
  children 
}: { 
  href: string; 
  active: boolean; 
  children: React.ReactNode 
}) => {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
        active
          ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
          : 'border-transparent text-gray-600 hover:text-primary hover:border-gray-300 dark:text-gray-300 dark:hover:text-primary-light'
      }`}
    >
      {children}
    </Link>
  );
};

// Helper component for mobile nav links
const MobileNavLink = ({ 
  href, 
  active, 
  children 
}: { 
  href: string; 
  active: boolean; 
  children: React.ReactNode 
}) => {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        active
          ? 'bg-primary-light/10 text-primary dark:text-primary-light'
          : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:text-primary-light dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
