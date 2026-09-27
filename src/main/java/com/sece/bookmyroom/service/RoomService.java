package com.sece.bookmyroom.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sece.bookmyroom.entity.Room;
import com.sece.bookmyroom.exception.ResourceNotFoundException;
import com.sece.bookmyroom.repository.RoomRepository;

@Service
@Transactional
public class RoomService {
	private final RoomRepository rooms;

	public RoomService(RoomRepository rooms) {
		this.rooms = rooms;
	}

	@Transactional(readOnly = true)
	public List<Room> findAll() { return rooms.findAll(); }

	public Room create(Room room) { return rooms.save(room); }

	public Room update(Long id, Room changes) {
		Room room = rooms.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));
		room.setRoomNumber(changes.getRoomNumber());
		room.setRoomType(changes.getRoomType());
		room.setPricePerNight(changes.getPricePerNight());
		room.setCapacity(changes.getCapacity());
		room.setAvailable(changes.isAvailable());
		return rooms.save(room);
	}

	public void delete(Long id) {
		if (!rooms.existsById(id)) throw new ResourceNotFoundException("Room not found: " + id);
		rooms.deleteById(id);
	}
}