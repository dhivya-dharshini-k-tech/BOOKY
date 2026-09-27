package com.sece.bookmyroom.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sece.bookmyroom.entity.Room;
import com.sece.bookmyroom.service.RoomService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    // Get all rooms
    @GetMapping
    public List<Room> findAll() {
        return service.findAll();
    }

    // Get available rooms for selected dates
    @GetMapping("/available")
    public List<Room> findAvailableRooms(
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut) {

        return service.findAvailableRooms(checkIn, checkOut);
    }

    // Create room
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Room create(@Valid @RequestBody Room room) {
        return service.create(room);
    }

    // Update room
    @PutMapping("/{id}")
    public Room update(
            @PathVariable Long id,
            @Valid @RequestBody Room room) {

        return service.update(id, room);
    }

    // Delete room
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}