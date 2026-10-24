package com.homeremedyhub.homeremedyhub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "remedies")
public class Remedy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symptom;

    private String conditionName;

    private String careType;

    private String severity;

    @Column(length = 1000)
    private String remedy;

    @Column(length = 1000)
    private String instructions;

    @Column(length = 1000)
    private String precaution;

    @Column(length = 1000)
    private String whenToSeeDoctor;


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getSymptom() {
        return symptom;
    }


    public void setSymptom(String symptom) {
        this.symptom = symptom;
    }


    public String getConditionName() {
        return conditionName;
    }


    public void setConditionName(String conditionName) {
        this.conditionName = conditionName;
    }


    public String getCareType() {
        return careType;
    }


    public void setCareType(String careType) {
        this.careType = careType;
    }


    public String getSeverity() {
        return severity;
    }


    public void setSeverity(String severity) {
        this.severity = severity;
    }


    public String getRemedy() {
        return remedy;
    }


    public void setRemedy(String remedy) {
        this.remedy = remedy;
    }


    public String getInstructions() {
        return instructions;
    }


    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }


    public String getPrecaution() {
        return precaution;
    }


    public void setPrecaution(String precaution) {
        this.precaution = precaution;
    }


    public String getWhenToSeeDoctor() {
        return whenToSeeDoctor;
    }


    public void setWhenToSeeDoctor(String whenToSeeDoctor) {
        this.whenToSeeDoctor = whenToSeeDoctor;
    }
}