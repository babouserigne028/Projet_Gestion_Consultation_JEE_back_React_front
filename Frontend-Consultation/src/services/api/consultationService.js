import apiClient from "./client";

/**
 * Service pour les statistiques globales des consultations (rendez-vous)
 * - total : nombre total de consultations
 * - realisees : nombre de consultations terminées (statut TERMINE)
 * - a_venir : nombre de consultations à venir (statut CONFIRME)
 *
 * Exemple de réponse :
 * {
 *   total: 3200,
 *   realisees: 2500,
 *   a_venir: 500
 * }
 */
const consultationService = {
  /**
   * Récupère les statistiques globales des consultations
   * @returns {Promise<Object>} Statistiques des consultations
   */
  getStats: () => apiClient.get("/api/rendezvous/stats"),
};

export default consultationService;
