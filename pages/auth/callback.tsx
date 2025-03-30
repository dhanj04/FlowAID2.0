import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

const AuthCallback = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to get authentication session');
          setTimeout(() => router.push('/login?error=auth_failed'), 3000);
          return;
        }
        
        if (session) {
          // Session is available, get user data
          const { user } = session;
          
          // Store user info in localStorage for client-side access
          if (user) {
            try {
              // Get the user's metadata
              const role = user.user_metadata?.role || 
                          user.app_metadata?.role || 
                          'patient';
              
              const userData = {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || user.email,
                role: role
              };
              
              localStorage.setItem('user', JSON.stringify(userData));
              
              // Also store the session token
              localStorage.setItem('token', session.access_token);
              
              console.log('Authentication successful, redirecting to dashboard');
              
              // Redirect to appropriate dashboard based on user role
              router.push(`/dashboard/${role}`);
            } catch (storageError) {
              console.error('Error storing user data:', storageError);
              setError('Failed to store user data');
              setTimeout(() => router.push('/login?error=storage_failed'), 3000);
            }
          } else {
            console.error('No user in session');
            setError('Authentication successful but no user data found');
            setTimeout(() => router.push('/login?error=no_user'), 3000);
          }
        } else {
          // Try to get auth data from URL if session is not available
          console.log('No session found, checking URL parameters');
          
          const { token, role, error: urlError } = router.query;
          
          if (urlError) {
            console.error('URL error parameter:', urlError);
            setError('Authentication error: ' + urlError);
            setTimeout(() => router.push(`/login?error=${encodeURIComponent(urlError as string)}`), 3000);
            return;
          }
          
          if (token) {
            // Store the token from URL parameters
            localStorage.setItem('token', token as string);
            
            // Redirect to the appropriate dashboard based on role
            if (role) {
              router.push(`/dashboard/${role}`);
            } else {
              // Default to patient dashboard if role is not specified
              router.push('/dashboard/patient');
            }
          } else {
            console.error('No session or token found');
            setError('No authentication data found');
            setTimeout(() => router.push('/login?error=no_auth_data'), 3000);
          }
        }
      } catch (error) {
        console.error('Authentication callback error:', error);
        setError('Authentication process failed');
        setTimeout(() => router.push('/login?error=auth_failed'), 3000);
      }
    };
    
    // Only run the callback handler when the router is ready
    if (router.isReady) {
      handleAuthCallback();
    }
  }, [router.isReady, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full">
        {error ? (
          <>
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Error
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 mb-4">
              {error}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting you to the login page...
            </p>
          </>
        ) : (
          <>
            <div className="animate-spin mb-4 mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Completing authentication...
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Please wait while we complete your sign-in process.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;