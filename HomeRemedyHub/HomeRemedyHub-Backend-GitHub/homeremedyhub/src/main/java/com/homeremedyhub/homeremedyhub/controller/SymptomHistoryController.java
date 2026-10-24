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

import com.homeremedyhub.homeremedyhub.entity.SymptomHistory;
import com.homeremedyhub.homeremedyhub.service.SymptomHistoryService;

@RestController
@RequestMapping("/api/symptoms")
@CrossOrigin(origins = "*")
public class SymptomHistoryController {

    @Autowired
    private SymptomHistoryService symptomHistoryService;


    // Save Symptom Analysis
    @PostMapping("/save")
    public SymptomHistory saveAnalysis(
            @RequestBody SymptomHistory history) {

        return symptomHistoryService.saveAnalysis(history);
    }


    // Get All Symptom Analyses
    @GetMapping("/history")
    public List<SymptomHistory> getHistory() {

        return symptomHistoryService.getAllAnalyses();
    }


    // Delete One Health History
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAnalysis(
            @PathVariable Long id,
            @RequestParam String userEmail) {

        boolean deleted =
                symptomHistoryService.deleteAnalysis(
                        id,
                        userEmail
                );

        if (deleted) {

            return ResponseEntity.ok(
                    "Health record deleted successfully."
            );
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                        "Health record not found."
                );
    }


    // Delete All Health History Of Current User
    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllAnalyses(
            @RequestParam String userEmail) {

        symptomHistoryService
                .deleteAllAnalyses(userEmail);

        return ResponseEntity.ok(
                "Health history deleted successfully."
        );
    }

}