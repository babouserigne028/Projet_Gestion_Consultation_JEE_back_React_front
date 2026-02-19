
package com.consultation.services;

import com.consultation.models.Medecin;
import com.consultation.models.Utilisateur;
import com.consultation.models.Service;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class MedecinService {

    @PersistenceContext
    private EntityManager em;

    /**
     * Crée un médecin lié à un utilisateur.
     * 
     * @param user           L'utilisateur à associer
     * @param specialite     La spécialité du médecin
     * @param dureeSeance    Durée d'une séance
     * @param adresseCabinet Adresse du cabinet
     * @param service        Service médical associé
     */
    @Transactional
    public Medecin createMedecin(Utilisateur user, String specialite, int dureeSeance, String adresseCabinet,
            Service service) {
        Medecin medecin = new Medecin();
        medecin.setUtilisateur(user);
        medecin.setSpecialite(specialite);
        medecin.setDureeSeance(dureeSeance);
        medecin.setAdresseCabinet(adresseCabinet);
        medecin.setService(service);
        em.persist(medecin);
        em.flush(); // Ajoutez cette ligne
        return medecin;
    }

    /**
     * Retourne le nombre de médecins par service (nom du service et nombre).
     */
    public java.util.Map<String, Long> countMedecinsByService() {
        var result = new java.util.HashMap<String, Long>();
        var query = em.createQuery("SELECT s.nom, COUNT(m) FROM Medecin m JOIN m.service s GROUP BY s.nom",
                Object[].class);
        for (Object[] row : query.getResultList()) {
            result.put((String) row[0], (Long) row[1]);
        }
        return result;
    }

    /**
     * Retourne la liste de tous les médecins.
     */
    public java.util.List<Medecin> findAll() {
        return em.createQuery("SELECT m FROM Medecin m", Medecin.class).getResultList();
    }

    /**
     * Met à jour les informations d'un médecin.
     */
    @Transactional
    public Medecin updateMedecin(Long id, String specialite, Integer dureeSeance, String adresseCabinet,
            Service service) {
        Medecin medecin = em.find(Medecin.class, id);
        if (medecin == null)
            return null;
        if (specialite != null)
            medecin.setSpecialite(specialite);
        if (dureeSeance != null)
            medecin.setDureeSeance(dureeSeance);
        if (adresseCabinet != null)
            medecin.setAdresseCabinet(adresseCabinet);
        if (service != null)
            medecin.setService(service);
        em.merge(medecin);
        return medecin;
    }

    @Transactional
    public Medecin save(Medecin medecin) {
        return em.merge(medecin);
    }

    public Medecin findById(Long id) {
        return em.find(Medecin.class, id);
    }

    @Transactional
    public void delete(Long id) {
        Medecin medecin = em.find(Medecin.class, id);
        if (medecin != null) {
            em.remove(medecin);
        }
    }

    /**
     * Retourne la liste des médecins d'un service donné.
     */
    public java.util.List<Medecin> findByService(Long serviceId) {
        return em
                .createQuery("SELECT m FROM Medecin m WHERE m.service.id = :serviceId AND m.utilisateur.actif = true",
                        Medecin.class)
                .setParameter("serviceId", serviceId)
                .getResultList();
    }

    /**
     * Récupère un médecin par l'ID de son utilisateur.
     */
    public Medecin findByUtilisateurId(Long utilisateurId) {
        try {
            return em.createQuery(
                    "SELECT m FROM Medecin m WHERE m.utilisateur.id = :utilisateurId", Medecin.class)
                    .setParameter("utilisateurId", utilisateurId)
                    .getSingleResult();
        } catch (jakarta.persistence.NoResultException e) {
            return null;
        }
    }
}