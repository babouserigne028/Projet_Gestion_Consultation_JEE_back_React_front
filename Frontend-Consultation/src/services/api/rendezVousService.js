import apiClient from "./client";

const rendezVousService = {
  /**
   * Prendre un rendez-vous
   * @param {number} patientId - ID du patient
   * @param {number} creneauId - ID du créneau
   * @param {string} motif - Motif de la consultation (optionnel)
   * @returns {Promise<Object>} Rendez-vous créé
   */
  prendreRendezVous: (patientId, creneauId, motif = null) => {
    return apiClient.post("/api/rendezvous", {
      patientId,
      creneauId,
      motif,
    });
  },

  /**
   * Récupérer les statistiques globales des consultations
   * @returns {Promise<Object>} Statistiques des consultations
   */
  getStats: () => {
    return apiClient.get("/api/rendezvous/stats");
  },

  /**
   * Récupérer les statistiques du jour pour un médecin
   * @param {number} medecinId - ID du médecin
   * @returns {Promise<Object>} Statistiques du jour et RDV d'aujourd'hui
   */
  getStatsJourMedecin: (medecinId) => {
    return apiClient.get(`/api/rendezvous/medecin/${medecinId}/stats-du-jour`);
  },

  /**
   * Changer le statut d'un rendez-vous
   * @param {number} rdvId - ID du rendez-vous
   * @param {string} statut - Nouveau statut (CONFIRME, TERMINE, ANNULE)
   * @returns {Promise<Object>} Rendez-vous mis à jour
   */
  changerStatutRDV: (rdvId, statut) => {
    return apiClient.put(`/api/rendezvous/${rdvId}/statut`, { statut });
  },

  /**
   * Récupérer le planning de la semaine pour un médecin
   * @param {number} medecinId - ID du médecin
   * @returns {Promise<Object>} Planning de la semaine
   */
  getPlanningSemaneMedecin: (medecinId) => {
    return apiClient.get(
      `/api/rendezvous/medecin/${medecinId}/planning-semaine`,
    );
  },

  /**
   * Récupérer l'historique des consultations d'un médecin
   * @param {number} medecinId - ID du médecin
   * @param {number} limit - Nombre maximum de consultations à récupérer (défaut: 50)
   * @returns {Promise<Array>} Historique des consultations
   */
  getHistoriqueMedecin: (medecinId, limit = 50) => {
    return apiClient.get(
      `/api/rendezvous/medecin/${medecinId}/historique?limit=${limit}`,
    );
  },

  // ==================== ENDPOINTS PATIENT ====================

  /**
   * Récupérer tous les rendez-vous d'un patient
   * @param {number} patientId - ID du patient
   * @returns {Promise<Array>} Liste des rendez-vous du patient
   */
  getRendezVousPatient: (patientId) => {
    return apiClient.get(`/api/rendezvous/patient/${patientId}`);
  },

  /**
   * Récupérer le prochain rendez-vous d'un patient
   * @param {number} patientId - ID du patient
   * @returns {Promise<Object>} Prochain rendez-vous ou message si aucun
   */
  getProchainRendezVousPatient: (patientId) => {
    return apiClient.get(`/api/rendezvous/patient/${patientId}/prochain`);
  },

  /**
   * Récupérer les statistiques des rendez-vous d'un patient
   * @param {number} patientId - ID du patient
   * @returns {Promise<Object>} Statistiques (rdvAVenir, rdvTermines, rdvAnnules, total)
   */
  getStatsPatient: (patientId) => {
    return apiClient.get(`/api/rendezvous/patient/${patientId}/stats`);
  },

  /**
   * Annuler un rendez-vous (par le patient)
   * @param {number} rdvId - ID du rendez-vous
   * @param {number} patientId - ID du patient
   * @returns {Promise<Object>} Rendez-vous annulé
   */
  annulerRendezVousPatient: (rdvId, patientId) => {
    return apiClient.delete(`/api/rendezvous/${rdvId}/patient/${patientId}`);
  },
};

export default rendezVousService;
