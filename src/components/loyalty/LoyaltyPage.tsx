import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, TrendingUp, Gift, Award, CreditCard, Eye, MoreHorizontal, HelpCircle, ExternalLink, Info, Star, Clock, DollarSign, Activity, Zap } from 'lucide-react';

interface LoyaltyPageProps {
  onBack: () => void;
}

interface LoyaltyMember {
  id: string;
  customerId: string;
  customerName: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
  action: string;
  cashback: number;
  date: string;
  phone: string;
}

interface RedemptionSlab {
  range: string;
  count: number;
  percentage: number;
}

const LoyaltyPage: React.FC<LoyaltyPageProps> = ({ onBack }) => {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [activeTab, setActiveTab] = useState<'redemptions' | 'revenue'>('redemptions');

  // Mock data based on screenshots
  const enrolledCustomers = 150;
  const powerCustomer = {
    name: 'Divit Ganesan',
    redemptions: 0,
    spent: 0,
    days: 30
  };

  const summaryData = {
    totalRevenueGenerated: 0,
    timesRewardsRedeemed: 0,
    numberOfCustomers: 0
  };

  const loyaltyInsights = {
    totalMembers: 150,
    bronzePercentage: 100,
    silverPercentage: 0,
    goldPercentage: 0
  };

  const redemptionSlabs: RedemptionSlab[] = [
    { range: 'Below ₹100', count: 0, percentage: 0 },
    { range: '₹100 - ₹250', count: 0, percentage: 0 },
    { range: '₹251 - ₹500', count: 0, percentage: 0 },
    { range: 'Above ₹500', count: 0, percentage: 0 }
  ];

  const recentActivity: LoyaltyMember[] = [
    {
      id: '1',
      customerId: '9687869539',
      customerName: 'Jayesh Brahmbhatt',
      tier: 'Bronze',
      action: 'Bonus Import',
      cashback: 1600,
      date: 'Jun 28, 2025 2:17 PM',
      phone: '9687869539'
    },
    {
      id: '2',
      customerId: '7115530280',
      customerName: 'Zeeshan Kapur',
      tier: 'Bronze',
      action: 'Bonus Import',
      cashback: 2250,
      date: 'Jun 28, 2025 2:17 PM',
      phone: '7115530280'
    },
    {
      id: '3',
      customerId: '8684777327',
      customerName: 'Ravi Jani',
      tier: 'Bronze',
      action: 'Bonus Import',
      cashback: 1800,
      date: 'Jun 28, 2025 2:17 PM',
      phone: '8684777327'
    }
  ];

  const dateRangeOptions = [
    'Last 7 days',
    'Last 30 Days',
    'Last 90 days',
    'Last 6 months',
    'Last 12 months',
    'All time'
  ];

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'bg-orange-100 text-orange-700';
      case 'Silver':
        return 'bg-gray-100 text-gray-700';
      case 'Gold':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
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
              <h1 className="text-2xl font-bold text-gray-900">Loyalty</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Top Section - Enrollment and Power Customer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrollment Card */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-700">You enrolled</span>
                <span className="text-2xl font-bold text-blue-600">{enrolledCustomers}</span>
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <span className="text-blue-600 underline cursor-pointer">customers</span> in your loyalty
              </div>
              <div className="text-sm text-gray-700">
                program in June <span className="text-lg">🔥</span>
              </div>
            </div>
            {/* Decorative illustration placeholder */}
            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20">
              <div className="w-full h-full bg-pink-300 rounded-full"></div>
            </div>
          </div>

          {/* Power Customer Card */}
          <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">{powerCustomer.name}</span> is your
              </div>
              <div className="text-sm text-gray-700 mb-2">
                power customer with
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-2xl font-bold text-blue-600">{powerCustomer.redemptions}</span>
                <span className="text-sm text-gray-700">redemptions</span>
              </div>
              <div className="text-sm text-gray-700">
                and spent <span className="font-semibold">₹{powerCustomer.spent}</span> in last {powerCustomer.days} days <span className="text-lg">🏆</span>
              </div>
            </div>
            {/* Decorative illustration placeholder */}
            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20">
              <div className="w-full h-full bg-teal-300 rounded-full"></div>
            </div>
          </div>

          {/* Restaurant Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Inactive</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">The Slaughterhouse</h3>
            <p className="text-sm text-gray-600 mb-4">Advanced Cashback - Lifetime Spent</p>
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">WhatsApp Utility</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">E-mail</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                View creative
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors">
                Edit loyalty
              </button>
            </div>
            {/* Phone mockup illustration */}
            <div className="absolute top-4 right-4 w-16 h-24 bg-gray-900 rounded-lg opacity-80">
              <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-1">
                <div className="w-full h-full bg-white rounded-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
              <p className="text-sm text-gray-600">Here's what's happening in your rewards program till today</p>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {dateRangeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">₹{summaryData.totalRevenueGenerated}</div>
                <div className="text-sm text-gray-600 underline cursor-pointer">Total Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{summaryData.timesRewardsRedeemed}</div>
                <div className="text-sm text-gray-600 underline cursor-pointer">Times Rewards Redeemed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{summaryData.numberOfCustomers}</div>
                <div className="text-sm text-gray-600 underline cursor-pointer">Number of Customers</div>
              </div>
            </div>

            {/* Tab Buttons */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('redemptions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'redemptions'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Redemptions
              </button>
              <button
                onClick={() => setActiveTab('revenue')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'revenue'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Revenue gain
              </button>
            </div>

            {/* Empty State Illustration */}
            <div className="text-center py-12">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                {/* Chart bars illustration */}
                <div className="absolute bottom-0 left-0 w-6 h-12 bg-red-300 rounded-t"></div>
                <div className="absolute bottom-0 left-8 w-6 h-16 bg-red-300 rounded-t"></div>
                <div className="absolute bottom-0 left-16 w-6 h-20 bg-red-300 rounded-t"></div>
                <div className="absolute bottom-0 left-24 w-6 h-24 bg-red-300 rounded-t"></div>
                <div className="absolute bottom-0 left-32 w-6 h-20 bg-red-300 rounded-t"></div>
                
                {/* Person illustration */}
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div className="w-8 h-8 bg-blue-200 rounded-full mx-auto mb-2"></div>
                  <div className="w-12 h-8 bg-blue-200 rounded-lg mx-auto"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We are surfing through your data.</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                This will look more exciting once your customers redeem loyalty rewards.
              </p>
            </div>
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">0%</div>
              <div className="text-sm text-gray-600 underline cursor-pointer">Redemption Rate</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-sm text-gray-600 underline cursor-pointer">Cashback Redeemed</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">100450</div>
              <div className="text-sm text-gray-600 underline cursor-pointer">Cashback Issued</div>
              <div className="text-xs text-green-600 mt-1">From Import</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">₹0</div>
              <div className="text-sm text-gray-600">Avg. Revenue/</div>
              <div className="text-sm text-gray-600 underline cursor-pointer">Redemption</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Redeeming Customers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 underline cursor-pointer">Top Redeeming Customers</h3>
            
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                {/* Chart bars illustration */}
                <div className="absolute bottom-0 left-0 w-4 h-8 bg-red-300 rounded-t"></div>
                <div className="absolute bottom-0 left-5 w-4 h-12 bg-red-300 rounded-t"></div>
                <div className="absolute bottom-0 left-10 w-4 h-16 bg-red-300 rounded-t"></div>
                <div className="absolute bottom-0 left-15 w-4 h-12 bg-red-300 rounded-t"></div>
                
                {/* Person illustration */}
                <div className="absolute top-0 right-0 w-12 h-12">
                  <div className="w-6 h-6 bg-blue-200 rounded-full mx-auto mb-1"></div>
                  <div className="w-8 h-6 bg-blue-200 rounded-lg mx-auto"></div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">There is no data at the moment.</h4>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">
                You will be able to see the your top redeeming customers once they start redeeming rewards.
              </p>
            </div>
          </div>

          {/* Cashback Redemption Slabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 underline cursor-pointer">Cashback Redemption Slabs</h3>
            
            <div className="space-y-4">
              {redemptionSlabs.map((slab, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{slab.range}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-400 h-2 rounded-full" 
                        style={{ width: `${slab.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-6 text-right">{slab.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loyalty Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Loyalty Insights</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Loyalty Members</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">{loyaltyInsights.totalMembers}</div>
            
            {/* Tier Distribution Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div className="h-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium">
                  Bronze
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              {loyaltyInsights.totalMembers} (100%)
            </div>
          </div>
        </div>

        {/* Redemption Time */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Redemption Time</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">That day of the week when most Loyalty rewards are redeemed.</h4>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">That day of the week when least Loyalty rewards are redeemed.</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Loyalty Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent loyalty Activity</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Customer</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Tier</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Action</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Cashback</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{activity.customerName}</div>
                        <div className="text-sm text-gray-500">{activity.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTierBadgeColor(activity.tier)}`}>
                        {activity.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-900">{activity.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-yellow-600">₹{activity.cashback}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Button */}
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-30">
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default LoyaltyPage;