package com.sece.bookmyroom.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sece.bookmyroom.dto.BookingRequest;
import com.sece.bookmyroom.entity.Booking;
import com.sece.bookmyroom.entity.BookingStatus;
import com.sece.bookmyroom.entity.Guest;
import com.sece.bookmyroom.entity.Room;
import com.sece.bookmyroom.exception.BusinessRuleException;
import com.sece.bookmyroom.exception.ResourceNotFoundException;
import com.sece.bookmyroom.repository.BookingRepository;
import com.sece.bookmyroom.repository.GuestRepository;
import com.sece.bookmyroom.repository.RoomRepository;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookings;
    private final RoomRepository rooms;
    private final GuestRepository guests;

    public BookingService(
            BookingRepository bookings,
            RoomRepository rooms,
            GuestRepository guests) {

        this.bookings = bookings;
        this.rooms = rooms;
        this.guests = guests;
    }

    // Get all bookings
    @Transactional(readOnly = true)
    public List<Booking> findAll() {
        return bookings.findAll();
    }

    // Get bookings by guest
    @Transactional(readOnly = true)
    public List<Booking> findByGuest(Long guestId) {

        if (!guests.existsById(guestId)) {
            throw new ResourceNotFoundException(
                    "Guest not found: " + guestId);
        }

        return bookings.findByGuestId(guestId);
    }

    // Create booking
    public Booking create(BookingRequest request) {

        LocalDate checkIn = request.checkInDate();
        LocalDate checkOut = request.checkOutDate();

        // Validate dates
        if (!checkOut.isAfter(checkIn)) {
            throw new BusinessRuleException(
                    "Check-out date must be after check-in date");
        }

        // Check-in cannot be in the past
        if (checkIn.isBefore(LocalDate.now())) {
            throw new BusinessRuleException(
                    "Check-in date cannot be in the past");
        }

        // Find room
        Room room = rooms.findById(request.roomId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found: " + request.roomId()));

        // Find guest
        Guest guest = guests.findById(request.guestId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Guest not found: " + request.guestId()));

        // Check room availability
        if (!room.isAvailable()) {
            throw new BusinessRuleException(
                    "Room is not available for booking");
        }

        // Prevent double booking
        if (bookings.hasOverlappingBooking(
                room.getId(),
                BookingStatus.CANCELLED,
                checkIn,
                checkOut)) {

            throw new BusinessRuleException(
                    "Room is already booked for the selected dates");
        }

        // Create booking
        Booking booking = new Booking();

        booking.setRoom(room);
        booking.setGuest(guest);
        booking.setCheckInDate(checkIn);
        booking.setCheckOutDate(checkOut);
        booking.setStatus(BookingStatus.CONFIRMED);

        // Calculate number of nights
        long numberOfNights =
                ChronoUnit.DAYS.between(checkIn, checkOut);

        // Calculate total price
        BigDecimal totalPrice =
                room.getPricePerNight()
                        .multiply(BigDecimal.valueOf(numberOfNights));

        booking.setTotalPrice(totalPrice);

        return bookings.save(booking);
    }

    // Cancel booking
    public Booking cancel(Long id) {

        Booking booking = bookings.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found: " + id));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BusinessRuleException(
                    "Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return bookings.save(booking);
    }

    // Check bookings between two dates
    @Transactional(readOnly = true)
    public List<Booking> findBookingsBetweenDates(
            LocalDate checkIn,
            LocalDate checkOut) {

        if (!checkOut.isAfter(checkIn)) {
            throw new BusinessRuleException(
                    "Check-out date must be after check-in date");
        }

        return bookings.findBookingsBetweenDates(
                checkIn,
                checkOut,
                BookingStatus.CANCELLED);
    }
}