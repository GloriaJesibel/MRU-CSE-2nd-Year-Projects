package com.homeremedyhub.homeremedyhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homeremedyhub.homeremedyhub.entity.SymptomHistory;
import com.homeremedyhub.homeremedyhub.repository.SymptomHistoryRepository;

@Service
public class SymptomHistoryService {

    @Autowired
    private SymptomHistoryRepository symptomHistoryRepository;


    // Save symptom analysis
    public SymptomHistory saveAnalysis(SymptomHistory history) {

        return symptomHistoryRepository.save(history);
    }


    // Get all analyses
    public List<SymptomHistory> getAllAnalyses() {

        return symptomHistoryRepository.findAll();
    }


    // Delete one health history record
    public boolean deleteAnalysis(Long id, String userEmail) {

        Optional<SymptomHistory> record =
                symptomHistoryRepository.findById(id);


        if (record.isEmpty()) {

            return false;
        }


        SymptomHistory history =
                record.get();


        // Make sure user deletes only their own record
        if (
            history.getUserEmail() == null ||
            !history.getUserEmail()
                    .equalsIgnoreCase(userEmail)
        ) {

            return false;
        }


        symptomHistoryRepository.deleteById(id);

        return true;
    }


    // Delete all health history of one user
    @Transactional
    public void deleteAllAnalyses(String userEmail) {

        symptomHistoryRepository
                .deleteAllByUserEmailIgnoreCase(userEmail);
    }

}