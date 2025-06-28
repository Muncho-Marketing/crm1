/*
  # Populate Sales Data for Dummy Customers

  1. Orders Data
    - Create realistic orders for existing customers
    - Vary order amounts and frequencies
    - Set different payment methods and dates
  
  2. Customer Updates
    - Update total_visits and total_spent based on orders
    - Set realistic last_visit dates
    - Update loyalty_points based on spending
  
  3. Data Patterns
    - VIP customers: High frequency, high spend
    - Loyal customers: Regular visits, moderate spend
    - New customers: Few orders, recent dates
    - At-risk customers: No recent orders
*/

-- First, let's create a more comprehensive set of orders for our customers
-- We'll create orders with realistic patterns based on customer segments

-- Generate orders for VIP customers (high spenders, frequent visitors)
INSERT INTO orders (
  restaurant_id,
  customer_id,
  order_number,
  total_amount,
  order_date,
  status,
  payment_method,
  created_at
)
SELECT 
  c.restaurant_id,
  c.id,
  'ORD-' || LPAD((ROW_NUMBER() OVER() + 1000)::text, 6, '0'),
  -- VIP customers: ₹800-2500 per order
  (800 + (RANDOM() * 1700))::numeric(10,2),
  -- Multiple orders over the past 6 months
  NOW() - (RANDOM() * INTERVAL '180 days'),
  'completed',
  CASE (RANDOM() * 4)::int
    WHEN 0 THEN 'cash'
    WHEN 1 THEN 'card'
    WHEN 2 THEN 'upi'
    ELSE 'digital_wallet'
  END,
  NOW() - (RANDOM() * INTERVAL '180 days')
FROM customers c
WHERE c.email LIKE ANY(ARRAY[
  'priya.sharma@email.com',
  'rajesh.kumar@gmail.com',
  'anita.patel@yahoo.com',
  'vikram.singh@hotmail.com',
  'meera.gupta@gmail.com'
])
-- Generate 15-25 orders per VIP customer
CROSS JOIN generate_series(1, 20);

-- Generate orders for Loyal customers (regular visitors, moderate spend)
INSERT INTO orders (
  restaurant_id,
  customer_id,
  order_number,
  total_amount,
  order_date,
  status,
  payment_method,
  created_at
)
SELECT 
  c.restaurant_id,
  c.id,
  'ORD-' || LPAD((ROW_NUMBER() OVER() + 2000)::text, 6, '0'),
  -- Loyal customers: ₹400-1200 per order
  (400 + (RANDOM() * 800))::numeric(10,2),
  -- Regular orders over the past 4 months
  NOW() - (RANDOM() * INTERVAL '120 days'),
  'completed',
  CASE (RANDOM() * 4)::int
    WHEN 0 THEN 'cash'
    WHEN 1 THEN 'card'
    WHEN 2 THEN 'upi'
    ELSE 'digital_wallet'
  END,
  NOW() - (RANDOM() * INTERVAL '120 days')
FROM customers c
WHERE c.email LIKE ANY(ARRAY[
  'amit.joshi@email.com',
  'sunita.rao@gmail.com',
  'ravi.mehta@yahoo.com',
  'kavita.shah@hotmail.com',
  'deepak.agarwal@gmail.com'
])
-- Generate 8-15 orders per loyal customer
CROSS JOIN generate_series(1, 12);

-- Generate orders for New customers (recent joiners, few visits)
INSERT INTO orders (
  restaurant_id,
  customer_id,
  order_number,
  total_amount,
  order_date,
  status,
  payment_method,
  created_at
)
SELECT 
  c.restaurant_id,
  c.id,
  'ORD-' || LPAD((ROW_NUMBER() OVER() + 3000)::text, 6, '0'),
  -- New customers: ₹300-800 per order
  (300 + (RANDOM() * 500))::numeric(10,2),
  -- Recent orders in the past 30 days
  NOW() - (RANDOM() * INTERVAL '30 days'),
  'completed',
  CASE (RANDOM() * 3)::int
    WHEN 0 THEN 'card'
    WHEN 1 THEN 'upi'
    ELSE 'digital_wallet'
  END,
  NOW() - (RANDOM() * INTERVAL '30 days')
FROM customers c
WHERE c.email LIKE ANY(ARRAY[
  'neha.verma@email.com',
  'arjun.reddy@gmail.com',
  'pooja.nair@yahoo.com',
  'rohit.malhotra@hotmail.com',
  'shreya.iyer@gmail.com'
])
-- Generate 1-4 orders per new customer
CROSS JOIN generate_series(1, 3);

-- Generate orders for Promising customers (good potential, moderate activity)
INSERT INTO orders (
  restaurant_id,
  customer_id,
  order_number,
  total_amount,
  order_date,
  status,
  payment_method,
  created_at
)
SELECT 
  c.restaurant_id,
  c.id,
  'ORD-' || LPAD((ROW_NUMBER() OVER() + 4000)::text, 6, '0'),
  -- Promising customers: ₹350-900 per order
  (350 + (RANDOM() * 550))::numeric(10,2),
  -- Orders over the past 2 months
  NOW() - (RANDOM() * INTERVAL '60 days'),
  'completed',
  CASE (RANDOM() * 4)::int
    WHEN 0 THEN 'cash'
    WHEN 1 THEN 'card'
    WHEN 2 THEN 'upi'
    ELSE 'digital_wallet'
  END,
  NOW() - (RANDOM() * INTERVAL '60 days')
FROM customers c
WHERE c.email LIKE ANY(ARRAY[
  'nisha.kapoor@email.com',
  'sanjay.bhatt@gmail.com',
  'priyanka.jain@yahoo.com',
  'kiran.desai@hotmail.com',
  'rahul.sinha@gmail.com'
])
-- Generate 4-8 orders per promising customer
CROSS JOIN generate_series(1, 6);

-- Generate some orders for other customers (moderate activity)
INSERT INTO orders (
  restaurant_id,
  customer_id,
  order_number,
  total_amount,
  order_date,
  status,
  payment_method,
  created_at
)
SELECT 
  c.restaurant_id,
  c.id,
  'ORD-' || LPAD((ROW_NUMBER() OVER() + 5000)::text, 6, '0'),
  -- Regular customers: ₹250-700 per order
  (250 + (RANDOM() * 450))::numeric(10,2),
  -- Orders spread over the past 3 months
  NOW() - (RANDOM() * INTERVAL '90 days'),
  CASE (RANDOM() * 10)::int
    WHEN 0 THEN 'pending'
    WHEN 1 THEN 'cancelled'
    ELSE 'completed'
  END,
  CASE (RANDOM() * 4)::int
    WHEN 0 THEN 'cash'
    WHEN 1 THEN 'card'
    WHEN 2 THEN 'upi'
    ELSE 'digital_wallet'
  END,
  NOW() - (RANDOM() * INTERVAL '90 days')
FROM customers c
WHERE c.id NOT IN (
  SELECT DISTINCT customer_id FROM orders WHERE customer_id IS NOT NULL
)
-- Generate 2-6 orders for remaining customers
CROSS JOIN generate_series(1, 4)
LIMIT 200;

-- Now update customer statistics based on their orders
UPDATE customers 
SET 
  total_visits = order_stats.visit_count,
  total_spent = order_stats.total_amount,
  last_visit = order_stats.last_order_date,
  loyalty_points = FLOOR(order_stats.total_amount / 10), -- 1 point per ₹10 spent
  updated_at = NOW()
FROM (
  SELECT 
    customer_id,
    COUNT(*) as visit_count,
    SUM(total_amount) as total_amount,
    MAX(order_date) as last_order_date
  FROM orders 
  WHERE status = 'completed' AND customer_id IS NOT NULL
  GROUP BY customer_id
) order_stats
WHERE customers.id = order_stats.customer_id;

-- Update profile completion based on available data
UPDATE customers 
SET profile_completion = CASE
  WHEN email IS NOT NULL AND birthday IS NOT NULL AND anniversary IS NOT NULL THEN 100
  WHEN email IS NOT NULL AND (birthday IS NOT NULL OR anniversary IS NOT NULL) THEN 80
  WHEN email IS NOT NULL THEN 60
  WHEN birthday IS NOT NULL OR anniversary IS NOT NULL THEN 40
  ELSE 20
END;

-- Create some loyalty reward redemptions for active customers
INSERT INTO reward_redemptions (
  restaurant_id,
  customer_id,
  reward_id,
  points_used,
  order_id,
  redeemed_at
)
SELECT 
  c.restaurant_id,
  c.id,
  (SELECT id FROM loyalty_rewards WHERE restaurant_id = c.restaurant_id LIMIT 1),
  CASE 
    WHEN c.loyalty_points >= 500 THEN 500
    WHEN c.loyalty_points >= 200 THEN 200
    ELSE 100
  END,
  o.id,
  o.order_date
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE c.loyalty_points >= 100 
  AND RANDOM() < 0.3 -- 30% chance of redemption
  AND o.status = 'completed'
LIMIT 25;

-- Update loyalty points after redemptions
UPDATE customers 
SET loyalty_points = loyalty_points - COALESCE(redemption_stats.total_redeemed, 0)
FROM (
  SELECT 
    customer_id,
    SUM(points_used) as total_redeemed
  FROM reward_redemptions 
  GROUP BY customer_id
) redemption_stats
WHERE customers.id = redemption_stats.customer_id;

-- Create some feedback entries for completed orders
INSERT INTO feedback (
  restaurant_id,
  customer_id,
  order_id,
  rating,
  comment,
  feedback_type,
  is_public,
  created_at
)
SELECT 
  o.restaurant_id,
  o.customer_id,
  o.id,
  -- Mostly positive ratings (3-5 stars)
  CASE (RANDOM() * 10)::int
    WHEN 0 THEN 2
    WHEN 1 THEN 3
    WHEN 2, 3 THEN 4
    ELSE 5
  END,
  CASE (RANDOM() * 5)::int
    WHEN 0 THEN 'Great food and service!'
    WHEN 1 THEN 'Loved the ambiance and taste.'
    WHEN 2 THEN 'Quick service, delicious food.'
    WHEN 3 THEN 'Will definitely visit again.'
    ELSE 'Excellent experience overall.'
  END,
  CASE (RANDOM() * 4)::int
    WHEN 0 THEN 'service'
    WHEN 1 THEN 'food'
    WHEN 2 THEN 'ambiance'
    ELSE 'overall'
  END,
  true,
  o.order_date + (RANDOM() * INTERVAL '2 days')
FROM orders o
WHERE o.status = 'completed' 
  AND RANDOM() < 0.4 -- 40% of completed orders get feedback
LIMIT 80;

-- Create some QR code scans and customer acquisitions
INSERT INTO qr_codes (
  restaurant_id,
  name,
  code,
  type,
  target_url,
  scan_count,
  is_active,
  created_at,
  updated_at
) 
SELECT 
  r.id,
  'Table ' || generate_series || ' QR',
  'QR-' || UPPER(substring(md5(random()::text) from 1 for 8)),
  CASE (generate_series % 3)
    WHEN 0 THEN 'feedback'
    WHEN 1 THEN 'loyalty'
    ELSE 'menu'
  END,
  'https://muncho.app/qr/' || UPPER(substring(md5(random()::text) from 1 for 8)),
  (RANDOM() * 50)::int,
  true,
  NOW() - (RANDOM() * INTERVAL '30 days'),
  NOW()
FROM restaurants r
CROSS JOIN generate_series(1, 5)
LIMIT 15;

-- Add some campaign data (mock campaigns that were sent)
INSERT INTO campaigns (
  restaurant_id,
  name,
  type,
  status,
  message_content,
  target_audience,
  scheduled_at,
  sent_at,
  total_sent,
  total_delivered,
  total_opened,
  total_clicked,
  revenue_generated,
  created_at,
  updated_at
)
SELECT 
  r.id,
  campaign_names.name,
  campaign_names.type,
  'completed',
  campaign_names.message,
  '{"segments": ["all"]}',
  NOW() - (RANDOM() * INTERVAL '60 days'),
  NOW() - (RANDOM() * INTERVAL '60 days'),
  (50 + RANDOM() * 100)::int,
  (45 + RANDOM() * 90)::int,
  (20 + RANDOM() * 40)::int,
  (5 + RANDOM() * 15)::int,
  (1000 + RANDOM() * 5000)::numeric(10,2),
  NOW() - (RANDOM() * INTERVAL '60 days'),
  NOW()
FROM restaurants r
CROSS JOIN (
  VALUES 
    ('Weekend Special Offer', 'sms', 'Join us this weekend for amazing discounts!'),
    ('New Menu Launch', 'email', 'Discover our exciting new menu items.'),
    ('Happy Hour Deal', 'whatsapp', 'Special prices on drinks from 5-7 PM!'),
    ('Birthday Special', 'sms', 'Celebrate your birthday with us - special treats await!'),
    ('Loyalty Rewards', 'email', 'Redeem your points for amazing rewards.')
) AS campaign_names(name, type, message)
LIMIT 10;

-- Update credits balance to reflect usage
UPDATE credits_balance 
SET 
  sms_credits = sms_credits - (SELECT COALESCE(SUM(total_sent), 0) FROM campaigns WHERE type = 'sms'),
  email_credits = email_credits - (SELECT COALESCE(SUM(total_sent), 0) FROM campaigns WHERE type = 'email'),
  whatsapp_utility_credits = whatsapp_utility_credits - (SELECT COALESCE(SUM(total_sent), 0) FROM campaigns WHERE type = 'whatsapp'),
  updated_at = NOW()
WHERE restaurant_id IN (SELECT id FROM restaurants LIMIT 1);