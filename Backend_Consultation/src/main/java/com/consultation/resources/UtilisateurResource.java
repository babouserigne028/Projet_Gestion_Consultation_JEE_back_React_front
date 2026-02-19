
package com.consultation.resources;

import com.consultation.models.Utilisateur;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import com.consultation.services.UtilisateurService;
import com.consultation.services.MedecinService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/utilisateurs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UtilisateurResource {

    @Inject
    private UtilisateurService utilisateurService;

    /**
     * Endpoint permettant de récupérer des statistiques globales sur les
     * utilisateurs.
     * Retourne le nombre total d'utilisateurs, ainsi que le détail par rôle
     * (patients, médecins, admins).
     *
     * Exemple de réponse JSON :
     * {
     * "total": 1240,
     * "patients": 900,
     * "medecins": 300,
     * "admins": 40
     * }
     *
     * @return Réponse HTTP 200 avec un objet JSON contenant les statistiques.
     */
    @GET
    @Path("/stats")
    public Response getStats() {
        long total = utilisateurService.findAll().size();
        long patients = utilisateurService.findAll().stream().filter(u -> u.getRole().name().equals("PATIENT")).count();
        long medecins = utilisateurService.findAll().stream().filter(u -> u.getRole().name().equals("MEDECIN")).count();
        long admins = utilisateurService.findAll().stream().filter(u -> u.getRole().name().equals("ADMIN")).count();
        return Response.ok(
                java.util.Map.of(
                        "total", total,
                        "patients", patients,
                        "medecins", medecins,
                        "admins", admins))
                .build();
    }

    @GET
    public List<Utilisateur> getAll() {
        return utilisateurService.findAll();
    }

    /**
     * Endpoint pour obtenir la liste des administrateurs (ADMIN).
     * 
     * @return liste des utilisateurs avec le rôle ADMIN
     */
    @GET
    @Path("/admins")
    public List<Utilisateur> getAdmins() {
        return utilisateurService.findAll().stream()
                .filter(u -> u.getRole() != null && u.getRole().name().equals("ADMIN"))
                .toList();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Utilisateur user = utilisateurService.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(user).build();
    }

    @POST
    @Transactional
    public Response create(Utilisateur utilisateur) {
        Utilisateur created = utilisateurService.create(utilisateur);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Utilisateur utilisateur) {
        try {
            Utilisateur updated = utilisateurService.update(id, utilisateur);
            if (updated == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.ok(updated).build();
        } catch (Exception e) {
            e.printStackTrace(); // Log l'exception côté serveur
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erreur lors de la mise à jour : " + e.getMessage())
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = utilisateurService.delete(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }

    /**
     * Endpoint pour obtenir le nombre de médecins par service (nom du service et
     * nombre).
     * Exemple de réponse JSON : { "Cardiologie": 40, "Dermatologie": 25, ... }
     */
    @Inject
    private MedecinService medecinService;

    @GET
    @Path("/medecin-par-service")
    public Response getMedecinsParService() {
        return Response.ok(medecinService.countMedecinsByService()).build();
    }

    /**
     * Met à jour les infos de l'utilisateur courant (endpoint /me)
     * Nécessite un header Authorization: Bearer <token>
     */
    @PUT
    @Path("/me")
    @Transactional
    public Response updateCurrentUser(Utilisateur data, @HeaderParam("Authorization") String authHeader) {
        try {
            // Extraction simplifiée de l'email depuis le JWT (à adapter selon ta logique)
            String email = extractEmailFromJwt(authHeader);
            if (email == null) {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Token invalide ou manquant").build();
            }
            Utilisateur current = utilisateurService.findByEmail(email);
            if (current == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            // Créer un objet pour les modifications (sans altérer l'objet original avant update)
            Utilisateur updateData = new Utilisateur();
            updateData.setNom(data.getNom() != null ? data.getNom() : current.getNom());
            updateData.setPrenom(data.getPrenom() != null ? data.getPrenom() : current.getPrenom());
            updateData.setEmail(data.getEmail() != null ? data.getEmail() : current.getEmail());
            updateData.setTelephone(data.getTelephone() != null ? data.getTelephone() : current.getTelephone());
            updateData.setRole(data.getRole() != null ? data.getRole() : current.getRole());
            updateData.setActif(data.isActif()); // boolean, pas de null check
            // Pour le mot de passe, on le passe seulement s'il est fourni
            if (data.getMotDePasse() != null && !data.getMotDePasse().isBlank()) {
                updateData.setMotDePasse(data.getMotDePasse());
            }
            Utilisateur updated = utilisateurService.update(current.getId(), updateData);
            return Response.ok(updated).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erreur lors de la mise à jour : " + e.getMessage())
                    .build();
        }
    }

    // Méthode utilitaire pour extraire l'email du JWT (extraction simplifiée, à
    // adapter)
    private String extractEmailFromJwt(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            return null;
        String token = authHeader.substring(7);
        try {
            io.jsonwebtoken.Claims claims = io.jsonwebtoken.Jwts.parserBuilder()
                    .setSigningKey("super-secret-key-very-long-and-secure-123"
                            .getBytes(java.nio.charset.StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject(); // l'email est dans subject
        } catch (Exception e) {
            return null;
        }
    }
}
