import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DashboardData {
  // Highlights
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  rewardsRedeemed: number;
  
  // Sales data
  salesData: Array<{ date: string; amount: number; validAmount: number; blockedAmount: number }>;
  visitsData: Array<{ date: string; visits: number; validVisits: number; blockedVisits: number }>;
  
  // Customer data
  activeCustomers: number;
  inactiveCustomers: number;
  
  // Credits
  credits: {
    sms: number;
    email: number;
    whatsappUtility: number;
    whatsappMarketing: number;
  };
  
  // Insights
  revenueFromCrm: number;
  visitsFromCrm: number;
  averageOrderValue: number;
  averageVisitsPerYear: number;
  
  // Program performance
  loyaltyStats: {
    redemptions: number;
    revenueGain: number;
    redemptionRate: number;
  };
  
  campaignStats: {
    totalSent: number;
    customersVisited: number;
    revenueGain: number;
  };
  
  feedbackStats: {
    totalFeedbacks: number;
    averageRating: number;
    negativeFeedback: number;
  };
  
  autoCampaignStats: {
    currentlyActive: number;
    customersVisited: number;
    revenueGain: number;
  };
  
  qrCodeStats: {
    activeQrCodes: number;
    customersCaptured: number;
    revenue: number;
  };
  
  referralStats: {
    potentialCustomers: number;
    newCustomers: number;
    revenue: number;
  };
  
  // Customer frequency
  customerFrequency: Array<{
    label: string;
    count: number;
    percentage: number;
  }>;
  
  // Top rewards
  topRewards: Array<{
    name: string;
    redeemed: number;
  }>;
  
  // Upcoming celebrations
  upcomingCelebrations: Array<{
    name: string;
    type: 'Birthday' | 'Anniversary';
    date: string;
    phone: string;
  }>;
  
  // Profile completion
  profileCompletion: {
    percentage: number;
    completedCount: number;
    totalCount: number;
  };
}

export const useDashboardData = (timeframe: string = 'Today') => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = (timeframe: string) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case 'Today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Yesterday':
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Last 7 days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Last 30 days':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 1);
    }
    
    return { startDate, endDate: now };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting dashboard data fetch...');
      
      // Get current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User authentication error:', userError);
        throw new Error(`Authentication failed: ${userError.message}`);
      }
      
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated');
      }
      
      console.log('Authenticated user found:', user.id);
      
      const { startDate, endDate } = getDateRange(timeframe);
      console.log('Date range:', { startDate, endDate });
      
      // Get restaurant for the authenticated user
      console.log('Fetching restaurant for user:', user.id);
      const { data: restaurants, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id);
      
      if (restaurantError) {
        console.error('Restaurant fetch error:', restaurantError);
        throw new Error(`Failed to fetch restaurant: ${restaurantError.message}`);
      }
      
      console.log('Restaurants found:', restaurants);
      
      if (!restaurants || restaurants.length === 0) {
        console.error('No restaurant found for user');
        throw new Error('No restaurant found for your account. Please complete the onboarding process to set up your restaurant.');
      }
      
      const restaurantId = restaurants[0].id;
      console.log('Using restaurant ID:', restaurantId);
      
      // Fetch all data in parallel with error handling for each query
      console.log('Starting parallel data fetch...');
      
      const [
        ordersResult,
        customersResult,
        campaignsResult,
        rewardRedemptionsResult,
        feedbackResult,
        qrCodesResult,
        creditsResult,
        loyaltyRewardsResult
      ] = await Promise.allSettled([
        // Orders data
        supabase
          .from('orders')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .gte('order_date', startDate.toISOString())
          .lte('order_date', endDate.toISOString()),
        
        // Customers data
        supabase
          .from('customers')
          .select('*')
          .eq('restaurant_id', restaurantId),
        
        // Campaigns data
        supabase
          .from('campaigns')
          .select('*')
          .eq('restaurant_id', restaurantId),
        
        // Reward redemptions
        supabase
          .from('reward_redemptions')
          .select('*, loyalty_rewards(*)')
          .eq('restaurant_id', restaurantId),
        
        // Feedback data
        supabase
          .from('feedback')
          .select('*')
          .eq('restaurant_id', restaurantId),
        
        // QR codes data
        supabase
          .from('qr_codes')
          .select('*')
          .eq('restaurant_id', restaurantId),
        
        // Credits balance
        supabase
          .from('credits_balance')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .single(),
        
        // Loyalty rewards
        supabase
          .from('loyalty_rewards')
          .select('*')
          .eq('restaurant_id', restaurantId)
      ]);

      console.log('Parallel fetch completed');

      // Process results and handle errors gracefully
      const orders = ordersResult.status === 'fulfilled' && !ordersResult.value.error 
        ? ordersResult.value.data || [] 
        : [];
      
      const customers = customersResult.status === 'fulfilled' && !customersResult.value.error 
        ? customersResult.value.data || [] 
        : [];
      
      const campaigns = campaignsResult.status === 'fulfilled' && !campaignsResult.value.error 
        ? campaignsResult.value.data || [] 
        : [];
      
      const redemptions = rewardRedemptionsResult.status === 'fulfilled' && !rewardRedemptionsResult.value.error 
        ? rewardRedemptionsResult.value.data || [] 
        : [];
      
      const feedback = feedbackResult.status === 'fulfilled' && !feedbackResult.value.error 
        ? feedbackResult.value.data || [] 
        : [];
      
      const qrCodes = qrCodesResult.status === 'fulfilled' && !qrCodesResult.value.error 
        ? qrCodesResult.value.data || [] 
        : [];
      
      const credits = creditsResult.status === 'fulfilled' && !creditsResult.value.error 
        ? creditsResult.value.data 
        : null;
      
      const loyaltyRewards = loyaltyRewardsResult.status === 'fulfilled' && !loyaltyRewardsResult.value.error 
        ? loyaltyRewardsResult.value.data || [] 
        : [];

      // Log any errors but continue processing
      if (ordersResult.status === 'rejected') {
        console.warn('Orders fetch failed:', ordersResult.reason);
      }
      if (customersResult.status === 'rejected') {
        console.warn('Customers fetch failed:', customersResult.reason);
      }
      if (campaignsResult.status === 'rejected') {
        console.warn('Campaigns fetch failed:', campaignsResult.reason);
      }
      if (rewardRedemptionsResult.status === 'rejected') {
        console.warn('Reward redemptions fetch failed:', rewardRedemptionsResult.reason);
      }
      if (feedbackResult.status === 'rejected') {
        console.warn('Feedback fetch failed:', feedbackResult.reason);
      }
      if (qrCodesResult.status === 'rejected') {
        console.warn('QR codes fetch failed:', qrCodesResult.reason);
      }
      if (creditsResult.status === 'rejected') {
        console.warn('Credits fetch failed:', creditsResult.reason);
      }
      if (loyaltyRewardsResult.status === 'rejected') {
        console.warn('Loyalty rewards fetch failed:', loyaltyRewardsResult.reason);
      }

      console.log('Data processing started with:', {
        orders: orders.length,
        customers: customers.length,
        campaigns: campaigns.length,
        redemptions: redemptions.length,
        feedback: feedback.length,
        qrCodes: qrCodes.length,
        hasCredits: !!credits,
        loyaltyRewards: loyaltyRewards.length
      });

      // Calculate metrics
      const completedOrders = orders.filter(order => order.status === 'completed');
      const totalSales = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const totalOrders = completedOrders.length;
      
      // Customer metrics
      const totalCustomers = customers.length;
      const customersWithOrders = new Set(orders.map(order => order.customer_id)).size;
      const activeCustomers = customers.filter(customer => {
        const lastVisit = customer.last_visit ? new Date(customer.last_visit) : null;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastVisit && lastVisit > thirtyDaysAgo;
      }).length;
      
      const inactiveCustomers = totalCustomers - activeCustomers;
      
      // New vs repeat customers
      const newCustomers = customers.filter(customer => (customer.total_visits || 0) <= 1).length;
      const repeatCustomers = customers.filter(customer => (customer.total_visits || 0) > 1).length;
      
      // Rewards redeemed
      const rewardsRedeemed = redemptions.length;
      
      // Generate sales data for chart (last 30 days)
      const salesData = [];
      const visitsData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.filter(order => 
          order.order_date && order.order_date.startsWith(dateStr) && order.status === 'completed'
        );
        
        const dayAmount = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const dayVisits = dayOrders.length;
        
        salesData.push({
          date: dateStr,
          amount: dayAmount,
          validAmount: dayAmount * 0.9, // Assume 90% valid
          blockedAmount: dayAmount * 0.1
        });
        
        visitsData.push({
          date: dateStr,
          visits: dayVisits,
          validVisits: Math.floor(dayVisits * 0.9),
          blockedVisits: Math.floor(dayVisits * 0.1)
        });
      }
      
      // Campaign stats
      const totalSent = campaigns.reduce((sum, campaign) => sum + (campaign.total_sent || 0), 0);
      const campaignRevenue = campaigns.reduce((sum, campaign) => sum + (campaign.revenue_generated || 0), 0);
      const campaignVisits = campaigns.reduce((sum, campaign) => sum + (campaign.total_clicked || 0), 0);
      
      // Loyalty stats
      const loyaltyRevenue = redemptions.reduce((sum, redemption) => {
        // Estimate revenue impact (assume each redemption generates 3x the points value)
        return sum + ((redemption.points_used || 0) * 3);
      }, 0);
      
      const redemptionRate = totalCustomers > 0 ? (rewardsRedeemed / totalCustomers) * 100 : 0;
      
      // Feedback stats
      const totalFeedbacks = feedback.length;
      const averageRating = totalFeedbacks > 0 
        ? feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0) / totalFeedbacks 
        : 0;
      const negativeFeedback = feedback.filter(fb => (fb.rating || 0) < 3).length;
      const negativeFeedbackPercentage = totalFeedbacks > 0 ? (negativeFeedback / totalFeedbacks) * 100 : 0;
      
      // QR Code stats
      const activeQrCodes = qrCodes.filter(qr => qr.is_active).length;
      const qrScans = qrCodes.reduce((sum, qr) => sum + (qr.scan_count || 0), 0);
      
      // Customer frequency analysis
      const frequencyRanges = [
        { label: 'Visit 1 time', min: 1, max: 1 },
        { label: 'Visit 2 times', min: 2, max: 2 },
        { label: 'Visit 3 to 5 times', min: 3, max: 5 },
        { label: 'Visit 5+ times', min: 6, max: Infinity }
      ];
      
      const customerFrequency = frequencyRanges.map(range => {
        const count = customers.filter(customer => {
          const visits = customer.total_visits || 0;
          return visits >= range.min && visits <= range.max;
        }).length;
        
        const percentage = totalCustomers > 0 ? (count / totalCustomers) * 100 : 0;
        
        return {
          label: range.label,
          count,
          percentage
        };
      });
      
      // Add total visitors
      customerFrequency.push({
        label: 'Total Visitors',
        count: totalCustomers,
        percentage: 100
      });
      
      // Top rewards (mock data since we need to aggregate)
      const topRewards = loyaltyRewards.map(reward => ({
        name: reward.name,
        redeemed: reward.total_redeemed || 0
      })).sort((a, b) => b.redeemed - a.redeemed).slice(0, 4);
      
      // Upcoming celebrations (next 30 days)
      const upcomingCelebrations = customers
        .filter(customer => customer.birthday || customer.anniversary)
        .map(customer => {
          const celebrations = [];
          const now = new Date();
          const nextMonth = new Date();
          nextMonth.setDate(nextMonth.getDate() + 30);
          
          if (customer.birthday) {
            const birthday = new Date(customer.birthday);
            birthday.setFullYear(now.getFullYear());
            if (birthday < now) {
              birthday.setFullYear(now.getFullYear() + 1);
            }
            if (birthday <= nextMonth) {
              celebrations.push({
                name: `${customer.first_name} ${customer.last_name || ''}`.trim(),
                type: 'Birthday' as const,
                date: birthday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                phone: customer.phone
              });
            }
          }
          
          if (customer.anniversary) {
            const anniversary = new Date(customer.anniversary);
            anniversary.setFullYear(now.getFullYear());
            if (anniversary < now) {
              anniversary.setFullYear(now.getFullYear() + 1);
            }
            if (anniversary <= nextMonth) {
              celebrations.push({
                name: `${customer.first_name} ${customer.last_name || ''}`.trim(),
                type: 'Anniversary' as const,
                date: anniversary.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                phone: customer.phone
              });
            }
          }
          
          return celebrations;
        })
        .flat()
        .slice(0, 4);
      
      // Profile completion
      const completedProfiles = customers.filter(customer => (customer.profile_completion || 0) >= 80).length;
      const profileCompletionPercentage = totalCustomers > 0 ? (completedProfiles / totalCustomers) * 100 : 0;
      
      // Calculate insights
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
      const averageVisitsPerYear = totalCustomers > 0 
        ? customers.reduce((sum, customer) => sum + (customer.total_visits || 0), 0) / totalCustomers 
        : 0;

      const dashboardData: DashboardData = {
        // Highlights
        totalSales,
        totalOrders,
        totalCustomers,
        newCustomers,
        repeatCustomers,
        rewardsRedeemed,
        
        // Charts data
        salesData,
        visitsData,
        
        // Customer data
        activeCustomers,
        inactiveCustomers,
        
        // Credits
        credits: {
          sms: credits?.sms_credits || 0,
          email: credits?.email_credits || 0,
          whatsappUtility: credits?.whatsapp_utility_credits || 0,
          whatsappMarketing: credits?.whatsapp_marketing_credits || 0
        },
        
        // Insights
        revenueFromCrm: campaignRevenue + loyaltyRevenue,
        visitsFromCrm: campaignVisits + rewardsRedeemed,
        averageOrderValue,
        averageVisitsPerYear,
        
        // Program performance
        loyaltyStats: {
          redemptions: rewardsRedeemed,
          revenueGain: loyaltyRevenue,
          redemptionRate
        },
        
        campaignStats: {
          totalSent,
          customersVisited: campaignVisits,
          revenueGain: campaignRevenue
        },
        
        feedbackStats: {
          totalFeedbacks,
          averageRating,
          negativeFeedback: negativeFeedbackPercentage
        },
        
        autoCampaignStats: {
          currentlyActive: 0, // Mock data
          customersVisited: 0,
          revenueGain: 0
        },
        
        qrCodeStats: {
          activeQrCodes,
          customersCaptured: qrScans,
          revenue: qrScans * 50 // Estimate ₹50 per scan
        },
        
        referralStats: {
          potentialCustomers: 0, // Mock data
          newCustomers: 0,
          revenue: 0
        },
        
        // Additional data
        customerFrequency,
        topRewards,
        upcomingCelebrations,
        profileCompletion: {
          percentage: profileCompletionPercentage,
          completedCount: completedProfiles,
          totalCount: totalCustomers
        }
      };
      
      console.log('Dashboard data processed successfully:', {
        totalSales,
        totalOrders,
        totalCustomers,
        hasData: true
      });
      
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  return { data, loading, error, refetch: fetchDashboardData };
};