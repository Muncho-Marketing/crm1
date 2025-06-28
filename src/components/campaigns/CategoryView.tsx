import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';

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

interface CategoryViewProps {
  objective: Objective;
  templates: Template[];
  hasWhatsAppHeader: boolean;
  onBack: () => void;
  onTemplateClick: (template: Template) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  objective,
  templates,
  hasWhatsAppHeader,
  onBack,
  onTemplateClick
}) => {
  const [discountFilter, setDiscountFilter] = useState<string>('All');
  const [whatsAppFilter, setWhatsAppFilter] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Log analytics when category is opened
  useEffect(() => {
    console.log(`category_view_opened:${objective.id}`);
  }, [objective.id]);

  // Log analytics when filters are changed
  useEffect(() => {
    if (discountFilter !== 'All') {
      console.log(`discount_filter_selected:${discountFilter}`);
    }
  }, [discountFilter]);

  useEffect(() => {
    if (whatsAppFilter) {
      console.log('whatsapp_filter_enabled');
    }
  }, [whatsAppFilter]);

  const discountOptions = ['All', 'No Discount', 'Free Item', '₹ Discount', '% Discount'];

  const getOfferIcon = (offerType?: string, isActive: boolean = true) => {
    const baseClass = "w-4 h-4";
    const colorClass = isActive ? "text-blue-600" : "text-gray-400";
    
    switch (offerType) {
      case 'no-discount':
        return <span className={`${baseClass} ${colorClass}`}>🏷️</span>;
      case 'free-item':
        return <span className={`${baseClass} ${colorClass}`}>🎁</span>;
      case 'flat':
        return <span className={`${baseClass} ${colorClass}`}>₹</span>;
      case 'percentage':
        return <span className={`${baseClass} ${colorClass}`}>%</span>;
      default:
        return <span className={`${baseClass} ${colorClass}`}>🏷️</span>;
    }
  };

  const mapDiscountFilter = (filter: string): string => {
    switch (filter) {
      case 'No Discount':
        return 'no-discount';
      case 'Free Item':
        return 'free-item';
      case '₹ Discount':
        return 'flat';
      case '% Discount':
        return 'percentage';
      default:
        return '';
    }
  };

  const filteredTemplates = templates.filter(template => {
    // Apply discount filter
    if (discountFilter !== 'All') {
      const mappedFilter = mapDiscountFilter(discountFilter);
      if (template.offerType !== mappedFilter) {
        return false;
      }
    }

    // Apply WhatsApp filter
    if (whatsAppFilter && !template.hasWhatsApp) {
      return false;
    }

    return true;
  });

  const handleTemplateClick = (template: Template) => {
    const isBlocked = template.hasWhatsApp && !hasWhatsAppHeader;
    if (isBlocked) {
      return;
    }

    onTemplateClick(template);
  };

  const renderTemplateCard = (template: Template) => {
    const isBlocked = template.hasWhatsApp && !hasWhatsAppHeader;
    const isHovered = hoveredTemplate === template.id;
    
    return (
      <div
        key={template.id}
        onClick={() => handleTemplateClick(template)}
        onMouseEnter={() => setHoveredTemplate(template.id)}
        onMouseLeave={() => setHoveredTemplate(null)}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all relative ${
          isBlocked 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-md cursor-pointer transform hover:-translate-y-1'
        }`}
        title={isBlocked ? 'Upload a WhatsApp header in Settings to unlock carousel templates' : ''}
      >
        <div className="aspect-[4/3] bg-gray-100 relative">
          <img
            src={template.image}
            alt={template.title}
            className="w-full h-full object-cover"
          />
          {isHovered && !isBlocked && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-3 m-4 text-center">
                <p className="text-sm text-gray-700">{template.description}</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-medium text-gray-900 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
            {template.title}
          </h4>
          <div className="flex items-center justify-end space-x-2">
            {template.hasOffer && (
              <div className={`p-1 rounded ${
                isBlocked ? 'bg-gray-100' : 'bg-blue-100'
              }`}>
                {getOfferIcon(template.offerType, !isBlocked)}
              </div>
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{objective.icon}</span>
          <h1 className="text-2xl font-bold text-gray-900">{objective.title}</h1>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          {discountOptions.map((option) => (
            <button
              key={option}
              onClick={() => setDiscountFilter(option)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                discountFilter === option
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={whatsAppFilter}
              onChange={(e) => setWhatsAppFilter(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span>WhatsApp enabled</span>
          </label>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.map(renderTemplateCard)}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates match this filter
          </h3>
          <p className="text-gray-600">Try another filter combination to see more templates.</p>
          <button
            onClick={() => {
              setDiscountFilter('All');
              setWhatsAppFilter(false);
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Template Count */}
      {filteredTemplates.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
      )}
    </div>
  );
};

export default CategoryView;