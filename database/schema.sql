
-- Create database if not exists with proper character set
CREATE DATABASE IF NOT EXISTS myapp_database1 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
USE myapp_database1;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'Store hashed password ',
    role ENUM('admin', 'user', 'premium', 'provider') NOT NULL DEFAULT 'user',
    status ENUM('active', 'blocked', 'inactive') NOT NULL DEFAULT 'active',
    profile_image VARCHAR(512) COMMENT 'URL to profile image',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email(191)),
    INDEX idx_role (role)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Places Table
CREATE TABLE IF NOT EXISTS places (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    nom_place VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) COMMENT 'Human-readable address',
    longitude DECIMAL(9,6) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    url_img VARCHAR(512) COMMENT 'URL to image',
    url_web VARCHAR(512) COMMENT 'Website URL',
    category ENUM('museums', 'hotels', 'restaurants', 'historical', 'attractions') NOT NULL DEFAULT 'museums',
    provider_id INT COMMENT 'If place is managed by a provider',
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location(191)),
    INDEX idx_coordinates (latitude, longitude),
    INDEX idx_category (category),
    FOREIGN KEY (provider_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT NOT NULL,
    user_id INT NOT NULL,
    rating DECIMAL(3,2) NOT NULL COMMENT 'Rating from 0 to 5',
    comment TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_place_id (place_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    place_id INT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    image_url VARCHAR(512),
    price DECIMAL(10,2),
    status ENUM('upcoming', 'ongoing', 'past', 'cancelled') DEFAULT 'upcoming',
    created_by INT NOT NULL COMMENT 'Admin or provider who created',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_dates (start_date, end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    event_id INT,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    num_guests INT DEFAULT 1,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_place_id (place_id),
    INDEX idx_date (reservation_date),
    INDEX idx_status (status)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Promotions Table
CREATE TABLE IF NOT EXISTS promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percent DECIMAL(5,2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Individual triggers for rating update
CREATE TRIGGER update_place_rating_insert AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE places SET average_rating = (
        SELECT AVG(rating) FROM reviews 
        WHERE place_id = NEW.place_id AND status = 'approved'
    ) WHERE place_id = NEW.place_id;
END;

CREATE TRIGGER update_place_rating_update AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE places SET average_rating = (
        SELECT AVG(rating) FROM reviews 
        WHERE place_id = NEW.place_id AND status = 'approved'
    ) WHERE place_id = NEW.place_id;
END;

CREATE TRIGGER update_place_rating_delete AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE places SET average_rating = (
        SELECT AVG(rating) FROM reviews 
        WHERE place_id = OLD.place_id AND status = 'approved'
    ) WHERE place_id = OLD.place_id;
END;

-- Insert sample users
INSERT INTO users (nom, prenom, email, password_hash, role, status) VALUES
('Admin', 'User', 'admin@example.com', '$2a$10$JhisVN90AJ3NIVlTMmOyB.zQQWrIvlB5Cp9OQwLN4ov9AQJ3unX6C', 'admin', 'active'),
('Regular', 'User', 'user@example.com', '$2a$10$JhisVN90AJ3NIVlTMmOyB.zQQWrIvlB5Cp9OQwLN4ov9AQJ3unX6C', 'user', 'active'),
('Hotel', 'Owner', 'hotel@example.com', '$2a$10$JhisVN90AJ3NIVlTMmOyB.zQQWrIvlB5Cp9OQwLN4ov9AQJ3unX6C', 'provider', 'active'),
('Restaurant', 'Manager', 'restaurant@example.com', '$2a$10$JhisVN90AJ3NIVlTMmOyB.zQQWrIvlB5Cp9OQwLN4ov9AQJ3unX6C', 'provider', 'active'),
('Premium', 'Member', 'premium@example.com', '$2a$10$JhisVN90AJ3NIVlTMmOyB.zQQWrIvlB5Cp9OQwLN4ov9AQJ3unX6C', 'premium', 'active');

-- Insert sample places
INSERT INTO places (nom_place, description, location, longitude, latitude, category, provider_id, url_img) VALUES
('Louvre Museum', 'World-famous art museum in Paris', 'Rue de Rivoli, 75001 Paris, France', 2.3376, 48.8606, 'museums', 1, 'https://images.unsplash.com/photo-1544113151-22f92a5ac50c'),
('Ritz Hotel', 'Luxury hotel in the heart of Paris', '15 Place Vendôme, 75001 Paris, France', 2.3276, 48.8679, 'hotels', 3, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
('Le Meurice Restaurant', 'Fine dining restaurant with Michelin stars', '228 Rue de Rivoli, 75001 Paris, France', 2.3289, 48.8651, 'restaurants', 4, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'),
('Eiffel Tower', 'Iconic iron tower with observation decks', 'Champ de Mars, 75007 Paris, France', 2.2945, 48.8584, 'attractions', 1, 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e'),
('Arc de Triomphe', 'Historic monument at the center of Place Charles de Gaulle', 'Place Charles de Gaulle, 75008 Paris, France', 2.2950, 48.8738, 'historical', 1, 'https://images.unsplash.com/photo-1597666619076-719209963fd3');

-- Insert sample reviews
INSERT INTO reviews (place_id, user_id, rating, comment, status) VALUES
(1, 2, 4.5, 'Amazing collection of art. Must visit!', 'approved'),
(1, 5, 5.0, 'One of the best museums in the world', 'approved'),
(2, 2, 4.0, 'Luxurious stay with excellent service', 'approved'),
(3, 5, 4.8, 'Exceptional dining experience', 'approved'),
(4, 2, 4.2, 'Iconic landmark but crowded', 'approved'),
(5, 5, 4.7, 'Beautiful monument with historical significance', 'approved');

-- Insert sample events
INSERT INTO events (title, description, place_id, start_date, end_date, price, status, created_by) VALUES
('Special Exhibition: Renaissance Masters', 'A curated exhibition of Renaissance paintings', 1, '2024-06-15 10:00:00', '2024-08-15 18:00:00', 25.00, 'upcoming', 1),
('Summer Jazz Night', 'Live jazz performance in the hotel lobby', 2, '2024-07-20 20:00:00', '2024-07-20 23:00:00', 15.00, 'upcoming', 3),
('Chef\'s Tasting Menu Experience', 'Special 7-course tasting menu with wine pairing', 3, '2024-06-30 19:00:00', '2024-06-30 22:00:00', 150.00, 'upcoming', 4),
('Night Tour of the Eiffel Tower', 'Experience the tower lit up at night with a guided tour', 4, '2024-07-10 21:00:00', '2024-07-10 23:00:00', 30.00, 'upcoming', 1);

-- Insert sample reservations
INSERT INTO reservations (user_id, place_id, event_id, reservation_date, start_time, num_guests, status) VALUES
(2, 1, 1, '2024-06-17', '14:00:00', 2, 'confirmed'),
(5, 2, 2, '2024-07-20', '20:00:00', 4, 'pending'),
(2, 3, 3, '2024-06-30', '19:30:00', 2, 'confirmed'),
(5, 4, 4, '2024-07-10', '21:00:00', 3, 'pending');

-- Insert sample promotions
INSERT INTO promotions (place_id, title, description, discount_percent, start_date, end_date, created_by) VALUES
(2, 'Summer Getaway Special', 'Book 3 nights and get 15% off your stay', 15.00, '2024-06-01', '2024-08-31', 3),
(3, 'Lunch Menu Discount', 'Get 10% off on all lunch menu items', 10.00, '2024-06-15', '2024-07-15', 4),
(4, 'Early Bird Tickets', 'Book your visit 2 weeks in advance and save 20%', 20.00, '2024-06-01', '2024-07-31', 1);