package com.sece.bookmyroom.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sece.bookmyroom.entity.Room;
import com.sece.bookmyroom.exception.BusinessRuleException;
import com.sece.bookmyroom.exception.ResourceNotFoundException;
import com.sece.bookmyroom.repository.BookingRepository;
import com.sece.bookmyroom.repository.RoomRepository;

@Service
@Transactional
public class RoomService {

    private final RoomRepository rooms;
    private final BookingRepository bookings;

    public RoomService(
            RoomRepository rooms,
            BookingRepository bookings) {

        this.rooms = rooms;
        this.bookings = bookings;
    }

    // Get all rooms
    @Transactional(readOnly = true)
    public List<Room> findAll() {
        return rooms.findAll();
    }

    // Create room
    public Room create(Room room) {
        return rooms.save(room);
    }

    // Update room
    public Room update(Long id, Room changes) {

        Room room = rooms.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found: " + id));

        room.setRoomNumber(changes.getRoomNumber());
        room.setRoomType(changes.getRoomType());
        room.setPricePerNight(changes.getPricePerNight());
        room.setCapacity(changes.getCapacity());
        room.setAvailable(changes.isAvailable());

        return rooms.save(room);
    }

    // Delete room
    public void delete(Long id) {

        if (!rooms.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Room not found: " + id);
        }

        rooms.deleteById(id);
    }

    // Find available rooms for selected dates
    @Transactional(readOnly = true)
    public List<Room> findAvailableRooms(
            LocalDate checkIn,
            LocalDate checkOut) {

        // Validate dates
        if (!checkOut.isAfter(checkIn)) {
            throw new BusinessRuleException(
                    "Check-out date must be after check-in date");
        }

        // Get all rooms
        List<Room> allRooms = rooms.findAll();

        // Keep only rooms that are marked available
        // and don't have overlapping bookings
        return allRooms.stream()
                .filter(Room::isAvailable)
                .filter(room ->
                        !bookings.hasOverlappingBooking(
                                room.getId(),
                                com.sece.bookmyroom.entity.BookingStatus.CANCELLED,
                                checkIn,
                                checkOut))
                .collect(Collectors.toList());
    }
}