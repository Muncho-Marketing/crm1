import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Palette, Upload } from 'lucide-react';
import CampaignWizardStep7 from './CampaignWizardStep7';

interface Template {
  id: string;
  title: string;
  description: string;
  image: string;
  hasOffer: boolean;
  offerType?: 'no-discount' | 'free-item' | 'flat' | 'percentage';
  hasWhatsApp: boolean;
  slug: string;
  objective: string;
  heroImage: string;
  brandColor: string;
  headline: string;
  subtitle: string;
  defaultReward: {
    type: 'percentage' | 'flat' | 'free-item' | 'no-discount';
    value?: number;
    item?: string;
  };
}

interface CampaignWizardProps {
  template: Template;
  hasWhatsAppHeader: boolean;
  onBack: () => void;
  onComplete: () => void;
}

interface WizardData {
  // Step 1 - Channels
  channels: {
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
  };
  
  // Step 2 - Campaign Details
  rewardType: 'percentage' | 'flat' | 'free-item' | 'no-discount';
  rewardValue?: number;
  rewardItem?: string;
  purchaseType: 'entire' | 'specific';
  category?: string;
  minPurchase?: number;
  title: string;
  subtitle: string;
  
  // Step 3 - Terms
  redemptionFrequency: 'once' | 'multiple';
  terms: string;
  showPhone: boolean;
  
  // Step 4-6 - Channel Reviews
  whatsappMessage?: string;
  smsMessage?: string;
  emailSubject?: string;
  emailPreheader?: string;
  emailBody?: string;
  
  // Step 7 - Audience
  audienceType: 'all' | 'groups' | 'advanced';
  selectedGroups: string[];
  advancedFilters: any[];
  skipInvalidNumbers: boolean;
  
  // Step 8 - Scheduling
  sendTime: 'now' | 'later';
  scheduledDate?: Date;
  
  // Preview customization
  heroImage: string;
  brandColor: string;
  
  // Step 9-10 - Review & Launch
  // (handled in final steps)
}

const CampaignWizard: React.FC<CampaignWizardProps> = ({
  template,
  hasWhatsAppHeader,
  onBack,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const [wizardData, setWizardData] = useState<WizardData>({
    // Pre-fill with template data
    channels: {
      whatsapp: template.hasWhatsApp && hasWhatsAppHeader,
      sms: true,
      email: true
    },
    rewardType: template.defaultReward.type,
    rewardValue: template.defaultReward.value,
    rewardItem: template.defaultReward.item,
    purchaseType: 'entire',
    title: template.headline,
    subtitle: template.subtitle,
    redemptionFrequency: 'once',
    terms: 'Standard terms and conditions apply. Offer valid for limited time only. Cannot be combined with other offers. Reward cannot be exchanged for cash.',
    showPhone: true,
    audienceType: 'groups',
    selectedGroups: ['all-customers'],
    advancedFilters: [],
    skipInvalidNumbers: true,
    sendTime: 'now',
    heroImage: template.heroImage,
    brandColor: template.brandColor
  });

  const colorOptions = [
    '#e74c3c', // Red
    '#3498db', // Blue  
    '#2ecc71', // Green
    '#f39c12', // Orange
    '#9b59b6', // Purple
    '#1abc9c'  // Teal
  ];

  const updateWizardData = useCallback((data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
    // Clear related errors when data is updated
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(data).forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!wizardData.channels.whatsapp && !wizardData.channels.sms && !wizardData.channels.email) {
          newErrors.channels = 'Please select at least one channel';
        }
        break;
      case 2:
        if (!wizardData.title.trim()) {
          newErrors.title = 'Campaign title is required';
        }
        if (wizardData.title.length > 40) {
          newErrors.title = 'Campaign title must be 40 characters or less';
        }
        if (wizardData.subtitle && wizardData.subtitle.length > 60) {
          newErrors.subtitle = 'Campaign subtitle must be 60 characters or less';
        }
        break;
      case 3:
        if (!wizardData.terms.trim()) {
          newErrors.terms = 'At least one term must be included';
        }
        break;
      case 4:
        if (wizardData.channels.whatsapp && (!wizardData.whatsappMessage || wizardData.whatsappMessage.length > 1000)) {
          newErrors.whatsappMessage = 'WhatsApp message is required and must be 1000 characters or less';
        }
        break;
      case 5:
        if (wizardData.channels.sms && (!wizardData.smsMessage || wizardData.smsMessage.length > 160)) {
          newErrors.smsMessage = 'SMS message is required and must be 160 characters or less';
        }
        break;
      case 6:
        if (wizardData.channels.email) {
          if (!wizardData.emailSubject || wizardData.emailSubject.length > 80) {
            newErrors.emailSubject = 'Email subject is required and must be 80 characters or less';
          }
          if (wizardData.emailPreheader && wizardData.emailPreheader.length > 120) {
            newErrors.emailPreheader = 'Email preheader must be 120 characters or less';
          }
          if (wizardData.emailBody && wizardData.emailBody.length > 1000) {
            newErrors.emailBody = 'Email body must be 1000 characters or less';
          }
        }
        break;
      case 7:
        if (wizardData.audienceType === 'groups' && wizardData.selectedGroups.length === 0) {
          newErrors.audience = 'Select at least one group or switch to another option';
        }
        if (wizardData.audienceType === 'advanced' && wizardData.advancedFilters.length === 0) {
          newErrors.audience = 'Please add at least one filter rule';
        }
        // Check for zero-size audience
        const totalCustomers = getTotalCustomers();
        if (totalCustomers === 0) {
          newErrors.audience = 'Your selected audience is empty—please adjust your groups or filters';
        }
        break;
      case 8:
        if (wizardData.sendTime === 'later' && !wizardData.scheduledDate) {
          newErrors.scheduledDate = 'Please select a date and time';
        }
        if (wizardData.scheduledDate && wizardData.scheduledDate < new Date(Date.now() + 15 * 60 * 1000)) {
          newErrors.scheduledDate = 'Scheduled time must be at least 15 minutes from now';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [wizardData]);

  const getTotalCustomers = () => {
    // Mock calculation based on audience type
    if (wizardData.audienceType === 'all') {
      return 1234;
    } else if (wizardData.audienceType === 'groups') {
      // Mock group counts
      const groupCounts: Record<string, number> = {
        'all-customers': 1234,
        'new-customers': 156,
        'loyal-customers': 89,
        'vip-customers': 45,
        'at-risk': 234,
        'promising': 123,
        'need-attention': 67
      };
      return wizardData.selectedGroups.reduce((total, groupId) => {
        return total + (groupCounts[groupId] || 0);
      }, 0);
    } else {
      return 567; // Mock count for advanced filters
    }
  };

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      // Skip steps for unselected channels
      let nextStep = currentStep + 1;
      
      // Skip WhatsApp review if not selected
      if (nextStep === 4 && !wizardData.channels.whatsapp) {
        nextStep = 5;
      }
      // Skip SMS review if not selected
      if (nextStep === 5 && !wizardData.channels.sms) {
        nextStep = 6;
      }
      // Skip Email review if not selected
      if (nextStep === 6 && !wizardData.channels.email) {
        nextStep = 7;
      }
      
      if (nextStep <= 10) {
        setCurrentStep(nextStep);
      } else {
        onComplete();
      }
    }
  }, [currentStep, validateStep, onComplete, wizardData.channels]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      let prevStep = currentStep - 1;
      
      // Skip Email review if not selected (going backwards)
      if (prevStep === 6 && !wizardData.channels.email) {
        prevStep = 5;
      }
      // Skip SMS review if not selected (going backwards)
      if (prevStep === 5 && !wizardData.channels.sms) {
        prevStep = 4;
      }
      // Skip WhatsApp review if not selected (going backwards)
      if (prevStep === 4 && !wizardData.channels.whatsapp) {
        prevStep = 3;
      }
      
      setCurrentStep(prevStep);
    } else {
      onBack();
    }
  }, [currentStep, onBack, wizardData.channels]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 500 * 1024) { // 500KB limit
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateWizardData({ heroImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getRewardText = () => {
    switch (wizardData.rewardType) {
      case 'percentage':
        return wizardData.rewardValue ? `${wizardData.rewardValue}% OFF` : 'DISCOUNT';
      case 'flat':
        return wizardData.rewardValue ? `₹${wizardData.rewardValue} OFF` : '₹ OFF';
      case 'free-item':
        return wizardData.rewardItem || 'FREE ITEM';
      case 'no-discount':
        return 'SPECIAL OFFER';
      default:
        return 'OFFER';
    }
  };

  const getExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const renderPreviewCard = () => (
    <div 
      className="rounded-lg shadow-lg p-6 max-w-sm mx-auto"
      style={{ backgroundColor: wizardData.brandColor }}
    >
      <div className="relative mb-4">
        <img
          src={wizardData.heroImage}
          alt="Campaign"
          className="w-full h-48 object-cover rounded-lg"
        />
        
        {/* Reward Pill */}
        {wizardData.rewardType !== 'no-discount' && (
          <div 
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-sm font-bold"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          >
            {getRewardText()}
          </div>
        )}

        {/* Change Image Button */}
        <label className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-opacity-70 transition-opacity">
          <Upload className="w-4 h-4 inline mr-1" />
          Change Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="space-y-3 text-white">
        <h3 className="text-xl font-bold">{wizardData.title}</h3>
        {wizardData.subtitle && (
          <p className="text-white text-opacity-90">{wizardData.subtitle}</p>
        )}
        
        {wizardData.minPurchase && (
          <p className="text-sm text-white text-opacity-75">On min purchase of ₹{wizardData.minPurchase}</p>
        )}

        <div className="text-xs text-white text-opacity-75 space-y-1">
          <p>Valid till {getExpiryDate()}</p>
          <p>
            {wizardData.redemptionFrequency === 'once' 
              ? 'Can be redeemed once per customer' 
              : 'Can be redeemed multiple times'
            }
          </p>
          <p>2 offers cannot be clubbed.</p>
          <p>Reward cannot be exchanged for cash.</p>
          {wizardData.showPhone && (
            <p>Call: +91 98765 43210</p>
          )}
        </div>
      </div>

      {/* Color Picker */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">Brand Color</span>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center space-x-1 text-white hover:text-opacity-80 text-sm"
          >
            <Palette className="w-4 h-4" />
            <span>Change</span>
          </button>
        </div>
        
        {showColorPicker && (
          <div className="flex space-x-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => {
                  updateWizardData({ brandColor: color });
                  setShowColorPicker(false);
                }}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  wizardData.brandColor === color 
                    ? 'border-white scale-110' 
                    : 'border-white border-opacity-50 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="min-h-screen bg-gray-50 flex">
            {/* Left Panel - Form */}
            <div className="w-1/2 bg-white p-8">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  How do you want to send the campaign?
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={wizardData.channels.whatsapp}
                      onChange={(e) => updateWizardData({ 
                        channels: { ...wizardData.channels, whatsapp: e.target.checked }
                      })}
                      disabled={!hasWhatsAppHeader}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">WhatsApp Marketing (Growth)</div>
                      {!hasWhatsAppHeader && (
                        <div className="text-sm text-gray-500">Upload a brand header in Settings to use WhatsApp</div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={wizardData.channels.sms}
                      onChange={(e) => updateWizardData({ 
                        channels: { ...wizardData.channels, sms: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">SMS</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={wizardData.channels.email}
                      onChange={(e) => updateWizardData({ 
                        channels: { ...wizardData.channels, email: e.target.checked }
                      })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Email</div>
                    </div>
                  </label>
                </div>

                {errors.channels && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{errors.channels}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 bg-gray-100 p-8 flex items-center justify-center">
              {renderPreviewCard()}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="min-h-screen bg-gray-50 flex">
            {/* Left Panel - Form */}
            <div className="w-1/2 bg-white p-8">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  What is the campaign about?
                </h2>
                
                <div className="space-y-6">
                  {/* Reward Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Reward Type</label>
                    <div className="space-y-3">
                      {[
                        { value: 'percentage', label: 'Redeem % Discount' },
                        { value: 'flat', label: 'Redeem ₹ Discount' },
                        { value: 'free-item', label: 'Redeem a Free Item' },
                        { value: 'no-discount', label: 'No Discount' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="rewardType"
                            value={option.value}
                            checked={wizardData.rewardType === option.value}
                            onChange={(e) => updateWizardData({ rewardType: e.target.value as any })}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-gray-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Value Input based on reward type */}
                  {wizardData.rewardType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Percentage (1-100)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={wizardData.rewardValue || ''}
                        onChange={(e) => updateWizardData({ rewardValue: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {wizardData.rewardType === 'flat' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹1-20,000)</label>
                      <input
                        type="number"
                        min="1"
                        max="20000"
                        value={wizardData.rewardValue || ''}
                        onChange={(e) => updateWizardData({ rewardValue: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {wizardData.rewardType === 'free-item' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Free Item</label>
                      <input
                        type="text"
                        value={wizardData.rewardItem || ''}
                        onChange={(e) => updateWizardData({ rewardItem: e.target.value })}
                        placeholder="e.g., Free Coffee, Free Dessert"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {/* Purchase Type Toggle */}
                  {(wizardData.rewardType === 'percentage' || wizardData.rewardType === 'flat') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Apply to</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="purchaseType"
                            value="entire"
                            checked={wizardData.purchaseType === 'entire'}
                            onChange={(e) => updateWizardData({ purchaseType: e.target.value as any })}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span>Entire purchase</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="purchaseType"
                            value="specific"
                            checked={wizardData.purchaseType === 'specific'}
                            onChange={(e) => updateWizardData({ purchaseType: e.target.value as any })}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span>Specific purchase</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Minimum Purchase */}
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!wizardData.minPurchase}
                        onChange={(e) => updateWizardData({ 
                          minPurchase: e.target.checked ? 500 : undefined 
                        })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-900">Minimum purchase required for redemption</span>
                    </label>
                    {wizardData.minPurchase && (
                      <div className="mt-2">
                        <input
                          type="number"
                          min="1"
                          value={wizardData.minPurchase}
                          onChange={(e) => updateWizardData({ minPurchase: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Minimum amount in ₹"
                        />
                      </div>
                    )}
                  </div>

                  {/* Campaign Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Title (max 40 characters)
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      value={wizardData.title}
                      onChange={(e) => updateWizardData({ title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-sm text-gray-500 mt-1">{wizardData.title.length}/40</div>
                    {errors.title && (
                      <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  {/* Campaign Subtitle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Subtitle (optional, max 60 characters)
                    </label>
                    <input
                      type="text"
                      maxLength={60}
                      value={wizardData.subtitle}
                      onChange={(e) => updateWizardData({ subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-sm text-gray-500 mt-1">{wizardData.subtitle.length}/60</div>
                    {errors.subtitle && (
                      <p className="text-red-600 text-sm mt-1">{errors.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 bg-gray-100 p-8 flex items-center justify-center">
              {renderPreviewCard()}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="min-h-screen bg-gray-50 flex">
            {/* Left Panel - Form */}
            <div className="w-1/2 bg-white p-8">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Add terms of your campaign
                </h2>
                
                <div className="space-y-6">
                  {/* Redemption Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Redemption Frequency</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="redemptionFrequency"
                          value="once"
                          checked={wizardData.redemptionFrequency === 'once'}
                          onChange={(e) => updateWizardData({ redemptionFrequency: e.target.value as any })}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>Only once</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="redemptionFrequency"
                          value="multiple"
                          checked={wizardData.redemptionFrequency === 'multiple'}
                          onChange={(e) => updateWizardData({ redemptionFrequency: e.target.value as any })}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>Multiple times</span>
                      </label>
                    </div>
                  </div>

                  {/* Terms Text Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                    <textarea
                      rows={6}
                      value={wizardData.terms}
                      onChange={(e) => updateWizardData({ terms: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.terms && (
                      <p className="text-red-600 text-sm mt-1">{errors.terms}</p>
                    )}
                  </div>

                  {/* Show Phone Toggle */}
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wizardData.showPhone}
                        onChange={(e) => updateWizardData({ showPhone: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-900">Show phone number</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 bg-gray-100 p-8 flex items-center justify-center">
              {renderPreviewCard()}
            </div>
          </div>
        );

      case 4:
        if (!wizardData.channels.whatsapp) {
          // Skip this step if WhatsApp is not selected
          setCurrentStep(5);
          return null;
        }
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Review WhatsApp
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left - Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Message (max 1000 characters)
                    </label>
                    <textarea
                      rows={8}
                      maxLength={1000}
                      value={wizardData.whatsappMessage || ''}
                      onChange={(e) => updateWizardData({ whatsappMessage: e.target.value })}
                      placeholder="Enter your WhatsApp message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {(wizardData.whatsappMessage || '').length}/1000
                    </div>
                    {errors.whatsappMessage && (
                      <p className="text-red-600 text-sm mt-1">{errors.whatsappMessage}</p>
                    )}
                  </div>
                </div>

                {/* Right - WhatsApp Preview */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="bg-green-500 text-white p-3 rounded-t-lg">
                    <h3 className="font-semibold">WhatsApp Preview</h3>
                  </div>
                  <div className="bg-white p-4 rounded-b-lg border border-gray-200">
                    <div className="space-y-3">
                      {/* WhatsApp Message Bubble */}
                      <div className="bg-green-100 p-3 rounded-lg max-w-xs">
                        <p className="text-sm text-gray-800">
                          {wizardData.whatsappMessage || 'Your WhatsApp message will appear here...'}
                        </p>
                      </div>
                      
                      {/* Campaign Card in WhatsApp */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden max-w-xs">
                        <img
                          src={wizardData.heroImage}
                          alt="Campaign"
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h4 className="font-semibold text-sm">{wizardData.title}</h4>
                          {wizardData.subtitle && (
                            <p className="text-xs text-gray-600 mt-1">{wizardData.subtitle}</p>
                          )}
                          <div className="mt-2">
                            <span 
                              className="inline-block px-2 py-1 text-xs text-white rounded"
                              style={{ backgroundColor: wizardData.brandColor }}
                            >
                              {getRewardText()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        if (!wizardData.channels.sms) {
          // Skip this step if SMS is not selected
          setCurrentStep(6);
          return null;
        }
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Review SMS
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left - Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMS Message (max 160 characters)
                    </label>
                    <textarea
                      rows={4}
                      maxLength={160}
                      value={wizardData.smsMessage || ''}
                      onChange={(e) => updateWizardData({ smsMessage: e.target.value })}
                      placeholder="Enter your SMS message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {(wizardData.smsMessage || '').length}/160
                    </div>
                    {errors.smsMessage && (
                      <p className="text-red-600 text-sm mt-1">{errors.smsMessage}</p>
                    )}
                  </div>
                </div>

                {/* Right - SMS Preview */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="bg-blue-500 text-white p-3 rounded-t-lg">
                    <h3 className="font-semibold">SMS Preview</h3>
                  </div>
                  <div className="bg-white p-4 rounded-b-lg border border-gray-200">
                    <div className="space-y-3">
                      {/* Phone Frame */}
                      <div className="bg-gray-800 p-4 rounded-lg max-w-xs mx-auto">
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-2">Messages</div>
                          <div className="bg-blue-500 text-white p-2 rounded-lg text-sm">
                            {wizardData.smsMessage || 'Your SMS message will appear here...'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">Now</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        if (!wizardData.channels.email) {
          // Skip this step if Email is not selected
          setCurrentStep(7);
          return null;
        }
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Review Email
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left - Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Subject (max 80 characters)
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      value={wizardData.emailSubject || ''}
                      onChange={(e) => updateWizardData({ emailSubject: e.target.value })}
                      placeholder="Enter email subject..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {(wizardData.emailSubject || '').length}/80
                    </div>
                    {errors.emailSubject && (
                      <p className="text-red-600 text-sm mt-1">{errors.emailSubject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Preheader (optional, max 120 characters)
                    </label>
                    <input
                      type="text"
                      maxLength={120}
                      value={wizardData.emailPreheader || ''}
                      onChange={(e) => updateWizardData({ emailPreheader: e.target.value })}
                      placeholder="Enter email preheader..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {(wizardData.emailPreheader || '').length}/120
                    </div>
                    {errors.emailPreheader && (
                      <p className="text-red-600 text-sm mt-1">{errors.emailPreheader}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Body (optional, max 1000 characters)
                    </label>
                    <textarea
                      rows={6}
                      maxLength={1000}
                      value={wizardData.emailBody || ''}
                      onChange={(e) => updateWizardData({ emailBody: e.target.value })}
                      placeholder="Enter email body..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {(wizardData.emailBody || '').length}/1000
                    </div>
                    {errors.emailBody && (
                      <p className="text-red-600 text-sm mt-1">{errors.emailBody}</p>
                    )}
                  </div>
                </div>

                {/* Right - Email Preview */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="bg-purple-500 text-white p-3 rounded-t-lg">
                    <h3 className="font-semibold">Email Preview</h3>
                  </div>
                  <div className="bg-white p-4 rounded-b-lg border border-gray-200">
                    <div className="space-y-4">
                      {/* Email Header */}
                      <div className="border-b border-gray-200 pb-3">
                        <div className="text-sm text-gray-600">From: Your Restaurant</div>
                        <div className="text-sm text-gray-600">To: customer@email.com</div>
                        <div className="font-semibold text-gray-900">
                          {wizardData.emailSubject || 'Email subject will appear here...'}
                        </div>
                        {wizardData.emailPreheader && (
                          <div className="text-sm text-gray-500">{wizardData.emailPreheader}</div>
                        )}
                      </div>

                      {/* Email Body */}
                      <div className="space-y-3">
                        {wizardData.emailBody && (
                          <p className="text-sm text-gray-700">{wizardData.emailBody}</p>
                        )}
                        
                        {/* Campaign Card in Email */}
                        <div 
                          className="border rounded-lg overflow-hidden"
                          style={{ borderColor: wizardData.brandColor }}
                        >
                          <img
                            src={wizardData.heroImage}
                            alt="Campaign"
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-semibold text-lg">{wizardData.title}</h4>
                            {wizardData.subtitle && (
                              <p className="text-gray-600 mt-1">{wizardData.subtitle}</p>
                            )}
                            <div className="mt-3">
                              <span 
                                className="inline-block px-3 py-1 text-white rounded font-semibold"
                                style={{ backgroundColor: wizardData.brandColor }}
                              >
                                {getRewardText()}
                              </span>
                            </div>
                            <div className="mt-3">
                              <button 
                                className="px-4 py-2 text-white rounded font-medium"
                                style={{ backgroundColor: wizardData.brandColor }}
                              >
                                Claim Offer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <CampaignWizardStep7
            wizardData={wizardData}
            onUpdateData={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            errors={errors}
          />
        );

      case 8:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                When should we send it?
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sendTime"
                      value="now"
                      checked={wizardData.sendTime === 'now'}
                      onChange={(e) => updateWizardData({ sendTime: e.target.value as any })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-900">Send now</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sendTime"
                      value="later"
                      checked={wizardData.sendTime === 'later'}
                      onChange={(e) => updateWizardData({ sendTime: e.target.value as any })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-900">Schedule later</span>
                  </label>
                </div>

                {wizardData.sendTime === 'later' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      min={new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 16)}
                      max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                      value={wizardData.scheduledDate ? wizardData.scheduledDate.toISOString().slice(0, 16) : ''}
                      onChange={(e) => updateWizardData({ scheduledDate: new Date(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.scheduledDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.scheduledDate}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Review & estimated cost
              </h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Channel</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Recipients</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Credits</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Balance After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {wizardData.channels.whatsapp && (
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">WhatsApp</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{getTotalCustomers()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{getTotalCustomers()}</td>
                          <td className="px-4 py-3 text-sm text-green-600">50 remaining</td>
                        </tr>
                      )}
                      {wizardData.channels.sms && (
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">SMS</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{getTotalCustomers()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{getTotalCustomers()}</td>
                          <td className="px-4 py-3 text-sm text-green-600">150 remaining</td>
                        </tr>
                      )}
                      {wizardData.channels.email && (
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Email</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{getTotalCustomers()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{getTotalCustomers()}</td>
                          <td className="px-4 py-3 text-sm text-green-600">200 remaining</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Launch campaign
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Campaign Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Channels:</span>
                      <span className="text-gray-900">
                        {[
                          wizardData.channels.whatsapp && 'WhatsApp',
                          wizardData.channels.sms && 'SMS',
                          wizardData.channels.email && 'Email'
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Audience:</span>
                      <span className="text-gray-900">{getTotalCustomers()} customers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="text-gray-900">{wizardData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Send Time:</span>
                      <span className="text-gray-900">
                        {wizardData.sendTime === 'now' ? 'Immediately' : 
                         wizardData.scheduledDate?.toLocaleString() || 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onComplete}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Launch Campaign
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Step {currentStep} / 10
              </h2>
              <p className="text-gray-600 mb-8">
                This step is not yet implemented in the demo.
              </p>
              <div className="space-x-4">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Templates</span>
            </button>
            <div className="text-sm text-gray-600">
              Step {currentStep} / 10
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {renderStep()}

      {/* Navigation Footer - Only show for steps that don't have their own navigation */}
      {currentStep !== 7 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>{currentStep === 10 ? 'Launch Campaign' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignWizard;