package com.sece.bookmyroom.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.sece.bookmyroom.entity.Guest;
import com.sece.bookmyroom.service.GuestService;

@RestController
@RequestMapping("/api/guests")
public class GuestController {
	private final GuestService service;

	public GuestController(GuestService service) { this.service = service; }

	@GetMapping
	public List<Guest> findAll() { return service.findAll(); }

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Guest create(@Valid @RequestBody Guest guest) { return service.create(guest); }

	@PutMapping("/{id}")
	public Guest update(@PathVariable Long id, @Valid @RequestBody Guest guest) { return service.update(id, guest); }

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) { service.delete(id); }
}