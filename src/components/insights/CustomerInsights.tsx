import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, TrendingUp, Clock, DollarSign, UserPlus, UserMinus, BarChart3, PieChart, Filter, Search, Download, MoreHorizontal, Plus, Edit, Copy, Trash2, Send, ExternalLink, Eye, Tag, MapPin, Phone, Mail, Star, Gift, MessageSquare, CreditCard, Activity, AlertCircle, HelpCircle, Info, X } from 'lucide-react';

interface CustomerInsightsProps {
  onBack: () => void;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastVisit: Date;
  totalVisits: number;
  lifetimeSpend: number;
  averageSpend: number;
  loyaltyPoints: number;
  tags: string[];
  gender?: string;
  birthday?: Date;
  location?: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
  segment: string;
  ptsBalance: number;
  redemption: number;
}

interface Segment {
  id: string;
  name: string;
  count: number;
  lastUpdated: Date;
  rules: any[];
}

interface ActivityEvent {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  type: 'visit' | 'campaign' | 'redemption' | 'feedback' | 'points';
  icon: string;
  description: string;
  timestamp: Date;
  amount?: number;
  points?: number;
}

interface CustomerSegment {
  id: string;
  name: string;
  count: number;
  percentage: number;
  visits: number;
  avgVisitPerCustomer: number;
  aov: number;
  totalSales: number;
  color: string;
}

const CustomerInsights: React.FC<CustomerInsightsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'segmentation' | 'customers' | 'activity'>('customers');
  const [dateRange, setDateRange] = useState('Lifetime');
  const [showSegmentBuilder, setShowSegmentBuilder] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerProfile, setShowCustomerProfile] = useState<string | null>(null);
  const [visitRangeFilter, setVisitRangeFilter] = useState('All');
  const [spendRangeFilter, setSpendRangeFilter] = useState('All');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [activityFilters, setActivityFilters] = useState({
    visits: true,
    campaigns: true,
    redemptions: true,
    feedback: true,
    points: true
  });

  // Mock data - Updated to match screenshot
  const totalCustomers = 188;
  const newCustomers = 0;
  const repeatCustomers = 0;
  const lostCustomers = 0;
  const avgVisitsPerCustomer = 2.3;
  const avgSpendPerCustomer = 450;
  const hasEnoughData = totalCustomers >= 100;

  // Customer segments data matching the screenshot
  const customerSegments: CustomerSegment[] = [
    { id: 'vip', name: 'VIP', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-blue-100' },
    { id: 'loyal', name: 'Loyal', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-green-100' },
    { id: 'promising', name: 'Promising', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-orange-100' },
    { id: 'new', name: 'New', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-green-200' },
    { id: 'needs-attention', name: 'Needs Attention', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-purple-100' },
    { id: 'at-risk', name: 'At Risk', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-yellow-100' },
    { id: 'lost', name: 'Lost', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-red-100' },
    { id: 'cant-loose', name: 'Can\'t Loose', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-blue-200' },
    { id: 'about-to-sleep', name: 'About to sleep', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-purple-200' },
    { id: 'potential-loyalist', name: 'Potential Loyalist', count: 0, percentage: 0, visits: 0, avgVisitPerCustomer: 0.00, aov: 0.00, totalSales: 0, color: 'bg-green-300' }
  ];

  const segments: Segment[] = [
    { id: '1', name: 'VIP Customers', count: 45, lastUpdated: new Date(), rules: [] },
    { id: '2', name: 'At Risk', count: 234, lastUpdated: new Date(), rules: [] },
    { id: '3', name: 'New This Month', count: 67, lastUpdated: new Date(), rules: [] },
    { id: '4', name: 'High Spenders', count: 123, lastUpdated: new Date(), rules: [] }
  ];

  // Mock customers data matching the screenshot format
  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Miraya Sana',
      phone: '+91 98765 43210',
      email: 'miraya@email.com',
      lastVisit: new Date('2024-01-15'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 800,
      loyaltyPoints: 0,
      tags: ['dessert', '+1'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 800,
      redemption: 0
    },
    {
      id: '2',
      name: 'Anahi Devi',
      phone: '+91 87654 32109',
      email: 'anahi@email.com',
      lastVisit: new Date('2024-01-10'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 1000,
      loyaltyPoints: 0,
      tags: ['burgers'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 1000,
      redemption: 0
    },
    {
      id: '3',
      name: 'Lakshit Dalal',
      phone: '+91 76543 21098',
      email: 'lakshit@email.com',
      lastVisit: new Date('2024-01-08'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 200,
      loyaltyPoints: 0,
      tags: ['wine'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 200,
      redemption: 0
    },
    {
      id: '4',
      name: 'Saira Mani',
      phone: '+91 65432 10987',
      email: 'saira@email.com',
      lastVisit: new Date('2024-01-05'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 600,
      loyaltyPoints: 0,
      tags: ['student'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 600,
      redemption: 0
    },
    {
      id: '5',
      name: 'Kisan Gill',
      phone: '+91 54321 09876',
      email: 'kisan@email.com',
      lastVisit: new Date('2024-01-03'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 500,
      loyaltyPoints: 0,
      tags: ['weekend-brunch', '+1'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 500,
      redemption: 0
    },
    {
      id: '6',
      name: 'Yakshit Chandra',
      phone: '+91 43210 98765',
      email: 'yakshit@email.com',
      lastVisit: new Date('2024-01-01'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 100,
      loyaltyPoints: 0,
      tags: ['glutenfree', '+1'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 100,
      redemption: 0
    },
    {
      id: '7',
      name: 'Saanvi Goswami',
      phone: '+91 32109 87654',
      email: 'saanvi@email.com',
      lastVisit: new Date('2023-12-30'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 200,
      loyaltyPoints: 0,
      tags: ['weekend-brunch', '+2'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 200,
      redemption: 0
    },
    {
      id: '8',
      name: 'Vidur Bala',
      phone: '+91 21098 76543',
      email: 'vidur@email.com',
      lastVisit: new Date('2023-12-28'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 300,
      loyaltyPoints: 0,
      tags: ['family'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 300,
      redemption: 0
    },
    {
      id: '9',
      name: 'Ishita Ram',
      phone: '+91 10987 65432',
      email: 'ishita@email.com',
      lastVisit: new Date('2023-12-25'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 2000,
      loyaltyPoints: 0,
      tags: ['bezenthusiast', '+1'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 2000,
      redemption: 0
    },
    {
      id: '10',
      name: 'Ahana Chanda',
      phone: '+91 09876 54321',
      email: 'ahana@email.com',
      lastVisit: new Date('2023-12-20'),
      totalVisits: 0,
      lifetimeSpend: 0,
      averageSpend: 0,
      loyaltyPoints: 0,
      tags: ['wine', '+1'],
      tier: 'Bronze',
      segment: 'Imported',
      ptsBalance: 0,
      redemption: 0
    }
  ];

  const mockActivities: ActivityEvent[] = [
    {
      id: '1',
      customerId: '1',
      customerName: 'Priya Sharma',
      customerAvatar: 'PS',
      type: 'visit',
      icon: '🍽️',
      description: '₹650 bill paid – 2 pts earned',
      timestamp: new Date('2024-01-15T19:30:00'),
      amount: 650,
      points: 2
    },
    {
      id: '2',
      customerId: '2',
      customerName: 'Rahul Kumar',
      customerAvatar: 'RK',
      type: 'campaign',
      icon: '📱',
      description: 'Received SMS campaign "Weekend Special"',
      timestamp: new Date('2024-01-14T10:00:00')
    }
  ];

  const dateRangeOptions = [
    'Today',
    'Yesterday',
    'Last 7 days',
    'Last 30 days',
    'Last 12 months',
    'Lifetime'
  ];

  const visitRangeOptions = ['All', '1-3', '4-7', '8-15', '16-30', '30+'];
  const spendRangeOptions = ['All', '₹0-499', '₹500-999', '₹1,000-1,999', '₹2,000+'];

  const renderOverviewTab = () => {
    if (!hasEnoughData) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="w-16 h-16 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            We're surfing your data
          </h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            We need at least 100 receipts to show meaningful insights. Keep adding customers and we'll have great insights ready for you soon!
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Add Customers
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Snapshot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('customers')}
            title="Total unique customers in the selected period"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Customers</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalCustomers.toLocaleString()}</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('customers')}
            title="Customers who visited for the first time in this period"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">New Customers</h3>
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{newCustomers.toLocaleString()}</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('customers')}
            title="Customers who made at least 2 purchases in this period"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Repeat Customers</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{repeatCustomers.toLocaleString()}</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab('customers')}
            title="Customers who haven't visited in the last 90 days"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Lost Customers</h3>
              <UserMinus className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{lostCustomers.toLocaleString()}</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            title="Average number of visits per customer"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Avg Visits per Customer</h3>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgVisitsPerCustomer}</p>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            title="Average spend per customer across all visits"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Avg Spend per Customer</h3>
              <DollarSign className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{avgSpendPerCustomer}</p>
          </div>
        </div>

        {/* Billboard Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Weekend Warriors</h3>
            <p className="text-blue-100 mb-4">
              68% of your customers prefer weekends over weekdays for dining
            </p>
            <button className="text-white underline hover:no-underline">
              View weekend customers →
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Loyalty Pays Off</h3>
            <p className="text-green-100 mb-4">
              Repeat customers spend 23% more per order than first-time visitors
            </p>
            <button className="text-white underline hover:no-underline">
              View repeat customers →
            </button>
          </div>
        </div>

        {/* Customer Mix Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Mix</h3>
            <a 
              href="https://help.muncho.app/customer-insights" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <span>Learn more</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <div className="h-full flex">
                  <div className="bg-green-500 h-full" style={{ width: '13%' }}></div>
                  <div className="bg-blue-500 h-full" style={{ width: '64%' }}></div>
                  <div className="bg-red-500 h-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>New ({newCustomers})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Repeat ({repeatCustomers})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Lost ({lostCustomers})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSegmentationTab = () => {
    return (
      <div className="space-y-6">
        {/* Header with Total Customers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900">{totalCustomers} Total customers</h2>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-gray-600">
          Explore how recently, how often and how much money a customer has given your brand with RFM analysis.
          <Info className="w-4 h-4 text-gray-400 inline ml-1" />
        </p>

        {/* Customer Segments Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {customerSegments.map((segment) => (
            <div
              key={segment.id}
              className={`${segment.color} rounded-lg p-4 border border-gray-200 relative overflow-hidden`}
            >
              {/* Diagonal stripe pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 4px,
                  rgba(255,255,255,0.3) 4px,
                  rgba(255,255,255,0.3) 8px
                )`
              }}></div>
              
              <div className="relative z-10">
                <div className="text-xs font-medium text-gray-700 mb-1">{segment.name}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{segment.percentage}%</div>
                <div className="text-xs text-gray-600">{segment.count} customers</div>
              </div>
            </div>
          ))}
        </div>

        {/* Potential Customer Section */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Potential Customer</span>
            <span className="text-2xl font-bold text-gray-900">0</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveTab('customers')}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              View Customers
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Send Campaigns
            </button>
          </div>
        </div>

        {/* Compare Segments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Compare Segments</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Segment</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Customers</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Visits</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Avg visit / customer</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">AOV</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Total Sales</th>
                  <th className="w-12 px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerSegments.map((segment) => (
                  <tr key={segment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${segment.color.replace('bg-', 'bg-').replace('-100', '-400').replace('-200', '-500').replace('-300', '-600')}`}></div>
                        <span className="font-medium text-gray-900">{segment.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{segment.count}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{segment.visits}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{segment.avgVisitPerCustomer.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{segment.aov.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{segment.totalSales}</td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomerListTab = () => {
    const filteredCustomers = mockCustomers.filter(customer => {
      // Search filter
      if (searchTerm && !customer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !customer.phone.includes(searchTerm) &&
          !customer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // Visit range filter
      if (visitRangeFilter !== 'All') {
        const visits = customer.totalVisits;
        switch (visitRangeFilter) {
          case '1-3':
            if (visits < 1 || visits > 3) return false;
            break;
          case '4-7':
            if (visits < 4 || visits > 7) return false;
            break;
          case '8-15':
            if (visits < 8 || visits > 15) return false;
            break;
          case '16-30':
            if (visits < 16 || visits > 30) return false;
            break;
          case '30+':
            if (visits <= 30) return false;
            break;
        }
      }
      
      // Spend range filter
      if (spendRangeFilter !== 'All') {
        const spend = customer.lifetimeSpend;
        switch (spendRangeFilter) {
          case '₹0-499':
            if (spend < 0 || spend > 499) return false;
            break;
          case '₹500-999':
            if (spend < 500 || spend > 999) return false;
            break;
          case '₹1,000-1,999':
            if (spend < 1000 || spend > 1999) return false;
            break;
          case '₹2,000+':
            if (spend < 2000) return false;
            break;
        }
      }
      
      return true;
    });

    return (
      <div className="space-y-6">
        {/* Quick Glance Cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Glance</h3>
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">188</div>
              <div className="text-sm text-blue-600 underline cursor-pointer">Total Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                <span>Purchased</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">188</div>
              <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Imported</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Potential</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                <span>Blocked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 relative mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Customers by name, mobile and email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span>Import</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button 
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex items-center space-x-4">
            <select
              value={visitRangeFilter}
              onChange={(e) => setVisitRangeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {visitRangeOptions.map(option => (
                <option key={option} value={option}>{option === 'All' ? 'All Visit Ranges' : option + ' visits'}</option>
              ))}
            </select>
            
            <select
              value={spendRangeFilter}
              onChange={(e) => setSpendRangeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {spendRangeOptions.map(option => (
                <option key={option} value={option}>{option === 'All' ? 'All Spend Ranges' : option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing: <span className="font-medium text-blue-600">{filteredCustomers.length} total records</span>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCustomers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Add Tags
                </button>
                <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Export CSV
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Send Campaign
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === filteredCustomers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCustomers(filteredCustomers.map(c => c.id));
                        } else {
                          setSelectedCustomers([]);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Tier</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Segment</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Total Spent</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Total Visits</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Pts. Balance</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Redemption</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setShowCustomerProfile(customer.id)}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setSelectedCustomers([...selectedCustomers, customer.id]);
                          } else {
                            setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                        {customer.tier}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {customer.segment}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{customer.lifetimeSpend}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{customer.totalVisits}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{customer.ptsBalance}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{customer.redemption}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderActivityTab = () => {
    const filteredActivities = mockActivities.filter(activity => {
      return activityFilters[activity.type as keyof typeof activityFilters];
    });

    return (
      <div className="space-y-6">
        {/* Activity Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Show:</span>
              {Object.entries(activityFilters).map(([type, enabled]) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setActivityFilters(prev => ({ ...prev, [type]: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 capitalize">{type}</span>
                </label>
              ))}
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h3>
            
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">{activity.customerAvatar}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{activity.icon}</span>
                      <span className="font-medium text-gray-900">{activity.customerName}</span>
                      <span className="text-sm text-gray-500">
                        {activity.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
              <h1 className="text-2xl font-bold text-gray-900">Customer Insights</h1>
            </div>

            {/* Date Range Picker */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
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
          </div>

          {/* Tab Navigation */}
          <div className="mt-4">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'segmentation', label: 'Segmentation', icon: PieChart },
                { id: 'customers', label: 'Customer List', icon: Users },
                { id: 'activity', label: 'Activity', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'segmentation' && renderSegmentationTab()}
        {activeTab === 'customers' && renderCustomerListTab()}
        {activeTab === 'activity' && renderActivityTab()}
      </div>

      {/* Customer Profile Flyout */}
      {showCustomerProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Customer Profile</h3>
                <button
                  onClick={() => setShowCustomerProfile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-medium text-blue-600">MS</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Miraya Sana</h4>
                <p className="text-gray-600">Bronze Customer</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">+91 98765 43210</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">miraya@email.com</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Visit Summary</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-600">Total Visits</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">₹0</p>
                      <p className="text-xs text-gray-600">Lifetime Spend</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">dessert</span>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">+1</span>
                    <button className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50">
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerInsights;