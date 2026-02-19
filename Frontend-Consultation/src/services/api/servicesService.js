import apiClient from "./client";

/**
 * Service pour récupérer le nombre total de services médicaux
 * Exemple de réponse : { total: 18 }
 */
const servicesService = {
  /**
   * Récupère le nombre total de services médicaux
   * @returns {Promise<Object>} Objet { total: number }
   */
  getStats: () => apiClient.get("/api/services/stats"),

  
  /**
   * Récupère la liste de tous les services médicaux
   * @returns {Promise<Array>} Tableau des services
   * @example
   * const services = await servicesService.getAll();
   */
  getAll: () => apiClient.get("/api/services"),
  // Récupérer un service par id
  getById: (id) => apiClient.get(`/api/services/${id}`),

  // Créer un service
  create: (data) => apiClient.post("/api/services", data),

  // Modifier un service
  update: (id, data) => apiClient.put(`/api/services/${id}`, data),

  // Supprimer un service
  delete: (id) => apiClient.delete(`/api/services/${id}`),
};

export default servicesService;
