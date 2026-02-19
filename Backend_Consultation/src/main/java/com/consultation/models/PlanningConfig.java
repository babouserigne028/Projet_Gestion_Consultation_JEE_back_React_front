package com.consultation.models;

import jakarta.persistence.*;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;

@Entity
@Table(name = "planning_config")
public class PlanningConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_medecin", nullable = false)
    private Medecin medecin;

    @Column(name = "date_journee", nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateJournee;

    @Column(name = "heure_debut_journee", nullable = false)
    @JsonIgnore
    private LocalTime heureDebutJournee;

    @Column(name = "heure_fin_journee", nullable = false)
    @JsonIgnore
    private LocalTime heureFinJournee;

    // --- CONSTRUCTEURS ---

    public PlanningConfig() {
    }

    public PlanningConfig(Medecin medecin, LocalDate dateJournee, LocalTime heureDebutJournee, LocalTime heureFinJournee) {
        this.medecin = medecin;
        this.dateJournee = dateJournee;
        this.heureDebutJournee = heureDebutJournee;
        this.heureFinJournee = heureFinJournee;
    }

    // --- GETTERS ET SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public LocalDate getDateJournee() {
        return dateJournee;
    }

    public void setDateJournee(LocalDate dateJournee) {
        this.dateJournee = dateJournee;
    }

    public LocalTime getHeureDebutJournee() {
        return heureDebutJournee;
    }

    public void setHeureDebutJournee(LocalTime heureDebutJournee) {
        this.heureDebutJournee = heureDebutJournee;
    }

    public LocalTime getHeureFinJournee() {
        return heureFinJournee;
    }

    public void setHeureFinJournee(LocalTime heureFinJournee) {
        this.heureFinJournee = heureFinJournee;
    }

    // --- TOSTRING ---

    @Override
    public String toString() {
        return "PlanningConfig{" +
                "id=" + id +
                ", dateJournee=" + dateJournee +
                ", heureDebut=" + heureDebutJournee +
                ", heureFin=" + heureFinJournee +
                '}';
    }
}