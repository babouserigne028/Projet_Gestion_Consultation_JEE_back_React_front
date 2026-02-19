package com.consultation.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rendez_vous")
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "id_creneau", nullable = false, unique = true)
    private Crenaux creneau;

    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    private Patient patient;

    @Column(name = "token_annulation", nullable = false, unique = true)
    private UUID tokenAnnulation;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @Column(columnDefinition = "TEXT")
    private String motif;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_rdv", nullable = false)
    private StatutRDV statutRdv;

    // --- CONSTRUCTEURS ---

    public RendezVous() {
        this.tokenAnnulation = UUID.randomUUID();
        this.dateCreation = LocalDateTime.now();
    }

    public RendezVous(Crenaux creneau, Patient patient, Utilisateur createur, String motif, StatutRDV statutRdv) {
        this(); // Appelle le constructeur par défaut pour UUID et dateCreation
        this.creneau = creneau;
        this.patient = patient;
        this.motif = motif;
        this.statutRdv = statutRdv;
    }

    // --- GETTERS ET SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Crenaux getCreneau() {
        return creneau;
    }

    public void setCreneau(Crenaux creneau) {
        this.creneau = creneau;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public UUID getTokenAnnulation() {
        return tokenAnnulation;
    }

    public void setTokenAnnulation(UUID tokenAnnulation) {
        this.tokenAnnulation = tokenAnnulation;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public StatutRDV getStatutRdv() {
        return statutRdv;
    }

    public void setStatutRdv(StatutRDV statutRdv) {
        this.statutRdv = statutRdv;
    }

    @Override
    public String toString() {
        return "RendezVous{" +
                "id=" + id +
                ", statut=" + statutRdv +
                ", token=" + tokenAnnulation +
                '}';
    }
}