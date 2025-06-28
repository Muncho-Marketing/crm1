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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoadingSession(false);
          return;
        }

        if (session?.user) {
          await handleSupabaseUser(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoadingSession(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      // Check if user has a restaurant (onboarding complete)
      const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('onboarding_complete')
        .eq('owner_id', supabaseUser.id)
        .limit(1);

      if (error) {
        console.error('Error fetching restaurant:', error);
        // Default to onboarding if there's an error
        setAppState('onboarding');
        return;
      }

      const restaurant = restaurants && restaurants.length > 0 ? restaurants[0] : null;

      const userData: User = {
        firstName: supabaseUser.user_metadata?.first_name || supabaseUser.email?.split('@')[0] || 'User',
        role: 'admin',
        onboardingComplete: restaurant?.onboarding_complete || false,
        email: supabaseUser.email
      };

      setUser(userData);

      // Determine app state based on onboarding status
      if (restaurant?.onboarding_complete) {
        setAppState('dashboard');
      } else {
        const onboardingProgress = localStorage.getItem('muncho_onboarding_progress');
        setAppState('onboarding');
        if (onboardingProgress) {
          showToast('Resuming your setup where you left off...', 'info');
        }
      }
    } catch (error) {
      console.error('Error handling user:', error);
      setAppState('onboarding'); // Default to onboarding if there's an error
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
          <p className="text-gray-600">Loading...</p>
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