
package com.consultation.services;

import com.consultation.models.Patient;
import com.consultation.models.Utilisateur;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.time.LocalDate;

@ApplicationScoped
public class PatientService {

    @PersistenceContext
    private EntityManager em;

    /**
     * Crée un patient lié à un utilisateur.
     * 
     * @param user          L'utilisateur à associer
     * @param dateNaissance La date de naissance du patient
     * @param adresse       L'adresse du patient
     */
    @Transactional
    public Patient createPatient(Utilisateur user, LocalDate dateNaissance, String adresse) {
        Patient patient = new Patient();
        patient.setUtilisateur(user);
        patient.setDateNaissance(dateNaissance);
        patient.setAdresse(adresse);
        em.persist(patient);
        em.flush();
        return patient;
    }

    public java.util.List<Patient> getAllPatients() {
        return em.createQuery("SELECT p FROM Patient p", Patient.class).getResultList();
    }

    @Transactional
    public void addPatient(Patient patient) {
        if (patient.getUtilisateur() != null && patient.getUtilisateur().getId() == null) {
            Utilisateur u = patient.getUtilisateur();
            // Vérifie unicité email
            Long countEmail = em.createQuery("SELECT COUNT(u) FROM Utilisateur u WHERE u.email = :email", Long.class)
                    .setParameter("email", u.getEmail())
                    .getSingleResult();
            if (countEmail > 0) {
                throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà.");
            }
            // Vérifie unicité téléphone si non null
            if (u.getTelephone() != null && !u.getTelephone().isEmpty()) {
                Long countTel = em
                        .createQuery("SELECT COUNT(u) FROM Utilisateur u WHERE u.telephone = :tel", Long.class)
                        .setParameter("tel", u.getTelephone())
                        .getSingleResult();
                if (countTel > 0) {
                    throw new IllegalArgumentException("Un utilisateur avec ce téléphone existe déjà.");
                }
            }
            em.persist(u);
        }
        em.persist(patient);
    }

    @Transactional
    public void updatePatient(Long id, Patient patient) {
        Patient existing = em.find(Patient.class, id);
        if (existing != null) {
            existing.setDateNaissance(patient.getDateNaissance());
            existing.setAdresse(patient.getAdresse());
            if (existing.getUtilisateur() != null && patient.getUtilisateur() != null) {
                Utilisateur uOld = existing.getUtilisateur();
                Utilisateur uNew = patient.getUtilisateur();
                uOld.setNom(uNew.getNom());
                uOld.setPrenom(uNew.getPrenom());
                uOld.setTelephone(uNew.getTelephone());
                uOld.setEmail(uNew.getEmail());
                uOld.setActif(uNew.isActif());
            }
            em.merge(existing);
        }
    }

    @Transactional
    public void deletePatient(Long id) {
        Patient patient = em.find(Patient.class, id);
        if (patient != null) {
            Utilisateur user = patient.getUtilisateur();
            em.remove(patient);
            if (user != null) {
                Utilisateur managedUser = em.find(Utilisateur.class, user.getId());
                if (managedUser != null) {
                    em.remove(managedUser);
                }
            }
        }
    }

    /**
     * Retourne les patients récents d'un médecin (ayant eu des RDV récemment)
     */
    public java.util.List<Patient> getPatientsRecentsMedecin(Long medecinId, int limit) {
        return em.createQuery(
                "SELECT DISTINCT r.patient FROM RendezVous r " +
                        "WHERE r.creneau.medecin.id = :medecinId " +
                        "ORDER BY r.creneau.dateDay DESC",
                Patient.class)
                .setParameter("medecinId", medecinId)
                .setMaxResults(limit)
                .getResultList();
    }

    /**
     * Récupère un patient par l'ID de son utilisateur
     * 
     * @param utilisateurId ID de l'utilisateur
     * @return Patient ou null si non trouvé
     */
    public Patient getByUtilisateurId(Long utilisateurId) {
        try {
            return em.createQuery(
                    "SELECT p FROM Patient p WHERE p.utilisateur.id = :utilisateurId", Patient.class)
                    .setParameter("utilisateurId", utilisateurId)
                    .getSingleResult();
        } catch (jakarta.persistence.NoResultException e) {
            return null;
        }
    }

    /**
     * Récupère un patient par son ID
     * 
     * @param id ID du patient
     * @return Patient ou null si non trouvé
     */
    public Patient getById(Long id) {
        return em.find(Patient.class, id);
    }
}