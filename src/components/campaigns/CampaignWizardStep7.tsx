import React, { useState, useCallback, useEffect } from 'react';
import { Users, Search, X, Edit, AlertCircle, Info, Plus, Trash2 } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description: string;
  count: number;
}

interface AdvancedFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
  value2?: string; // For "is in the last" with unit
  unit?: string; // For date/time units
}

interface LiveCounts {
  whatsapp: number;
  sms: number;
  email: number;
}

interface CampaignWizardStep7Props {
  wizardData: any;
  onUpdateData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

const CampaignWizardStep7: React.FC<CampaignWizardStep7Props> = ({
  wizardData,
  onUpdateData,
  onNext,
  onBack,
  errors
}) => {
  const [audienceType, setAudienceType] = useState<'all' | 'groups' | 'advanced'>(
    wizardData.audienceType || 'groups'
  );
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    wizardData.selectedGroups || ['all-customers']
  );
  const [showGroupsDrawer, setShowGroupsDrawer] = useState(false);
  const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilter[]>(
    wizardData.advancedFilters || []
  );
  const [skipInvalidNumbers, setSkipInvalidNumbers] = useState(
    wizardData.skipInvalidNumbers !== undefined ? wizardData.skipInvalidNumbers : true
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [liveCounts, setLiveCounts] = useState<LiveCounts>({ whatsapp: 0, sms: 0, email: 0 });
  const [isCounterLoading, setIsCounterLoading] = useState(false);

  // Mock data for groups
  const availableGroups: Group[] = [
    { id: 'all-customers', name: 'All Customers', description: 'All customers in your database', count: 1234 },
    { id: 'new-customers', name: 'New Customers', description: 'Recently visited for the first time', count: 156 },
    { id: 'loyal-customers', name: 'Loyal Customers', description: 'Frequent visitors who spend the most', count: 89 },
    { id: 'vip-customers', name: 'VIP Customers', description: 'Frequent recent visitors with high spend', count: 45 },
    { id: 'at-risk', name: 'At Risk Customers', description: 'Average spenders who haven\'t visited recently', count: 234 },
    { id: 'promising', name: 'Promising Customers', description: 'Recent visitors with low spend', count: 123 },
    { id: 'need-attention', name: 'Need Attention', description: 'Occasional visitors with average spend', count: 67 }
  ];

  const filterFields = [
    'Total Visits',
    'Last Visit Date', 
    'Average Spend',
    'Loyalty Points',
    'Birthday Month',
    'Customer Tags',
    'Location',
    'Gender'
  ];

  const getOperators = (field: string) => {
    switch (field) {
      case 'Total Visits':
      case 'Average Spend':
      case 'Loyalty Points':
        return ['is greater than', 'is less than', 'equals'];
      case 'Last Visit Date':
        return ['is in the last', 'is before', 'is after'];
      case 'Birthday Month':
        return ['is', 'is not', 'is in the last'];
      case 'Customer Tags':
        return ['contains', 'does not contain'];
      case 'Location':
        return ['contains', 'does not contain', 'equals'];
      case 'Gender':
        return ['is'];
      default:
        return ['equals'];
    }
  };

  const getMonths = () => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getGenderOptions = () => ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const getUnits = () => ['days', 'weeks', 'months'];

  // Debounced counter update
  useEffect(() => {
    if (audienceType === 'advanced' && advancedFilters.length > 0) {
      setIsCounterLoading(true);
      const timer = setTimeout(() => {
        // Mock calculation based on filters
        const baseCount = 567;
        const whatsappCount = skipInvalidNumbers ? Math.floor(baseCount * 0.8) : baseCount;
        const smsCount = skipInvalidNumbers ? Math.floor(baseCount * 0.9) : baseCount;
        const emailCount = baseCount;

        setLiveCounts({
          whatsapp: whatsappCount,
          sms: smsCount,
          email: emailCount
        });
        setIsCounterLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [advancedFilters, skipInvalidNumbers, audienceType]);

  const getTotalCustomers = useCallback(() => {
    if (audienceType === 'all') {
      return 1234;
    } else if (audienceType === 'groups') {
      return selectedGroups.reduce((total, groupId) => {
        const group = availableGroups.find(g => g.id === groupId);
        return total + (group?.count || 0);
      }, 0);
    } else {
      return liveCounts.email; // Use email count as total since it's usually highest
    }
  }, [audienceType, selectedGroups, liveCounts]);

  const handleAudienceTypeChange = (type: 'all' | 'groups' | 'advanced') => {
    setAudienceType(type);
    onUpdateData({ 
      audienceType: type,
      selectedGroups: type === 'groups' ? selectedGroups : [],
      advancedFilters: type === 'advanced' ? advancedFilters : []
    });
  };

  const handleGroupToggle = (groupId: string) => {
    let newSelectedGroups;
    if (selectedGroups.includes(groupId)) {
      newSelectedGroups = selectedGroups.filter(id => id !== groupId);
    } else {
      newSelectedGroups = [...selectedGroups, groupId];
    }
    
    if (newSelectedGroups.length === 0) {
      setAudienceType('all');
      newSelectedGroups = [];
    }
    
    setSelectedGroups(newSelectedGroups);
    onUpdateData({ selectedGroups: newSelectedGroups, audienceType: newSelectedGroups.length > 0 ? 'groups' : 'all' });
  };

  const addAdvancedFilter = () => {
    const newFilter: AdvancedFilter = {
      id: Date.now().toString(),
      field: filterFields[0],
      operator: getOperators(filterFields[0])[0],
      value: ''
    };
    const newFilters = [...advancedFilters, newFilter];
    setAdvancedFilters(newFilters);
    onUpdateData({ advancedFilters: newFilters });
  };

  const removeAdvancedFilter = (id: string) => {
    const newFilters = advancedFilters.filter(f => f.id !== id);
    setAdvancedFilters(newFilters);
    onUpdateData({ advancedFilters: newFilters });
  };

  const updateAdvancedFilter = (id: string, updates: Partial<AdvancedFilter>) => {
    const newFilters = advancedFilters.map(filter => {
      if (filter.id === id) {
        const updatedFilter = { ...filter, ...updates };
        
        // Reset operator and value when field changes
        if (updates.field && updates.field !== filter.field) {
          updatedFilter.operator = getOperators(updates.field)[0];
          updatedFilter.value = '';
          updatedFilter.value2 = '';
          updatedFilter.unit = '';
        }
        
        return updatedFilter;
      }
      return filter;
    });
    
    setAdvancedFilters(newFilters);
    onUpdateData({ advancedFilters: newFilters });
  };

  const isAdvancedFiltersValid = () => {
    if (advancedFilters.length === 0) return false;
    return advancedFilters.every(filter => {
      if (!filter.value) return false;
      if (filter.operator === 'is in the last' && (!filter.value2 || !filter.unit)) return false;
      return true;
    });
  };

  const getFilterNarrative = () => {
    return advancedFilters.map(filter => {
      let narrative = `${filter.field} ${filter.operator}`;
      
      if (filter.operator === 'is in the last') {
        narrative += ` ${filter.value2} ${filter.unit}`;
      } else if (['Average Spend', 'Loyalty Points'].includes(filter.field) && filter.value) {
        narrative += ` ₹${filter.value}`;
      } else {
        narrative += ` ${filter.value}`;
      }
      
      return narrative;
    }).join(' AND ');
  };

  const renderValueInput = (filter: AdvancedFilter) => {
    const { field, operator } = filter;

    // Date picker for Last Visit Date with before/after
    if (field === 'Last Visit Date' && (operator === 'is before' || operator === 'is after')) {
      return (
        <input
          type="date"
          value={filter.value}
          max={operator === 'is before' ? undefined : new Date().toISOString().split('T')[0]}
          min={operator === 'is after' ? new Date().toISOString().split('T')[0] : undefined}
          onChange={(e) => updateAdvancedFilter(filter.id, { value: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    }

    // Number + Unit for "is in the last"
    if (operator === 'is in the last') {
      const units = field === 'Birthday Month' ? ['months'] : getUnits();
      return (
        <div className="flex-1 flex space-x-2">
          <input
            type="number"
            min="1"
            value={filter.value2 || ''}
            onChange={(e) => updateAdvancedFilter(filter.id, { value2: e.target.value })}
            placeholder="Number"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={filter.unit || units[0]}
            onChange={(e) => updateAdvancedFilter(filter.id, { unit: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      );
    }

    // Month dropdown for Birthday Month
    if (field === 'Birthday Month' && (operator === 'is' || operator === 'is not')) {
      return (
        <select
          value={filter.value}
          onChange={(e) => updateAdvancedFilter(filter.id, { value: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select month</option>
          {getMonths().map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      );
    }

    // Gender dropdown
    if (field === 'Gender') {
      return (
        <select
          value={filter.value}
          onChange={(e) => updateAdvancedFilter(filter.id, { value: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select gender</option>
          {getGenderOptions().map(gender => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>
      );
    }

    // Tags input (simplified - in real app would have autocomplete)
    if (field === 'Customer Tags') {
      return (
        <input
          type="text"
          value={filter.value}
          onChange={(e) => updateAdvancedFilter(filter.id, { value: e.target.value })}
          placeholder="Enter tags (comma-separated)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    }

    // Location input (simplified - in real app would have Google Places)
    if (field === 'Location') {
      return (
        <input
          type="text"
          value={filter.value}
          onChange={(e) => updateAdvancedFilter(filter.id, { value: e.target.value })}
          placeholder="Enter location"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    }

    // Number input for numeric fields
    if (['Total Visits', 'Average Spend', 'Loyalty Points'].includes(field)) {
      const prefix = ['Average Spend', 'Loyalty Points'].includes(field) ? '₹' : '';
      return (
        <div className="flex-1 relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {prefix}
            </span>
          )}
          <input
            type="number"
            min="0"
            step="1"
            value={filter.value}
            onChange={(e) => updateAdvancedFilter(filter.id, { value: e.target.value })}
            placeholder="Enter value"
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              prefix ? 'pl-8' : ''
            }`}
          />
        </div>
      );
    }

    // Default text input
    return (
      <input
        type="text"
        value={filter.value}
        onChange={(e) => updateAdvancedFilter(filter.id, { value: e.target.value })}
        placeholder="Enter value"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    );
  };

  const isNextDisabled = () => {
    if (audienceType === 'groups' && selectedGroups.length === 0) return true;
    if (audienceType === 'advanced' && !isAdvancedFiltersValid()) return true;
    if (getTotalCustomers() === 0) return true;
    return false;
  };

  const filteredGroups = availableGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-white p-8">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Who do you want to send this campaign?
          </h1>

          <div className="space-y-4">
            {/* All Customers */}
            <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="audience"
                checked={audienceType === 'all'}
                onChange={() => handleAudienceTypeChange('all')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">All customers</div>
                <div className="text-sm text-gray-600">Send to all 1,234 customers</div>
              </div>
            </label>

            {/* Target Groups */}
            <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="audience"
                checked={audienceType === 'groups'}
                onChange={() => handleAudienceTypeChange('groups')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Target groups</div>
                <div className="text-sm text-gray-600">
                  Send to specific customer groups ({getTotalCustomers()} customers)
                </div>
                {audienceType === 'groups' && (
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedGroups.map(groupId => {
                        const group = availableGroups.find(g => g.id === groupId);
                        if (!group) return null;
                        return (
                          <span
                            key={groupId}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {group.name}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleGroupToggle(groupId);
                              }}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setShowGroupsDrawer(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                    >
                      Manage groups
                    </button>
                  </div>
                )}
              </div>
            </label>

            {/* Advanced Filters */}
            <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="audience"
                checked={audienceType === 'advanced'}
                onChange={() => handleAudienceTypeChange('advanced')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Advanced filters</div>
                <div className="text-sm text-gray-600">
                  {audienceType === 'advanced' && advancedFilters.length > 0
                    ? `Filtered audience (${getTotalCustomers()})`
                    : 'Build custom audience rules'
                  }
                </div>
                {audienceType === 'advanced' && (
                  <div className="mt-3">
                    {advancedFilters.length > 0 ? (
                      <div className="space-y-2">
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                          title={getFilterNarrative()}
                        >
                          Filtered audience ({getTotalCustomers()})
                        </span>
                        <button
                          onClick={() => setShowAdvancedBuilder(true)}
                          className="block text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                        >
                          Edit filters
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAdvancedBuilder(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit filters</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Skip Invalid Numbers Toggle */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Skip customers with invalid phone numbers
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    SMS and Email will also reach imported customers even if their number is inactive.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipInvalidNumbers}
                  onChange={(e) => {
                    setSkipInvalidNumbers(e.target.checked);
                    onUpdateData({ skipInvalidNumbers: e.target.checked });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {errors.audience && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{errors.audience}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-1/2 bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Preview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Audience:</span>
              <span className="text-sm font-medium text-gray-900">
                {audienceType === 'all' && 'All Customers'}
                {audienceType === 'groups' && 'Target Groups'}
                {audienceType === 'advanced' && 'Advanced Filters'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Recipients:</span>
              <span className="text-sm font-medium text-gray-900">{getTotalCustomers().toLocaleString()}</span>
            </div>
            {audienceType === 'groups' && selectedGroups.length > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Selected Groups:</span>
                <span className="text-sm font-medium text-gray-900">{selectedGroups.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Groups Drawer */}
      {showGroupsDrawer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Choose from pre-packed groups</h3>
                <button
                  onClick={() => setShowGroupsDrawer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Select all groups</span>
                <input
                  type="checkbox"
                  checked={selectedGroups.length === availableGroups.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedGroups(availableGroups.map(g => g.id));
                    } else {
                      setSelectedGroups([]);
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {filteredGroups.map((group) => (
                <div key={group.id} className="flex items-start justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{group.name}</h4>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {group.count}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => handleGroupToggle(group.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-4">
                You've selected {selectedGroups.length} of {availableGroups.length} groups (≈ {getTotalCustomers()} customers)
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowGroupsDrawer(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowGroupsDrawer(false);
                    onUpdateData({ selectedGroups, audienceType: selectedGroups.length > 0 ? 'groups' : 'all' });
                  }}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Save selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Builder */}
      {showAdvancedBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Build your audience</h3>
                <div className="flex items-center space-x-4">
                  {/* Live Counter */}
                  <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Live match counter:</div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          WhatsApp: {isCounterLoading ? '...' : liveCounts.whatsapp}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          SMS: {isCounterLoading ? '...' : liveCounts.sms}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Email: {isCounterLoading ? '...' : liveCounts.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAdvancedBuilder(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {advancedFilters.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No rules added yet. Click "Add rule" to get started.</p>
                  </div>
                )}
                
                {advancedFilters.map((filter, index) => (
                  <div key={filter.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {index > 0 && (
                      <div className="text-sm font-medium text-gray-500 mr-2">AND</div>
                    )}
                    
                    <select
                      value={filter.field}
                      onChange={(e) => updateAdvancedFilter(filter.id, { field: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {filterFields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                    
                    <select
                      value={filter.operator}
                      onChange={(e) => updateAdvancedFilter(filter.id, { operator: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {getOperators(filter.field).map(operator => (
                        <option key={operator} value={operator}>{operator}</option>
                      ))}
                    </select>
                    
                    {renderValueInput(filter)}
                    
                    <button
                      onClick={() => removeAdvancedFilter(filter.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={addAdvancedFilter}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add rule</span>
                </button>
              </div>

              {!isAdvancedFiltersValid() && advancedFilters.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">Complete each rule or delete it before continuing.</span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAdvancedBuilder(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAdvancedBuilder(false);
                    setAudienceType('advanced');
                    onUpdateData({ audienceType: 'advanced', advancedFilters });
                  }}
                  disabled={!isAdvancedFiltersValid()}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>← Back</span>
          </button>

          <button
            onClick={onNext}
            disabled={isNextDisabled()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignWizardStep7;