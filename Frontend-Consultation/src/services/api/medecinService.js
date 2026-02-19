import apiClient from "./client";

const medecinService = {
  /**
   * Récupérer tous les médecins
   * @returns {Promise<Array>} Liste de tous les médecins avec leurs informations détaillées
   */
  getAllMedecins: () => {
    return apiClient.get("/api/medecins");
  },

  /**
   * Inscrire un nouveau médecin
   * @param {Object} medecinData - Données du médecin à inscrire
   * @returns {Promise<Object>} Médecin créé
   */
  registerMedecin: (medecinData) => {
    return apiClient.post("/api/medecins/register", medecinData);
  },

  /**
   * Mettre à jour un médecin existant
   * @param {number} id - ID du médecin à mettre à jour
   * @param {Object} data - Nouvelles données du médecin
   * @returns {Promise<Object>} Médecin mis à jour
   */
  updateMedecin: (id, data) => {
    return apiClient.put(`/api/medecins/${id}`, data);
  },

  /**
   * Supprimer un médecin
   * @param {number} id - ID du médecin à supprimer
   * @returns {Promise<void>} Confirmation de suppression
   */
  deleteMedecin: (id) => {
    return apiClient.delete(`/api/medecins/${id}`);
  },

  /**
   * Récupérer les médecins d'un service
   * @param {number} serviceId - ID du service
   * @returns {Promise<Array>} Liste des médecins du service
   */
  getMedecinsByService: (serviceId) => {
    return apiClient.get(`/api/medecins/service/${serviceId}`);
  },
};

export default medecinService;
