package com.sece.bookmyroom.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sece.bookmyroom.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/occupancy")
    public Map<String, Long> getOccupancyReport(
            @RequestParam int year,
            @RequestParam int month) {

        long bookingCount =
                reportService.getMonthlyBookingCount(year, month);

        return Map.of("totalBookings", bookingCount);
    }
}