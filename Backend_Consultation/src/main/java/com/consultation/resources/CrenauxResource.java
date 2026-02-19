package com.consultation.resources;

import com.consultation.models.Crenaux;
import com.consultation.services.CrenauxService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Path("/creneaux")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CrenauxResource {

    @Inject
    private CrenauxService crenauxService;

    /**
     * GET /creneaux/medecin/{medecinId}
     * Retourne tous les créneaux d'un médecin
     */
    @GET
    @Path("/medecin/{medecinId}")
    public Response getCrenauxMedecin(
            @PathParam("medecinId") Long medecinId,
            @QueryParam("date") String date,
            @QueryParam("statut") String statut) {
        try {
            List<Crenaux> creneaux = crenauxService.getCrenauxMedecin(medecinId, date, statut);
            return Response.ok(creneaux).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * POST /creneaux/medecin/{medecinId}/generate
     * Génère des créneaux pour un médecin
     * Body: {
     * "dateDebut": "2024-02-18",
     * "dateFin": "2024-02-25",
     * "heureDebut": "08:00",
     * "heureFin": "17:00",
     * "dureeSeance": 30,
     * "pauseHeure": "12:00-13:00"
     * }
     */
    @POST
    @Path("/medecin/{medecinId}/generate")
    public Response genererCreneaux(@PathParam("medecinId") Long medecinId, Map<String, Object> configCreneaux) {
        try {
            List<Crenaux> creneauxGeneres = crenauxService.genererCreneaux(medecinId, configCreneaux);
            return Response.status(Response.Status.CREATED).entity(creneauxGeneres).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * PUT /creneaux/{id}/statut
     * Change le statut d'un créneau
     * Body: {"statut": "LIBRE"}
     */
    @PUT
    @Path("/{id}/statut")
    public Response changerStatutCreneau(@PathParam("id") Long creneauId, Map<String, Object> body) {
        try {
            String nouveauStatut = (String) body.get("statut");
            Crenaux creneau = crenauxService.changerStatut(creneauId, nouveauStatut);
            return Response.ok(creneau).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * GET /creneaux/medecin/{medecinId}/disponibles
     * Retourne les créneaux disponibles (LIBRE) d'un médecin avec les dates
     */
    @GET
    @Path("/medecin/{medecinId}/disponibles")
    public Response getCreneauxDisponibles(@PathParam("medecinId") Long medecinId) {
        try {
            List<Crenaux> creneaux = crenauxService.getCrenauxMedecin(medecinId, null, "LIBRE");
            // Transformer pour inclure la date (car dateDay est @JsonIgnore)
            List<Map<String, Object>> result = creneaux.stream().map(c -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", c.getId());
                map.put("date", c.getDateDay().toString());
                map.put("heureDebut", c.getHeureDebut().toString());
                map.put("heureFin", c.getHeureFin().toString());
                map.put("statut", c.getStatut().name());
                return map;
            }).collect(java.util.stream.Collectors.toList());
            return Response.ok(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}