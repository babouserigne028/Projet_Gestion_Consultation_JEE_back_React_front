package com.consultation.services;

import com.consultation.models.Service;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class ServiceService {

    @PersistenceContext
    private EntityManager em;

    public List<Service> findAll() {
        return em.createQuery("SELECT s FROM Service s", Service.class).getResultList();
    }

    public Service findById(Long id) {
        return em.find(Service.class, id);
    }

    @Transactional
    public Service create(Service service) {
        em.persist(service);
        em.flush();
        return service;
    }

    @Transactional
    public Service update(Long id, Service updatedService) {
        Service existing = em.find(Service.class, id);
        if (existing == null) {
            throw new IllegalArgumentException("Service non trouvé");
        }
        existing.setNom(updatedService.getNom());
        existing.setDescription(updatedService.getDescription());
        // Ajoute ici d’autres champs à mettre à jour si besoin
        Service merged = em.merge(existing);
        return merged;
    }

    @Transactional
    public void delete(Long id) {
        Service service = em.find(Service.class, id);
        if (service != null) {
            em.remove(service);
        }
    }
}