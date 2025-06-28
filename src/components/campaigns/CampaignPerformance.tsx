import React, { useState } from 'react';
import { Calendar, Filter, Download, Eye, MoreHorizontal, Copy, Pause, Trash2, ExternalLink } from 'lucide-react';

interface CampaignPerformanceProps {
  savedState: any;
  onStateChange: (state: any) => void;
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  sent: number;
  opens: number;
  redeems: number;
  revenue: number;
  status: 'Draft' | 'Scheduled' | 'Live' | 'Paused' | 'Completed';
  hasWhatsApp: boolean;
  offerType: 'No Discount' | 'Free Item' | 'Flat Discount' | '% Discount';
}

const CampaignPerformance: React.FC<CampaignPerformanceProps> = ({ savedState, onStateChange }) => {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [filterType, setFilterType] = useState('All');
  const [whatsAppEnabled, setWhatsAppEnabled] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Mock data - in real app this would come from API
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Weekend Special Offer',
      type: 'SMS + Email',
      sent: 1250,
      opens: 456,
      redeems: 89,
      revenue: 12450,
      status: 'Completed',
      hasWhatsApp: false,
      offerType: '% Discount'
    },
    {
      id: '2',
      name: 'New Menu Launch',
      type: 'WhatsApp + SMS',
      sent: 890,
      opens: 234,
      redeems: 45,
      revenue: 8900,
      status: 'Live',
      hasWhatsApp: true,
      offerType: 'No Discount'
    },
    {
      id: '3',
      name: 'Birthday Special Draft',
      type: 'Email',
      sent: 0,
      opens: 0,
      redeems: 0,
      revenue: 0,
      status: 'Draft',
      hasWhatsApp: false,
      offerType: 'Free Item'
    }
  ]);

  const totalCampaignsSent = campaigns.filter(c => c.sent > 0).length;
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalVisits = campaigns.reduce((sum, c) => sum + c.redeems, 0);
  const avgVisitRate = totalCampaignsSent > 0 ? (totalVisits / campaigns.reduce((sum, c) => sum + c.sent, 0) * 100) : 0;

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filterType !== 'All' && campaign.offerType !== filterType) return false;
    if (whatsAppEnabled && !campaign.hasWhatsApp) return false;
    return true;
  });

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleRowClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowSideDrawer(true);
  };

  const handleBulkAction = (action: 'duplicate' | 'pause' | 'delete') => {
    console.log(`Bulk action: ${action} on campaigns:`, selectedCampaigns);
    setSelectedCampaigns([]);
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Scheduled: 'bg-blue-100 text-blue-700',
      Live: 'bg-green-100 text-green-700',
      Paused: 'bg-yellow-100 text-yellow-700',
      Completed: 'bg-purple-100 text-purple-700'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  // Zero state when no campaigns sent
  if (totalCampaignsSent === 0) {
    return (
      <div className="p-6">
        {/* Summary Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Performance</h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Campaigns Sent</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue (₹)</p>
              <p className="text-2xl font-bold text-gray-900">₹0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Visit Rate %</p>
              <p className="text-2xl font-bold text-gray-900">0%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Visits</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        {/* Zero State */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to launch? Send your first campaign now!
          </h3>
          <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
            Create Your First Campaign
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Summary Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Campaign Performance</h2>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Campaigns Sent</p>
            <p className="text-2xl font-bold text-gray-900">{totalCampaignsSent}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Revenue (₹)</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Visit Rate %</p>
            <p className="text-2xl font-bold text-gray-900">{avgVisitRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Visits</p>
            <p className="text-2xl font-bold text-gray-900">{totalVisits}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {['All', 'No Discount', 'Free Item', 'Flat Discount', '% Discount'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filterType === type
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={whatsAppEnabled}
                onChange={(e) => setWhatsAppEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>WhatsApp-Enabled</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCampaigns.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedCampaigns.length} campaign{selectedCampaigns.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('duplicate')}
                className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </button>
              <button
                onClick={() => handleBulkAction('pause')}
                className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedCampaigns.length === filteredCampaigns.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCampaigns(filteredCampaigns.map(c => c.id));
                      } else {
                        setSelectedCampaigns([]);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Sent</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Opens</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Redeems</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Revenue</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Status</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  onClick={() => handleRowClick(campaign)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCampaignSelect(campaign.id);
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{campaign.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{campaign.sent.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {campaign.opens > 0 ? campaign.opens.toLocaleString() : (
                      <span className="text-gray-400" title="Data will appear once customers engage">
                        {campaign.opens}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {campaign.redeems > 0 ? campaign.redeems.toLocaleString() : (
                      <span className="text-gray-400" title="Data will appear once customers engage">
                        {campaign.redeems}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {campaign.revenue > 0 ? `₹${campaign.revenue.toLocaleString()}` : (
                      <span className="text-gray-400" title="Data will appear once customers engage">
                        ₹0
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">{getStatusBadge(campaign.status)}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Show context menu
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Drawer */}
      {showSideDrawer && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedCampaign.name}</h3>
                <button
                  onClick={() => setShowSideDrawer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Campaign Funnel</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sent</span>
                    <span className="font-medium">{selectedCampaign.sent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Delivered</span>
                    <span className="font-medium">{Math.floor(selectedCampaign.sent * 0.95).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Opens</span>
                    <span className="font-medium">{selectedCampaign.opens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Clicks</span>
                    <span className="font-medium">{Math.floor(selectedCampaign.opens * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Visits</span>
                    <span className="font-medium">{selectedCampaign.redeems.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-medium">₹{selectedCampaign.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Channel Breakdown</h4>
                <div className="space-y-2">
                  {selectedCampaign.type.split(' + ').map((channel, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-600">{channel}</span>
                      <span className="font-medium">{Math.floor(selectedCampaign.sent / selectedCampaign.type.split(' + ').length).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Export Audience List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignPerformance;