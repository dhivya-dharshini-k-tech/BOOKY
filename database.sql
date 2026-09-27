CREATE DATABASE IF NOT EXISTS bookmyroom;
USE bookmyroom;

CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(255) NOT NULL UNIQUE,
    room_type VARCHAR(255) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS guests (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    guest_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES rooms(id),
    CONSTRAINT fk_booking_guest FOREIGN KEY (guest_id) REFERENCES guests(id)
);