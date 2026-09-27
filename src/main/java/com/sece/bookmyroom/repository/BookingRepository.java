package com.sece.bookmyroom.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.sece.bookmyroom.entity.Booking;
import com.sece.bookmyroom.entity.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	List<Booking> findByGuestId(Long guestId);

	@Query("select count(b) > 0 from Booking b where b.room.id = :roomId and b.status <> :cancelled "
			+ "and b.checkInDate < :checkOut and b.checkOutDate > :checkIn")
	boolean hasOverlappingBooking(@Param("roomId") Long roomId,
			@Param("cancelled") BookingStatus cancelled,
			@Param("checkIn") LocalDate checkIn,
			@Param("checkOut") LocalDate checkOut);
}