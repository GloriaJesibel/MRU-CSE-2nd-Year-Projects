package com.homeremedyhub.homeremedyhub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homeremedyhub.homeremedyhub.entity.Appointment;
import com.homeremedyhub.homeremedyhub.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;


    // Save Appointment
    @PostMapping("/save")
    public Appointment saveAppointment(
            @RequestBody Appointment appointment) {

        return appointmentService
                .saveAppointment(appointment);
    }


    // Get All Appointments
    @GetMapping("/history")
    public List<Appointment> getAppointments() {

        return appointmentService
                .getAllAppointments();
    }


    // Delete One Appointment
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAppointment(
            @PathVariable Long id,
            @RequestParam String email) {

        boolean deleted =
                appointmentService.deleteAppointment(
                        id,
                        email
                );

        if (deleted) {

            return ResponseEntity.ok(
                    "Appointment deleted successfully."
            );
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                        "Appointment not found."
                );
    }


    // Delete All Appointments Of Current User
    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllAppointments(
            @RequestParam String email) {

        appointmentService
                .deleteAllAppointments(email);

        return ResponseEntity.ok(
                "Appointment history deleted successfully."
        );
    }

}