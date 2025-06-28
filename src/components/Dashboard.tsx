import React, { useState } from 'react';
import { 
  Store, Users, TrendingUp, Calendar, Bell, Settings, ChevronDown, 
  Mail, Download, Info, Gift, CreditCard, MessageCircle, QrCode,
  UserPlus, Star, BarChart3, PieChart, Clock, Target, Zap, 
  ArrowUpRight, ExternalLink, Plus, Eye, ChevronRight, Sparkles,
  Phone, AtSign, MessageSquare, Send, Award, Heart, RefreshCw,
  AlertCircle, HelpCircle, Play, Activity, Loader2
} from 'lucide-react';
import CampaignsPage from './campaigns/CampaignsPage';
import CustomerInsights from './insights/CustomerInsights';
import LoyaltyPage from './loyalty/LoyaltyPage';
import { useDashboardData } from '../hooks/useDashboardData';

interface DashboardProps {
  user: {
    firstName: string;
    role: string;
    onboardingComplete: boolean;
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [selectedOutlet, setSelectedOutlet] = useState('Main Branch');
  const [highlightsTimeframe, setHighlightsTimeframe] = useState('Today');
  const [salesChartView, setSalesChartView] = useState('Last 30 Days');
  const [visitsChartView, setVisitsChartView] = useState('Last 30 Days');
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');
  const [currentView, setCurrentView] = useState<'dashboard' | 'campaigns' | 'insights' | 'loyalty'>('dashboard');

  // Fetch dashboard data
  const { data: dashboardData, loading, error, refetch } = useDashboardData(highlightsTimeframe);

  const outlets = ['Main Branch', 'Mall Location', 'Airport Branch'];
  const timeframes = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days'];

  const navigationItems = [
    { name: 'Dashboard', icon: BarChart3, active: true },
    { name: 'Campaigns', icon: Send },
    { name: 'Customer Insights', icon: Activity },
    { name: 'Loyalty', icon: Award },
    { name: 'Auto-Campaigns', icon: Zap },
    { name: 'Feedback', icon: Star },
    { name: 'QR Code', icon: QrCode },
    { name: 'Referrals', icon: UserPlus },
    { name: 'Membership', icon: CreditCard, badge: 'NEW' },
    { name: 'WhatsApp Chat', icon: MessageCircle },
    { name: 'Add Customers', icon: Plus }
  ];

  const handleNavItemClick = (itemName: string) => {
    setActiveNavItem(itemName);
    
    if (itemName === 'Campaigns') {
      setCurrentView('campaigns');
    } else if (itemName === 'Customer Insights') {
      setCurrentView('insights');
    } else if (itemName === 'Loyalty') {
      setCurrentView('loyalty');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setActiveNavItem('Dashboard');
  };

  // Check user role permissions
  const canViewCampaigns = ['admin', 'owner', 'marketer'].includes(user.role.toLowerCase());
  const canViewInsights = ['admin', 'owner', 'manager'].includes(user.role.toLowerCase());
  const canViewLoyalty = ['admin', 'owner', 'manager'].includes(user.role.toLowerCase());

  if (currentView === 'campaigns' && canViewCampaigns) {
    return <CampaignsPage onBack={handleBackToDashboard} />;
  }

  if (currentView === 'insights' && canViewInsights) {
    return <CustomerInsights onBack={handleBackToDashboard} />;
  }

  if (currentView === 'loyalty' && canViewLoyalty) {
    return <LoyaltyPage onBack={handleBackToDashboard} />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Default to empty data if not loaded
  const data = dashboardData || {
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    newCustomers: 0,
    repeatCustomers: 0,
    rewardsRedeemed: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    credits: { sms: 0, email: 0, whatsappUtility: 0, whatsappMarketing: 0 },
    revenueFromCrm: 0,
    visitsFromCrm: 0,
    averageOrderValue: 0,
    averageVisitsPerYear: 0,
    loyaltyStats: { redemptions: 0, revenueGain: 0, redemptionRate: 0 },
    campaignStats: { totalSent: 0, customersVisited: 0, revenueGain: 0 },
    feedbackStats: { totalFeedbacks: 0, averageRating: 0, negativeFeedback: 0 },
    autoCampaignStats: { currentlyActive: 0, customersVisited: 0, revenueGain: 0 },
    qrCodeStats: { activeQrCodes: 0, customersCaptured: 0, revenue: 0 },
    referralStats: { potentialCustomers: 0, newCustomers: 0, revenue: 0 },
    customerFrequency: [],
    topRewards: [],
    upcomingCelebrations: [],
    profileCompletion: { percentage: 0, completedCount: 0, totalCount: 0 },
    salesData: [],
    visitsData: []
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Muncho CRM</h1>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => {
            // Hide campaigns for unauthorized roles
            if (item.name === 'Campaigns' && !canViewCampaigns) {
              return null;
            }

            // Hide insights for unauthorized roles
            if (item.name === 'Customer Insights' && !canViewInsights) {
              return null;
            }

            // Hide loyalty for unauthorized roles
            if (item.name === 'Loyalty' && !canViewLoyalty) {
              return null;
            }

            return (
              <button
                key={item.name}
                onClick={() => handleNavItemClick(item.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeNavItem === item.name
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-pink-100 text-pink-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Trial Banner */}
        <div className="p-4 mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Free Trial</span>
            </div>
            <p className="text-xs text-yellow-700 mb-3">You have 14 days left in your free trial</p>
            <button className="w-full bg-yellow-600 text-white text-xs py-2 px-3 rounded-md hover:bg-yellow-700 transition-colors">
              Upgrade Now
            </button>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-semibold mb-2">See your company's future</h3>
            <p className="text-xs opacity-90 mb-3">with the Muncho CRM Growth Plan</p>
            <button className="flex items-center space-x-1 text-xs font-medium hover:underline">
              <span>View Demo Account</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Outlet Switcher */}
                <div className="relative">
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Store className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{selectedOutlet}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Quick Links */}
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Customer life cycle
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Book a Demo
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Get email report</span>
                </button>

                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.firstName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2 mb-2">
              <span>Your business at a glance</span>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </h1>
            <p className="text-gray-600">This feed will look a lot more exciting once you start adding customers.</p>
          </div>

          {/* Highlights and Sales Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Highlights Widget */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">Highlights for</h3>
                  <select 
                    value={highlightsTimeframe}
                    onChange={(e) => setHighlightsTimeframe(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
                    {timeframes.map(tf => (
                      <option key={tf} value={tf}>{tf}</option>
                    ))}
                  </select>
                </div>
                <Info className="w-4 h-4 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="cursor-pointer hover:bg-blue-50 transition-colors rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Sales</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₹{data.totalSales.toLocaleString()}</p>
                </div>

                <div className="cursor-pointer hover:bg-blue-50 transition-colors rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Orders</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{data.totalOrders}</p>
                </div>

                <div className="cursor-pointer hover:bg-blue-50 transition-colors rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Customers</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{data.totalCustomers}</p>
                  <div className="mt-2 flex space-x-1">
                    <div className="h-1 bg-purple-500 rounded" style={{ 
                      width: data.totalCustomers > 0 ? `${(data.newCustomers / data.totalCustomers) * 100}%` : '0%' 
                    }}></div>
                    <div className="h-1 bg-yellow-500 rounded" style={{ 
                      width: data.totalCustomers > 0 ? `${(data.repeatCustomers / data.totalCustomers) * 100}%` : '0%' 
                    }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="inline-flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>{data.newCustomers} new</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 ml-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>{data.repeatCustomers} repeat</span>
                    </span>
                  </p>
                </div>

                <div className="cursor-pointer hover:bg-blue-50 transition-colors rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Rewards Redeemed</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{data.rewardsRedeemed}</p>
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">Sales in</h3>
                  <select 
                    value={salesChartView}
                    onChange={(e) => setSalesChartView(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="Last 30 Days">Last 30 Days 31 May 25 - 29 Jun 25</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="Last 90 days">Last 90 days</option>
                  </select>
                </div>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">₹{data.totalSales.toLocaleString()}</p>
                <div className="flex items-center space-x-4 text-sm mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Valid numbers</span>
                    <span className="font-medium">₹{Math.floor(data.totalSales * 0.9).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Blocked numbers</span>
                    <span className="font-medium">₹{Math.floor(data.totalSales * 0.1).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="h-32 flex items-end justify-between space-x-1">
                {data.salesData.length > 0 ? (
                  data.salesData.slice(-14).map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-teal-500 rounded-t hover:bg-teal-600 transition-colors cursor-pointer"
                        style={{ height: `${Math.max(5, (day.amount / Math.max(...data.salesData.map(d => d.amount))) * 100)}%` }}
                        title={`${day.date}: ₹${day.amount.toLocaleString()}`}
                      ></div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full bg-gradient-to-t from-teal-200 to-teal-400 rounded-t opacity-50"></div>
                )}
              </div>
            </div>
          </div>

          {/* Visits and Total Customers Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visits Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">Visits in</h3>
                  <select 
                    value={visitsChartView}
                    onChange={(e) => setVisitsChartView(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="Last 30 Days">Last 30 Days 31 May 25 - 29 Jun 25</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="Last 90 days">Last 90 days</option>
                  </select>
                </div>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">{data.totalOrders}</p>
                <div className="flex items-center space-x-4 text-sm mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Valid numbers</span>
                    <span className="font-medium">{Math.floor(data.totalOrders * 0.9)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Blocked numbers</span>
                    <span className="font-medium">{Math.floor(data.totalOrders * 0.1)}</span>
                  </div>
                </div>
              </div>
              
              <div className="h-32 flex items-end justify-between space-x-1">
                {data.visitsData.length > 0 ? (
                  data.visitsData.slice(-14).map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                        style={{ height: `${Math.max(5, (day.visits / Math.max(...data.visitsData.map(d => d.visits))) * 100)}%` }}
                        title={`${day.date}: ${day.visits} visits`}
                      ></div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full bg-gradient-to-t from-green-200 to-green-400 rounded-t opacity-50"></div>
                )}
              </div>
            </div>

            {/* Total Customers with Purchase */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Total Customers with purchase</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-4">{data.totalCustomers}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">{data.activeCustomers}</div>
                    <div className="text-sm text-teal-600">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{data.inactiveCustomers}</div>
                    <div className="text-sm text-orange-600">Inactive</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credits Balance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Credits Balance</h3>
                <Info className="w-4 h-4 text-gray-400 cursor-help" title="Credits are used for SMS, Email, and WhatsApp campaigns" />
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span>Auto Refill Credits</span>
                  <span className="px-2 py-0.5 text-xs bg-blue-500 rounded-full">NEW</span>
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  Refill Credits
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{data.credits.sms}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">SMS</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <AtSign className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{data.credits.email}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Email</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{data.credits.whatsappUtility}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">WhatsApp Utility</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{data.credits.whatsappMarketing}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">WhatsApp Marketing</div>
              </div>
            </div>
          </div>

          {/* Upcoming Celebrations */}
          {data.upcomingCelebrations.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Celebrations</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  See all
                </button>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-purple-800">
                  People spend 25% more on their birthdays and anniversaries
                </p>
              </div>

              <div className="space-y-3 mb-4">
                {data.upcomingCelebrations.map((celebration, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {celebration.type === 'Birthday' ? (
                          <Gift className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Heart className="w-4 h-4 text-pink-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{celebration.name}</p>
                        <p className="text-sm text-gray-600">{celebration.type} • {celebration.date}</p>
                        <p className="text-xs text-gray-500">{celebration.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                  Activate Offer
                </button>
              </div>
            </div>
          )}

          {/* Customer Profile Completion */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Customer Profile Completion</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-gray-900">{Math.round(data.profileCompletion.percentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 cursor-pointer hover:bg-gray-300 transition-colors">
                <div 
                  className="bg-blue-500 h-3 rounded-full" 
                  style={{ width: `${data.profileCompletion.percentage}%` }}
                ></div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {Math.round(data.profileCompletion.percentage)}% of customers have completed their profile.
            </p>
          </div>

          {/* Top Insights */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top insights for you</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">You gained estimated</h4>
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl font-bold text-gray-900">₹{data.revenueFromCrm.toLocaleString()}</span>
                      <span className="text-sm text-gray-600">revenue and</span>
                      <span className="text-2xl font-bold text-gray-900">{data.visitsFromCrm}</span>
                    </div>
                    <div className="text-sm text-gray-600">visits via Reelo. 🚀</div>
                    <button className="text-teal-600 hover:text-teal-700 text-sm font-medium underline mt-1">
                      Boost this number
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <PieChart className="w-6 h-6 text-purple-500" />
                  <h4 className="font-semibold text-gray-900">Revenue Distribution</h4>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">20%</div>
                  <div className="text-sm text-gray-600 mb-1">of your customers</div>
                  <div className="text-sm text-gray-600">contribute</div>
                  <div className="text-4xl font-bold text-gray-900 mt-2">
                    {data.totalSales > 0 ? Math.round((data.repeatCustomers / data.totalCustomers) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">of total revenue</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-blue-500" />
                  <h4 className="font-semibold text-gray-900">Your average order value is</h4>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">₹{Math.round(data.averageOrderValue)}</p>
                  <p className="text-sm text-gray-600">till today.</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-orange-500" />
                  <h4 className="font-semibold text-gray-900">On an avg, your customers visit</h4>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">{data.averageVisitsPerYear.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">times a year.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Frequency & Top Rewards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Customer Frequency</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-4">
                {data.customerFrequency.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-32">{item.label}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-12 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top rewards redeemed</h3>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              {data.topRewards.length > 0 ? (
                <div className="space-y-4">
                  {data.topRewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium text-gray-900">{reward.name}</span>
                      <span className="text-sm font-bold text-gray-900">{reward.redeemed}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-orange-600" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">There is no data at the moment</h4>
                  <p className="text-sm text-gray-600 max-w-xs mx-auto">
                    This will look a lot more exciting when your customers start redeeming rewards.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Programme Performance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">See your programme's performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-semibold text-gray-900">Loyalty</h4>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.loyaltyStats.redemptions}</div>
                    <div className="text-sm text-gray-600">No. of Redemptions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">₹{data.loyaltyStats.revenueGain.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Est. Revenue Gain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.loyaltyStats.redemptionRate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Redemption Rate</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleNavItemClick('Loyalty')}
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  View More
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Send className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold text-gray-900">Campaign</h4>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.campaignStats.totalSent}</div>
                    <div className="text-sm text-gray-600">Total Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.campaignStats.customersVisited}</div>
                    <div className="text-sm text-gray-600">Customer's Visited</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">₹{data.campaignStats.revenueGain.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Approx. Revenue Gain</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleNavItemClick('Campaigns')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View More
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-gray-900">Feedback</h4>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.feedbackStats.totalFeedbacks}</div>
                    <div className="text-sm text-gray-600">Total Feedbacks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.feedbackStats.averageRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.feedbackStats.negativeFeedback.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Negative Feedback</div>
                  </div>
                </div>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View More
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <h4 className="font-semibold text-gray-900">Auto-campaign</h4>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.autoCampaignStats.currentlyActive} / 5</div>
                    <div className="text-sm text-gray-600">Currently Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.autoCampaignStats.customersVisited}</div>
                    <div className="text-sm text-gray-600">Customers visited</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">₹{data.autoCampaignStats.revenueGain.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Approx. Revenue Gain</div>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View More
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-teal-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-teal-500" />
                    <h4 className="font-semibold text-gray-900">QR Codes</h4>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.qrCodeStats.activeQrCodes}</div>
                    <div className="text-sm text-gray-600">Active QR codes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.qrCodeStats.customersCaptured}</div>
                    <div className="text-sm text-gray-600">Customers captured</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">₹{data.qrCodeStats.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Approx. Revenue</div>
                  </div>
                </div>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium underline">
                  Create your first QR code
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-pink-500 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-pink-500" />
                    <h4 className="font-semibold text-gray-900">Referral</h4>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.referralStats.potentialCustomers}</div>
                    <div className="text-sm text-gray-600">Potential Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data.referralStats.newCustomers}</div>
                    <div className="text-sm text-gray-600">New Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">₹{data.referralStats.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Approx. Revenue</div>
                  </div>
                </div>
                <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                  View More
                </button>
              </div>
            </div>
          </div>

          {/* Help Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Need help getting started?</h4>
                  <p className="text-sm text-yellow-700">Book a free consultation call with our experts</p>
                </div>
              </div>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                Book Call
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;