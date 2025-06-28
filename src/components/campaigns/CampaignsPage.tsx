import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Plus, ExternalLink, HelpCircle } from 'lucide-react';
import TemplateLibrary from './TemplateLibrary';
import CampaignPerformance from './CampaignPerformance';
import SupportModal from './SupportModal';

interface CampaignsPageProps {
  onBack: () => void;
}

interface TabState {
  scrollPosition: number;
  filters: Record<string, any>;
}

const CampaignsPage: React.FC<CampaignsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'performance'>('templates');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [tabStates, setTabStates] = useState<Record<string, TabState>>({
    templates: { scrollPosition: 0, filters: {} },
    performance: { scrollPosition: 0, filters: {} }
  });

  const contentRef = useRef<HTMLDivElement>(null);

  // Save scroll position when switching tabs
  const saveTabState = (tab: string) => {
    if (contentRef.current) {
      setTabStates(prev => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          scrollPosition: contentRef.current?.scrollTop || 0
        }
      }));
    }
  };

  // Restore scroll position when switching tabs
  const restoreTabState = (tab: string) => {
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = tabStates[tab]?.scrollPosition || 0;
      }
    }, 0);
  };

  const handleTabSwitch = (tab: 'templates' | 'performance') => {
    saveTabState(activeTab);
    setActiveTab(tab);
    restoreTabState(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => handleTabSwitch('templates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Template Library
              </button>
              <button
                onClick={() => handleTabSwitch('performance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'performance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Campaign Performance
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        {activeTab === 'templates' && (
          <TemplateLibrary 
            savedState={tabStates.templates}
            onStateChange={(state) => setTabStates(prev => ({ ...prev, templates: state }))}
          />
        )}
        {activeTab === 'performance' && (
          <CampaignPerformance 
            savedState={tabStates.performance}
            onStateChange={(state) => setTabStates(prev => ({ ...prev, performance: state }))}
          />
        )}
      </div>

      {/* Floating Help Button */}
      <button
        onClick={() => setShowSupportModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-30"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Support Modal */}
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
};

export default CampaignsPage;