package com.consultation.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import com.consultation.models.Medecin;
import com.consultation.models.PlanningConfig;
import com.consultation.models.Crenaux;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class PlanningConfigService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public PlanningConfig createPlanningConfig(Long medecinId, PlanningConfig config) {
        Medecin medecin = em.find(Medecin.class, medecinId);
        if (medecin == null) {
            throw new IllegalArgumentException("Médecin introuvable");
        }
        config.setMedecin(medecin);
        em.persist(config);

        int dureeConsultation = medecin.getDureeSeance();
        genererCreneaux(config, dureeConsultation);
        return config;
    }

    public static class PlanningCreationResult {
        public List<PlanningConfig> plannings;
        public List<LocalDate> datesIgnorees;
        public String message;

        public PlanningCreationResult(List<PlanningConfig> plannings, List<LocalDate> datesIgnorees) {
            this.plannings = plannings;
            this.datesIgnorees = datesIgnorees;
            if (!datesIgnorees.isEmpty()) {
                this.message = "Les dates suivantes ont été ignorées car un planning existe déjà : " + datesIgnorees;
            } else {
                this.message = "Tous les plannings ont été créés avec succès.";
            }
        }
    }

    @Transactional
    public PlanningCreationResult createPlanningConfigForDates(Long medecinId, List<LocalDate> dates,
            LocalTime heureDebut, LocalTime heureFin) {
        Medecin medecin = em.find(Medecin.class, medecinId);
        if (medecin == null) {
            throw new IllegalArgumentException("Médecin introuvable");
        }
        int dureeConsultation = medecin.getDureeSeance();
        List<PlanningConfig> configs = new java.util.ArrayList<>();
        List<LocalDate> datesIgnorees = new java.util.ArrayList<>();

        for (LocalDate date : dates) {
            Long count = em.createQuery(
                    "SELECT COUNT(p) FROM PlanningConfig p WHERE p.medecin.id = :medecinId AND p.dateJournee = :dateJournee",
                    Long.class)
                    .setParameter("medecinId", medecinId)
                    .setParameter("dateJournee", date)
                    .getSingleResult();

            if (count == 0) {
                PlanningConfig config = new PlanningConfig(medecin, date, heureDebut, heureFin);
                em.persist(config);
                genererCreneaux(config, dureeConsultation);
                configs.add(config);
            } else {
                datesIgnorees.add(date);
            }
        }
        return new PlanningCreationResult(configs, datesIgnorees);
    }

    // Ajoute cette méthode dans PlanningConfigService
    public void genererCreneaux(PlanningConfig config, int dureeMinutes) {
        LocalTime debut = config.getHeureDebutJournee();
        LocalTime fin = config.getHeureFinJournee();
        Medecin medecin = config.getMedecin();

        while (debut.isBefore(fin)) {
            LocalTime creneauFin = debut.plusMinutes(dureeMinutes);
            if (creneauFin.isAfter(fin)) {
                creneauFin = fin;
            }
            Crenaux creneau = new Crenaux(medecin, config.getDateJournee(), debut, creneauFin);
            em.persist(creneau);
            debut = creneauFin.plusMinutes(5);
        }
    }

    public class PlanningConfigWithCreneaux {
        public PlanningConfig planningConfig;
        public List<Crenaux> creneaux;

        public PlanningConfigWithCreneaux(PlanningConfig planningConfig, List<Crenaux> creneaux) {
            this.planningConfig = planningConfig;
            this.creneaux = creneaux;
        }
    }

    public List<PlanningConfigWithCreneaux> getPlanningsWithCreneauxInRange(Long medecinId, LocalDate dateDebut,
            LocalDate dateFin) {
        List<PlanningConfig> configs = em.createQuery(
                "SELECT p FROM PlanningConfig p WHERE p.medecin.id = :medecinId AND p.dateJournee BETWEEN :dateDebut AND :dateFin ORDER BY p.dateJournee",
                PlanningConfig.class)
                .setParameter("medecinId", medecinId)
                .setParameter("dateDebut", dateDebut)
                .setParameter("dateFin", dateFin)
                .getResultList();

        List<PlanningConfigWithCreneaux> result = new java.util.ArrayList<>();
        for (PlanningConfig config : configs) {
            List<Crenaux> creneaux = em.createQuery(
                    "SELECT c FROM Crenaux c WHERE c.medecin.id = :medecinId AND c.dateDay = :dateDay ORDER BY c.heureDebut",
                    Crenaux.class)
                    .setParameter("medecinId", medecinId)
                    .setParameter("dateDay", config.getDateJournee())
                    .getResultList();
            result.add(new PlanningConfigWithCreneaux(config, creneaux));
        }
        return result;
    }
}