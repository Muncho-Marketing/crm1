/*
  # Generate Sample Orders and Data

  1. Orders Generation
    - Create orders for different customer segments (VIP, Loyal, New, Promising)
    - Generate realistic order amounts and dates
    - Include various payment methods and statuses

  2. Customer Statistics Update
    - Update total visits, total spent, last visit date
    - Calculate loyalty points based on spending
    - Update profile completion percentages

  3. Sample Data Creation
    - Create loyalty reward redemptions
    - Generate customer feedback entries
    - Add QR codes for tables
    - Create campaign data with performance metrics
    - Update credits balance to reflect usage
*/

-- First, let's create orders for VIP customers (high spenders, frequent visitors)
DO $$
DECLARE
    customer_record RECORD;
    order_count INTEGER;
    i INTEGER;
    order_amount NUMERIC(10,2);
    order_date TIMESTAMP;
    payment_methods TEXT[] := ARRAY['cash', 'card', 'upi', 'digital_wallet'];
BEGIN
    FOR customer_record IN 
        SELECT * FROM customers 
        WHERE email LIKE ANY(ARRAY[
            'priya.sharma@email.com',
            'rajesh.kumar@gmail.com',
            'anita.patel@yahoo.com',
            'vikram.singh@hotmail.com',
            'meera.gupta@gmail.com'
        ])
    LOOP
        order_count := 15 + floor(random() * 10)::int; -- 15-25 orders
        
        FOR i IN 1..order_count LOOP
            order_amount := (800 + (RANDOM() * 1700))::numeric(10,2);
            order_date := NOW() - (RANDOM() * INTERVAL '180 days');
            
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
                'ORD-' || LPAD((1000 + i)::text, 6, '0'),
                order_amount,
                order_date,
                'completed',
                payment_methods[1 + floor(random() * 4)::int],
                order_date
            );
        END LOOP;
    END LOOP;
END $$;

-- Generate orders for Loyal customers (regular visitors, moderate spend)
DO $$
DECLARE
    customer_record RECORD;
    order_count INTEGER;
    i INTEGER;
    order_amount NUMERIC(10,2);
    order_date TIMESTAMP;
    payment_methods TEXT[] := ARRAY['cash', 'card', 'upi', 'digital_wallet'];
BEGIN
    FOR customer_record IN 
        SELECT * FROM customers 
        WHERE email LIKE ANY(ARRAY[
            'amit.joshi@email.com',
            'sunita.rao@gmail.com',
            'ravi.mehta@yahoo.com',
            'kavita.shah@hotmail.com',
            'deepak.agarwal@gmail.com'
        ])
    LOOP
        order_count := 8 + floor(random() * 7)::int; -- 8-15 orders
        
        FOR i IN 1..order_count LOOP
            order_amount := (400 + (RANDOM() * 800))::numeric(10,2);
            order_date := NOW() - (RANDOM() * INTERVAL '120 days');
            
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
                'ORD-' || LPAD((2000 + i)::text, 6, '0'),
                order_amount,
                order_date,
                'completed',
                payment_methods[1 + floor(random() * 4)::int],
                order_date
            );
        END LOOP;
    END LOOP;
END $$;

-- Generate orders for New customers (recent joiners, few visits)
DO $$
DECLARE
    customer_record RECORD;
    order_count INTEGER;
    i INTEGER;
    order_amount NUMERIC(10,2);
    order_date TIMESTAMP;
    payment_methods TEXT[] := ARRAY['card', 'upi', 'digital_wallet'];
BEGIN
    FOR customer_record IN 
        SELECT * FROM customers 
        WHERE email LIKE ANY(ARRAY[
            'neha.verma@email.com',
            'arjun.reddy@gmail.com',
            'pooja.nair@yahoo.com',
            'rohit.malhotra@hotmail.com',
            'shreya.iyer@gmail.com'
        ])
    LOOP
        order_count := 1 + floor(random() * 3)::int; -- 1-4 orders
        
        FOR i IN 1..order_count LOOP
            order_amount := (300 + (RANDOM() * 500))::numeric(10,2);
            order_date := NOW() - (RANDOM() * INTERVAL '30 days');
            
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
                'ORD-' || LPAD((3000 + i)::text, 6, '0'),
                order_amount,
                order_date,
                'completed',
                payment_methods[1 + floor(random() * 3)::int],
                order_date
            );
        END LOOP;
    END LOOP;
END $$;

-- Generate orders for Promising customers (good potential, moderate activity)
DO $$
DECLARE
    customer_record RECORD;
    order_count INTEGER;
    i INTEGER;
    order_amount NUMERIC(10,2);
    order_date TIMESTAMP;
    payment_methods TEXT[] := ARRAY['cash', 'card', 'upi', 'digital_wallet'];
BEGIN
    FOR customer_record IN 
        SELECT * FROM customers 
        WHERE email LIKE ANY(ARRAY[
            'nisha.kapoor@email.com',
            'sanjay.bhatt@gmail.com',
            'priyanka.jain@yahoo.com',
            'kiran.desai@hotmail.com',
            'rahul.sinha@gmail.com'
        ])
    LOOP
        order_count := 4 + floor(random() * 4)::int; -- 4-8 orders
        
        FOR i IN 1..order_count LOOP
            order_amount := (350 + (RANDOM() * 550))::numeric(10,2);
            order_date := NOW() - (RANDOM() * INTERVAL '60 days');
            
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
                'ORD-' || LPAD((4000 + i)::text, 6, '0'),
                order_amount,
                order_date,
                'completed',
                payment_methods[1 + floor(random() * 4)::int],
                order_date
            );
        END LOOP;
    END LOOP;
END $$;

-- Generate some orders for remaining customers
DO $$
DECLARE
    customer_record RECORD;
    order_count INTEGER;
    i INTEGER;
    order_amount NUMERIC(10,2);
    order_date TIMESTAMP;
    order_status TEXT;
    payment_methods TEXT[] := ARRAY['cash', 'card', 'upi', 'digital_wallet'];
    counter INTEGER := 0;
BEGIN
    FOR customer_record IN 
        SELECT * FROM customers 
        WHERE id NOT IN (
            SELECT DISTINCT customer_id FROM orders WHERE customer_id IS NOT NULL
        )
    LOOP
        EXIT WHEN counter >= 50; -- Limit to 50 customers
        
        order_count := 2 + floor(random() * 4)::int; -- 2-6 orders
        
        FOR i IN 1..order_count LOOP
            order_amount := (250 + (RANDOM() * 450))::numeric(10,2);
            order_date := NOW() - (RANDOM() * INTERVAL '90 days');
            
            -- Mostly completed orders, some pending/cancelled
            IF random() < 0.8 THEN
                order_status := 'completed';
            ELSIF random() < 0.9 THEN
                order_status := 'pending';
            ELSE
                order_status := 'cancelled';
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
                'ORD-' || LPAD((5000 + counter * 10 + i)::text, 6, '0'),
                order_amount,
                order_date,
                order_status,
                payment_methods[1 + floor(random() * 4)::int],
                order_date
            );
        END LOOP;
        
        counter := counter + 1;
    END LOOP;
END $$;

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
    (SELECT id FROM loyalty_rewards WHERE restaurant_id = c.restaurant_id ORDER BY points_required LIMIT 1),
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
ORDER BY RANDOM()
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
    -- Mostly positive ratings (3-5 stars) - Fixed syntax error
    CASE 
        WHEN floor(RANDOM() * 10)::int = 0 THEN 2
        WHEN floor(RANDOM() * 10)::int = 1 THEN 3
        WHEN floor(RANDOM() * 10)::int IN (2, 3) THEN 4
        ELSE 5
    END,
    CASE floor(RANDOM() * 5)::int
        WHEN 0 THEN 'Great food and service!'
        WHEN 1 THEN 'Loved the ambiance and taste.'
        WHEN 2 THEN 'Quick service, delicious food.'
        WHEN 3 THEN 'Will definitely visit again.'
        ELSE 'Excellent experience overall.'
    END,
    CASE floor(RANDOM() * 4)::int
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
ORDER BY RANDOM()
LIMIT 80;

-- Create some QR codes
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
    'Table ' || series_num || ' QR',
    'QR-' || UPPER(substring(md5(random()::text) from 1 for 8)),
    CASE (series_num % 3)
        WHEN 0 THEN 'feedback'
        WHEN 1 THEN 'loyalty'
        ELSE 'menu'
    END,
    'https://muncho.app/qr/' || UPPER(substring(md5(random()::text) from 1 for 8)),
    floor(RANDOM() * 50)::int,
    true,
    NOW() - (RANDOM() * INTERVAL '30 days'),
    NOW()
FROM restaurants r,
     (SELECT generate_series(1, 5) as series_num) s
LIMIT 15;

-- Add some campaign data
DO $$
DECLARE
    restaurant_record RECORD;
    campaign_data RECORD;
    campaigns_info CURSOR FOR
        SELECT * FROM (VALUES 
            ('Weekend Special Offer', 'sms', 'Join us this weekend for amazing discounts!'),
            ('New Menu Launch', 'email', 'Discover our exciting new menu items.'),
            ('Happy Hour Deal', 'whatsapp', 'Special prices on drinks from 5-7 PM!'),
            ('Birthday Special', 'sms', 'Celebrate your birthday with us - special treats await!'),
            ('Loyalty Rewards', 'email', 'Redeem your points for amazing rewards.')
        ) AS t(name, type, message);
BEGIN
    FOR restaurant_record IN SELECT * FROM restaurants LOOP
        FOR campaign_data IN campaigns_info LOOP
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
                campaign_data.name,
                campaign_data.type,
                'completed',
                campaign_data.message,
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
            );
        END LOOP;
    END LOOP;
END $$;

-- Update credits balance to reflect usage
UPDATE credits_balance 
SET 
    sms_credits = GREATEST(0, sms_credits - (SELECT COALESCE(SUM(total_sent), 0) FROM campaigns WHERE type = 'sms')),
    email_credits = GREATEST(0, email_credits - (SELECT COALESCE(SUM(total_sent), 0) FROM campaigns WHERE type = 'email')),
    whatsapp_utility_credits = GREATEST(0, whatsapp_utility_credits - (SELECT COALESCE(SUM(total_sent), 0) FROM campaigns WHERE type = 'whatsapp')),
    updated_at = NOW()
WHERE restaurant_id IN (SELECT id FROM restaurants);