package com.consultation.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "crenaux")
public class Crenaux {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "creneau", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private java.util.List<RendezVous> rendezVousList = new java.util.ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "id_medecin", nullable = false)
    @JsonIgnore
    private Medecin medecin;

    @Column(name = "date_day", nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateDay;

    @Column(name = "heure_debut", nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime heureDebut;

    @Column(name = "heure_fin", nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime heureFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutCrenau statut = StatutCrenau.LIBRE;

    // --- CONSTRUCTEURS ---

    public Crenaux() {
    }

    public Crenaux(Medecin medecin, LocalDate dateDay, LocalTime heureDebut, LocalTime heureFin) {
        this(medecin, dateDay, heureDebut, heureFin, StatutCrenau.LIBRE);
    }

    public Crenaux(Medecin medecin, LocalDate dateDay, LocalTime heureDebut, LocalTime heureFin, StatutCrenau statut) {
        this.medecin = medecin;
        this.dateDay = dateDay;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.statut = statut;
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

    public LocalDate getDateDay() {
        return dateDay;
    }

    public void setDateDay(LocalDate dateDay) {
        this.dateDay = dateDay;
    }

    public LocalTime getHeureDebut() {
        return heureDebut;
    }

    public void setHeureDebut(LocalTime heureDebut) {
        this.heureDebut = heureDebut;
    }

    public LocalTime getHeureFin() {
        return heureFin;
    }

    public void setHeureFin(LocalTime heureFin) {
        this.heureFin = heureFin;
    }

    public StatutCrenau getStatut() {
        return statut;
    }

    public void setStatut(StatutCrenau statut) {
        this.statut = statut;
    }

    // --- TOSTRING ---

    // --- GETTERS/SETTERS pour rendezVousList ---
    public java.util.List<RendezVous> getRendezVousList() {
        return rendezVousList;
    }

    public void setRendezVousList(java.util.List<RendezVous> rendezVousList) {
        this.rendezVousList = rendezVousList;
    }

    @Override
    public String toString() {
        return "Crenau{" +
                "id=" + id +
                ", date=" + dateDay +
                ", de=" + heureDebut +
                ", à=" + heureFin +
                ", statut=" + statut +
                '}';
    }
}