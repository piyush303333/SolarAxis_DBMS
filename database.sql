-- SolarAxis Final Database Schema
-- Created by: Piyush Gokhe (Roll No: 1)

CREATE DATABASE IF NOT EXISTS solar_db;
USE solar_db;

-- 1. Users / Customers Table
-- Isme platform ke saare users ka data rahega
CREATE TABLE users (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    connection_type ENUM('Residential', 'Commercial') DEFAULT 'Residential',
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Solar Panels Table
-- Ek customer ke paas multiple panels ho sakte hain
CREATE TABLE panels (
    panel_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    type VARCHAR(50), -- Monocrystalline / Polycrystalline
    capacity_kw DECIMAL(5,2),
    installation_date DATE,
    status ENUM('Active', 'Maintenance', 'Faulty') DEFAULT 'Active',
    efficiency_pct DECIMAL(5,2),
    FOREIGN KEY (customer_id) REFERENCES users(customer_id) ON DELETE CASCADE
);

-- 3. Energy Production Table
-- Rozana kitni units generate hui (Relational with Panels)
CREATE TABLE production (
    production_id INT PRIMARY KEY AUTO_INCREMENT,
    panel_id INT,
    production_date DATE,
    units_generated_kwh DECIMAL(10,2),
    FOREIGN KEY (panel_id) REFERENCES panels(panel_id) ON DELETE CASCADE
);

-- 4. Billing Table
-- Customer ke monthly bills (Relational with Users)
CREATE TABLE billing (
    bill_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    units_consumed DECIMAL(10,2),
    amount DECIMAL(10,2),
    bill_date DATE,
    status ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
    FOREIGN KEY (customer_id) REFERENCES users(customer_id) ON DELETE CASCADE
);

-- 5. Maintenance Table
-- Panel ki servicing aur problems ka record
CREATE TABLE maintenance (
    maintenance_id INT PRIMARY KEY AUTO_INCREMENT,
    panel_id INT,
    issue TEXT,
    maintenance_date DATE,
    technician_name VARCHAR(100),
    cost DECIMAL(10,2),
    status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
    FOREIGN KEY (panel_id) REFERENCES panels(panel_id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- ADMIN ACCOUNT SETUP
-- Default Login: admin@solar.com | Password: admin123
-- --------------------------------------------------------
INSERT INTO users (name, email, password, role) VALUES 
('Piyush Admin', 'admin@solar.com', 'scrypt:32768:8:1$v3K2p8DqY9$3f9660c182283a009477b668d2f00439b1a7d6e66f363c46e01a1d35a5a60e0d', 'admin');

-- --------------------------------------------------------
-- SAMPLE DATA (Test karne ke liye)
-- --------------------------------------------------------
-- Note: Isse dashboard par kuch data dikhne lagega
-- Pehle ek user signup karega tabhi ye data kaam karega (Foreign Keys ki wajah se)