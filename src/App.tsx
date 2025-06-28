import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import OnboardingWizard from './components/OnboardingWizard';
import Dashboard from './components/Dashboard';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';
import { supabase } from './lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  firstName: string;
  role: string;
  onboardingComplete: boolean;
  email?: string;
}

type AppState = 'login' | 'onboarding' | 'dashboard';

function App() {
  const { toast, showToast, hideToast } = useToast();
  const [appState, setAppState] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    // Check for existing Supabase session
    const checkSession = async () => {
      try {
        console.log('Checking Supabase session...');
        
        // Test basic connection first
        const { data: testData, error: testError } = await supabase
          .from('restaurants')
          .select('count')
          .limit(1);
        
        if (testError) {
          console.warn('Database connection test failed:', testError);
          // Continue anyway - might be a permissions issue
        } else {
          console.log('Database connection test successful');
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoadingSession(false);
          return;
        }

        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          await handleSupabaseUser(session.user);
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Don't block the app - show login page
      } finally {
        setLoadingSession(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        await handleSupabaseUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAppState('login');
        localStorage.removeItem('muncho_onboarding_progress');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSupabaseUser = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Handling user:', supabaseUser.id);
      
      // Create user data first with defaults
      const userData: User = {
        firstName: supabaseUser.user_metadata?.first_name || supabaseUser.email?.split('@')[0] || 'User',
        role: 'admin',
        onboardingComplete: false,
        email: supabaseUser.email
      };

      console.log('Created user data:', userData);
      
      // Check if user has a restaurant (onboarding complete)
      console.log('Fetching restaurant for user...');
      const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('onboarding_complete')
        .eq('owner_id', supabaseUser.id)
        .limit(1);

      console.log('Restaurant query result:', { restaurants, error });

      if (error) {
        console.error('Error fetching restaurant:', error);
        // If there's a database error, assume onboarding is needed
        console.log('Database error - defaulting to onboarding');
        setUser(userData);
        setAppState('onboarding');
        return;
      }

      const restaurant = restaurants && restaurants.length > 0 ? restaurants[0] : null;
      console.log('Restaurant found:', restaurant);

      // Update user data with onboarding status
      userData.onboardingComplete = restaurant?.onboarding_complete || false;
      console.log('Updated user data:', userData);

      setUser(userData);

      // Determine app state based on onboarding status
      if (restaurant?.onboarding_complete) {
        console.log('User has completed onboarding, showing dashboard');
        setAppState('dashboard');
      } else {
        console.log('User needs onboarding');
        const onboardingProgress = localStorage.getItem('muncho_onboarding_progress');
        setAppState('onboarding');
        if (onboardingProgress) {
          showToast('Resuming your setup where you left off...', 'info');
        }
      }
    } catch (error) {
      console.error('Error handling user:', error);
      // Default to onboarding if there's an error
      const userData: User = {
        firstName: supabaseUser.user_metadata?.first_name || supabaseUser.email?.split('@')[0] || 'User',
        role: 'admin',
        onboardingComplete: false,
        email: supabaseUser.email
      };
      setUser(userData);
      setAppState('onboarding');
    }
  };

  const handleLoginSuccess = (userData: User) => {
    // This will be handled by the auth state change listener
    // No need to manually set state here as Supabase auth will trigger the listener
  };

  const handleOnboardingComplete = () => {
    setAppState('dashboard');
    showToast('🎉 Your Muncho CRM is ready! Welcome aboard!', 'success');
  };

  const handleOnboardingSaveAndExit = () => {
    setAppState('dashboard');
    showToast('Progress saved. You can resume setup anytime.', 'info');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      showToast('You have been logged out successfully.', 'info');
    } catch (error) {
      console.error('Error signing out:', error);
      showToast('Error signing out. Please try again.', 'error');
    }
  };

  // Show loading spinner while checking session
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Loading...</p>
          
          {/* Emergency Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Reset to Login
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Stuck? Click "Reset to Login" to start fresh
          </p>
        </div>
      </div>
    );
  }

  const renderCurrentState = () => {
    switch (appState) {
      case 'login':
        return (
          <LoginPage 
            onShowToast={showToast} 
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case 'onboarding':
        return (
          <OnboardingWizard
            userEmail={user?.email || 'demo@restaurant.com'}
            onComplete={handleOnboardingComplete}
            onSaveAndExit={handleOnboardingSaveAndExit}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            user={user!}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {renderCurrentState()}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;