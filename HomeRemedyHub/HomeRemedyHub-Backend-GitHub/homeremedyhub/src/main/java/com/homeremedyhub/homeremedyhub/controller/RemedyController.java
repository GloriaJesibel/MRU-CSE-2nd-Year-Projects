package com.homeremedyhub.homeremedyhub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homeremedyhub.homeremedyhub.entity.Remedy;
import com.homeremedyhub.homeremedyhub.service.RemedyService;

@RestController
@RequestMapping("/api/remedies")
@CrossOrigin(origins = "*")
public class RemedyController {

    @Autowired
    private RemedyService remedyService;


    // Get all remedies
    @GetMapping("/all")
    public List<Remedy> getAllRemedies() {

        return remedyService.getAllRemedies();

    }


    // Search remedy by symptom
    @GetMapping("/search")
    public List<Remedy> searchBySymptom(
            @RequestParam String symptom) {

        return remedyService.findBySymptom(symptom);

    }


    // Search by care type
    @GetMapping("/care")
    public List<Remedy> searchByCareType(
            @RequestParam String careType) {

        return remedyService.findByCareType(careType);

    }


    // Search by severity
    @GetMapping("/severity")
    public List<Remedy> searchBySeverity(
            @RequestParam String severity) {

        return remedyService.findBySeverity(severity);

    }


    // Save remedy
    @PostMapping("/save")
    public Remedy saveRemedy(
            @RequestBody Remedy remedy) {

        return remedyService.saveRemedy(remedy);

    }

}