import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, MapPin, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OnboardingWizardProps {
  userEmail: string;
  onComplete: () => void;
  onSaveAndExit: () => void;
}

interface OnboardingData {
  step: number;
  fullName: string;
  mobileNumber: string;
  restaurantName: string;
  agreeToTerms: boolean;
  streetAddress: string;
  city: string;
  pincode: string;
  gstin: string;
  numberOfOutlets: number;
  restaurantType: string;
  posSystem: string;
  customPosName: string;
  goals: string[];
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ userEmail, onComplete, onSaveAndExit }) => {
  const [data, setData] = useState<OnboardingData>({
    step: 1,
    fullName: '',
    mobileNumber: '',
    restaurantName: '',
    agreeToTerms: false,
    streetAddress: '',
    city: '',
    pincode: '',
    gstin: '',
    numberOfOutlets: 1,
    restaurantType: '',
    posSystem: '',
    customPosName: '',
    goals: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomPosInput, setShowCustomPosInput] = useState(false);
  const [posSearchTerm, setPosSearchTerm] = useState('');

  // Load saved progress on mount
  useEffect(() => {
    const savedData = localStorage.getItem('muncho_onboarding_progress');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    localStorage.setItem('muncho_onboarding_progress', JSON.stringify(data));
  }, [data]);

  const posOptions = [
    'Petpooja', 'Posist', 'eZee', 'TouchBistro', 'Revel', 'Toast', 'Square',
    'Lightspeed', 'Clover', 'ShopKeep', 'Vend', 'Loyverse', 'SumUp', 'iZettle',
    'Shopify POS', 'NCR Silver', 'Harbortouch', 'Upserve', 'Aloha', 'Micros',
    'POSitouch', 'Digital Dining', 'Future POS', 'Restaurant Manager', 'Cake POS',
    'Breadcrumb', 'Lavu', 'Rezku', 'Bepoz', 'Aldelo', 'QSR Automations',
    'I don\'t use a POS', 'It\'s not on the list'
  ];

  const restaurantTypes = [
    'Fine-dine', 'Casual-dine', 'Café', 'Bar', 'Cloud Kitchen', 'QSR'
  ];

  const goalOptions = [
    'Increase Repeat Visits',
    'Run a Loyalty Program',
    'Collect Customer Data',
    'Send WhatsApp/SMS Campaigns',
    'Get More Google Reviews',
    'Improve Feedback & Ratings'
  ];

  const validateMobileNumber = (mobile: string): boolean => {
    // Remove all non-digits
    const cleaned = mobile.replace(/\D/g, '');
    
    // Handle different formats
    let normalizedNumber = cleaned;
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      normalizedNumber = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      normalizedNumber = cleaned.substring(1);
    }
    
    // Check if it's a valid 10-digit Indian mobile number
    return /^[6-9]\d{9}$/.test(normalizedNumber);
  };

  const formatMobileNumber = (mobile: string): string => {
    const cleaned = mobile.replace(/\D/g, '');
    let normalizedNumber = cleaned;
    
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      normalizedNumber = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      normalizedNumber = cleaned.substring(1);
    }
    
    return normalizedNumber;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!data.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        }
        if (!data.mobileNumber.trim()) {
          newErrors.mobileNumber = 'Mobile number is required';
        } else if (!validateMobileNumber(data.mobileNumber)) {
          newErrors.mobileNumber = 'Enter a valid 10-digit Indian mobile number';
        }
        if (!data.restaurantName.trim()) {
          newErrors.restaurantName = 'Restaurant name is required';
        }
        if (!data.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the terms and privacy policy';
        }
        break;
      case 2:
        if (!data.streetAddress.trim()) {
          newErrors.streetAddress = 'Street address is required';
        }
        if (!data.restaurantType) {
          newErrors.restaurantType = 'Restaurant type is required';
        }
        if (data.numberOfOutlets < 1) {
          newErrors.numberOfOutlets = 'Number of outlets must be at least 1';
        }
        break;
      case 3:
        if (!data.posSystem) {
          newErrors.posSystem = 'Please select a POS system';
        }
        if (data.posSystem === 'It\'s not on the list' && !data.customPosName.trim()) {
          newErrors.customPosName = 'Please enter your POS system name';
        }
        break;
      case 4:
        if (data.goals.length === 0) {
          newErrors.goals = 'Please select at least one goal';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(data.step)) {
      if (data.step < 4) {
        setData(prev => ({ ...prev, step: prev.step + 1 }));
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (data.step > 1) {
      setData(prev => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare restaurant data
      const restaurantData = {
        name: data.restaurantName,
        owner_id: user.id,
        street_address: data.streetAddress || null,
        city: data.city || null,
        pincode: data.pincode || null,
        gstin: data.gstin || null,
        restaurant_type: data.restaurantType || null,
        pos_system: data.posSystem === 'It\'s not on the list' ? data.customPosName : data.posSystem,
        custom_pos_name: data.posSystem === 'It\'s not on the list' ? data.customPosName : null,
        number_of_outlets: data.numberOfOutlets,
        goals: data.goals,
        onboarding_complete: true
      };

      // Insert restaurant data into database
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .insert(restaurantData)
        .select()
        .single();

      if (restaurantError) {
        throw restaurantError;
      }

      // Create initial credits balance for the restaurant
      const { error: creditsError } = await supabase
        .from('credits_balance')
        .insert({
          restaurant_id: restaurant.id,
          sms_credits: 150,
          email_credits: 200,
          whatsapp_utility_credits: 75,
          whatsapp_marketing_credits: 50
        });

      if (creditsError) {
        console.warn('Failed to create initial credits balance:', creditsError);
        // Don't throw error as this is not critical for onboarding completion
      }
      
      // Clear saved progress
      localStorage.removeItem('muncho_onboarding_progress');
      
      // Mark as completed
      localStorage.setItem('muncho_onboarding_complete', 'true');
      
      onComplete();
    } catch (error) {
      console.error('Onboarding completion failed:', error);
      setErrors({ general: 'Failed to complete setup. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndExit = () => {
    // Mark as abandoned for analytics
    localStorage.setItem('muncho_onboarding_status', 'abandoned');
    onSaveAndExit();
  };

  const handleMobileChange = (value: string) => {
    const formatted = formatMobileNumber(value);
    setData(prev => ({ ...prev, mobileNumber: formatted }));
    
    if (errors.mobileNumber && validateMobileNumber(value)) {
      setErrors(prev => ({ ...prev, mobileNumber: '' }));
    }
  };

  const handlePosSelection = (pos: string) => {
    setData(prev => ({ ...prev, posSystem: pos, customPosName: '' }));
    setShowCustomPosInput(pos === 'It\'s not on the list');
    
    if (errors.posSystem) {
      setErrors(prev => ({ ...prev, posSystem: '' }));
    }
  };

  const handleGoalToggle = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
    
    if (errors.goals) {
      setErrors(prev => ({ ...prev, goals: '' }));
    }
  };

  const filteredPosOptions = posOptions.filter(pos =>
    pos.toLowerCase().includes(posSearchTerm.toLowerCase())
  );

  const renderStep = () => {
    switch (data.step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Let's set up your Muncho CRM HQ
              </h2>
              <p className="text-gray-600">Takes less than 2 minutes</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => setData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Akash Sharma"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                value={data.mobileNumber}
                onChange={(e) => handleMobileChange(e.target.value)}
                placeholder="9876543210"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.mobileNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={data.restaurantName}
                onChange={(e) => setData(prev => ({ ...prev, restaurantName: e.target.value }))}
                placeholder="My Café & Grill"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.restaurantName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.restaurantName && (
                <p className="mt-1 text-sm text-red-600">{errors.restaurantName}</p>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={data.agreeToTerms}
                onChange={(e) => setData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms & Privacy</span>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about your restaurant(s)
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.streetAddress}
                  onChange={(e) => setData(prev => ({ ...prev, streetAddress: e.target.value }))}
                  placeholder="123 MG Road, Bangalore"
                  className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.streetAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.streetAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => setData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Bangalore"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={data.pincode}
                  onChange={(e) => setData(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder="560001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GSTIN (Optional)
              </label>
              <input
                type="text"
                value={data.gstin}
                onChange={(e) => setData(prev => ({ ...prev, gstin: e.target.value }))}
                placeholder="29ABCDE1234F1Z5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Outlets
              </label>
              <input
                type="number"
                min="1"
                value={data.numberOfOutlets}
                onChange={(e) => setData(prev => ({ ...prev, numberOfOutlets: parseInt(e.target.value) || 1 }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.numberOfOutlets ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.numberOfOutlets && (
                <p className="mt-1 text-sm text-red-600">{errors.numberOfOutlets}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Restaurant Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {restaurantTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setData(prev => ({ ...prev, restaurantType: type }))}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      data.restaurantType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.restaurantType && (
                <p className="mt-1 text-sm text-red-600">{errors.restaurantType}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Which POS do you use at checkout?
              </h2>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search POS systems..."
                value={posSearchTerm}
                onChange={(e) => setPosSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {filteredPosOptions.map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => handlePosSelection(pos)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors text-left ${
                    data.posSystem === pos
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            {showCustomPosInput && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your POS system name
                </label>
                <input
                  type="text"
                  value={data.customPosName}
                  onChange={(e) => setData(prev => ({ ...prev, customPosName: e.target.value }))}
                  placeholder="My Custom POS"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.customPosName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.customPosName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customPosName}</p>
                )}
              </div>
            )}

            {errors.posSystem && (
              <p className="text-sm text-red-600">{errors.posSystem}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What do you plan to achieve with Muncho CRM?
              </h2>
              <p className="text-gray-600">Select all that apply</p>
            </div>

            <div className="space-y-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={`w-full p-4 border rounded-lg text-left transition-colors flex items-center justify-between ${
                    data.goals.includes(goal)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="font-medium">{goal}</span>
                  {data.goals.includes(goal) && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            {errors.goals && (
              <p className="text-sm text-red-600">{errors.goals}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Muncho Setup</h1>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleSaveAndExit}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Save & Exit
            </button>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step < data.step
                      ? 'bg-blue-600 text-white'
                      : step === data.step
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < data.step ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < data.step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {renderStep()}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={data.step === 1}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <span>{data.step === 4 ? 'Finish Setup' : 'Continue'}</span>
                    {data.step < 4 && <ChevronRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;