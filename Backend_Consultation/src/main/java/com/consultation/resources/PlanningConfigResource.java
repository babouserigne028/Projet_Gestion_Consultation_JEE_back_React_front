package com.consultation.resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.consultation.services.PlanningConfigService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import com.consultation.models.PlanningConfig;
import jakarta.inject.Inject;

@Path("/planning-config")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PlanningConfigResource {

    @Inject
    private PlanningConfigService planningConfigService;

    /**
     * POST /planning-config/{medecinId}
     * Ajouter une configuration de planning pour un médecin
     * Body attendu (PlanningConfig JSON)
     */
    @POST
    @Path("/{medecinId}")
    public Response addPlanningConfig(@PathParam("medecinId") Long medecinId, PlanningConfig config) {
        PlanningConfig created = planningConfigService.createPlanningConfig(medecinId, config);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    /**
     * POST /planning-config/{medecinId}/plage
     * Récupérer tous les plannings et créneaux d’un médecin sur une plage de dates.
     * Body attendu :
     * {
     * "dateDebut": "2026-02-14",
     * "dateFin": "2026-02-16"
     * }
     * Retourne la liste des plannings et créneaux du médecin pour chaque date
     * comprise dans la plage.
     * Si aucun planning n’est trouvé, retourne une erreur 404.
     */
    @POST
    @Path("/{medecinId}/plage")
    public Response getPlanningsByDateRangeFromBody(
            @PathParam("medecinId") Long medecinId,
            Map<String, Object> body) {

        String dateDebutStr = body.get("dateDebut") != null ? body.get("dateDebut").toString() : null;
        String dateFinStr = body.get("dateFin") != null ? body.get("dateFin").toString() : null;

        if (dateDebutStr == null || dateFinStr == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Les champs dateDebut et dateFin sont obligatoires dans le body.\"}").build();
        }

        LocalDate dateDebut = LocalDate.parse(dateDebutStr);
        LocalDate dateFin = LocalDate.parse(dateFinStr);

        List<PlanningConfigService.PlanningConfigWithCreneaux> result = planningConfigService
                .getPlanningsWithCreneauxInRange(medecinId, dateDebut, dateFin);

        if (result.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"Aucun planning trouvé pour ce médecin dans la plage demandée.\"}").build();
        }
        return Response.ok(result).build();
    }

    /**
     * POST /planning-config/multi/{medecinId}
     * Ajouter des plannings pour plusieurs dates pour un médecin.
     * Body attendu :
     * {
     *   "dates": ["2026-02-14", "2026-02-15"],
     *   "heureDebut": "08:00",
     *   "heureFin": "17:00"
     * }
     * Retourne les plannings créés, les dates ignorées et un message.
     */
    @POST
    @Path("/multi/{medecinId}")
    public Response addPlanningConfigMulti(@PathParam("medecinId") Long medecinId, Map<String, Object> body) {
        Object datesObj = body.get("dates");
        List<LocalDate> dates;

        if (datesObj instanceof List<?>) {
            dates = ((List<?>) datesObj).stream()
                    .map(Object::toString)
                    .map(LocalDate::parse)
                    .toList();
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Le champ 'dates' doit être une liste de chaînes.\"}").build();
        }

        String heureDebutStr = body.get("heureDebut").toString();
        String heureFinStr = body.get("heureFin").toString();

        LocalTime heureDebut = LocalTime.parse(heureDebutStr);
        LocalTime heureFin = LocalTime.parse(heureFinStr);

        PlanningConfigService.PlanningCreationResult result = planningConfigService.createPlanningConfigForDates(
                medecinId, dates, heureDebut, heureFin);
        return Response.status(Response.Status.CREATED).entity(result).build();
    }
}