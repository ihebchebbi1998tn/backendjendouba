
-- Create database if not exists with proper character set
CREATE DATABASE IF NOT EXISTS myapp_database1 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
USE myapp_database1;

-- Users Table (updated with fixed schema)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'provider') NOT NULL DEFAULT 'user',
    isRead BOOLEAN DEFAULT FALSE,  -- Changed from `read` to isRead
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert sample users (password: 123123)
-- The password hash below is for "123123" using bcrypt
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'admin'),
('Regular User', 'user@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'user'),
('John Doe', 'john@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'user'),
('Jane Smith', 'jane@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', 'user');

-- Places Table (updated schema)
CREATE TABLE IF NOT EXISTS places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    location JSON COMMENT 'JSON object with latitude and longitude',
    images JSON COMMENT 'JSON array of image URLs',
    openingHours JSON COMMENT 'JSON object with opening hours by day',
    entranceFee JSON COMMENT 'JSON object with different entrance fees',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name(191)),
    INDEX idx_type (type)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Events Table (updated schema)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    location VARCHAR(255),
    organizer VARCHAR(255),
    ticketPrice DECIMAL(10,2),
    capacity INT,
    images JSON COMMENT 'JSON array of image URLs',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_startDate (startDate),
    INDEX idx_endDate (endDate),
    INDEX idx_location (location(191))
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sessions Table (new)
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId1 INT NOT NULL,
    userId2 INT NOT NULL,
    lastMessageAt TIMESTAMP NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (userId2) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user1 (userId1),
    INDEX idx_user2 (userId2),
    INDEX idx_last_message (lastMessageAt)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Messages Table (updated with foreign key)
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessionId INT NOT NULL,
    senderId INT NOT NULL,
    content TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,  -- Changed from `read` to isRead
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE,
    INDEX idx_sessionId (sessionId),
    INDEX idx_senderId (senderId)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    placeId INT NOT NULL,
    rating DECIMAL(3,2) NOT NULL COMMENT 'Rating from 0 to 5',
    comment TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (placeId) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_place_id (placeId),
    INDEX idx_user_id (userId)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Updated Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    eventId INT,
    placeId INT,
    numberOfTickets INT,
    numberOfPersons INT,
    totalPrice DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    paymentMethod VARCHAR(50),
    paymentId VARCHAR(100),
    visitDate DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (placeId) REFERENCES places(id) ON DELETE SET NULL,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE SET NULL,
    INDEX idx_user_id (userId),
    INDEX idx_place_id (placeId),
    INDEX idx_event_id (eventId),
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
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
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
    FOREIGN KEY (id_expediteur) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_destinataire) REFERENCES users(id) ON DELETE CASCADE,
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
        WHERE placeId = NEW.placeId
    ) WHERE id = NEW.placeId;
END;

CREATE TRIGGER update_place_rating_update AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE places SET average_rating = (
        SELECT AVG(rating) FROM reviews 
        WHERE placeId = NEW.placeId
    ) WHERE id = NEW.placeId;
END;

CREATE TRIGGER update_place_rating_delete AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE places SET average_rating = (
        SELECT AVG(rating) FROM reviews 
        WHERE placeId = OLD.placeId
    ) WHERE id = OLD.placeId;
END;

-- Trigger to update lastMessageAt in session when a new message is created
-- Removed DELIMITER statements which are not supported in Node.js mysql2 execution
CREATE TRIGGER update_session_last_message AFTER INSERT ON messages
FOR EACH ROW
BEGIN
    UPDATE sessions 
    SET lastMessageAt = NEW.createdAt
    WHERE id = NEW.sessionId;
END;