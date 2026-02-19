package com.consultation.services;

import com.consultation.models.RendezVous;
import com.consultation.models.Crenaux;
import com.consultation.models.StatutCrenau;
import com.consultation.models.Patient;
import com.consultation.models.StatutRDV;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.LockModeType;
import jakarta.persistence.LockTimeoutException;
import jakarta.persistence.PessimisticLockException;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class RendezVousService {

    @PersistenceContext
    private EntityManager em;

    /**
     * Prendre un rendez-vous pour un patient sur un créneau donné.
     * Utilise un verrouillage pessimiste pour éviter le double booking.
     * 
     * @param patientId id du patient
     * @param creneauId id du créneau
     * @param motif     motif du rendez-vous (optionnel)
     * @return RendezVous créé
     * @throws IllegalArgumentException si patient/créneau introuvable ou créneau
     *                                  non disponible
     * @throws IllegalStateException    si le créneau est déjà réservé par un autre
     *                                  processus concurrent
     */
    @Transactional
    public RendezVous prendreRendezVous(Long patientId, Long creneauId, String motif) {
        // 1. Récupérer le patient
        Patient patient = em.find(Patient.class, patientId);
        if (patient == null) {
            throw new IllegalArgumentException("Patient introuvable");
        }

        // 2. Acquérir un verrou pessimiste sur le créneau pour éviter le double booking
        Crenaux creneau;
        try {
            creneau = em.find(Crenaux.class, creneauId, LockModeType.PESSIMISTIC_WRITE);
        } catch (PessimisticLockException | LockTimeoutException e) {
            throw new IllegalStateException(
                    "Ce créneau est en cours de réservation par un autre utilisateur. Veuillez réessayer.");
        }

        if (creneau == null) {
            throw new IllegalArgumentException("Créneau introuvable");
        }

        // 3. Vérifier si le créneau est disponible (vérification après acquisition du
        // verrou)
        if (creneau.getStatut() != StatutCrenau.LIBRE) {
            throw new IllegalArgumentException("Ce créneau n'est plus disponible");
        }

        // 4. Double vérification : s'assurer qu'aucun rendez-vous n'existe déjà pour ce
        // créneau
        Long existingRdv = em.createQuery(
                "SELECT COUNT(r) FROM RendezVous r WHERE r.creneau.id = :creneauId", Long.class)
                .setParameter("creneauId", creneauId)
                .getSingleResult();

        if (existingRdv > 0) {
            throw new IllegalArgumentException("Ce créneau est déjà réservé");
        }

        // 5. Créer le rendez-vous
        RendezVous rdv = new RendezVous();
        rdv.setPatient(patient);
        rdv.setCreneau(creneau);
        rdv.setMotif(motif);
        rdv.setStatutRdv(StatutRDV.CONFIRME);

        // 6. Mettre à jour le statut du créneau
        creneau.setStatut(StatutCrenau.RESERVE);

        // 7. Persister immédiatement et forcer la synchronisation avec la DB
        em.persist(rdv);
        em.merge(creneau);
        em.flush(); // Force l'écriture immédiate pour détecter les violations de contraintes

        return rdv;
    }

    /**
     * Retourne la liste de tous les rendez-vous.
     */
    public List<RendezVous> findAll() {
        return em.createQuery("SELECT r FROM RendezVous r", RendezVous.class).getResultList();
    }

    /**
     * Retourne les statistiques du jour pour un médecin donné :
     * - nombre de rendez-vous aujourd'hui non terminés
     * - nombre de créneaux libres aujourd'hui
     * - liste détaillée des rendez-vous d'aujourd'hui
     */
    public java.util.Map<String, Object> getStatsJourMedecin(Long medecinId) {
        java.time.LocalDate aujourdhui = java.time.LocalDate.now();

        // Compter les rendez-vous non terminés aujourd'hui pour ce médecin
        long rdvNonTermines = em.createQuery(
                "SELECT COUNT(r) FROM RendezVous r " +
                        "WHERE r.creneau.medecin.id = :medecinId " +
                        "AND r.creneau.dateDay = :aujourdhui " +
                        "AND r.statutRdv != :termine",
                Long.class)
                .setParameter("medecinId", medecinId)
                .setParameter("aujourdhui", aujourdhui)
                .setParameter("termine", StatutRDV.TERMINE)
                .getSingleResult();

        // Compter les créneaux libres aujourd'hui pour ce médecin
        long crenauxLibres = em.createQuery(
                "SELECT COUNT(c) FROM Crenaux c " +
                        "WHERE c.medecin.id = :medecinId " +
                        "AND c.dateDay = :aujourdhui " +
                        "AND c.statut = :libre",
                Long.class)
                .setParameter("medecinId", medecinId)
                .setParameter("aujourdhui", aujourdhui)
                .setParameter("libre", StatutCrenau.LIBRE)
                .getSingleResult();

        // Récupérer la liste des rendez-vous d'aujourd'hui pour ce médecin
        List<RendezVous> rdvAujourdhui = em.createQuery(
                "SELECT r FROM RendezVous r " +
                        "WHERE r.creneau.medecin.id = :medecinId " +
                        "AND r.creneau.dateDay = :aujourdhui " +
                        "ORDER BY r.creneau.heureDebut",
                RendezVous.class)
                .setParameter("medecinId", medecinId)
                .setParameter("aujourdhui", aujourdhui)
                .getResultList();

        // Transformer en format pour le frontend
        List<java.util.Map<String, Object>> rdvDetails = rdvAujourdhui.stream().map(rdv -> {
            java.util.Map<String, Object> rdvMap = new java.util.HashMap<>();
            rdvMap.put("heure", rdv.getCreneau().getHeureDebut().toString());
            rdvMap.put("patient",
                    rdv.getPatient().getUtilisateur().getPrenom() + " " + rdv.getPatient().getUtilisateur().getNom());
            rdvMap.put("type", rdv.getMotif() != null ? rdv.getMotif() : "Consultation");
            rdvMap.put("statut", rdv.getStatutRdv().name().toLowerCase());
            rdvMap.put("id", rdv.getId());
            return rdvMap;
        }).collect(java.util.stream.Collectors.toList());

        return java.util.Map.of(
                "stats", java.util.List.of(
                        java.util.Map.of(
                                "title", "RDV Aujourd'hui",
                                "value", String.valueOf(rdvNonTermines),
                                "color", "blue",
                                "bgGradient", "from-blue-400 to-blue-600"),
                        java.util.Map.of(
                                "title", "Créneaux Libres",
                                "value", String.valueOf(crenauxLibres),
                                "color", "green",
                                "bgGradient", "from-green-400 to-green-600")),
                "rdvAujourdhui", rdvDetails);
    }

    /**
     * Change le statut d'un rendez-vous
     */
    @Transactional
    public RendezVous changerStatut(Long rdvId, String nouveauStatut) {
        RendezVous rdv = em.find(RendezVous.class, rdvId);
        if (rdv == null) {
            throw new IllegalArgumentException("Rendez-vous introuvable");
        }

        StatutRDV statut = StatutRDV.valueOf(nouveauStatut.toUpperCase());
        rdv.setStatutRdv(statut);

        // Si annulé, libérer le créneau
        if (statut == StatutRDV.ANNULE) {
            rdv.getCreneau().setStatut(StatutCrenau.LIBRE);
            em.merge(rdv.getCreneau());
        }

        em.merge(rdv);
        return rdv;
    }

    /**
     * Retourne le planning de la semaine courante pour un médecin
     */
    public java.util.Map<String, Object> getPlanningSemaneMedecin(Long medecinId) {
        java.time.LocalDate aujourdhui = java.time.LocalDate.now();
        java.time.LocalDate debutSemaine = aujourdhui.with(java.time.DayOfWeek.MONDAY);
        java.time.LocalDate finSemaine = debutSemaine.plusDays(6);

        List<RendezVous> rdvSemaine = em.createQuery(
                "SELECT r FROM RendezVous r " +
                        "WHERE r.creneau.medecin.id = :medecinId " +
                        "AND r.creneau.dateDay BETWEEN :debut AND :fin " +
                        "ORDER BY r.creneau.dateDay, r.creneau.heureDebut",
                RendezVous.class)
                .setParameter("medecinId", medecinId)
                .setParameter("debut", debutSemaine)
                .setParameter("fin", finSemaine)
                .getResultList();

        // Grouper par jour
        java.util.Map<String, List<java.util.Map<String, Object>>> planningParJour = new java.util.HashMap<>();
        for (RendezVous rdv : rdvSemaine) {
            String jour = rdv.getCreneau().getDateDay().toString();
            planningParJour.computeIfAbsent(jour, k -> new java.util.ArrayList<>()).add(
                    java.util.Map.of(
                            "id", rdv.getId(),
                            "heure", rdv.getCreneau().getHeureDebut().toString(),
                            "patient",
                            rdv.getPatient().getUtilisateur().getPrenom() + " "
                                    + rdv.getPatient().getUtilisateur().getNom(),
                            "motif", rdv.getMotif() != null ? rdv.getMotif() : "Consultation",
                            "statut", rdv.getStatutRdv().name().toLowerCase()));
        }

        return java.util.Map.of(
                "debutSemaine", debutSemaine.toString(),
                "finSemaine", finSemaine.toString(),
                "planning", planningParJour);
    }

    /**
     * Retourne l'historique des consultations d'un médecin
     */
    public List<RendezVous> getHistoriqueMedecin(Long medecinId, int limit) {
        return em.createQuery(
                "SELECT r FROM RendezVous r " +
                        "WHERE r.creneau.medecin.id = :medecinId " +
                        "ORDER BY r.creneau.dateDay DESC, r.creneau.heureDebut DESC",
                RendezVous.class)
                .setParameter("medecinId", medecinId)
                .setMaxResults(limit)
                .getResultList();
    }

    /**
     * Retourne tous les rendez-vous d'un patient
     */
    public List<RendezVous> getRendezVousPatient(Long patientId) {
        return em.createQuery(
                "SELECT r FROM RendezVous r " +
                        "WHERE r.patient.id = :patientId " +
                        "ORDER BY r.creneau.dateDay DESC, r.creneau.heureDebut DESC",
                RendezVous.class)
                .setParameter("patientId", patientId)
                .getResultList();
    }

    /**
     * Retourne le prochain rendez-vous d'un patient
     */
    public RendezVous getProchainRendezVousPatient(Long patientId) {
        java.time.LocalDate aujourdhui = java.time.LocalDate.now();
        List<RendezVous> rdvs = em.createQuery(
                "SELECT r FROM RendezVous r " +
                        "WHERE r.patient.id = :patientId " +
                        "AND r.creneau.dateDay >= :aujourdhui " +
                        "AND r.statutRdv NOT IN (:annule, :termine) " +
                        "ORDER BY r.creneau.dateDay ASC, r.creneau.heureDebut ASC",
                RendezVous.class)
                .setParameter("patientId", patientId)
                .setParameter("aujourdhui", aujourdhui)
                .setParameter("annule", StatutRDV.ANNULE)
                .setParameter("termine", StatutRDV.TERMINE)
                .setMaxResults(1)
                .getResultList();
        return rdvs.isEmpty() ? null : rdvs.get(0);
    }

    /**
     * Retourne les statistiques des rendez-vous d'un patient
     */
    public java.util.Map<String, Object> getStatsPatient(Long patientId) {
        java.time.LocalDate aujourdhui = java.time.LocalDate.now();

        // Compter les RDV en attente/confirmés (à venir)
        long rdvAVenir = em.createQuery(
                "SELECT COUNT(r) FROM RendezVous r " +
                        "WHERE r.patient.id = :patientId " +
                        "AND r.creneau.dateDay >= :aujourdhui " +
                        "AND r.statutRdv IN (:confirme, :enAttente)",
                Long.class)
                .setParameter("patientId", patientId)
                .setParameter("aujourdhui", aujourdhui)
                .setParameter("confirme", StatutRDV.CONFIRME)
                .setParameter("enAttente", StatutRDV.EN_ATTENTE)
                .getSingleResult();

        // Compter les RDV terminés
        long rdvTermines = em.createQuery(
                "SELECT COUNT(r) FROM RendezVous r " +
                        "WHERE r.patient.id = :patientId " +
                        "AND r.statutRdv = :termine",
                Long.class)
                .setParameter("patientId", patientId)
                .setParameter("termine", StatutRDV.TERMINE)
                .getSingleResult();

        // Compter les RDV annulés
        long rdvAnnules = em.createQuery(
                "SELECT COUNT(r) FROM RendezVous r " +
                        "WHERE r.patient.id = :patientId " +
                        "AND r.statutRdv = :annule",
                Long.class)
                .setParameter("patientId", patientId)
                .setParameter("annule", StatutRDV.ANNULE)
                .getSingleResult();

        return java.util.Map.of(
                "rdvAVenir", rdvAVenir,
                "rdvTermines", rdvTermines,
                "rdvAnnules", rdvAnnules,
                "total", rdvAVenir + rdvTermines + rdvAnnules);
    }

    /**
     * Annuler un rendez-vous par le patient
     */
    @Transactional
    public RendezVous annulerRendezVousPatient(Long rdvId, Long patientId) {
        RendezVous rdv = em.find(RendezVous.class, rdvId);
        if (rdv == null) {
            throw new IllegalArgumentException("Rendez-vous introuvable");
        }
        if (!rdv.getPatient().getId().equals(patientId)) {
            throw new IllegalArgumentException("Ce rendez-vous ne vous appartient pas");
        }
        if (rdv.getStatutRdv() == StatutRDV.TERMINE) {
            throw new IllegalArgumentException("Impossible d'annuler un rendez-vous terminé");
        }

        rdv.setStatutRdv(StatutRDV.ANNULE);
        rdv.getCreneau().setStatut(StatutCrenau.LIBRE);

        em.merge(rdv.getCreneau());
        em.merge(rdv);

        return rdv;
    }
}