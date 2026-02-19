package com.consultation.resources;

import com.consultation.models.Service;
import com.consultation.services.ServiceService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/services")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ServicesResource {

    @Inject
    private ServiceService serviceService;

    /**
     * GET /services
     * Récupérer tous les services
     * Réponse :
     * [
     *   { "id": 1, "nom": "Cardiologie" },
     *   { "id": 2, "nom": "Pédiatrie" }
     * ]
     */

    @GET
    public List<Service> getAll() {
        List<Service> services = serviceService.findAll();
        System.out.println("Services trouvés : " + services);
        return services;
    }

    /**
     * GET /services/{id}
     * Récupérer un service par id
     * Réponse :
     * { "id": 1, "nom": "Cardiologie" }
     */

    @GET
    @Path("/{id}")
    public Service getById(@PathParam("id") Long id) {
        return serviceService.findById(id);
    }

    /**
     * POST /services
     * Créer un service
     * Body :
     * { "nom": "Radiologie" }
     * Réponse :
     * { "id": 3, "nom": "Radiologie" }
     */

    @POST
    @Transactional
    public Response create(Service service) {
        Service created = serviceService.create(service);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

        
    /**
     * PUT /services/{id}
     * Modifier un service
     * Body :
     * { "nom": "Cardiologie Avancée" }
     * Réponse :
     * { "id": 1, "nom": "Cardiologie Avancée" }
     */

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Service service) {
        Service updated = serviceService.update(id, service);
        return Response.ok(updated).build();
    }

    /**
     * DELETE /services/{id}
     * Supprimer un service
     * Réponse : 204 No Content
     */
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        serviceService.delete(id);
        return Response.noContent().build();
    }

    /**
     * Endpoint pour obtenir le nombre total de services médicaux.
     * Exemple de réponse JSON : { "total": 18 }
     */
    @GET
    @Path("/stats")
    public Response getStats() {
        long total = serviceService.findAll().size();
        return Response.ok(java.util.Map.of("total", total)).build();
    }

}