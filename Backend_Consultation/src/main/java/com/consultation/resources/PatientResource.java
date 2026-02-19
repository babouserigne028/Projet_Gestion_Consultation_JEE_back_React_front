package com.consultation.resources;

import com.consultation.models.Patient;
import com.consultation.services.PatientService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/patients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PatientResource {
    @Inject
    private PatientService patientService;

    /**
     * Récupère la liste de tous les patients.
     * 
     * @return liste des patients
     */
    @GET
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    /**
     * Ajoute un nouveau patient (et son utilisateur associé).
     * 
     * @param patient le patient à ajouter (JSON avec utilisateur)
     * @return 201 CREATED si succès
     */
    @POST
    public Response addPatient(Patient patient) {
        try {
            patientService.addPatient(patient);
            return Response.status(Response.Status.CREATED).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        } catch (jakarta.persistence.PersistenceException | jakarta.ejb.EJBException e) {
            Throwable cause = e.getCause();
            while (cause != null && cause.getCause() != null)
                cause = cause.getCause();
            String msg = cause != null && cause.getMessage() != null ? cause.getMessage() : e.getMessage();
            if (msg != null && msg.contains("Duplicate entry")) {
                return Response.status(Response.Status.CONFLICT)
                        .entity("{\"error\":\"Un utilisateur avec cet email ou téléphone existe déjà.\"}")
                        .build();
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Erreur lors de l'ajout du patient.\"}")
                    .build();
        }
    }

    /**
     * Met à jour un patient existant (et son utilisateur associé).
     * 
     * @param id      l'identifiant du patient à modifier
     * @param patient les nouvelles données (JSON avec utilisateur)
     * @return 200 OK si succès
     */
    @PUT
    @Path("/{id}")
    public Response updatePatient(@PathParam("id") Long id, Patient patient) {
        try {
            patientService.updatePatient(id, patient);
            return Response.ok().build();
        } catch (jakarta.persistence.PersistenceException | jakarta.ejb.EJBException e) {
            Throwable cause = e.getCause();
            while (cause != null && cause.getCause() != null)
                cause = cause.getCause();
            String msg = cause != null && cause.getMessage() != null ? cause.getMessage() : e.getMessage();
            if (msg != null && msg.contains("Duplicate entry")) {
                return Response.status(Response.Status.CONFLICT)
                        .entity("{\"error\":\"Un utilisateur avec cet email ou téléphone existe déjà.\"}")
                        .build();
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Erreur lors de la modification du patient.\"}")
                    .build();
        }
    }

    /**
     * Supprime un patient (et son utilisateur associé).
     * 
     * @param id l'identifiant du patient à supprimer
     * @return 204 No Content si succès
     */
    @DELETE
    @Path("/{id}")
    public Response deletePatient(@PathParam("id") Long id) {
        patientService.deletePatient(id);
        return Response.noContent().build();
    }

    /**
     * GET /patients/medecin/{medecinId}/recent
     * Retourne les patients récents d'un médecin (ayant eu des RDV récemment)
     */
    @GET
    @Path("/medecin/{medecinId}/recent")
    public Response getPatientsRecentsMedecin(@PathParam("medecinId") Long medecinId,
            @QueryParam("limit") Integer limit) {
        try {
            List<Patient> patients = patientService.getPatientsRecentsMedecin(medecinId, limit != null ? limit : 20);
            return Response.ok(patients).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * GET /patients/byUtilisateur/{utilisateurId}
     * Récupère un patient par l'ID de son utilisateur
     */
    @GET
    @Path("/byUtilisateur/{utilisateurId}")
    public Response getByUtilisateurId(@PathParam("utilisateurId") Long utilisateurId) {
        try {
            Patient patient = patientService.getByUtilisateurId(utilisateurId);
            if (patient == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"error\":\"Patient non trouvé pour cet utilisateur\"}")
                        .build();
            }
            return Response.ok(patient).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * GET /patients/{id}
     * Récupère un patient par son ID
     */
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        try {
            Patient patient = patientService.getById(id);
            if (patient == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"error\":\"Patient non trouvé\"}")
                        .build();
            }
            return Response.ok(patient).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}
