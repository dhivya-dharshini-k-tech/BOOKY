package com.sece.bookmyroom.controller;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sece.bookmyroom.dto.BookingRequest;
import com.sece.bookmyroom.entity.Booking;
import com.sece.bookmyroom.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @GetMapping
    public List<Booking> findAll() {
        return service.findAll();
    }

    @GetMapping("/guest/{guestId}")
    public List<Booking> findByGuest(@PathVariable Long guestId) {
        return service.findByGuest(guestId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking create(@Valid @RequestBody BookingRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        return service.cancel(id);
    }

    // Check bookings between two dates
    @GetMapping("/availability")
    public List<Booking> checkAvailability(
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut) {

        return service.findBookingsBetweenDates(checkIn, checkOut);
    }
}