import apiClient from "./client";

const crenauxService = {
  /**
   * Récupérer les créneaux d'un médecin
   * @param {number} medecinId - ID du médecin
   * @param {string} date - Date au format YYYY-MM-DD (optionnel)
   * @param {string} statut - Statut des créneaux (LIBRE, RESERVE, OCCUPE) (optionnel)
   * @returns {Promise<Array>} Liste des créneaux du médecin
   */
  getCrenauxMedecin: (medecinId, date = null, statut = null) => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (statut) params.append("statut", statut);

    const queryString = params.toString();
    const endpoint = `/api/creneaux/medecin/${medecinId}${queryString ? `?${queryString}` : ""}`;

    return apiClient.get(endpoint);
  },

  /**
   * Générer des créneaux pour un médecin
   * @param {number} medecinId - ID du médecin
   * @param {Object} configCreneaux - Configuration des créneaux à générer
   * @returns {Promise<Array>} Liste des créneaux générés
   */
  genererCreneaux: (medecinId, configCreneaux) => {
    return apiClient.post(
      `/api/creneaux/medecin/${medecinId}/generate`,
      configCreneaux,
    );
  },

  /**
   * Changer le statut d'un créneau
   * @param {number} creneauId - ID du créneau
   * @param {string} statut - Nouveau statut (LIBRE, RESERVE, OCCUPE)
   * @returns {Promise<Object>} Créneau mis à jour
   */
  changerStatutCreneau: (creneauId, statut) => {
    return apiClient.put(`/api/creneaux/${creneauId}/statut`, { statut });
  },

  /**
   * Récupérer les créneaux disponibles d'un médecin (avec dates)
   * @param {number} medecinId - ID du médecin
   * @returns {Promise<Array>} Liste des créneaux disponibles avec dates
   */
  getCreneauxDisponibles: (medecinId) => {
    return apiClient.get(`/api/creneaux/medecin/${medecinId}/disponibles`);
  },
};

export default crenauxService;
