import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

const publicPages = ['/login', '/signup', '/forgot-password', '/signup-success', '/', '/about', '/contact', '/services'];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      const isPublicPage = publicPages.includes(router.pathname) || 
                           router.pathname.startsWith('/auth/') ||
                           router.pathname === '/404';

      if (!user && !isPublicPage) {
        router.push('/login');
      } else {
        setIsAuthChecked(true);
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [router]);

  if (!isAuthChecked && !publicPages.includes(router.pathname) && !router.pathname.startsWith('/auth/')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;