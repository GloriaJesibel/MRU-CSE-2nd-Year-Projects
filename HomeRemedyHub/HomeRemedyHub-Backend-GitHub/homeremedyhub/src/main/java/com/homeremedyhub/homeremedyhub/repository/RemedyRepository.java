package com.homeremedyhub.homeremedyhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homeremedyhub.homeremedyhub.entity.Remedy;


public interface RemedyRepository
        extends JpaRepository<Remedy, Long> {


    List<Remedy>
    findBySymptomContainingIgnoreCase(
        String symptom
    );


    List<Remedy>
    findByCareTypeIgnoreCase(
        String careType
    );


    List<Remedy>
    findBySeverityIgnoreCase(
        String severity
    );

}