package com.consultation.models;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "patient")
public class Patient {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur;

    @Column(name = "date_naissance")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateNaissance;

    @Column(length = 255)
    private String adresse;

    // --- CONSTRUCTEURS ---

    public Patient() {
    }

    public Patient(Utilisateur utilisateur, LocalDate dateNaissance, String adresse) {
        this.utilisateur = utilisateur;
        this.dateNaissance = dateNaissance;
        this.adresse = adresse;
    }

    // --- GETTERS ET SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    // --- TOSTRING ---

    @Override
    public String toString() {
        return "Patient{" +
                "id=" + id +
                ", dateNaissance=" + dateNaissance +
                ", adresse='" + adresse + '\'' +
                '}';
    }
}