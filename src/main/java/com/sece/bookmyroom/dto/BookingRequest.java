package com.sece.bookmyroom.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record BookingRequest(
	@NotNull Long roomId,
	@NotNull Long guestId,
	@NotNull LocalDate checkInDate,
	@NotNull LocalDate checkOutDate) {
}