package com.consultation.models;

import jakarta.persistence.*;

@Entity
@Table(name = "medecin")
public class Medecin {

    @Id
    private Long id;

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private java.util.List<PlanningConfig> planningConfigs = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private java.util.List<Crenaux> crenauxList = new java.util.ArrayList<>();

    @OneToOne(cascade = CascadeType.REMOVE)
    @MapsId
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur;

    @Column(nullable = false, length = 100)
    private String specialite;

    @Column(name = "duree_seance")
    private int dureeSeance;

    @Column(name = "adresse_cabinet")
    private String adresseCabinet;

    @ManyToOne
    @JoinColumn(name = "id_service")
    private Service service;

    // --- CONSTRUCTEURS ---

    public Medecin() {
    }

    public Medecin(Utilisateur utilisateur, String specialite, int dureeSeance, String adresseCabinet,
            Service service) {
        this.utilisateur = utilisateur;
        this.specialite = specialite;
        this.dureeSeance = dureeSeance;
        this.adresseCabinet = adresseCabinet;
        this.service = service;
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

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public int getDureeSeance() {
        return dureeSeance;
    }

    public void setDureeSeance(int dureeSeance) {
        this.dureeSeance = dureeSeance;
    }

    public String getAdresseCabinet() {
        return adresseCabinet;
    }

    public void setAdresseCabinet(String adresseCabinet) {
        this.adresseCabinet = adresseCabinet;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    // --- TOSTRING ---

    @Override
    public String toString() {
        return "Medecin{" +
                "id=" + id +
                ", specialite='" + specialite + '\'' +
                ", dureeSeance=" + dureeSeance +
                ", adresseCabinet='" + adresseCabinet + '\'' +
                '}';
    }

    // --- GETTERS/SETTERS pour planningConfigs ---
    public java.util.List<PlanningConfig> getPlanningConfigs() {
        return planningConfigs;
    }

    public void setPlanningConfigs(java.util.List<PlanningConfig> planningConfigs) {
        this.planningConfigs = planningConfigs;
    }

    // --- GETTERS/SETTERS pour crenauxList ---
    public java.util.List<Crenaux> getCrenauxList() {
        return crenauxList;
    }

    public void setCrenauxList(java.util.List<Crenaux> crenauxList) {
        this.crenauxList = crenauxList;
    }
}