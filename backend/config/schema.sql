-- Order Orbit Database Schema

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  rating DECIMAL(2,1) DEFAULT 0,
  delivery_time VARCHAR(50),
  min_order DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  restaurant_id INT REFERENCES restaurants(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  delivery_address TEXT,
  payment_method VARCHAR(50) DEFAULT 'card',
  payment_status VARCHAR(50) DEFAULT 'paid',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INT REFERENCES menu_items(id),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  item_name VARCHAR(150)
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  restaurant_id INT REFERENCES restaurants(id),
  order_id INT REFERENCES orders(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed restaurants
INSERT INTO restaurants (name, description, image_url, category, rating, delivery_time, min_order) VALUES
('Burger Planet', 'Best burgers in town with fresh ingredients', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 'Burgers', 4.5, '20-30 min', 5.00),
('Pizza Galaxy', 'Authentic Italian pizzas baked in wood-fired oven', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 'Pizza', 4.3, '25-35 min', 8.00),
('Sushi Orbit', 'Fresh sushi and Japanese cuisine', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', 'Japanese', 4.7, '30-45 min', 12.00),
('Taco Universe', 'Authentic Mexican street food', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400', 'Mexican', 4.2, '15-25 min', 6.00),
('Curry Cosmos', 'Rich and flavorful Indian curries', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', 'Indian', 4.6, '35-45 min', 10.00);

-- Seed menu items for Burger Planet
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
(1, 'Classic Cheeseburger', 'Beef patty with cheddar, lettuce, tomato', 8.99, 'Burgers'),
(1, 'BBQ Bacon Burger', 'Double patty with bacon and BBQ sauce', 12.99, 'Burgers'),
(1, 'Veggie Burger', 'Plant-based patty with fresh veggies', 9.99, 'Burgers'),
(1, 'Fries', 'Crispy golden fries', 3.99, 'Sides'),
(1, 'Milkshake', 'Thick creamy milkshake - chocolate or vanilla', 4.99, 'Drinks');

-- Seed menu items for Pizza Galaxy
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
(2, 'Margherita', 'Classic tomato, mozzarella, basil', 10.99, 'Pizza'),
(2, 'Pepperoni', 'Loaded with pepperoni and cheese', 13.99, 'Pizza'),
(2, 'BBQ Chicken', 'Grilled chicken with BBQ sauce', 14.99, 'Pizza'),
(2, 'Garlic Bread', 'Toasted garlic bread with herbs', 4.99, 'Sides'),
(2, 'Tiramisu', 'Classic Italian dessert', 5.99, 'Desserts');

-- Seed menu items for Sushi Orbit
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
(3, 'Salmon Nigiri (6pcs)', 'Fresh Atlantic salmon on rice', 14.99, 'Nigiri'),
(3, 'Dragon Roll', 'Shrimp tempura, avocado, cucumber', 16.99, 'Rolls'),
(3, 'Tuna Sashimi', 'Premium tuna slices', 18.99, 'Sashimi'),
(3, 'Miso Soup', 'Traditional Japanese soup', 3.99, 'Sides'),
(3, 'Edamame', 'Steamed salted soybeans', 4.99, 'Sides');

-- Seed menu items for Taco Universe
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
(4, 'Street Tacos (3pcs)', 'Corn tortillas with carne asada', 9.99, 'Tacos'),
(4, 'Burrito Bowl', 'Rice, beans, grilled chicken, salsa', 11.99, 'Bowls'),
(4, 'Nachos', 'Tortilla chips with cheese and jalapenos', 8.99, 'Snacks'),
(4, 'Guacamole & Chips', 'Fresh house-made guacamole', 5.99, 'Snacks'),
(4, 'Horchata', 'Sweet rice milk drink', 3.99, 'Drinks');

-- Seed menu items for Curry Cosmos
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
(5, 'Butter Chicken', 'Tender chicken in creamy tomato sauce', 13.99, 'Curries'),
(5, 'Lamb Biryani', 'Fragrant basmati rice with spiced lamb', 15.99, 'Rice'),
(5, 'Paneer Tikka Masala', 'Grilled paneer in spiced tomato gravy', 12.99, 'Curries'),
(5, 'Garlic Naan (2pcs)', 'Freshly baked flatbread', 3.99, 'Bread'),
(5, 'Mango Lassi', 'Yogurt-based mango drink', 4.99, 'Drinks');

-- Index for performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
