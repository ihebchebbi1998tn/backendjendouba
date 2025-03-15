
-- Create database if not exists with proper character set
CREATE DATABASE IF NOT EXISTS myapp_database1 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
USE myapp_database1;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL COMMENT 'Store hashed password ',
    role ENUM('admin', 'user', 'provider') NOT NULL DEFAULT 'user',
    status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
    profile_image VARCHAR(255),
    phone VARCHAR(20),
    oauth_id VARCHAR(255),
    oauth_provider VARCHAR(50),
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

-- Messagerie Table (New)
CREATE TABLE IF NOT EXISTS messagerie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_expediteur INT NOT NULL,
    id_destinataire INT NOT NULL,
    texte TEXT NOT NULL,
    date_envoye TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_expediteur) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (id_destinataire) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_expediteur (id_expediteur),
    INDEX idx_destinataire (id_destinataire),
    INDEX idx_conversation (id_expediteur, id_destinataire)
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

-- Insert sample users (password: 123123)
-- The password hash below is for "123123" using bcrypt
INSERT INTO users (nom, prenom, email, password_hash, role, status) VALUES
('Admin', 'User', 'admin@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'admin', 'active'),
('Regular', 'User', 'user@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'user', 'active'),
('Hotel', 'Owner', 'hotel@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'provider', 'active'),
('Restaurant', 'Manager', 'restaurant@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'provider', 'active'),
('Premium', 'Member', 'premium@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'premium', 'active'),
('John', 'Doe', 'john@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'user', 'active'),
('Jane', 'Smith', 'jane@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'user', 'active'),
('Sarah', 'Connor', 'sarah@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'premium', 'active'),
('Tunisian', 'Guide', 'guide@jendouba.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'provider', 'active'),
('Local', 'Explorer', 'explorer@jendouba.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'premium', 'active');

-- Insert sample places
INSERT INTO places (nom_place, description, location, longitude, latitude, category, provider_id, url_img) VALUES
('Louvre Museum', 'World-famous art museum in Paris', 'Rue de Rivoli, 75001 Paris, France', 2.3376, 48.8606, 'museums', 1, 'https://images.unsplash.com/photo-1544113151-22f92a5ac50c'),
('Ritz Hotel', 'Luxury hotel in the heart of Paris', '15 Place Vendôme, 75001 Paris, France', 2.3276, 48.8679, 'hotels', 3, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
('Le Meurice Restaurant', 'Fine dining restaurant with Michelin stars', '228 Rue de Rivoli, 75001 Paris, France', 2.3289, 48.8651, 'restaurants', 4, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'),
('Eiffel Tower', 'Iconic iron tower with observation decks', 'Champ de Mars, 75007 Paris, France', 2.2945, 48.8584, 'attractions', 1, 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e'),
('Arc de Triomphe', 'Historic monument at the center of Place Charles de Gaulle', 'Place Charles de Gaulle, 75008 Paris, France', 2.2950, 48.8738, 'historical', 1, 'https://images.unsplash.com/photo-1597666619076-719209963fd3'),
-- Adding Jendouba, Tunisia famous places
('Bulla Regia', 'Ancient Roman city with unique underground villas and well-preserved mosaics', 'Jendouba Governorate, Tunisia', 8.7550, 36.5594, 'historical', 9, 'https://images.unsplash.com/photo-1555774898-8425b77ee4e8'),
('Chemtou', 'Ancient Roman site renowned for its yellow marble quarries and archaeological remains', 'Chemtou, Jendouba Governorate, Tunisia', 8.5700, 36.4900, 'historical', 9, 'https://images.unsplash.com/photo-1553152531-b98a2fc8d3bf'),
('Ain Draham', 'Picturesque mountain town surrounded by cork oak forests famous for its cooler climate', 'Ain Draham, Jendouba Governorate, Tunisia', 8.6870, 36.7800, 'attractions', 9, 'https://images.unsplash.com/photo-1520862594179-ee7003eecc6d'),
('Tabarka', 'Coastal city known for its Genoese Fort, coral reefs, and annual jazz festival', 'Tabarka, Jendouba Governorate, Tunisia', 8.7577, 36.9547, 'attractions', 9, 'https://images.unsplash.com/photo-1596394723269-b2cbca4e6463'),
('Feija National Park', 'Protected nature reserve home to diverse flora and fauna including the endangered Barbary deer', 'Ain Draham, Jendouba Governorate, Tunisia', 8.5138, 36.4932, 'attractions', 9, 'https://images.unsplash.com/photo-1553530979-fbb9e4aee36f'),
('Cap Negro', 'Beautiful coastal area with stunning cliffs and pristine beaches', 'Tabarka, Jendouba Governorate, Tunisia', 8.7400, 37.0200, 'attractions', 10, 'https://images.unsplash.com/photo-1560180474-e8563fd75bab'),
('Hammam Bourguiba', 'Thermal spa town known for its therapeutic hot springs', 'Hammam Bourguiba, Jendouba, Tunisia', 8.5830, 36.4130, 'hotels', 3, 'https://images.unsplash.com/photo-1590593162201-f67611a18b87'),
('Dar Fatma', 'Elegant mountain lodge offering panoramic views of the surrounding forests', 'Ain Draham, Jendouba Governorate, Tunisia', 8.6820, 36.7750, 'hotels', 3, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'),
('El Khemir Archaeological Site', 'Ancient Numidian-Punic-Roman site with well-preserved ruins', 'El Kef, near Jendouba, Tunisia', 8.6120, 36.4000, 'museums', 9, 'https://images.unsplash.com/photo-1554322662-67253285087b'),
('La Cigale Tabarka', 'Luxury resort with golf course and private beach', 'Tabarka, Jendouba Governorate, Tunisia', 8.7600, 36.9650, 'hotels', 3, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d');

-- Insert sample reviews
INSERT INTO reviews (place_id, user_id, rating, comment, status) VALUES
(1, 2, 4.5, 'Amazing collection of art. Must visit!', 'approved'),
(1, 5, 5.0, 'One of the best museums in the world', 'approved'),
(2, 2, 4.0, 'Luxurious stay with excellent service', 'approved'),
(3, 5, 4.8, 'Exceptional dining experience', 'approved'),
(4, 2, 4.2, 'Iconic landmark but crowded', 'approved'),
(5, 5, 4.7, 'Beautiful monument with historical significance', 'approved'),
-- Adding reviews for Jendouba places
(6, 10, 4.8, 'Incredible Roman ruins with unique underground villas. A hidden gem in Tunisia!', 'approved'),
(6, 7, 4.5, 'Fascinating historical site, bring water and a hat as it gets hot', 'approved'),
(7, 8, 4.2, 'Amazing marble quarries and interesting historical context', 'approved'),
(8, 6, 4.9, 'Beautiful mountain town with refreshing climate. Perfect escape from summer heat', 'approved'),
(9, 5, 4.7, 'Stunning beaches and amazing coral reef diving spots', 'approved'),
(10, 2, 4.6, 'Peaceful nature reserve with beautiful hiking trails', 'approved'),
(11, 8, 4.8, 'Breathtaking coastal views, bring a camera!', 'approved'),
(12, 6, 4.3, 'The therapeutic waters really helped my joint pain', 'approved'),
(13, 7, 4.7, 'Exceptional mountain lodge with incredible hospitality', 'approved'),
(15, 5, 4.5, 'Luxury resort with excellent amenities and beautiful beach', 'approved');

-- Insert sample events
INSERT INTO events (title, description, place_id, start_date, end_date, price, status, created_by) VALUES
('Special Exhibition: Renaissance Masters', 'A curated exhibition of Renaissance paintings', 1, '2024-06-15 10:00:00', '2024-08-15 18:00:00', 25.00, 'upcoming', 1),
('Summer Jazz Night', 'Live jazz performance in the hotel lobby', 2, '2024-07-20 20:00:00', '2024-07-20 23:00:00', 15.00, 'upcoming', 3),
('Chef\'s Tasting Menu Experience', 'Special 7-course tasting menu with wine pairing', 3, '2024-06-30 19:00:00', '2024-06-30 22:00:00', 150.00, 'upcoming', 4),
('Night Tour of the Eiffel Tower', 'Experience the tower lit up at night with a guided tour', 4, '2024-07-10 21:00:00', '2024-07-10 23:00:00', 30.00, 'upcoming', 1),
-- Adding events for Jendouba locations
('Bulla Regia Archaeological Tour', 'Guided tour of the underground villas and ancient mosaics', 6, '2024-07-15 09:00:00', '2024-07-15 13:00:00', 20.00, 'upcoming', 9),
('Tabarka Jazz Festival', 'Annual international jazz festival featuring top artists', 9, '2024-08-01 18:00:00', '2024-08-05 23:00:00', 50.00, 'upcoming', 9),
('Ain Draham Hiking Expedition', 'Guided hiking tour through the cork oak forests', 8, '2024-07-25 08:00:00', '2024-07-25 16:00:00', 15.00, 'upcoming', 10),
('Wildlife Photography Workshop', 'Learn to photograph the native wildlife at Feija National Park', 10, '2024-08-10 07:00:00', '2024-08-10 18:00:00', 35.00, 'upcoming', 10);

-- Insert sample reservations
INSERT INTO reservations (user_id, place_id, event_id, reservation_date, start_time, num_guests, status) VALUES
(2, 1, 1, '2024-06-17', '14:00:00', 2, 'confirmed'),
(5, 2, 2, '2024-07-20', '20:00:00', 4, 'pending'),
(2, 3, 3, '2024-06-30', '19:30:00', 2, 'confirmed'),
(5, 4, 4, '2024-07-10', '21:00:00', 3, 'pending'),
-- Adding reservations for Jendouba events
(6, 6, 5, '2024-07-15', '09:00:00', 2, 'confirmed'),
(7, 9, 6, '2024-08-03', '18:00:00', 5, 'pending'),
(8, 8, 7, '2024-07-25', '08:00:00', 3, 'confirmed'),
(10, 10, 8, '2024-08-10', '07:00:00', 1, 'pending');

-- Insert sample promotions
INSERT INTO promotions (place_id, title, description, discount_percent, start_date, end_date, created_by) VALUES
(2, 'Summer Getaway Special', 'Book 3 nights and get 15% off your stay', 15.00, '2024-06-01', '2024-08-31', 3),
(3, 'Lunch Menu Discount', 'Get 10% off on all lunch menu items', 10.00, '2024-06-15', '2024-07-15', 4),
(4, 'Early Bird Tickets', 'Book your visit 2 weeks in advance and save 20%', 20.00, '2024-06-01', '2024-07-31', 1),
-- Adding promotions for Jendouba locations
(13, 'Mountain Retreat Discount', 'Book 4 nights and get 20% off your mountain lodge stay', 20.00, '2024-07-01', '2024-08-31', 3),
(15, 'Summer Beach Package', 'All-inclusive beach package with 15% discount', 15.00, '2024-06-15', '2024-09-15', 3),
(9, 'Jazz Festival Special', 'Book accommodation during the jazz festival and get 10% off', 10.00, '2024-07-20', '2024-08-10', 9);

-- Insert sample messages
INSERT INTO messagerie (id_expediteur, id_destinataire, texte, date_envoye, is_read) VALUES
(2, 5, 'Hello! How are you doing today?', '2024-05-10 14:30:00', TRUE),
(5, 2, 'I\'m doing great, thanks for asking! How about you?', '2024-05-10 14:35:00', TRUE),
(2, 5, 'I\'m doing well too. I wanted to ask about the museum visit.', '2024-05-10 14:40:00', TRUE),
(5, 2, 'Sure, what would you like to know?', '2024-05-10 14:45:00', TRUE),
(2, 5, 'What time do you think is best to avoid the crowds?', '2024-05-10 14:50:00', FALSE),
(3, 6, 'Welcome to our hotel! Let me know if you need any assistance.', '2024-05-10 10:15:00', TRUE),
(6, 3, 'Thank you! I might need help with airport transfers.', '2024-05-10 10:30:00', FALSE),
(7, 8, 'Hey, are you going to the jazz event next week?', '2024-05-11 09:20:00', TRUE),
(8, 7, 'Yes, I\'ve already booked tickets. Would you like to join?', '2024-05-11 09:45:00', TRUE),
(7, 8, 'That would be great! Let\'s coordinate offline.', '2024-05-11 10:00:00', FALSE),
-- Adding messages about Jendouba locations
(9, 10, 'Hello! I\'m organizing a tour to Bulla Regia next week. Would you be interested?', '2024-05-15 09:30:00', TRUE),
(10, 9, 'That sounds great! How much would it cost per person?', '2024-05-15 09:45:00', TRUE),
(9, 10, 'We\'re offering a special rate of 50 dinars per person, including transport and lunch.', '2024-05-15 10:00:00', TRUE),
(10, 9, 'Perfect! I\'ll join with 2 friends. Can you reserve spots for us?', '2024-05-15 10:15:00', FALSE),
(6, 9, 'I heard the Tabarka Jazz Festival is happening soon. Do you have any details?', '2024-05-20 14:00:00', TRUE),
(9, 6, 'Yes! It starts on August 1st. I can help you get tickets if you\'re interested.', '2024-05-20 14:30:00', FALSE);