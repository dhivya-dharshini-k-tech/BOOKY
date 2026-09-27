package com.sece.bookmyroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sece.bookmyroom.entity.Guest;

public interface GuestRepository extends JpaRepository<Guest, Long> {
}