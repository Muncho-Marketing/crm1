/*
  # Sample Data Generation Migration

  1. New Functions
    - `generate_orders_for_segment` - Creates orders for specific customer segments
  
  2. Data Generation
    - Creates realistic order history for different customer segments (VIP, Loyal, New, Promising)
    - Updates customer statistics based on order history
    - Generates loyalty rewards and redemptions
    - Creates feedback entries for completed orders
    - Generates QR codes for restaurants
    - Creates campaign history with realistic metrics
    - Updates credits balance based on campaign usage
  
  3. Customer Segmentation
    - VIP customers: High spenders with frequent visits
    - Loyal customers: Regular visitors with moderate spend
    - New customers: Recent joiners with few visits
    - Promising customers: Good potential with moderate activity
  
  4. Cleanup
    - Removes temporary functions after use
*/

-- Create a temporary function to generate orders for a customer segment
CREATE OR REPLACE FUNCTION generate_orders_for_segment(
  segment_emails text[],
  min_amount numeric,
  max_amount numeric,
  days_back integer,
  orders_per_customer integer,
  order_prefix text
) RETURNS void AS $$
DECLARE
  customer_record RECORD;
  i integer;
  order_amount numeric;
  order_date timestamp with time zone;
  order_number text;
  payment_methods text[] := ARRAY['cash', 'card', 'upi', 'digital_wallet'];
  payment_method text;
BEGIN
  FOR customer_record IN 
    SELECT id, restaurant_id FROM customers WHERE email = ANY(segment_emails)
  LOOP
    FOR i IN 1..orders_per_customer LOOP
      order_amount := min_amount + (RANDOM() * (max_amount - min_amount));
      order_date := NOW() - (RANDOM() * (days_back || ' days')::interval);
      order_number := order_prefix || '-' || LPAD((EXTRACT(EPOCH FROM NOW())::bigint + i)::text, 6, '0');
      payment_method := payment_methods[1 + (RANDOM() * array_length(payment_methods, 1))::int];
      
      INSERT INTO orders (
        restaurant_id,
        customer_id,
        order_number,
        total_amount,
        order_date,
        status,
        payment_method,
        created_at
      ) VALUES (
        customer_record.restaurant_id,
        customer_record.id,
        order_number,
        order_amount,
        order_date,
        'completed',
        payment_method,
        order_date
      );
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate orders for VIP customers (high spenders, frequent visitors)
SELECT generate_orders_for_segment(
  ARRAY[
    'priya.sharma@email.com',
    'rajesh.kumar@gmail.com',
    'anita.patel@yahoo.com',
    'vikram.singh@hotmail.com',
    'meera.gupta@gmail.com'
  ],
  800::numeric,
  2500::numeric,
  180,
  20,
  'VIP'
);

-- Generate orders for Loyal customers (regular visitors, moderate spend)
SELECT generate_orders_for_segment(
  ARRAY[
    'amit.joshi@email.com',
    'sunita.rao@gmail.com',
    'ravi.mehta@yahoo.com',
    'kavita.shah@hotmail.com',
    'deepak.agarwal@gmail.com'
  ],
  400::numeric,
  1200::numeric,
  120,
  12,
  'LOY'
);

-- Generate orders for New customers (recent joiners, few visits)
SELECT generate_orders_for_segment(
  ARRAY[
    'neha.verma@email.com',
    'arjun.reddy@gmail.com',
    'pooja.nair@yahoo.com',
    'rohit.malhotra@hotmail.com',
    'shreya.iyer@gmail.com'
  ],
  300::numeric,
  800::numeric,
  30,
  3,
  'NEW'
);

-- Generate orders for Promising customers (good potential, moderate activity)
SELECT generate_orders_for_segment(
  ARRAY[
    'nisha.kapoor@email.com',
    'sanjay.bhatt@gmail.com',
    'priyanka.jain@yahoo.com',
    'kiran.desai@hotmail.com',
    'rahul.sinha@gmail.com'
  ],
  350::numeric,
  900::numeric,
  60,
  6,
  'PRM'
);

-- Generate orders for remaining customers (moderate activity)
DO $$
DECLARE
  customer_record RECORD;
  i integer;
  orders_count integer;
  order_amount numeric;
  order_date timestamp with time zone;
  order_number text;
  payment_methods text[] := ARRAY['cash', 'card', 'upi', 'digital_wallet'];
  payment_method text;
  order_status text;
  customer_hash text;
BEGIN
  FOR customer_record IN 
    SELECT id, restaurant_id FROM customers 
    WHERE email NOT IN (
      'priya.sharma@email.com', 'rajesh.kumar@gmail.com', 'anita.patel@yahoo.com',
      'vikram.singh@hotmail.com', 'meera.gupta@gmail.com', 'amit.joshi@email.com',
      'sunita.rao@gmail.com', 'ravi.mehta@yahoo.com', 'kavita.shah@hotmail.com',
      'deepak.agarwal@gmail.com', 'neha.verma@email.com', 'arjun.reddy@gmail.com',
      'pooja.nair@yahoo.com', 'rohit.malhotra@hotmail.com', 'shreya.iyer@gmail.com',
      'nisha.kapoor@email.com', 'sanjay.bhatt@gmail.com', 'priyanka.jain@yahoo.com',
      'kiran.desai@hotmail.com', 'rahul.sinha@gmail.com'
    )
    LIMIT 50
  LOOP
    orders_count := 2 + (RANDOM() * 4)::int; -- 2-6 orders
    customer_hash := substring(md5(customer_record.id::text) from 1 for 8);
    
    FOR i IN 1..orders_count LOOP
      order_amount := 250 + (RANDOM() * 450);
      order_date := NOW() - (RANDOM() * INTERVAL '90 days');
      order_number := 'REG-' || LPAD((EXTRACT(EPOCH FROM NOW())::bigint + i)::text, 6, '0') || customer_hash;
      payment_method := payment_methods[1 + (RANDOM() * array_length(payment_methods, 1))::int];
      
      -- Mostly completed orders, some pending/cancelled
      IF RANDOM() < 0.1 THEN
        order_status := CASE WHEN RANDOM() < 0.5 THEN 'pending' ELSE 'cancelled' END;
      ELSE
        order_status := 'completed';
      END IF;
      
      INSERT INTO orders (
        restaurant_id,
        customer_id,
        order_number,
        total_amount,
        order_date,
        status,
        payment_method,
        created_at
      ) VALUES (
        customer_record.restaurant_id,
        customer_record.id,
        order_number,
        order_amount::numeric(10,2),
        order_date,
        order_status,
        payment_method,
        order_date
      );
    END LOOP;
  END LOOP;
END;
$$;

-- Update customer statistics based on their orders
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

-- Create some loyalty rewards first (if they don't exist)
INSERT INTO loyalty_rewards (restaurant_id, name, description, points_required, reward_type, reward_value, is_active)
SELECT 
  r.id,
  reward_name,
  reward_desc,
  points_req,
  reward_type_val,
  reward_val,
  true
FROM restaurants r
CROSS JOIN (
  VALUES 
    ('Free Dessert', 'Complimentary dessert of your choice', 100, 'free_item', 0),
    ('10% Discount', '10% off on your total bill', 200, 'discount', 10),
    ('Free Appetizer', 'Free starter with any main course', 150, 'free_item', 0),
    ('₹100 Cashback', 'Get ₹100 cashback on orders above ₹500', 300, 'cashback', 100),
    ('Buy 1 Get 1', 'Buy one main course, get one free', 500, 'free_item', 0)
) AS rewards(reward_name, reward_desc, points_req, reward_type_val, reward_val)
WHERE NOT EXISTS (SELECT 1 FROM loyalty_rewards WHERE restaurant_id = r.id);

-- Create some loyalty reward redemptions for active customers
DO $$
DECLARE
  customer_record RECORD;
  reward_record RECORD;
  order_record RECORD;
  points_to_use integer;
BEGIN
  FOR customer_record IN 
    SELECT id, restaurant_id, loyalty_points FROM customers 
    WHERE loyalty_points >= 100 
    ORDER BY RANDOM()
    LIMIT 25
  LOOP
    -- Get a random reward for this restaurant
    SELECT id, points_required INTO reward_record
    FROM loyalty_rewards 
    WHERE restaurant_id = customer_record.restaurant_id 
      AND points_required <= customer_record.loyalty_points
      AND is_active = true
    ORDER BY RANDOM()
    LIMIT 1;
    
    IF reward_record.id IS NOT NULL THEN
      -- Get a random completed order for this customer
      SELECT id, order_date INTO order_record
      FROM orders 
      WHERE customer_id = customer_record.id 
        AND status = 'completed'
      ORDER BY RANDOM()
      LIMIT 1;
      
      IF order_record.id IS NOT NULL THEN
        points_to_use := reward_record.points_required;
        
        INSERT INTO reward_redemptions (
          restaurant_id,
          customer_id,
          reward_id,
          points_used,
          order_id,
          redeemed_at
        ) VALUES (
          customer_record.restaurant_id,
          customer_record.id,
          reward_record.id,
          points_to_use,
          order_record.id,
          order_record.order_date + (RANDOM() * INTERVAL '1 hour')
        );
      END IF;
    END IF;
  END LOOP;
END;
$$;

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

-- Create feedback entries for completed orders
DO $$
DECLARE
  order_record RECORD;
  rating_val integer;
  comment_val text;
  feedback_type_val text;
  comments text[] := ARRAY[
    'Great food and service!',
    'Loved the ambiance and taste.',
    'Quick service, delicious food.',
    'Will definitely visit again.',
    'Excellent experience overall.',
    'Food was amazing, staff was friendly.',
    'Perfect place for family dinner.',
    'Good value for money.',
    'Fresh ingredients, well prepared.',
    'Cozy atmosphere, great service.'
  ];
  feedback_types text[] := ARRAY['service', 'food', 'ambiance', 'overall'];
BEGIN
  FOR order_record IN 
    SELECT id, restaurant_id, customer_id, order_date
    FROM orders 
    WHERE status = 'completed' 
    ORDER BY RANDOM()
    LIMIT 80
  LOOP
    -- Generate mostly positive ratings (3-5 stars)
    IF RANDOM() < 0.1 THEN
      rating_val := 2;
    ELSIF RANDOM() < 0.2 THEN
      rating_val := 3;
    ELSIF RANDOM() < 0.5 THEN
      rating_val := 4;
    ELSE
      rating_val := 5;
    END IF;
    
    comment_val := comments[1 + (RANDOM() * array_length(comments, 1))::int];
    feedback_type_val := feedback_types[1 + (RANDOM() * array_length(feedback_types, 1))::int];
    
    INSERT INTO feedback (
      restaurant_id,
      customer_id,
      order_id,
      rating,
      comment,
      feedback_type,
      is_public,
      created_at
    ) VALUES (
      order_record.restaurant_id,
      order_record.customer_id,
      order_record.id,
      rating_val,
      comment_val,
      feedback_type_val,
      true,
      order_record.order_date + (RANDOM() * INTERVAL '2 days')
    );
  END LOOP;
END;
$$;

-- Create QR codes for restaurants
DO $$
DECLARE
  restaurant_record RECORD;
  i integer;
  qr_types text[] := ARRAY['feedback', 'loyalty', 'menu'];
  qr_type text;
BEGIN
  FOR restaurant_record IN SELECT id FROM restaurants LOOP
    FOR i IN 1..5 LOOP
      qr_type := qr_types[1 + (RANDOM() * array_length(qr_types, 1))::int];
      
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
      ) VALUES (
        restaurant_record.id,
        'Table ' || i || ' QR',
        'QR-' || UPPER(substring(md5(random()::text) from 1 for 8)),
        qr_type,
        'https://muncho.app/qr/' || UPPER(substring(md5(random()::text) from 1 for 8)),
        (RANDOM() * 50)::int,
        true,
        NOW() - (RANDOM() * INTERVAL '30 days'),
        NOW()
      );
    END LOOP;
  END LOOP;
END;
$$;

-- Create campaign history
DO $$
DECLARE
  restaurant_record RECORD;
  i integer;
  sent_count integer;
  delivered_count integer;
  opened_count integer;
  clicked_count integer;
  campaign_names text[] := ARRAY[
    'Weekend Special Offer',
    'New Menu Launch',
    'Happy Hour Deal',
    'Birthday Special',
    'Loyalty Rewards',
    'Summer Special',
    'Family Dinner Deal',
    'Weekend Brunch',
    'Festival Celebration',
    'Customer Appreciation'
  ];
  campaign_types text[] := ARRAY[
    'sms',
    'email',
    'whatsapp',
    'sms',
    'email',
    'sms',
    'email',
    'whatsapp',
    'sms',
    'email'
  ];
  campaign_messages text[] := ARRAY[
    'Join us this weekend for amazing discounts!',
    'Discover our exciting new menu items.',
    'Special prices on drinks from 5-7 PM!',
    'Celebrate your birthday with us - special treats await!',
    'Redeem your points for amazing rewards.',
    'Beat the heat with our refreshing summer menu!',
    'Perfect family dining experience at great prices.',
    'Join us for an amazing weekend brunch experience!',
    'Celebrate the festival with special traditional dishes.',
    'Thank you for being our valued customer!'
  ];
  random_index integer;
BEGIN
  FOR restaurant_record IN SELECT id FROM restaurants LOOP
    FOR i IN 1..5 LOOP
      random_index := 1 + (RANDOM() * array_length(campaign_names, 1))::int;
      sent_count := 50 + (RANDOM() * 100)::int;
      delivered_count := (sent_count * (0.85 + RANDOM() * 0.1))::int;
      opened_count := (delivered_count * (0.3 + RANDOM() * 0.3))::int;
      clicked_count := (opened_count * (0.1 + RANDOM() * 0.2))::int;
      
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
      ) VALUES (
        restaurant_record.id,
        campaign_names[random_index],
        campaign_types[random_index],
        'completed',
        campaign_messages[random_index],
        '{"segments": ["all"]}',
        NOW() - (RANDOM() * INTERVAL '60 days'),
        NOW() - (RANDOM() * INTERVAL '60 days'),
        sent_count,
        delivered_count,
        opened_count,
        clicked_count,
        (1000 + RANDOM() * 5000)::numeric(10,2),
        NOW() - (RANDOM() * INTERVAL '60 days'),
        NOW()
      );
    END LOOP;
  END LOOP;
END;
$$;

-- Update credits balance to reflect campaign usage
UPDATE credits_balance 
SET 
  sms_credits = GREATEST(0, sms_credits - (
    SELECT COALESCE(SUM(total_sent), 0) 
    FROM campaigns 
    WHERE type = 'sms' AND restaurant_id = credits_balance.restaurant_id
  )),
  email_credits = GREATEST(0, email_credits - (
    SELECT COALESCE(SUM(total_sent), 0) 
    FROM campaigns 
    WHERE type = 'email' AND restaurant_id = credits_balance.restaurant_id
  )),
  whatsapp_utility_credits = GREATEST(0, whatsapp_utility_credits - (
    SELECT COALESCE(SUM(total_sent), 0) 
    FROM campaigns 
    WHERE type = 'whatsapp' AND restaurant_id = credits_balance.restaurant_id
  )),
  updated_at = NOW();

-- Clean up the temporary function
DROP FUNCTION IF EXISTS generate_orders_for_segment(text[], numeric, numeric, integer, integer, text);