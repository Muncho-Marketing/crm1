import React, { useState, useEffect, useRef } from 'react';
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
  
  // Flag to prevent auth state processing during emergency reset
  const isResetting = useRef(false);
  const authSubscription = useRef<any>(null);

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

        if (session?.user && !isResetting.current) {
          console.log('Found existing session for user:', session.user.id);
          await handleSupabaseUser(session.user);
        } else {
          console.log('No existing session found or resetting in progress');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Don't block the app - show login page
      } finally {
        if (!isResetting.current) {
          setLoadingSession(false);
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Resetting:', isResetting.current);
      
      // Ignore auth state changes during reset
      if (isResetting.current) {
        console.log('Ignoring auth state change during reset');
        return;
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        await handleSupabaseUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAppState('login');
        localStorage.removeItem('muncho_onboarding_progress');
        setLoadingSession(false);
      }
    });

    authSubscription.current = subscription;

    return () => {
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
    };
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
        setLoadingSession(false);
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
      
      setLoadingSession(false);
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
      setLoadingSession(false);
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
      console.log('Logging out user...');
      
      // Clear all local storage
      localStorage.removeItem('muncho_onboarding_progress');
      localStorage.removeItem('muncho_onboarding_complete');
      localStorage.removeItem('muncho_onboarding_status');
      localStorage.removeItem('muncho_remember_token');
      localStorage.removeItem('muncho_login_attempts');
      localStorage.removeItem('muncho_login_lockout');
      
      // Reset app state immediately
      setUser(null);
      setAppState('login');
      setLoadingSession(false);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        showToast('Logged out (with minor issues)', 'info');
      } else {
        showToast('Successfully logged out', 'success');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, we've already reset the local state
      showToast('Logged out locally', 'info');
    }
  };

  const handleEmergencyReset = async () => {
    try {
      console.log('Emergency reset triggered...');
      
      // Set reset flag to prevent auth state listener from interfering
      isResetting.current = true;
      
      // Unsubscribe from auth changes temporarily
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
        authSubscription.current = null;
      }
      
      // Force clear everything
      localStorage.clear();
      sessionStorage.clear();
      
      // Reset all state immediately
      setUser(null);
      setAppState('login');
      setLoadingSession(false);
      
      // Force sign out with global scope
      await supabase.auth.signOut({ scope: 'global' });
      
      // Wait a moment for signout to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear reset flag
      isResetting.current = false;
      
      // Re-establish auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed (after reset):', event);
        
        if (isResetting.current) {
          console.log('Ignoring auth state change during reset');
          return;
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          await handleSupabaseUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setAppState('login');
          localStorage.removeItem('muncho_onboarding_progress');
          setLoadingSession(false);
        }
      });

      authSubscription.current = subscription;
      
      showToast('Reset complete - please sign in again', 'success');
    } catch (error) {
      console.error('Emergency reset error:', error);
      // Clear reset flag even on error
      isResetting.current = false;
      
      // Force reload as last resort
      showToast('Forcing page reload...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Show loading spinner while checking session
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Loading...</p>
          
          {/* Emergency Reset Button */}
          <button
            onClick={handleEmergencyReset}
            disabled={isResetting.current}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting.current ? 'Resetting...' : 'Reset to Login'}
          </button>
          
          <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
            Stuck? Click "Reset to Login" to clear all data and start fresh
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