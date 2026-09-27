package com.sece.bookmyroom.service;

import org.springframework.stereotype.Service;

import com.sece.bookmyroom.entity.BookingStatus;
import com.sece.bookmyroom.repository.BookingRepository;

@Service
public class ReportService {

    private final BookingRepository bookingRepository;

    public ReportService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public long getMonthlyBookingCount(int year, int month) {
        return bookingRepository.countBookingsByMonth(
                year,
                month,
                BookingStatus.CANCELLED
        );
    }
}