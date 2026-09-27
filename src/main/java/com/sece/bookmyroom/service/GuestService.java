package com.sece.bookmyroom.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sece.bookmyroom.entity.Guest;
import com.sece.bookmyroom.exception.ResourceNotFoundException;
import com.sece.bookmyroom.repository.GuestRepository;

@Service
@Transactional
public class GuestService {
	private final GuestRepository guests;

	public GuestService(GuestRepository guests) {
		this.guests = guests;
	}

	@Transactional(readOnly = true)
	public List<Guest> findAll() { return guests.findAll(); }

	public Guest create(Guest guest) { return guests.save(guest); }

	public Guest update(Long id, Guest changes) {
		Guest guest = guests.findById(id).orElseThrow(() -> new ResourceNotFoundException("Guest not found: " + id));
		guest.setName(changes.getName());
		guest.setEmail(changes.getEmail());
		guest.setPhone(changes.getPhone());
		return guests.save(guest);
	}

	public void delete(Long id) {
		if (!guests.existsById(id)) throw new ResourceNotFoundException("Guest not found: " + id);
		guests.deleteById(id);
	}
}