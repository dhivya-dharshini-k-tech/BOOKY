package com.sece.bookmyroom.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "bookings")
public class Booking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "room_id", nullable = false)
	private Room room;

	@NotNull
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "guest_id", nullable = false)
	private Guest guest;

	@NotNull
	@Column(nullable = false)
	private LocalDate checkInDate;

	@NotNull
	@Column(nullable = false)
	private LocalDate checkOutDate;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private BookingStatus status = BookingStatus.CONFIRMED;

	@NotNull
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal totalPrice;

	public Booking() {
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Room getRoom() { return room; }
	public void setRoom(Room room) { this.room = room; }
	public Guest getGuest() { return guest; }
	public void setGuest(Guest guest) { this.guest = guest; }
	public LocalDate getCheckInDate() { return checkInDate; }
	public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }
	public LocalDate getCheckOutDate() { return checkOutDate; }
	public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }
	public BookingStatus getStatus() { return status; }
	public void setStatus(BookingStatus status) { this.status = status; }
	public BigDecimal getTotalPrice() { return totalPrice; }
	public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}