import apiClient from "./client";

const patientService = {
  /**
   * Récupérer tous les patients
   * @returns {Promise<Array>} Liste de tous les patients
   */
  getAllPatients: () => {
    return apiClient.get("/api/patients");
  },

  /**
   * Ajouter un nouveau patient
   * @param {Object} patient - Données du patient à ajouter
   * @returns {Promise<Object>} Patient créé
   */
  addPatient: (patient) => {
    return apiClient.post("/api/patients", patient);
  },

  /**
   * Mettre à jour un patient existant
   * @param {number} id - ID du patient à mettre à jour
   * @param {Object} patient - Nouvelles données du patient
   * @returns {Promise<Object>} Patient mis à jour
   */
  updatePatient: (id, patient) => {
    return apiClient.put(`/api/patients/${id}`, patient);
  },

  /**
   * Supprimer un patient
   * @param {number} id - ID du patient à supprimer
   * @returns {Promise<void>} Confirmation de suppression
   */
  deletePatient: (id) => {
    return apiClient.delete(`/api/patients/${id}`);
  },

  /**
   * Récupérer les patients récents d'un médecin
   * @param {number} medecinId - ID du médecin
   * @param {number} limit - Nombre maximum de patients à récupérer (défaut: 20)
   * @returns {Promise<Array>} Liste des patients récents
   */
  getPatientsRecentsMedecin: (medecinId, limit = 20) => {
    return apiClient.get(
      `/api/patients/medecin/${medecinId}/recent?limit=${limit}`,
    );
  },

  /**
   * Récupérer un patient par l'ID de son utilisateur
   * @param {number} utilisateurId - ID de l'utilisateur
   * @returns {Promise<Object>} Données du patient
   */
  getByUtilisateurId: (utilisateurId) => {
    return apiClient.get(`/api/patients/byUtilisateur/${utilisateurId}`);
  },

  /**
   * Récupérer un patient par son ID
   * @param {number} id - ID du patient
   * @returns {Promise<Object>} Données du patient
   */
  getById: (id) => {
    return apiClient.get(`/api/patients/${id}`);
  },
};

export default patientService;
