import apiClient from "./client";

const planningConfigService = {
  /**
   * Ajouter une configuration de planning pour un médecin
   * @param {number} medecinId - ID du médecin
   * @param {Object} config - Configuration du planning
   * @returns {Promise<Object>} Configuration de planning créée
   */
  addPlanningConfig: (medecinId, config) => {
    return apiClient.post(`/api/planning-config/${medecinId}`, config);
  },

  /**
   * Récupérer les plannings d'un médecin sur une plage de dates
   * @param {number} medecinId - ID du médecin
   * @param {string} dateDebut - Date de début (YYYY-MM-DD)
   * @param {string} dateFin - Date de fin (YYYY-MM-DD)
   * @returns {Promise<Array>} Liste des plannings avec créneaux
   */
  getPlanningsByDateRange: (medecinId, dateDebut, dateFin) => {
    return apiClient.post(`/api/planning-config/${medecinId}/plage`, {
      dateDebut,
      dateFin,
    });
  },

  /**
   * Ajouter des configurations de planning pour plusieurs dates
   * @param {number} medecinId - ID du médecin
   * @param {Array<string>} dates - Liste des dates (YYYY-MM-DD)
   * @param {string} heureDebut - Heure de début (HH:mm)
   * @param {string} heureFin - Heure de fin (HH:mm)
   * @returns {Promise<Object>} Résultat de la création multiple
   */
  addPlanningConfigMulti: (medecinId, dates, heureDebut, heureFin) => {
    return apiClient.post(`/api/planning-config/multi/${medecinId}`, {
      dates,
      heureDebut,
      heureFin,
    });
  },
};

export default planningConfigService;
