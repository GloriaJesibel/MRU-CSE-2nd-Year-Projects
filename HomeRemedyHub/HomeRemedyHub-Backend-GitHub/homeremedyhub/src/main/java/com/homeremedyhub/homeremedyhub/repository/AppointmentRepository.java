package com.homeremedyhub.homeremedyhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homeremedyhub.homeremedyhub.entity.Appointment;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    void deleteAllByEmailIgnoreCase(String email);

}