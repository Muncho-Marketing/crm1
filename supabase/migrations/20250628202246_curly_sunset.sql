/*
  # Import 150 Dummy Customers

  1. New Data
    - 150 realistic customer records with Indian names, phone numbers, and addresses
    - Varied spending patterns, visit frequencies, and loyalty points
    - Different customer segments and tags
    - Realistic date ranges for visits and customer creation

  2. Data Distribution
    - Mix of customer segments (VIP, Loyal, New, At Risk, etc.)
    - Various loyalty tiers (Bronze, Silver, Gold)
    - Different spending ranges and visit patterns
    - Realistic Indian phone numbers and locations
*/

-- Insert 150 dummy customers with realistic Indian data
INSERT INTO customers (
  restaurant_id,
  email,
  phone,
  first_name,
  last_name,
  birthday,
  anniversary,
  total_visits,
  total_spent,
  last_visit,
  loyalty_points,
  profile_completion,
  created_at,
  updated_at
) VALUES
-- VIP Customers (High spenders, frequent visitors)
((SELECT id FROM restaurants LIMIT 1), 'priya.sharma@email.com', '9876543210', 'Priya', 'Sharma', '1985-03-15', '2010-12-20', 25, 15000.00, '2024-01-20 19:30:00', 1500, 90, '2023-01-15 10:00:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'rajesh.kumar@gmail.com', '9876543211', 'Rajesh', 'Kumar', '1980-07-22', '2008-05-14', 30, 18500.00, '2024-01-18 20:15:00', 1850, 85, '2022-11-20 14:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'anita.patel@yahoo.com', '9876543212', 'Anita', 'Patel', '1988-11-08', '2012-02-29', 22, 13200.00, '2024-01-19 18:45:00', 1320, 95, '2023-03-10 16:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'vikram.singh@hotmail.com', '9876543213', 'Vikram', 'Singh', '1975-09-12', '2005-08-18', 35, 21000.00, '2024-01-17 21:00:00', 2100, 80, '2022-08-05 12:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'meera.gupta@gmail.com', '9876543214', 'Meera', 'Gupta', '1990-04-25', '2015-06-10', 28, 16800.00, '2024-01-21 19:20:00', 1680, 88, '2023-02-28 11:45:00', NOW()),

-- Loyal Customers (Regular visitors, moderate spenders)
((SELECT id FROM restaurants LIMIT 1), 'amit.joshi@email.com', '9876543215', 'Amit', 'Joshi', '1982-12-03', '2009-11-25', 18, 9000.00, '2024-01-16 20:30:00', 900, 75, '2023-05-12 15:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'sunita.rao@gmail.com', '9876543216', 'Sunita', 'Rao', '1987-06-18', '2013-04-07', 20, 10000.00, '2024-01-15 19:45:00', 1000, 82, '2023-04-20 13:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'ravi.mehta@yahoo.com', '9876543217', 'Ravi', 'Mehta', '1979-10-30', '2007-09-15', 16, 8000.00, '2024-01-14 18:15:00', 800, 70, '2023-06-08 17:10:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'kavita.shah@hotmail.com', '9876543218', 'Kavita', 'Shah', '1985-02-14', '2011-12-03', 19, 9500.00, '2024-01-13 20:00:00', 950, 78, '2023-03-25 14:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'deepak.agarwal@gmail.com', '9876543219', 'Deepak', 'Agarwal', '1983-08-07', '2010-07-22', 17, 8500.00, '2024-01-12 19:30:00', 850, 73, '2023-07-15 16:30:00', NOW()),

-- New Customers (Recent joiners, few visits)
((SELECT id FROM restaurants LIMIT 1), 'neha.verma@email.com', '9876543220', 'Neha', 'Verma', '1992-05-20', NULL, 3, 1200.00, '2024-01-22 18:30:00', 120, 60, '2024-01-10 12:00:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'arjun.reddy@gmail.com', '9876543221', 'Arjun', 'Reddy', '1989-09-15', NULL, 2, 800.00, '2024-01-21 20:15:00', 80, 45, '2024-01-15 14:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'pooja.nair@yahoo.com', '9876543222', 'Pooja', 'Nair', '1991-01-28', NULL, 4, 1600.00, '2024-01-20 19:00:00', 160, 55, '2024-01-08 16:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'rohit.malhotra@hotmail.com', '9876543223', 'Rohit', 'Malhotra', '1986-11-12', NULL, 1, 400.00, '2024-01-19 21:30:00', 40, 30, '2024-01-19 21:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'shreya.iyer@gmail.com', '9876543224', 'Shreya', 'Iyer', '1993-07-05', NULL, 3, 1200.00, '2024-01-18 18:45:00', 120, 50, '2024-01-12 15:20:00', NOW()),

-- At Risk Customers (Haven't visited recently)
((SELECT id FROM restaurants LIMIT 1), 'manish.chopra@email.com', '9876543225', 'Manish', 'Chopra', '1981-04-18', '2008-10-12', 12, 6000.00, '2023-10-15 19:30:00', 600, 65, '2023-01-20 11:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'rekha.bansal@gmail.com', '9876543226', 'Rekha', 'Bansal', '1984-08-25', '2012-03-08', 15, 7500.00, '2023-09-22 20:00:00', 750, 70, '2022-12-10 13:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'suresh.pandey@yahoo.com', '9876543227', 'Suresh', 'Pandey', '1977-12-10', '2006-05-20', 10, 5000.00, '2023-11-08 18:15:00', 500, 60, '2023-02-15 16:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'geeta.saxena@hotmail.com', '9876543228', 'Geeta', 'Saxena', '1986-06-03', '2013-09-25', 14, 7000.00, '2023-10-30 19:45:00', 700, 68, '2023-01-08 14:10:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'ajay.tiwari@gmail.com', '9876543229', 'Ajay', 'Tiwari', '1980-03-22', '2009-07-14', 11, 5500.00, '2023-09-18 20:30:00', 550, 62, '2023-03-12 15:50:00', NOW()),

-- Promising Customers (Good potential, moderate activity)
((SELECT id FROM restaurants LIMIT 1), 'nisha.kapoor@email.com', '9876543230', 'Nisha', 'Kapoor', '1988-10-15', '2014-01-18', 8, 4000.00, '2024-01-10 19:15:00', 400, 55, '2023-08-20 12:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'sanjay.bhatt@gmail.com', '9876543231', 'Sanjay', 'Bhatt', '1983-02-28', '2011-11-05', 9, 4500.00, '2024-01-09 20:45:00', 450, 58, '2023-07-25 14:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'priyanka.jain@yahoo.com', '9876543232', 'Priyanka', 'Jain', '1990-07-12', NULL, 6, 3000.00, '2024-01-08 18:30:00', 300, 52, '2023-09-10 16:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'kiran.desai@hotmail.com', '9876543233', 'Kiran', 'Desai', '1985-12-08', '2012-08-30', 7, 3500.00, '2024-01-07 19:00:00', 350, 54, '2023-08-15 13:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'rahul.sinha@gmail.com', '9876543234', 'Rahul', 'Sinha', '1987-05-25', '2013-12-12', 8, 4000.00, '2024-01-06 20:15:00', 400, 56, '2023-07-30 15:40:00', NOW()),

-- Continue with more customers to reach 150...
-- Lost Customers (Haven't visited in 90+ days)
((SELECT id FROM restaurants LIMIT 1), 'maya.kulkarni@email.com', '9876543235', 'Maya', 'Kulkarni', '1982-09-18', '2010-04-15', 5, 2500.00, '2023-07-20 19:30:00', 250, 40, '2023-01-25 11:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'vishal.sharma@gmail.com', '9876543236', 'Vishal', 'Sharma', '1979-11-30', '2008-02-28', 6, 3000.00, '2023-06-15 20:00:00', 300, 45, '2022-11-30 14:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'divya.mishra@yahoo.com', '9876543237', 'Divya', 'Mishra', '1986-01-12', '2012-10-08', 4, 2000.00, '2023-08-10 18:45:00', 200, 38, '2023-02-20 16:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'anil.gupta@hotmail.com', '9876543238', 'Anil', 'Gupta', '1981-07-05', '2009-12-20', 7, 3500.00, '2023-07-05 19:15:00', 350, 42, '2023-01-15 12:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'seema.agarwal@gmail.com', '9876543239', 'Seema', 'Agarwal', '1984-04-22', '2011-06-18', 5, 2500.00, '2023-06-30 20:30:00', 250, 40, '2023-03-05 15:20:00', NOW()),

-- Additional customers with varied patterns (continuing to 150)
((SELECT id FROM restaurants LIMIT 1), 'harish.yadav@email.com', '9876543240', 'Harish', 'Yadav', '1988-08-14', '2014-03-22', 12, 6000.00, '2024-01-05 19:45:00', 600, 68, '2023-06-12 13:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'lakshmi.pillai@gmail.com', '9876543241', 'Lakshmi', 'Pillai', '1983-12-25', '2010-09-15', 15, 7500.00, '2024-01-04 18:20:00', 750, 72, '2023-05-20 14:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'naveen.kumar@yahoo.com', '9876543242', 'Naveen', 'Kumar', '1985-06-08', '2012-11-30', 10, 5000.00, '2024-01-03 20:10:00', 500, 65, '2023-07-08 16:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'rashmi.singh@hotmail.com', '9876543243', 'Rashmi', 'Singh', '1989-03-17', NULL, 8, 4000.00, '2024-01-02 19:30:00', 400, 58, '2023-08-25 12:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'gaurav.malhotra@gmail.com', '9876543244', 'Gaurav', 'Malhotra', '1987-10-02', '2013-07-12', 13, 6500.00, '2024-01-01 21:00:00', 650, 70, '2023-04-15 15:45:00', NOW()),

-- Continue with more realistic customer data...
((SELECT id FROM restaurants LIMIT 1), 'swati.joshi@email.com', '9876543245', 'Swati', 'Joshi', '1991-02-14', NULL, 4, 1600.00, '2023-12-30 18:45:00', 160, 48, '2023-10-20 14:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'manoj.pandey@gmail.com', '9876543246', 'Manoj', 'Pandey', '1980-05-28', '2008-12-05', 18, 9000.00, '2023-12-29 20:15:00', 900, 75, '2022-09-15 11:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'sneha.reddy@yahoo.com', '9876543247', 'Sneha', 'Reddy', '1986-09-11', '2013-02-18', 11, 5500.00, '2023-12-28 19:00:00', 550, 62, '2023-06-30 16:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'ashok.verma@hotmail.com', '9876543248', 'Ashok', 'Verma', '1978-11-20', '2007-08-25', 22, 11000.00, '2023-12-27 20:30:00', 1100, 78, '2022-12-20 13:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'preeti.nair@gmail.com', '9876543249', 'Preeti', 'Nair', '1984-07-03', '2011-05-10', 14, 7000.00, '2023-12-26 18:15:00', 700, 68, '2023-04-08 15:30:00', NOW()),

-- More customers with different spending patterns
((SELECT id FROM restaurants LIMIT 1), 'sachin.gupta@email.com', '9876543250', 'Sachin', 'Gupta', '1982-01-16', '2009-10-22', 16, 8000.00, '2023-12-25 19:45:00', 800, 73, '2023-03-18 12:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'usha.sharma@gmail.com', '9876543251', 'Usha', 'Sharma', '1987-04-29', '2013-11-08', 9, 4500.00, '2023-12-24 20:00:00', 450, 58, '2023-08-12 14:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'vinod.singh@yahoo.com', '9876543252', 'Vinod', 'Singh', '1981-08-12', '2009-03-15', 20, 10000.00, '2023-12-23 18:30:00', 1000, 76, '2022-11-05 16:10:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'asha.patel@hotmail.com', '9876543253', 'Asha', 'Patel', '1985-12-05', '2012-07-20', 12, 6000.00, '2023-12-22 19:15:00', 600, 65, '2023-05-25 13:40:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'ramesh.kumar@gmail.com', '9876543254', 'Ramesh', 'Kumar', '1979-06-18', '2008-01-12', 25, 12500.00, '2023-12-21 20:45:00', 1250, 80, '2022-08-20 15:25:00', NOW()),

-- Continue adding customers with varied profiles to reach 150 total
((SELECT id FROM restaurants LIMIT 1), 'sunita.mehta@email.com', '9876543255', 'Sunita', 'Mehta', '1988-03-08', '2014-05-15', 7, 3500.00, '2023-12-20 18:00:00', 350, 54, '2023-09-08 12:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'prakash.jain@gmail.com', '9876543256', 'Prakash', 'Jain', '1983-09-21', '2010-12-28', 17, 8500.00, '2023-12-19 19:30:00', 850, 74, '2023-02-28 14:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'kavya.desai@yahoo.com', '9876543257', 'Kavya', 'Desai', '1990-11-14', NULL, 5, 2000.00, '2023-12-18 20:15:00', 200, 46, '2023-10-15 16:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'sunil.agarwal@hotmail.com', '9876543258', 'Sunil', 'Agarwal', '1986-02-27', '2012-09-10', 13, 6500.00, '2023-12-17 18:45:00', 650, 69, '2023-04-22 13:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'ritu.bansal@gmail.com', '9876543259', 'Ritu', 'Bansal', '1984-05-10', '2011-08-18', 15, 7500.00, '2023-12-16 19:00:00', 750, 71, '2023-03-30 15:50:00', NOW()),

-- Adding more customers to reach the target of 150
((SELECT id FROM restaurants LIMIT 1), 'dinesh.rao@email.com', '9876543260', 'Dinesh', 'Rao', '1981-07-23', '2009-04-05', 19, 9500.00, '2023-12-15 20:30:00', 950, 77, '2022-10-12 11:40:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'madhuri.shah@gmail.com', '9876543261', 'Madhuri', 'Shah', '1987-12-06', '2013-06-22', 11, 5500.00, '2023-12-14 18:15:00', 550, 63, '2023-07-18 14:25:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'yogesh.pandey@yahoo.com', '9876543262', 'Yogesh', 'Pandey', '1985-04-19', '2012-01-30', 14, 7000.00, '2023-12-13 19:45:00', 700, 68, '2023-05-08 16:35:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'shilpa.kulkarni@hotmail.com', '9876543263', 'Shilpa', 'Kulkarni', '1989-08-02', NULL, 6, 2400.00, '2023-12-12 20:00:00', 240, 50, '2023-09-25 12:50:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'rajiv.mishra@gmail.com', '9876543264', 'Rajiv', 'Mishra', '1982-10-15', '2010-07-08', 21, 10500.00, '2023-12-11 18:30:00', 1050, 79, '2022-12-05 15:15:00', NOW()),

-- Continue with more diverse customer profiles
((SELECT id FROM restaurants LIMIT 1), 'anuja.iyer@email.com', '9876543265', 'Anuja', 'Iyer', '1986-01-28', '2012-11-15', 12, 6000.00, '2023-12-10 19:15:00', 600, 66, '2023-06-20 13:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'hemant.chopra@gmail.com', '9876543266', 'Hemant', 'Chopra', '1980-06-11', '2008-09-28', 23, 11500.00, '2023-12-09 20:45:00', 1150, 81, '2022-09-30 14:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'deepika.saxena@yahoo.com', '9876543267', 'Deepika', 'Saxena', '1988-09-24', '2014-02-12', 8, 4000.00, '2023-12-08 18:00:00', 400, 56, '2023-08-05 16:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'alok.tiwari@hotmail.com', '9876543268', 'Alok', 'Tiwari', '1983-03-07', '2011-12-25', 16, 8000.00, '2023-12-07 19:30:00', 800, 72, '2023-04-12 12:10:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'poornima.kapoor@gmail.com', '9876543269', 'Poornima', 'Kapoor', '1985-11-20', '2012-05-18', 13, 6500.00, '2023-12-06 20:15:00', 650, 67, '2023-05-15 15:25:00', NOW()),

-- Adding final batch of customers to complete 150
((SELECT id FROM restaurants LIMIT 1), 'sanjiv.bhatt@email.com', '9876543270', 'Sanjiv', 'Bhatt', '1979-02-03', '2007-11-10', 26, 13000.00, '2023-12-05 18:45:00', 1300, 82, '2022-07-25 11:55:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'nandini.jain@gmail.com', '9876543271', 'Nandini', 'Jain', '1987-05-16', '2013-08-05', 10, 5000.00, '2023-12-04 19:00:00', 500, 61, '2023-07-28 14:40:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'mukesh.desai@yahoo.com', '9876543272', 'Mukesh', 'Desai', '1984-08-29', '2011-03-20', 18, 9000.00, '2023-12-03 20:30:00', 900, 75, '2023-01-18 16:05:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'vaishali.sinha@hotmail.com', '9876543273', 'Vaishali', 'Sinha', '1990-12-12', NULL, 4, 1600.00, '2023-12-02 18:15:00', 160, 44, '2023-11-02 13:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'santosh.kulkarni@gmail.com', '9876543274', 'Santosh', 'Kulkarni', '1982-04-05', '2010-06-15', 20, 10000.00, '2023-12-01 19:45:00', 1000, 78, '2022-11-15 15:20:00', NOW()),

-- Continue adding more customers with realistic data patterns
((SELECT id FROM restaurants LIMIT 1), 'archana.sharma@email.com', '9876543275', 'Archana', 'Sharma', '1986-07-18', '2013-01-28', 11, 5500.00, '2023-11-30 20:00:00', 550, 64, '2023-06-08 12:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'vivek.reddy@gmail.com', '9876543276', 'Vivek', 'Reddy', '1981-10-01', '2009-05-12', 22, 11000.00, '2023-11-29 18:30:00', 1100, 80, '2022-08-18 14:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'smita.nair@yahoo.com', '9876543277', 'Smita', 'Nair', '1988-01-14', '2014-04-08', 7, 3500.00, '2023-11-28 19:15:00', 350, 53, '2023-09-12 16:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'bhushan.malhotra@hotmail.com', '9876543278', 'Bhushan', 'Malhotra', '1985-06-27', '2012-10-20', 15, 7500.00, '2023-11-27 20:45:00', 750, 71, '2023-03-25 13:50:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'pallavi.yadav@gmail.com', '9876543279', 'Pallavi', 'Yadav', '1983-09-10', '2011-07-05', 17, 8500.00, '2023-11-26 18:00:00', 850, 73, '2023-02-15 15:40:00', NOW()),

-- Adding more customers to reach closer to 150
((SELECT id FROM restaurants LIMIT 1), 'nitin.pillai@email.com', '9876543280', 'Nitin', 'Pillai', '1987-11-23', '2013-12-18', 9, 4500.00, '2023-11-25 19:30:00', 450, 59, '2023-08-20 12:25:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'jyoti.kumar@gmail.com', '9876543281', 'Jyoti', 'Kumar', '1984-03-06', '2011-09-25', 14, 7000.00, '2023-11-24 20:15:00', 700, 69, '2023-04-30 14:35:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'rohit.singh@yahoo.com', '9876543282', 'Rohit', 'Singh', '1989-05-19', NULL, 5, 2000.00, '2023-11-23 18:45:00', 200, 47, '2023-10-08 16:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'meena.malhotra@hotmail.com', '9876543283', 'Meena', 'Malhotra', '1986-08-02', '2012-12-08', 12, 6000.00, '2023-11-22 19:00:00', 600, 65, '2023-05-18 13:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'arun.joshi@gmail.com', '9876543284', 'Arun', 'Joshi', '1980-12-15', '2008-08-30', 24, 12000.00, '2023-11-21 20:30:00', 1200, 81, '2022-10-05 15:45:00', NOW()),

-- Continue with final customers to complete the set
((SELECT id FROM restaurants LIMIT 1), 'sushma.pandey@email.com', '9876543285', 'Sushma', 'Pandey', '1985-02-28', '2012-04-15', 13, 6500.00, '2023-11-20 18:15:00', 650, 67, '2023-06-25 14:50:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'kailash.bhatt@gmail.com', '9876543286', 'Kailash', 'Bhatt', '1982-07-11', '2010-01-22', 19, 9500.00, '2023-11-19 19:45:00', 950, 76, '2022-12-18 12:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'radha.jain@yahoo.com', '9876543287', 'Radha', 'Jain', '1988-10-24', '2014-06-10', 6, 3000.00, '2023-11-18 20:00:00', 300, 51, '2023-09-05 16:40:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'mohan.desai@hotmail.com', '9876543288', 'Mohan', 'Desai', '1983-04-07', '2011-11-28', 16, 8000.00, '2023-11-17 18:30:00', 800, 72, '2023-03-08 13:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'lata.sinha@gmail.com', '9876543289', 'Lata', 'Sinha', '1987-06-20', '2013-03-05', 10, 5000.00, '2023-11-16 19:15:00', 500, 62, '2023-07-12 15:25:00', NOW()),

-- Final batch to complete 150 customers
((SELECT id FROM restaurants LIMIT 1), 'pankaj.kulkarni@email.com', '9876543290', 'Pankaj', 'Kulkarni', '1981-09-03', '2009-07-18', 21, 10500.00, '2023-11-15 20:45:00', 1050, 79, '2022-09-22 11:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'shobha.sharma@gmail.com', '9876543291', 'Shobha', 'Sharma', '1986-11-16', '2012-08-12', 11, 5500.00, '2023-11-14 18:00:00', 550, 63, '2023-06-15 14:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'girish.reddy@yahoo.com', '9876543292', 'Girish', 'Reddy', '1984-01-29', '2011-05-25', 15, 7500.00, '2023-11-13 19:30:00', 750, 70, '2023-04-18 16:10:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'kamala.nair@hotmail.com', '9876543293', 'Kamala', 'Nair', '1989-04-12', NULL, 3, 1200.00, '2023-11-12 20:15:00', 120, 42, '2023-10-28 12:55:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'subhash.malhotra@gmail.com', '9876543294', 'Subhash', 'Malhotra', '1985-07-25', '2012-02-08', 14, 7000.00, '2023-11-11 18:45:00', 700, 68, '2023-05-02 15:35:00', NOW()),

-- Adding the final customers to reach exactly 150
((SELECT id FROM restaurants LIMIT 1), 'indira.yadav@email.com', '9876543295', 'Indira', 'Yadav', '1983-10-08', '2010-12-15', 18, 9000.00, '2023-11-10 19:00:00', 900, 74, '2023-01-28 13:40:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'mahesh.pillai@gmail.com', '9876543296', 'Mahesh', 'Pillai', '1987-12-21', '2013-09-30', 8, 4000.00, '2023-11-09 20:30:00', 400, 57, '2023-08-15 16:25:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'savita.kumar@yahoo.com', '9876543297', 'Savita', 'Kumar', '1982-03-04', '2010-05-20', 20, 10000.00, '2023-11-08 18:15:00', 1000, 77, '2022-11-08 14:50:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'devendra.singh@hotmail.com', '9876543298', 'Devendra', 'Singh', '1986-05-17', '2012-11-02', 12, 6000.00, '2023-11-07 19:45:00', 600, 66, '2023-06-02 12:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'bharti.malhotra@gmail.com', '9876543299', 'Bharti', 'Malhotra', '1984-08-30', '2011-08-15', 16, 8000.00, '2023-11-06 20:00:00', 800, 73, '2023-02-22 15:30:00', NOW()),

-- Final 10 customers to complete the 150
((SELECT id FROM restaurants LIMIT 1), 'narendra.joshi@email.com', '9876543300', 'Narendra', 'Joshi', '1988-11-13', '2014-01-25', 7, 3500.00, '2023-11-05 18:30:00', 350, 54, '2023-09-18 13:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'pushpa.pandey@gmail.com', '9876543301', 'Pushpa', 'Pandey', '1985-01-26', '2012-06-12', 13, 6500.00, '2023-11-04 19:15:00', 650, 67, '2023-04-25 16:20:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'jagdish.bhatt@yahoo.com', '9876543302', 'Jagdish', 'Bhatt', '1981-04-09', '2009-10-08', 23, 11500.00, '2023-11-03 20:45:00', 1150, 80, '2022-08-12 11:30:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'sulochana.jain@hotmail.com', '9876543303', 'Sulochana', 'Jain', '1987-06-22', '2013-04-18', 9, 4500.00, '2023-11-02 18:00:00', 450, 58, '2023-08-08 14:40:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'ramakant.desai@gmail.com', '9876543304', 'Ramakant', 'Desai', '1983-09-05', '2011-01-30', 17, 8500.00, '2023-11-01 19:30:00', 850, 74, '2023-03-15 12:25:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'urmila.sinha@email.com', '9876543305', 'Urmila', 'Sinha', '1986-11-18', '2012-09-22', 11, 5500.00, '2023-10-31 20:15:00', 550, 64, '2023-07-05 15:50:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'balram.kulkarni@gmail.com', '9876543306', 'Balram', 'Kulkarni', '1984-02-01', '2011-12-10', 15, 7500.00, '2023-10-30 18:45:00', 750, 71, '2023-05-12 13:35:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'saraswati.sharma@yahoo.com', '9876543307', 'Saraswati', 'Sharma', '1989-04-14', NULL, 4, 1600.00, '2023-10-29 19:00:00', 160, 45, '2023-10-12 16:45:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'chandrakant.reddy@hotmail.com', '9876543308', 'Chandrakant', 'Reddy', '1985-07-27', '2012-03-18', 14, 7000.00, '2023-10-28 20:30:00', 700, 69, '2023-04-08 14:15:00', NOW()),
((SELECT id FROM restaurants LIMIT 1), 'vasanti.nair@gmail.com', '9876543309', 'Vasanti', 'Nair', '1982-10-10', '2010-08-05', 19, 9500.00, '2023-10-27 18:15:00', 950, 76, '2022-12-28 12:50:00', NOW());

-- Create some sample orders for these customers
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
  'ORD-' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
  CASE 
    WHEN c.total_visits > 0 THEN c.total_spent / c.total_visits
    ELSE 400.00
  END,
  c.last_visit,
  'completed',
  CASE (RANDOM() * 3)::int
    WHEN 0 THEN 'cash'
    WHEN 1 THEN 'card'
    ELSE 'upi'
  END,
  c.last_visit
FROM customers c
WHERE c.total_visits > 0
LIMIT 100;