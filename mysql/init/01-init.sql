-- ConvoPilot Database Initialization Script

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `convopilot` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create the user if it doesn't exist
CREATE USER IF NOT EXISTS 'convopilot_user'@'%' IDENTIFIED BY 'convopilot_pass';

-- Grant all privileges on the convopilot database to the user
GRANT ALL PRIVILEGES ON `convopilot`.* TO 'convopilot_user'@'%';

-- Grant privileges for running tests (optional)
GRANT ALL PRIVILEGES ON `convopilot_test`.* TO 'convopilot_user'@'%';

-- Flush privileges to ensure they take effect
FLUSH PRIVILEGES;

-- Use the convopilot database
USE `convopilot`;

-- Create a simple health check table
CREATE TABLE IF NOT EXISTS `health_check` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `status` VARCHAR(50) NOT NULL DEFAULT 'ok',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial health check record
INSERT INTO `health_check` (`status`) VALUES ('database_initialized');

-- Display confirmation
SELECT 'ConvoPilot database initialized successfully!' AS message; 