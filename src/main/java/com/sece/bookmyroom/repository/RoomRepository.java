package com.sece.bookmyroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sece.bookmyroom.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
}