package com.consultation.services;

import jakarta.persistence.PersistenceContext;
import com.consultation.models.Service;
import com.consultation.models.Utilisateur;
import com.consultation.models.Role;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDate;

@ApplicationScoped
public class AuthService {
    
    @jakarta.inject.Inject
    private ServiceService serviceService;

    @PersistenceContext(unitName = "consultationPU")
    private EntityManager em;

    @jakarta.inject.Inject
    private PatientService patientService;
    @jakarta.inject.Inject
    private MedecinService medecinService;

    // Setters pour injection manuelle
    public void setPatientService(PatientService patientService) {
        this.patientService = patientService;
    }

    public void setMedecinService(MedecinService medecinService) {
        this.medecinService = medecinService;
    }

    private static final String SECRET_KEY = "super-secret-key-very-long-and-secure-123"; // À sécuriser en prod

    private Key getSigningKey() {
        return new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @Transactional
    public Utilisateur register(
            Utilisateur user,
            LocalDate dateNaissance,
            String adresse,
            String specialite,
            Integer dureeSeance,
            String adresseCabinet,
            Long serviceId) {
        if (user.getEmail() == null || user.getMotDePasse() == null || user.getRole() == null) {
            throw new IllegalArgumentException("Email, role et mot de passe requis");
        }
        // Vérifier unicité email
        if (emailExists(user.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }
        // Hash du mot de passe
        String hash = BCrypt.hashpw(user.getMotDePasse(), BCrypt.gensalt());
        user.setMotDePasse(hash);
        em.persist(user);
        em.flush();

        if (user.getRole() == Role.PATIENT) {
            patientService.createPatient(user, dateNaissance, adresse);
        } else if (user.getRole() == Role.MEDECIN) {
            Service service = null;
            if (serviceId != null) {
                service = serviceService.findById(serviceId);
                if (service == null) {
                    throw new IllegalArgumentException("Service médical non trouvé pour l'id " + serviceId);
                }
            }
            medecinService.createMedecin(user, specialite, dureeSeance != null ? dureeSeance : 0, adresseCabinet,
                    service);
        }
        return user;
    }

    public java.util.Map<String, Object> login(String email, String motDePasse) {
        Utilisateur user = findByEmail(email);
        if (user == null || !BCrypt.checkpw(motDePasse, user.getMotDePasse())) {
            throw new SecurityException("Email ou mot de passe incorrect");
        }
        // Génération du JWT
        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
        // Masquer le mot de passe
        user.setMotDePasse(null);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("token", token);
        result.put("user", user);

        // Ajouter patientId ou medecinId selon le rôle
        if (user.getRole() == Role.PATIENT) {
            com.consultation.models.Patient patient = patientService.getByUtilisateurId(user.getId());
            if (patient != null) {
                result.put("patientId", patient.getId());
            }
        } else if (user.getRole() == Role.MEDECIN) {
            com.consultation.models.Medecin medecin = medecinService.findByUtilisateurId(user.getId());
            if (medecin != null) {
                result.put("medecinId", medecin.getId());
            }
        }

        return result;
    }

    public String getRole(String email) {
        Utilisateur user = findByEmail(email);
        if (user == null)
            throw new IllegalArgumentException("Utilisateur non trouvé");
        return user.getRole().name();
    }

    private Utilisateur findByEmail(String email) {
        try {
            return em.createQuery("SELECT u FROM Utilisateur u WHERE u.email = :email", Utilisateur.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    private boolean emailExists(String email) {
        return findByEmail(email) != null;
    }
}