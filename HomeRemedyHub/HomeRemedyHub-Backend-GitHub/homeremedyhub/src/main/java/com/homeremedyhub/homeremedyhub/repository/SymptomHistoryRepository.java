package com.homeremedyhub.homeremedyhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homeremedyhub.homeremedyhub.entity.SymptomHistory;

public interface SymptomHistoryRepository extends JpaRepository<SymptomHistory, Long> {
void deleteAllByUserEmailIgnoreCase(String userEmail);
}