
package com.consultation.resources;

import com.consultation.models.Medecin;
import com.consultation.services.MedecinService;
import com.consultation.services.UtilisateurService;
import com.consultation.services.ServiceService;
import com.consultation.models.Utilisateur;
import com.consultation.models.Role;
import com.consultation.models.Service;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.PathParam;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@Path("/medecins")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MedecinResource {
    @Inject
    private MedecinService medecinService;
    @Inject
    private UtilisateurService utilisateurService;
    @Inject
    private ServiceService serviceService;

    @POST
    @Path("/register")
    @Transactional
    public Response registerMedecin(Map<String, Object> data) {
        try {
            Utilisateur utilisateur = new Utilisateur();
            utilisateur.setNom((String) data.get("nom"));
            utilisateur.setPrenom((String) data.get("prenom"));
            utilisateur.setEmail((String) data.get("email"));
            utilisateur.setMotDePasse((String) data.get("motDePasse"));
            utilisateur.setTelephone((String) data.get("telephone"));
            utilisateur.setRole(Role.valueOf((String) data.get("role")));
            utilisateur.setActif((Boolean) data.getOrDefault("actif", true));
            Utilisateur created = utilisateurService.create(utilisateur);

            String specialite = (String) data.get("specialite");
            int dureeSeance = 0;
            Object dureeObj = data.get("dureeSeance");
            if (dureeObj != null) {
                if (dureeObj instanceof Number) {
                    dureeSeance = ((Number) dureeObj).intValue();
                } else if (dureeObj instanceof String) {
                    String s = ((String) dureeObj).trim();
                    if (!s.isEmpty()) {
                        dureeSeance = Integer.parseInt(s);
                    }
                }
            }
            String adresseCabinet = (String) data.get("adresseCabinet");
            Long serviceId = null;
            Object serviceIdObj = data.get("serviceId");
            if (serviceIdObj != null) {
                if (serviceIdObj instanceof Number) {
                    serviceId = ((Number) serviceIdObj).longValue();
                } else if (serviceIdObj instanceof String) {
                    String s = ((String) serviceIdObj).trim();
                    if (!s.isEmpty()) {
                        serviceId = Long.parseLong(s);
                    }
                }
            }
            Service service = serviceId != null ? serviceService.findById(serviceId) : null;

            medecinService.createMedecin(created, specialite, dureeSeance, adresseCabinet, service);
            return Response.status(Response.Status.CREATED).entity(created).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Erreur lors de l'inscription du médecin : " + e.getMessage()).build();
        }
    }

    @GET
    public List<Map<String, ? extends Object>> getAllMedecins() {
        List<Medecin> medecins = medecinService.findAll();
        return medecins.stream().map(m -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", m.getId());
            map.put("nom", m.getUtilisateur().getNom());
            map.put("prenom", m.getUtilisateur().getPrenom());
            map.put("email", m.getUtilisateur().getEmail());
            map.put("telephone", m.getUtilisateur().getTelephone());
            map.put("role", m.getUtilisateur().getRole().name());
            map.put("actif", m.getUtilisateur().isActif());
            map.put("specialite", m.getSpecialite());
            map.put("dureeSeance", m.getDureeSeance());
            map.put("adresseCabinet", m.getAdresseCabinet());
            map.put("serviceId", m.getService() != null ? m.getService().getId() : null);
            return map;
        }).collect(Collectors.toList());
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateMedecin(@PathParam("id") Long id, Map<String, Object> data) {
        try {
            Medecin medecin = medecinService.findById(id);
            if (medecin == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("Médecin non trouvé").build();
            }
            Utilisateur utilisateur = medecin.getUtilisateur();
            // Mise à jour des infos utilisateur si présentes dans le JSON
            if (data.containsKey("nom"))
                utilisateur.setNom((String) data.get("nom"));
            if (data.containsKey("prenom"))
                utilisateur.setPrenom((String) data.get("prenom"));
            if (data.containsKey("email"))
                utilisateur.setEmail((String) data.get("email"));
            if (data.containsKey("motDePasse"))
                utilisateur.setMotDePasse((String) data.get("motDePasse"));
            if (data.containsKey("telephone"))
                utilisateur.setTelephone((String) data.get("telephone"));
            if (data.containsKey("actif"))
                utilisateur.setActif((Boolean) data.get("actif"));

            // Mise à jour des infos medecin
            if (data.containsKey("specialite"))
                medecin.setSpecialite((String) data.get("specialite"));

            Integer dureeSeance = null;
            Object dureeObj = data.get("dureeSeance");
            if (dureeObj != null) {
                if (dureeObj instanceof Number) {
                    dureeSeance = ((Number) dureeObj).intValue();
                } else if (dureeObj instanceof String) {
                    String s = ((String) dureeObj).trim();
                    if (!s.isEmpty()) {
                        try {
                            dureeSeance = Integer.parseInt(s);
                        } catch (NumberFormatException ex) {
                            return Response.status(Response.Status.BAD_REQUEST)
                                    .entity("dureeSeance doit être un entier valide").build();
                        }
                    }
                } else {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity("dureeSeance doit être un entier ou une chaîne représentant un entier").build();
                }
                medecin.setDureeSeance(dureeSeance);
            }
            if (data.containsKey("adresseCabinet"))
                medecin.setAdresseCabinet((String) data.get("adresseCabinet"));

            Long serviceId = null;
            Object serviceIdObj = data.get("serviceId");
            if (serviceIdObj != null) {
                if (serviceIdObj instanceof Number) {
                    serviceId = ((Number) serviceIdObj).longValue();
                } else if (serviceIdObj instanceof String) {
                    String s = ((String) serviceIdObj).trim();
                    if (!s.isEmpty()) {
                        try {
                            serviceId = Long.parseLong(s);
                        } catch (NumberFormatException ex) {
                            return Response.status(Response.Status.BAD_REQUEST)
                                    .entity("serviceId doit être un entier valide").build();
                        }
                    }
                } else {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity("serviceId doit être un entier ou une chaîne représentant un entier").build();
                }
                Service service = serviceId != null ? serviceService.findById(serviceId) : null;
                medecin.setService(service);
            }

            // Persister les modifications
            utilisateurService.update(utilisateur.getId(), utilisateur);
            medecinService.save(medecin);
            return Response.ok(medecin).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Erreur lors de la mise à jour du médecin : " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteMedecin(@PathParam("id") Long id) {
        try {
            Medecin medecin = medecinService.findById(id);
            if (medecin == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("Médecin non trouvé").build();
            }
            medecinService.delete(id);
            return Response.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Erreur lors de la suppression du médecin : " + e.getMessage()).build();
        }
    }

    /**
     * GET /medecins/service/{serviceId}
     * Retourne tous les médecins d'un service donné
     */
    @GET
    @Path("/service/{serviceId}")
    public Response getMedecinsByService(@PathParam("serviceId") Long serviceId) {
        try {
            List<Medecin> medecins = medecinService.findByService(serviceId);
            List<Map<String, Object>> result = medecins.stream().map(m -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", m.getId());
                map.put("nom", m.getUtilisateur().getNom());
                map.put("prenom", m.getUtilisateur().getPrenom());
                map.put("email", m.getUtilisateur().getEmail());
                map.put("telephone", m.getUtilisateur().getTelephone());
                map.put("specialite", m.getSpecialite());
                map.put("dureeSeance", m.getDureeSeance());
                map.put("adresseCabinet", m.getAdresseCabinet());
                map.put("actif", m.getUtilisateur().isActif());
                map.put("serviceId", m.getService() != null ? m.getService().getId() : null);
                map.put("serviceName", m.getService() != null ? m.getService().getNom() : null);
                return map;
            }).collect(Collectors.toList());
            return Response.ok(result).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}
