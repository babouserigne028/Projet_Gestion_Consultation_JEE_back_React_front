package com.consultation.resources;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.consultation.models.Utilisateur;
import com.consultation.services.AuthService;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import com.consultation.models.Role;

import java.util.HashMap;
import java.util.Map;

@Path("/auth")
@Singleton
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    /**
     * Inscription d'un nouvel utilisateur
     */
    @Inject
    private AuthService authService;

    /**
     * Inscription d'un nouvel utilisateur
     *
     * Exemple body pour un patient :
     * {
     * "nom": "Diallo",
     * "prenom": "Amina",
     * "email": "amina.diallo@mail.com",
     * "motDePasse": "monMotDePasse",
     * "telephone": "771234567",
     * "role": "PATIENT",
     * "actif": true,
     * "dateNaissance": "2000-05-12",
     * "adresse": "123 rue de Dakar"
     * }
     *
     * Exemple body pour un médecin :
     * {
     * "nom": "Fall",
     * "prenom": "Moussa",
     * "email": "moussa.fall@mail.com",
     * "motDePasse": "passer",
     * "telephone": "781234567",
     * "role": "MEDECIN",
     * "actif": true,
     * "specialite": "Cardiologie",
     * "dureeSeance": 30,
     * "adresseCabinet": "45 avenue Blaise Diagne",
     * "serviceId": 1
     * }
     *
     * {
     * "nom": "BABOU",
     * "prenom": "Serigne Abdoulaye",
     * "email": "babouserigne028@gmail.com",
     * "motDePasse": "passer",
     * "telephone": "+221 77 165 11 37",
     * "role": "ADMIN",
     * "actif": true
     * }
     */
    @POST
    @Path("/register")
    @Transactional
    public Response register(Map<String, Object> json) {
        try {
            Utilisateur user = new Utilisateur();
            user.setNom((String) json.get("nom"));
            user.setPrenom((String) json.get("prenom"));
            user.setEmail((String) json.get("email"));
            user.setMotDePasse((String) json.get("motDePasse"));
            user.setTelephone((String) json.get("telephone"));
            user.setActif(json.get("actif") == null ? true : Boolean.parseBoolean(json.get("actif").toString()));
            user.setRole(Role.valueOf((String) json.get("role")));

            java.time.LocalDate dateNaissance = null;
            String adresse = null;
            if (user.getRole() == Role.PATIENT) {
                if (json.get("dateNaissance") != null) {
                    dateNaissance = java.time.LocalDate.parse((String) json.get("dateNaissance"));
                }
                if (json.get("adresse") != null) {
                    adresse = (String) json.get("adresse");
                }
            }

            String specialite = null;
            Integer dureeSeance = null;
            String adresseCabinet = null;
            Long serviceId = null;

            if (user.getRole() == Role.MEDECIN) {
                if (json.get("specialite") != null) {
                    specialite = (String) json.get("specialite");
                }
                if (json.get("dureeSeance") != null) {
                    dureeSeance = Integer.parseInt(json.get("dureeSeance").toString());
                }
                if (json.get("adresseCabinet") != null) {
                    adresseCabinet = (String) json.get("adresseCabinet");
                }
                if (json.get("serviceId") != null) {
                    serviceId = Long.parseLong(json.get("serviceId").toString());
                }
            }

            Utilisateur created = authService.register(user, dateNaissance, adresse, specialite, dureeSeance,
                    adresseCabinet, serviceId);

            // Si c'est un patient, retourner l'objet Patient (avec id)
            if (created.getRole() == Role.PATIENT) {
                // On va chercher le patient lié à cet utilisateur
                com.consultation.models.Patient patient = null;
                try {
                    Object patientServiceObj = authService.getClass().getDeclaredField("patientService")
                            .get(authService);
                    @SuppressWarnings("unchecked")
                    java.util.List<com.consultation.models.Patient> patients = (java.util.List<com.consultation.models.Patient>) patientServiceObj
                            .getClass().getMethod("getAllPatients").invoke(patientServiceObj);
                    patient = patients.stream()
                            .filter(p -> p.getUtilisateur() != null
                                    && p.getUtilisateur().getId().equals(created.getId()))
                            .findFirst()
                            .orElse(null);
                } catch (Exception ex) {
                    // fallback silencieux
                }
                if (patient != null) {
                    return Response.status(Response.Status.CREATED).entity(patient).build();
                }
            }
            return Response.status(Response.Status.CREATED).entity(created).build();
        } catch (Exception e) {
            String message = e.getMessage();
            if (message != null) {
                if (message.contains("Duplicate") && message.contains("email")) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity("{\"error\":\"Cet email est déjà utilisé.\"}")
                            .build();
                } else if (message.contains("Duplicate") && message.contains("telephone")) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity("{\"error\":\"Ce numéro de téléphone est déjà utilisé.\"}")
                            .build();
                }
            }
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + message.replaceAll("\"", "'") + "\"}")
                    .build();
        }
    }

    /**
     * Authentification de l'utilisateur
     */
    /**
     * Authentification de l'utilisateur
     *
     * Exemple body pour login :
     * {
     * "email": "babouserigne028@gmail.com",
     * "motDePasse": "passer"
     * }
     */
    @POST
    @Path("/login")
    public Response login(Utilisateur credentials) {
        try {
            Map<String, Object> response = authService.login(credentials.getEmail(), credentials.getMotDePasse());
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Déconnexion de l'utilisateur
     * Ce endpoint peut être adapté selon la gestion du token côté client (ex:
     * suppression côté client ou blacklist côté serveur)
     */
    @POST
    @Path("/logout")
    public Response logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Déconnexion réussie.");
        return Response.ok(response).build();
    }
}