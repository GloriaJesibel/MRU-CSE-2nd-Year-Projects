package com.homeremedyhub.homeremedyhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homeremedyhub.homeremedyhub.entity.Appointment;
import com.homeremedyhub.homeremedyhub.repository.AppointmentRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;


    // Save Appointment
    public Appointment saveAppointment(Appointment appointment) {

        appointment.setStatus("Booked");

        return appointmentRepository.save(appointment);
    }


    // Get All Appointments
    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();
    }


    // Delete One Appointment
    public boolean deleteAppointment(
            Long id,
            String email) {

        Optional<Appointment> record =
                appointmentRepository.findById(id);


        if (record.isEmpty()) {

            return false;
        }


        Appointment appointment =
                record.get();


        // User can delete only their own appointment
        if (
            appointment.getEmail() == null ||
            !appointment.getEmail()
                    .equalsIgnoreCase(email)
        ) {

            return false;
        }


        appointmentRepository.deleteById(id);

        return true;
    }


    // Delete All Appointments Of One User
    @Transactional
    public void deleteAllAppointments(
            String email) {

        appointmentRepository
                .deleteAllByEmailIgnoreCase(email);
    }

}