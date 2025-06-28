import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, ExternalLink, MessageCircle, ChevronLeft } from 'lucide-react';
import CategoryView from './CategoryView';
import CampaignWizard from './CampaignWizard';

interface TemplateLibraryProps {
  savedState: any;
  onStateChange: (state: any) => void;
}

interface Objective {
  id: string;
  title: string;
  icon: string;
}

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
  // Pre-filled wizard data
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

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ savedState, onStateChange }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState(14);
  const [hasWhatsAppHeader] = useState(false); // Mock: tenant lacks WhatsApp header
  const [currentView, setCurrentView] = useState<'library' | 'category' | 'wizard'>('library');
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [libraryScrollPosition, setLibraryScrollPosition] = useState(0);
  
  const objectivesRef = useRef<HTMLDivElement>(null);
  const libraryRef = useRef<HTMLDivElement>(null);

  // Updated objectives array without Start from Scratch
  const objectives: Objective[] = [
    { id: 'sushi-day', title: 'International Sushi Day', icon: '🍣' },
    { id: 'matcha', title: 'Matcha Specials 💚', icon: '🍵' },
    { id: 'bogo', title: 'Buy One Get One (BOGO)', icon: '🎁' },
    { id: 'events', title: 'Celebrate Events', icon: '🎉' },
    { id: 'offers', title: 'Exciting Offers', icon: '⚡' },
    { id: 'happy-hour', title: 'Happy Hour Offers', icon: '🍻' },
    { id: 'live-events', title: 'Live Events & Entertainment', icon: '🎵' },
    { id: 'new-menu', title: 'New Menu Launch', icon: '📋' },
    { id: 'online-orders', title: 'Drive Online Orders & Takeaway', icon: '📱' },
    { id: 'new-items', title: 'Promote New Items', icon: '✨' },
    { id: 'new-location', title: 'Promote New Location', icon: '📍' },
    { id: 'romantic', title: 'Romantic Dinner', icon: '💕' },
    { id: 'weekday', title: 'Weekday Special', icon: '📅' },
    { id: 'weekend', title: 'Weekend Special', icon: '🎊' }
  ];

  const mockTemplates: Record<string, Template[]> = {
    'sushi-day': [
      {
        id: 'sushi-1',
        title: 'International Sushi Day Special Menu',
        description: 'Celebrate with our exclusive sushi selection and special pricing',
        image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
        hasOffer: true,
        offerType: 'percentage',
        hasWhatsApp: true,
        slug: 'sushi-day-special',
        objective: 'sushi-day',
        heroImage: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
        brandColor: '#e74c3c',
        headline: 'International Sushi Day Special!',
        subtitle: 'Celebrate with authentic Japanese flavors',
        defaultReward: {
          type: 'percentage',
          value: 20
        }
      },
      {
        id: 'sushi-2',
        title: 'Premium Sushi Platter Offer',
        description: 'Indulge in our premium sushi platters with special discounts',
        image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
        hasOffer: true,
        offerType: 'flat',
        hasWhatsApp: false,
        slug: 'premium-sushi-platter',
        objective: 'sushi-day',
        heroImage: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
        brandColor: '#3498db',
        headline: 'Premium Sushi Platter Deal',
        subtitle: 'Save big on our chef\'s special selection',
        defaultReward: {
          type: 'flat',
          value: 500
        }
      },
      {
        id: 'sushi-3',
        title: 'Sushi Master Class Experience',
        description: 'Learn from our master chefs while enjoying fresh sushi',
        image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
        hasOffer: false,
        offerType: 'no-discount',
        hasWhatsApp: true,
        slug: 'sushi-master-class',
        objective: 'sushi-day',
        heroImage: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
        brandColor: '#2ecc71',
        headline: 'Sushi Master Class Experience',
        subtitle: 'Learn the art of sushi making',
        defaultReward: {
          type: 'no-discount'
        }
      },
      {
        id: 'sushi-4',
        title: 'Free Miso Soup with Sushi',
        description: 'Complimentary miso soup with any sushi order today',
        image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
        hasOffer: true,
        offerType: 'free-item',
        hasWhatsApp: true,
        slug: 'free-miso-soup',
        objective: 'sushi-day',
        heroImage: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
        brandColor: '#f39c12',
        headline: 'Free Miso Soup Today!',
        subtitle: 'Complimentary with any sushi order',
        defaultReward: {
          type: 'free-item',
          item: 'Miso Soup'
        }
      }
    ],
    'matcha': [
      {
        id: 'matcha-1',
        title: 'Matcha Latte Weekend Special',
        description: 'Premium matcha lattes with authentic Japanese flavors',
        image: 'https://images.pexels.com/photos/4226876/pexels-photo-4226876.jpeg?auto=compress&cs=tinysrgb&w=400',
        hasOffer: true,
        offerType: 'percentage',
        hasWhatsApp: true,
        slug: 'matcha-latte-special',
        objective: 'matcha',
        heroImage: 'https://images.pexels.com/photos/4226876/pexels-photo-4226876.jpeg?auto=compress&cs=tinysrgb&w=400',
        brandColor: '#27ae60',
        headline: 'Matcha Latte Weekend Special 💚',
        subtitle: 'Authentic Japanese matcha experience',
        defaultReward: {
          type: 'percentage',
          value: 15
        }
      },
      {
        id: 'matcha-2',
        title: 'Matcha Dessert Collection',
        description: 'Explore our exclusive matcha-flavored dessert menu',
        image: 'https://images.pexels.com/photos/4226876/pexels-photo-4226876.jpeg?auto=compress&cs=tinysrgb&w=400',
        hasOffer: true,
        offerType: 'flat',
        hasWhatsApp: false,
        slug: 'matcha-desserts',
        objective: 'matcha',
        heroImage: 'https://images.pexels.com/photos/4226876/pexels-photo-4226876.jpeg?auto=compress&cs=tinysrgb&w=400',
        brandColor: '#16a085',
        headline: 'Matcha Dessert Collection',
        subtitle: 'Sweet treats with a green tea twist',
        defaultReward: {
          type: 'flat',
          value: 200
        }
      }
    ],
    'bogo': [
      {
        id: 'bogo-1',
        title: 'Buy One Get One Free Desserts',
        description: 'Double the sweetness with our BOGO dessert offer',
        image: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400',
        hasOffer: true,
        offerType: 'free-item',
        hasWhatsApp: true,
        slug: 'bogo-desserts',
        objective: 'bogo',
        heroImage: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400',
        brandColor: '#e67e22',
        headline: 'Buy One Get One Free!',
        subtitle: 'Double the sweetness on all desserts',
        defaultReward: {
          type: 'free-item',
          item: 'Second Dessert'
        }
      },
      {
        id: 'bogo-2',
        title: 'BOGO Coffee Special',
        description: 'Share the perfect cup with our buy one get one coffee deal',
        image: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400',
        hasOffer: true,
        offerType: 'free-item',
        hasWhatsApp: false,
        slug: 'bogo-coffee',
        objective: 'bogo',
        heroImage: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400',
        brandColor: '#8e44ad',
        headline: 'BOGO Coffee Special',
        subtitle: 'Perfect for sharing with friends',
        defaultReward: {
          type: 'free-item',
          item: 'Second Coffee'
        }
      }
    ]
  };

  // Save scroll position when leaving library view
  const saveLibraryScrollPosition = () => {
    if (libraryRef.current) {
      setLibraryScrollPosition(libraryRef.current.scrollTop);
    }
  };

  // Restore scroll position when returning to library view
  const restoreLibraryScrollPosition = () => {
    setTimeout(() => {
      if (libraryRef.current) {
        libraryRef.current.scrollTop = libraryScrollPosition;
      }
    }, 0);
  };

  const scrollObjectives = (direction: 'left' | 'right') => {
    if (objectivesRef.current) {
      const scrollAmount = 300;
      objectivesRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleObjectiveClick = (objective: Objective) => {
    // Log analytics
    console.log(`objective_opened:${objective.id}`);

    // Check if objective has templates
    const templates = mockTemplates[objective.id] || [];
    if (templates.length === 0) {
      // Show toast and return to library
      console.log(`No templates yet for ${objective.title}`);
      // In real app, show toast here
      return;
    }

    // Save current scroll position and navigate to category view
    saveLibraryScrollPosition();
    setSelectedObjective(objective);
    setCurrentView('category');
    
    // Update URL/breadcrumb (in real app, use router)
    window.history.pushState(
      { view: 'category', objective: objective.id },
      objective.title,
      `/campaigns/objectives/${objective.id}/${objective.title.replace(/\s+/g, '_')}`
    );
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedObjective(null);
    setSelectedTemplate(null);
    restoreLibraryScrollPosition();
    
    // Update URL back to library
    window.history.pushState(
      { view: 'library' },
      'Template Library',
      '/campaigns'
    );
  };

  const handleBackToCategory = () => {
    setCurrentView('category');
    setSelectedTemplate(null);
  };

  const handleTemplateClick = (template: Template) => {
    if (template.hasWhatsApp && !hasWhatsAppHeader) {
      return; // Blocked - show tooltip
    }

    // Log analytics
    console.log(`template_opened:${template.slug}`);
    
    // Set selected template and open wizard
    setSelectedTemplate(template);
    setCurrentView('wizard');
    
    // Update URL
    window.history.pushState(
      { view: 'wizard', template: template.id },
      `Campaign Wizard - ${template.title}`,
      `/campaigns/wizard/${template.slug}`
    );
  };

  const handleWizardComplete = () => {
    // Redirect to Campaign Performance
    console.log('Campaign scheduled! Redirecting to performance...');
    // In real app, this would navigate to the performance tab
  };

  const getOfferIcon = (offerType?: string) => {
    switch (offerType) {
      case 'no-discount':
        return '🏷️';
      case 'free-item':
        return '🎁';
      case 'flat':
        return '₹';
      case 'percentage':
        return '%';
      default:
        return '🏷️';
    }
  };

  const renderTemplateCard = (template: Template) => {
    const isBlocked = template.hasWhatsApp && !hasWhatsAppHeader;
    
    return (
      <div
        key={template.id}
        onClick={() => !isBlocked && handleTemplateClick(template)}
        className={`flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all ${
          isBlocked 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-md cursor-pointer'
        }`}
        title={isBlocked ? 'Upload a WhatsApp header in Settings to unlock carousel templates' : template.description}
      >
        <div className="aspect-[4/3] bg-gray-100">
          <img
            src={template.image}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-3">
            {template.title}
          </h4>
          <div className="flex items-center justify-end space-x-2">
            {template.hasOffer && (
              <span className={`text-xs px-2 py-1 rounded ${
                isBlocked ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'
              }`}>
                {getOfferIcon(template.offerType)}
              </span>
            )}
            {template.hasWhatsApp && (
              <MessageCircle className={`w-4 h-4 ${
                isBlocked ? 'text-gray-400' : 'text-green-600'
              }`} />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCategorySection = (objective: Objective) => {
    const templates = mockTemplates[objective.id] || [];
    
    return (
      <div key={objective.id} id={`category-${objective.id}`} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
          <button 
            onClick={() => handleObjectiveClick(objective)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all
          </button>
        </div>
        
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {templates.length > 0 ? (
              templates.slice(0, 4).map(renderTemplateCard)
            ) : (
              // Placeholder templates
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Coming Soon</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {objective.title} Template {index + 1}
                    </h4>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view === 'library' || !event.state) {
        handleBackToLibrary();
      } else if (event.state?.view === 'category') {
        handleBackToCategory();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Show Campaign Wizard
  if (currentView === 'wizard' && selectedTemplate) {
    return (
      <CampaignWizard
        template={selectedTemplate}
        hasWhatsAppHeader={hasWhatsAppHeader}
        onBack={handleBackToCategory}
        onComplete={handleWizardComplete}
      />
    );
  }

  // Show Category View
  if (currentView === 'category' && selectedObjective) {
    const templates = mockTemplates[selectedObjective.id] || [];
    return (
      <CategoryView
        objective={selectedObjective}
        templates={templates}
        hasWhatsAppHeader={hasWhatsAppHeader}
        onBack={handleBackToLibrary}
        onTemplateClick={handleTemplateClick}
      />
    );
  }

  // Show Template Library
  return (
    <div ref={libraryRef} className="p-6 space-y-6">
      {/* What's New Banner */}
      {showBanner && (
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-4 right-4 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="pr-10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-medium">
                What's New
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2">
              Engage with WhatsApp Carousel! 🏞️
            </h2>
            <p className="text-white text-opacity-90 mb-3">
              Make it unmissable—share multiple images & videos in one swipeable message!
            </p>
            <p className="text-sm text-white text-opacity-75 italic">
              P.S. You'll need your brand's custom WhatsApp header to use this magic.{' '}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Learn more
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Objectives Row */}
      <div className="relative">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => scrollObjectives('left')}
            className="flex-shrink-0 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          
          <div
            ref={objectivesRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {objectives.map((objective) => (
              <button
                key={objective.id}
                onClick={() => handleObjectiveClick(objective)}
                className="flex-shrink-0 w-32 h-24 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <span className="text-2xl mb-2">{objective.icon}</span>
                <span className="text-xs font-medium text-gray-700 text-center px-2 leading-tight">
                  {objective.title}
                </span>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => scrollObjectives('right')}
            className="flex-shrink-0 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-8">
        {objectives.slice(0, visibleCategories).map(renderCategorySection)}
      </div>

      {/* View More Button */}
      {visibleCategories < objectives.length && (
        <div className="text-center">
          <button
            onClick={() => setVisibleCategories(prev => Math.min(prev + 4, objectives.length))}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View More
          </button>
        </div>
      )}

      {/* Feedback Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 mb-2">
          We want to make Muncho CRM better. What other campaigns would you like to see?
        </h3>
        <button className="text-yellow-700 hover:text-yellow-800 font-medium underline">
          Give feedback
        </button>
      </div>
    </div>
  );
};

export default TemplateLibrary;