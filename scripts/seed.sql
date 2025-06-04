-- Enable foreign key checks temporarily to allow seeding
SET FOREIGN_KEY_CHECKS = 0;

-- Clear all tables (optional - only if you want to reset the database)
TRUNCATE TABLE `washorders_washtypes`;
TRUNCATE TABLE `washorderoperation`;
TRUNCATE TABLE `washtypes`;
TRUNCATE TABLE `verification_codes`;
TRUNCATE TABLE `subcatproduct`;
TRUNCATE TABLE `subcategory`;
TRUNCATE TABLE `rentalorders`;
TRUNCATE TABLE `rentalcarsimages`;
TRUNCATE TABLE `ratings`;
TRUNCATE TABLE `productsimages`;
TRUNCATE TABLE `orderstatushistory`;
TRUNCATE TABLE `orderitems`;
TRUNCATE TABLE `products`;
TRUNCATE TABLE `order`;
TRUNCATE TABLE `paymentmethod`;
TRUNCATE TABLE `employee`;
TRUNCATE TABLE `customercar`;
TRUNCATE TABLE `companydocuments`;
TRUNCATE TABLE `carwashorders`;
TRUNCATE TABLE `orderitems`;
TRUNCATE TABLE `carorders`;
TRUNCATE TABLE `cart`;
TRUNCATE TABLE `cars`;
TRUNCATE TABLE `companyexhibition`;
TRUNCATE TABLE `carbrand`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `company`;
TRUNCATE TABLE `ads`;
TRUNCATE TABLE `category`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Seed ads table
INSERT INTO `ads` (`ad_id`, `name`, `image_url`, `link_url`, `created_at`, `updated_at`) VALUES
(1, 'Summer Car Wash Special', 'https://example.com/ads/summer-special.jpg', 'https://example.com/promotions', '2025-05-01 10:00:00', '2025-05-01 10:00:00'),
(2, 'New Car Models Available', 'https://example.com/ads/new-models.jpg', 'https://example.com/new-arrivals', '2025-05-02 11:00:00', '2025-05-02 11:00:00'),
(3, 'Premium Detailing Service', 'https://example.com/ads/premium-detailing.jpg', 'https://example.com/services', '2025-05-03 12:00:00', '2025-05-03 12:00:00');

-- Seed category table
INSERT INTO `category` (`category_id`, `category_name`, `icon`) VALUES
(1, 'Car Care Products', 'fas fa-car'),
(2, 'Accessories', 'fas fa-cogs'),
(3, 'Interior', 'fas fa-couch'),
(4, 'Exterior', 'fas fa-car-side');

-- Seed subcategory table
INSERT INTO `subcategory` (`sub_category_id`, `category_id`, `name`, `icon`) VALUES
(1, 1, 'Shampoos', 'fas fa-soap'),
(2, 1, 'Waxes', 'fas fa-spray-can'),
(3, 2, 'Mats', 'fas fa-rug'),
(4, 2, 'Air Fresheners', 'fas fa-wind'),
(5, 3, 'Seat Covers', 'fas fa-chair'),
(6, 3, 'Steering Wheel Covers', 'fas fa-car-side'),
(7, 4, 'Tire Shine', 'fas fa-tire'),
(8, 4, 'Headlight Restorers', 'fas fa-lightbulb');

-- Seed carbrand table
INSERT INTO `carbrand` (`brand_id`, `name`, `logo`) VALUES
(1, 'Toyota', 'https://example.com/logos/toyota.png'),
(2, 'Honda', 'https://example.com/logos/honda.png'),
(3, 'Ford', 'https://example.com/logos/ford.png'),
(4, 'BMW', 'https://example.com/logos/bmw.png'),
(5, 'Mercedes', 'https://example.com/logos/mercedes.png'),
(6, 'Audi', 'https://example.com/logos/audi.png'),
(7, 'Tesla', 'https://example.com/logos/tesla.png'),
(8, 'Nissan', 'https://example.com/logos/nissan.png');

-- Seed company table
INSERT INTO `company` (`company_id`, `company_name`, `email`, `phone_number`, `location`, `logo_url`, `password_hash`, `approved`, `about`, `total_rating`, `created_at`, `updated_at`) VALUES
(1, 'CleanRide Autocare', 'info@cleanride.com', '+1234567890', '123 Main St, Anytown', 'https://example.com/logos/cleanride.png', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 1, 'Premium car wash and detailing services since 2010', 4, '2025-01-01 09:00:00', '2025-05-01 09:00:00'),
(2, 'Elite Detailing', 'contact@elitedetailing.com', '+1987654321', '456 Oak Ave, Somewhere', 'https://example.com/logos/elite.png', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 1, 'Professional auto detailing with eco-friendly products', 5, '2025-01-15 10:00:00', '2025-05-15 10:00:00'),
(3, 'QuickShine Car Wash', 'hello@quickshine.com', '+1122334455', '789 Pine Rd, Anycity', 'https://example.com/logos/quickshine.png', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 1, 'Fast and affordable car wash services', 3, '2025-02-01 11:00:00', '2025-05-20 11:00:00'),
(4, 'Luxury Auto Spa', 'service@luxuryautospa.com', '+1567890123', '321 Elm Blvd, Yourtown', 'https://example.com/logos/luxury.png', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 1, 'Premium services for luxury vehicles', 5, '2025-02-15 12:00:00', '2025-05-25 12:00:00');

-- Seed companyexhibition table
INSERT INTO `companyexhibition` (`exhibition_id`, `location`, `company_id`) VALUES
(1, 'Downtown Showroom', 1),
(2, 'Main Branch', 1),
(3, 'Northside Location', 2),
(4, 'Flagship Store', 2),
(5, 'Eastside Car Wash', 3),
(6, 'Westside Express', 3),
(7, 'Luxury Pavilion', 4),
(8, 'Executive Center', 4);

-- Seed users table (customers and employees)
INSERT INTO `users` (`user_id`, `acc_type`, `profile_picture_url`, `name`, `username`, `email`, `password_hash`, `phone_number`, `address`, `created_at`, `updated_at`) VALUES
-- Customers
(1, 'user', 'https://example.com/profiles/user1.jpg', 'John Smith', 'johnsmith', 'john.smith@example.com', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '+1234567890', '123 Maple St, Anytown', '2025-01-10 08:00:00', '2025-05-10 08:00:00'),
(2, 'user', 'https://example.com/profiles/user2.jpg', 'Sarah Johnson', 'sarahj', 'sarah.j@example.com', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '+1987654321', '456 Oak Ave, Somewhere', '2025-01-15 09:00:00', '2025-05-15 09:00:00'),
(3, 'user', 'https://example.com/profiles/user3.jpg', 'Michael Brown', 'mikeb', 'michael.b@example.com', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '+1122334455', '789 Pine Rd, Anycity', '2025-02-05 10:00:00', '2025-05-20 10:00:00'),
(4, 'user', 'https://example.com/profiles/user4.jpg', 'Emily Davis', 'emilyd', 'emily.d@example.com', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '+1567890123', '321 Elm Blvd, Yourtown', '2025-02-20 11:00:00', '2025-05-25 11:00:00'),

-- Employees
(5, 'employee', 'https://example.com/profiles/emp1.jpg', 'Robert Wilson', 'robw', 'rob.w@cleanride.com', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '+1234509876', '101 First St, Anytown', '2025-01-05 08:00:00', '2025-05-05 08:00:00'),
(6, 'employee', 'https://example.com/profiles/emp2.jpg', 'Jennifer Lee', 'jennl', 'jenn.l@cleanride.com', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '+1987612345', '202 Second Ave, Somewhere', '2025-01-10 09:00:00', '2025-05-10 09:00:00'),
(7, 'employee', 'https://example.com/profiles/emp3.jpg', 'David Kim', 'davidk', 'david.k@elitedetailing.com', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '+1122378901', '303 Third Rd, Anycity', '2025-01-20 10:00:00', '2025-05-20 10:00:00'),
(8, 'employee', 'https://example.com/profiles/emp4.jpg', 'Lisa Chen', 'lisac', 'lisa.c@elitedetailing.com', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '+1567123456', '404 Fourth Blvd, Yourtown', '2025-01-25 11:00:00', '2025-05-25 11:00:00');

-- Seed employee table
INSERT INTO `employee` (`user_id`, `company_id`, `role`, `created_at`, `updated_at`) VALUES
(5, 1, 'manager', '2025-01-05 08:00:00', '2025-05-05 08:00:00'),
(6, 1, 'employee', '2025-01-10 09:00:00', '2025-05-10 09:00:00'),
(7, 2, 'super-admin', '2025-01-20 10:00:00', '2025-05-20 10:00:00'),
(8, 2, 'employee', '2025-01-25 11:00:00', '2025-05-25 11:00:00');

-- Seed customercar table
INSERT INTO `customercar` (`customer_car_id`, `model`, `car_plate_number`, `customer_id`) VALUES
(1, 'Toyota Camry', 'ABC123', 1),
(2, 'Honda Accord', 'XYZ789', 1),
(3, 'Ford Mustang', 'DEF456', 2),
(4, 'BMW 3 Series', 'GHI789', 3),
(5, 'Tesla Model 3', 'JKL012', 4);

-- Seed companydocuments table
INSERT INTO `companydocuments` (`document_id`, `company_id`, `document_type`, `document_url`, `upload_date`) VALUES
(1, 1, 'Business License', 'https://example.com/docs/cleanride-license.pdf', '2025-01-02 09:00:00'),
(2, 1, 'Insurance Certificate', 'https://example.com/docs/cleanride-insurance.pdf', '2025-01-02 10:00:00'),
(3, 2, 'Business License', 'https://example.com/docs/elite-license.pdf', '2025-01-16 09:00:00'),
(4, 2, 'Insurance Certificate', 'https://example.com/docs/elite-insurance.pdf', '2025-01-16 10:00:00');

-- Seed washtypes table
INSERT INTO `washtypes` (`type_id`, `company_id`, `name`, `price`, `description`) VALUES
(1, 1, 'Basic Wash', 1500, 'Exterior wash and dry'),
(2, 1, 'Premium Wash', 2500, 'Exterior wash, dry, and tire shine'),
(3, 1, 'Interior Detailing', 3500, 'Complete interior cleaning'),
(4, 1, 'Full Service', 5000, 'Complete interior and exterior detailing'),
(5, 2, 'Luxury Wash', 3000, 'Premium exterior cleaning'),
(6, 2, 'Executive Detail', 6000, 'Full interior and exterior premium service'),
(7, 3, 'Express Wash', 1000, 'Quick exterior wash'),
(8, 3, 'Deluxe Wash', 2000, 'Exterior wash with wax');

-- Seed cars table
INSERT INTO `cars` (`car_id`, `sale_or_rental`, `company_id`, `model`, `year`, `price`, `exhibition_id`, `carbrand_id`, `description`) VALUES
-- For sale
(1, 'sale', 1, 'Camry', 2023, 25000.00, 1, 1, 'Like new with low mileage'),
(2, 'sale', 1, 'Accord', 2022, 22000.00, 1, 2, 'Excellent condition'),
(3, 'sale', 2, 'Mustang', 2024, 35000.00, 3, 3, 'Brand new model'),
(4, 'sale', 2, '3 Series', 2023, 42000.00, 4, 4, 'Luxury sedan'),

-- For rent
(5, 'rent', 1, 'Corolla', 2023, 50.00, 2, 1, 'Daily rental'),
(6, 'rent', 1, 'Civic', 2022, 45.00, 2, 2, 'Economy rental'),
(7, 'rent', 2, 'Model 3', 2024, 80.00, 3, 7, 'Electric vehicle rental'),
(8, 'rent', 2, 'A4', 2023, 70.00, 4, 6, 'Premium rental');

-- Seed rentalcarsimages table
INSERT INTO `rentalcarsimages` (`image_id`, `image_url`, `car_id`) VALUES
(1, 'https://example.com/cars/camry1.jpg', 1),
(2, 'https://example.com/cars/camry2.jpg', 1),
(3, 'https://example.com/cars/accord1.jpg', 2),
(4, 'https://example.com/cars/accord2.jpg', 2),
(5, 'https://example.com/cars/mustang1.jpg', 3),
(6, 'https://example.com/cars/mustang2.jpg', 3),
(7, 'https://example.com/cars/bmw1.jpg', 4),
(8, 'https://example.com/cars/bmw2.jpg', 4),
(9, 'https://example.com/cars/corolla1.jpg', 5),
(10, 'https://example.com/cars/corolla2.jpg', 5),
(11, 'https://example.com/cars/civic1.jpg', 6),
(12, 'https://example.com/cars/civic2.jpg', 6),
(13, 'https://example.com/cars/tesla1.jpg', 7),
(14, 'https://example.com/cars/tesla2.jpg', 7),
(15, 'https://example.com/cars/audi1.jpg', 8),
(16, 'https://example.com/cars/audi2.jpg', 8);

-- Seed products table
INSERT INTO `products` (`product_id`, `company_id`, `product_name`, `description`, `price`, `stock`, `created_at`, `updated_at`) VALUES
(1, 1, 'Premium Car Shampoo', 'Gentle on paint, removes tough dirt', 15.99, 100, '2025-01-02 09:00:00', '2025-05-02 09:00:00'),
(2, 1, 'Microfiber Towel', 'Super absorbent, scratch-free', 8.99, 200, '2025-01-03 10:00:00', '2025-05-03 10:00:00'),
(3, 1, 'Tire Shine', 'Gives tires a glossy finish', 12.99, 150, '2025-01-04 11:00:00', '2025-05-04 11:00:00'),
(4, 2, 'Leather Conditioner', 'Restores and protects leather', 19.99, 80, '2025-01-17 09:00:00', '2025-05-17 09:00:00'),
(5, 2, 'Glass Cleaner', 'Streak-free shine for windows', 9.99, 120, '2025-01-18 10:00:00', '2025-05-18 10:00:00'),
(6, 3, 'Quick Detailer', 'Spray wax and shine', 14.99, 90, '2025-02-02 11:00:00', '2025-05-22 11:00:00'),
(7, 3, 'Wheel Cleaner', 'Removes brake dust and grime', 11.99, 110, '2025-02-03 12:00:00', '2025-05-23 12:00:00'),
(8, 4, 'Ceramic Coating', 'Professional-grade paint protection', 49.99, 50, '2025-02-16 13:00:00', '2025-05-26 13:00:00');

-- Seed productsimages table
INSERT INTO `productsimages` (`image_id`, `image_url`, `product_id`) VALUES
(1, 'https://example.com/products/shampoo1.jpg', 1),
(2, 'https://example.com/products/shampoo2.jpg', 1),
(3, 'https://example.com/products/towel1.jpg', 2),
(4, 'https://example.com/products/towel2.jpg', 2),
(5, 'https://example.com/products/tireshine1.jpg', 3),
(6, 'https://example.com/products/tireshine2.jpg', 3),
(7, 'https://example.com/products/leather1.jpg', 4),
(8, 'https://example.com/products/leather2.jpg', 4);

-- Seed subcatproduct table
INSERT INTO `subcatproduct` (`id`, `product_id`, `sub_category_id`) VALUES
(1, 1, 1),
(2, 2, 3),
(3, 3, 7),
(4, 4, 5),
(5, 5, 1),
(6, 6, 2),
(7, 7, 7),
(8, 8, 2);

-- Seed paymentmethod table
INSERT INTO `paymentmethod` (`payment_id`, `name`, `public_key`, `secret_key`) VALUES
(1, 'Credit Card', 'pk_test_123456', 'sk_test_123456'),
(2, 'PayPal', 'pk_test_789012', 'sk_test_789012'),
(3, 'Stripe', 'pk_test_345678', 'sk_test_345678'),
(4, 'Apple Pay', 'pk_test_901234', 'sk_test_901234');

-- Seed cart table (orders)
INSERT INTO `cart` (`order_id`, `user_id`, `status`, `created_at`, `updated_at`) VALUES
-- Completed orders
(1, 1, 'complete', '2025-04-01 10:00:00', '2025-04-01 11:30:00'),
(2, 2, 'complete', '2025-04-05 14:00:00', '2025-04-05 15:45:00'),
(3, 3, 'complete', '2025-04-10 09:00:00', '2025-04-10 10:15:00'),
-- Pending orders
(4, 1, 'pending', '2025-05-01 13:00:00', '2025-05-01 13:00:00'),
(5, 2, 'pending', '2025-05-05 16:00:00', '2025-05-05 16:00:00'),
-- Cart (not submitted)
(6, 3, 'cart', '2025-05-10 11:00:00', '2025-05-10 11:00:00'),
(7, 4, 'cart', '2025-05-15 15:00:00', '2025-05-15 15:00:00');

-- Seed order table (payments)
INSERT INTO `order` (`id`, `cart_order_id`, `payment_method_id`, `payment_gateway_response`, `shipping_address`, `company_id`, `user_id`) VALUES
(1, 1, 1, '{"status":"success","transaction_id":"ch_123456"}', '123 Maple St, Anytown', NULL, 1),
(2, 2, 2, '{"status":"success","transaction_id":"pay_789012"}', '456 Oak Ave, Somewhere', NULL, 2),
(3, 3, 3, '{"status":"success","transaction_id":"pi_345678"}', '789 Pine Rd, Anycity', NULL, 3);

-- Seed orderitems table (products in orders)
INSERT INTO `orderitems` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 15.99),
(2, 1, 3, 1, 12.99),
(3, 2, 4, 1, 19.99),
(4, 2, 5, 2, 9.99),
(5, 3, 6, 1, 14.99),
(6, 3, 7, 1, 11.99);

-- Seed orderstatushistory table
INSERT INTO `orderstatushistory` (`status_history_id`, `order_id`, `status`, `timestamp`) VALUES
(1, 1, 'pending', '2025-04-01 10:00:00'),
(2, 1, 'complete', '2025-04-01 11:30:00'),
(3, 2, 'pending', '2025-04-05 14:00:00'),
(4, 2, 'complete', '2025-04-05 15:45:00'),
(5, 3, 'pending', '2025-04-10 09:00:00'),
(6, 3, 'complete', '2025-04-10 10:15:00');

-- Seed carorders table (car purchases)
INSERT INTO `carorders` (`car_order_id`, `car_id`, `orders_order_id`) VALUES
(1, 1, 1),
(2, 3, 2),
(3, 4, 3);

-- Seed rentalorders table
INSERT INTO `rentalorders` (`rental_order_id`, `order_id`, `car_id`, `start_date`, `end_date`) VALUES
(1, 4, 5, '2025-05-10 09:00:00', '2025-05-15 17:00:00'),
(2, 5, 7, '2025-05-20 10:00:00', '2025-05-25 18:00:00');

-- Seed carwashorders table
INSERT INTO `carwashorders` (`wash_order_id`, `order_id`, `within_company`, `location`, `customer_id`, `company_id`) VALUES
(1, 6, 1, 'CleanRide Autocare - Downtown Showroom', 3, 1),
(2, 7, 0, '456 Oak Ave, Somewhere (Mobile service)', 4, 2);

-- Seed washorders_washtypes table
INSERT INTO `washorders_washtypes` (`carwashorders_order_id`, `WashTypes_type_id`, `paid_price`) VALUES
(1, 1, 1500),
(2, 5, 3000);

-- Seed washorderoperation table
INSERT INTO `washorderoperation` (`wash_order_id`, `employee_assigned_id`, `operation_start_at`, `operation_done_at`, `company_id`) VALUES
(1, 6, '2025-05-10 09:30:00', '2025-05-10 11:00:00', 1),
(2, 8, '2025-05-15 14:00:00', NULL, 2);

-- Seed ratings table
INSERT INTO `ratings` (`company_id`, `user_id`, `rating_value`, `review_text`, `created_at`) VALUES
(1, 1, 4.5, 'Great service! My car looks brand new.', '2025-04-02 12:00:00'),
(1, 2, 5.0, 'Excellent work, very professional.', '2025-04-06 16:00:00'),
(2, 3, 4.0, 'Good service but a bit expensive.', '2025-04-11 11:00:00'),
(2, 4, 5.0, 'Perfect detailing, worth every penny!', '2025-05-16 16:00:00');

-- Seed verification_codes table
INSERT INTO `verification_codes` (`id`, `email`, `code`, `type`, `verified`, `reset_token`, `token_used`, `attempt_count`, `expires_at`, `account_type`, `createdAt`, `updatedAt`) VALUES
(1, 'john.smith@example.com', '123456', 'email_verification', 1, NULL, 0, 0, '2025-06-01 10:00:00', 'user', '2025-05-01 10:00:00', '2025-05-01 10:00:00'),
(2, 'sarah.j@example.com', '654321', 'password_reset', 0, 'token123', 0, 1, '2025-06-02 11:00:00', 'user', '2025-05-02 11:00:00', '2025-05-02 11:00:00');