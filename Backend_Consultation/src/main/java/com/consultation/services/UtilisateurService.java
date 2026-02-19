package com.consultation.services;

import com.consultation.models.Utilisateur;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class UtilisateurService {

    @Inject
    EntityManager em;

    public List<Utilisateur> findAll() {
        return em.createQuery("SELECT u FROM Utilisateur u", Utilisateur.class).getResultList();
    }

    public Utilisateur findById(Long id) {
        return em.find(Utilisateur.class, id);
    }

    public Utilisateur create(Utilisateur utilisateur) {
        em.persist(utilisateur);
        return utilisateur;
    }

    public Utilisateur update(Long id, Utilisateur utilisateur) {
        Utilisateur existing = em.find(Utilisateur.class, id);
        if (existing == null)
            return null;
        String newEmail = utilisateur.getEmail() != null ? utilisateur.getEmail().trim().toLowerCase() : null;
        String oldEmail = existing.getEmail() != null ? existing.getEmail().trim().toLowerCase() : null;
        System.out.println("[DEBUG] oldEmail=" + oldEmail + ", newEmail=" + newEmail);
        // Vérifier unicité de l'email uniquement si l'email est modifié
        if (newEmail != null && !newEmail.equals(oldEmail)) {
            System.out.println("[DEBUG] L'email a été modifié, vérification unicité...");
            List<Utilisateur> usersWithSameEmail = em
                    .createQuery("SELECT u FROM Utilisateur u WHERE LOWER(TRIM(u.email)) = :email AND u.id <> :id",
                            Utilisateur.class)
                    .setParameter("email", newEmail)
                    .setParameter("id", id)
                    .getResultList();
            if (!usersWithSameEmail.isEmpty()) {
                System.out.println("[DEBUG] Email déjà utilisé par un autre utilisateur !");
                throw new RuntimeException("Cet email est déjà utilisé par un autre utilisateur.");
            }
        }
        existing.setNom(utilisateur.getNom());
        existing.setPrenom(utilisateur.getPrenom());
        existing.setTelephone(utilisateur.getTelephone());
        existing.setEmail(utilisateur.getEmail());
        // Hash le mot de passe uniquement si il a changé et n'est pas déjà un hash BCrypt
        if (utilisateur.getMotDePasse() != null && !utilisateur.getMotDePasse().isBlank()) {
            String newPwd = utilisateur.getMotDePasse();
            String currentHash = existing.getMotDePasse();
            // Si le mot de passe reçu n'est pas déjà un hash BCrypt (commence par $2a$ ou $2b$ ou $2y$)
            if (!newPwd.equals(currentHash)) {
                if (newPwd.startsWith("$2a$") || newPwd.startsWith("$2b$") || newPwd.startsWith("$2y$")) {
                    // On suppose que c'est déjà un hash BCrypt, on le stocke tel quel
                    existing.setMotDePasse(newPwd);
                } else {
                    // Sinon, on hash le mot de passe en clair
                    String hash = BCrypt.hashpw(newPwd, BCrypt.gensalt());
                    existing.setMotDePasse(hash);
                }
            }
        }
        existing.setRole(utilisateur.getRole());
        existing.setActif(utilisateur.isActif());
        em.merge(existing);
        return existing;
    }

    public boolean delete(Long id) {
        Utilisateur user = em.find(Utilisateur.class, id);
        if (user == null)
            return false;
        em.remove(user);
        return true;
    }
    // Recherche un utilisateur par email (null si non trouvé)
    public Utilisateur findByEmail(String email) {
        try {
            return em.createQuery("SELECT u FROM Utilisateur u WHERE u.email = :email", Utilisateur.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (jakarta.persistence.NoResultException e) {
            return null;
        }
    }
}
