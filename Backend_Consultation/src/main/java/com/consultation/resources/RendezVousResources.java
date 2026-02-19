package com.consultation.resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import com.consultation.services.RendezVousService;
import com.consultation.models.RendezVous;
import com.consultation.models.StatutRDV;

import java.util.List;

import java.util.Map;

@Path("/rendezvous")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RendezVousResources {

    @Inject
    private RendezVousService rendezVousService;

    /**
     * POST /rendezvous
     * Prendre un rendez-vous.
     * Body attendu :
     * {
     * "patientId": 1,
     * "creneauId": 10,
     * "motif": "Consultation générale"
     * }
     */
    @POST
    public Response prendreRendezVous(Map<String, Object> body) {
        try {
            Long patientId = Long.parseLong(body.get("patientId").toString());
            Long creneauId = Long.parseLong(body.get("creneauId").toString());
            String motif = body.get("motif") != null ? body.get("motif").toString() : null;

            RendezVous rdv = rendezVousService.prendreRendezVous(patientId, creneauId, motif);

            // Retourner une réponse simplifiée pour éviter les références circulaires
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("id", rdv.getId());
            response.put("motif", rdv.getMotif());
            response.put("statutRdv", rdv.getStatutRdv().name());
            response.put("dateCreation", rdv.getDateCreation() != null ? rdv.getDateCreation().toString() : null);
            if (rdv.getCreneau() != null) {
                Map<String, Object> creneauInfo = new java.util.HashMap<>();
                creneauInfo.put("id", rdv.getCreneau().getId());
                creneauInfo.put("date",
                        rdv.getCreneau().getDateDay() != null ? rdv.getCreneau().getDateDay().toString() : null);
                creneauInfo.put("heureDebut",
                        rdv.getCreneau().getHeureDebut() != null ? rdv.getCreneau().getHeureDebut().toString() : null);
                creneauInfo.put("heureFin",
                        rdv.getCreneau().getHeureFin() != null ? rdv.getCreneau().getHeureFin().toString() : null);
                response.put("creneau", creneauInfo);
            }
            response.put("message", "Rendez-vous créé avec succès");

            return Response.status(Response.Status.CREATED).entity(response).build();

        } catch (IllegalStateException e) {
            // Conflit de concurrence (double booking tenté)
            Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("code", "CONFLICT");
            return Response.status(Response.Status.CONFLICT).entity(errorResponse).build();

        } catch (IllegalArgumentException e) {
            // Données invalides (patient/créneau introuvable, créneau non disponible)
            Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("code", "BAD_REQUEST");
            return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).build();

        } catch (PersistenceException e) {
            // Violation de contrainte de base de données (ex: unique constraint)
            Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", "Ce créneau vient d'être réservé par un autre utilisateur");
            errorResponse.put("code", "CONFLICT");
            return Response.status(Response.Status.CONFLICT).entity(errorResponse).build();

        } catch (Exception e) {
            Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", "Erreur lors de la création du rendez-vous: " + e.getMessage());
            errorResponse.put("code", "INTERNAL_ERROR");
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).build();
        }
    }

    /**
     * Endpoint permettant de récupérer des statistiques globales sur les
     * consultations (rendez-vous).
     * Retourne le nombre total, le nombre de consultations réalisées (statut
     * TERMINE), et à venir (statut CONFIRME).
     *
     * Exemple de réponse JSON :
     * {
     * "total": 3200,
     * "realisees": 2500,
     * "a_venir": 500
     * }
     *
     * @return Réponse HTTP 200 avec un objet JSON contenant les statistiques.
     */
    @GET
    @Path("/stats")
    public Response getStats() {
        List<RendezVous> all = rendezVousService.findAll();
        long total = all.size();
        long realisees = all.stream().filter(r -> r.getStatutRdv() == StatutRDV.TERMINE).count();
        long aVenir = all.stream().filter(r -> r.getStatutRdv() == StatutRDV.CONFIRME).count();
        return Response.ok(
                java.util.Map.of(
                        "total", total,
                        "realisees", realisees,
                        "a_venir", aVenir))
                .build();
    }

    /**
     * GET /rendezvous/medecin/{medecinId}/stats-du-jour
     * Retourne les statistiques du jour pour un médecin :
     * - Stats avec nombre de RDV aujourd'hui et créneaux libres
     * - Liste détaillée des rendez-vous d'aujourd'hui
     * 
     * Exemple de réponse :
     * {
     * "stats": [
     * {"title": "RDV Aujourd'hui", "value": "5", "color": "blue", "bgGradient":
     * "from-blue-400 to-blue-600"},
     * {"title": "Créneaux Libres", "value": "3", "color": "green", "bgGradient":
     * "from-green-400 to-green-600"}
     * ],
     * "rdvAujourdhui": [
     * {"heure": "08:30", "patient": "Marie Dubois", "type": "Consultation",
     * "statut": "confirmé"}
     * ]
     * }
     */
    @GET
    @Path("/medecin/{medecinId}/stats-du-jour")
    public Response getStatsJourMedecin(@PathParam("medecinId") Long medecinId) {
        try {
            Map<String, Object> stats = rendezVousService.getStatsJourMedecin(medecinId);
            return Response.ok(stats).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * PUT /rendezvous/{id}/statut
     * Change le statut d'un rendez-vous
     * Body: {"statut": "TERMINE"}
     */
    @PUT
    @Path("/{id}/statut")
    public Response changerStatutRDV(@PathParam("id") Long rdvId, Map<String, Object> body) {
        try {
            String nouveauStatut = (String) body.get("statut");
            RendezVous rdv = rendezVousService.changerStatut(rdvId, nouveauStatut);
            return Response.ok(rdv).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * GET /rendezvous/medecin/{medecinId}/planning-semaine
     * Retourne le planning de la semaine courante pour un médecin
     */
    @GET
    @Path("/medecin/{medecinId}/planning-semaine")
    public Response getPlanningSemaneMedecin(@PathParam("medecinId") Long medecinId) {
        try {
            Map<String, Object> planning = rendezVousService.getPlanningSemaneMedecin(medecinId);
            return Response.ok(planning).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * GET /rendezvous/medecin/{medecinId}/historique
     * Retourne l'historique des consultations d'un médecin
     */
    @GET
    @Path("/medecin/{medecinId}/historique")
    public Response getHistoriqueMedecin(@PathParam("medecinId") Long medecinId, @QueryParam("limit") Integer limit) {
        try {
            List<RendezVous> historique = rendezVousService.getHistoriqueMedecin(medecinId, limit != null ? limit : 50);
            return Response.ok(historique).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * GET /rendezvous/patient/{patientId}
     * Retourne tous les rendez-vous d'un patient
     */
    @GET
    @Path("/patient/{patientId}")
    public Response getRendezVousPatient(@PathParam("patientId") Long patientId) {
        try {
            List<RendezVous> rdvs = rendezVousService.getRendezVousPatient(patientId);
            return Response.ok(rdvs).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * GET /rendezvous/patient/{patientId}/prochain
     * Retourne le prochain rendez-vous d'un patient
     */
    @GET
    @Path("/patient/{patientId}/prochain")
    public Response getProchainRendezVousPatient(@PathParam("patientId") Long patientId) {
        try {
            RendezVous rdv = rendezVousService.getProchainRendezVousPatient(patientId);
            if (rdv == null) {
                return Response.ok(Map.of("message", "Aucun rendez-vous à venir")).build();
            }
            return Response.ok(rdv).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * GET /rendezvous/patient/{patientId}/stats
     * Retourne les statistiques des rendez-vous d'un patient
     */
    @GET
    @Path("/patient/{patientId}/stats")
    public Response getStatsPatient(@PathParam("patientId") Long patientId) {
        try {
            Map<String, Object> stats = rendezVousService.getStatsPatient(patientId);
            return Response.ok(stats).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * DELETE /rendezvous/{rdvId}/patient/{patientId}
     * Annuler un rendez-vous par le patient
     */
    @DELETE
    @Path("/{rdvId}/patient/{patientId}")
    public Response annulerRendezVousPatient(@PathParam("rdvId") Long rdvId, @PathParam("patientId") Long patientId) {
        try {
            RendezVous rdv = rendezVousService.annulerRendezVousPatient(rdvId, patientId);
            return Response.ok(rdv).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}