package com.sece.bookmyroom.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "rooms")
public class Room {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Column(nullable = false, unique = true)
	private String roomNumber;

	@NotBlank
	@Column(nullable = false)
	private String roomType;

	@NotNull
	@DecimalMin(value = "0.0", inclusive = false)
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal pricePerNight;

	@NotNull
	@Min(1)
	@Column(nullable = false)
	private Integer capacity;

	@Column(nullable = false)
	private boolean available = true;

	public Room() {
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getRoomNumber() { return roomNumber; }
	public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
	public String getRoomType() { return roomType; }
	public void setRoomType(String roomType) { this.roomType = roomType; }
	public BigDecimal getPricePerNight() { return pricePerNight; }
	public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }
	public Integer getCapacity() { return capacity; }
	public void setCapacity(Integer capacity) { this.capacity = capacity; }
	public boolean isAvailable() { return available; }
	public void setAvailable(boolean available) { this.available = available; }
}