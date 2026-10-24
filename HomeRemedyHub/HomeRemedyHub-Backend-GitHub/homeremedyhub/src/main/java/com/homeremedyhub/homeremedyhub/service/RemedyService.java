package com.homeremedyhub.homeremedyhub.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.homeremedyhub.homeremedyhub.entity.Remedy;
import com.homeremedyhub.homeremedyhub.repository.RemedyRepository;

@Service
public class RemedyService {

    @Autowired
    private RemedyRepository remedyRepository;


    // Search remedy by symptom
    public List<Remedy> findBySymptom(String symptom) {

        return remedyRepository
                .findBySymptomContainingIgnoreCase(symptom);

    }


    // Search by care type
    public List<Remedy> findByCareType(String careType) {

        return remedyRepository
                .findByCareTypeIgnoreCase(careType);

    }


    // Search by severity
    public List<Remedy> findBySeverity(String severity) {

        return remedyRepository
                .findBySeverityIgnoreCase(severity);

    }


    // Get all remedies
    public List<Remedy> getAllRemedies() {

        return remedyRepository.findAll();

    }


    // Save remedy
    public Remedy saveRemedy(Remedy remedy) {

        return remedyRepository.save(remedy);

    }

}