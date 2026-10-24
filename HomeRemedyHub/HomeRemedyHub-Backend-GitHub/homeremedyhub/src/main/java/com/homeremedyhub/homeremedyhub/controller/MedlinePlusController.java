package com.homeremedyhub.homeremedyhub.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homeremedyhub.homeremedyhub.service.MedlinePlusService;

@RestController
@RequestMapping("/api/medlineplus")
@CrossOrigin(origins = "*")
public class MedlinePlusController {

    @Autowired
    private MedlinePlusService medlinePlusService;


    @GetMapping("/search")
    public Map<String, String> search(
            @RequestParam String symptom) {

        return medlinePlusService
                .searchHealthTopic(symptom);
    }
}